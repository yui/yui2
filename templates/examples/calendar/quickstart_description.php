<h2 class="first">Setting up the Calendar</h2>

<p>Calendar has three required dependencies: the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>, the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>, and the <a href="http://developer.yahoo.com/yui/dom/">DOM Collection</a>.</p>

<p>In addition, the JavaScript and CSS files for Calendar must be included. You can see what the full list of included files looks like below. The CSS file we choose to include is the default skin (look) for YUI, named "sam".</p>

<p>Note that when using the YUI Sam Skin css file, you need to make sure an ancestor of the Calendar DIV has the <code>yui-skin-sam</code> class applied to it. For most use cases this class can be applied to the body opening tag (<code>&#60;body class="yui-skin-sam"&#62;</code>). For more information on skinning YUI components and making use of default skins, see our <a href="http://developer.yahoo.com/yui/articles/skinning/">Understanding YUI Skins</a> article here on the YUI website.
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<script type="text/javascript" src="build/yahoo/yahoo.js"></script>
	<script type="text/javascript" src="build/event/event.js" ></script>
	<script type="text/javascript" src="build/dom/dom.js" ></script>

	<script type="text/javascript" src="build/calendar/calendar.js"></script>
	<link type="text/css" rel="stylesheet" href="build/calendar/assets/skins/sam/calendar.css">
</textarea>

<p>
Your file paths may vary depending on the location in which you installed the YUI libraries. The Calendar examples, when referring to file paths, use the build directory as the root for the YUI distribution.
</p>

<p>The only markup required by Calendar is an initial empty DIV into which the Calendar will be rendered. The DIV should have a unique id specified in the markup, which will match the id passed to the Calendar's constructor.</p>

<p>The markup for our simple Calendar example looks like this:</p>

<textarea name="code" class="HTML" cols="60" rows="1">

	<div id="cal1Container"></div>

</textarea>

<p>Finally, the Calendar can be instantiated in a script block, like this:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
	<script>
		YAHOO.namespace("example.calendar");

		YAHOO.example.calendar.init = function() {
			YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container");
			YAHOO.example.calendar.cal1.render();
		}

		YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
	</script>
</textarea>

<p>Note that to avoid using the global variable space, we are placing our example Calendar's variable and the init function, into the YAHOO.example.calendar namespace (see line 2 above). For more information about namespacing, see the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>.</p>

<p>The constructor in our example (line 5) takes two arguments: the id to be used for our new Calendar's table, which is created dynamically ("cal1" in this example) and the id of the inital container where we want to render the Calendar ("cal1Container" in this case).</p>

<p>We are also specifying that the init() function should not be executed until the the DOM for the page is ready, using the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>. This allows us to create the Calendar as soon as the browser processes the markup on the page, and not have to wait for images to load.</p>
