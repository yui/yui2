<?php

/*TreeView Module:*/
$modules["treeview"] = array(
							"name" => "TreeView Control",
							"type" => "widget",
							"description" => "<p>The YUI TreeView Control provides a rich, compact visual presentation of hierarchical node data.  Support is provided for several common node types, for the association of custom metadata with each node, and for the dynamic loading of node data to navigate large datasets with a small initial payload.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*TreeView Control Examples*/
$examples["default_tree"] = array(
	name => "Default TreeView", /*title of example*/
	modules => array("treeview"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "This example creates a simple tree with default settings and randomly populates its nodes.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("treeview", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "default", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("treeview"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false
);


$examples["dynamic_tree"] = array(
	name => "Dynamically Loading Node Data",
	modules => array("treeview", "connection"),
	description => "You can improve the rendering time of your TreeView control by deferring the loading of child nodes until they are requested.  When a node expands, you can use <a href='http://developer.yahoo.com/yui/connection'>the YUI Connection Manager</a> to retrieve information via XMLHttpRequest about that node's children.",
	sequence => array(2, 50),
	logger => array("treeview", "connection", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "treeview"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["folder_style"] = array(
	name => "Folder-Style TreeView Design",
	modules => array("treeview"),
	description => "By using an alternative CSS file, you can modify the appearance of the TreeView Control; in this example, the TreeView implements a folder-style iconography.",
	sequence => array(3),
	logger => array("treeview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["menu_style"] = array(
	name => "Menu-Style TreeView Design",
	modules => array("treeview"),
	description => "By using an alternative CSS file, you can modify the appearance of the TreeView Control; in this example, the TreeView implements a menu-style iconography.  It also makes use of the Menu Node, in which only one child at each depth level can remain open.",
	sequence => array(4),
	logger => array("treeview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["customicons"] = array(
	name => "Using TreeView with Custom Icons",
	modules => array("treeview"),
	description => "Applying a specific label style to each node allows you to customize the icons that each node displays.",
	sequence => array(5),
	logger => array("treeview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tasklist"] = array(
	name => "Custom TreeView with Check Boxes",
	modules => array("treeview"),
	description => "In this example, the TreeView icons are represented by checkboxes allowing for a task-list-style display.",
	sequence => array(6),
	logger => array("treeview", "example"),
	loggerInclude => "require", 
	newWindow => "suppress",
	requires => array("treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tv_tooltip"] = array(
	name => "TreeView with Tooltips",
	modules => array("treeview"),
	description => "In this example, the a single Tooltip is configured to work with all of the nodes in the tree.",
	sequence => array(7),
	logger => array("treeview", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("treeview", "container"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tv-markup"] = array(
	name => "Three Ways to Define a TreeView: Markup (Progressive Enhancement), Existing TreeView Instance, and Object Literal ",
	modules => array("treeview"),
	description => "TreeView supports a number of different inputs for creating the node structure, including consuming existing markup on the page.  This example takes you through three common mechanisms for defining a TreeView.",
	sequence => array(8),
	logger => array("treeview", "example"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("treeview"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["tv-edit"] = array(
	name => "Inline Editing of TreeView Node Labels",
	modules => array("treeview"),
	description => "TreeView has intrinsic support for user-editing of node labels.  This example explores the interaction model for inline editing with TreeView.  It also illustrates the use of a special date-editor class that leverages the <a href='http://developer.yahoo.com/yui/calendar/'>YUI Calendar Control</a>.",
	sequence => array(9),
	logger => array("calendar","treeview", "example"),
	loggerInclude => "require", 
	newWindow => "default",
	requires => array("calendar","treeview"),
	highlightSyntax => true,
	bodyclass => false
);

?>
