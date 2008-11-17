<?php

/*ColorPicker Module:*/
$modules["colorpicker"] = array(
							"name" => "Color Picker Control",
							"type" => "widget",
							"description" => "The Color Picker Control allows you to implement a rich, powerful, visual color selection tool that returns color values in RGB, hex, and HSV formats.", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*Color Picker Control Examples*/
$examples["colorpicker-fromscript"] = array(
	name => "Inline Color Picker Control from Script", /*title of example*/
	modules => array("colorpicker"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "This example demonstrates the use of an inline Color Picker instance built entirely with JavaScript.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("colorpicker"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "require", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("animation","colorpicker"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false /*default should be false; use this to set a classname/s on the body element.  This field was added to support the need to skin panels that are rendered directly to the body element.*/
);


$examples["colorpicker-dialog-from-script"] = array(
	name => "Example of Color Picker Built in a Dialog via JavaScript",
	modules => array("colorpicker", "container"),
	description => "Color Picker interactions commonly call for the picker to be displayed as part of a floating dialog window; this example demonstrates how to create such an implementation while building the Color Picker's DOM structure via JavaScript.",
	sequence => array(2, 20),
	logger => array("colorpicker"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "dragdrop","animation", "container", "colorpicker"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colorpicker-dialog-from-markup"] = array(
	name => "Example of Color Picker Built in a Dialog from Markup",
	modules => array("colorpicker"),
	description => "Color Picker interactions commonly call for the picker to be displayed as part of a floating dialog window; this example demonstrates how to create such an implementation while placing the Color Picker's DOM structure on the page prior to instantiating the picker.",
	sequence => array(3),
	logger => array("colorpicker"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "dragdrop", "animation", "container", "colorpicker"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colorpicker-custom"] = array(
	name => "Example of Specifying Custom Labels and Element IDs for Color Picker",
	modules => array("colorpicker"),
	description => "When you want to have multiple Color Pickers on the same page, or when you want to internationalize them, you'll need to customize element IDs and/or form-control labels.  This example shows you how.",
	sequence => array(3),
	logger => array("colorpicker"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("dragdrop", "animation", "colorpicker"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colorpicker-skinning"] = array(
	name => "Skinning Example",
	modules => array("colorpicker"),
	description => "Many YUI Controls have CSS \"skins\" that define their look and feel.  The default skin for YUI is the Sam Skin.  This example calls out the CSS used to skin the Color Picker control.",
	sequence => array(3),
	logger => array("colorpicker"),
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array("animation", "colorpicker"),
	highlightSyntax => true,
	bodyclass => false
);
?>