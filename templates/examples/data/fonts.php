<?php

/*Fonts CSS:*/
$modules["fonts"] = array(
							"name" => "Fonts CSS",
							"type" => "css",
							"description" => "The foundational YUI Fonts CSS file offers cross-browser typographical normalization and control.", /*this description appears on the component's examples index page*/
							"cheatsheet" => "css.pdf"
						);
						

/*YUI Fonts CSS:*/

$examples["fonts-simple"] = array(
  name => "Basic Test Suite for YUI Fonts",
  modules => array("fonts"),
  description => "Put Fonts on a page to achieve consistent font-styling and line-height characteristics.",
  sequence => array(1),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("fonts"),
  highlightSyntax => true
);

$examples["fonts-size"] = array(
  name => "Setting the font size",
  modules => array("fonts"),
  description => "Use percentages to specify font sizes when using YUI Fonts.",
  sequence => array(2),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("fonts"),
  highlightSyntax => true
);

$examples["fonts-family"] = array(
  name => "Setting the font family",
  modules => array("fonts"),
  description => "Specify the font family you want and let YUI Fonts handle alternative fallback font-families.",
  sequence => array(3),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("fonts"),
  highlightSyntax => true
);

?>