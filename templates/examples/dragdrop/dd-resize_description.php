<h2 class="first">Basic Drag and Drop</h2>

<p>The <a href="http://developer.yahoo.com/yui/dragdrop/">Drag &amp; Drop Utility</a> lets you make HTML elements draggable.</p>

<p>For this example, the large grey square will be <code>YAHOO.util.DD</code> instance, 
    making it draggable.  The blue square in the lower right corner is positioned
    to stay in that corner, so we <code>YAHOO.util.DragDrop</code> instead 
    of <code>YAHOO.util.DD</code> to implement the resize handle.  This is because
    we only want to track the coordinates of the drag operation to resize the panel.  
    We don't want to reposition the resize handle (it will reposition itself as we
	resize the panel).</p>

<p>Markup:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<div id="dd-panel">
    <div id="dd-resize-handle"></div>
</div>

</textarea>

<p>Code:</p>

<textarea name="code" class="JScript" cols="60" rows="1">

<script type="text/javascript">

YAHOO.example.DDResize = function(panelElId, handleElId, sGroup, config) {
    YAHOO.example.DDResize.superclass.constructor.call(this, panelElId, sGroup, config);
    if (handleElId) {
        this.setHandleElId(handleElId);
    }
};

YAHOO.extend(YAHOO.example.DDResize, YAHOO.util.DragDrop, {

    onMouseDown: function(e) {
        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e),
                         YAHOO.util.Event.getPageY(e)];
    },

    onDrag: function(e) {
        var newPos = [YAHOO.util.Event.getPageX(e),
                      YAHOO.util.Event.getPageY(e)];

        var offsetX = newPos[0] - this.startPos[0];
        var offsetY = newPos[1] - this.startPos[1];

        var newWidth = Math.max(this.startWidth + offsetX, 10);
        var newHeight = Math.max(this.startHeight + offsetY, 10);

        var panel = this.getEl();
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
    }
});

(function() {
    var dd, dd2, dd3;
    YAHOO.util.Event.onDOMReady(function() {
        // put the resize handle and panel drag and drop instances into different
        // groups, because we don't want drag and drop interaction events between
        // the two of them.
        dd = new YAHOO.example.DDResize("dd-panel", "dd-resize-handle", "panelresize");
        dd2 = new YAHOO.util.DD("dd-panel", "paneldrag");

        // addInvalidHandleid will make it so a mousedown on the resize handle will 
        // not start a drag on the panel instance.  
        dd2.addInvalidHandleId("dd-resize-handle");
    });
})();

</script>

</textarea>
