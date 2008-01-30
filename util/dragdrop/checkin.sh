#!/bin/bash

CMT=$1

if [ "$CMT" = "" ]; then
    CMT="DragDrop Checkin"
fi

wait
cd  /Users/davglass/Sites/working/yahoo/presentation/2.x/src/dragdrop
cvs commit -m "$CMT" *
wait
cd /Users/davglass/Sites/working/yahoo/presentation/2.x/build/dragdrop
wait
cvs commit -m "$CMT" *
