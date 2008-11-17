<h2 class="first">Creating Push Buttons</h2>

<p>A Push Button can be instantiated three different ways:</p>
<ul>
    <li><a href="#buildingfromdatasource">Using an existing <code>&#60;input type="button"/&#62;</code> or <code>&#60;button type="button"/&#62;</code> element</a></li>
    <li><a href="#buildingfromtemplate">Using pre-defined Button Control HTML</a></li>
    <li><a href="#buildingfromjavascript">Using no existing HTML</a></li>
</ul>


<h3 id="buildingfromdatasource">Using an existing <code>&#60;input type="button"/&#62;</code> or <code>&#60;button type="button"/&#62;</code> element</h3>
<p>A Button can be created using an existing <code>&#60;input type="button"/&#62;</code> or <code>&#60;button type="button"/&#62;</code> element as a source element, the attributes of which are captured and used for the creation of a new element that replaces the source element inline.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<button type="button" id="pushbutton1" name="button1" value="Add">Add</button>
<input type="button" id="pushbutton2" name="button2" value="Add">
</textarea>
<p>Pass the id of the source element as the first argument to the Button's constructor.  Additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> for a Button can be set at instantiation time by specifying them in an object literal that is passed as the second argument to the Button's constructor.  <em>Note: the value of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> passed to the Button constructor will trump those of the corresponding HTML attributes of the original source element.</em></p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oPushButton1 = new YAHOO.widget.Button("pushbutton1");
var oPushButton2 = new YAHOO.widget.Button("pushbutton2");
</textarea>


<h3 id="buildingfromtemplate">Using pre-defined Button Control HTML</h3>
<p>A Button can also be instantiated using pre-defined Button Control HTML: An element with a class of "yui-button" and "yui-push-button" containing a element with a class of "first-child" containing either an <code>&#60;input type="button"/&#62;</code> or <code>&#60;button type="button"/&#62;</code> element:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<span id="pushbutton4" class="yui-button yui-push-button">
    <span class="first-child">
        <input type="button" name="button4" value="Add">
    </span>
</span>
<span id="pushbutton5" class="yui-button yui-push-button">
    <em class="first-child">
        <button type="button" name="button5">Add</button>
    </em>
</span>
<span id="pushbutton6" class="yui-button yui-push-button">
    <strong class="first-child">
        <button type="button" name="button6">Add</button>
    </strong>
</span>
</textarea>
<p>To instantiate a Button using the Button Control HTML, pass the id of the Button's root element (the element with the classes "yui-button" and "yui-push-button" applied) as the first argument to constructor and any additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as the second argument via an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oPushButton4 = new YAHOO.widget.Button("pushbutton4");
var oPushButton5 = new YAHOO.widget.Button("pushbutton5");
var oPushButton6 = new YAHOO.widget.Button("pushbutton6");        
</textarea>


<h3 id="buildingfromjavascript">Using no existing HTML</h3>
<p>To build a Button without any existing HTML, pass a set of <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as a single argument to the constructor using an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oPushButton7 = new YAHOO.widget.Button({ 
                            label:"Add", 
                            id:"pushbutton7", 
                            container:"pushbuttonsfromjavascript" });
</textarea>
<p>In most cases, it is necessary to specify the button's id, type, label and container (the HTML element that the button should be appended to once created).  If an id is not specified for the button, one will be generated using the <code><a href="/yui/docs/YAHOO.util.Dom.html#generateId">generateId</a></code> method of the <a href="/yui/docs/module_dom.html">Dom utility</a>.  Similarly, if the "type" attribute is omitted, the default type of "button" will be applied.</p>


<h3>Adding a "click" event handler to a Button</h3>
<p>All of the the events for Button (including DOM-based events such as "mouseover" or "click") can be listened for via <code>addListener</code> method (or <code>on</code> for short).</p>
<p><strong>Note: </strong>To listen for DOM-based events, always use the provided event interface rather than attaching handlers directly to Button or ButtonGroup DOM elements.</p>
<p>The event object is passed to the handler function as the first argument.  For DOM events, this is the actual event object.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// "click" event handler for each Button instance

function onButtonClick(p_oEvent) {

    YAHOO.log("You clicked button: " + this.get("id"), "info", "example1");

}

var oPushButton1 = new YAHOO.widget.Button("pushbutton1");
oPushButton1.on("click", onButtonClick);
</textarea>
<p>
    It is also possible to add a "click" event handler via the "onclick" 
    configuration attribute.  The "onclick" configuration attribute accepts an
    object literal representing the code to be executed when the Button  
    is clicked.  The format for the object literal is: <br> <code> {<br> 
    <strong>fn:</strong> Function (Required),   &#47;&#47; The handler to call 
    when the event fires.<br> <strong>obj:</strong> Object (Optional), 
    &#47;&#47; An object to pass back to the handler.<br> <strong>scope:
    </strong> Object (Optional) &#47;&#47; The object to use for the scope of 
    the handler. (By default the scope is the YAHOO.widget.Button instance)
    <br> } </code>
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oPushButton2 = new YAHOO.widget.Button("pushbutton2", { onclick: { fn: onButtonClick } });
</textarea>


<h3>Add icons to a Button</h3>
<p>Add icons to Buttons via CSS. Set the "background" property of the Button's <code>&#60;button/&#62;</code> element to the url of the icon:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
.yui-button#pushbutton2 button,
.yui-button#pushbutton5 button, 
.yui-button#pushbutton8 button {

    background: url(../button/assets/add.gif) center center no-repeat;
    text-indent: -4em;
    overflow: hidden;
    padding: 0 .75em;
    width: 2em;
    *margin-left: 4em;   /* IE only */
    *padding: 0 1.75em;  /* IE only */

}

.yui-button#pushbutton3 button,
.yui-button#pushbutton6 button, 
.yui-button#pushbutton9 button {

    padding-left: 2em;
    background: url(../button/assets/add.gif) 10% 50% no-repeat;

}
</textarea>