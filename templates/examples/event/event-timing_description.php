<h2 class="first">Source Code for This Example:</h2>

<h3>Markup:</h3>

<p>The markup used to create the DOM is very simple, consisting of a <code>&lt;div&gt;</code> that holds a <code>&lt;ul&gt;</code> with 100 child <code>&lt;li&gt;</code>s and a single ~3MB image. The <code>&lt;ul&gt;</code> will take a little time to load, and the image (loading over the internet) will take a few seconds to load even on a fast connection. That should allow us to see in the Logger console some time deltas between when the <code>&lt;div&gt;</code> whose ID is <code>contentContainer</code> becomes available, when its children (those 100 <code>&lt;li&gt;</code>s) are ready, when the DOM is ready (including all the navigation elements on the page), and lastly when the page loads (ie, when that ~3MB image is fully loaded). </p>
<pre><textarea name="code" class="HTML" cols="60" rows="1"><div id="contentContainer">

	<!--a ul with an arbitrarily large number of children:-->
	<ul>
		<li>...</li>
		<!--...100 more of these-->
	</ul>

	<img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/large/uluru.jpg" width="500" alt="Uluru" id="image" />

</div></textarea></pre>

<h3>CSS:</h3>

<p>The CSS colors the contentContainer element and hides the big list to keep the example more compact.</p>

<pre><textarea name="code" class="JScript" cols="60" rows="1"><style>
	#contentContainer {padding:1em; background:#999966;}
	#contentContainer ul {height:0px; overflow:hidden;}
</style></textarea></pre>

<h3>JavaScript:</h3>
<p>In the script, we create an object called <code>Timing</code> within the <code>example</code> namespace.  That object contains our event handlers.  The handlers log a message about each event to the Logger console.</p>

<pre><textarea name="code" class="JScript" cols="60" rows="1">YAHOO.example.Timing = function() {

	//create shortcut for YAHOO.util.Event:
	var e = YAHOO.util.Event;

	//the returned object here will be assigned
	//to YAHOO.example.Timing and its members will
	//then be publicly available:
	return {

		init: function() {
			
			//assign page load handler:
			e.on(window, "load", this.fnLoadHandler, "The window.onload event fired.  The page and all of its image data, including the large image of Uluru, has completed loading.");

			//assign onDOMReady handler:
			e.onDOMReady(this.fnHandler, "The onDOMReady event fired.  The DOM is now safe to modify via script.");
			
			//assign onContentReady handler:
			e.onContentReady("contentContainer", this.fnHandler, "The onContentReady event fired for the element 'contentContainer'.  That element and all of its children are present in the DOM.");

			//assign onAvailable handler:
			e.onAvailable("contentContainer", this.fnHandler, "The onAvailable event fired on the element 'contentContainer'.  That element is present in the DOM.");

		},
		
		//we'll use this handler for onAvailable, onContentReady,
		//and onDOMReady:
		fnHandler: function(message) {
			//onDOMReady uses the Custom Event signature, with the object
			//passed in as the third argument:
			if(arguments.length > 2) {
				message = arguments[2];
			}
			YAHOO.log(message, "info", "example");
			
		},

		//we'll use this handler for the page load event:
		fnLoadHandler: function(oEvent, message) {
			YAHOO.log(message, "info", "example");
		}

	}

}();

//initialize the example:
YAHOO.example.Timing.init();</textarea></pre>