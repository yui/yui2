#!/bin/bash

echo "Syncing Sources"

cd /Users/davglass/working/working/yui-dev/yui-dev/build/dragdrop
wait
rm -rRf *
wait
cp -R ~/Sites/working/yahoo/presentation/2.x/build/dragdrop/* ./
wait
cp dragdrop-debug.js dragdrop-min.js
wait
cp dragdrop-debug.js dragdrop.js
wait
date
