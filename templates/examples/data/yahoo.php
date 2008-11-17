<?php

/*Yahoo Global object:*/
$modules["yahoo"] = array(
    "name" => "YAHOO Global Object",
    "type" => "core",
    "description" => "<p>The YAHOO Global Object lives at the top of the namespace tree for all YUI components.  It also includes some utility methods for type-checking, user-agent detection, and module extension.</p>"
);

/*Yahoo Global obect Examples*/
$examples["yahoo_type_checking"] = array(
    name => "Type-Checking Your Data",
    modules => array("yahoo"),
    description => "Use the <code>YAHOO.lang</code> type checking methods to deal with unpredictable data",
    sequence => array(1),
    logger => array(),
    loggerInclude => "suppress", 
    newWindow => "default",
    requires => array("dom","event"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["yahoo_ua_detection"] = array(
    name => "User Agent Detection",
    modules => array("yahoo"),
    description => "<code>YAHOO.env.ua</code> can tell you with some accuracy which browser your page is being viewed in.",
    sequence => array(2),
    logger => array("yahoo", "example"),
    loggerInclude => "default", 
    newWindow => "default",
    requires => array("event", "dom", "dragdrop"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["yahoo_extend"] = array(
    name => "Creating Class Hierarchies with <code>YAHOO.lang.extend</code>",
    modules => array("yahoo"),
    description => "Leverage class inheritance in an object-oriented architecture.",
    sequence => array(3),
    logger => array(),
    loggerInclude => "suppress", 
    newWindow => "suppress",
    requires => array(),
    highlightSyntax => true,
    bodyclass => false
);

$examples["yahoo_augment_proto"] = array(
    name => "Creating a Composition-Based Class Structure Using <code>YAHOO.lang.augmentProto</code>",
    modules => array("yahoo"),
    description => "Use <code>YAHOO.lang.augmentProto</code> to help modularize class behaviors.",
    sequence => array(4),
    logger => array(),
    loggerInclude => "suppress", 
    newWindow => "suppress",
    requires => array("dom", "event"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["yahoo_augment_object"] = array(
    name => "Add Behavior to Objects or Static Classes with <code>YAHOO.lang.augmentObject</code>",
    modules => array("yahoo"),
    description => "Use <code>augmentObject</code> to extend static classes, object literals, or class instances.",
    sequence => array(5),
    logger => array(),
    loggerInclude => "suppress", 
    newWindow => "suppress",
    requires => array(),
    highlightSyntax => true,
    bodyclass => false
);

$examples["yahoo_merge"] = array(
    name => "Combining Simple Data Sets with <code>YAHOO.lang.merge</code>",
    modules => array("yahoo"),
    description => "Merge several objects, creating a unique set.",
    sequence => array(6),
    logger => array("yahoo", "example"),
    loggerInclude => "require", 
    newWindow => "suppress",
    requires => array('dom','event'),
    highlightSyntax => true,
    bodyclass => false
);

?>
