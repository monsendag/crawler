var Class = require('./Class'),

  URL = require('url-extra'),
  Cheerio = require('cheerio'),
  _ = require('underscore');


var pages = {};


var Page = module.exports = Class.extend({

  /**
   *
   * @param {Url|string} url
   */
  init: function (url) {
    this.url = URL.parse(url);
  },

  toString: function () {
    return this.url.format();
  },

  /**
   *
   * @param {string|null} body
   */
  setBody: function (body) {
    this.$ = body === null ? null : Cheerio.load(body);
    return this;
  },

  /**
   *
   * @returns {Array}
   */
  getOutLinks: function () {
    var links = [];
    var noFollow;
    var canonical, url;
    var r = 'rel', protocols = ['http:', 'https:'];
    // extract url from all links
    this.$('a[href]').each(function (i, el) {
      // canonicalize and parse href
      canonical = URL.resolve(this.toString(), el.attribs.href);
      url = URL.parse(canonical);

      // make sure we're sticking to http
      if (!_.contains(protocols, url.protocol)) {
        return;
      }
      // check for rel="nofollow"
      noFollow = r in el.attribs && el.attribs.rel.match('/nofollow/gi');
      // if nofollow, break
      if (noFollow) {
        return;
      }
      // append to map
      links.push(url);
    }.bind(this));
    return links;
  },

  getCorpus: function() {
    // remove script tags
    this.$('script').remove();
    // get textcontent, lowercase, remove irrelevant symbols
    var corpus = this.$.root().text().toLowerCase().replace(/["'.,:\|\(\)0-9»«\/\n]/g, '');
    // strip whitespace
    return corpus.replace(/[\s"']+/g, ' ');
  },

  getPathName: function() {
    return this.url.pathname;
  }

});

/**
 *
 * @param {string} url
 * @param {string} body
 * @returns {Page}
 */
Page.get = function (url) {
  var str = url.format();
  if (!pages.hasOwnProperty(str)) {
    pages[str] = new Page(url);
  }
  return pages[str];
};