<?php

/*TabView Module:*/
$modules["tabview"] = array(
							"name" => "TabView Control",
							"type" => "widget",
							"description" => "<p>The YUI TabView Control is designed to enable developers to create navigable tabbed views of content.</p>",
							"cheatsheet" => true
						);	

/*TabView Examples*/
$examples["frommarkup"] = array(
	name => "Build from Markup",
	modules => array("tabview"),
	description => "How build a TabView widget from markup.",
	sequence => array(1),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "tabview"),
	highlightSyntax => true
);

$examples["fromscript"] = array(
	name => "Build from Script",
	modules => array("tabview"),
	description => "How to build a TabView widget from script.",
	sequence => array(2),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "tabview"),
	highlightSyntax => true
);

$examples["addtab"] = array(
	name => "Adding Tabs",
	modules => array("tabview"),
	description => "This demonstrates how to dynamically add tabs.",
	sequence => array(3),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "tabview"),
	highlightSyntax => true
);


$examples["removetab"] = array(
	name => "Removing Tabs",
	modules => array("tabview"),
	description => "This demonstrates how to dynamically remove tabs.",
	sequence => array(4),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "tabview"),
	highlightSyntax => true
);

$examples["datasrc"] = array(
	name => "Getting Content from an External Source",
	modules => array("tabview"),
	description => "This demonstrates how to load Tab content from an external source.",
	sequence => array(5),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "connection", "element", "tabview"),
	highlightSyntax => true
);

$examples["skinning"] = array(
	name => "Skinning TabView",
	modules => array("tabview"),
	description => "TabView skinning is done via CSS.  The TabView comes with a default skin, but you can extend or override this as needed.",
	sequence => array(6),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "tabview"),
	highlightSyntax => true
);

$examples["tabview-ariaplugin"] = array(
	name => "Using the TabView ARIA Plugin",
	modules => array("tabview"),
	description => "The TabView ARIA plugin makes it easy to use the WAI-ARIA Roles and States with the TabView control.",
	sequence => array(7),
	logger => array("tabview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "connection", "element", "tabview"),
	highlightSyntax => true
);

?>
