<?php

/*Rich Text Editor Module:*/
$modules["imagecropper"] = array(
							"name" => "ImageCropper Control (beta)",
							"type" => "widget",
							"description" => "<p>The ImageCropper Control provides an API and skin for making an image croppable.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

$examples["simple_crop"] = array(
	name => "Simple Crop Interface", 
	modules => array('imagecropper'), 
	description => "This example shows how to make an image croppable.",
	sequence => array(1), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array('event', 'dom', 'element', 'resize', 'imagecropper'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["adv_crop"] = array(
	name => "Advanced Crop Interface", 
	modules => array('imagecropper'), 
	description => "This example shows how to make an image croppable with some advanced features.",
	sequence => array(2), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array('event', 'dom', 'element', 'resize', 'imagecropper'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["feedback_crop"] = array(
	name => "Real Time Crop Feedback", 
	modules => array('imagecropper'), 
	description => "This example shows how to use a few of the built in events to real time crop feedback.",
	sequence => array(3), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array('event', 'dom', 'element', 'resize', 'imagecropper'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["conn_crop"] = array(
	name => "Connection Manager assisted image crop", 
	modules => array('imagecropper', 'connection'), 
	description => "This example shows how to use Connection Manager to issue an image crop request.",
	sequence => array(4, 50), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array('event', 'dom', 'connection', 'button', 'element', 'resize', 'imagecropper'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["skinning_crop"] = array(
	name => "Skinning the ImageCropper",
	modules => array("imagecropper"),
	description => "ImageCropper skinning is done via CSS.  The ImageCropper comes with a default skin, but you can extend or override this as needed.",
	sequence => array(5),
	logger => array(),
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array("event", "dom", 'animation', "element", "imagecropper"),
	highlightSyntax => true
);


?>
