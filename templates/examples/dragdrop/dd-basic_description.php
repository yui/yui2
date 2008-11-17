<h2 class="first">Basic Drag and Drop</h2>

<p>The <a href="http://developer.yahoo.com/yui/dragdrop/">YUI Drag and Drop</a> Utility lets you make HTML elements draggable.</p>

<p>For this example, we will enable drag and drop for the three <code>&lt;div&gt;</code> elements.</p>
<p>Create the <code>demo</code> elements:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<div id="dd-demo-1" class="dd-demo"></div>
<div id="dd-demo-2" class="dd-demo"></div>
<div id="dd-demo-3" class="dd-demo"></div>

</textarea>

<p>Now we create the instances of <code>YAHOO.util.DD</code>, passing the element ids or references for our demo elements.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<script type="text/javascript">
    (function() {
        var dd, dd2, dd3;
        YAHOO.util.Event.onDOMReady(function() {
            dd = new YAHOO.util.DD("dd-demo-1");
            dd2 = new YAHOO.util.DD("dd-demo-2");
            dd3 = new YAHOO.util.DD("dd-demo-3");
        });
    })();
</script>

</textarea>
