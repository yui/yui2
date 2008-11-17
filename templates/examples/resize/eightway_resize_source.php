<style>
    #yui_img {
        position: absolute;
        top: 20px;
        left: 20px;
    }
    #example-canvas {
        height: 200px;
    }
</style>

<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="166" width="250">

<script>

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

        var resize = new YAHOO.util.Resize('yui_img', {
            handles: 'all',
            knobHandles: true,
            height: '166px',
            width: '250px',
            proxy: true,
            draggable: true,
            animate: true,
            animateDuration: .75,
            animateEasing: YAHOO.util.Easing.backBoth
        });
})();
</script>
