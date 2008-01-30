#!/bin/bash

./copy.sh
wait
echo "Running (ant all)..."
wait
ant all
