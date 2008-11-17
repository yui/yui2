<style>
#demo {
    height:6em;
    width:20em;
    overflow:auto;
}
</style>
<div id="demo">
    <p>Sed pretium leo a quam. Sed placerat cursus odio. Duis varius mauris luctus enim. Sed augue. Vivamus malesuada pretium orci. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent et ante. Praesent convallis. Pellentesque sit amet leo. Ut convallis. Curabitur tincidunt, ipsum facilisis ultricies bibendum, eros dolor venenatis odio, id rutrum purus sem ac sem. Donec vel enim. Quisque purus. Vivamus fringilla, nibh sit amet blandit suscipit, dui arcu viverra magna, id consectetuer dui orci tincidunt neque. Morbi eget libero. Phasellus tempor. Duis dapibus. Pellentesque nisi arcu, mollis in, euismod non, fermentum sit amet, neque.</p>
</div>
<button id="demo-run">run</button>

<script>
(function() {
    var attributes = {
        scroll: { to: [0, 200] }
    };
    var anim = new YAHOO.util.Scroll('demo', attributes);

    YAHOO.util.Event.on('demo-run', 'click', function() {
        anim.animate();
    });

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");
})();
</script>
