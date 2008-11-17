<style>
    #button1 {
        margin: 1em;
    }
</style>

<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500">
<div id="button1"></div>
<div id="results"></div>

<script>
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        conn = null,
        results = null;

    Event.onDOMReady(function() {
        results = Dom.get('results');
        var callback = {
            success: function(o) {
                var json = o.responseText.substring(o.responseText.indexOf('{'), o.responseText.lastIndexOf('}') + 1);
                var data = eval('(' + json + ')');                
                results.innerHTML = '<p><strong>' + data.data + '</strong></p>';
            },
            failure: function() {
                results.innerHTML = '<p><strong>An error occurred, please try again later.</strong></p>';
            }
        };
        var crop = new YAHOO.widget.ImageCropper('yui_img', {
            initialXY: [20, 20],
            keyTick: 5,
            shiftKeyTick: 50
        });

        var _button = new YAHOO.widget.Button({
            id: 'cropIt',
            container: 'button1',
            label: 'Crop Image',
            value: 'crop'
        });

        _button.on('click', function() {
            var coords = crop.getCropCoords();
            var url = '<?php echo $assetsDirectory; ?>crop.php?top=' + coords.top + '&left=' + coords.left + '&height=' + coords.height + '&width=' + coords.width;
            conn = YAHOO.util.Connect.asyncRequest('GET', url, callback);
        });
    });
})();
</script>
