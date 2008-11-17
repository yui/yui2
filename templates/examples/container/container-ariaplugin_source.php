<script type="text/javascript">

	(function () {
	
		var Event = YAHOO.util.Event,
			Dom = YAHOO.util.Dom;


		Event.onDOMReady(function () {

			var oPanel1 = new YAHOO.widget.Panel("panel-1", {
				
				visible: false,
				fixedcenter: true,
				constraintoviewport: true,
				width: "300px"
			
			});
			
			oPanel1.render();
			
			Event.on("show-dialog-1", "click", oPanel1.show, null, oPanel1);


			var oTooltip1 = new YAHOO.widget.Tooltip("tooltip-1", { 
				context:"show-dialog-1", 
				text:"Shows a Dialog built using Panel from existing markup.",
				iframe: true,
				showDelay:500 } );


			var oPanel2 = new YAHOO.widget.Dialog("panel-2", {
				
				modal: true,
				visible: false,
				fixedcenter: true,
				constraintoviewport: true,
				width: "300px",
				postmethod: "form"
			
			});	

			oPanel2.render(document.body);

			Event.on("show-dialog-2", "click", oPanel2.show, null, oPanel2);	


			var oTooltip2 = new YAHOO.widget.Tooltip("tooltip-2", { 
				context:"show-dialog-2", 
				text:"Shows a Modal Dialog built using Dialog from existing markup.",
				iframe: true,
				showDelay:500 } );


			var handleOK = function() {
				this.cancel();
			};
			
			var oPanel3 = new YAHOO.widget.SimpleDialog("panel-3", {
				
				modal: true,
				icon: YAHOO.widget.SimpleDialog.ICON_INFO,
				visible: false,
				fixedcenter: true,
				constraintoviewport: true,
				width: "300px",
				role: "alertdialog",
				buttons: [ { text:"OK", handler:handleOK, isDefault:true } ],
				text: "Your changes have been saved."
			
			});	

			oPanel3.setHeader("Info");
			oPanel3.render(document.body);

			var oTooltip3 = new YAHOO.widget.Tooltip("tooltip-3", { 
				context:"show-dialog-3", 
				text:"Shows a Modal Dialog built using SimpleDialog using the ARIA role of alertdialog.",
				iframe: true,
				showDelay:500 } );
			
			Event.on("show-dialog-3", "click", oPanel3.show, null, oPanel3);					

		});
	
	}());

</script>

<button id="show-dialog-1">Show Dialog 1</button>
<button id="show-dialog-2">Show Dialog 2</button>
<button id="show-dialog-3">Show Dialog 3</button>

<form name="panel-1-form" id="panel-1-form" method="post">
<div id="panel-1">
	<div class="hd">Personal Information</div>
	<div class="bd">
		<div>
			<label for="panel-1-first-name" id="panel-1-first-name-label">First Name</label>
			<input type="text" id="panel-1-first-name" name="first-name">
		</div>
		<div>
			<label for="panel-1-last-name">Last Name</label>
			<input type="text" id="panel-1-last-name" name="last-name">
		</div>	
		<div>
			<label for="panel-1-email">Email</label>
			<input type="text" id="panel-1-email" name="email">
		</div>		
		<div>
			<input type="submit" id="panel-1-button-1" name="button-1" value="Submit">
		</div>
	</div>
</div>
</form>


<div id="panel-2">
	<div class="hd">Personal Information</div>
	<div class="bd">
		<form name="panel-2-form" id="panel-2-form" method="post">
			<div>
				<label for="panel-2-first-name" id="panel-2-first-name-label">First Name</label>
				<input type="text" id="panel-2-first-name" name="first-name">
			</div>
			<div>
				<label for="panel-2-last-name">Last Name</label>
				<input type="text" id="panel-2-last-name" name="last-name">
			</div>	
			<div>
				<label for="panel-2-email">Email</label>
				<input type="text" id="panel-2-email" name="email">
			</div>
			<div>
				<input type="submit" id="panel-2-button-1" name="button-1" value="Submit">
			</div>
		</form>
	</div>
</div>
	