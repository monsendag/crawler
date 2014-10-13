var Class = require('./Class');
var _ = require('underscore');


var PageList = module.exports = Class.extend({

  complete: {},
  seeds: [],
  prev: null,
  filter: null,

  /**
   * @param {Array<URL.Url>} linkArr
   */
  init: function (linkArr) {
    if (_.isArray(linkArr)) {
      linkArr.forEach(function (link) {
        this.add(link);
      }, this);
    }
    return this;
  },

  /**
   *
   * @param {Page} page
   */
  add: function (page) {
    if (!this.hasCrawled(page) && !this.inTodo(page)) {

      this.seeds.push(page);
    }
    return this;
  },

  /**
   * @returns {boolean}
   */
  hasCrawled: function (page) {
    return this.complete.hasOwnProperty(page.toString());
  },

  /**
   * @returns {number}
   */
  numCompleted: function () {
    return _.size(this.complete);
  },

  /**
   *
   * @param {Page} page
   */
  setComplete: function (page) {
    this.complete[page.toString()] = page;
  },
  /**
   *
   * @returns {boolean}
   */
  inTodo: function (page) {
    return _.contains(this.seeds, page);
  },

  getFiltered: function() {
    if(_.isFunction(this.filter)) {
      return _.filter(this.seeds, this.filter);
    }
    return this.seeds;
  },

  /**
   * Returns true if we have more links to crawl
   * @returns {boolean}
   */
  hasNext: function () {
    return this.size() > 0;
  },

  /**
   *
   * @returns {*}
   */
  size: function() {
    return this.getFiltered().length;
  },

  /**
   *
   * @returns {Page}
   */
  getNextRandom: function() {
    var filtered = this.getFiltered();
    var key = Math.floor(Math.random() * filtered.length);
    var page = filtered[key];
    return this.seeds.splice(this.seeds.indexOf(page), 1).pop();
  },

  /**
   * Returns the next link or null if none exists
   * @returns {null|Page}
   */
  getNext: function () {
    if (!this.hasNext()) {
      return null;
    }
    this.prev = this.getNextRandom();
    return this.prev;
  }

});
