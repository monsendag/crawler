var fs = require('fs-extra'),
  Path = require('path');

var FileHandler = module.exports = {

  /**
   *
   * @param cacheDir
   * @param url
   * @param content
   */
  savePageFromURL: function (cacheDir, url, content) {
    // if path has trailing slash, append index.html

    var path = this.getPathFromURL(cacheDir, url);
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



  /**
   * If a file is in cache, return it, otherwise null.
   * @param cacheDir
   * @param url
   * @returns {string|null}
   */
  getCached: function (cacheDir, url) {
    var file = this.getPathFromURL(cacheDir, url);
    return fs.existsSync(file) ? fs.readFileSync(file) : null;
  },



  /**
   * Convert an URL to a file system path.
   * If the URL ends with a /, we append index.html to the path.
   * @param cacheDir
   * @param url
   * @returns {string}
   */
  getPathFromURL: function (cacheDir, url) {
    var isDir = (url.path.charAt(url.path.length - 1) === "/");
    var path = !isDir ? url.path + '.html' : url.path + 'index.html';
    return Path.join(process.cwd(), cacheDir, url.hostname, path);
  }

};