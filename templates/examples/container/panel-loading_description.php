<h2 class="first">Using Panel as a Modal "Please Wait" or "Loading" Indicator</h2>

<p>The Panel can be used to display a temporary message is automatically dismissed when a task has completed. In this tutorial, we will build a Panel that will be displayed while content is being loaded from an external data source, and will be dismissed when the content has finished loading.</p>

<p>We will start by instantiating a Panel and configuring it to display an image and some text in its body. We set it's zindex to be higher than other positioned elements on the page and enable the modal property, so that the panel is displayed with a modal mask:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Initialize the temporary Panel to display while waiting for external content to load
YAHOO.example.container.wait = 
		new YAHOO.widget.Panel("wait",  
			{ width:"240px", 
			  fixedcenter:true, 
			  close:false, 
			  draggable:false, 
			  zindex:4,
			  modal:true,
			  visible:false
			} 
		);

YAHOO.example.container.wait.setHeader("Loading, please wait...");
YAHOO.example.container.wait.setBody('<img src="http://us.i1.yimg.com/us.yimg.com/i/us/per/gr/gp/rel_interstitial_loading.gif" />');
YAHOO.example.container.wait.render(document.body);
</textarea>

<p>We will also need to place a container for the content that will be dynamically loaded:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="content"></div>
</textarea>

<p>Finally, we will set up our Connection object and configure its callback to load the content into the container element and close the Panel after the content has finished loading. If the connection is successful, the content will be loaded into the container and the Panel will be hidden. If the connection fails, an error message will be displayed in the container.</p>

<textarea name="code" class="JScript" cols="60" rows="1">// Define the callback object for Connection Manager that will set the body of our content area when the content has loaded

var content = document.getElementById("content");

var callback = {
	success : function(o) {
		content.innerHTML = o.responseText;
		content.style.visibility = "visible";
		YAHOO.example.container.wait.hide();
	},
	failure : function(o) {
		content.innerHTML = o.responseText;
		content.style.visibility = "visible";
		content.innerHTML = "CONNECTION FAILED!";
		YAHOO.example.container.wait.hide();
	}
}

// Show the Panel
YAHOO.example.container.wait.show();

// Connect to our data source and load the data
var conn = YAHOO.util.Connect.asyncRequest("GET", "../assets/somedata.php?r=" + new Date().getTime(), callback);
</textarea>
