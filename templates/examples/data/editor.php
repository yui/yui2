<?php

/*Rich Text Editor Module:*/
$modules["editor"] = array(
							"name" => "Rich Text Editor",
							"type" => "widget",
							"description" => "<p>The Rich Text Editor is a UI control that replaces a standard HTML textarea. It allows for the rich formatting of text content, including common structural treatments like lists, formatting treatments like bold and italic text, and drag-and-drop inclusion and sizing of images. The Rich Text Editor's Toolbar is extensible via a plugin architecture so that advanced implementations can achieve a high degree of customization.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

$examples["cal_editor"] = array(
	name => "Calendar Plugin", 
	modules => array("editor", 'calendar'), 
	description => "This example adds a button to the Rich Text Editor's Toolbar that displays a Calendar control for choosing dates. It also demonstrates how to manage the state of a custom button.",
	sequence => array(2, 50), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', "element", "container", 'calendar', "menu", 'button', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["switch_editor"] = array(
	name => "Plain Text Switcher", 
	modules => array("editor"), 
	description => 'This example demonstrates how to toggle from a plain text field to the Rich Text Editor with a simple button click.',
	sequence => array(4), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["flickr_editor"] = array(
	name => "Flickr Image Search", 
	modules => array("editor", 'autocomplete'), 
	description => 'This example adds a button that opens a custom panel containing an AutoComplete Control that can be used to retrieve photos from <a href="http://flickr.com/">Flickr</a>.',
	sequence => array(1, 50), 
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', 'connection', "element", "container", "menu", 'button', 'autocomplete', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["icon_editor"] = array(
	name => "Icon Insertion", 
	modules => array("editor"), 
	description => 'This example adds a button that opens a custom panel to insert custom icons.',
	sequence => array(3), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', 'connection', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["post_editor"] = array(
	name => "Editor Data Post with Connection Manager", 
	modules => array("editor", 'connection'), 
	description => 'This example posts data to the server with Connection Manager and returns filtered data.',
	sequence => array(5, 50), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', 'connection', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);

$examples["skinning_editor"] = array(
	name => "Skinning the Editor",
	modules => array("editor"),
	description => "Editor skinning is done via CSS.  The Editor comes with a default skin, but you can extend or override this as needed.",
	sequence => array(6),
	logger => array(),
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true
);
$examples["toolbar_editor"] = array(
	name => "Default Toolbar Config",
	modules => array("editor"),
	description => "Here you will find the default config for the Editor's toolbar.",
	sequence => array(7),
	logger => array(),
	loggerInclude => "suppress", 
	newWindow => "suppress",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true
);
$examples["code_editor"] = array(
	name => "Code Editor", 
	modules => array("editor"), 
	description => 'This example demonstrates how to build a Source Editor.',
	sequence => array(8), 
	logger => array(), 
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true,
    bodyclass => 'yui-skin-sam'
);
$examples["tabview_editor"] = array(
	name => "Editor inside a Tabview Control",
	modules => array("editor", 'tabview'),
	description => "Placing an Editor inside of a Tabview Control.",
	sequence => array(9, 50),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', "element", "tabview", "container", "menu", 'button', 'editor'),
	highlightSyntax => true
);
$examples["multi_editor"] = array(
	name => "One Editor, Multiple Edit Areas",
	modules => array("editor"),
	description => "Have one Editor control several editable areas on a single page.",
	sequence => array(10),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "require",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true
);
$examples["imagebrowser_editor"] = array(
	name => "Editor with Custom Image Browser",
	modules => array("editor"),
	description => "Use a custom image browser for image insertion into the editor.",
	sequence => array(11),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", 'animation', "element", "container", "menu", 'button', 'editor'),
	highlightSyntax => true
);

$examples["simple_editor"] = array(
	name => "Simple Editor &mdash; Basic Buttons",
	modules => array("editor"),
	description => "Using the SimpleEditor Control with Basic Buttons.",
	sequence => array(12),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "containercore", 'simpleeditor'),
	highlightSyntax => true
);

$examples["simple_adv_editor"] = array(
	name => "Simple Editor &mdash; Advanced Buttons",
	modules => array("editor"),
	description => "Using the SimpleEditor Control with Advanced Buttons.",
	sequence => array(13),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "containercore", 'menu', 'button', 'simpleeditor'),
	highlightSyntax => true
);

$examples["editor_adv_editor"] = array(
	name => "Editor &mdash; Basic Buttons",
	modules => array("editor"),
	description => "Using the Editor Control with Basic Buttons.",
	sequence => array(14),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "container", 'editor'),
	highlightSyntax => true
);

$examples["autoheight_editor"] = array(
	name => "Editor Auto Adjusting Height",
	modules => array("editor"),
	description => "Using the autoHeight config to make the Editor change it's height based on the content.",
	sequence => array(15),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "element", "container", 'editor'),
	highlightSyntax => true
);

$examples["dialog_editor"] = array(
	name => "Editor in a Dialog Control",
	modules => array("editor", "container"),
	description => "It's easy to use the Rich Text Editor to enhance a textarea within a Dialog Control; this example shows you how.",
	sequence => array(16),
	logger => array(),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("json","event", "dom", "element", "button", "container", "connection", "editor"),
	highlightSyntax => true
);

?>
