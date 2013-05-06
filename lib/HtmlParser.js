var Class = require('./Class'),

  _ = require('underscore'),
  cheerio = require('cheerio'),
  URL = require('url-extra');

var HtmlParser = module.exports = Class.extend({
  $: null,

  init: function (body) {
    // create a simple DOM from html body
    this.$ = cheerio.load(body);
  },

  /**
   * @param documentURI
   * @returns {Array<URL.Url>}
   */
  getLinks: function (documentURI) {
    var links = [];
    var h = 'href', r = 'rel';
    var hasHref, noFollow;
    var canonical, uri;
    // extract url from all links
    this.$('a[href]').each(function (i, el) {
      // check if link has a href attribute
      // check for rel="nofollow"
      noFollow = r in el.attribs && el.attribs.rel.match('/nofollow/gi');

      // if nofollow, break
      if (!noFollow) {
        return;
      }

      // canonicalize and parse href
      canonical = URL.resolve(documentURI.href, el.attribs.href);
      uri = URL.parse(canonical);

      // make sure we're sticking to http
      if (!_.contains(['http:', 'https:'], uri.protocol)) {
        return;
      }

      // append to map
      links.push(uri);
    }.bind(this));

    return links;
  },

  /**
   *
   * @param documentURI
   * @returns {*}
   */
  getPolicy: function (documentURI) {
    var metaRobots = this.$('meta[name=robots]');
    if (metaRobots.length > 0 && metaRobots[0].attribs.content) {
      return metaRobots[0].attribs.content;
    }
  }
});