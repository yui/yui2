<div id="demo_bg" title="Range slider">
    <span id="demo_highlight"></span>
    <div id="demo_min_thumb"><img src="<?php echo("{$assetsDirectory}l-thumb-round.gif") ?>"></div>
    <div id="demo_max_thumb"><img src="<?php echo("{$assetsDirectory}r-thumb-round.gif") ?>"></div>
</div>
<p>Range offsets: <span id="demo_range">0 - 300</span></p>
<p>Status: <span id="demo_value" class="ok">ok</span></p>

<script type="text/javascript">
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
            _status : 'ok',
            _highlight : Dom.get("demo_highlight"),

            getStatus : function () { return this._status; },

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
</script>
