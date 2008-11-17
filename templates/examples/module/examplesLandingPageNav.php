<?php
//This file outputs the example nav for component landing pages:

$docroot = "../../"; //path to distribution's yui root
require($docroot."examples/data/examplesInfo.php");

if (!isset($currentModuleName )) {
	$currentModuleName = $_GET['module'];
};

if($modules[$currentModuleName]) {
	$currentModule = $modules[$currentModuleName];
	$component=$currentModule[name];
	
	$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
	if ($aCurrentExamples) {
		echo "<h3>".$component." Examples:</h3>\n\n<ul>\n";
		$relatedExamples = "";
		foreach($aCurrentExamples as $key=>$thisExample) {
			/*This may be a cross-listed example.  If it is, build the link out
			and defer it until later on the page:*/
			if ($currentModuleName != $thisExample[modules][0])  {
				$relatedExamples .= "<li><a href='/yui/examples/".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"]."</a> (included with examples for the <a href='/yui/".$thisExample[modules][0]."/index.html'>".$modules[$thisExample[modules][0]][name]."</a>)</li>\n";
			} else {
				echo "<li><a href='/yui/examples/".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"]."</a></li>\n";
			}
		}
	}
?>
</ul>


<?php
/*output related examples:*/
	if($relatedExamples) {
		echo "\n\n<h4 id='relatedExamples'>Other YUI Examples That Make Use of the ".$component.":</h4>\n\n<ul>\n".$relatedExamples."</ul>";
	}
}
?>		
