<h2 class="first" id="demo-start">Setting up the playing field</h2>

<p>First we setup the HTML for the canvas (playing field) and place some players on it.</p>

<textarea name="code" class="HTML">
<div id="dd-demo-canvas1">
    <div id="dd-demo-canvas2">
        <div id="dd-demo-canvas3">
            <div id="dd-demo-1" class="dd-demo"><div>1</div></div>
            <div id="dd-demo-2" class="dd-demo"><div>2</div></div>
            <div id="dd-demo-3" class="dd-demo"><div>3</div></div>
        </div>
    </div>
</div>
</textarea>

<h2 id="demo-sizing">Size of the playing field</h2>

<p>Next we have to get the size of the playing field. To do this, we will use <code>YAHOO.util.Dom.getRegion('dd-demo-canvas')</code>. getRegion will return something like this:</p>

<textarea name="code" class="JScript">
{
    0: 255,
    1: 248, 
    bottom: 432,
    left: 255, 
    right: 1068,
    top: 248
}
</textarea>

<p>Now we have the top, bottom, left and right pixel locations of the playing field, we can do some math and set some constraints.</p>

<h2 id="demo-themath">The Math</h2>

<p>The math for this is pretty easy, as shown in the code below:</p>
<p><em>It should be noted that the box model comes into play here. Placing padding, margins or borders on the playing field or the draggable elements will cause them to not stay fully in the playing field. They will overlap the region by the width of the margin/padding/border.</em></p>

<textarea name="code" class="JScript">
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
</textarea>

<p>Now that we have the vars for top, bottom, left and right, we can set contraints on a Drag Drop instance with <code>setXConstraint</code> and <code>setYConstraint</code></p>

<h2 id="demo-source">Full Javascript Source</h2>

<textarea name="code" class="JScript">
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
        dd2 = new YAHOO.example.DDRegion('dd-demo-2', '', { cont: 'dd-demo-canvas2' });
        dd3 = new YAHOO.example.DDRegion('dd-demo-3', '', { cont: 'dd-demo-canvas1' });
    });

})();
</textarea>
