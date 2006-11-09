<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<?php

$COMPONENT = "YUI Calendar";

$_section = $_GET["section"];

include("include/sections.php");

$SECTION_NAME = $sections[$_section]["name"];

$stepCount = count($sections[$_section]["pages"]);
?>
<html>
<head>
	<title><?=$COMPONENT?> - <?=$SECTION_NAME?> (YUI Library)</title>

	<link type="text/css" rel="stylesheet" href="/build/fonts/fonts.css">
	<link type="text/css" rel="stylesheet" href="/build/reset/reset.css">

	<link type="text/css" rel="stylesheet" href="/examples/css/style.css">

	<link rel="stylesheet" type="text/css" href="/docs/assets/dpSyntaxHighlighter.css">

	<script type="text/javascript" src="/build/yahoo/yahoo.js"></script>
	<script type="text/javascript" src="/build/event/event.js" ></script>
	<script type="text/javascript" src="/build/dom/dom.js" ></script>

	<script type="text/javascript" src="/build/calendar/calendar.js"></script>
	<link type="text/css" rel="stylesheet" href="/build/calendar/assets/calendar.css">	

	<style>
		#hd { margin:0; width:7.5in }
		#content { margin: 0 }
		#hd #logo { width:7.5in }
		#hd h1 { margin-bottom:0.25in; width:7.5in }
		#content .dp-highlighter { margin-bottom:0.25in; width: 6in; }
		#content h2 { margin-top: 0.25in }
		#content h2.first { margin-top:0 }
		#ft { display:none }
	</style>
</head>

<body>

	<div id="hd">
		<div id="logo"></div>
		<h1><?=$COMPONENT?>: <?=$SECTION_NAME?></h1>
	</div>

	<div id="content">

	<?php
	$pages = $sections[$_section]["pages"];

	foreach ($pages as $pageNumber => $pageName) {

		if ($pageNumber == 1) {
			print "<h2 class=\"first\">Step $pageNumber: $pageName</h2>";
		} else {
			print "<h2>Step $pageNumber: $pageName</h2>";
		}
		
		include "include/$_section$pageNumber.php";
	}

	?>


	</div>

	<div id="ft">&nbsp;</div>

	<script src="/docs/assets/dpSyntaxHighlighter.js"></script>
	<script language="javascript"> 
		dp.SyntaxHighlighter.HighlightAll('code'); 
	</script>

</body>

</html>
