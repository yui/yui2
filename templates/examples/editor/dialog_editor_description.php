<h2 class="first">Using Rich Text Editor in a Dialog Control</h2>

<p>When using a Rich Text Editor in a <a href="http://developer.yahoo.com/yui/container/dialog">Dialog Control</a>, there are a few considerations:</p>

<ul>
	<li>The editor and the elements it creates (particularly the floating properties palettes) need to be rendered into the Dialog's DOM structure.  If the Dialog is modal, it will try to maintain focus within its DOM confines, so ensuring that all editor elements are children of the Diolog's DOM is crucial.</li>
	<li>The most common way to submit a Dialog's form contents is asynchronously using <a href="http://developer.yahoo.com/yui/connection/">Connection Manager</a>.  This means that editor cannot automatically attach itself to the form's <code>submit</code> event.  Instead, we need to call the editor's <code>saveHTML</code> method prior to executing the Dialog's <code>submit</code> method.</li>
	<li>The Rich Text Editor needs special handling when it is hidden (ie, when a parent element is set to <code>display:none</code>).  Dialogs, of course, are usually hidden by default and appear only in response to user action.  As a result, we need to listen for the Dialog's <code>showEvent</code> and <code>hideEvent</code> and prepare the Rich Text Editor to recover gracefully when the Dialog is hidden from view.</li>
</ul>

<p>These three considerations are each accounted for in the code below, which is fully commented and represents the full JavaScript source for this implementation:</p>

<textarea name="code" class="JScript">
(function() {

	//hide and disable the non-dialog submit button:
	document.getElementById("submitButton").disabled = true;
	document.getElementById("submitButton").style.display = "none";
	
	//create the RTE:
	var editor = new YAHOO.widget.Editor('description', {
	    width: '702px',
		height: '200px'
	});

	//attach the Editor's reusable property-editor
	//panel to an element inside our main Dialog --
	//this allows it to get focus even when the Dialog
	//is modal:
	editor.on('windowRender', function() {
		document.getElementById('descriptionContainer').appendChild(this.get('panel').element);
	});

	//render the editor explicitly into a container
	//within the Dialog's DOM:
	editor.render();
	
	//create Dialog:
	var dlg = new YAHOO.widget.Dialog("dialogContainer", {
		width:"725px",
		fixedcenter:true,
		modal:true,
		visible:false
	});

	//event handlers for our Dialog buttons:
	
	//if the user clicks "save", then we save the HTML
	//content of the RTE and submit the dialog:
	function handleSave() {
		editor.saveHTML();
		this.submit();
	}
	
	//if the user clicks cancel, we call Dialog's
	//cancel method:
	function handleCancel() {
		this.cancel();
	}
	
	//set up buttons for the Dialog and wire them
	//up to our handlers:
	var myButtons = [ { text:"Save", 
						handler:handleSave },
					  { text:"Cancel", 
						handler:handleCancel,
						isDefault:true } ];
	dlg.cfg.queueProperty("buttons", myButtons);

	//Dialog by default will use Connection Manager to POST
	//form contents to the URI specified in the action
	//attribute of the form; we can wire up success and
	//failure handlers for the XHR call and act on them
	//just as we would with any Connection Manager
	//transaction:
	var onSuccess = function(o) {
		//we're going to get JSON back from post.php; we
		//can parse it using JSON.parse:
		var data = YAHOO.lang.JSON.parse(o.responseText);
		
		//in this case, we'll just output the contents to 
		//a div to see what they contain:
        document.getElementById("container").innerHTML = 'Status: ' + 
			data.Results.status + 
			'<br>' + (new Date().toString());
	}
	var onFailure = function(o) {
		//in the event of a failure, we can log the problem:
		YAHOO.log("Dialog reported a communication failure; connection object: " + YAHOO.lang.dump(o, 5));
	}
	dlg.callback.success = onSuccess;
	dlg.callback.failure = onFailure;
	
	//Now that our Dialog is fully configured, we can
	//render it:
	dlg.render();
	
	//RTE needs a little love to work in in a Dialog that can be 
	//shown and hidden; we let it know that it's being
	//shown/hidden so that it can recover from these actions:
	dlg.showEvent.subscribe(editor.show, editor, true);
	dlg.hideEvent.subscribe(editor.hide, editor, true);
	
	//instantiate button to show Dialog:
	var btn = new YAHOO.widget.Button("showDlg", {type:"link"});
	btn.on("click", dlg.show, dlg, true);
	
})();
</textarea>