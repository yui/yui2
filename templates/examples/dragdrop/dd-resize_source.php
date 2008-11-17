<div id="dd-panel">
    <div id="dd-resize-handle"></div>
</div>

<script type="text/javascript">

YAHOO.example.DDResize = function(panelElId, handleElId, sGroup, config) {
    YAHOO.example.DDResize.superclass.constructor.apply(this, arguments);
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
