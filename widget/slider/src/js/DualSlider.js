/**
 * A slider with two thumbs, one that represents defines the min value and 
 * the other the max.  Actually a composition of two sliders, both with
 * the same background.  The constraints for each slider are adjusted
 * dynamically so that the min value of the max slider is equal or greater
 * to the current value of the min slider, and the max value of the min
 * slider is the current value of the max slider.
 * @class DualSlider
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param {String}      id       The id of the element linked to this instance
 * @param {String}      sGroup   The group of related DragDrop items
 * @param {SliderThumb} minThumb The min value thumb
 * @param {SliderThumb} maxThumb The max value thumb
 * @param {String}      sType    The type of slider (horiz, vert)
 */
YAHOO.widget.DualSlider = function(minSlider, maxSlider, initMinVal, initMaxVal) {

    var self = this,
        lang = YAHOO.lang;

    /**
     * A slider instance that keeps track of the lower value of the range.
     * @property minSlider
     * @type Slider
     */
    this.minSlider = minSlider;

    /**
     * A slider instance that keeps track of the upper value of the range.
     * @property maxSlider
     * @type Slider
     */
    this.maxSlider = maxSlider;

    /**
     * The currently active slider (min or max).
     * @property activeSlider
     * @type Slider
     */
    this.activeSlider = minSlider;

    initMinVal = lang.isNumber(initMinVal) ? initMinVal : 0;
    initMaxVal = lang.isNumber(initMaxVal) ? initMaxVal : Number.MAX_VALUE;
    this.minSlider.setValue(initMinVal,true, true, true);
    this.maxSlider.setValue(initMaxVal,true, true, true);

    // dispatch mousedowns to the active slider
    minSlider.onMouseDown = function(e) {
        self._handleMouseDown(e);
    };

    // we can safely ignore a mousedown on one of the sliders since
    // they share a background
    maxSlider.onMouseDown = function(e) { 
        YAHOO.util.Event.stopEvent(e); 
    };

    // Fix the drag behavior so that only the active slider
    // follows the drag
    minSlider.onDrag =
    maxSlider.onDrag = function(e) {
        self._handleDrag(e);
    };

    // The core events for each slider are handled so we can expose a single
    // event for when the event happens on either slider
    minSlider.subscribe("change", this._handleMinChange, minSlider, this);
    minSlider.subscribe("slideStart", this._handleSlideStart, minSlider, this);
    minSlider.subscribe("slideEnd", this._handleSlideEnd, minSlider, this);

    maxSlider.subscribe("change", this._handleMaxChange, maxSlider, this);
    maxSlider.subscribe("slideStart", this._handleSlideStart, maxSlider, this);
    maxSlider.subscribe("slideEnd", this._handleSlideEnd, maxSlider, this);

    // store the current min and max values
    this.minVal = minSlider.getValue();
    this.maxVal = maxSlider.getValue();
    
    this.isHoriz = minSlider.thumb._isHoriz;

    /**
     * Event that fires when either the min or max value changes
     * @event change
     * @param {DualSlider} dualslider the DualSlider instance
     */
    this.createEvent("change", this);

    /**
     * Event that fires when one of the sliders begin to move
     * @event slideStart
     * @param {Slider} the moving slider
     */
    this.createEvent("slideStart", this);

    /**
     * Event that fires when one of the sliders finishes moving
     * @event slideEnd
     * @param {Slider} the moving slider
     */
    this.createEvent("slideEnd", this);
};

