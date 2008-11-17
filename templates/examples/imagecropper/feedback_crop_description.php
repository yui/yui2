<h2 class="first">Setting up the Image Cropper</h2>
<p>The ImageCropper Control will only work when applied to an image. So we place an image on the page and give it an id.</p>

<textarea name="code" class="CSS">
    #results {
        border: 1px solid black;
        height: 83px;
        width: 125px;
        position: relative;
        overflow: hidden;
    }
    #results img {
        position: absolute;
        top: -20px;
        left: -20px;
    }
</textarea>
<textarea name="code" class="HTML">
<p><img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500"></p>

<div id="results"><img src="<?php echo $assetsDirectory; ?>yui.jpg"></div>
<ul>
    <li>Height: (<span id="h">91</span>)</li>
    <li>Width: (<span id="w">150</span>)</li>
    <li>Top: (<span id="t">20</span>)</li>
    <li>Left: (<span id="l">20</span>)</li>
</ul>
</textarea>

<h2>Creating the ImageCropper instance</h2>

<p>Next we call the <code>ImageCropper</code> constructor on the image.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var crop = new YAHOO.widget.ImageCropper('yui_img', {
            initialXY: [20, 20],
            keyTick: 5,
            shiftKeyTick: 50
        });
    });
})();
</textarea>

<h2>Hooking into the ImageCroppers Events</h2>
<p>Next we listen for the <code>moveEvent</code> and react to the changes. By calling the <code>getCropCoords</code> method, we will be returned an object like this:</p>

<textarea name="code" class="JScript">
{
    top: 10,
    left: 10,
    height: 100.
    width: 300
}
</textarea>

<p>Using this information, we can use DOM to update the results with the proper information.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        results = null;
    
    Event.onDOMReady(function() {
            results = Dom.get('results');    
            var crop = new YAHOO.widget.ImageCropper('yui_img', {
                initialXY: [20, 20],
                keyTick: 5,
                shiftKeyTick: 50
            });
            crop.on('moveEvent', function() {
                var region = crop.getCropCoords();
                results.firstChild.style.top = '-' + region.top + 'px';
                results.firstChild.style.left = '-' + region.left + 'px';
                results.style.height = region.height + 'px';
                results.style.width = region.width + 'px';
                Dom.get('t').innerHTML = region.top;
                Dom.get('l').innerHTML = region.left;
                Dom.get('h').innerHTML = region.height;
                Dom.get('w').innerHTML = region.width;
            });
    });
})();
</textarea>
