
<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500">

<script>
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var crop = new YAHOO.widget.ImageCropper('yui_img', {
        initialXY: [20, 20],
        initHeight: (Dom.get('yui_img').height / 2),
        initWidth: (Dom.get('yui_img').width / 2),
        keyTick: 5,
        shiftKeyTick: 50
    });
})();
</script>
