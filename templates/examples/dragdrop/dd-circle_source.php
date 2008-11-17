<div id="dd-demo-1" class="dd-demo"><br />DD</div>
<div id="dd-demo-2" class="dd-demo">DDTarget</div>

<script type="text/javascript">
    (function() {
        var dd, dd2, clickRadius = 46, startPos,
            Event=YAHOO.util.Event, Dom=YAHOO.util.Dom;

        YAHOO.util.Event.onDOMReady(function() {

            var el = Dom.get("dd-demo-1");
            startPos = Dom.getXY(el);

            dd = new YAHOO.util.DD(el);

            // our custom click validator let's us prevent clicks outside
            // of the circle (but within the element) from initiating a
            // drag.
            dd.clickValidator = function(e) {

                // get the screen rectangle for the element
                var el = this.getEl();
                var region = Dom.getRegion(el);

                // get the radius of the largest circle that can fit inside
                // var w = region.right - region.left;
                // var h = region.bottom - region.top;
                // var r = Math.round(Math.min(h, w) / 2);
                //-or- just use a well-known radius
                var r = clickRadius;

                // get the location of the click
                var x1 = Event.getPageX(e), y1 = Event.getPageY(e);

                // get the center of the circle
                var x2 = Math.round((region.right+region.left)/2);
                var y2 = Math.round((region.top+region.bottom)/2);


                // I don't want text selection even if the click does not
                // initiate a drag
                Event.preventDefault(e);

                // check to see if the click is in the circle
                return ( ((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) <= r*r );
            };

            dd.onDragDrop = function(e, id) {
                // center it in the square
                Dom.setXY(this.getEl(), Dom.getXY(id));
            }

            dd.onInvalidDrop = function(e) {
                // return to the start position
                // Dom.setXY(this.getEl(), startPos);

                // Animating the move is more intesting
                new YAHOO.util.Motion( 
                    this.id, { 
                        points: { 
                            to: startPos
                        }
                    }, 
                    0.3, 
                    YAHOO.util.Easing.easeOut 
                ).animate();

            }

            dd2 = new YAHOO.util.DDTarget("dd-demo-2");

        });
    })();
</script>
