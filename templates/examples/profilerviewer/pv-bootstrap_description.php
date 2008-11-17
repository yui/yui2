<h2 class="first">Profiling non-YUI Code with Minimal YUI Dependencies</h2>

<p>In the introduction to this example, we note that the goal here is to profile non-YUI code while loading (at the outset) only the bare minimum of YUI components (YUI Loader and Profiler, in this case).  By keeping the initial YUI footprint small, we can be sure that YUI iteslf is having the smallest possible impact on the code were looking at.  So, in this example we load that minimal footprint, profile the code we want to test, and only then bring in YUI ProfilerViewer and its other YUI dependencies.  This approach is a good one to take when you're profiling projects that are not based on YUI or where you want to minimize the impact ProfilerViewer could have on your profiling data.</p>

<p>Here's how we accomplish the steps outlined above.  (Note: It's the script-based code-highlighting used below that's being profiled in this example.)</p>

<p>First, we load the minimal dependencies for profiling code with YUI Profiler.  To that, we add the DP Syntax Highlighter code (ie, the code that we'll be profiling).</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://developer.yahoo.com/yui/examples/profilerviewer/assets/dpSyntaxHighlighter.css"> 

<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yuiloader/yuiloader-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/profiler/profiler-min.js"></script>
<script type="text/javascript" src="http://developer.yahoo.com/yui/examples/profilerviewer/assets/dpSyntaxHighlighter.js"></script></textarea>


<p>Next, we set up a simple initialization function that (a) sets up the code we want to profile then (b) executes the code:</p>


<textarea name="code" class="CSS" cols="60" rows="1">YAHOO.example.pv.init = function() {

	//profile the Syntax Highlighter; note: we want to register the
	//object for profiling before we execute the highlighting code:
	YAHOO.tool.Profiler.registerConstructor("dp.sh.Highlighter");
	YAHOO.tool.Profiler.registerObject("dpSyntaxHighlighter", dp, true);

	//Highlight code:
	dp.SyntaxHighlighter.HighlightAll('code');

};

YAHOO.example.pv.init();</textarea>

<p>At this point, we've told Profiler what parts of Syntax Highlighter we want profiled and we've then run Syntax Highlighter, capturing data about its performance.  And we've done all this with the smallest possible amount of YUI code on the page.  <em>Note that Profiler is loaded now, but ProfilerViewer and all of the YUI infrastructure it leverages &mdash; like Element, DataTable and Charts &mdash; is still absent.</em></p>

<p>Now it's time to set up a button that brings in the YUI ProfilerViewer and all of its dependencies.  That button executes the following code:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//When the showProfile button is clicked, use YUI Loader to get all required
//dependencies and then show the profile:
YAHOO.example.pv.showProfilerViewer = function() {

	//disable the button once it's clicked:
	document.getElementById("showProfile").onclick = "";
	document.getElementById("showProfile").className += " disabled";
	
	//private function renders the viewer once dependencies are loaded:
	var showViewer = function() {

		//instantiate ProfilerViewer with desired options:
		var pv = new YAHOO.widget.ProfilerViewer("", {
			visible: true, //expand the viewer mmediately after instantiation
			showChart: true,
			base:"../../build/",
			swfUrl: "../../build/charts/assets/charts.swf"
		});
	};

	//private function gets dependencies for ProfilerViewer:
	var getProfilerViewer = function() {
		var loader = new YAHOO.util.YUILoader({
			base: "../../build/",
			require: ["profilerviewer"], //YUI Loader will handle all dependencies
									  //for us. Nice!
			onSuccess: showViewer
		});
		loader.insert();
	};
	
	//fire getProfilerViewer to trigger the loading and display of the viewer
	//console:
	getProfilerViewer();

};</textarea>

<p>You can use similar strategies to leverage YUI's Profiler and ProfilerViewer on your projects &mdash; even those that aren't based on YUI.</p>

<p>The full script souce for this example follows:</p>
	
<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.namespace("example.pv");

YAHOO.example.pv.init = function() {

	//profile the Syntax Highlighter; note: we want to register the
	//object for profiling before we execute the highlighting code:
	YAHOO.tool.Profiler.registerConstructor("dp.sh.Highlighter");
	YAHOO.tool.Profiler.registerObject("dpSyntaxHighlighter", dp, true);

	//Highlight code:
	dp.SyntaxHighlighter.HighlightAll('code');

};

//When the showProfile button is clicked, use YUI Loader to get all required
//dependencies and then show the profile:
YAHOO.example.pv.showProfilerViewer = function() {

	//disable button:
	document.getElementById("showProfile").onclick = "";
	document.getElementById("showProfile").className += " disabled";
	
	//private function renders the viewer once dependencies are loaded:
	var showViewer = function() {

		//instantiate ProfilerViewer with desired options:
		var pv = new YAHOO.widget.ProfilerViewer("", {
			visible: true, //expand the viewer mmediately after instantiation
			showChart: true,
			base:"../../build/",
			swfUrl: "../../build/charts/assets/charts.swf"
		});
	};

	//private function gets dependencies for ProfilerViewer:
	var getProfilerViewer = function() {
		var loader = new YAHOO.util.YUILoader({
			base: "../../build/",
			require: ["profilerviewer"], //YUI Loader will handle all dependencies
									  //for us. Nice!
			onSuccess: showViewer
		});
		loader.insert();
	};
	
	//fire getProfilerViewer to trigger the loading and display of the viewer
	//console:
	getProfilerViewer();

};

YAHOO.example.pv.init();</textarea>

</script>
