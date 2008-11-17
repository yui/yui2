<?php
$docroot = "../"; //path to distribution's yui root

//ydn indicates whether this is for the website or for distribution
if(!isset($ydn)) {
	$ydn = (isset($_GET['ydn'])) ? $_GET['ydn'] : false;
}

require("/home/y/share/pear/Yahoo/YUI/loader.php");
require($docroot."examples/data/examplesInfo.php");

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

$section="examples";
$highlightSyntax = false;
$releasenotes = false;
$title = "Yahoo! User Interface Library (YUI): Index of Library Examples";

if($ydn) {
//YDN PAGE VARIABLES AND HEADER INCLUDE
	echo '<?php
$section="examples";
$highlightSyntax = false;
$releasenotes = false;
$title = "Yahoo! User Interface Library (YUI): Index of Library Examples";
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
		  
		  
   <style type="text/css">
	   table.examplesTable {margin-top:1.7em;}
	   .examplesTable td {border:1px solid #dedede; padding:2px; font-size:100%; vertical-align:top;}
	   .examplesTable td.title {width:25%;}
	   .examplesTable td.description {width:65%;}
	   .examplesTable tr.odd {background-color:#DBEBF3;}
	   .examplesTable th {border:1px solid #dedede; padding:2px; background-color:#0066CC; color:#CCCCCC; font-weight:bold; font-size:100%;}
	   .examplesTable th.title {background-color:#F4F4F4;}
	   h1, h2, h3 {margin-top:.7em; margin-bottom:.2em; font-weight:bold; border-top:none;}
	   h1 {font-size:144%;}
	   h2 {font-size:129%; border-bottom:1px solid #dedede;}
	   h3 {font-size:114%; display:inline; margin-bottom:0;}
	   #secondaryContent {border-left:1px solid #dedede; padding-left:1em;}
   </style>
	
<h1 class="firstContent">YUI Library: Index of Official Examples</h1>
	
<p>Every YUI Library component ships with a series of <?php echo sizeof($examples);?> examples that illustrate its implementation.  These examples can serve as starting points for your exploration of YUI, as code snippets to get you started in your own programming, or simply as an inspiration as to how various interaction patterns can be enabled in the web browser via YUI.</p>

<p>The navigation controls on the left side of this page allow you to explore these examples component-by-component; on this page you'll find the full index of library examples with a link to and short description of each one.</p>
<?php
$aTypes = array('css', 'core', 'utility', 'widget', 'tool');
$oTypeNames = array('css'=>'CSS Foundation','utility'=>'YUI Utilities','widget'=>'YUI Widgets', 'core'=>'YUI\'s Core JavaScript Components', 'tool'=>'Developer Tools');

foreach($aTypes as $thisType) {
		echo "\n<h2>".$oTypeNames[$thisType]."</h2>";
		$aUtils = getModulesByType($thisType,$modules);
		foreach($aUtils as $currentModuleName=>$aUtil) {
			$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
		if ($aCurrentExamples) {
			echo "<table class='examplesTable'>\n";
			echo "<thead>\n";
			echo "<tr><th class='title' colspan='2'><h3>$aUtil[name]</h3></th></tr>";
			echo "</thead>\n<tbody>\n";
			$idx = 1;
			foreach($aCurrentExamples as $key=>$thisExample) {
				/*This may be a cross-listed example.  If it is, ignore; it will be listed with its primary component.*/
				if ($currentModuleName != $thisExample[modules][0])  {
					//do nothing
				} else {
					if($idx%2) {
						$zebra = "class='odd'";
					} else {
						$zebra = "class='even'";
					}
					
					//Link to example
					echo "<tr $zebra><td class='title'><a href='$currentModuleName/$thisExample[key].html'>$thisExample[name]</a></td>";
					
					//Example descriptoin
					echo "<td class='description'>$thisExample[description]</td>";
					
					echo "</tr>\n";
					$idx++;
				}
			}
			echo "</tbody>\n</table>\n";
		}
			
		
		}
}
?>
			</div>
			<div class="yui-u" id="secondaryContent">
				
				<div id="module" class="firstContent">
					<p><img src="../assets/yui-candy.jpg" width="180" height="120"></p>
					<h3>YUI Web Sites We Love</h3>
					
					<p>The dozens of examples on this page are a worthwhile place to start, but the official YUI examples are just the tip of the iceberg when it comes to YUI sample code and YUI-powered sites from which you can gather additional ideas.  Here are a few YUI-related sites that we find ourselves going back to again and again.</p>
					<ul>
						<li><a href="http://blog.davglass.com/files/yui/">Dav Glass's Blog</a>: Dav, who is now a member of the YUI team, has the most extensive set of YUI-focused examples anywhere on the web.</li>
                        <li><a href="http://www.satyam.com.ar/yui/">Satyam's YUI Site</a>: Satyam is a well-known YUI expert who has assisted thousands of developers with their YUI implementations.</li>
					</ul>
				</div>
				
				
		  </div>


	
		</div>
	</div>
</div>

<?php 

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

?>
