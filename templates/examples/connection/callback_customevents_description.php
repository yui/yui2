<h2 class="first">Subscribing to Connection Manager's Custom Events via the Callback Object</h2>

<h3>Source file and dependencies</h3>
<p>Load the <a href="http://developer.yahoo.com/yui/yahoo/">Yahoo Global Object</a> and <a href="http://developer.yahoo.com/yui/connection/">Connection Manager</a> source files:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script src="yahoo.js"></script>
<script src="event.js"></script>
<script src="connection.js"></script>
</textarea>

<h3>Create an Event Handler Object</h3>
<p>Create an object to handle all the custom events fired by Connection Manager.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var div = document.getElementById('container');

var transactionObject = {
	start:function(type, args){
		div.innerHTML = "&lt;li&gt;Transaction " + args[0].tId + " " + type + " fired.&lt;li&gt;";
	},

	complete:function(type, args){
		div.innerHTML += "&lt;li&gt;Transaction " + args[0].tId + " " + type + " fired.&lt;li&gt;";
	},

	success:function(type, args){
		div.innerHTML += "&lt;li&gt;Transaction " + args[0].tId + " " + type + " fired.&lt;li&gt;";
		if(args[0].responseText !== undefined){
			div.innerHTML += "&lt;li&gt;Transaction id: " + args[0].tId + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;HTTP status: " + args[0].status + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;Status code message: " + args[0].statusText + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;HTTP headers: " + args[0].getAllResponseHeaders + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;Server response: " + args[0].responseText + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;Argument object: Array ( [foo] =&gt; " + args[0].argument[0] +" [bar] =&gt; " + args[0].argument[1] +" )&lt;li&gt;";
			}
	},

	failure:function(type, args){
		div.innerHTML += "&lt;li&gt;Transaction " + args[0].tId + " " + type + " fired.&lt;li&gt;";
		if(args[0].responseText !== undefined){
			div.innerHTML += "&lt;li&gt;Transaction id: " + args[0].tId + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;HTTP status: " + args[0].status + "&lt;li&gt;";
			div.innerHTML += "&lt;li&gt;Status code message: " + args[0].statusText + "&lt;li&gt;";
		}
	},

	abort:function(type, args){
		div.innerHTML += "&lt;li&gt;Transaction " + args[0].tId + " " + type + " fired.&lt;li&gt;";
	}
};
</textarea>

<p>Let's create two functions to provide handlers for <code>callback.success</code> and <code>callback.failure</code> compatibility.  The inclusion of these handlers will demonstrate their backward compatibility with Custom Events.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var handleSuccess = function(o){
	div.innerHTML += "&lt;li&gt;Success response handler triggered in callback.success&lt;li&gt;";
};

var handleFailure = function(o){
	div.innerHTML += "&lt;li&gt;Failure response handler triggered in callback.success&lt;li&gt;";
};
</textarea>

<p>Subscribe to the transaction custom events fired by Connection Manager by creating a <code>customevents</code> object in the callback object.  NOTE: callback.success and callback.failure are provided here to demonstrate backward compatibility, and would be redundant to customevents.onSuccess and customevents.onFailure, respectively.</p>
<textarea name="code" class="JScript" cols="60" rows="1">

var callback = {
	success:handleSuccess,
	failure:handleFailure,
	customevents:{
		onStart:transactionObject.start,
		onComplete:transactionObject.complete,
		onSuccess:transactionObject.success,
		onFailure:transactionObject.failure,
		onAbort:transactionObject.abort
	},
 	argument:["foo","bar"]
};
</textarea>

<h3>Initiate the Transaction</h3>
<p>Call <code>YAHOO.util.Connect.asyncRequest</code> to make a request to <code>get.php</code>, and PHP will return the contents of <code>$_GET</code> via <code>print_r()</code>.
Each event handler in <code>transactionObject</code> will be triggered in response to its custom event(e.g., transactionObject.start will be called when startEvent fires).  In this example, event handlers are created and subscribed to all possible events raised by Connection Manager.
</p>


<textarea name="code" class="JScript" cols="60" rows="1">
var sUrl = "php/get.php?s=hello%20world";
var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
</textarea>