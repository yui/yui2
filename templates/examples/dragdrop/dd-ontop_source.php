<div id="dd-demo-1" class="dd-demo"></div>
<div id="dd-demo-2" class="dd-demo"></div>
<div id="dd-demo-3" class="dd-demo"></div>

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
