<?php

/*Animation Module:*/
$modules["animation"] = array(
							"name" => "Animation Utility",
							"type" => "utility",
							"description" => "The Animation Utility enables the rapid prototyping and implementation of animations involving size, opacity, color, position, and other visual characteristics.",
							"cheatsheet" => true
						);	
/*Animation Utility Examples*/
$examples["basic"] = array(
	name => "Basic Animation",
	modules => array("animation"),
	description => "Creating and using a simple animation.",
	sequence => array(1),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["easing"] = array(
	name => "Animation Easing",
	modules => array("animation"),
	description => "The Animation Utility allows you to implement 'easing effects' &mdash; for example, when an animation gradually slows down as it nears completion, that's an easing effect known as 'ease-in'.  This example shows you how to use easing effects with your animations.",
	sequence => array(2),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["from"] = array(
	name => "Animating From a Given Value",
	modules => array("animation"),
	description => "Animations usually begin with the current value (e.g., a motion animation usually begins with the current position of the moving element).  However, the starting position can be customized; this example shows you how.",
	sequence => array(3),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["units"] = array(
	name => "Using Custom Units for an Animation",
	modules => array("animation"),
	description => "By default, animations are set in terms of a property's default units (often pixels or percent).  This example shows you how to specificy custom units with Animation.",
	sequence => array(4),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["attributes"] = array(
	name => "Animating Multiple Attributes",
	modules => array("animation"),
	description => "This example demonstrates how to animate multiple attributes of an HTMLElement.",
	sequence => array(5),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["anim-chaining"] = array(
	name => "Chaining Animations Using <code>onComplete</code>",
	modules => array("animation"),
	description => "Animations can be chained (set to fire sequentially) using Animation's onComplete custom event; this simple example shows you how.",
	sequence => array(5),
	logger => array("animation", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "animation", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colors"] = array(
	name => "Animating Colors",
	modules => array("animation"),
	description => "Color animations can be effective indicators of state during the lifespan of a dynamic page.  This example shows you how to animate color attributes of an HTMLElement.",
	sequence => array(7),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["motion"] = array(
	name => "Animating Motion",
	modules => array("animation"),
	description => "This example shows you how to animate the motion path of an HTMLElement.",
	sequence => array(8),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["control"] = array(
	name => "Animating Along a Curved Path",
	modules => array("animation"),
	description => "This example explores motion animation by moving an HTMLElement along a curved path using control points.",
	sequence => array(9),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["scroll"] = array(
	name => "Animated Scrolling",
	modules => array("animation"),
	description => "This example shows how to animate the scrolling of an HTMLElement.",
	sequence => array(10),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);
?>
