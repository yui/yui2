<div id="foo"></div>
<div id="bar"></div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var move = function() {
        var xy = YAHOO.util.Dom.getXY('bar');
        YAHOO.util.Dom.setXY('foo', xy);
    };

    YAHOO.util.Event.on('demo-run', 'click', move);

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>