YAHOO.widget.DualSlider.prototype = {

    /**
     * Executed when one of the sliders fires the slideStart event
     * @method _handleSlideStart
     * @private
     */
    _handleSlideStart: function(data, slider) {
        this.fireEvent("slideStart", slider);
    },

    /**
     * Executed when one of the sliders fires the slideEnd event
     * @method _handleSlideEnd
     * @private
     */
    _handleSlideEnd: function(data, slider) {
        this.fireEvent("slideEnd", slider);
    },

    /**
     * Overrides the onDrag method for both sliders
     * @method _handleDrag
     * @private
     */
    _handleDrag: function(e) {
        YAHOO.widget.Slider.prototype.onDrag.call(this.activeSlider, e);
    },

    /**
     * Executed when the min slider fires the change event
     * @method _handleMinChange
     * @private
     */
    _handleMinChange: function() {
        this.activeSlider = this.minSlider;
        this.updateValue();
    },

    /**
     * Executed when the max slider fires the change event
     * @method _handleMaxChange
     * @private
     */
    _handleMaxChange: function() {
        this.activeSlider = this.maxSlider;
        this.updateValue();
    },

    /**
     * Executed when one of the sliders is moved
     * @method updateValue
     */
    updateValue: function(newOffset, slider) {
        var min = this.minSlider.getValue();
        var max = this.maxSlider.getValue();
        if (min != this.minVal || max != this.maxVal) {
            this.fireEvent("change", this);

            var mint = this.minSlider.thumb;
            var maxt = this.maxSlider.thumb;

            if (this.isHoriz) {
                mint.setXConstraint(mint.initLeft, max, mint.tickSize);
                maxt.setXConstraint((-1*min), maxt.initRight, maxt.tickSize);
            } else {
                mint.setYConstraint(mint.initUp, max, mint.tickSize);
                maxt.setYConstraint((-1*min), maxt.initDown, maxt.tickSize);
            }

            // it is possible that the slider is already out of position when
            // the constraint is applied.  If so, we adjust to the new constraint.
            // A side effect of this is that if both sliders are changed at the same
            // time to a value that will not be legal, and animation is on, 
            // the resulting position will be somewhat random since the constraint
            // violation may be detected in the middle of the animation.
            if (min > max) {
                this.minSlider.setValue(max);
            }

            if (max < min) {
                this.maxSlider.setValue(min);
            }

        }

        this.minVal = min;
        this.maxVal = max;

    },

    /**
     * By default, a background click will move the slider on the side of the
     * background that was clicked.  This is very implementation specific.
     * @method selectActiveSlider
     * @param e {Event} the mousedown event
     */
    selectActiveSlider: function(e) {
        var min = this.minSlider.getValue(),
            max = this.maxSlider.getValue(),
            d;

        if (this.isHoriz) {
            d = YAHOO.util.Event.getPageX(e) - this.minSlider.initPageX -
                this.minSlider.thumbCenterPoint.x;
        } else {
            d = YAHOO.util.Event.getPageY(e) - this.minSlider.initPageY -
                this.minSlider.thumbCenterPoint.y;
        }
                
        // Below the minSlider thumb.  Move the minSlider thumb
        if (d < min) {
            this.activeSlider = this.minSlider;
        // Above the maxSlider thumb.  Move the maxSlider thumb
        } else if (d > max) {
            this.activeSlider = this.maxSlider;
        // Split the difference between thumbs
        } else {
            this.activeSlider = d*2 > max+min ? this.maxSlider : this.minSlider;
        }
    },

    /**
     * Overrides the onMouseDown for both slider, only moving the active slider
     * @method handleMouseDown
     * @private
     */
    _handleMouseDown: function(e) {
        this.selectActiveSlider(e);
        YAHOO.widget.Slider.prototype.onMouseDown.call(this.activeSlider, e);
    }

};

YAHOO.augment(YAHOO.widget.DualSlider, YAHOO.util.EventProvider);


/**
 * Factory method for creating a horizontal slider
 * @method YAHOO.widget.Slider.getHorizSlider
 * @static
 * @param {String} bg the id of the slider's background element
 * @param {String} minthumb the id of the min thumb
 * @param {String} maxthumb the id of the thumb thumb
 * @param {int} iLeft the number of pixels the element can move left
 * @param {int} iRight the number of pixels the element can move right
 * @param {int} iTickSize optional parameter for specifying that the element 
 * should move a certain number pixels at a time.
 * @return {Slider} a horizontal slider control
 */
YAHOO.widget.Slider.getHorizDualSlider = 
    function (bg, minthumb, maxthumb, iLeft, iRight, iTickSize) {
        var mint, maxt;
        var YW = YAHOO.widget, Slider = YW.Slider, Thumb = YW.SliderThumb;

        mint = new Thumb(minthumb, bg, iLeft, iRight, 0, 0, iTickSize);
        maxt = new Thumb(maxthumb, bg, iLeft, iRight, 0, 0, iTickSize);

        // for backwards compatibility.  Not needed for 0.12.1 and up
        mint.initLeft  = maxt.initLeft  = iLeft;
        mint.initRight = maxt.initRight = iRight;
        mint.initUp    = mint.initDown  = maxt.initUp = maxt.initDown = 0;

        return new YW.DualSlider(new Slider(bg, bg, mint, "horiz"), new Slider(bg, bg, maxt, "horiz"));
};

/**
 * Factory method for creating a vertical slider
 * @method YAHOO.widget.Slider.getVertDualSlider
 * @static
 * @param {String} bg the id of the slider's background element
 * @param {String} minthumb the id of the min thumb
 * @param {String} maxthumb the id of the thumb thumb
 * @param {int} iUp the number of pixels the element can move up
 * @param {int} iDown the number of pixels the element can move down
 * @param {int} iTickSize optional parameter for specifying that the element 
 * should move a certain number pixels at a time.
 * @return {Slider} a vertical slider control
 */
YAHOO.widget.Slider.getVertDualSlider = 
    function (bg, minthumb, maxthumb, iUp, iDown, iTickSize) {
        var mint, maxt;
        var YW = YAHOO.widget, Slider = YW.Slider, Thumb = YW.SliderThumb;

        mint = new Thumb(minthumb, bg, 0, 0, iUp,iDown, iTickSize);
        maxt = new Thumb(maxthumb, bg, 0, 0, iUp, iDown, iTickSize);

        // for backwards compatibility.  Not needed for 0.12.1 and up
        mint.initLeft  = maxt.initLeft  = mint.initRight = maxt.initRight = 0;
        mint.initUp    = maxt.initUp    = iUp;
        mint.initDown  = maxt.initDown  = iDown;

        return new YW.DualSlider(new Slider(bg, bg, mint, "vert"), new Slider(bg, bg, maxt, "vert"));
};
