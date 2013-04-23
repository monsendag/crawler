/**
 * default politeness: 10 seconds
 * Default maxpages: 20 pages
 *
 *
 * Track pages to be visited
 * Track pages already visited
 * Support politeness protocol, robots.txt, robots meta tag
 *
 *
 */
define(['fs-extra', 'path', 'underscore', 'url', 'request','moment', 'cheerio'], function (fs, Path, _, URL, request, moment, cheerio) {

  var dataDir = "data/crawled";

  var Crawler = Class.extend({
    counter: 0,
    init: function (params) {
      this.params = params;
      _.bindAll(this);
    },
    crawl: function (address) {
      address = address.indexOf('http') >= 0 || 'http://' + address;
      console.log("Crawling %s with politeness %d and maximum page limit %d", address, this.params.politeness, this.params.maxpages);

      var url = URL.parse(address);

      this.counter++;
      request(address, this.requestHandler);

    },
    requestHandler: function (error, response, body) {
      if (error) {
        console.error(error);
      }
      if (response.statusCode == 200) {

        var uri = response.request.uri;

        var path = Path.join(process.cwd(), dataDir, uri.hostname);

        fs.mkdirs(path, function (err) {
          if (err) {
            console.error(err);
          }
        });

        console.log("%d - %s crawled page: %s", this.counter, moment().format("YYYY-MM-DD HH:mm:ss"), uri.href);

        fs.writeFile(Path.join(path,'index.html'), response.body, function(err) {
          if(err) {
            console.log(err);
          }
        });

        this.findLinks(response);

      }

    },
    findLinks: function(response) {
      var $ = cheerio.load(response.body);

      // Exactly the same code that we used in the browser before:
      $('a').each(_.bind(function(i,element) {
        if(this.counter >= this.params.maxpages) return false;

        this.crawl(element.attribs.href);
      },this));
    }

  });

  return Crawler;
});