<?php
$docroot = "../../"; //path to distribution's yui root
require("/home/y/share/pear/Yahoo/YUI/loader.php");
//require("/Sites/yahoo/presentation/tools/phploader/loader.php");
require($docroot."examples/data/examplesInfo.php");

//ydn indicates whether this is for the website or for distribution
if(!isset($ydn)) {
	$ydn = (isset($_GET['ydn'])) ? $_GET['ydn'] : false;
}
$externalLabel = ($ydn) ? "" : "(external)"; //used to stamp external links in dist

//for customizing build path during development:
if(!isset($buildpath)) {
	$buildpath = (isset($_GET['buildpath'])) ? $_GET['buildpath'] : false;
}

//instantiate Loader:
$loader = new YAHOO_util_Loader();
if ($buildpath) {$loader->base = $buildpath;}

//always load YUI Loader, Dom and Event -- this provides the foundation for adding
//additional funcitionality in a flexible way to the site chrome:
$loader->load("yuiloader", "event", "dom");

if (!isset($currentModuleName )) {
	$currentModuleName = $_GET['module'];
};

if($modules[$currentModuleName]) {

	$currentModule = $modules[$currentModuleName];
	
	$title="YUI Library Examples: ".$currentModule["name"];
	$section=$currentModuleName;
	$component=$currentModule[name];
	$highlightSyntax = false;
	$releasenotes = false;
	
if($ydn) {
//YDN PAGE VARIABLES AND HEADER INCLUDE
echo '<?php
	$title="YUI Library Examples: '.$currentModule["name"].'";
	$section="'.$currentModuleName.'";
	$component="'.$currentModule[name].'";
	$highlightSyntax = false;
	$releasenotes = false;

include("'.$docroot.'inc/header.inc"); 
?>

';
//END YDN PAGE VARIABLES AND HEADER INCLUDE
} else {
	include($docroot."inc/header.php");
}


?>

<div id="yui-main">
	<div class="yui-b">
	  <div class="yui-ge">
		  <div class="yui-u first">
<h1 class="firstContent"><?php echo $currentModule[name]; ?>: Examples</h1>


<?php
/*if the current module has a description field, output that here.*/
if ($currentModule[description]) {
	echo "<p>".$currentModule[description]."</p>";
}


$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
if ($aCurrentExamples) {
	echo "<ul>";
	$relatedExamples = "";
	foreach($aCurrentExamples as $key=>$thisExample) {
		/*This may be a cross-listed example.  If it is, build the link out
		and defer it until later on the page:*/
		if ($currentModuleName != $thisExample[modules][0])  {
			$relatedExamples .= "<li><a href='".$docroot."examples/".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"]."</a> (included with examples for the <a href='".$docroot."examples/".$thisExample[modules][0]."/index.html'>".$modules[$thisExample[modules][0]][name]."</a>)</li>";
		} else {
			echo "<li><a href='$thisExample[key].html'>".$thisExample["name"]."</a>: ".$thisExample["description"]."</li>";
		}
	}
}
?>
</ul>

<?php
/*output related examples:*/
	if($relatedExamples) {
		echo "<h2 id='relatedExamples'>Other YUI Examples That Make Use of the ".$component."</h2><ul>".$relatedExamples."</ul>";
	}
?>		
			</div>
			<div class="yui-u">
				
				<div id="module" class="firstContent">
					<h3><?php echo($currentModule[name]).":";?></h3>
					<ul>
						<li><a href="http://developer.yahoo.com/yui/<?php echo($currentModuleName);?>/">User's Guide</a> <?php echo $externalLabel; ?></li>
<?php
/* Currently, all modules that are not of type=="css" have API documentation conforming to the same AdamDoc URL style:*/
if ($currentModule[type] != "css") {
?>
						<li><a href="<?php echo $docroot ?>docs/module_<?php echo($currentModuleName);?>.html">API Documentation</a></li>
<?php 
}

/* cheatsheet is indicated by $currentModule[cheatsheet] -- either true, false, or a string specifying the filename for this module's cheatsheet (e.g., if it isn't modulename.pdf) */
if($currentModule[cheatsheet]) {
	$chShFilename = (is_string($currentModule[cheatsheet])) ? $currentModule[cheatsheet] : $currentModuleName . ".pdf";
?>
                            
                            
							<li><a href="http://yuiblog.com/assets/pdf/cheatsheets/<?php echo($chShFilename);?>">Cheat Sheet PDF</a><?php echo $externalLabel; ?></li><?php

}
                         
						?></ul>
				</div>
				
				
		  </div>
	</div></div>
</div>


<?php } 
	else { /*module not found*/
		echo "module not found";
	}

//Conditional footer inclusion for YDN vs. dist:
if ($ydn) {

	echo "<!--Script and CSS includes for YUI dependencies on this page-->\n";
	echo ($loader->tags());	
	
	echo '
<?php 
include("'.$docroot.'inc/side.inc");
include("'.$docroot.'inc/footer.inc");
?>';

} else {

	include ($docroot."inc/side.php"); 
	include ($docroot."inc/footer.php"); 
	
}
