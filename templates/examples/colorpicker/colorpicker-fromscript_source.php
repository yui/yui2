<div id="container">
</div>

<!--We'll use these to trigger interactions with the Color Picker
API -->
<button id="reset">Reset Color to White</button>
<button id="gethex">Write current hex value to the Logger</button> 

<script type="text/javascript">
(function() {
    var Event = YAHOO.util.Event,
        picker;

    Event.onDOMReady(function() {
			YAHOO.log("Creating Color Picker.", "info", "example");
            picker = new YAHOO.widget.ColorPicker("container", {
                    showhsvcontrols: true,
                    showhexcontrols: true,
					images: {
						PICKER_THUMB: "<?php echo $assetsDirectory; ?>picker_thumb.png",
						HUE_THUMB: "<?php echo $assetsDirectory; ?>hue_thumb.png"
    				}
                });
			YAHOO.log("Finished creating Color Picker.", "info", "example");
			
			//a listener for logging RGB color changes;
			//this will only be visible if logger is enabled:
			var onRgbChange = function(o) {
				/*o is an object
					{ newValue: (array of R, G, B values),
					  prevValue: (array of R, G, B values),
					  type: "rgbChange"
					 }
				*/
				YAHOO.log("The new color value is " + o.newValue, "info", "example");
			}
			
			//subscribe to the rgbChange event;
			picker.on("rgbChange", onRgbChange);
			
			//use setValue to reset the value to white:
			Event.on("reset", "click", function(e) {
				picker.setValue([255, 255, 255], false); //false here means that rgbChange
													     //wil fire; true would silence it
			});
			
			//use the "get" method to get the current value
			//of one of the Color Picker's properties; in 
			//this case, we'll get the hex value and write it
			//to the log:
			Event.on("gethex", "click", function(e) {
				YAHOO.log("Current hex value: " + picker.get("hex"), "info", "example"); 
			});
        });
})();
</script>
