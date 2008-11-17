<?php
/*AutoComplete Module:*/
$modules["autocomplete"] = array(
							"name" => "AutoComplete Control",
							"type" => "widget",
							"description" => "AutoComplete is a powerful interaction pattern that leverages both the power of the server and the power of the client.  Examples here show how to use server-side completion engines, client-side completion engines, and rich visualizations within your suggestion container.", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);

/*AutoComplete Examples*/

$examples["ac_basic_array"] = array(
	name => "Basic Local Data",
	modules => array("autocomplete", "datasource"),
	description => "Demonstrates the use of a manageably large JavaScript array to provide responsive, in-memory AutoComplete functionality without relying on a server-side component.",
	sequence => array(2, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_basic_xhr"] = array(
	name => "Basic Remote Data",
	modules => array("autocomplete", "datasource"),
	description => "Uses an XHRDataSource to point to an online script serving delimited text data",
	sequence => array(4, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_xhr_customrequest"] = array(
	name => "Customizing Remote Requests",
	modules => array("autocomplete", "datasource"),
	description => "Uses an XHRDataSource plus a local proxy to point to the Yahoo! Search webservice. The generateRequest() method must be customized to comply with the third-party API.",
	sequence => array(6, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("connection", "animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_formatting_proxyless"] = array(
	name => "Custom Formatting, with a Proxyless Remote DataSource",
	modules => array("autocomplete", "datasource"),
	description => "Uses a ScriptNodeDataSource to point to the Yahoo! Autdio Search webservice without a proxy. The generateRequest() method must be customized to comply with the third-party API. A custom formatResults() method has been defined to show thumbnail images within the results container.",
	sequence => array(8, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("get", "animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_itemselect"] = array(
	name => "Searching Field A, Submitting Field B with itemSelectEvent",
	modules => array("autocomplete", "datasource"),
	description => "Uses itemSelectEvent to allow the user to search by name, but sumbits ID for the server to consume.",
	sequence => array(10, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_combobox"] = array(
	name => "Combo Box",
	modules => array("autocomplete", "datasource", "button"),
	description => "Combobox example also demonstrates CSS required to support multiple stacked instances.",
	sequence => array(12, 50, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "button", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_tags_alwaysshow"] = array(
	name => "Tagging Example with alwaysShowContainer",
	modules => array("autocomplete", "datasource"),
	description => "Uses alwaysShowContainer to display and filter tags.",
	sequence => array(14, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_fn_multfields"] = array(
	name => "Custom Function to Search Different Fields at Runtime",
	modules => array("autocomplete", "datasource"),
	description => "Searches different fields of a two-dimensional array on the fly",
	sequence => array(16, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_ysearch_json"] = array(
	name => "Centering AutoComplete On a Page",
	modules => array("autocomplete"),
	description => "Illustrates how to customize AutoComplete to be centered on a page.",
	sequence => array(18),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "connection", "json", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_ysearch_flat"] = array(
	name => "Subset Matching",
	modules => array("autocomplete"),
	description => "Demonstrates how queryMatchSubset can be enabled to maximize caching. Note the custom CSS that is needed for stacking AutoComplete instances.",
	sequence => array(20),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "connection", "datasource", "autocomplete"),
	highlightSyntax => true
);


$examples["ac_flickr_xml"] = array(
	name => "Find Photos on Flickr",
	modules => array("autocomplete", "datasource"),
	description => "Uses AutoComplete to find photos on Flickr by tag, and keeps a collection of selected photos on the page.",
	sequence => array(22, 50),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "connection", "datasource", "autocomplete"),
	highlightSyntax => true
);

$examples["ac_customize"] = array(
	name => "Configurations Dashboard",
	modules => array("autocomplete"),
	description => "An interactive dashboard that allows you to manipulate many of AutoComplete's built-in configuration options and explore the impact of those changes on the UI.",
	sequence => array(24),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("animation", "connection", "datasource", "autocomplete"),
	highlightSyntax => false
);

$examples["ac_skinning"] = array(
	name => "Skinning Model",
	modules => array("autocomplete"),
	description => "Explanation of AutoComplete's skinning model.",
	sequence => array(26),
	logger => array("datasource", "autocomplete"),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("datasource", "autocomplete"),
	highlightSyntax => true
);

?>
