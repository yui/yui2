<?php
/*Charts Module:*/
$modules["charts"] = array(
							"name" => "Charts Control (experimental)",
							"type" => "widget",
							"description" => "The Charts Control allows you to draw data from a DataSource instance and visualize that data using a Flash (.swf) charting engine.", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);

/*Charts Examples*/

$examples["charts-quickstart"] = array(
	name => "Charts Quickstart Example",
	modules => array("charts"),
	description => "A demonstration of the Chart control's basic features.",
	sequence => array(0),
	logger => array("charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "datasource", "charts"),
	highlightSyntax => true
);

$examples["charts-legend"] = array(
	name => "Chart with Legend Example",
	modules => array("charts"),
	description => "Creates a PieChart with an HTML legend.",
	sequence => array(1),
	logger => array("datasource", "charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "datasource", "charts"),
	highlightSyntax => true
);

$examples["charts-skins"] = array(
	name => "Skinning a Chart Example",
	modules => array("charts"),
	description => "Modifies the Chart control's styles to give it a custom appearance.",
	sequence => array(2),
	logger => array("charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "datasource", "charts"),
	highlightSyntax => true
);

$examples["charts-datatable"] = array(
	name => "Chart and DataTable Example",
	modules => array("charts"),
	description => "A Chart and a DataTable share the same DataSource.",
	sequence => array(3),
	logger => array("charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "datasource", "datatable", "charts"),
	highlightSyntax => true
);

$examples["charts-xhr-polling"] = array(
	name => "Chart with DataSource Polling",
	modules => array("charts"),
	description => "A Chart polls a DataSource that frequently loads new data through XHR.",
	sequence => array(4),
	logger => array("charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "connection", "datasource", "charts"),
	highlightSyntax => true
);

$examples["charts-stacked"] = array(
	name => "Stacked Bar Chart",
	modules => array("charts"),
	description => "Creates a StackedBarChart",
	sequence => array(5),
	logger => array("charts"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("yahoo", "dom", "event", "json", "element", "datasource", "charts"),
	highlightSyntax => true
);
?>
