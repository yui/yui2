<p>
Begin by creating a Menu instance that will house the ColorPicker instance. 
Next, instantiate a new Button of type "split," setting its "menu" attribute 
to the Menu instance.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Create a Menu instance to house the ColorPicker instance

var oColorPickerMenu = new YAHOO.widget.Menu("color-picker-menu");


// Create a Button instance of type "split"

var oButton = new YAHOO.widget.Button({ 
									type: "split", 
									id: "color-picker-button", 
									label: "<em id=\"current-color\">Current color is #FFFFFF.</em>", 
									menu: oColorPickerMenu, 
									container: this });
</textarea>

<p>
Once the new Button is created, add a listener for its "appendTo" event that 
will be used to render its Menu instance into the same DOM element specified as the 
containing element for the Button.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<p>
Once the new Button is created, add a listener for its "option" event that will be used to create a 
new ColorPicker instance.  (Defering the creation of the ColorPicker until the firing of the 
"option" event improves the intial load time of the Button instance.)
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<p>
Lastly, add some styles that customize both the Button's text label and 
the ColorPicker instance.
</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#button-container {

	padding: .5em;

}

#color-picker-button {

	vertical-align: baseline;

}

#color-picker-button button {

	outline: none;  /* Safari */
	line-height: 1.5;

}


/*
	Style the Button instance's label as a square whose background color 
	represents the current value of the ColorPicker instance.
*/

#current-color {

	display: block;
	display: inline-block;
	*display: block;    /* For IE */
	margin-top: .5em;
	*margin: .25em 0;    /* For IE */
	width: 1em;
	height: 1em;
	overflow: hidden;
	text-indent: 1em;
	background-color: #fff;
	white-space: nowrap;
	border: solid 1px #000;

}


/* Hide default colors for the ColorPicker instance. */

#color-picker-container .yui-picker-controls,
#color-picker-container .yui-picker-swatch,
#color-picker-container .yui-picker-websafe-swatch {

	display: none;

}


/*
	Size the body element of the Menu instance to match the dimensions of 
	the ColorPicker instance.
*/
		
#color-picker-menu .bd {

	width: 220px;    
	height: 190px;

}

#photo {

	background: #fff url(../button/assets/ggbridge.png) top left no-repeat;
	
	/*
		Hide the alpha PNG from IE 6 and make the background image transparent via the use of 
		the AlphaImageLoader that is applied by the filter property.
	*/

	_background-image: none;
	_filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../button/assets/ggbridge.png', sizingMethod='image');;

	border: solid 1px #000;
	width: 400px;
	height: 300px;
	
	_width: 398px;	/* For IE 6 */
	_height: 298px;	/* For IE 6 */

}

#button-container {

	border-top: solid 1px #000;
	padding: .5em .25em;
	margin-top: .5em;

}
</textarea>