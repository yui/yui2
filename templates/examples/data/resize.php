<?php

/*Rich Text Editor Module:*/
$modules["resize"] = array(
							"name" => "Resize Utility",
							"type" => "utility",
							"description" => "<p>The Resize Utility provides an API and skin for making DOM elements resizable.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

$examples["simple_resize"] = array(
	name => "Simple Resize", 
	modules => array('resize'), 
	description => "This example shows how to make a DIV resizable.",
	sequence => array(1), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["proxy_resize"] = array(
	name => "Proxy Resize", 
	modules => array('resize'), 
	description => "This example shows how to make a DIV resizable, using a proxy element.",
	sequence => array(2), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["anim_resize"] = array(
	name => "Animated Proxy Resize", 
	modules => array('resize'), 
	description => "This example shows how to make a DIV resizable, using a proxy element and animation.",
	sequence => array(3), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'animation', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["eightway_resize"] = array(
	name => "8-way Element Resize", 
	modules => array('resize'), 
	description => "This example shows how to make an element resizable by all 8 handles.",
	sequence => array(4), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'animation', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["ghost_resize"] = array(
	name => "Ghosting and Custom Proxy Resize", 
	modules => array('resize'), 
	description => "This example shows how to use ghosting and manipulate the proxy element.",
	sequence => array(5), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'animation', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["rte_resize"] = array(
	name => "Custom resizing for the Rich Text Editor", 
	modules => array('resize', 'editor'), 
	description => "This example shows how to customize the Resize Utility for things like the Rich Text Editor.",
	sequence => array(6, 50), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('event', 'dom', 'animation', 'element', 'resize', 'simpleeditor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["grids_resize"] = array(
	name => "Split Pane resizing with Grids CSS", 
	modules => array('resize', 'grids'), 
	description => "This example shows how to make a resizable split pane with Grids CSS.",
	sequence => array(7, 10), 
	logger => array(), 
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array('grids', 'event', 'dom', 'animation', 'element', 'resize'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["skinning_resize"] = array(
	name => "Skinning the Resize Utility",
	modules => array("resize"),
	description => "Resize skinning is done via CSS.  The Resize Utility comes with a default skin, but you can extend or override this as needed.",
	sequence => array(8),
	logger => array(),
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array("event", "dom", 'animation', "element", "resize"),
	highlightSyntax => true
);

?>
