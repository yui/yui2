<?php

$modules["layout"] = array(
							"name" => "Layout Manager",
							"type" => "widget",
							"description" => "<p>The YUI Layout Manager provides a fixed layout structure containing, top, bottom, left, right and center layout units. It can be applied to either the body or an element within the body, including a floating Panel or Overlay.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

$examples["page_layout"] = array(
	name => "Full Page Layout", 
	modules => array('layout'), 
	description => "This example shows how to build a full page layout.",
	sequence => array(1), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "require",
	requires => array('reset','fonts','grids','event','dragdrop','dom', 'element', 'resize', 'animation', 'layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
	
);

$examples["panel_layout"] = array(
	name => "Layout inside a resizable Panel", 
	modules => array('layout', 'resize', 'container'), 
	description => "This example shows how to build a layout inside of a resizable Panel Control.",
	sequence => array(2, 10, 20), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "require",
	requires => array('event', 'dom', 'element', 'container', 'resize', 'animation', 'layout', 'reset', 'fonts', 'grids', 'dragdrop'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["grids_layout"] = array(
	name => "Using a Layout with Grids CSS", 
	modules => array('layout', 'grids'), 
	description => "This example shows how to use the Layout Manager with the Grids CSS.",
	sequence => array(3, 10, 20), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "require",
	requires => array('reset', 'fonts', 'grids', 'selector','event', 'dom', 'element', 'layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["nested_layout"] = array(
	name => "Nesting a layout", 
	modules => array('layout'), 
	description => "Nesting a layout inside another layout.",    
	sequence => array(4), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "require",
	requires => array('reset', 'fonts', 'grids', 'dragdrop', 'resize', 'animation','event', 'dom', 'element', 'layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["menu_layout"] = array(
	name => "Layout with Menu Controls", 
	modules => array('layout', 'menu'), 
	description => "Using a full page Layout with top and left Menu navigation",    
	sequence => array(5, 74), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "require",
	requires => array('utilities','resize','container', 'menu', 'layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["calrte_layout"] = array(
	name => "Simple Application", 
	modules => array('layout', 'editor', 'calendar', 'connection'), 
	description => "A simple date entry application.",    
	sequence => array(6, 74, 74, 74), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "require",
	requires => array('utilities','container','calendar','resize','simpleeditor','layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["adv_layout"] = array(
	name => "Complex Application", 
	modules => array('layout', 'autocomplete', 'logger', 'animation', 'slider', 'editor', 'selector', 'get', 'container', 'calendar', 'tabview', 'yuiloader', 'resize', 'button', 'datatable'), 
	description => "An advanced application using several YUI Utilities and Controls.",
	sequence => array(7, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "require",
	requires => array('yuiloader'),/*all other dependencies are brought in via loader*/
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["skinning_layout"] = array(
	name => "Skinning a Layout", 
	modules => array('layout'), 
	description => "Layout skinning is done via CSS.  The Layout Manager comes with a default skin, but you can extend or override this as needed.",    
	sequence => array(10), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array('event', 'dom', 'element', 'layout'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);


?>
