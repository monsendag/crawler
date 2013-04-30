define([], function() {

  var PageList = Class.extend({

    complete: {},
    todo: {},

    add: function(uri) {
      if(!(uri.path in complete) {

      }
    },

    /***
     * track pages to be visited
     * track pages already visited
     */

    hasFinished: function() {

    },

    getNext: function() {
      var key = Object.keys(this.todo)[0];
      var uri = this.todo[key];
      delete this.todo[key];
    }



  });

  return PageList;
});