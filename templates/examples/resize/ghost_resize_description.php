<h2 class="first">Setting up the element that we are going to resize</h2>

<p>We are going to make the element <code>#yui_img</code> resizable in all 8 directions.</p>
<p><strong>Note:</strong> When you want to resize an element that requires the top and left sides to be positioned, it is best practice to make the element <code>position: absolute</code>.
Otherwise it will be positioned relative and the outcome will not be what you expected.</p>

<textarea name="code" class="CSS">
    #yui_img {
        position: absolute;
        top: 20px;
        left: 20px;
    }
</textarea>
<textarea name="code" class="HTML">
<img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="166" width="250">
</textarea>

<h2>Creating the resize instance</h2>

<p>Since an image cannot have child nodes appended to it, the Resize Utility will auto wrap it with an element that can. See the <a href="../../docs/module_resize.html">API docs</a> for more info on the wrap option.</p>
<p>For shorthand, we are using the <code>handles</code> type of <code>All</code>, which just simply means <code>t, r, b, l, tr, tl, br, bl</code>. We are also using the config <code>knobHandles</code>, this applies a class to the Resize element and styles all of the handles into the small knobs seen above.</p>
<p>In this instance we have also turned on the following options:
    <ul>
        <li><code>draggable</code>, this will allow the element to be dragged.</li>
        <li><code>ghost</code>, this will apply a classname of <code>.yui-resize-ghost</code> to the parent for styling with opacity.</li>
        <li><code>status</code>, this is what turns on the yellow tooltip that follows the mouse when resizing.</li>
        <li><code>animate</code>, turns on animation for the resize.</li>
        <li><code>animateDuration</code>, the duration of the animation.</li>
        <li><code>animateEasing</code>, the easing method to apply to the animation instance.</li>
    </ul>
</p>
<textarea name="code" class="JScript">
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

})();   
</textarea>

<h2>Customizing the proxy element</h2>

<p>For this example, we want to make it look like the proxy is a copy of the image we are resizing.</p>
<p>We do this by subscribing to the <code>startResize</code> Event, and manipulating the proxy element with normal DOM scripting.</p>

<textarea name="code" class="JScript">
resize.on('startResize', function() {
    this.getProxyEl().innerHTML = '<img src="' + this.get('element').src + '" style="height: 100%; width: 100%;">';
    Dom.setStyle(this.getProxyEl().firstChild, 'opacity', '.25');
}, resize, true);
</textarea>

<h2>Full example code</h2>
<textarea name="code" class="JScript">
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
</textarea>

