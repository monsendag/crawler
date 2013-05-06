/**
 * default politeness: 10 seconds
 * Default maxpages: 20 pages
 *
 *
 * Track pages to be visited
 * Track pages already visited
 * Support politeness protocol, robots.txt, robots meta tag
 *
 */
var
  Class = require('./Class'),
  Worker = require('./Worker'),

  _ = require('underscore'),
  URL = require('url-extra'),
  util = require('util'),
  moment = require('moment');
/**
 * Crawler class
 * Stores configuration and
 * @type {Crawler}
 */
var Crawler = module.exports = Class.extend({
  // default options
  options: {
    verbose: true, // whether to print output
    dataDir: "saved-pages", // folder for storing all crawled pages
    politeness: 2, // the number of seconds between requests per host
    maxpages: 20, // the maximum pages to crawl per host
    limithost: true, // limit crawling to given hostname}
    limitpath: false, // limit crawling to subpath
    followRedirect: true, // whether to follow redirects
    timeout: 10000, // timeout in milliseconds
    headers: {  // request headers
      "user-Agent": "Mozilla/5.0 (compatible; fireleg/0.1; +http://monsendag.github.io/fireleg)",
      // attempt to make the web server limit what he send us
      Accept: "text/plain, text/html"
    }
  },

  // map of host workers
  hosts: {},

  /**
   * Initialize and set options
   * @param {object} options
   */
  init: function (options) {
    _.extend(this.options, options);
    _.bindAll(this);

    process.on('SIGINT', function() {
      this.stopAll();
    }.bind(this));

    if(this.options.verbose) {
      this.on('start', function(url) {
        this.Log('starting crawl of %s with the following options:', url.format());
        this.LL(this.options);
      });

      this.on('error', function(msg) {
        this.Log('msg');
      });

      this.on('warning', function(msg) {
        this.Log('msg');
      });

      this.on('request:page', function(url) {
        this.Log("%s fetching %s", moment().format("YYYY-MM-DD HH:mm:ss"), url.format());
      });

      this.on('receive:page', function(response) {
        this.Log("%s received %s", moment().format("YYYY-MM-DD HH:mm:ss"), response.request.uri.href);
      });
    }
  },

  /**
   * Crawls the given seed URL
   * @param {string} seedURL
   */
  crawl: function (seedURL) {
    var url = URL.parse(seedURL);
    if (!url.host || !url.pathname) {
      Log('Error: Invalid seed-url.');
      return;
    }

    this.hosts[url.host] = new Worker(this, url);
  },

  stopAll: function() {
    _.each(this.hosts, function(worker) {
      worker.stop();
    });
  },

  LL: function (obj) {
    this.Log(util.inspect(obj));
  },

  Log: function () {
    arguments[0] = 'fireleg: ' + arguments[0];
    console.log.apply(console, arguments);
  }
});