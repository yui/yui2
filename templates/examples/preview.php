<?php
//for customizing build path during development:
if(!isset($buildpath)) {
	$buildpath = (isset($_GET['buildpath'])) ? $_GET['buildpath'] : "../../../build/";
}
if($buildpath) {
	$buildpathQS = "&buildpath=".$buildpath;
} else {
	$buildpathQS = "";
}

//other querystring values
if(!isset($generalQS)) {
	$generalQS = "&v=[yuiCurrentVersion]";
}

include('data/examplesInfo.php');
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
   <title>YUI Examples Preview Matrix</title>
   <link rel="stylesheet" href="http://yui.yahooapis.com/2.2.0/build/reset-fonts-grids/reset-fonts-grids.css" type="text/css">
   <style type="text/css">
	   #custom-doc { width: 95%; min-width: 250px; }
	   table.examplesTable {margin-top:0.7em;}
	   .examplesTable td {border:1px solid #dedede; padding:2px; font-size:77%;}
	   .examplesTable tr.odd {background-color:#DBEBF3;}
	   .examplesTable th {border:1px solid #dedede; padding:2px; background-color:#0066CC; color:#CCCCCC; font-weight:bold; font-size:77%;}
	   .examplesTable th.title {background-color:#F4F4F4;}
	   h1, h2, h3 {margin-top:.7em; margin-bottom:.2em; font-weight:bold;}
	   h1 {font-size:144%;}
	   h2 {font-size:129%; border-bottom:1px solid #dedede;}
	   h3 {font-size:129%; display:inline; margin-bottom:0;}
   </style>
</head>
<body>
<div id="custom-doc" class="yui-t7">
   <div id="hd"><h1>YUI Examples Prevew Matrix (for Distribution)  (<?php echo sizeof($examples);?> examples total)</h1></div>
   <div id="bd">
	<div class="yui-g">
	
		<form method="get" action="preview.php">
			<label for="buildpath">Path from example.php to build dir: <input type="text" value="<?php echo $buildpath;?>" name="buildpath" /></label> <input type="submit">
		</form>
	
<?php
$aTypes = array('css', 'core', 'utility', 'widget', 'tool');
$oTypeNames = array('css'=>'CSS Foundation','utility'=>'YUI Utilities','widget'=>'YUI Widgets', 'core'=>'YUI Core JavaScript', 'tool'=>'YUI Developer Tools');

foreach($aTypes as $thisType) {
		echo "\n<h2>".$oTypeNames[$thisType]."</h2>";
		$aUtils = getModulesByType($thisType,$modules);
		foreach($aUtils as $currentModuleName=>$aUtil) {
			$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
		if ($aCurrentExamples) {
			echo "<table id='$currentModuleName' class='examplesTable'>\n";
			echo "<thead>\n";
			echo "<tr><th class='title' colspan='5'><h3><a href='http://developer.yahoo.com/yui/$currentModuleName/'>$aUtil[name]</a></h3>\n<a href='module/examplesModuleIndex.php?module=$currentModuleName$buildpathQS$generalQS'>[preview examples roster]</a></tr>";
			echo "<tr><th>sequence</th><th>default presentation</th><th>logger on</th><th>new window</th><th>crosslisted modules</th></tr>\n";
			echo "</thead>\n<tbody>\n";
			$idx = 1;
			foreach($aCurrentExamples as $key2=>$thisExample) {
				/*This may be a cross-listed example.  If it is, ignore; it will be listed with its primary component.*/
				if ($currentModuleName != $thisExample[modules][0])  {
					//do nothing
				} else {
					if($idx%2) {
						$zebra = "class='odd'";
					} else {
						$zebra = "class='even'";
					}
					
					//default presentation
					echo "<tr $zebra><td>".$thisExample[sequence][0]."</td><td><a href='module/example.php?name=$thisExample[key]&preview=true$buildpathQS$generalQS'>$thisExample[name]</a></td>";
					
					//force logger on:
					if ($thisExample[loggerInclude] != "suppress") {
						echo "<td><a href='module/example.php?name=$thisExample[key]&log=true&preview=true$buildpathQS$generalQS'>[logger on]</a></td>";
					} else {
						echo "<td>logger suppressed</td>";
					}
					
					//view in new window:
					switch ($thisExample[newWindow]) {
						case "suppress":
							echo "<td>new window view suppressed</td>";
							break;
						case "require":
							echo "<td><a href='$currentModuleName/$thisExample[key]_source.php?$buildpathQS$generalQS'>[in new window (required)]</a></td>";
							break;
						default:
							echo "<td><a href='module/example.php?name=$thisExample[key]&clean=true&preview=true$buildpathQS$generalQS'>[in new window]</a></td>";
					}
					
					//other modules
					if(sizeof($thisExample[modules])>1) {
						$sModules = "";
						foreach($thisExample[modules] as $moduleName) {
							$sModules .= " $moduleName";
						}
						echo "<td>.$sModules.</td>";
					} else {
						echo "<td><!--no crosslisted modules for this example--></td>";	
					}
					
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

	</div>
   <div id="ft">(c) 2007 Yahoo! Inc.</div>
</div>
</body>
</html>
