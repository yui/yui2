#!/bin/sh

##############################################################################

# The location of your yuidoc install
yuidoc_home=~/yuidoc

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.
parser_in=~/dev/yahoo/presentation/2.x/widget/menu/src/js

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=~/dev/yahoo/presentation/2.x/widget/menu/docs/parser

# The directory to put the html file outputted by the generator
generator_out=~/dev/yahoo/presentation/2.x/widget/menu/docs

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=$yuidoc_home/template

##############################################################################

rm src/js/._*.js

$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template