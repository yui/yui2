#!/bin/bash

CMT=$1

if [ "$CMT" = "" ]; then
    CMT="Layout Checkin"
fi

wait
cd  /Users/davglass/Sites/working/yahoo/presentation/2.x/src/layout
cvs commit -m "$CMT" *
wait
cd /Users/davglass/Sites/working/yahoo/presentation/2.x/build/layout
wait
cvs commit -m "$CMT" *
