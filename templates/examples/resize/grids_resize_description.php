<h2 class="first">Setting up the element that we are going to resize</h2>

<p>First we use the <a href="http://developer.yahoo.com/yui/grids/builder/">Grid Builder</a> to build a 50/50 split grid unit.</p>
<p>Note that we have placed the CSS property <code>overflow: hidden</code> on the element to keep the text from escaping when we resize.</p>

<textarea name="code" class="CSS">
#pg p {
     margin: 1em;
}
#pg {
    width: 600px;
    height: 200px;
}
#pg .yui-g {
    height: 200px;
    width: 600px;
    overflow: hidden;
}
#pg .yui-g .first {
    background-color: yellow;
}
#pg .yui-u {
    height: 100%;
    background-color: orange;
    overflow: hidden;
}
    
</textarea>
<textarea name="code" class="HTML">
<div id="pg">
    <div class="yui-g">
        <div class="yui-u first" id="sizeIt">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper, rutrum ac, enim. Nullam pretium interdum metus. Ut in neque. Vivamus ut lorem vitae turpis porttitor tempor. Nam consectetuer est quis lacus. Mauris ut diam nec diam tincidunt eleifend. Vivamus magna. Praesent commodo egestas metus. Praesent condimentum bibendum metus. Sed sem sem, molestie et, venenatis eget, suscipit quis, dui. Morbi molestie, ipsum nec posuere lobortis, massa diam aliquet pede, tempor ultricies neque tortor sit amet nisi. Suspendisse vel quam in nisl dictum condimentum. Maecenas volutpat leo vitae leo. Nullam elit arcu, ullamcorper commodo, elementum nec, dictum nec, augue. Maecenas at tellus vitae ante fermentum elementum. Ut auctor ante et nisi. Suspendisse sagittis tristique eros.</p>
        </div>
        <div class="yui-u" id="sizeIt2">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper, rutrum ac, enim. Nullam pretium interdum metus. Ut in neque. Vivamus ut lorem vitae turpis porttitor tempor. Nam consectetuer est quis lacus. Mauris ut diam nec diam tincidunt eleifend. Vivamus magna. Praesent commodo egestas metus. Praesent condimentum bibendum metus. Sed sem sem, molestie et, venenatis eget, suscipit quis, dui. Morbi molestie, ipsum nec posuere lobortis, massa diam aliquet pede, tempor ultricies neque tortor sit amet nisi. Suspendisse vel quam in nisl dictum condimentum. Maecenas volutpat leo vitae leo. Nullam elit arcu, ullamcorper commodo, elementum nec, dictum nec, augue. Maecenas at tellus vitae ante fermentum elementum. Ut auctor ante et nisi. Suspendisse sagittis tristique eros.</p>
        </div>
    </div>
</div>
</textarea>

<h2>Creating the resize instance</h2>
<p>Then we make the left grid unit a Resize instance and set it to only use the <code>right</code> handle.</p>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var resize = new YAHOO.util.Resize('sizeIt', {
            handles: ['r']
        });
    });

})();
</textarea>

<h2>Handling the other grid</h2>
<p>Now that we have one side resizing, we need to listen for the <code>resize</code> event. From here we will do the math needed to resize the other grid unit.</p>

<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        col1 = null
        col2 = null;

    Event.onDOMReady(function() {
        var size = parseInt(Dom.getStyle('pg', 'width'), 10);
        col1 = Dom.get('sizeIt');
        col2 = Dom.get('sizeIt2');
        var resize = new YAHOO.util.Resize('sizeIt', {
            handles: ['r'],
        });
        resize.on('resize', function(ev) {
            var w = ev.width;
            Dom.setStyle(col1, 'height', '');
            Dom.setStyle(col2, 'width', (size - w - 6) + 'px');
        });
    });

})();
</textarea>

<h2>Setting the max and min sizes</h2>
<p>Now we need to make sure that the units don't get too big or too small.</p>
<p>We do this by setting the <code>minWidth</code> and <code>maxWidth</code> of the left unit.</p>
<p>We set the minWidth to 150 pixels, then we get the size of the parent element (<code>#pc</code>) and subtract the min size of the other unit (in this case 150 pixels too). Now we have a maxWidth setting.</p>
<textarea name="code" class="JScript">
var max = (size - 150);
var resize = new YAHOO.util.Resize('sizeIt', {
    handles: ['r'],
    minWidth: 150,
    maxWidth: max
});
</textarea>

<h2>Adjusting the grid on load</h2>
<p>Finally, we force a resize to bring both units into sync with each other.</p>
<textarea name="code" class="JScript">
resize.resize(null, 200, 200, 0, 0, true);
</textarea>


<h2>Full Example Source</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        col1 = null
        col2 = null;

    Event.onDOMReady(function() {
        var size = parseInt(Dom.getStyle('pg', 'width'), 10);
        col1 = Dom.get('sizeIt');
        col2 = Dom.get('sizeIt2');
        var max = (size - 150);
        var resize = new YAHOO.util.Resize('sizeIt', {
            handles: ['r'],
            minWidth: 150,
            maxWidth: max
        });
        resize.on('resize', function(ev) {
            var w = ev.width;
            Dom.setStyle(col1, 'height', '');
            Dom.setStyle(col2, 'width', (size - w - 6) + 'px');
        });

        resize.resize(null, 200, 200, 0, 0, true);
    });

})();
</textarea>
