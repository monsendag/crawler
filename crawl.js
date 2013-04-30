#!/usr/bin/env node --debug
var program = require('commander');
var _ = require('underscore');
var requirejs = require('requirejs');

requirejs.config({
  baseUrl:  'lib',
  nodeRequire: require
});

program
  .version('0.0.1')
  .usage('[options] <seed-url>')
  .option('-p, --politeness <seconds>', 'The politeness of the crawler', parseInt)
  .option('-m, --maxpages <pages>', 'The maximum page limit for the crawler', parseInt)
  .option('-m, --limithost <boolean>', 'Whether to limit crawling to the same hostname', Boolean)
  .parse(process.argv);

if(!program.args.length > 0) {
  program.help();
}

requirejs(['Utility'], function(Utility) {
  Utility(global);

  requirejs(['Crawler'], function (Crawler) {

    var params = _.pick(program, 'politeness', 'maxpages', 'limithost');
    var seed = _.first(program.args);

    new Crawler(params).crawl(seed);
  })
});