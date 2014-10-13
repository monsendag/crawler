@ECHO OFF
doskey crawl.js=%CD%\node.exe ..\bin\crawl.js $*
cmd /k %CD%\node.exe ..\bin\crawl.js