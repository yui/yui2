<?php

/*Get Utility Module:*/
$modules["get"] = array(
    "name" => "Get Utility", 
    "type" => "utility",
    "description" => "<p>The Get Utility provides a convenient API for appending script nodes and CSS files to an existing DOM.  This can be useful when loading functionality on-demand; it's also useful when retrieving JSON data feeds across trusted but non-identical domains.</p>",
    "cheatsheet" => true
);  

/*Get Utility Examples*/
$examples["get-script-simple"] = array(
    name => "Quickstart Example: Getting a Script File with YUI Get",
    modules => array("get"),
    description => "This example illustrates the simplest use case in which the Get Utility is used to retrieve a script file.",
    sequence => array(1),
    logger => array("get"),
    loggerInclude => "require",
    newWindow => "default",
    requires => array("button", "get"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["get-script-basic"] = array(
    name => "Getting a Script Node with JSON Data from a Web Service",
    modules => array("get"),
    description => "This example shows how to retrieve JSON data from a web service using the YUI Get Utility and how to then display that data on the page.",
    sequence => array(5),
    logger => array("get"),
    loggerInclude => "require",
    newWindow => "default",
    requires => array("button", "dom", "get"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["get-css-basic"] = array(
    name => "Getting CSS Style Sheets",
    modules => array("get", "button"),
    description => "Attach and remove stylesheets using the Get Utility.",
    sequence => array(10, 60),
    logger => array("get"),
    loggerInclude => "require",
    newWindow => "default",
    requires => array("button", "dom", "get"),
    highlightSyntax => true,
    bodyclass => false
);

?>
