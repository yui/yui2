<h2 class="first">Building a Bottom-Up Vertical Slider</h2>

<p>You supply your own markup for the slider. Keep in mind the following points about markup for <a href="http://developer.yahoo.com/yui/slider/">YUI Slider Control</a> implementations:</p>
<ul>
<li>The thumb element should be a child of the slider background</li>
<li>The tabindex attribute lets this element receive focus in most browsers.</li>
<li>If the slider background can receive focus, the arrow keys can be used to change
  this slider's value.</li>
<li>We use an <code>&lt;img&gt;</code> element rather than a CSS background for the thumb to get around
  a performance bottleneck when animating the thumb's position in IE.</li>
<li>Both elements should have an explicit CSS position: <code>relative</code> or <code>absolute</code>.</li>
<li>Don't apply a CSS border to the slider background</li>
</ul>

<p>CSS:</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#slide_bg {
    position: relative;
    background: url(<?= "${assetsDirectory}bg-v.gif" ?>) 12px 0 no-repeat;
    height: 228px;
    width: 48px; 
}

#slide_thumb {
    cursor: default;
    position: absolute;
    top: 200px;  /* To initialize the slide thumb at the bottom */
}
</textarea>

<p>Markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">

    <div id="slide_bg" tabindex="-1">
        <div id="slide_thumb"><img src="<?= "${assetsDirectory}thumb-bar.gif" ?>"></div>
    </div>

    <p>Pixel offset from start: <span id="d_offset"></span></p>
    <p>Calculated Value: <span id="d_val"></span></p>
</div>
</textarea>

<h2>Invert the <code>getValue</code> offset</h2>
<p>Offset values returned by the <code>getValue()</code> methods, or passed as a parameter to the <code>change</code> event callback, increase as the slider moves left-to-right and top-to-bottom.  Making the value increase in the opposite direction is as simple as multiplying by -1.</p>

<p>Look for the magic in this code:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady(function () {

    // the slider can move up 200 pixels
    var upLimit   = 200;

    // and down 0 pixels
    var downLimit = 0;

    // Create the Slider instance
    var slider = YAHOO.widget.Slider.getVertSlider(
                'slide_bg', 'slide_thumb', upLimit, downLimit);

    // Add a little functionality to the instance
    YAHOO.lang.augmentObject(slider, {

        // A custom value range for the slider
        minValue : 10,
        maxValue : 110,

        // A method to retrieve the calculated value, per the value range
        getCalculatedValue : function () {

            // HERE'S THE MAGIC
            // invert the offset value so "real" values increase as the
            // slider moves up
            var offset = -1 * this.getValue();

            // Convert the offset to a value in our configured range
            var conversionFactor =
                    (this.maxValue - this.minValue) /
                    (this.thumb.topConstraint + this.thumb.bottomConstraint);

            return Math.round(offset * conversionFactor) + this.minValue;
        }
    });


    // display the native offset and the calculated while sliding
    var offset_span = YAHOO.util.Dom.get('d_offset');
    var calc_span   = YAHOO.util.Dom.get('d_val');

    slider.subscribe('change', function (offsetFromStart) {
        offset_span.innerHTML = offsetFromStart;
        calc_span.innerHTML   = this.getCalculatedValue();
    });
});
</textarea>

<p>For horizontal Sliders, multiplying the offset by -1 makes values increase right-to-left.</p>
