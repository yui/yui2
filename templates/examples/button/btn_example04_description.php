<h2 class="first">Creating Radio Buttons</h2>

<p>The ButtonGroup class creates a set of Buttons that are mutually exclusive; checking one button in the group will uncheck all others in the group.  The ButtonGroup class is defined by <code>YAHOO.widget.ButtonGroup</code> and a ButtonGroup's root HTML element is a <code>&#60;div/&#62;</code>.</p>
<p>A ButtonGroup can be instantiated three different ways:</p>
<ul>
    <li><a href="#buildingfromdatasource">Using an existing set of <code>&#60;input type="radio"/&#62;</code> elements</a></li>
    <li><a href="#buildingfromtemplate">Using an existing set of Buttons defined using Button Control HTML</a></li>
    <li><a href="#buildingfromjavascript">Using no existing HTML</a></li>
</ul>


<h3>Using an existing set of <code>&#60;input type="radio"/&#62;</code> elements</h3>
<p>A ButtonGroup can be created from a set of existing <code>&#60;input type="radio"/&#62;</code> elements:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="buttongroup1" class="yui-buttongroup">
    <input id="radio1" type="radio" name="radiofield1" value="Radio 1" checked>
    <input id="radio2" type="radio" name="radiofield1" value="Radio 2">
    <input id="radio3" type="radio" name="radiofield1" value="Radio 3">
    <input id="radio4" type="radio" name="radiofield1" value="Radio 4">
</div>
</textarea>
<p>To instantiate a ButtonGroup from existing HTML, pass the id of the ButtonGroup's <code>&#60;div/&#62;</code> element as the first argument to the ButtonGroup constructor and any additional <a href="http://developer.yahoo.com/yui/button/#buttongroupconfigreference">configuration attributes</a> as the second argument via an object literal.  The ButtonGroup will automatically search its child nodes for HTML radio buttons (<code>&#60;input type="radio"/&#62;</code>) and use those elements to create instances of YAHOO.widget.Button of type "radio."</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButtonGroup1 = new YAHOO.widget.ButtonGroup("buttongroup1")
</textarea>


<h3 id="buildingfromtemplate">Using an existing set of Buttons defined using Button Control HTML</h4>
<p>Alternatively, each Button in a ButtonGroup can be defined using the YUI Button HTML:  An element with a class of "yui-button" and "yui-radio-button" containing a element with a class of "first-child" containing a <code>&#60;button/&#62;</code> element.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="buttongroup2" class="yui-buttongroup">
    <span id="radio5" class="yui-button yui-radio-button yui-button-checked">
        <span class="first-child">
            <button type="button" name="radiofield2" value="Radio 5">
                Radio 5
            </button>
        </span>
    </span>
    <span id="radio6" class="yui-button yui-radio-button">
        <span class="first-child">
            <button type="button" name="radiofield2" value="Radio 6">
                Radio 6
            </button>
        </span>
    </span>
    <span id="radio7" class="yui-button yui-radio-button">
        <span class="first-child">
            <button type="button" name="radiofield2" value="Radio 7">
                Radio 7
            </button>
        </span>
    </span>
    <span id="radio8" class="yui-button yui-radio-button">
        <span class="first-child">
            <button type="button" name="radiofield2" value="Radio 8">
                Radio 8
            </button>
        </span>
    </span>
</div>
</textarea>
<p>To instantiate a ButtonGroup using the Button Control HTML, pass the id of the ButtonGroup's root element (the element with the classes "yui-buttongroup" and "yui-radio-button" applied) as the first argument to constructor and any additional <a href="http://developer.yahoo.com/yui/button/#buttonconfigreference">configuration attributes</a> as the second argument via an object literal.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButtonGroup2 = new YAHOO.widget.ButtonGroup("buttongroup2");
</textarea>


<h3 id="buildingfromjavascript">Using no existing HTML</h3>
<p>To build a ButtonGroup with no existing HTML, pass a set of <a href="http://developer.yahoo.com/yui/button/#buttongroupconfigreference">configuration attributes</a> as a single argument to the ButtonGroup constructor using an object literal.  Add buttons to the ButtonGroup via the <code>addButton</code> or <code>addButtons</code> methods.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButtonGroup3 = new YAHOO.widget.ButtonGroup({ 
                                id:  "buttongroup3", 
                                name:  "radiofield3", 
                                container:  "radiobuttonsfromjavascript" });

oButtonGroup3.addButtons([

    { label: "Radio 9", value: "Radio 9", checked: true },
    { label: "Radio 10", value: "Radio 10" }, 
    { label: "Radio 11", value: "Radio 11" }, 
    { label: "Radio 12", value: "Radio 12" }

]);
</textarea>
<p>In most cases, it is necessary to specify the ButtonGroup's id and container (the HTML element that the ButtonGroup should be appended to once created).  If an id is not specified for the ButtonGroup, one will be generated using the <code><a href="/yui/docs/YAHOO.util.Dom.html#generateId">generateId</a></code> method of the <a href="/yui/docs/module_dom.html">Dom utility</a>.</p>