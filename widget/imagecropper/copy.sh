#!/bin/bash

echo "Copying files from root"
wait

cp ~/Sites/yui/yui-crop/js/crop.js ./src/js/
wait

cp ~/Sites/yui/yui-crop/css/crop-core.css ./src/css/imagecropper-core.css
wait
cp ~/Sites/yui/yui-crop/css/skin-sam.css ./src/css/

