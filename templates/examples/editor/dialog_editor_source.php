<div id="dialogContainer">
	<div class="hd">Enter Title and Description:</div>
	<div class="bd">
		<form id="dialogForm" name="dialogForm" method="post" action="../editor/assets/post.php">
			
			<p><label for="title">Title:</label> <input name="title" id="title" /></p>
			
			<p><label for="description">Description:</label></p>
			
				<textarea name="description" id="description"></textarea>
			
			<div id="descriptionContainer"></div>
			
			<!--This element is here only for purposes of Progressive Enhancement; we will disable and
			hide it as we render the Dialog so that doesn't interfere with the Dialog's operation.-->
			<p><input id="submitButton" type="submit" /></p>
			
		</form>
	</div>
</div>

<button id="showDlg">Show Dialog</button>

<div id="responseContainer">
	<p>Dialog's post response will appear here after you submit the Dialog.</p>
</div>

<script language="JavaScript">
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
        document.getElementById("responseContainer").innerHTML = 'Status: ' + 
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
</script>
