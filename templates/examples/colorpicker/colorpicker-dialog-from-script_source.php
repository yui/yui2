<script type="text/javascript">

//create a namespace object in the example namespace:
YAHOO.namespace("example.colorpicker")

//create a new object for this module:
YAHOO.example.colorpicker.inDialog = function() {

	//Some shortcuts to use in our example:
	var Event=YAHOO.util.Event,
		Dom=YAHOO.util.Dom,
		lang=YAHOO.lang;

	return {
	
		//In our initialization function, we'll create the dialog;
		//in its render event, we'll create our Color Picker instance.
        init: function() {

            // Instantiate the Dialog
            this.dialog = new YAHOO.widget.Dialog("yui-picker-panel", { 
				width : "500px",
				close: true,
				fixedcenter : true,
				visible : false, 
				constraintoviewport : true,
				buttons : [ { text:"Submit", handler:this.handleSubmit, isDefault:true },
							{ text:"Cancel", handler:this.handleCancel } ]
             });
 
			// Once the Dialog renders, we want to create our Color Picker
			// instance.
            this.dialog.renderEvent.subscribe(function() {
				if (!this.picker) { //make sure that we haven't already created our Color Picker
					YAHOO.log("Instantiating the color picker", "info", "example");
					this.picker = new YAHOO.widget.ColorPicker("yui-picker", {
						container: this.dialog,
						images: {
							PICKER_THUMB: "<?php echo $assetsDirectory; ?>picker_thumb.png",
							HUE_THUMB: "<?php echo $assetsDirectory; ?>hue_thumb.png"
						}
						//Here are some other configurations we could use for our Picker:
						//showcontrols: false,  // default is true, false hides the entire set of controls
						//showhexcontrols: true, // default is false
						//showhsvcontrols: true  // default is false
					});

					//listen to rgbChange to be notified about new values
					this.picker.on("rgbChange", function(o) {
						YAHOO.log(lang.dump(o), "info", "example");
					});
				}
			});	
			
			// If we wanted to do form validation on our Dialog, this
			// is where we'd do it.  Remember to return true if validation
			// passes; otherwise, your Dialog's submit method won't submit.
            this.dialog.validate = function() {
				return true;
            };

            // Wire up the success and failure handlers
            this.dialog.callback = { success: this.handleSuccess, thisfailure: this.handleFailure };
            
            // We're all set up with our Dialog's configurations;
			// now, render the Dialog
            this.dialog.render();
			
			// We can wrap up initialization by wiring all of the buttons in our
			// button dashboard to selectively show and hide parts of the
			// Color Picker interface.  Remember that "Event" here is an
			// alias for YAHOO.util.Event and "Event.on" is therfor a shortcut
			// for YAHOO.util.Event.onAvailable -- the standard Dom event attachment
			// method:
            Event.on("show", "click", this.dialog.show, this.dialog, true);
            Event.on("hide", "click", this.dialog.hide, this.dialog, true);
            Event.on("btnhsv", "click", function(e) {
                        var p = this.picker;
                        p.set(p.OPT.SHOW_HSV_CONTROLS, !p.get(p.OPT.SHOW_HSV_CONTROLS));
                    }, this.dialog, true);
            Event.on("btnhex", "click", function(e) {
                        var p = this.picker;
                        p.set(p.OPT.SHOW_HEX_CONTROLS, !p.get(p.OPT.SHOW_HEX_CONTROLS));
                    }, this.dialog, true);
            Event.on("btnrgb", "click", function(e) {
                        var p = this.picker;
                        p.set(p.OPT.SHOW_RGB_CONTROLS, !p.get(p.OPT.SHOW_RGB_CONTROLS));
                    }, this.dialog, true);
            Event.on("btnhexsummary", "click", function(e) {
                        var p = this.picker;
                        p.set(p.OPT.SHOW_HEX_SUMMARY, !p.get(p.OPT.SHOW_HEX_SUMMARY));
                    }, this.dialog, true);
			
			//initialization complete:
			YAHOO.log("Example initialization complete.", "info", "example");

		},
		
		//We'll wire this to our Dialog's submit button:
		handleSubmit: function() {
			//submit the Dialog:
			this.submit();
			//log this step to logger:
			YAHOO.log("Dialog was submitted.", "info", "example");
		},
 
 		//If the Dialog's cancel button is clicked,
		//this function fires
		handleCancel: function() {
			//the cancel method automatically hides the Dialog:
			this.cancel();
			//log this step to logger:
			YAHOO.log("Dialog was submitted.", "info", "example");
		},
		
		//We'll use Connection Manager to post our form data to the
		//server; here, we set up our "success" handler.
		handleSuccess: function(o) {
			YAHOO.log("Connection Manager returned results to the handleSuccess method.", "info", "example");
			var response = o.responseText;
			//On Yahoo servers, we may get some page stamping;
			//we can trim off the trailing comment:
			response = response.split("<!")[0];
			//write the response to the page:
			response = "<strong>The data received by the server was the following:</strong> " + response;
			document.getElementById("resp").innerHTML = response;
		},
		
		handleFailure: function(o) {
			YAHOO.log("Connection Manager returned results to the handleFailure method.", "error", "example");
			YAHOO.log("Response object:" + lang.dump(o), "error", "example");
		}
   
	}


}();

//The earliest safe moment to instantiate a Dialog (or any
//Container element is onDOMReady; we'll initialize then:
YAHOO.util.Event.onDOMReady(YAHOO.example.colorpicker.inDialog.init, YAHOO.example.colorpicker.inDialog, true);

</script>

<!--begin Color Picker configuration dashboard: -->
<div>
  <button id="show">Show Color Picker</button> 
  <button id="hide">Hide Color Picker</button>
  <button id="btnhsv">Show/hide HSV fields</button>
  <button id="btnhex">Show/hide HEX field</button>
  <button id="btnrgb">Show/hide RGB field</button>
  <button id="btnhexsummary">Show/hide HEX summary info</button>
</div>

<!--begin Dialog markup in standard module format-->
<div id="yui-picker-panel" class="yui-picker-panel">
	<div class="hd">Please choose a color:</div>
	<div class="bd">
		<form name="yui-picker-form" id="yui-picker-form" method="post" action="<?php echo $assetsDirectory; ?>post.php">
		<div class="yui-picker" id="yui-picker"></div>
		</form>
	</div>
	<div class="ft"></div>
</div>

<!--begin form for server response-->
<div id="resp">Server response will be displayed in this area</div>
