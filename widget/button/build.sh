#!/bin/sh

# Build the JavaScript, images and CSS

ant

ant deploy

mv ~/dev/yahoo/presentation/2.x/build/button/assets/button-skin.css ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/button-skin.css 
mv ~/dev/yahoo/presentation/2.x/build/button/assets/menu-button-arrow-disabled.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/menu-button-arrow-disabled.png
mv ~/dev/yahoo/presentation/2.x/build/button/assets/menu-button-arrow.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/menu-button-arrow.png
mv ~/dev/yahoo/presentation/2.x/build/button/assets/split-button-arrow-active.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/split-button-arrow-active.png
mv ~/dev/yahoo/presentation/2.x/build/button/assets/split-button-arrow-disabled.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/split-button-arrow-disabled.png
mv ~/dev/yahoo/presentation/2.x/build/button/assets/split-button-arrow-focus.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/split-button-arrow-focus.png
mv ~/dev/yahoo/presentation/2.x/build/button/assets/split-button-arrow.png ~/dev/yahoo/presentation/2.x/build/button/assets/skins/sam/split-button-arrow.png


# Create example files

php -d 'open_basedir=' examples/index.html prod > ../../examples/button/index.html
php -d 'open_basedir=' examples/example01.html prod > ../../examples/button/example01.html
php -d 'open_basedir=' examples/example02.html prod > ../../examples/button/example02.html
php -d 'open_basedir=' examples/example03.html prod > ../../examples/button/example03.html
php -d 'open_basedir=' examples/example04.html prod > ../../examples/button/example04.html
php -d 'open_basedir=' examples/example05.html prod > ../../examples/button/example05.html
php -d 'open_basedir=' examples/example06.html prod > ../../examples/button/example06.html
php -d 'open_basedir=' examples/example07.html prod > ../../examples/button/example07.html
php -d 'open_basedir=' examples/example08.html prod > ../../examples/button/example08.html

# Copy the image assets for the example files into the build directories

cp examples/img/*.gif ../../examples/button/img
cp examples/img/*.jpg ../../examples/button/img
cp examples/img/*.png ../../examples/button/img