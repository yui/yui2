<?php

/*ProfilerViewer Control Module:*/
$modules["profilerviewer"] = array(
    "name" => "ProfilerViewer Control (beta)", 
    "type" => "tool",
    "description" => "<p>The ProfilerViewer Control provides a rich graphical interface through which to explore JavaScript profiling done using the <a href='http://developer.yahoo.com/yui/profiler'>YUI Profiler</a>  The Profiler and the ProfilerViewer are both generic; while each uses YUI, they can be used to profile code unrelated to YUI &mdash; even code included with or based upon other JavaScript libraries.</p>",
    "cheatsheet" => true
);  

/*ProfilerViewer Control Examples*/
$examples["pv-basic"] = array(
    name => "Simple Profiling",
    modules => array("profilerviewer", "calendar"),
    description => "A simple use case profiling a <a href='http://developer.yahoo.com/yui/calendar'>Calendar Control</a> instance with the ProfilerViewer Control.",
    sequence => array(1, 100),
    logger => array("profilerviewer"),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("profilerviewer", "calendar"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["pv-api"] = array(
    name => "Using the ProfilerViewer API while Profiling the YUI Menu Control",
    modules => array("profilerviewer", "menu"),
    description => "In this example, profiling a simple set of menus and submenus, ProfilerViewer's API is leveraged to place the console in a floating, draggable palette.",
    sequence => array(2, 100),
    logger => array("profilerviewer"),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("profiler", "profilerviewer", "menu"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["pv-bootstrap"] = array(
    name => "Using Profiler and ProfilerViewer to Profile non-YUI Code",
    modules => array("profilerviewer"),
    description => "This example explores the best strategy for using YUI to profile projects that are not YUI-based; it shows you how to load only the minimal YUI footprint during profiling, deferring the loading of ProfilerViewer (and its YUI dependencies) until you're ready to view the profiling data.",
    sequence => array(3),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("yuiloader", "profiler"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["pv-skin"] = array(
    name => "Skinning the ProfilerViewer Control",
    modules => array("profilerviewer"),
    description => "ProfilerViewer's 'skin' is provided via a combination of CSS and other style information passed via JavaScript to the Flash-based <a href='http://developer.yahoo.com/yui/charts'>Charts Control</a>.  This example helps you understand where to start if you want to customize the look and feel of a ProfilerViewer implementation.",
    sequence => array(4),
    logger => array(),
    loggerInclude => "suppress",
    newWindow => "suppress",
    requires => array("profilerviewer"),
    highlightSyntax => true,
    bodyclass => false
);

$examples["pv-spanish"] = array(
    name => "ProfilerViewer Internationalization: Spanish",
    modules => array("profilerviewer"),
    description => "The ProfilerViewer Control can be easily internationalized by modifying the <code>STRINGS</code> member of <code>YAHOO.widget.ProfilerViewer</code>  In this example, a Spanish translation provided by Caridy Pati&ntilde;o Mayea is applied to the UI.",
    sequence => array(10),
    logger => array("profilerviewer"),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("profilerviewer", "calendar"),
    highlightSyntax => true,
    bodyclass => false
);

/*$examples["pv-chinese"] = array(
    name => "ProfilerViewer Internationalization: Chinese",
    modules => array("profilerviewer"),
    description => "The ProfilerViewer Control can be easily internationalized by modifying the <code>STRINGS</code> member of <code>YAHOO.widget.ProfilerViewer</code>  In this example, a Chinese translation provided by Hongweng Zei is applied to the UI.",
    sequence => array(11),
    logger => array("profilerviewer"),
    loggerInclude => "default",
    newWindow => "require",
    requires => array("profilerviewer", "calendar"),
    highlightSyntax => true,
    bodyclass => false
);*/

$examples["pv-german"] = array(
    name => "ProfilerViewer Internationalization: German",
    modules => array("profilerviewer"),
    description => "The ProfilerViewer Control can be easily internationalized by modifying the <code>STRINGS</code> member of <code>YAHOO.widget.ProfilerViewer</code>  In this example, a German translation provided by Christian Heilmann is applied to the UI.",
    sequence => array(11),
    logger => array("profilerviewer"),
    loggerInclude => "suppress",
    newWindow => "require",
    requires => array("profilerviewer", "calendar"),
    highlightSyntax => true,
    bodyclass => false
);
?>
