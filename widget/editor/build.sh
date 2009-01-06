#!/bin/bash

export YUI_BUILD_DIR=/Users/davglass/src/build/builder/componentbuild
export YUI_SRC_DIR=/Users/davglass/src/build/yui2

src_dir='/Users/davglass/src/local/yui/yui-editor/'
work_dir='/Users/davglass/src/build/yui2/widget/editor/src/'

cd $work_dir
wait
echo "Clean up old files.."
rm ./js/*
wait
rm -rRf ./css/skins
wait
rm ./css/*
wait

echo "Copy source.."
cp $src_dir/js/editor.js ./js/
wait
cp $src_dir/js/toolbar-button.js ./js/
wait
cp $src_dir/js/toolbar.js ./js/
wait
cp $src_dir/js/simple-editor.js ./js/
wait
cp $src_dir/css/editor-core.css ./css/
wait
cp $src_dir/css/editor-core.css ./css/simpleeditor-core.css
wait
mkdir -p ./css/skins/sam
wait
echo "Setup skinning"
cat $src_dir/css/skin-sam.css | sed -e 's/sprite\.png/..\/..\/..\/..\/assets\/skins\/sam\/sprite\.png/' > ./css/skins/sam/editor-skin.css
wait
cp ./css/skins/sam/editor-skin.css ./css/skins/sam/simpleeditor-skin.css
wait
cp $src_dir/css/*.png ./css/skins/sam/
wait
cp $src_dir/css/*.gif ./css/skins/sam/
wait
rm ./css/skins/sam/sprite.png
wait
echo "Running Ant"
wait
cd $work_dir
wait
cd ../
wait
/usr/bin/ant all
wait
rm -rRf build
wait
cd $YUI_SRC_DIR/build/editor/assets
wait
cp -f editor-core.css simpleeditor-core.css
wait
cd skins/sam
wait
cp -f editor-skin.css simpleeditor-skin.css
wait
cp -f editor.css simpleeditor.css
wait
date
