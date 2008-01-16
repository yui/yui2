#!/bin/bash

echo "Syncing Sources"

mkdir -p /Users/davglass/working/working/yui-dev/yui-dev/build/resize
wait
cd /Users/davglass/working/working/yui-dev/yui-dev/build/resize
wait
rm -rRf *
wait
cp -R ~/Sites/working/yahoo/presentation/2.x/build/resize/* ./
wait
date
