define(['underscore', 'cheerio', 'url'], function (_, cheerio, URL) {

  var HtmlParser = Class.extend({

    $: null,

    init: function () {
    },

    loadBody: function (body) {
      // create a simple DOM from html body
      this.$ = cheerio.load(body);
    },

    getLocalLinks: function (documentURI) {
      return this.getLinks(documentURI, true, false);
    },

    getExternalLinks: function (documentURI) {
      return this.getLinks(documentURI, false, true);
    },

    getLinks: function (documentURI, localOnly, externalOnly) {

      var links = {};

      var h = 'href', r = 'rel';
      var hasHref, noFollow;

      var canonical, uri;
      // extract url from all links and save only the ones pointing to the same hostname
      this.$('a').each(_.bind(function (i, el) {
        // check if link has a href attribute
        hasHref = h in el.attribs;
        // check for rel="nofollow"
        noFollow = r in el.attribs && el.attribs.rel.match('/nofollow/gi');

        // if no href or nofollow, break
        if (!hasHref || noFollow) {
          return;
        }

        // convert link to canonical version
        canonical = URL.resolve(documentURI.href, el.attribs.href);
        uri = URL.parse(canonical);

        // if limiting hosts and hostnames differ, break
        if (localOnly && uri.hostname !== documentURI.hostname) {
          return;
        }

        // if limiting hosts and hostnames differ, break
        if (externalOnly && uri.hostname === documentURI.hostname) {
          return;
        }

        links[uri.pathname] = uri;
      }, this));

      return links;
    },

    getPolicy: function (documentURI) {
      var metaRobots = this.$('meta[name=robots]');
      if (metaRobots.length > 0 && metaRobots[0].attribs.content) {
        return metaRobots[0].attribs.content;
      }
    }

  });


  return new HtmlParser();
});