<h2 class="first">Setting up the Image Cropper</h2>
<p>The ImageCropper Control will only work when applied to an image. So we place an image on the page and give it an id.</p>

<textarea name="code" class="HTML">
<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500">
<div id="button1"></div>
<div id="results"></div>
</textarea>

<h2>Creating the ImageCropper instance</h2>

<p>Next we call the <code>ImageCropper</code> constructor on the image.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
        var crop = new YAHOO.widget.ImageCropper('yui_img', {
            initialXY: [20, 20],
            keyTick: 5,
            shiftKeyTick: 50
        });
})();
</textarea>

<h2>Create the Button</h2>
<p>Now we need to create the button that we will use to fire the Connection Manager request.</p>
<textarea name="code" class="JScript">
var _button = new YAHOO.widget.Button({
    id: 'cropIt',
    container: 'button1',
    label: 'Crop Image',
    value: 'crop'
});

</textarea>

<h2>Setup Connection Manager</h2>
<p>Now that we have the button created, we need to setup the Connection Manager request.</p>
<p>We will listen to the Button's <code>click</code> event, then fire the request.</p>
<textarea name="code" class="JScript">
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

_button.on('click', function() {
    var coords = crop.getCropCoords();
    var url = '<?php echo $assetsDirectory; ?>crop.php?top=' + coords.top + '&left=' + coords.left + '&height=' + coords.height + '&width=' + coords.width;
    conn = YAHOO.util.Connect.asyncRequest('GET', url, callback);
});
</textarea>

<h2>Full Example Source</h2>
<textarea name="code" class="JScript">
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
</textarea>

