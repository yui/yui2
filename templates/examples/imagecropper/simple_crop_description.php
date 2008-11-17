<h2 class="first">Setting up the Image Cropper</h2>
<p>The ImageCropper Control will only work when applied to an image. So we place an image on the page and give it an id.</p>

<textarea name="code" class="HTML">
<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500">
</textarea>

<h2>Creating the ImageCropper instance</h2>

<p>Next we call the <code>ImageCropper</code> constructor on the image.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var crop = new YAHOO.widget.ImageCropper('yui_img');
})();
</textarea>

