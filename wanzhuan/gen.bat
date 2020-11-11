 node version_generator.js -v 2.4.1 -u http://res.cdn.wanlege.com/dragon/remote-assets/ -s build/jsb-default/ -d assets/
 
set ObjPath=build\jsb-default
set DestPath=remote-assets
set zip7=C:\Program Files\7-Zip\7z.exe

rd /s /q  "%DestPath%"
del remote-assets.zip
md "%DestPath%\res"
md "%DestPath%\src"
xcopy /e /c /y "%ObjPath%\res" "%DestPath%\res"
xcopy /e /c /y "%ObjPath%\src" "%DestPath%\src"
copy /y "assets\version.manifest" "%DestPath%"
copy /y "assets\project.manifest" "%DestPath%"
"%zip7%"  a -tzip remote-assets.zip "%DestPath%\*"
pause