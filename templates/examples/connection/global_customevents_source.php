<form>
<input type="button" onclick="makeRequest();" value="Send a Request">
</form>
<div id="container"></div>

<script>
var div = document.getElementById('container');

var globalEvents = {
	start:function(type, args){
		YAHOO.log("Custom Event *start* fired for transaction" + args[0].tId + ".", "info", "example");
		div.innerHTML = "<li>Transaction " + args[0].tId + " " + type + " fired.</li>";
	},

	complete:function(type, args){
		YAHOO.log("Custom Event *complete* fired for transaction" + args[0].tId + ".", "info", "example");
		div.innerHTML += "<li>Transaction " + args[0].tId + " " + type + " fired.</li>";
	},

	success:function(type, args){
		YAHOO.log("Custom Event *success* fired for transaction" + args[0].tId + ".", "info", "example");
		div.innerHTML += "<li>Transaction " + args[0].tId + " " + type + " fired.</li>";
		if(args[0].responseText !== undefined){
			div.innerHTML += "<li>Transaction id: " + args[0].tId + "</li>";
			div.innerHTML += "<li>HTTP status: " + args[0].status + "</li>";
			div.innerHTML += "<li>Status code message: " + args[0].statusText + "</li>";
			div.innerHTML += "<li>HTTP headers: " + args[0].getAllResponseHeaders + "</li>";
			div.innerHTML += "<li>Server response: " + args[0].responseText + "</li>";
			div.innerHTML += "<li>Argument object: Array ( [foo] =&gt; " + args[0].argument[0] +" [bar] =&gt; " + args[0].argument[1] +" )</li>";
			}
	},

	failure:function(type, args){
		YAHOO.log("Custom Event *failure* fired for transaction" + args[0].tId + ".", "info", "example");
		div.innerHTML += "<li>Transaction " + args[0].tId + " " + type + " fired.</li>";
		if(args[0].responseText !== undefined){
			div.innerHTML += "<li>Transaction id: " + args[0].tId + "</li>";
			div.innerHTML += "<li>HTTP status: " + args[0].status + "</li>";
			div.innerHTML += "<li>Status code message: " + args[0].statusText + "</li>";
		}
	},

	abort:function(type, args){
		YAHOO.log("Custom Event *abort* fired for transaction" + args[0].tId + ".", "info", "example");
		div.innerHTML += "<li>Transaction " + args[0].tId + " " + type + " fired.</li>";
	}
};

YAHOO.util.Connect.startEvent.subscribe(globalEvents.start);
YAHOO.util.Connect.completeEvent.subscribe(globalEvents.complete);
YAHOO.util.Connect.successEvent.subscribe(globalEvents.success);
YAHOO.util.Connect.failureEvent.subscribe(globalEvents.failure);
YAHOO.util.Connect.abortEvent.subscribe(globalEvents.abort);

var callback = { argument:["foo","bar"] };

function makeRequest(){
	var sUrl = "<?php echo $assetsDirectory; ?>get.php?s=hello%20world";
	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
}
</script>