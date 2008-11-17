<?php

/*Reset CSS:*/
$modules["reset"] = array(
							"name" => "Reset CSS",
							"type" => "css",
							"description" => "<p>The foundational YUI Reset CSS file creates a level playing field across <a href='http://developer.yahoo.com/yui/articles/gbs/'>A-grade browsers</a> and provides a starting point from which you can explicitly declare your intentions. It normalizes the default rendering of all HTML elements, for example it sets margin, padding, and border to 0, font sizes to YUI Font's default, italic and bold styles to normal, and list-style to none.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => "css.pdf"
						);	
						
/*YUI Reset CSS:*/

$examples["reset-simple"] = array(
  name => "Basic Test Suite for YUI Reset",
  modules => array("reset"),
  description => "YUI Reset is the lowest-level member of YUI's CSS suite. It normalizes the rendering of HTML elements and provides a level playing field upon which to write CSS.",
  sequence => array(1),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset"),
  highlightSyntax => true
);

?>