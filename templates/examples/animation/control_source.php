<div id="demo"></div>
<button id="demo-run">run</button>

<script type="text/javascript">
(function() {
    var attributes = {
        points: { to: [600, 10], control: [ [300, 100], [800, 800] ] }
    };
    var anim = new YAHOO.util.Motion('demo', attributes);

    YAHOO.util.Event.on('demo-run', 'click', function() {
        anim.animate();
    });

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
