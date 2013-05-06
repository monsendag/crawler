var Class = require('./Class'),
  fs = require('fs-extra'),
  Path = require('path');

var FileHandler = module.exports = Class.extend({
  dataDir: null,

  init: function (dataDir) {
    this.dataDir = dataDir;
  },

  /**
   *
   * @param uri
   * @param content
   */
  savePage: function (uri, content) {
    // if path has trailing slash, append index.html

    var path = this.getPathFromUri(uri);
    // make sure the recursive directory is created in file system
    fs.mkdirs(Path.dirname(path), function (err) {
      if (err) {
        console.error(err);
      }

      // write the page to file system
      fs.writeFile(path, content, function (err) {
        if (err) {
          console.error(err);
        }
      });
    });

  },

  getPathFromUri: function (uri) {
    var isDir = (uri.path.charAt(uri.path.length - 1) === "/");
    var path = !isDir ? uri.path + '.html' : uri.path + 'index.html';
    return Path.join(process.cwd(), this.dataDir, uri.hostname, path);
  }

});