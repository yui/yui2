#!/bin/bash

CMT=$1

if [ "$CMT" = "" ]; then
    CMT="Editor Checkin"
fi

wait
cd  /Users/davglass/Sites/working/yahoo/presentation/2.x/src/editor
cvs commit -m "$CMT"
wait
cd /Users/davglass/Sites/working/yahoo/presentation/2.x/build/editor
wait
cvs commit -m "$CMT"
