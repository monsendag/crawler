@ECHO OFF

doskey crawl.js=%CD%\bin\node.exe crawl.js $*
%CD%\bin\node.exe crawl.js