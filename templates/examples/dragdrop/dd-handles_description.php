<h2 class="first">Basic Drag and Drop</h2>

<p>The <a href="http://developer.yahoo.com/yui/dragdrop/">YUI Drag and Drop</a>
Utility lets you make HTML elements draggable.</p>

<p>For this example, we will enable drag and drop for the three
<code>&lt;div&gt;</code> elements.</p> <p>Create the <code>demo</code>
elements:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<div id="dd-demo-1" class="dd-demo">
    <div id="dd-handle-1a" class="dd-multi-handle-1">H1</div>
    <div id="dd-handle-1b" class="dd-multi-handle-2">H2</div>
</div>
<div id="dd-demo-2" class="dd-demo">
    <div id="dd-handle-2" class="dd-handle">H</div>
</div>

<div id="dd-handle-3b" class="dd-outer-handle">Outer</div>
<div id="dd-demo-3" class="dd-demo"></div></textarea>

<p>Now we instantiate three <code>YAHOO.util.DD</code> instances.  By default, a <code>mousedown</code>
on any part of source element would start a drag operation.  We use 
<code>setHandleElId</code> to make it so that only a specific area or 
areas of the source element will start a drag when clicked.
</p>
<p>Elements that are not a child of the source element can be used as drag
handles by using <code>setOuterHandleElId</code>.

<textarea name="code" class="JScript" cols="60" rows="1">

<script type="text/javascript">

(function() {

    var dd, dd2, dd3;
    YAHOO.util.Event.onDOMReady(function() {
        dd = new YAHOO.util.DD("dd-demo-1");

        // Configure one or more child element as a drag handle
        dd.setHandleElId("dd-handle-1a");
        dd.setHandleElId("dd-handle-1b");

        dd2 = new YAHOO.util.DD("dd-demo-2");
        dd2.setHandleElId("dd-handle-2");

        dd3 = new YAHOO.util.DD("dd-demo-3");
        dd3.setHandleElId("dd-handle-3a");

        // A handle that is not child of the source element
        dd3.setOuterHandleElId("dd-handle-3b");
    });

})();
</script>

</textarea>
