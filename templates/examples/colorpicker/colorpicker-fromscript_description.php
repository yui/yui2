<h2 class="first">Building a Color Picker Instance via JavaScript</h2>

<p>In this example, the <a href="http://developer.yahoo.com/yui/colorpicker/">Color Picker Control</a> instance is allowed to create its own DOM structure.  We begin with a simple style set for the containing element into which that DOM structure will be rendered and we place the containing element on the page:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><style type="text/css">
  #container { position: relative; padding: 6px; background-color: #eeeeee; width: 420px; height:220px; }
</style>

<div id="container">
<!--Color Picker will appear here-->
</div>

<!--We'll use these to trigger interactions with the Color Picker
API -->
<button id="reset">Reset Color to White</button>
<button id="gethex">Write current hex value to the Logger</button> </textarea>

<p>With a target element in place, we can instantiate Color Picker and provide our desired configuration options.  In this example, we are specifying that HSV and hex controls should be displayed and we're specifying custom locations for the color-picker slider thumb and the hue slider thumb.  For the purposes of the example, we're also hooking into the Color Picker's <code>rgbChange</code> event and logging the <code>newValue</code> to the logger console;  you'll see those log messages each time you adjust the color.  This example also demonstrates how to use the picker's <code>get</code> method to tap into the current <code>hex</code> value via script.</p>

<textarea name="code" class="JScript" cols="60" rows="1">(function() {
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
													     //will fire; true would silence it
			});
			
			//use the "get" method to get the current value
			//of one of the Color Picker's properties; in 
			//this case, we'll get the hex value and write it
			//to the log:
			Event.on("gethex", "click", function(e) {
				YAHOO.log("Current hex value: " + picker.get("hex"), "info", "example"); 
			});

        });
})();</textarea>

<p>It's advisable to provide all necessary configurations at the instantiation of the Color Picker; it renders immediately and automatically upon creation.</p>
