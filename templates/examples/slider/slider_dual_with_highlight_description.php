<h2 class="first">Adding a range highlight to a dual thumb Slider</h2>
<p>DualSlider does not come prebuilt with support for a range highlight.  This example demonstrates how to add this functionality to a DualSlider.</p>
<p>You supply your own markup for the slider. Keep in mind the following points about markup for <a href="http://developer.yahoo.com/yui/slider/#dual">YUI Dual Thumb Slider Control</a> implementations:</p>
<ul>
<li>The thumb elements should be children of the slider background.</li>
<li>We use <code>&lt;img&gt;</code> elements rather than a CSS background for the thumbs to get around a performance bottleneck when animating thumb positions in IE.</li>
<li>Don't apply a CSS border to the slider background.</li>
<li>The background element should have an explicit CSS position: <code>relative</code> or <code>absolute</code>.</li>
<li>Both thumb elements should have an explicit CSS position: <code>absolute</code> and be initially placed at the zero position of the background.  Set their initial position in the constructor if desired.</li>
</ul>

<h2>CSS:</h2>
<p>The example will use the css sprites technique to change the color of the highlight based on assigned classes.</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#demo_bg {
    position: relative;
    background: url(../slider/assets/dual_thumb_bg.gif) 0 5px no-repeat;
    height: 28px;
    width: 310px;
}

#demo_bg div {
    position: absolute;
    cursor: default;
    top: 4px;
}

/* Here's the highlight element */
#demo_bg span {
    position: absolute;
    background: url(../slider/assets/dual_thumb_highlight.gif) 0 0 repeat-x;
    top: 10px;
    left: 12px;
    height: 13px;
    width: 288px;
}

#demo_bg .caution {
    background-position: 0 -13px;
}
#demo_bg .boom,
#demo_bg .danger {
    background-position: 0 -26px;
}

/* We'll use the same class names for the status report region */
p .ok {
    color: #3a3;
    font-weight: bold;
    text-transform: uppercase;
}
p .caution {
    background: #ff3;
    color: #770;
    font-weight: bold;
    font-style: italic;
    padding: 0 1ex;
    text-transform: uppercase;
}
p .danger {
    color: #f33;
    font-weight: bold;
    text-decoration: blink;
    text-transform: uppercase;
}
p .boom {
    color: #fff;
    background: #000;
    padding: 0 1ex;
}
</textarea>

<h2>Markup:</h2>
<p>Here we add an additional <code>span</code> element to use as our highlight.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo_bg" title="Range slider">
    <span id="demo_highlight"></span>
    <div id="demo_min_thumb"><img src="<?php echo("{$assetsDirectory}l-thumb-round.gif") ?>"></div>
    <div id="demo_max_thumb"><img src="<?php echo("{$assetsDirectory}r-thumb-round.gif") ?>"></div>
</div>
<p>Thumb values: <span id="demo_range"></span></p>
<p>Status: <span id="demo_value"></span></p>
</textarea>

<h2>Code:</h2>
<textarea name="code" class="JScript" cols="60" rows="1">
(function () {
    YAHOO.namespace('example');

    var Dom = YAHOO.util.Dom;

    // Slider has a range of 300 pixels
    var range = 300;

    // Set up 12 pixel ticks
    var tickSize = 12;

    // Some arbitrary ranges to cue status changes
    var caution_range = 150,
        danger_range  = 75,
        boom_range    = 13;

    YAHOO.util.Event.onDOMReady(function () {
        var reportSpan     = Dom.get("demo_range");
        var calculatedSpan = Dom.get("demo_value");

        // Create the DualSlider
        var slider = YAHOO.widget.Slider.getHorizDualSlider("demo_bg",
            "demo_min_thumb", "demo_max_thumb",
            range, tickSize);
        
        // Decorate the DualSlider instance with some new properties and
        // methods to maintain the highlight element
        YAHOO.lang.augmentObject(slider, {

            // The current status
            _status : 'ok',

            // The highlight element
            _highlight : Dom.get("demo_highlight"),

            // A simple getter method for the status
            getStatus : function () { return this._status; },

            // A method to update the status and update the highlight
            updateHighlight : function () {
                var delta = this.maxVal - this.minVal,
                    newStatus = 'ok';
                
                if (delta < boom_range) {
                    newStatus = 'boom';
                } else if (delta < danger_range) {
                    newStatus = 'danger';
                } else if (delta < caution_range) {
                    newStatus = 'caution';
                }

                if (this._status !== newStatus) {
                    // Update the highlight class if status is changed
                    Dom.replaceClass(this._highlight,this._status,newStatus);
                    this._status = newStatus;
                }
                if (this.activeSlider === this.minSlider) {
                    // If the min thumb moved, move the highlight's left edge
                    Dom.setStyle(this._highlight,'left', (this.minVal + 12) + 'px');
                }
                // Adjust the width of the highlight to match inner boundary
                Dom.setStyle(this._highlight,'width', Math.max(delta - 12,0) + 'px');
            }
        },true);

        // Attach the highlight method to the slider's change event
        slider.subscribe('change',slider.updateHighlight,slider,true);

        // Create an event callback to update some display fields
        var report = function () {
            reportSpan.innerHTML = slider.minVal + ' - ' + slider.maxVal;
            // Call our conversion function
            calculatedSpan.innerHTML =
            calculatedSpan.className = slider.getStatus();
        };

        // Subscribe to the slider's change event to report the status.
        slider.subscribe('change',report);

        // Attach the slider to the YAHOO.example namespace for public probing
        YAHOO.example.slider = slider;
    });
})();
</textarea>
