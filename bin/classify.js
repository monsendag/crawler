#!/usr/bin/env node --debug

var CLI = require('../lib/CLI'),
    Classifier = require('../lib/Classifier');

CLI.start();

var classifier = new Classifier(CLI.getParams());
var seedURL = CLI.getArgs().length > 0 ? CLI.getArgs().pop() : 'http://www.theage.com.au/digital-life/mobiles';
classifier.classifyMobile(seedURL);
