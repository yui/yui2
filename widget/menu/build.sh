#!/bin/sh

# Build the JavaScript, images and CSS

ant

ant deploy

# Create example files

php -d 'open_basedir=' examples/index.html prod  > ../../examples/menu/index.html
php -d 'open_basedir=' examples/example01.html prod  > ../../examples/menu/example01.html
php -d 'open_basedir=' examples/example02.html prod  > ../../examples/menu/example02.html
php -d 'open_basedir=' examples/example03.html prod  > ../../examples/menu/example03.html
php -d 'open_basedir=' examples/example04.html prod  > ../../examples/menu/example04.html
php -d 'open_basedir=' examples/example05.html prod  > ../../examples/menu/example05.html
php -d 'open_basedir=' examples/example06.html prod  > ../../examples/menu/example06.html
php -d 'open_basedir=' examples/example07.html prod  > ../../examples/menu/example07.html
php -d 'open_basedir=' examples/example08.html prod  > ../../examples/menu/example08.html
php -d 'open_basedir=' examples/example09.html prod  > ../../examples/menu/example09.html
php -d 'open_basedir=' examples/example10.html prod  > ../../examples/menu/example10.html
php -d 'open_basedir=' examples/example11.html prod  > ../../examples/menu/example11.html
php -d 'open_basedir=' examples/example12.html prod  > ../../examples/menu/example12.html
php -d 'open_basedir=' examples/applicationmenubar.html prod  > ../../examples/menu/applicationmenubar.html
php -d 'open_basedir=' examples/contextmenu.html prod  > ../../examples/menu/contextmenu.html
php -d 'open_basedir=' examples/tablecontextmenu.html prod  > ../../examples/menu/tablecontextmenu.html
php -d 'open_basedir=' examples/treeviewcontextmenu.html prod  > ../../examples/menu/treeviewcontextmenu.html
php -d 'open_basedir=' examples/programsmenu.html prod  > ../../examples/menu/programsmenu.html
php -d 'open_basedir=' examples/leftnavfromjs.html prod  > ../../examples/menu/leftnavfromjs.html
php -d 'open_basedir=' examples/leftnavfrommarkup.html prod  > ../../examples/menu/leftnavfrommarkup.html
php -d 'open_basedir=' examples/leftnavfromjswithanim.html prod  > ../../examples/menu/leftnavfromjswithanim.html
php -d 'open_basedir=' examples/leftnavfrommarkupwithanim.html prod  > ../../examples/menu/leftnavfrommarkupwithanim.html
php -d 'open_basedir=' examples/topnavfromjs.html prod  > ../../examples/menu/topnavfromjs.html
php -d 'open_basedir=' examples/topnavfrommarkup.html prod  > ../../examples/menu/topnavfrommarkup.html
php -d 'open_basedir=' examples/topnavfromjswithanim.html prod  > ../../examples/menu/topnavfromjswithanim.html
php -d 'open_basedir=' examples/topnavfrommarkupwithanim.html prod  > ../../examples/menu/topnavfrommarkupwithanim.html


# Copy the image assets for the example files into the build directories

cp examples/img/*.gif ../../examples/menu/img
cp examples/img/*.jpg ../../examples/menu/img
cp examples/img/*.png ../../examples/menu/img
