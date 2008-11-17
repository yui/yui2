<?php

/*Container Module:*/
$modules["container"] = array(
							"name" => "Container Family",
							"type" => "widget",
							"description" => "<p>The Container Family of UI controls supports a varient of interaction patterns in which content that floats above the main layer of the page: Tooltip, Panel, Dialog and SimpleDialog are the most commonly used Container Controls.  Module and Overlay are base classes useful in custom widget development.  Think of Container as providing a basic windowing foundation in Overaly and a set of fully-realized windowing widgets in Tooltip, Panel, Dialog, and SimpleDialog.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*Container Family Examples*/
$examples["module"] = array(
	name => "The Module Control",
	modules => array("container"),
	description => "The Module is a JavaScript representation of modular HTML content; all Container controls implement Module as a base class.",
	sequence => array(1),
	logger => array("container", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("container"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["overlay"] = array(
	name => "Creating and Positioning an Overlay",
	modules => array("container"),
	description => "The Overlay class extends Module and creates a piece of modular content that floats above the page, outside of the page flow.  In this example, we look at how to create and position an Overlay.",
	sequence => array(2),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tooltip"] = array(
	name => "Simple Tooltip Example",
	modules => array("container"),
	description => "Creating and styling a simple Tooltip.",
	sequence => array(3),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tooltip-multi"] = array(
	name => "One Tooltip, Many Context Elements",
	modules => array("container"),
	description => "You can reuse the same Tooltip instance to provide Tooltip effects for many elements, conserving browser resources and improving performance along the way.",
	sequence => array(4),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["panel"] = array(
	name => "Simple Panel Example",
	modules => array("container"),
	description => "This example implements two simple Panels, one from markup and one purely from script, and shows how to configure options like draggability.",
	sequence => array(5),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("dragdrop", "container"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["panelskin1"] = array(
	name => "Skinning a Panel with Custom CSS: Introduction",
	modules => array("container"),
	description => "In this example, we explore simple techniques for using CSS to customize the look and feel of a Panel Control instance.",
	sequence => array(6),
	logger => array("container", "example"),
	loggerInclude => "suppress", 
	newWindow => "require",
	requires => array("dragdrop", "container"),
	highlightSyntax => true,
	bodyclass => " " 
);

$examples["panelskin2"] = array(
	name => "Skinning a Panel with Custom CSS: Advanced",
	modules => array("container"),
	description => "Building on the introductory skinning example, here we'll look at customizing mulitple Panel instances in the same document.",
	sequence => array(7),
	logger => array("container", "example"),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("dragdrop", "container"),
	highlightSyntax => true,
	bodyclass => " "
);

$examples["panel-loading"] = array(
	name => "Creating a Modal \"Loading\" Panel",
	modules => array("container"),
	description => "This example shows how to use a Panel Control instance to display a modal \"loading\" or \"please wait\" message.",
	sequence => array(8),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "animation", "dragdrop", "container"),
	highlightSyntax => true,
	bodyclass => false
);

// $examples["panel-photobox"] = array(
// 	name => "Using Panel as a Photobox",
// 	modules => array("container"),
// 	description => "This example implements the popular photobox or \"lightbox\"-style display.",
// 	sequence => array(9),
// 	logger => array("container", "example"),
// 	loggerInclude => "default", 
// 	newWindow => "default",
// 	requires => array("containercss", "animation", "dragdrop", "container"),
// 	highlightSyntax => true,
// 	bodyclass => " "
// );

$examples["panel-resize"] = array(
	name => "Creating a Resizable Panel",
	modules => array("container", "resize"),
	description => "In this example, we look at how Panel can be combined with the Resize utility to create resizable Panel Control instances.",
	sequence => array(10, 50),
	logger => array("container", "example"),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("dragdrop", "container", "resize"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dialog-quickstart"] = array(
	name => "Dialog Quickstart Example",
	modules => array("container"),
	description => "This example demonstrates the most common use-case for the Dialog control &mdash; collecting data from the user and sending it to the server using XMLHttpRequest (Ajax) via the YUI Connection Manager.",
	sequence => array(11),
	logger => array("connection", "container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "button", "dragdrop", "container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["simpledialog-quickstart"] = array(
	name => "SimpleDialog Quickstart Example",
	modules => array("container"),
	description => "This example demonstrates the most common use-case for the SimpleDialog control &mdash; a control best used for simple ok/cancel or yes/no dialog forms.",
	sequence => array(12),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("button", "container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["container-effect"] = array(
	name => "Using ContainerEffect Transitions",
	modules => array("container"),
	description => "The ContainerEffect object allows you to implement built-in transitions to fade-in/out or slide-in/out your Containers as they show and hide.",
	sequence => array(13),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation","container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["overlaymanager"] = array(
	name => "Using the Overlay Manager to Manage Multiple Panels",
	modules => array("container"),
	description => "Overlay Manager makes it easy to manage the interaction of many Panels within the same window, giving focus to the window that is selected and keeping its z-index higher than that of its peers.",
	sequence => array(14),
	logger => array("container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("dragdrop","container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["keylistener"] = array(
	name => "Implementing Container Keyboard Shortcuts with KeyListener",
	modules => array("container", "event"),
	description => "The KeyListener class, included with the Event Utility, makes it easy to tie keyboard shortcuts to specific actions in your application.",
	sequence => array(15, 10),
	logger => array("event", "container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("dragdrop","container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["container-ariaplugin"] = array(
	name => "Using the Container ARIA Plugin",
	modules => array("container", "event"),
	description => "The Container ARIA Plugin makes it easy to use the WAI-ARIA Roles and States with the Container family of controls.",
	sequence => array(16, 10),
	logger => array("event", "container", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("dragdrop","container"),
	highlightSyntax => true,
	bodyclass => false
);

?>
