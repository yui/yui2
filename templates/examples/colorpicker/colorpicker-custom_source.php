<div id="yui-picker-panel">
  <div class="yui-picker" id="yui-picker"></div>
</div>

<script type="text/javascript">

//dump the contents of the element IDs object to the Logger:
YAHOO.log("The full contents of the YAHOO.widget.ColorPicker.prototype.ID object: " + YAHOO.lang.dump(YAHOO.widget.ColorPicker.prototype.ID), "info", "example");

//dump the contents of the interface text strings object to the Logger:
YAHOO.log("The full contents of the YAHOO.widget.ColorPicker.prototype.TXT object: " + YAHOO.lang.dump(YAHOO.widget.ColorPicker.prototype.TXT), "info", "example");

//Using an anonymous function keeps our variables
//out of the global namespace.
(function() {
    var Event = YAHOO.util.Event,
        picker;

    // this is how to override some or all of the
    // element ids used by the control
    var ids = YAHOO.lang.merge(
        YAHOO.widget.ColorPicker.prototype.ID, {
            R: "custom_R",
            G: "custom_G",
            B: "custom_B"
        });

    // this is how to change the text generated
    // by the control
    var txt = YAHOO.lang.merge(
        YAHOO.widget.ColorPicker.prototype.TXT, {
            R: "Red",
            G: "Green",
            B: "Blue"
        });
	
	//Having changed the default element ids, you can
	//instantiate your picker:
    Event.onDOMReady(function() {
            picker = new YAHOO.widget.ColorPicker("yui-picker-panel", {
                    showhsvcontrols: true,
                    showhexcontrols: true,
                    ids: ids,
                    txt: txt,
                    animate: false
                });
        });
})();
</script>
