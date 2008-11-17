<?php

/*Selector Module:*/
$modules["selector"] = array(
    "name" => "Selector Utility",
    "type" => "utility",
    "description" => "<p>The Selector Utility provides convenient methods for retrieving, testing, and filtering DOM elements using CSS Selectors.</p>",
    "cheatsheet" => true
);	

/*Selector Examples*/
$examples["query"] = array(
	name => "Using query",
	modules => array("selector"),
	description => "The <code>query</code> method retrieves an array of DOM elements that match the provided selector.",
	sequence => array(1),
	logger => array("selector", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "selector"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["filter"] = array(
	name => "Using filter",
	modules => array("selector"),
	description => "The <code>filter</code> method filters a collection of nodes based on the provided selector.",
	sequence => array(2),
	logger => array("selector", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "selector"),
	highlightSyntax => true,
	bodyclass => false
);
?>
