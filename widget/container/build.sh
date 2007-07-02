#!/bin/sh

# Build the JavaScript, images and CSS

ant

ant deploy

mv ~/dev/yahoo/presentation/2.x/build/container/assets/container-skin.css ~/dev/yahoo/presentation/2.x/build/container/assets/skins/sam/container-skin.css