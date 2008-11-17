<script language="javascript">

YAHOO.example.Timing = function() {

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
YAHOO.example.Timing.init();


</script>

<div id="contentContainer">

	<!--a ul with an arbitrarily large number of children:-->
	<ul>
		<?php
			for ($i=0; $i<100; $i++) {
				echo "<li id='li-$i'>child node #$i</li>\n";
			}
		?>
	</ul>

	<img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/large/uluru.jpg" width="500" alt="Uluru" id="image" />

</div>