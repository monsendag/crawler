#!/usr/bin/env node --debug

var CLI = require('../lib/CLI');

CLI.requiredargs = 1;

CLI.start();

var crawler = new Crawler(CLI.getParams());
crawler.crawl(CLI.getArgs().pop());
