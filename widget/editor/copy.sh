#!/bin/bash

echo "Syncing Sources"

cd /Users/davglass/working/working/yui-dev/yui-dev/build/editor
wait
rm -rRf *
wait
cp -R ~/Sites/working/yahoo/presentation/2.x/build/editor/* ./
wait
cp editor-beta-debug.js editor-beta-min.js
