<?php

/*YUI Test Module:*/
$modules["yuitest"] = array(
  "name" => "YUI Test Utility",
  "type" => "tool",
  "description" => "<p>YUI Test is a JavaScript testing framework with a comprehensive assertion syntax. It is suitable for testing YUI-based code, of course, but it is expressly designed to support test-driven development across any JavaScript project, regardless of whether YUI is involved.",
  "cheatsheet" => true
);	

/*YUI Test Examples*/
$examples["yt-simple-example"] = array(
  name => "Simple Testing Example",
  modules => array("yuitest"),
  description => "Demonstrates basic usage of YUI Test for setting up and running tests.",
  sequence => array(1),
  logger => array(),
  loggerInclude => "suppress",
  newWindow => "default",
  requires => array("event","dom","logger","yuitest"),
  highlightSyntax => true
);

$examples["yt-advanced-test-options"] = array(
  name => "Advanced Test Options",
  modules => array("yuitest"),
  description => "Demonstrates how to use advanced testing features such as defining tests that should fail, tests that should be ignored, and tests that should throw an error.",
  sequence => array(2),
  logger => array(),
  loggerInclude => "suppress",
  newWindow => "default",
  requires => array("event", "dom", "logger", "yuitest"),
  highlightSyntax => true
);


$examples["yt-array-tests"] = array(
  name => "Array Processing",
  modules => array("yuitest"),
  description => "Demonstrates how to use the ArrayAssert object to test array data.",
  sequence => array(3), 
  logger => array(),
  loggerInclude => "suppress",
  newWindow => "default",
  requires => array("event", "dom", "logger","yuitest"),
  highlightSyntax => true
);

$examples["yt-async-test"] = array(
  name => "Asynchronous Testing",
  modules => array("yuitest"),
  description => "Demonstrates basic asynchronous tests.",
  sequence => array(4), 
  logger => array(),
  loggerInclude => "suppress",
  newWindow => "default",
  requires => array("event", "dom", "logger","yuitest"),
  highlightSyntax => true
);

$examples["yt-async-event-tests"] = array(
  name => "Asynchronous Event Testing",
  modules => array("yuitest"),
  description => "Demonstrates using events with asynchronous tests.",
  sequence => array(5), 
  logger => array(),
  loggerInclude => "suppress",
  newWindow => "default",
  requires => array("event", "dom", "animation", "logger","yuitest"),
  highlightSyntax => true
);

/*
$examples["dom-event-tests"] = array(
  name => "DOM Event Tests",
  modules => array("yuitest"),
  description => "Tests your browser to see what DOM Events level is supported.",
  sequence => array(4),
  loggerInclude => "suppress", 
  newWindow => "default",
  requires => array("event", "dom", "logger", "yuitest"),
  highlightSyntax => true
);

*/
?>
