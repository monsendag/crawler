var Crawler = require('./Crawler'),
  URL = require('url-extra'),
  arff = require('node-arff'),
  cheerio = require('cheerio');

var crawler = new Crawler({
  limitpath: true,
  maxpages: 20
});

var pages = [];

var mobileRoot = URL.parse('http://www.theage.com.au/digital-life/mobiles');


var mobile, $, pageData;
crawler.on('receive:page', function (response) {
  mobile = response.request.uri.inPathOf(mobileRoot);
  $ = cheerio.load(response.body);
  pageData = {
    title: $('title').html(),
    classification: mobile ? "Mobile" : "Not Mobile"
  };
  pages.push(pageData);
});

crawler.on('end', function () {

  console.dir(pages);
  /*arfftools.generate(pages, Path.join(process.cwd(), 'pages.arff'), function () {

    // run java classifier

    child = exec('cat *.js bad_file | wc -l',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
  });
  */

});

crawler.crawl('http://www.theage.com.au/digital-life/mobiles');
