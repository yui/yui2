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
<p>In this instance we have also turned on the convenience option <code>draggable</code>, this will allow the element to be dragged.</p>
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
            draggable: true,
            animate: true,
            animateDuration: .75,
            animateEasing: YAHOO.util.Easing.backBoth
        });
})();
</textarea>

