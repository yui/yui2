
			<p>Calendar has three required dependencies: the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>, the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>, and the <a href="http://developer.yahoo.com/yui/dom/">DOM Collection</a>.</p>

			<p>In addition, the JavaScript and CSS files for Calendar must be included. You can see what the full list of included files looks like below. Please note that your file paths may vary depending on the location in which you installed the YUI libraries.</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<script type="text/javascript" src="yui/build/yahoo/yahoo.js"></script>
				<script type="text/javascript" src="yui/event/event.js" ></script>
				<script type="text/javascript" src="yui/dom/dom.js" ></script>

				<script type="text/javascript" src="yui/build/calendar/calendar.js"></script>
				<link type="text/css" rel="stylesheet" href="yui/build/calendar/assets/calendar.css">	
			</textarea>

			<p>The only markup required by Calendar is an initial empty DIV into which the Calendar will be rendered. The DIV should have a unique id specified in the markup, which will match the id passed to the Calendar's constructor.</p>

			<p>The markup for our simple Calendar example looks like this:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">

				<div id="cal1Container"></div>

			</textarea>


			<p>Finally, the Calendar can be instantiated in a script block, like this:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				<script>
					YAHOO.namespace("example.calendar");

					function init() {
						YAHOO.example.calendar.cal1 = new YAHOO.widget.Calendar("cal1","cal1Container");
						YAHOO.example.calendar.cal1.render();
					}

					YAHOO.util.Event.addListener(window, "load", init);
				</script>
			</textarea>

			<p>Note that to avoid using the global variable space, we are placing our example Calendar's variable into the YAHOO.example.calendar namespace (see line 2 above). For more information about namespacing, see the <a href="http://developer.yahoo.com/yui/yahoo/">YAHOO Global object</a>.</p>

			<p>The constructor in our example (line 5) takes two arguments: the id to be used for our new Calendar's inner container DIV ("cal1" in this example) and the id of the inital container where we want to render the Calendar ("cal1Container" in this case).</p>

			<p>We are also specifying that the init() function should not be executed until the window has loaded, using the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>.</p>