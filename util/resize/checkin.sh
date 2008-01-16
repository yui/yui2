#!/bin/bash

CMT=$1

if [ "$CMT" = "" ]; then
    CMT="Resize Checkin"
fi

wait
cd  /Users/davglass/Sites/working/yahoo/presentation/2.x/src/resize
cvs commit -m "$CMT" *
wait
cd /Users/davglass/Sites/working/yahoo/presentation/2.x/build/resize
wait
cvs commit -m "$CMT" *
