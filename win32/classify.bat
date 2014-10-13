@ECHO OFF
doskey crawl.js=%CD%\node.exe ..\bin\classify.js $*
cmd /k %CD%\node.exe ..\bin\classify.js