<div id="foo"></div>
<div id="bar"></div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var setBgColor = function() {
        var bgcolor = YAHOO.util.Dom.getStyle('bar', 'backgroundColor');
        YAHOO.util.Dom.setStyle('foo', 'backgroundColor', bgcolor);
    };

    YAHOO.util.Event.on('demo-run', 'click', setBgColor);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>
