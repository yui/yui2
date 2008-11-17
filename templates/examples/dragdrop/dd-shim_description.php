<h2 class="first">Using The Drag Shim</h2>

<p>Code for this example.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
