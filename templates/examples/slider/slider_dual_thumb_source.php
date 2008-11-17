<div id="demo_bg" class="yui-h-slider" title="Range slider">
    <div id="demo_min_thumb" class="yui-slider-thumb"><img src="<?php echo("{$assetsDirectory}left-thumb.png") ?>"></div>
    <div id="demo_max_thumb" class="yui-slider-thumb"><img src="<?php echo("{$assetsDirectory}right-thumb.png") ?>"></div>
</div>

<p>Raw values: 
<label>Min: <input type="text" id="demo_from" size="3" maxlength="3" value=""></label>

<label>Max: <input type="text" id="demo_to" size="3" maxlength="3" value=""></label>

<button id="demo_btn">Update Slider</button>

<h3>Converted values:</h3>
<p id="demo_info"></p>

<script type="text/javascript">
(function () {
    YAHOO.namespace('example');

    var Dom = YAHOO.util.Dom;

    // Slider has a range of 200 pixels
    var range = 200;

    // No ticks for this example
    var tickSize = 0;

    // We'll set a minimum distance the thumbs can be from one another
    var minThumbDistance = 10;

    // Initial values for the thumbs
    var initValues = [100,130];

    // Conversion factor from 0-200 pixels to 100-1000
    // Note 20 pixels are subtracted from the range to account for the
    // thumb values calculated from their center point (10 pixels from
    // the center of the left thumb + 10 pixels from the center of the
    // right thumb)
    var cf = 900/(range - 20);

    // Set up a function to convert the min and max values into something useful
    var convert = function (val) {
        return Math.round(val * cf + 100);
    };

    // Slider set up is done when the DOM is ready
    YAHOO.util.Event.onDOMReady(function () {
        var demo_bg = Dom.get("demo_bg"),
            info    = Dom.get("demo_info"),
            from    = Dom.get("demo_from"),
            to      = Dom.get("demo_to");

        // Create the DualSlider
        var slider = YAHOO.widget.Slider.getHorizDualSlider(demo_bg,
            "demo_min_thumb", "demo_max_thumb",
            range, tickSize, initValues);

        slider.minRange = minThumbDistance;
        
        // Custom function to update the text fields, the converted value
        // report and the slider's title attribute
        var updateUI = function () {
            from.value = slider.minVal;
            to.value   = slider.maxVal;

            // Update the converted values and the slider's title.
            // Account for the thumb width offsetting the value range by
            // subtracting the thumb width from the max value.
            var min = convert(slider.minVal),
                max = convert(slider.maxVal - 20);

            info.innerHTML = "MIN: <strong>" + min + "</strong><br>" +
                             "MAX: <strong>" + max + "</strong>";
            demo_bg.title  = "Current range " + min + " - " + max;
        };

        // Subscribe to the dual thumb slider's change and ready events to
        // report the state.
        slider.subscribe('ready', updateUI);
        slider.subscribe('change', updateUI);

        // Wire up the button to update the slider
        YAHOO.util.Event.on('demo_btn','click',function () {
            // Get the int values from the inputs
            var min = Math.abs(parseInt(from.value,10)|0),
                max = Math.abs(parseInt(to.value,10)|0);

            if (min > max) {
                var hold = min;
                min = max;
                max = hold;
            }

            // Verify the values are in range
            min = Math.min(min,range - 30);
            max = Math.max(Math.min(max,range),min + 20 + minThumbDistance);

            // Set the new values on the slider
            slider.setValues(min,max);
        });
        // Attach the slider to the YAHOO.example namespace for public probing
        YAHOO.example.slider = slider;
    });
})();
</script>
