<h2 class="first">Creating Checkbox Buttons</h2>

<p>A Checkbox Button can be instantiated three different ways:</p>
<ul>
    <li><a href="#buildingfromdatasource">Using an existing <code>&#60;input type="checkbox"/&#62;</code> element</a></li>
    <li><a href="#buildingfromtemplate">Using pre-defined Button Control HTML</a></li>
    <li><a href="#buildingfromjavascript">Using no existing HTML</a></li>
</ul>


<h3 id="buildingfromdatasource">Using an existing <code>&#60;input type="checkbox"/&#62;</code> element</h3>
<p>A Checkbox Button can be created using an existing <code>&#60;input type="checkbox"/&#62;</code> element as a source element, the attributes of which are captured and used for the creation of a new element that replaces the source element inline.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<input id="checkbutton1" type="checkbox" name="checkboxfield1" value="1" checked>
</textarea>
<p>Pass the id of the source element as the first argument to the Button's constructor.  Additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> for a Button can be set at instantiation time by specifying them in an object literal that is passed as the second argument to the Button's constructor.  <em>Note: the value of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> passed to the Button constructor will trump those of the corresponding HTML attributes of the original source element.</em></p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oCheckButton1 = new YAHOO.widget.Button("checkbutton1", { label:"One" });
</textarea>


<h3 id="buildingfromtemplate">Using pre-defined Button Control HTML</h3>
<p>A Checkbox Button can also be instantiated using pre-defined Button Control HTML: An element with a class of "yui-button" and "yui-checkbox-button" containing a element with a class of "first-child" containing a <code>&#60;button/&#62;</code> element:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<span id="checkbutton5" class="yui-button yui-checkbox-button">
    <span class="first-child">
        <button type="button" name="checkboxfield2">One</button>
    </span>
</span>
</textarea>
<p>To instantiate a Checkbox Button using the Button Control HTML, pass the id of the Button's root element (the element with the classes "yui-button" and "yui-checkbox-button" applied) as the first argument to constructor and any additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as the second argument via an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oCheckButton5 = new YAHOO.widget.Button("checkbutton5", { 
                                        type:"checkbox", 
                                        value:"1", 
                                        checked:true });
</textarea>


<h3 id="buildingfromjavascript">Using no existing HTML</h3>
<p>To build a Checkbox Button without any existing HTML, pass a set of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as a single argument to the constructor using an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oCheckButton9 = new YAHOO.widget.Button({ 
                            type: "checkbox", 
                            label: "One", 
                            id: "checkbutton9", 
                            name: "checkboxfield3", 
                            value: "1", 
                            container: "checkboxbuttonsfromjavascript", 
                            checked: true });
</textarea>
<p>In most cases, it is necessary to specify the button's id, type, label and container (the HTML element that the button should be appended to once created).  If an id is not specified for the button, one will be generated using the <code><a href="/yui/docs/YAHOO.util.Dom.html#generateId">generateId</a></code> method of the <a href="/yui/docs/module_dom.html">Dom utility</a>.  Similarly, if the "type" attribute is omitted, the default type of "button" will be applied.</p>