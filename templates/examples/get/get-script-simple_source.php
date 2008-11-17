<div>
	<button id="getScript">Get Data from Script</button>
</div>

<pre id="returnedData">
	Data returned from the loaded script will appear here after you click the button above.
</pre>

<script language="JavaScript">
(function() {
	
	//We'll use a YUI Button to actuate our request for the script:
	var button = new YAHOO.widget.Button("getScript", {type: "link"});
	
	//When the button is clicked, we'll make the script request:
	button.on("click", function() {
		
		YAHOO.log("Button was clicked; loading script with Get Utility.", "info", "example");

		//We have a .js file at assets/simple_get.js.  We will get
		//that script with the Get Utility:
		YAHOO.util.Get.script("../get/assets/simple_get.js", {
			
			//ALL OF THE CONFIGURATION OPTIONS BELOW ARE OPTIONAL;
			//IN MANY CASES, YOU'LL NEED ONLY TO DEFINE YOUR SUCCESS/
			//FAILURE HANDLERS.
			
			//callback to fire when the script is successfully loaded:
			onSuccess: function(obj) {
				YAHOO.log("Success handler was called. Transaction ID: " + obj.tId, "info", "example");
				document.getElementById("returnedData").innerHTML = YAHOO.lang.dump(YAHOO.simple_get.data, 3);
			},
			
			//callback to fire if the script does not successfully load:
			onFailure: function(o) {
				YAHOO.log("Failure handler was called. Transaction ID: " + obj.tId, "info", "example");
			},
			
			//context under which success and failure handlers should run;
			//default is the current window, which we'll use for this example:
			scope: window,
			
			//by default, the script will be added to the current
			//window; use this property to override that default
			//(we're just using the default in this example):
			win: window,
			
			//will be passed as a member of the callback object to
			//the success or failure handler:
			data: {testData: "value"},
			
			//For Safari 2.x, which does not support the script's onload
			//event to determine when the script is loaded; instead, Get
			//will check for the presence of this varName (which is
			//defined in the script we're retrieving) and use its presence
			//to determine when the script has been successfully loaded:
			varName: ["YAHOO.simple_get.data"]
		});
		
	});
	
})();
</script>