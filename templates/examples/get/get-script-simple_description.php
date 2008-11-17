<h2 class="first">Quickstart Example: Getting a Script File with YUI Get</h2>

<p>In this simple example, we perform the most common task for which the Get Utility is used: retrieving a script and adding it to the page.</p>

<p>The contents of the script we're fetching (<code>assets/simple_get.js</code>) are as follows:</p>

<textarea name="code" class="JScript">
//when this script is loaded by the YUI Get Utility,
//all of its contents will be evaluated in the context
//of the window object -- it has all the access to the
//page, the DOM, cookies, etc., that any other script
//would have, even if you've loaded it from a disparate
//domain.

//create a globally accessible namespace, assuming
//that YUI is already present:
YAHOO.namespace("simple_get");

//store some data:
YAHOO.simple_get.data = {
	script: "assets/simple_get.js",
	loaded: "loaded using YUI's Get Utility",
	time: new Date().toString()
}
</textarea>

<p>The script file above defines a new namespace and then adds a property to that namespace.  There are no restrictions on what we can do in the retrieved script; it can contain any correct JavaScript.  When retrieved, it will be evaluated by the browser in the context of the window to which it was added.  By default, it will be added to the current window and evaluated in that context.</p>

<p>In this page, we create a button and wire it so that when it's clicked the Get Utility will create a script node and populate it with the file above.</p>

<textarea name="code" class="JScript">//We'll use a YUI Button to actuate our request for the script:
var button = new YAHOO.widget.Button("getScript", {type: "link"});

//When the button is clicked, we'll make the script request:
button.on("click", function() {

	//We have a .js file at assets/simple_get.js.  We will get
	//that script with the Get Utility:
	YAHOO.util.Get.script("../get/assets/simple_get.js", {

		//callback to fire when the script is successfully loaded:
		onSuccess: function(obj) {
			YAHOO.log("Success handler was called. Transaction ID: " + obj.tId, "info", "example");
			document.getElementById("returnedData").innerHTML = YAHOO.lang.dump(YAHOO.simple_get.data, 3);
		}
	});
	
});
</textarea>

<p>Above you see the important parts of this script.  In the Button's click handler, we invoke <code>YAHOO.util.Get.script</code> and pass it the URI of the script to be loaded.  (The script can be on your server or on a third-party server; it is not restricted by the Same Origin Policy, which is why this is a popular approach for consuming JSON-based web services.) We also tell Get what we want to do once the script is loaded by defining an <code>onSuccess</code> configuration property.  This property consists of a function in which we can make use of the contents of <code>assets/simple_get.js</code>.</p>

<h2>Full Script Source for This Example:</h2>

<p>The full script source used in this example appears below; read through the inline comments to get a full understanding of how to use the Get Utiltiy in the simple use case of retrieving a script file and making use of its contents.</p>

<textarea name="code" class="JScript">
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
</textarea>
