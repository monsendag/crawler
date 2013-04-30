define(['Class', 'util'], function(Class, util) {

  function Utility (global) {
    global.Class = Class;
    global.Log = Log;
    global.LL = LL;

  }

  function LL(obj) {
    Log(util.inspect(obj));
  }

  function Log() {
    arguments[0] = 'Crawler: '+arguments[0];

    console.log.apply(console, arguments);
  }

  return Utility;

});