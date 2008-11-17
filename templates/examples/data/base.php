<?php

/*Base CSS:*/
$modules["base"] = array(
							"name" => "Base CSS",
							"type" => "css",
							"description" => "", /*this description appears on the component's examples index page*/
							"cheatsheet" => "css.pdf"
						);	

/*YUI Base CSS:*/

$examples["base-simple"] = array(
  name => "Basic Test Suite for YUI Base",
  modules => array("base"),
  description => "YUI Base CSS provides a consistent and legible rendering of HTML elements; this example gives you a straightforward look at how Base styles common HTML elements.",
  sequence => array(1),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset","fonts","base"),
  highlightSyntax => true
);

$examples["base-in-doc"] = array(
  name => "YUI Base, 750px",
  modules => array("base"),
  description => "Base CSS and the full YUI CSS Foundation in a 750px-wide YUI CSS Grid.",
  sequence => array(2),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset","fonts","grids","base"),
  highlightSyntax => true
);

$examples["base-in-doc2"] = array(
  name => "YUI Base, 950px",
  modules => array("base"),
  description => "Base CSS and the full YUI CSS Foundation in a 950px-wide YUI CSS Grid.",
  sequence => array(3),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset","fonts","grids","base"),
  highlightSyntax => true
);

$examples["base-in-doc4"] = array(
  name => "YUI Base, 974px",
  modules => array("base"),
  description => "Base CSS and the full YUI CSS Foundation in a 974px-wide YUI CSS Grid.",
  sequence => array(4),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset","fonts","grids","base"),
  highlightSyntax => true
);

$examples["base-in-doc3"] = array(
  name => "YUI Base, 100%",
  modules => array("base"),
  description => "Base CSS and the full YUI CSS Foundation in a 100%-of-page-width YUI CSS Grid.",
  sequence => array(5),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset","fonts","grids","base"),
  highlightSyntax => true
);

?>