<?php
/*YUI Loader Module:*/
$modules["yuiloader"] = array(
							"name" => "YUI Loader Utility", 
							"type" => "utility",
							"description" => "<p>The YUI Loader provides a client-side mechanism for loading YUI components and their dependencies.  It can be used to add additional components to a page on which some YUI components already exist or to structure the loading of scripts and CSS files for an entire page.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*YUI Loader Utility Examples*/
$examples["yl-basic"] = array(
	name => "Using YUI Loader to Load the Calendar Control", /*title of example*/
	modules => array("yuiloader", "calendar"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "This example demonstrates a simple implementation in which we bring in the YUI Calendar Control &mdash; and its JavaScript and CSS dependencies &mdash; using the YUI Loader Utility.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1, 50), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("yuiloader", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "suppress", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "require", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("yuiloader"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false /*default should be false; use this to set a classname/s on the body element.  This field was added to support the need to skin panels that are rendered directly to the body element.*/
);

/*YUI Loader Utility Examples*/
$examples["yl-insert"] = array(
	name => "Using YUI Loader to Place Additional Components on a Page", /*title of example*/
	modules => array("yuiloader"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "In some cases, you may wish to use YUI Loader to bring additional components into a page that already contains some YUI content.  In this example, we'll look at how to use YUI Loader to augment a page's existing YUI content by bringing in additional dependencies for a new component.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("yuiloader", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "require", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "suppress", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("yuiloader"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false /*default should be false; use this to set a classname/s on the body element.  This field was added to support the need to skin panels that are rendered directly to the body element.*/
);

$examples["yl-addmodule"] = array(
	name => "Using addModule to Add Custom (Non-YUI) Content with YUILoader",
	modules => array("yuiloader"),
	description => "YUILoader can be used to add YUI components to the page, but it can also be used to add other components that you create yourself (or that you pull from a third-party source).  This example shows one simple way to pull in external content with YUILoader.",
	sequence => array(3),
	logger => array("yuiloader"),
	loggerInclude => "require", 
	newWindow => "suppress",
	requires => array("button", "yuiloader"),
	highlightSyntax => true,
	bodyclass => false
);



$examples["yl-list"] = array(
	name => "Use YUILoader to list requirements for a set of components.",
	modules => array("yuiloader"),
	description => "Select one or more YUI components and see an optimized list of file includes.",
	sequence => array(4),
	logger => array("yuiloader"),
	loggerInclude => "require", 
	newWindow => "suppress",
	requires => array("button", "yuiloader"),
	highlightSyntax => true,
	bodyclass => false
);
