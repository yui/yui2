<div id="demo">Demo</div>
<button id="demo-run">run</button>
<script>
(function() {
    var attributes = {
        width: { from: 30, to: 10, unit:'em' }
    };
    var anim = new YAHOO.util.Anim('demo', attributes);

    YAHOO.util.Event.on('demo-run', 'click', function() {
        anim.animate();
    });

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
