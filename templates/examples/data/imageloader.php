<?php

/* ImageLoader Module: */
$modules["imageloader"] = array(
							"name" => "ImageLoader Utility",
							"type" => "utility",
							"description" => "<p>The ImageLoader Utility provides a mechanism to delay the loading of specfic images on a page. This allows you to, for example, defer the loading of images which are out of the browser viewport until the user begins to scroll, or to defer the loading of images in a carousel until the user mouses-over the carousel's navigation controls.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*ImageLoader Utility Examples*/
$examples["imgloadbasics"] = array(
	name => "Basic Features of the ImageLoader Utility", /*title of example*/
	modules => array("imageloader"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "Demonstrates the basic features and operation of the ImageLoader Utility, deferring the loading of images until specific targets are hit or specific timers expire.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("imageloader", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "require", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("imageloader"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false
);


$examples["imgloadfold"] = array(
	name => "Loading Images Below the Fold",
	modules => array("imageloader"),
	description => "Loading images above the fold immediately while deferring the loading of images below the fold.",
	sequence => array(2),
	logger => array("imageloader", "example"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("imageloader"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["imgloadclass"] = array(
	name => "Using ImageLoader with CSS Class Names",
	modules => array("imageloader"),
	description => "Using CSS class names to target specific images for deferred loading.",
	sequence => array(3),
	logger => array("imageloader", "example"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("imageloader"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["imgloadtabs"] = array(
	name => "ImageLoader with TabView",
	modules => array("imageloader", "tabview"),
	description => "Using ImageLoader with the TabView Control and determining which triggers to set for image groups.",
	sequence => array(4, 50),
	logger => array("imageloader", "example"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("imageloader", "tabview"),
	highlightSyntax => true,
	bodyclass => false
);

?>
