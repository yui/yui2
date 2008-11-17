<?php
/*Paginator widget:*/
$modules["paginator"] = array(
    "name" => "Paginator",
    "type" => "widget",
    "description" => "<p>The YUI Paginator Control provides a stable pagination mechanism and a suite of navigation controls to allow you to break up your content into discreet sections.  The paging controls are fully stylable.  Other YUI controls (including the DataTable Control)  leverage the Paginator Control to providing paging support.</p>",
    "cheatsheet" => false
);

/*Paginator Examples*/
$examples["pag_getting_started"] = array(
	name => "Getting started with Paginator",
	modules => array("paginator"),
	description => "A demonstration of the basic setup of a Paginator.",
	sequence => array(0),
	logger => array("paginator"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("paginator"),
	highlightSyntax => true
);

$examples["pag_multiple_containers"] = array(
	name => "Rendering controls into multiple containers",
	modules => array("paginator"),
	description => "A demonstration of how Paginator keeps all controls in sync.",
	sequence => array(1),
	logger => array("paginator"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("paginator"),
	highlightSyntax => true
);

$examples["pag_manual_render"] = array(
	name => "Manually rendering Paginator UI Components",
	modules => array("paginator"),
	description => "A demonstration of the basic setup of a Paginator.",
	sequence => array(2),
	logger => array("paginator"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("paginator"),
	highlightSyntax => true
);

$examples["pag_configuration"] = array(
	name => "Configuring the Paginator",
	modules => array("paginator","datatable"),
	description => "Exhibition of Paginator instance configuration.",
	sequence => array(3,25),
	logger => array("paginator","datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("paginator","datatable"),
	highlightSyntax => true
);

/*
$examples["pag_custom_component"] = array(
	name => "Creating a Paginator UI Component",
	modules => array("paginator"),
	description => "Advanced Example.  Creating a custom Paginator UI Component - jump to page input.",
	sequence => array(4),
	logger => array("paginator"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("paginator"),
	highlightSyntax => true
);
*/

?>
