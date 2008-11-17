<?php
/*Logger Module:*/
$modules["logger"] = array(
							"name" => "Logger Control",
							"type" => "tool",
							"description" => "<p>The Logger Control provides a simple way to read or write log messages with a single line of code. With this control, you can tap into the rich event-driven messages included with the YUI Library's debug files. This messaging allows you to get a fuller picture of the inner workings of any YUI Library component. The Logger Control provides a simple messaging interface that allows you to filter, pause, resume, and clear log messages on your screen. Whether or not you invoke this UI, you can monitor log output via the FireBug extension for Firefox or via the Safari JavaScript console. The Logger Control supports logging messages with customizable categories and sources. Adventurous developers can extend Logger to build their own implementations to suit any requirement.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);

/*Logger Examples*/

$examples["log_basic"] = array(
	name => "Basic Logging",
	modules => array("logger"),
	description => "Demonstrates basic logging functionality.",
	sequence => array(0),
	loggerInclude => "suppress",
	newWindow => "require",
	requires => array("yuiloader"),/*all other dependencies brought in by YUI Loader*/
	highlightSyntax => true
);

$examples["log_reading"] = array(
	name => "Configuring LogReader",
	modules => array("logger"),
	description => "LogReader configurations",
	sequence => array(1),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("dragdrop", "logger"),
	highlightSyntax => true
);

$examples["log_writing"] = array(
	name => "Using LogWriter",
	modules => array("logger"),
	description => "Use LogWriter to write logs from a custom source.",
	sequence => array(2),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("dragdrop", "logger"),
	highlightSyntax => true
);

$examples["log_autocomplete"] = array(
	name => "Logger Integration with YUI Components",
	modules => array("logger", "autocomplete"),
	description => "Point to the debug build of a YUI component to read built-in log messages with Logger.",
	sequence => array(3, 50),
	loggerInclude => "suppress",
	logger => array("autocomplete"),
	newWindow => "require",
	requires => array("yuiloader"),
	highlightSyntax => true
);

$examples["log_skinning"] = array(
	name => "Skinning Model",
	modules => array("logger"),
	description => "Explanation of Logger's skinning model.",
	sequence => array(4),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("logger"),
	highlightSyntax => true
);
?>
