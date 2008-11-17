<h2 class="first">Setting up the Image Cropper</h2>
<p>The ImageCropper Control will only work when applied to an image. So we place an image on the page and give it an id.</p>

<textarea name="code" class="HTML">
<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500">
</textarea>

<h2>Creating the ImageCropper instance</h2>

<p>Next we call the <code>ImageCropper</code> constructor on the image.</p>
<p>In this example, we are setting up a few advanced configs:
    <ul>
        <li><code>initialXY</code>: The initial position of the crop region (defaults to [10, 10]).</li>
        <li><code>initHeight</code>: The inital height of the crop region (defaults to 1/4 the height).</li>
        <li><code>initWidth</code>: The inital width of the crop region (defaults to 1/4 the width).</li>
        <li><code>keyTick</code>: The tick interval for the arrow keys (defaults to 1 pixel)</li>
        <li><code>shiftKeyTick</code>: The tick interval for the arrow keys when the shift key is pressed (defaults to 10 pixels)</li>
    </ul>
</p>

<textarea name="code" class="JScript">
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
</textarea>

