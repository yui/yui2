<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<?php
error_reporting(0);

$COMPONENT = "YUI Calendar";

$_section = $_GET["section"];

include("include/sections.php");

$SECTION_NAME = $sections[$_section]["name"];

$stepCount = count($sections[$_section]["pages"]);

$buildPath = "../../../build";
$docPath = "../../../docs";
$assetPath = "../assets";

?>
<html>
<head>
	<title><?=$COMPONENT?> - <?=$SECTION_NAME?> (YUI Library)</title>

	<link rel="stylesheet" type="text/css" href="<?=$docPath?>/assets/dpSyntaxHighlighter.css">
	<link type="text/css" rel="stylesheet" href="<?=$assetPath?>/style.css">

	<style>
		#hd { margin:0; width:7.5in }
		#bd { margin: 0 }

		#hd #logo { width:7.5in }
		#hd h1 { margin-bottom:0.25in; width:7.5in }
		#bd .dp-highlighter { margin-bottom:0.25in; width: 700px;overflow:hidden; }
		#bd .dp-highlighter table { width:700px; }
		#bd .dp-highlighter td { white-space:normal }

		#bd h2 { margin-top: 0.25in }
		#bd h2.first { margin-top:0 }
		#ft { display:none }
	</style>
</head>

<body>

	<div id="hd">
		<a href="/yui" id="logo"><div></div></a>
		<h1><?=$COMPONENT?>: <?=$SECTION_NAME?></h1>
	</div>

	<div id="bd">
		<?php
			$pages = $sections[$_section]["pages"];

			foreach ($pages as $pageNumber => $pageName) {
				
				if ($pageNumber != $stepCount) {
					if ($pageNumber == 1) {
						print "<h2 class=\"first\">$pageName</h2>";
					} else {
						print "<h2>$pageName</h2>";
					}
					
					include "include/$_section$pageNumber.php";
				}
			}
		?>
	</div>

	<div id="ft">&nbsp;</div>

	<script src="<?=$docPath?>/assets/dpSyntaxHighlighter.js"></script>
	<script language="javascript"> 
		dp.SyntaxHighlighter.HighlightAll('code'); 
	</script>

</body>

</html>
