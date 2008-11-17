<div id="demo">
    <div id="slide_bg" tabindex="-1">
        <div id="slide_thumb"><img src="<?= "${assetsDirectory}thumb-bar.gif" ?>"></div>
    </div>
    <p>Pixel offset from start: <span id="d_offset">0</span></p>
    <p>Calculated Value: <span id="d_val">0</span></p>
</div>
<script type="text/javascript">
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
</script>
