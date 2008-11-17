<div id="demo">Demo</div>
<button id="demo-run">run</button>
<script type="text/javascript">
(function() {
    var attributes = {
        color: { to: '#06e' },
        backgroundColor: { to: '#e06' }
    };
    var anim = new YAHOO.util.ColorAnim('demo', attributes);

    YAHOO.util.Event.on(document, 'click', function() {
        anim.animate();
    });

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
