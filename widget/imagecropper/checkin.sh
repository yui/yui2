#!/bin/bash

CMT=$1

if [ "$CMT" = "" ]; then
    CMT="Cropper Checkin"
fi

wait
cd  /Users/davglass/Sites/working/yahoo/presentation/2.x/src/imagecropper
cvs commit -m "$CMT" *
wait
cd /Users/davglass/Sites/working/yahoo/presentation/2.x/build/imagecropper
wait
cvs commit -m "$CMT" *
