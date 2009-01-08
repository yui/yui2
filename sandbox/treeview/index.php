<?php
if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
} else {
    $mode = "";
}

if ($mode == "dist") {
        $ext = "html";
} else {
        $ext = "php";
}

?>


<!doctype html public "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
<title>Yahoo! UI Library - Tree Control</title>
<link rel="stylesheet" type="text/css" media="screen" href="css/screen.css">
</head>
<body style="height:100%">
<img src="img/logo.gif" style="position:absolute;top:5px;left:5px" />

<div id="pageTitle">
  <h3>Tree Control</h3>
</div>
<div id="content">
  <form name="dragDropForm" action="javscript:;">
    <div class="newsItem">
      <p>&nbsp;</p>
      <p>&nbsp;</p>
	  <p>&nbsp;</p>
	<p><a href="default.<?php echo $ext ?>?mode=<? echo $mode ?>">Default TreeView widget</a></p>
	<p><a href="dynamic.<?php echo $ext ?>?mode=<? echo $mode ?>">Dynamic load</a></p>
<?php if ($mode != "dist") { ?>
	<p><a href="lazy.<?php echo $ext ?>?mode=<? echo $mode ?>">Dynamic load with connection</a></p>
<?php } ?>
	<p><a href="folders.<?php echo $ext ?>?mode=<? echo $mode ?>">Folder style</a></p>
	<p><a href="customicons.<?php echo $ext ?>?mode=<? echo $mode ?>">Custom icons</a></p>
	<p><a href="menu.<?php echo $ext ?>?mode=<? echo $mode ?>">Menu style</a></p>
	<p><a href="html.<?php echo $ext ?>?mode=<? echo $mode ?>">HTML node</a></p>
	<p><a href="multi.<?php echo $ext ?>?mode=<? echo $mode ?>">Mutiple trees, different styles</a></p>
	<p><a href="check.<?php echo $ext ?>?mode=<? echo $mode ?>">Task list</a></p>
	<p><a href="anim.<?php echo $ext ?>?mode=<? echo $mode ?>">Fade animation</a></p>
    </div>
  </form>
</div>
      <div id="footerContainer">
        <div id="footer">
          <p>&nbsp;</p>
        </div>
      </div>
    </div>
  </div>
</div>


</body>
</html>
