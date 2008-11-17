<style>
    #demo {
        height: 100px;
        width: 100px;
        border: 1px solid black;
        cursor: move;
        float: right;
    }
    #ifrm {
        width: 400px;
        height: 300px;
    }
</style>


<p>Try dragging the proxy element over the iframe below, in most browsers this will not happen. Now click the <code>Shim off</code> button and drag again. Now you can drag over the iframe.</p>
<p>You can see the shim by clicking the <code>Debug Off</code> button.</p>
<p><button id="shim" value="off">Shim Off</button> <button id="debugShim" value="off" disabled>Debug Off</button></p>
<div id="demo">Drag Me</div>
<iframe id="ifrm" src="../dragdrop/assets/blank.htm"></iframe>

<script type="text/javascript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

        Event.onDOMReady(function() {
            //Create the DDProxy Instance
            var dd = new YAHOO.util.DDProxy('demo', {
                //Don't resize the frame
                resizeFrame: false
            });
            //On startDrag let's change the proxy's size and color
            dd.on('startDragEvent', function() {
                Dom.setStyle(this.getDragEl(), 'height', '20px');
                Dom.setStyle(this.getDragEl(), 'width', '100px');
                Dom.setStyle(this.getDragEl(), 'backgroundColor', 'blue');
                Dom.setStyle(this.getDragEl(), 'color', 'white');
                this.getDragEl().innerHTML = 'Custom Proxy';
            });

            Event.on('shim', 'click', function(e) {
                var tar = Event.getTarget(e);
                var value = tar.value;
                if (value == 'off' || value == 'Shim Off') {
                    //Turn on the shim
                    dd.useShim = true;
                    tar.value = 'on';
                    tar.innerHTML = 'Shim On';
                    Dom.get('debugShim').disabled = false;
                } else {
                    //Turn off the shim
                    dd.useShim = false;
                    tar.value = 'off';
                    tar.innerHTML = 'Shim Off';
                    Dom.get('debugShim').disabled = true;
                }
            });

            Event.on('debugShim', 'click', function(e) {
                var tar = Event.getTarget(e);
                var value = tar.value;
                if (value == 'off' || value == 'Debug Off') {
                    //Turn on debugging the shim
                    YAHOO.util.DDM._debugShim = true;
                    tar.value = 'on';
                    tar.innerHTML = 'Debug On';
                } else {
                    //Turn off debugging the shim
                    YAHOO.util.DDM._debugShim = false;
                    tar.value = 'off';
                    tar.innerHTML = 'Debug Off';
                }
            
            });
        });
})();
</script>

