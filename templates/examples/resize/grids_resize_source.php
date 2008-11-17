<style>
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
    
</style>

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

<script>
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
</script>
