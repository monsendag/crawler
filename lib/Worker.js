var
  Class = require('./Class'),
  PageList = require('./PageList'),
  ResponseParser = require('./ResponseParser'),
  Page = require('./Page'),
  FileHandler = require('./FileHandler');

  _ = require('underscore'),
  URL = require('url-extra'),
  moment = require('moment'),
  request = require('request'),
  Robots = require('robots'),
  util = require('util');

var Host = module.exports = Class.extend({
    wait: false,
    hostname: null,
    options: {},
    running: true,
    debounced: null,

    init: function (crawler, url) {
      _.bindAll(this);
      this.crawler = crawler;
      this.options = crawler.options;

      this.url = url;
      this.pageList = new PageList().add(Page.get(url));

      this.debounced = _.debounce(this.crawl, this.options.politeness * 1000);

      this.crawler.emit('start:worker', this);

      // clone url and set path to /robots.txt
      var robotsURL = _.extend({}, url, {pathname: "/robots.txt"});
      // request page policy, then continue
      this.crawler.emit('request:robots', robotsURL);
      new Robots.RobotsParser(robotsURL.format(), this.options.headers['user-Agent'],
        function (parser, success) {

          if (!success) {
            this.crawler.emit('warning', 'Could not fetch robots.txt. Continuing crawl with default policy parameters.');
          }
          else {
            this.crawler.emit('receive:robots', robotsURL, parser);
          }
          this.policy = parser;
          this.continue();
        }.bind(this)
      );

    },

    /**
     * Calls debounced function if last
     */
    continue: function () {
      this.wait ? this.debounced() : this.crawl();
      // limit calls to crawl() to one every [politeness] second
    },

    /**
     * Continues the crawl based on links stored in this.pageList
     * @returns {*}
     */
    crawl: function () {
      if (!this.running) {
        return;
      }

      if (!this.pageList.hasNext()) {
        return this.stop(util.format('%s: no more pages found, stopping.', this.url.hostname));
      }

      if (this.pageList.numCompleted() >= this.options.maxpages) {
        return this.stop(util.format('%s: reached max pages, stopping.', this.url.hostname));
      }
      var nextPage = this.pageList.getNext();
      this.crawler.emit('request:page', nextPage, this);

      var cached = FileHandler.getCached(this.options.cacheDir, nextPage.url);
      this.wait = !!cached;
      if (cached) {
        this.handlePage(nextPage.url, cached);
      }
      else {
        request(_.extend({'uri': nextPage.url}, this.options)).pipe(new ResponseParser(this));
      }

    },

    /**
     *
     * @param url
     * @param body
     */
    handlePage: function (url, body) {
      if (!this.running) {
        return;
      }
      var page = Page.get(url).setBody(body);

      this.pageList.setComplete(page);
      this.crawler.emit('receive:page', page, this);


      // add relevant links to page queue
      page.getOutLinks().forEach(function (link) {
        if (!this.options.limithost || link.equalsHost(this.url) && // limit host
          !this.options.limitpath || link.inPathOf(this.url) &&  // limit path
          this.policy.canFetchSync('*', link.pathname)) { // adhere to policy
          this.pageList.add(Page.get(link));
        }
      }, this);

      this.continue();
    },

    /**
     *
     * @param msg
     */
    stop: function (msg) {
      this.continue = function () {
      };
      this.running = false;
      this.crawler.emit('end', msg);
    }
  })
  ;