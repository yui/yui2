<?php

/*Menu Module:*/
$modules["menu"] = array(
							"name" => "Menu Family",
							"type" => "widget",
							"description" => "<p>The Menu family of components features a collection of controls that make it easy to add menus to your website or web application.  With the Menu Controls you can create website fly-out menus, customized context menus, or application-style menu bars with just a small amount of scripting.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

$examples["example01"] = array(
	name => "Basic Menu From Markup",
	modules => array("menu"),
	description => "Basic Menu From Markup",
	sequence => array(1),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example02"] = array(
	name => "Basic Menu From JavaScript",
	modules => array("menu"),
	description => "Basic Menu From JavaScript",
	sequence => array(2),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example03"] = array(
	name => "Grouped Menu Items Using Markup",
	modules => array("menu"),
	description => "Grouped Menu Items Using Markup",
	sequence => array(3),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example04"] = array(
	name => "Grouped Menu Items Using JavaScript",
	modules => array("menu"),
	description => "Grouped Menu Items Using JavaScript",
	sequence => array(4),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example05"] = array(
	name => "Grouped Menu Items With Titles From Markup",
	modules => array("menu"),
	description => "Grouped Menu Items With Titles From Markup",
	sequence => array(5),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example06"] = array(
	name => "Grouped Menu Items With Titles From JavaScript",
	modules => array("menu"),
	description => "Grouped Menu Items With Titles From JavaScript",
	sequence => array(6),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example07"] = array(
	name => "Multi-tiered Menu From Markup",
	modules => array("menu"),
	description => "Multi-tiered Menu From Markup",
	sequence => array(7),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example08"] = array(
	name => "Multi-tiered Menu From JavaScript",
	modules => array("menu"),
	description => "Multi-tiered Menu From JavaScript",
	sequence => array(8),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example09"] = array(
	name => "Handling Menu Click Events",
	modules => array("menu"),
	description => "Handling Menu Click Events",
	sequence => array(9),
	logger => array("menu", "example"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example10"] = array(
	name => "Listening For Menu Events",
	modules => array("menu"),
	description => "Listening For Menu Events",
	sequence => array(10),
	logger => array("menu", "example"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example11"] = array(
	name => "MenuItem Configuration Properties",
	modules => array("menu"),
	description => "MenuItem Configuration Properties",
	sequence => array(11),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "default",
	requires => array("menu"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["example12"] = array(
	name => "Setting Menu Configuration Properties At Runtime",
	modules => array("menu"),
	description => "Setting Menu Configuration Properties At Runtime",
	sequence => array(12),
	logger => array("menu", "example"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array("menu"),	
	highlightSyntax => true,
	bodyclass => false
);

$examples["leftnavfrommarkup"] = array(
	name => "Website Left Nav With Submenus Built From Markup",
	modules => array("menu", "grids"),
	description => "Website Left Nav With Submenus Built From Markup",
	sequence => array(13, 51),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["leftnavfromjs"] = array(
	name => "Website Left Nav With Submenus From JavaScript",
	modules => array("menu", "grids"),
	description => "Website Left Nav With Submenus From JavaScript",
	sequence => array(14, 52),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	highlightSyntax => true,
	bodyclass => false
);

$examples["topnavfrommarkup"] = array(
	name => "Website Top Nav With Submenus Built From Markup",
	modules => array("menu", "grids"),
	description => "Website Top Nav With Submenus Built From Markup",
	sequence => array(15, 53),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["topnavfromjs"] = array(
	name => "Website Top Nav With Submenus From JavaScript",
	modules => array("menu", "grids"),
	description => "Website Top Nav With Submenus From JavaScript",
	sequence => array(16, 54),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids", "yuiloader", "button"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["leftnavfrommarkupwithanim"] = array(
	name => "Website Left Nav Using Animation With Submenus Built From Markup",
	modules => array("menu", "grids"),
	description => "Website Left Nav Using Animation With Submenus Built From Markup",
	sequence => array(17, 55),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["leftnavfromjswithanim"] = array(
	name => "Website Left Nav Using Animation With Submenus From JavaScript",
	modules => array("menu", "grids"),
	description => "Website Left Nav Using Animation With Submenus From JavaScript",
	sequence => array(18, 56),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["topnavfrommarkupwithanim"] = array(
	name => "Website Top Nav Using Animation With Submenus Built From Markup",
	modules => array("menu", "grids"),
	description => "Website Top Nav Using Animation With Submenus Built From Markup",
	sequence => array(19, 57),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["topnavfromjswithanim"] = array(
	name => "Website Top Nav Using Animation With Submenus From JavaScript",
	modules => array("menu", "grids"),
	description => "Website Top Nav Using Animation With Submenus From JavaScript",
	sequence => array(20, 58),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids","animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["contextmenu"] = array(
	name => "Context Menu",
	modules => array("menu"),
	description => "Context Menu",
	sequence => array(21),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tablecontextmenu"] = array(
	name => "Adding A Context Menu To A Table",
	modules => array("menu"),
	description => "Adding A Context Menu To A Table",
	sequence => array(22),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "grids"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["treeviewcontextmenu"] = array(
	name => "Adding A Context Menu To A TreeView",
	modules => array("menu", "treeview"),
	description => "Adding A Context Menu To A TreeView",
	sequence => array(23, 50),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["programsmenu"] = array(
	name => "OS-Style Programs Menu",
	modules => array("menu", "container"),
	description => "OS-Style Programs Menu",
	sequence => array(24, 60),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "container", "utilities"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["applicationmenubar"] = array(
	name => "Application Menubar",
	modules => array("menu", "container"),
	description => "Application Menubar",
	sequence => array(25, 61),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts", "container", "utilities"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["menuwaiaria"] = array(
	name => "Using the Menu ARIA Plugin",
	modules => array("menu"),
	description => "The Menu ARIA Plugin makes it easy to use the WAI-ARIA Roles and States with the Menu family of controls.",
	sequence => array(26),
	logger => array(),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("menu", "reset", "fonts"),
	highlightSyntax => true,
	bodyclass => false
);
?>