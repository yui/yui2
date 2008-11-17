<h2 class="first">Customizing Element IDs and Form Labels in Color Picker</h2>

<p>Element ID strings for the <a href="http://developer.yahoo.com/yui/colorpicker/">Color Picker Control</a> are stored in the <code>YAHOO.widget.ColorPicker.prototype.ID</code> object. We've dumped the full output of that object to the logger to give you a sense of the object's full contents.</p>

<p>For the purposes of this example, we'll override the <code>R</code>, <code>G</code>, and <code>B</code> members of that object.  We'll create a new object with those members and then use <code><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#merge">YAHOO.lang.merge</a></code> to integrate our new values with the existing object; this will override only the members we specify in the second argument of the <code>merge</code> function:</p>

<textarea name="code" class="JScript" cols="60" rows="1">// this is how to override some or all of the
// element ids used by the control
var ids = YAHOO.lang.merge(
	YAHOO.widget.ColorPicker.prototype.ID, {
		R: "custom_R",
		G: "custom_G",
		B: "custom_B"
	});
</textarea>

<p>We can use the same technique to override members of <code>YAHOO.widget.ColorPicker.prototype.TXT</code> for the purposes of customization or internationalization.  Again, you can find the full contents of that object dumped to the logger console.</p><p>Here, we'll modify the <code>R</code>, <code>G</code>, and <code>B</code> members and change those text strings to "Red", "Green", and "Blue":</p>

<textarea name="code" class="JScript" cols="60" rows="1">// this is how to change the text generated
// by the control
var txt = YAHOO.lang.merge(
	YAHOO.widget.ColorPicker.prototype.TXT, {
		R: "Red",
		G: "Green",
		B: "Blue"
	});
</textarea>	
