<?php

/*Dom Module:*/
$modules["dom"] = array(
							"name" => "Dom Collection",
							"type" => "core",
							"description" => "<p>The Dom Collection comprises a family of convenience methods that simplify common DOM-scripting tasks, including element positioning and CSS style management, while normalizing for cross-browser inconsistencies.</p>",
							"cheatsheet" => true
						);	

/*Dom Utility Examples*/
$examples["setxy"] = array(
	name => "Using setXY",
	modules => array("dom"),
	description => "Positioning elements relative to the document coordinate system can be quite a challenge.  The Dom Utility provides this method to do it for you.",
	sequence => array(1),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["getxy"] = array(
	name => "Using getXY",
	modules => array("dom"),
	description => "Getting element positions relative to the document coordinate system can be quite a challenge.  The Dom Utility provides this method to do it for you.",
	sequence => array(2),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["setstyle"] = array(
	name => "Using setStyle",
	modules => array("dom"),
	description => "There are some differences between browsers regarding how style properties are set on HTMLElements.  This method normalizes those for you.",
	sequence => array(3),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["getstyle"] = array(
	name => "Using getStyle",
	modules => array("dom"),
	description => "There are some differences between browsers regarding how style properties are retrieved from HTMLElements.  This method normalizes those for you.",
	sequence => array(4),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["hasclass"] = array(
	name => "Using hasClass",
	modules => array("dom"),
	description => "This method allows you to test for the presence of a <code>className</code> on an HTMLElement.",
	sequence => array(5),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["removeclass"] = array(
	name => "Using removeClass",
	modules => array("dom"),
	description => "This method allows you to remove a <code>className</code> from an HTMLElement.",
	sequence => array(7),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["addclass"] = array(
	name => "Using addClass",
	modules => array("dom"),
	description => "This method allows you to add a className to an HTMLElement.",
	sequence => array(6),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["getelementsbyclassname"] = array(
	name => "Using getElementsByClassName",
	modules => array("dom"),
	description => "This method allows you select all of the HTMLElements on a given page that share a specific <code>className</code>.",
	sequence => array(8),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["dom-explorer"] = array(
	name => "Exploring the Dom Collection's API",
	modules => array("dom"),
	description => "The Dom Collection Explorer allows you to interact with some of the oft-used element-targeting functions in the YUI Dom Collection.",
	sequence => array(9),
	logger => array("dom", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true,
	bodyclass => false,
	byline => "This example was contributed by <a href='http://www.wait-till-i.com/'>Christian Heilmann</a> and members of his <a href='http://yuiblog.com/blog/2007/12/06/juku/'>Juku</a> training class at Yahoo.",
);
?>
