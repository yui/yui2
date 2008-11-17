<h2 class="first">Creating Split Buttons</h2>

<p>With the inclusion of the optional Menu library, it is possible to create Buttons that incorporate a menu.</p>
<p>Split Buttons can be created with or without existing HTML. In either case, create a Split Button by setting the "type" configuration attribute to "split" and the "menu" configuration attribute to one of the following values:</p>
<ul>
    <li>Object specifying a <a href="../../docs/YAHOO.widget.Menu.html">YAHOO.widget.Menu</a> instance.</li>
    <li>Object specifying a <a href="../../docs/YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a> instance.</li>
    <li>String specifying the id attribute of the <code>&#60;div/&#62;</code> element used to create the menu.  By default the menu will be created as an instance of <a href="../../docs/YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a>.  If the <a href="../../docs/YAHOO.widget.Menu.html#CSS_CLASS_NAME">default CSS class name for YAHOO.widget.Menu</a> is applied to the <code>&#60;div/&#62;</code> element, it will be created as an instance of <a href="../../docs/YAHOO.widget.Menu.html">YAHOO.widget.Menu</a>.</li>
    <li>String specifying the id attribute of the <code>&#60;select/&#62;</code> element used to create the menu.</li>
    <li>Object specifying the <code>&#60;select/&#62;</code> element used to create the menu.</li>
    <li>Array of object literals, each representing a set of <a href="../../docs/YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a> configuration properties.</li>
    <li>Array of strings representing the text labels for each item in the menu.</li>
</ul>


<p>Since the "menu" attribute can be set to the id of an existing <code>&#60;select/&#62;</code> element, a Split Button can be used to collapse two HTML form controls (<code>&#60;input/&#62;</code> and <code>&#60;select/&#62;</code>) into one DHTML control. For example, consider the following HTML:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<input type="submit" id="splitbutton1" name="splitbutton1_button" value="Split Button 1">
<select id="splitbutton1select" name="splitbutton1select" multiple>
    <option value="0">One</option>
    <option value="1">Two</option>
    <option value="2">Three</option>                
</select>

<input type="button" id="splitbutton2" name="splitbutton2_button" value="Split Button 2">
<select id="splitbutton2select" name="splitbutton2select">
    <option value="0">One</option>
    <option value="1">Two</option>
    <option value="2">Three</option>                
</select>
</textarea>
<p>To instantiate a Split Button, pass the id of the source element as the first argument to the Button's constructor. Set the "type" configuration attribute to "menu" and the "menu" configuration attribute to the id of the Button's corresponding <code>&#60;select/&#62;</code> element.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oSplitButton1 = new YAHOO.widget.Button("splitbutton1", { type: "split",
                                        menu: "splitbutton1select" });

var oSplitButton2 = new YAHOO.widget.Button("splitbutton2", { type: "split", 
                                        menu: "splitbutton2select" });
</textarea>
<p><em>Please note:</em> If the source <code>&#60;input/&#62;</code> element's type was "submit," the Split Button will automatically submit its parent form when the user clicks or presses the button or chooses an option from the its menu.</p>


<p>Another way to create a Split Button from markup is to begin with an <code>&#60;input/&#62;</code> element and the markup format required for <a href="../../docs/YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a>:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<input type="button" id="splitbutton3" name="splitbutton3_button" value="Split Button 3">
<div id="splitbutton3menu" class="yui-overlay">
    <div class="bd">Split Button 3 Menu</div>
</div>
</textarea>
<p>To instantiate the Split Button, pass the id of the source element as the first argument to the Button's constructor. Set the "type" configuration attribute to "menu" and the "menu" configuration attribute to the id or node reference of the HTML element to be used to create the Overlay:
<textarea name="code" class="JScript" cols="60" rows="1">
var oSplitButton3 = new YAHOO.widget.Button("splitbutton3", { type: "split", 
                                        menu: "splitbutton3menu" });
</textarea>
<p>Using an Overlay instance as a Split Button's menu is useful when you need a simple container to house HTML content or another YUI widget, such as a Calendar or Color Picker.</p>


<p>It is also possible to create a Split Button that utilizes <a href="../../docs/YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a> completely from JavaScript.  Simply instantiate and render an Overlay instance.  Then instantiate a Split Button, setting its "type" configuration attribute to "menu" and its "menu" configuration attribute to the Overlay instance via an object literal passed as a single argument to the Button's constructor:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
    Search for an element to place the Split Button into via the 
    Event utilities "onContentReady" method
*/

YAHOO.util.Event.onContentReady("splitbuttonsfromjavascript", function () {

    // Instantiate an Overlay instance

    var oOverlay = new YAHOO.widget.Overlay("splitbutton5menu", 
                                        { visible: false });
    
    oOverlay.setBody("Split Button 5 Menu");


    // Instantiate a Split Button

    var oSplitButton5 = new YAHOO.widget.Button({ type: "split",  
                                label: "Split Button 5", menu: oOverlay });

    /*
         Append the Split Button and Overlay to the element with the id 
         of "splitbuttonsfromjavascript"
    */

    oSplitButton5.appendTo(this);

    oOverlay.render(this);
                    
});
</textarea>


<p>Another easy way to create a Split Button from JavaScript is to set the "menu" configuration property to an array of <a href="../../docs/YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a> configuration properties.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
//  Create an array of YAHOO.widget.MenuItem configuration properties

var aSplitButton4Menu = [

    { text: "one", value: 1 },
    { text: "two", value: 2 },
    { text: "three", value: 3 }

];

/*
    Instantiate a Split Button using the array of YAHOO.widget.MenuItem 
    configuration properties as the value for the "menu" configuration 
    attribute.
*/

var oSplitButton4 = new YAHOO.widget.Button({ type: "split",  
                                    label: "Split Button 4", 
                                    name: "splitbutton3", 
                                    menu: aSplitButton4Menu, 
                                    container: "splitbuttonsfromjavascript" });     
</textarea>

