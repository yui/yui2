#!/bin/bash
export YUI_BUILD_DIR=/Users/davglass/src/build/builder/componentbuild
export YUI_SRC_DIR=/Users/davglass/src/build/yui2


./copy.sh
wait

echo "Setup skinning"
cat ./src/css/skin-sam.css | sed -e 's/(sprite\.png)/(..\/..\/..\/..\/assets\/skins\/sam\/sprite\.png)/' > ./src/css/skins/sam/layout-skin.css
wait

echo "Running (ant all)..."
wait
ant all
wait
rm -rRf build
