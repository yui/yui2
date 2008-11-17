<div id="dd-demo-canvas1">
    <div id="dd-demo-canvas2">
        <div id="dd-demo-canvas3">
            <div id="dd-demo-1" class="dd-demo"><div>1</div></div>
            <div id="dd-demo-2" class="dd-demo"><div>2</div></div>
            <div id="dd-demo-3" class="dd-demo"><div>3</div></div>
        </div>
    </div>
</div>

<script type="text/javascript">

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        dd1, dd2, dd3;


    YAHOO.example.DDRegion = function(id, sGroup, config) {
        this.cont = config.cont;
        YAHOO.example.DDRegion.superclass.constructor.apply(this, arguments);
    };

    YAHOO.extend(YAHOO.example.DDRegion, YAHOO.util.DD, {
        cont: null,
        init: function() {
            //Call the parent's init method
            YAHOO.example.DDRegion.superclass.init.apply(this, arguments);
            this.initConstraints();

            Event.on(window, 'resize', function() {
                this.initConstraints();
            }, this, true);
        },
        initConstraints: function() {
            //Get the top, right, bottom and left positions
            var region = Dom.getRegion(this.cont);

            //Get the element we are working on
            var el = this.getEl();

            //Get the xy position of it
            var xy = Dom.getXY(el);

            //Get the width and height
            var width = parseInt(Dom.getStyle(el, 'width'), 10);
            var height = parseInt(Dom.getStyle(el, 'height'), 10);

            //Set left to x minus left
            var left = xy[0] - region.left;

            //Set right to right minus x minus width
            var right = region.right - xy[0] - width;

            //Set top to y minus top
            var top = xy[1] - region.top;

            //Set bottom to bottom minus y minus height
            var bottom = region.bottom - xy[1] - height;

            //Set the constraints based on the above calculations
            this.setXConstraint(left, right);
            this.setYConstraint(top, bottom);
        }
    });


    Event.onDOMReady(function() {
        dd1 = new YAHOO.example.DDRegion('dd-demo-1', '', { cont: 'dd-demo-canvas3' });
        dd2 = new YAHOO.example.DDRegion('dd-demo-2', '', { cont: 'dd-demo-canvas2' }) ;
        dd3 = new YAHOO.example.DDRegion('dd-demo-3', '', { cont: 'dd-demo-canvas1' });
    });

})();

</script>
