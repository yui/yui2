#!/bin/sh

# Create the copyright notice

echo "/*" > copyright.txt
echo "Copyright (c) `date +%Y`, Yahoo! Inc. All rights reserved." >> copyright.txt
echo "Code licensed under the BSD License:" >> copyright.txt
echo "http://developer.yahoo.com/yui/license.txt" >> copyright.txt
echo "*/" >> copyright.txt
echo "" >> copyright.txt
echo "" >> copyright.txt
echo "" >> copyright.txt


# Build the JavaScript

cat src/js/menumodule.js src/js/menumoduleitem.js src/js/menu.js src/js/menuitem.js src/js/contextmenu.js src/js/contextmenuitem.js src/js/menubar.js src/js/menubaritem.js > build/menu-lib.js

cat copyright.txt build/menu-lib.js > build/menu-debug.js

/usr/local/bin/perl -i -p00we 's/^.*?this\.log.*?(;|\).*;|(\n.*?)*?\).*;).*;?.*?\n/""/emg' build/menu-lib.js

cat copyright.txt build/menu-lib.js > build/menu.js

java -jar /usr/local/Dojo\ JavaScript\ Compressor/custom_rhino.jar -c build/menu-lib.js > build/menu-compressed.js 2>&1

/usr/local/bin/perl -i -pwe 's/\n/""/eg' build/menu-compressed.js

cat copyright.txt build/menu-compressed.js > build/menu-min.js


# Add the copyright notice to the CSS file

cat copyright.txt src/css/menu.css > build/assets/menu.css


# Remove temporary files

rm copyright.txt
rm build/menu-lib.js
rm build/menu-compressed.js


# Copy the JavaScript into the official build directories

cp build/*.js ../../build/menu/
cp build/*.js ~/dev/yahoo/properties/webservices/site/yui/build/menu/


# Copy the CSS into the official build directories

cp build/assets/menu.css ../../build/menu/assets
cp build/assets/menu.css ~/dev/yahoo/properties/webservices/site/yui/build/menu/assets


# Copy the image assets into the build directory

cp src/img/*.gif build/assets/
cp build/assets/*.gif ../../build/menu/assets
cp build/assets/*.gif ~/dev/yahoo/properties/webservices/site/yui/build/menu/assets


# Copy the README file to the build directory

cp build/README ../../build/menu/
cp build/README ~/dev/yahoo/properties/webservices/site/yui/build/menu/

# Create example files

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
php examples/leftnav.html > ../../examples/menu/leftnav.html
php examples/programsmenu.html > ../../examples/menu/programsmenu.html
php examples/topnav.html > ../../examples/menu/topnav.html


# Copy the index file into the examples directory

cp examples/index.html ../../examples/menu
cp examples/index.html ~/dev/yahoo/properties/webservices/site/yui/examples/menu


# Copy the examples into the build directory for YDN

cp ../../examples/menu/*.html ~/dev/yahoo/properties/webservices/site/yui/examples/menu


# Copy the image assets for the example files into the build directories

cp examples/img/*.jpg ../../examples/menu/img
cp examples/img/*.jpg ~/dev/yahoo/properties/webservices/site/yui/examples/menu/img
