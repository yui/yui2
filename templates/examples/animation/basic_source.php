<div id="demo">Demo</div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var attributes = {
        width: { to: 0 }
    };
    var anim = new YAHOO.util.Anim('demo', attributes);

    YAHOO.util.Event.on('demo-run', 'click', function() {
        anim.animate();
    });

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
