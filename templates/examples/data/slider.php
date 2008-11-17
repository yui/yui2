<?php

/*Slider Module:*/
$modules["slider"] = array(
							"name" => "Slider Control",
							"type" => "widget",
							"description" => "<p>The YUI Slider Control is a UI control that enables the user to adjust values in a finite range along one or two axes.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/* Slider Control Examples*/
$examples["slider-simple"] = array(
	name => "Basic Vertical Slider", /*title of example*/
	modules => array("slider"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "This example demonstrates how to create a simple slider, how to consume the values it produces when a user interacts with the control, and how to programmatically update the slider's state.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("slider", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "default", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("animation","slider"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false /*default should be false; use this to set a classname/s on the body element.  This field was added to support the need to skin panels that are rendered directly to the body element.*/
);

$examples["slider-ticks"] = array(
	name => "Horizontal Slider with Tick Marks",
	modules => array("slider"),
	description => "This example implements a slider with tick marks.",
	sequence => array(2, 20),
	logger => array("slider", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "slider"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["slider-rgb"] = array(
	name => "RBG Slider Control",
	modules => array("slider"),
	description => "This example demonstrates how to use the slider as a building block for a more complex widget.  It employs three slider instances that work together to produce RGB values.",
	sequence => array(3, 20),
	logger => array("slider", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "slider"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["slider_vert_swapped"] = array(
	name => "Bottom to top Vertical Slider",
	modules => array("slider"),
	description => "This example demonstrates how to create a vertical slider with values increasing as the slider moves up.",
	sequence => array(4),
	logger => array("slider", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "slider"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["slider_dual_thumb"] = array(
	name => "Horizontal Slider with two thumbs",
	modules => array("slider"),
	description => "This example demonstrates how to create a Slider with two thumbs.",
	sequence => array(5),
	logger => array("slider", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "slider"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["slider_dual_with_highlight"] = array(
	name => "Dual-thumb Slider with range highlight",
	modules => array("slider"),
	description => "This example demonstrates how to create a dual-thumb slider with the enclosed range highlighted.",
	sequence => array(6),
	logger => array("slider", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("slider"),
	highlightSyntax => true,
	bodyclass => false
);

?>
