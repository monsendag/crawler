/**
 * default politeness: 10 seconds
 * Default maxpages: 20 pages
 *
 *
 * Track pages to be visited
 * Track pages already visited
 * Support politeness protocol, robots.txt, robots meta tag
 *
 *
 */
define(['fs-extra', 'path', 'underscore', 'url', 'request', 'moment', 'cheerio', 'Host'], function (fs, Path, _, URL, request, moment, cheerio, Host) {


  var Crawler = Class.extend({
    options: {
      dataDir: "saved-pages", // folder for storing all crawled pages
      politeness: 2, // the number of seconds between requests per host
      maxpages: 20, // the maximum pages to crawl per host
      limithost: true, // limit crawling to given hostname}
      followRedirect: true, // whether to follow redirects
      timeout: 10000, // timeout in milliseconds
      headers: {  // request headers
        // set our user agent
        "user-Agent": "Mozilla/5.0 (compatible; dagbot/0.1; +http://github.com/monsendag/crawler)",
        //
        From: "dagbot(at)dag.im",
        // attempt to make the web server limit what he send us
        Accept: "text/plain, text/html"
      }
    },

    hosts: {},

    init: function (options) {
      _.extend(this.options, options);
      _.bindAll(this);
    },

    crawl: function (seed) {
      var uri = URL.parse(seed);

      if (!uri.host || !uri.pathname) {
        Log('Error: Invalid seed-url.');
        return;
      }
      this.hosts[uri.host] = new Host(uri, this.options);
    }
  });

  return Crawler;
});