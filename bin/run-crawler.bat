@ECHO OFF
doskey crawl=%CD%\bin\node.exe crawl.js $*
echo " usage: crawl [--politeness <seconds>] [--maxpages <pages>] seed_url"