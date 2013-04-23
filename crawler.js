var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Usage: crawl [-politeness <seconds>] [-maxpages <pages>] seed_url \n $ ", function(answer) {

  rl.close();
});