define(['fs-extra', 'path'], function (fs, Path) {

  var FileHandler = Class.extend({
    dataDir: null,

    init: function (dataDir) {
      this.dataDir = dataDir;
    },
    savePage: function (uri, content) {
      // if path has trailing slash, append index.html
      var isDir = (uri.path.charAt(uri.path.length - 1) === "/");
      uri.path = !isDir ? uri.path + '.html' : uri.path + 'index.html';

      var path = Path.join(process.cwd(), this.dataDir, uri.hostname, uri.path);

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

    }

  });

  return FileHandler;

});