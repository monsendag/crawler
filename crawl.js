#!/usr/bin/env node
var program = require('commander');
program
  .version('0.0.1')
  .usage('[options] <seed_url>')
  .option('-p, --politeness <n>', 'The politeness of the crawler', parseInt)
  .option('-m, --maxpages <n>', 'The maximum pages of the crawler', parseInt)
  .parse(process.argv);

var politeness = program.politeness || 30;
var maxpages = program.maxpages || 10;

if(!program.args) console.error('Missing starting url.');

console.log("Crawling %s with politeness %d and maximum page limit %d", program.args, politeness, maxpages);