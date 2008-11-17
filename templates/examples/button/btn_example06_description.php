<h2 class="first">Creating Reset Buttons</h2>

<p>A Reset Button can be instantiated three different ways:</p>

<ul>
    <li><a href="#buildingfromdatasource">Using an existing <code>&#60;input type="reset"/&#62;</code> or <code>&#60;button type="reset"/&#62;</code> element</a></li>
    <li><a href="#buildingfromtemplate">Using pre-defined Button Control HTML</a></li>
    <li><a href="#buildingfromjavascript">Using no existing HTML</a></li>
</ul>


<h3 id="buildingfromdatasource">Using an existing <code>&#60;input type="reset"/&#62;</code> or <code>&#60;button type="reset"/&#62;</code> element</h3>
<p>A Reset Button can be created using an existing <code>&#60;input type="reset"/&#62;</code> or <code>&#60;button type="reset"/&#62;</code> element as a source element, the attributes of which are captured and used for the creation of a new element that replaces the source element inline.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<input id="resetbutton1" type="reset" name="resetfield1" value="Reset Form">
<button id="resetbutton2" type="reset" name="resetfield2">Reset Form</button>
</textarea>
<p>Pass the id of the source element as the first argument to the Button's constructor.  Additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> for a Button can be set at instantiation time by specifying them in an object literal that is passed as the second argument to the Button's constructor.  <em>Note: the value of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> passed to the Button constructor will trump those of the corresponding HTML attributes of the original source element.</em></p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Create a Button using an existing <input> element as a data source

var oResetButton1 = new YAHOO.widget.Button("resetbutton1");

// Create a Button using an existing <button> element as a data source

var oResetButton2 = new YAHOO.widget.Button("resetbutton2");
</textarea>
<p>The Button's constructor will look for the existing <code>&#60;input type="reset"/&#62;</code> or <code>&#60;button type="reset"/&#62;</code> element and, once it is found, it will be swapped out for the newly created element via the DOM's <code>replaceChild</code> method.</p>


<h3 id="buildingfromtemplate">Using pre-defined Button Control HTML</h3>
<p>A Reset Button can also be instantiated using pre-defined Button Control HTML: An element with a class of "yui-button" and "yui-reset-button" containing a element with a class of "first-child" containing either a <code>&#60;input type="reset"/&#62;</code> or <code>&#60;button type="button"/&#62;</code> element:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<span id="resetbutton3" class="yui-button yui-reset-button">
    <span class="first-child">
        <input type="reset" name="resetfield3" value="Reset Form">
    </span>
</span>
<span id="resetbutton4" class="yui-button yui-reset-button">
    <span class="first-child">
        <button type="button" name="resetfield4">Reset Form</button>
    </span>
</span>
</textarea>
<p>To instantiate a Reset Button using the Button Control HTML, pass the id of the Button's root element (the element with the classes "yui-button" and "yui-reset-button" applied) as the first argument to constructor and any additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as the second argument via an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oResetButton3 = new YAHOO.widget.Button("resetbutton3");

var oResetButton4 = new YAHOO.widget.Button("resetbutton4", { type: "reset" });
</textarea>


<h3 id="buildingfromjavascript">Using no existing HTML</h3>
<p>To build a Reset Button without any existing HTML, pass a set of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as a single argument to the constructor using an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oResetButton5 = new YAHOO.widget.Button({ type: "reset", 
                                label: "Reset Form", 
                                id: "resetfield5", 
                                container:  "resetbuttonsfromjavascript" });
</textarea>
<p>In most cases, it is necessary to specify the button's id, type, label and container (the HTML element that the button should be appended to once created).  If an id is not specified for the button, one will be generated using the <code><a href="/yui/docs/YAHOO.util.Dom.html#generateId">generateId</a></code> method of the <a href="/yui/docs/module_dom.html">Dom utility</a>.  Similarly, if the "type" attribute is omitted, the default type of "button" will be applied.</p>