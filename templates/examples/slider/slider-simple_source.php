<!-- 
    You supply your own markup for the slider:
    - The thumb element should be a child of the slider background
    - The tabindex attribute lets this element receive focus in most browsers.
    - If the slider background can receive focus, the arrow keys can be used to change
      this slider's value.
    - We use an img element rather than a css background for the thumb to get around
      a performance bottleneck when animating the thumb in IE
    - Both elements should have a position style: relative or absolute
    - Don't apply a css border to the slider background
-->

<div id="slider-bg" class="yui-v-slider" tabindex="-1" title="Slider">
    <div id="slider-thumb" class="yui-slider-thumb"><img src="<?php echo $assetsDirectory; ?>thumb-bar.gif"></div>
</div>

<p>Pixel value: <span id="slider-value">0</span></p>

<p>Converted value:
<input autocomplete="off" id="slider-converted-value" type="text" value="0" size="4" maxlength="4" />
</p>

<!--We'll use these to trigger interactions with the Slider API -->
<button id="putval">Change slider value to 100 (converted value 150)</button>
<button id="getval">Write current value to the Logger</button> 

<script type="text/javascript">
(function() {
    var Event = YAHOO.util.Event,
        Dom   = YAHOO.util.Dom,
        lang  = YAHOO.lang,
        slider, 
        bg="slider-bg", thumb="slider-thumb", 
        valuearea="slider-value", textfield="slider-converted-value"

    // The slider can move 0 pixels up
    var topConstraint = 0;

    // The slider can move 200 pixels down
    var bottomConstraint = 200;

    // Custom scale factor for converting the pixel offset into a real value
    var scaleFactor = 1.5;

    // The amount the slider moves when the value is changed with the arrow
    // keys
    var keyIncrement = 20;

    Event.onDOMReady(function() {

        slider = YAHOO.widget.Slider.getVertSlider(bg, 
                         thumb, topConstraint, bottomConstraint);

        slider.getRealValue = function() {
            return Math.round(this.getValue() * scaleFactor);
        }

        slider.subscribe("change", function(offsetFromStart) {

            var valnode = Dom.get(valuearea);
            var fld = Dom.get(textfield);

            // Display the pixel value of the control
            valnode.innerHTML = offsetFromStart;

            // use the scale factor to convert the pixel offset into a real
            // value
            var actualValue = slider.getRealValue();

            // update the text box with the actual value
            fld.value = actualValue;

            // Update the title attribute on the background.  This helps assistive
            // technology to communicate the state change
            Dom.get(bg).title = "slider value = " + actualValue;

        });

        slider.subscribe("slideStart", function() {
                YAHOO.log("slideStart fired", "warn");
            });

        slider.subscribe("slideEnd", function() {
                YAHOO.log("slideEnd fired", "warn");
            });

        // set an initial value
        slider.setValue(20);

        // Listen for keystrokes on the form field that displays the
        // control's value.  While not provided by default, having a
        // form field with the slider is a good way to help keep your
        // application accessible.
        Event.on(textfield, "keydown", function(e) {

            // set the value when the 'return' key is detected
            if (Event.getCharCode(e) === 13) {
                var v = parseFloat(this.value, 10);
                v = (lang.isNumber(v)) ? v : 0;

                // convert the real value into a pixel offset
                slider.setValue(Math.round(v/scaleFactor));
            }
        });
        
        // Use setValue to reset the value to white:
        Event.on("putval", "click", function(e) {
            slider.setValue(100, false); //false here means to animate if possible
        });
        
        // Use the "get" method to get the current offset from the slider's start
        // position in pixels.  By applying the scale factor, we can translate this
        // into a "real value
        Event.on("getval", "click", function(e) {
            YAHOO.log("Current value: "   + slider.getValue() + "\n" + 
                      "Converted value: " + slider.getRealValue(), "info", "example"); 
        });
    });
})();
</script>
