<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<?php
error_reporting(0);

$COMPONENT = "YUI Container";

$_section = $_GET["section"];
$_step = $_GET["step"];

include("include/sections.php");

if ($_section && $_step) {
	$SECTION_NAME = $sections[$_section]["name"];

	$stepCount = count($sections[$_section]["pages"]);
	$STEP_NAME = $sections[$_section]["pages"][$_step];

	$NEXT_STEP_NAME = $sections[$_section]["pages"][$_step + 1];
	$PREV_STEP_NAME = $sections[$_section]["pages"][$_step - 1];

	$include = "include/$_section$_step.php";
	$buildPath = "../../../build";
	$examplesPath = "../../../examples";
	$assetPath = "../assets";
} else {
	$SECTION_NAME = "Tutorials";
	$STEP_NAME = "$COMPONENT Interactive Tutorials";

	$include = "include/landing.php";
	$buildPath = "../../build";
	$examplesPath = "../../examples";
	$assetPath = "assets";
}
?>
<html>
<head>
	<title><?=$COMPONENT?> - <?=$SECTION_NAME?> (YUI Library)</title>

	<link type="text/css" rel="stylesheet" href="<?=$buildPath?>/reset-fonts-grids/reset-fonts-grids.css">

	<link rel="stylesheet" type="text/css" href="<?=$examplesPath?>/assets/dpSyntaxHighlighter.css">
	<link type="text/css" rel="stylesheet" href="<?=$assetPath?>/style.css">
</head>

<body>

	<div id="doc3" class="yui-t5">
		<div id="hd">
			<a href="/yui" id="logo"><div></div></a>
			<h1><?=$COMPONENT?>: <?=$SECTION_NAME?></h1>
		</div>

		<div id="bd">

			<?php include "include/toc.php" ?>

			<div id="yui-main">
				<div class="yui-b">
					<h1 class="first"><?=$STEP_NAME?></h1>

					<?php include $include ?>

					<div id="stepnav">
						<?php
							if ($stepCount > 1 && $_step > 1) { # add the back nav
								$previousStep = $_step - 1;
								print "<a class=\"back\" href=\"$previousStep\">&lt; Back to <em>$PREV_STEP_NAME</em></a>";
							}

							if ($_step < $stepCount) {
								$nextStep = $_step + 1;
								print "<a class=\"next\" href=\"$nextStep\">Continue to <em>$NEXT_STEP_NAME</em> &gt;</a>";
							}
						?>
					</div>
				</div>
			</div>

		</div>

		<div id="ft">&nbsp;</div>
	</div>	

	<script src="<?=$examplesPath?>/assets/dpSyntaxHighlighter.js"></script>
	<script language="javascript"> 
		dp.SyntaxHighlighter.HighlightAll('code'); 
	</script>

</body>
</html>