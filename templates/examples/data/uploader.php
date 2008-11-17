<?php
/*Uploader Module:*/
$modules["uploader"] = array(
	"name" => "Uploader Control (experimental)",
	"type" => "widget",
	"description" => "<p>The <a href='http://developer.yahoo.com/yui/uploader/'>YUI Uploader Control</a> provides file upload functionality that goes beyond the basic browser-based methods, including integral support for multiple-file upload and progress tracking.</p>", /*this description appears on the component's examples index page*/
	"cheatsheet" => true
);

/*Uploader Examples*/

$examples["uploader-simple-button"] = array(
	name => "Simple Uploader Example With Button UI",
	modules => array("uploader"),
	description => "A demonstration of core features of the Uploader Control. In this example, the Uploader control is rendered as a sprite-skinned button. The user is allowed to select a single file and upload it to a specified location. The upload progress is tracked and reported back to the user.",
	sequence => array(0),
	logger => array("uploader"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array('uploader'),
	highlightSyntax => true
);

$examples["uploader-advanced-queue"] = array(
	name => "Advanced Uploader Example With Transparent UI and Automatic Queue Management",
	modules => array("uploader"),
	description => "This advanced Uploader example is rendered as a transparent overlay UI over a text link. The uploader allows the user to upload multiple files, using built-in queue management, and reports back progress.",
	sequence => array(1),
	logger => array("uploader"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array('uploader', 'datasource', 'datatable'),
	highlightSyntax => true
);

$examples["uploader-advanced-postvars"] = array(
	name => "Advanced Uploader Example With Additional POST Variables and Server Data Return",
	modules => array("uploader"),
	description => "This advanced Uploader example is rendered as a transparent overlay UI over a text link. It allows the user to upload a single file, along with additional POST variables, and displays the data returned back from the server.",
	sequence => array(1),
	logger => array("uploader"),
	loggerInclude => "require",
	newWindow => "default",
	requires => array('uploader'),
	highlightSyntax => true
);

?>
