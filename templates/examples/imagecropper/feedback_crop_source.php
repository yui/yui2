<style type="text/css" media="screen">
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
</style>

<p><img src="<?php echo $assetsDirectory; ?>yui.jpg" id="yui_img" height="333" width="500"></p>

<div id="results"><img src="<?php echo $assetsDirectory; ?>yui.jpg"></div>
<ul>
    <li>Height: (<span id="h">91</span>)</li>
    <li>Width: (<span id="w">150</span>)</li>
    <li>Top: (<span id="t">20</span>)</li>
    <li>Left: (<span id="l">20</span>)</li>
</ul>



<script>
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
</script>
