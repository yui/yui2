<h2 class="first">Basic Drag and Drop</h2>

<p>The <a href="http://developer.yahoo.com/yui/dragdrop/">YUI Drag and Drop</a>
Utility lets you make HTML elements draggable.</p>

<p>For this example, we will enable drag and drop for the three
<code>&lt;div&gt;</code> elements.</p> <p>Create the <code>demo</code>
elements:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<div id="dd-demo-1" class="dd-demo"></div>
<div id="dd-demo-2" class="dd-demo"></div>
<div id="dd-demo-3" class="dd-demo"></div>

</textarea>


<p>Next, we define a custom drag and drop implementation that extends
<code>YAHOO.util.DD</code>.  Drag and drop exposes many interesting moments that
you can use to implement custom functionality.  In this example, we
override the <code>startDrag</code> and <code>endDrag</code> moments to adjust the <code>z-index</code>
property so that the dragged element is always on top.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<script type="text/javascript">

// Our custom drag and drop implementation, extending YAHOO.util.DD
YAHOO.example.DDOnTop = function(id, sGroup, config) {
    YAHOO.example.DDOnTop.superclass.constructor.apply(this, arguments);
};

YAHOO.extend(YAHOO.example.DDOnTop, YAHOO.util.DD, {
    origZ: 0,

    startDrag: function(x, y) {
        YAHOO.log(this.id + " startDrag", "info", "example");

        var style = this.getEl().style;

        // store the original z-index
        this.origZ = style.zIndex;

        // The z-index needs to be set very high so the element will indeed be on top
        style.zIndex = 999;
    },

    endDrag: function(e) {
        YAHOO.log(this.id + " endDrag", "info", "example");

        // restore the original z-index
        this.getEl().style.zIndex = this.origZ;
    }
});

</script>

</textarea>

<p>Now we create the instances of <code>YAHOO.example.DDOnTop</code>, passing the
element ids or references for our demo elements.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<script type="text/javascript">

(function() {

    var dd, dd2, dd3;
    YAHOO.util.Event.onDOMReady(function() {
        dd = new YAHOO.example.DDOnTop("dd-demo-1");
        dd2 = new YAHOO.example.DDOnTop("dd-demo-2");
        dd3 = new YAHOO.example.DDOnTop("dd-demo-3");
    });

})();

</script>

</textarea>
