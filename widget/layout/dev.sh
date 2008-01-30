#!/bin/bash

echo "Syncing Sources"

mkdir -p /Users/davglass/working/working/yui-dev/yui-dev/build/layout
wait
cd /Users/davglass/working/working/yui-dev/yui-dev/build/layout
wait
rm -rRf *
wait
cp -R ~/Sites/working/yahoo/presentation/2.x/build/layout/* ./
wait
date
