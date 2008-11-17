<div id="demo">

    <select name="foo">
        <option value="NONE" selected="selected">This is a very long select element for the example</option>
        <option value="1">Apple</option>
        <option value="2">Rutabaga</option>
        <option value="3">Motor oil</option>
    </select>

    <hr>
    <div id="dd1">
        <p>
            NO IFRAME<br>
            Drag over the select
        </p>
    </div>

    <div id="dd2">
        <p>
            IFRAME<br>
            Drag over the select
        </p>
    </div>

</div>
<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function () {
    var dd1 = new YAHOO.util.DD('dd1');
    var dd2 = new YAHOO.util.DD('dd2');

    dd1.startDrag = function (x,y) {
        YAHOO.log("Drag started for element with no protection from the display bug", "info", "example");
    }

    if (YAHOO.env.ua.ie > 5 && YAHOO.env.ua.ie < 7) {

        // Create an iframe shim
        var shim = document.createElement('iframe');
        shim.src = 'about:blank';
        shim.className = 'shim';

        // Add the shim to the dragging element on the first startDrag
        dd2.startDrag = function (x,y) {
            var d = this.getEl();

            if (d.firstChild !== shim) {
                YAHOO.util.Dom.setStyle(shim, 'height',d.offsetHeight);
                d.insertBefore(shim, d.firstChild);

                YAHOO.log("Your browser is IE " + YAHOO.env.ua.ie + ".  Shim added.", "info","example");

            } else {
                YAHOO.log("Your browser is IE " + YAHOO.env.ua.ie + ", but the shim was already added", "info","example");
            }
        }

    } else { // Not shim worthy

        dd2.startDrag = function (x,y) {
            YAHOO.log("Your browser is NOT IE.  No shim added.", "info", "example");
        }
    }
});
</script>
