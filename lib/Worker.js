var
  Class = require('./Class'),
  HtmlParser = require('./HtmlParser'),
  PageList = require('./PageList');

  _ = require('underscore'),
  URL = require('url-extra'),
  moment = require('moment'),
  request = require('request'),
  Path = require('path'),
  Robots = require('robots'),
  util = require('util');

var Host = module.exports = Class.extend({
  hostname: null,
  options: {},
  running: true,

  init: function (crawler, url) {
    _.bindAll(this);
    this.crawler = crawler;
    this.options = crawler.options;

    this.url = url;
    this.pageList = new PageList([url]);

    // clone url and set path to /robots.txt
    var robotsURL = _.extend({}, url, {pathname: "/robots.txt"}).format();

    // request page policy, then continue
    this.crawler.emit('request:robots', robotsURL);
    new Robots.RobotsParser(
      robotsURL,
      this.options.headers['user-Agent'],
      function (parser, success) {
        if (!success) {
          this.crawler.emit('warning', 'Could not fetch robots.txt. Continuing crawl with default policy parameters.');
        }
        this.policy = parser;
        this.crawler.emit('receive:robots', parser);
        this.continue();

      }.bind(this)
    );

    // limit calls to crawl() to one every [politeness] second
    this.continue = _.debounce(this.crawl, this.options.politeness * 1000);
  },

  /**
   * Dummy function
   */
  continue: function () {
    throw new Error('Called dummy function.')
  },

  /**
   * Continues the crawl based on links stored in this.pageList
   * @returns {*}
   */
  crawl: function () {
    if(!this.running) {
      return;
    }

    if (!this.pageList.hasNext()) {
      return this.stop(util.format('%s: no more pages found at host, stopping crawl.', this.url.hostname));
    }

    if (this.pageList.numCompleted() >= this.options.maxpages) {
      return this.stop(util.format('%s: reached max pages for host, stopping crawl.', this.url.hostname));
    }

    var next = this.pageList.getNext();
    this.crawler.emit('request:page', next);
    request(_.extend({'url': next}, this.options), this.responseHandler);
  },

  /**
   *
   * @param error
   * @param response
   */
  responseHandler: function (error, response) {

    if(!this.running) {
      return;
    }

    if (error) {
      this.crawler.emit('error', error);
      return;
    }

    if (response.statusCode == 200) {
      var url = response.request.uri;
      this.pageList.setComplete(url);

      this.crawler.emit('receive:page', response);

      var htmlParser = new HtmlParser(response.body);
      var links = htmlParser.getLinks(url);

      // filter out links we dont want to follow
      links.forEach(function (link) {
        if (this.options.limithost && !link.equalsHost(this.url) || // limit host
          this.options.limitpath && !link.inPathOf(this.url) ||  // limit path
          !this.policy.canFetchSync('*', link.pathname)) {    // adhere to policy
          return;
        }
        this.pageList.add(link);
      }, this);

      this.continue();
    }
  },

  /**
   *
   * @param msg
   */
  stop: function (msg) {
    this.continue = function () {};
    this.running = false;
    this.crawler.emit('end', msg);
  }

});
