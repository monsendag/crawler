define(['underscore',
        'url',
        'moment',
        'request',
        'path',
        'HtmlParser',
        'PolicyParser',
        'FileHandler'], function (_, URL, moment, request, Path, HtmlParser, PolicyParser, FileHandler) {

  var Host = Class.extend({
    hostname: null,
    policyParser: null,
    fileHandler: null,
    options: {},

    counter: 0,
    complete: {},
    todo: {},

    init: function (uri, options) {
      _.bindAll(this);
      _.extend(this.options, options);

      this.hostname = uri.hostname;
      this.todo[uri.pathname] = uri;

      this.policyParser = new PolicyParser();
      this.fileHandler = new FileHandler(options.dataDir);

      this.fetchRobotsTxt(uri);

      this.continue();
      this.continue = _.debounce(this.crawl, options.politeness * 1000);
    },

    /**
     * Dummy function. Works as a front for crawl, to respect host policy
     */
    continue: function () {
      this.crawl.apply(this, arguments);
    },

    fetchRobotsTxt: function (uri) {
      uri = _.extend({}, uri, {path: "/robots.txt"});
      request(_.extend({'uri': uri}, this.options), _.bind(function (error, response) {
        if (error) {
          return;
        }
        this.policyParser.parseRobotsTxt(response.body);
      },this));
    },

    crawl: function () {

      var empty = _.size(this.todo) === 0;
      var maxReached = ++this.counter >= this.options.maxpages;

      if (empty) {
        Log('%s: no more pages found at host, stopping crawl.', this.hostname);
      }

      if (maxReached) {
        Log('%s: reached max pages for host, stopping crawl.', this.hostname);
      }

      if (empty || maxReached) {
        this.stop();
        return;
      }

      var key = Object.keys(this.todo)[0];
      var uri = this.todo[key];
      delete this.todo[key];

      Log("%s Crawling %s", moment().format("YYYY-MM-DD HH:mm:ss"), uri.format());


      this.complete[uri.pathname] = uri;

      request(_.extend({'uri': uri}, this.options), this.responseHandler);
    },

    responseHandler: function (error, response) {

      if (error) {
        Log(error);
        return;
      }

      if (response.statusCode == 200) {
        Log("%s Got %d. %s", moment().format("YYYY-MM-DD HH:mm:ss"), this.counter, response.request.uri.href);

        this.fileHandler.savePage(response.request.uri, response.body);

        HtmlParser.load(response.body, response.request.uri);
        var policy = HtmlParser.getPolicy(response.request.uri);
        var links = HtmlParser.getLocalLinks(response.request.uri);

        this.continue();
      }
    },

    stop: function () {
      this.continue = function () {
      };
    }

  });

  return Host;
});