#!/bin/sh

# Build the JavaScript, images and CSS

ant deploy

# Create example files

php examples/index.html > ../../examples/menu/index.html
php examples/example01.html > ../../examples/menu/example01.html
php examples/example02.html > ../../examples/menu/example02.html
php examples/example03.html > ../../examples/menu/example03.html
php examples/example04.html > ../../examples/menu/example04.html
php examples/example05.html > ../../examples/menu/example05.html
php examples/example06.html > ../../examples/menu/example06.html
php examples/example07.html > ../../examples/menu/example07.html
php examples/example08.html > ../../examples/menu/example08.html
php examples/example09.html > ../../examples/menu/example09.html
php examples/example10.html > ../../examples/menu/example10.html
php examples/example11.html > ../../examples/menu/example11.html
php examples/example12.html > ../../examples/menu/example12.html
php examples/applicationmenubar.html > ../../examples/menu/applicationmenubar.html
php examples/contextmenu.html > ../../examples/menu/contextmenu.html
php examples/tablecontextmenu.html > ../../examples/menu/tablecontextmenu.html
php examples/treeviewcontextmenu.html > ../../examples/menu/treeviewcontextmenu.html
php examples/programsmenu.html > ../../examples/menu/programsmenu.html
php examples/leftnavfromjs.html > ../../examples/menu/leftnavfromjs.html
php examples/leftnavfrommarkup.html > ../../examples/menu/leftnavfrommarkup.html
php examples/leftnavfromjswithanim.html > ../../examples/menu/leftnavfromjswithanim.html
php examples/leftnavfrommarkupwithanim.html > ../../examples/menu/leftnavfrommarkupwithanim.html
php examples/topnavfromjs.html > ../../examples/menu/topnavfromjs.html
php examples/topnavfrommarkup.html > ../../examples/menu/topnavfrommarkup.html
php examples/topnavfromjswithanim.html > ../../examples/menu/topnavfromjswithanim.html
php examples/topnavfrommarkupwithanim.html > ../../examples/menu/topnavfrommarkupwithanim.html


# Copy the image assets for the example files into the build directories

cp examples/img/*.jpg ../../examples/menu/img
cp examples/img/*.png ../../examples/menu/img


# Generate the documentation

./menudocsgen.sh