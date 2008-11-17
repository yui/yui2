<style>
    #yui_img {
        position: absolute;
        top: 20px;
        left: 20px;
    }
    #example-canvas {
        height: 200px;
    }
    div.wrap {
        position: relative;
    }
</style>

<div class="wrap"><img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="166" width="250"></div>

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
            ghost: true,
            status: true,
            draggable: true,
            animate: true,
            animateDuration: .75,
            animateEasing: YAHOO.util.Easing.backBoth
        });

        resize.on('startResize', function() {
            this.getProxyEl().innerHTML = '<img src="' + this.get('element').src + '" style="height: 100%; width: 100%;">';
            Dom.setStyle(this.getProxyEl().firstChild, 'opacity', '.25');
        }, resize, true);
        
})();
</script>
