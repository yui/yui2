#!/bin/bash

echo "Copying files from root"
wait

cp ~/src/local/yui/yui-layout/js/layout.js ./src/js/
wait
cp ~/src/local/yui/yui-layout/js/layoutunit.js ./src/js/
wait

cp ~/src/local/yui/yui-layout/css/layout-core.css ./src/css/layout-core.css
wait
cp ~/src/local/yui/yui-layout/css/skin-sam.css ./src/css/
wait
cp ~/src/local/yui/yui-layout/css/layout_sprite.png ./src/css/skins/sam/

