<?php

/* Drag and Drop Module:*/
$modules["dragdrop"] = array(
        "name" => "Drag &amp; Drop",
        "type" => "utility",
        "description" => "<p>The Drag &amp; Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation.</p>",
		"cheatsheet" => true
    );	

/* Drag and Drop Examples*/
$examples["dd-basic"] = array(
	name => "Basic Drag and Drop",
	modules => array("dragdrop"),
	description => "This example demonstrates the basics of drag and drop.",
	sequence => array(1),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dd-handles"] = array(
	name => "Using Handles",
	modules => array("dragdrop"),
	description => "This examples shows how to define drag handles.",
	sequence => array(2),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dd-ontop"] = array(
	name => "Dragged Element on Top",
	modules => array("dragdrop"),
	description => "Demonstrates how to use Drag &amp; Drop's event API to force a dragged element to draw on top of the other drag-and-drop elements.",
	sequence => array(3),
	logger => array("dragdrop"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["dd-proxy"] = array(
	name => "Using a Proxy Element",
	modules => array("dragdrop"),
	description => "Demonstrates the built-in proxy-drag feature of drag and drop.",
	sequence => array(4),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dd-reorder"] = array(
	name => "Reordering a List",
	modules => array("dragdrop"),
	description => "Demonstrates how to use drag and drop to reorder a list.",
	sequence => array(5),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("animation","dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dd-groups"] = array(
	name => "Using Interaction Groups",
	modules => array("dragdrop"),
	description => "Demonstrates how to use multiple drag-and-drop interaction groups.",
	sequence => array(6),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);
$examples["dd-circle"] = array(
	name => "Custom Click Validator",
	modules => array("dragdrop"),
	description => "Demonstrates one way to implement a draggable panel.",
	sequence => array(8),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop", "animation"),
	highlightSyntax => true,
	bodyclass => false
);
$examples["dd-region"] = array(
	name => "Staying in a Region",
	modules => array("dragdrop"),
	description => "Demonstrates one way to implement dragging elements in a Region.",
	sequence => array(9),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);
$examples["dd-shim"] = array(
	name => "Using the Drag Shim",
	modules => array("dragdrop"),
	description => "This example shows the use of the drag shim when dragging nodes over other troublesome nodes.",
	sequence => array(10),
	logger => array("dragdrop"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop"),
	highlightSyntax => true,
	bodyclass => false
);
?>
