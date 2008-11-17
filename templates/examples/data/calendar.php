<?php
/*Calendar Module*/
$modules["calendar"] = array(
		"name" => "Calendar Control",
		"type" => "widget",
		"description" => "The Calendar component is a UI control that enables users to choose one or more dates from a graphical calendar presented in a single-page or multi-page interface. Calendars are generated entirely via script and can be navigated without any page refreshes. They are also highly configurable, with the ability to customize the contents and look of rendered cells using custom renderer plugins.",
		"cheatsheet" => true
);

/*Calendar Examples*/
$examples["quickstart"] = array(
	name => "Quickstart Tutorial",
	modules => array("calendar"),
	description => "Quickly get up and running with the most basic Calendar.",
	sequence => array(1),
	logger => array("calendar"),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["multi"] = array(
	name => "Multi-Select Calendar",
	modules => array("calendar"),
	description => "Set up a Calendar that allows for the selection of one or more dates, rather than the single-select default.",
	sequence => array(2),
	logger => array("calendar"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["calgrp"] = array(
	name => "Multi-Page Calendar",
	modules => array("calendar"),
	description => "Setting up a CalendarGroup to display more than one month at a time.",
	sequence => array(3),
	logger => array("calendar"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["minmax"] = array(
	name => "Minimum/Maximum Dates",
	modules => array("calendar"),
	description => "Configure the Calendar to disallow selection before or beyond specified date limits.",
	sequence => array(4),
	logger => array("calendar"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["calnavigator"] = array(
	name => "Calendar Navigator",
	modules => array("calendar"),
	description => "Enable the Calendar Navigator, to allow the user to jump straight to a specific month/year",
	sequence => array(5),
	logger => array("calendar"),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["events"] = array(
	name => "Handling Calendar Events",
	modules => array("calendar"),
	description => "Use Calendar's events to react to various interesting moments, such as the selection or deselection of dates.",
	sequence => array(6),
	logger => array("calendar"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["formtxt"] = array(
	name => "Calendar and Text Fields",
	modules => array("calendar"),
	description => "Populate a form's text input field using the Calendar's selected date and vice versa.",
	sequence => array(7),
	logger => array("calendar"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["formsel"] = array(
	name => "Calendar and Select Fields",
	modules => array("calendar"),
	description => "Populate a series of form select input fields using the Calendar's selected date and vice versa.",
	sequence => array(8),
	logger => array("calendar"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["render"] = array(
	name => "Using the Render Stack",
	modules => array("calendar"),
	description => "Customize how specific dates or date ranges are rendered by plugging in custom renderers.",
	sequence => array(9),
	logger => array("calendar"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["popup"] = array(
	name => "Popup Calendar",
	modules => array("calendar"),
	description => "Configure either Calendar or CalendarGroup for use as a popup layer that is displayed above the document.",
	sequence => array(10),
	logger => array("calendar"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["germany"] = array(
	name => "Localization - Germany",
	modules => array("calendar"),
	description => "Use localization features to customize the Calendar for use in Germany.",
	sequence => array(11),
	logger => array("calendar"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["japan"] = array(
	name => "Localization - Japan",
	modules => array("calendar"),
	description => "Use localization features to customize the CalendarGroup for use in Japan.",
	sequence => array(12),
	logger => array("calendar"),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("calendar"),
	highlightSyntax => true
);

$examples["calcontainer"] = array(
	name => "Calendar inside a Container",
	modules => array("calendar", "container"),
	description => "This example wraps Calendar in a Dialog control to provide positioning, button and potentially dragdrop support",
	sequence => array(13, 50),
	logger => array("calendar"),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("dragdrop", "button", "container", "calendar"),
	highlightSyntax => true
);

$examples["intervalcal"] = array(
    name => "Interval Selection Calendar",
    modules => array("calendar"),
    description => "This example provides an IntervalCalendar class, a custom version of CalendarGroup which can be used to select start and end dates for date intervals.",
    byline => "The <code>IntervalCalendar</code> class and example is based on the <a target=\"_blank\" href=\"http://blogs.whardy.com/john/2008/05/27/interval-calendar-control/\"><code>iCalendarGroup</code></a> class, graciously contributed to YUI by John Peloquin, of <a target=\"_blank\" href=\"http://www.whardy.com/\">W. Hardy Interactive, Inc.</a>.",
    sequence => array(13),
    logger => array("calendar"),
    loggerInclude => "suppress",
    newWindow => "default",
    requires => array("calendar"),
    highlightSyntax => true
);



$examples["calskin"] = array(
	name => "Skinning The Calendar",
	modules => array("calendar"),
	description => "YUI has a default skin for it's controls called \"Sam Skin\". This example shares the CSS rules which make up \"Sam Skin\" for the Calendar and CalendarGroup controls.",
	sequence => array(14),
	logger => array("calendar"),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("calendar"),
	highlightSyntax => true
);
?>
