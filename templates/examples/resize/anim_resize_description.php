<h2 class="first">Setting up the element that we are going to resize</h2>

<p>We are just going to make the element <code>#resize</code> resizable.</p>
<p>Note that we have placed the CSS property <code>overflow: hidden</code> on the element to keep the text from escaping when we resize.</p>

<textarea name="code" class="CSS">
    #resize {
        border: 1px solid black;
        height: 100px;
        width: 200px;
        overflow: hidden;
        background-color: #fff;
    }
</textarea>
<textarea name="code" class="HTML">
<div id="resize">
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
</div>
</textarea>

<h2>Creating the resize instance</h2>

<p>To make use of the proxy element, simply pass <code>proxy: true</code> as part of the Resize configuration.</p>
<p><strong>Note:</strong> You must use the <code>proxy</code> option if you want to use the <code>animate</code> option.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var resize = new YAHOO.util.Resize('resize', {
        proxy: true,
        animate: true,
        animateDuration: .75,
        animateEasing: YAHOO.util.Easing.backBoth
    });
})();
</textarea>

