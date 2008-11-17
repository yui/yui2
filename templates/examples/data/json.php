<?php

$modules["json"] = array(
	"name" => "JSON Utility",
	"type" => "utility",
	"description" => "<p>The JSON Utility provides methods for transforming data between native JavaScript objects and their JSON string equivalent.</p>",
	"cheatsheet" => true
						);	

$examples["json_connect"] = array(
	name => "JSON with Connection Manager",
	modules => array("json"),
	description => "Use the JSON Utility to parse data received from Connection Manager calls",
	sequence => array(1),
	logger => array("json", "example"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array("dom","event","json", "connection"),
	highlightSyntax => true,
	bodyclass => false
);

?>
