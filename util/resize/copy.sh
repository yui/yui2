#!/bin/bash

echo "Copying files from root"
wait

cp ~/src/local/yui/yui-resize/js/resize.js ./src/js/
wait

cp ~/src/local/yui/yui-resize/css/resize-core.css ./src/css/
wait
cp ~/src/local/yui/yui-resize/css/skin-sam.css ./src/css/
wait
cp ~/src/local/yui/yui-resize/css/layout_sprite.png ./src/css/skins/sam/
