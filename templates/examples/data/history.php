<?php

/* History Module */

$modules["history"] = array(
    "name" => "Browser History Manager",
    "type" => "utility",
    "description" => "<p>The YUI Browser History Manager provides a framework wherein you can tie the navigation state of a rich web page &mdash; wherein a user might perform many \"navigational\" steps while remaining within the same page &mdash to the browser's back button.</p>",
	"cheatsheet" => true
);

/* Browser History Manager Examples */

$examples["history-navbar"] = array(
    name => "Simple Navigation Bar",
    modules => array("history"),
    description => "Use the Browser History Manager to \"ajaxify\" a simple navigation bar without compromising the use of the back/forward buttons.",
    sequence => array(1),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("yahoo", "dom", "event", "connection", "history"),
    highlightSyntax => true,
	bodyclass => false
);


$examples["history-tabview"] = array(
    name => "TabView Control",
    modules => array("history"),
    description => "The Browser History Manager is used here to remember which tabs have been visited.",
    sequence => array(2),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "default",
    requires => array("yahoo", "dom", "event", "element", "tabview", "history"),
    highlightSyntax => true,
	bodyclass => false
);

$examples["history-calendar"] = array(
    name => "Calendar Control",
    modules => array("history"),
    description => "Go from month to month using the controls on the calendar widget and go back to previously viewed months using the browser's back button.",
    sequence => array(3),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "default",
    requires => array("yahoo", "dom", "event", "calendar", "history"),
    highlightSyntax => true,
	bodyclass => false
);


$examples["history-multiple"] = array(
    name => "Multiple Modules",
    modules => array("history"),
    description => "This example shows how to use the Browser History Manager with several modules on a page.",
    sequence => array(4),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "default",
    requires => array("yahoo", "dom", "event", "element", "calendar", "tabview", "history"),
    highlightSyntax => true,
	bodyclass => false
);

?>
