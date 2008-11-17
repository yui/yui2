<?php

/*Event Module:*/
$modules["button"] = array(
							"name" => "Button Control",
							"type" => "widget",
							"description" => "The Button Control enables the creation of rich, graphical buttons that function like traditional HTML form buttons; the Button Control provides more-impactful and easier-to-use replacements for simple buttons, radio buttons, and checkboxes, and it can go beyond the HTML form-control functionality by providing an extensible platform for various split-button implementations (including menu buttons).",
							"cheatsheet" => true
						);	

$examples["btn_example01"] = array(
	name => "Push Buttons",
	modules => array("button"),
	description => "This example explores various ways to create a Push Button.",
	sequence => array(1),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example02"] = array(
	name => "Link Buttons",
	modules => array("button"),
	description => "Link Buttons function like HTML anchor elements; this example shows you several ways to create Link Buttons.",
	sequence => array(2),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example03"] = array(
	name => "Checkbox Buttons",
	modules => array("button"),
	description => "This example demonstrates different ways to create a Button that functions like an HTML checkbox.",
	sequence => array(3),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example04"] = array(
	name => "Radio Buttons",
	modules => array("button"),
	description => "This example demonstrates different ways to create a Button that functions like an HTML radio button.",
	sequence => array(4),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example05"] = array(
	name => "Submit Buttons",
	modules => array("button"),
	description => "This example demonstrates different ways to create a Button that functions like an HTML submit button.",
	sequence => array(5),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example06"] = array(
	name => "Reset Buttons",
	modules => array("button"),
	description => "This example demonstrates different ways to create a Button that functions like an HTML reset button.",
	sequence => array(6),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example07"] = array(
	name => "Menu Buttons",
	modules => array("button", "container", "menu"),
	description => "With the inclusion of the optional Menu Control, it is possible to create Buttons that incorporate a menu; this example shows you how.",
	sequence => array(7, 50, 60),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("menu", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example08"] = array(
	name => "Split Buttons",
	modules => array("button", "container", "menu"),
	description => "Split Buttons are a hybrid of Menu Buttons and standard buttons; this example shows you how to use the Button Control to create Split Buttons.",
	sequence => array(8, 51, 61),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("menu", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example09"] = array(
	name => "Simple Calendar Menu Button",
	modules => array("button", "container", "calendar"),
	description => "This example demonstrates how to create a Menu Button whose Menu instance displays a Calendar.",
	sequence => array(9, 52, 62, 50),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("calendar", "containercore", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example10"] = array(
	name => "Calendar Menu Button with Date on Button Face",
	modules => array("button", "container", "calendar"),
	description => "This example demonstrates how to create a Menu Button whose Menu instance displays a Calendar and label reflects the selected date.",
	sequence => array(10, 53, 63, 50),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("calendar", "containercore", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example11"] = array(
	name => "Color Picker Button",
	modules => array("button", "container", "menu", "colorpicker"),
	description => "This example demonstrates how to render a Color Picker into the Menu of a Split Button.",
	sequence => array(11, 54, 64, 50),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("colorpicker", "menu", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example12"] = array(
	name => "Fixed Width Menu Button",
	modules => array("button", "container", "menu"),
	description => "This example demonstrates how to create a Menu Button whose text label has a fixed width.",
	sequence => array(12, 55, 65),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("menu", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["btn_example13"] = array(
	name => "Glowing Button",
	modules => array("button", "animation"),
	description => "This example demonstrates how to skin a Button instance to create a glossy, glass-like effect with a glowing background reminiscent of Aqua buttons found in Mac OS X.",
	sequence => array(13, 56),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("animation", "menu", "button"),
	highlightSyntax => true,
	bodyclass => " "
);

$examples["btn_example14"] = array(
	name => "Slider Button",
	modules => array("button", "slider", "container", "menu"),
	description => "This example demonstrates how to combine a Split Button with a Slider to create an opacity slider button, similar to that found in Adobe Photoshop.",
	sequence => array(14, 57, 67, 70),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("slider", "menu", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["button-ariaplugin"] = array(

	name => "Using the Button ARIA Plugin",
	modules => array("button", "container", "menu"),
	description => "The Button ARIA plugin makes it easy to use the WAI-ARIA Roles and States with the Button control.",
	sequence => array(15, 16, 27),
	logger => array("button", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("menu", "button"),
	highlightSyntax => true,
	bodyclass => false
	
);

?>