#!/usr/bin/env node --debug
var _ = require('underscore'),
  moment = require('moment'),
  program = require('commander');
  Crawler = require('../lib/Crawler'),
  info = require('../package.json');


var CLI = function (program) {
  this.requiredargs = 0;

  this.program = program;
  this.program
    .version(info.version)
    .usage('[options] <seed-url>')
    .option('-q, --quiet', 'Whether to crawl silently or not.')
    .option('-p, --politeness <seconds>', 'The politeness of the crawler', parseFloat, void(0))
    .option('-m, --maxpages <pages>', 'The maximum page limit for the crawler', parseInt, void(0))
    .option('-m, --limithost', 'Whether to limit crawling to the same hostname')
    .option('-m, --limitpath', 'Whether to limit crawling to the path')
};

CLI.prototype.start = function () {
  this.program.parse(process.argv);
  if (this.program.args.length < this.requiredargs) {
    return this.program.help();
  }
  return true;
};

CLI.prototype.getArgs = function() {
  return this.program.args;
};

CLI.prototype.getParams = function() {
 return _.pick(this.program, 'quiet', 'politeness', 'maxpages', 'limithost', 'limitpath')
};

module.exports = new CLI(program);

