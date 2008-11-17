<h2 class="first">Using a Color Picker in a Dialog Control</h2>

<p>The focus in this example is on the use of <a href="http://developer.yahoo.com/yui/colorpicker/">Color Picker Control</a> within a <a href="http://developer.yahoo.com/yui/container/dialog/">Dialog Control</a>.</p>  In many cases, you'll want to use this implementation for Color Picker as it allows you to avoid reserving space inline in the page for the Color Picker interface.  Dialog is ideally suited for this purpose because it floats above the page and is designed to collect and submit form data.  Here we'll use Dialog's built-in support for Connection Manager and use that mechanism to process the color information gathered via Color Picker.</p>

<p>We'll also use a configuration dashboard that allows us to selectively enable/disable aspects of the Color Picker interface.</p>

<p>Here's the markup we need to get started:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><!--begin Color Picker configuration dashboard: -->
<div>
  <button id="show">Show Color Picker</button> 
  <button id="hide">Hide Color Picker</button>
  <button id="btnhsv">Show/hide HSV fields</button>
  <button id="btnhex">Show/hide HEX field</button>
  <button id="btnrgb">Show/hide RGB field</button>
  <button id="btnhexsummary">Show/hide HEX summary info</button>
</div>

<!--begin Dialog markup in standard module format; see the Container Family
	documentation for more about what markup is required for these controls-->
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
<div id="resp">Server response will be displayed in this area</div></textarea>

<p>This markup provides us with a containing element for our Dialog instance (<code>yui-picker-panel</code>) and another containing element for our Color Picker (<code>yui-picker</code>).  From here, we can begin our JavaScript.  We'll use  <a href="http://yuiblog.com/blog/2007/06/12/module-pattern/">the Module Pattern</a> to construct our code, beginning by creating a namespace for our example code and some useful shortcuts to commonly-used YUI components.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//create a namespace object in the example namespace:
YAHOO.namespace("example.colorpicker")

//create a new object for this module:
YAHOO.example.colorpicker.inDialog = function() {

	//Some shortcuts to use in our example:
	var Event=YAHOO.util.Event,
		Dom=YAHOO.util.Dom,
		lang=YAHOO.lang;
</textarea>

<p>The object <code>YAHOO.example.colorpicker.inDialog</code> is returned from our anonymous function.  Its first member is our <code>init</code> function, wherein we create the Dialog instance:</p>
	
<textarea name="code" class="JScript" cols="60" rows="1">//In our initialization function, we'll create the dialog;
//in its render event, we'll create our Color Picker instance.
init: function() {

	// Instantiate the Dialog
	this.dialog = new YAHOO.widget.Dialog("yui-picker-panel", { 
		width : "500px",
		fixedcenter : true,
		visible : false, 
		constraintoviewport : true,
		buttons : [ { text:"Submit", handler:this.handleSubmit, isDefault:true },
					{ text:"Cancel", handler:this.handleCancel } ]
	 });
</textarea> 

<p>We don't want to create our Color Picker until the Dialog has rendered, so we tie our Color Picker's instantiation block to the Dialog's <code>renderEvent</code>:</p>


<textarea name="code" class="JScript" cols="60" rows="1">// Once the Dialog renders, we want to create our Color Picker
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
</textarea>		

<p>Outside of our initialization function, we create success and failure handlers to deal with data as it comes back from Connection Manager.  Those are then accessible to us as we initialize, and we can wire them up to our Dialog's callback object:</p>

<textarea name="code" class="JScript" cols="60" rows="1">// Wire up the success and failure handlers
this.dialog.callback = { success: this.handleSuccess, thisfailure: this.handleFailure };
</textarea>  

<p>The last step in our initialization is to render our dialog:</p>    
      
<textarea name="code" class="JScript" cols="60" rows="1">// We're all set up with our Dialog's configurations;
// now, render the Dialog
this.dialog.render();
</textarea>	

<p>When our <code>YAHOO.example.colorpicker.inDialog</code> object is created, we can then set its init function to fire <code>onDOMReady</code>:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//The earliest safe moment to instantiate a Dialog (or any
//Container element is onDOMReady; we'll initialize then:
YAHOO.util.Event.onDOMReady(YAHOO.example.colorpicker.inDialog.init, YAHOO.example.colorpicker.inDialog, true);</textarea>

<p>We've only called out some of the more significant parts of this example's code in the description above; to see the full example's source code, view this example via its "new window" button and view the page source.</p>
</script>


