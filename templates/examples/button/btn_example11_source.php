<script type="text/javascript">

    YAHOO.util.Event.onContentReady("button-container", function () {

        function onButtonOption() {

            /*
                 Create a new ColorPicker instance, placing it inside the body 
                 element of the Menu instance.
            */

            var oColorPicker = new YAHOO.widget.ColorPicker(oColorPickerMenu.body.id, {
                                    showcontrols: false,
                                    images: {
                                        PICKER_THUMB: "../../build/colorpicker/assets/picker_thumb.png",
                                        HUE_THUMB: "../../build/colorpicker/assets/hue_thumb.png"
                                    }
                                });


            /*
                Add a listener for the ColorPicker instance's "rgbChange" event
                to update the background color and text of the Button's 
                label to reflect the change in the value of the ColorPicker.
            */

            oColorPicker.on("rgbChange", function (p_oEvent) {

                var sColor = "#" + this.get("hex");
                
                oButton.set("value", sColor);

                YAHOO.util.Dom.setStyle("current-color", "backgroundColor", sColor);
                YAHOO.util.Dom.get("current-color").innerHTML = "Current color is " + sColor;
            
            });
            

            // Remove this event listener so that this code runs only once

            this.unsubscribe("option", onButtonOption);
        
        }


        // Create a Menu instance to house the ColorPicker instance

        var oColorPickerMenu = new YAHOO.widget.Menu("color-picker-menu");


        // Create a Button instance of type "split"

        var oButton = new YAHOO.widget.Button({ 
                                            type: "split", 
                                            id: "color-picker-button", 
                                            label: "<em id=\"current-color\">Current color is #FFFFFF.</em>", 
                                            menu: oColorPickerMenu, 
                                            container: "button-container" });
        
        
        oButton.on("appendTo", function () {
        
			/*
				Create an empty body element for the Menu instance in order to 
				reserve space to render the ColorPicker instance into.
			*/
	
			oColorPickerMenu.setBody("&#32;");
	
			oColorPickerMenu.body.id = "color-picker-container";
	
	
	
			// Render the Menu into the Button instance's parent element
	
			oColorPickerMenu.render(this.get("container"));
        
        });
        
        
        /*
            Add a listener for the "option" event.  This listener will be
            used to defer the creation the ColorPicker instance until the 
            first time the Button's Menu instance is requested to be displayed
            by the user.
        */
        
        oButton.on("option", onButtonOption);
        

		/*
			Add a listener for the "click" event.  This listener will be used to apply the 
			the background color to the photo.
		*/

        oButton.on("click", function () {
        
        	YAHOO.util.Dom.setStyle("photo", "backgroundColor", this.get("value"));
        
        });
    
    });

</script>

<div id="photo"></div>
<div id="button-container"><label for="color-picker-button">Background Color: </label></div>