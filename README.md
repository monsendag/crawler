fireleg
=======

A node.js based web crawler.

This crawler is given as an assigment in the RMIT course [COSC1165 Intelligent Web Systems](http://www.rmit.com/courses/004170)

* Polite: Supports robots.txt and meta/rel markup. Won't flood servers.
* Robust: Handles multiple crawler traps.
* Selective: Limit to a certain host or subpath on that host.

### Installation

Note: Will deploy to npm when more mature.


### Usage 

**fireleg [options] <seed-url>**

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -p, --politeness <seconds>  The politeness of the crawler
    -m, --maxpages <pages>      The maximum page limit for the crawler
    -m, --limithost <boolean>   Whether to limit crawling to the same hostname