var Class = require('./Class');
var _ = require('underscore');


var PageList = module.exports = Class.extend({

  complete: {},
  todo: {},

  /**
   * @param {Array<URL.Url>} linkArr
   */
  init: function (linkArr) {
    if (_.isArray(linkArr)) {
      linkArr.forEach(function (link) {
        this.add(link);
      }, this);
    }
  },

  /**
   *
   * @param {URL.Url} link
   */
  add: function (link) {
    var canAdd = !this.hasCrawled(link) && !this.inTodo(link);
    if (canAdd) {
      this.todo[link.pathname] = link;
    }
    return canAdd;
  },

  /**
   * @returns {boolean}
   */
  hasCrawled: function (link) {
    return this.complete.hasOwnProperty(link.pathname);
  },

  /**
   * @returns {number}
   */
  numCompleted: function () {
    return _.size(this.complete);
  },

  /**
   *
   * @param {URL.Url} link
   */
  setComplete: function (link) {
    this.complete[link.pathname] = link;
  },
  /**
   *
   * @returns {boolean}
   */
  inTodo: function (link) {
    return this.todo.hasOwnProperty(link.pathname);
  },

  /**
   * Returns true if we have more links to crawl
   * @returns {boolean}
   */
  hasNext: function () {
    return !_.isEmpty(this.todo);
  },

  /**
   * Returns the next link or null if none exists
   * @returns {null|URL.Url}
   */
  getNext: function () {
    if (!this.hasNext()) {
      return null;
    }
    var key = Object.keys(this.todo)[0];
    var link = this.todo[key];
    delete this.todo[key];
    return link;
  }

});
