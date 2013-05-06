#!/usr/bin/env node --debug
var program = require('commander');
var _ = require('underscore'),
  moment = require('moment');

var info = require('./package.json');

program
  .version(info.version)
  .usage('[options] <seed-url>')
  .option('-v, --verbose', 'Whether to print output or not')
  .option('-p, --politeness <seconds>', 'The politeness of the crawler', parseInt, void(0))
  .option('-m, --maxpages <pages>', 'The maximum page limit for the crawler', parseInt, void(0))
  .option('-m, --limithost', 'Whether to limit crawling to the same hostname')
  .option('-m, --limitpath', 'Whether to limit crawling to the path')
  .parse(process.argv);


if (!program.args.length > 0) {
  program.help();
}

var params = _.pick(program, 'politeness', 'maxpages', 'limithost', 'limitpath');
var seedURL = _.first(program.args);

var crawler = new (require('./lib/Crawler'))(params);
var fileHandler = new (require('./lib/FileHandler'))(crawler.options.dataDir);


crawler.crawl(seedURL);
