#!/usr/bin/env node
var program = require('commander');
var _ = require('underscore');

program
  .version('0.0.1')
  .usage('[options] <seed-url>')
  .option('-p, --politeness <n>', 'The politeness of the crawler', parseInt, 10)
  .option('-m, --maxpages <n>', 'The maximum page limit for the crawler', parseInt, 20)
  .parse(process.argv);


if(!program.args.length > 0) {
  console.log(program.help());
  return;
}

var requirejs = require('requirejs');

requirejs.config({
  baseUrl:  'lib',
  nodeRequire: require
});

requirejs(['Utility'], function(Utility) {
  Utility(global);
  requirejs(['Crawler'], function (Crawler) {

    var params = _.pick(program, 'politeness', 'maxpages');
    var url = _.first(program.args);

    var crawler = new Crawler(params);

    crawler.crawl(url);
  })
});