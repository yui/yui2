<div id="foo">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var fade = function() {
        YAHOO.util.Dom.setStyle('foo', 'opacity', 0.5);
    };

    YAHOO.util.Event.on('demo-run', 'click', fade);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>
