#!/bin/bash

src_dir='/Users/davglass/Sites/yui/yui-editor/'
work_dir='/Users/davglass/Sites/working/yahoo/presentation/2.x/widget/editor/src/'

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
cp $src_dir/js/toolbar.js ./js/
wait
cp $src_dir/css/editor-core.css ./css/
wait
mkdir -p ./css/skins/sam
wait
echo "Setup skinning"
cat $src_dir/css/skin-sam.css | sed -e 's/sprite\.png/..\/..\/..\/..\/assets\/skins\/sam\/sprite\.png/' > ./css/skins/sam/editor-skin.css
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
