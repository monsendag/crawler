var util = require('util'),
  FileHandler = require('./FileHandler'),
  Stream = require('stream'),
  URL = require('url-extra');

/**
 *
 * @type {Function}
 */
var ResponseParser = module.exports = function (worker) {
  Stream.Writable.call(this);
  this.body = "";
  this.worker = worker;
  this.cacheDir = worker.options.cacheDir;

  this._write = function (chunk, encoding, callback) {
    this.body += chunk.toString();
    callback();
  };

  this.on('pipe', function (source) {
    source.on('response', function (response) {
      var cached = FileHandler.getCached(this.cacheDir, source.uri);
      if (cached) {
        this.body = cached;
        source.end();
      }
    }.bind(this));

    this.on('finish', function () {
      FileHandler.savePageFromURL(this.cacheDir, source.uri, this.body);
      this.worker.handlePage(source.uri, this.body);
    });
  });

};

util.inherits(ResponseParser, Stream.Writable);
