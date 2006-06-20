/**
 * @class ColorAnim subclass for color fading
 * <p>Usage: <code>var myAnim = new YAHOO.util.ColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * <p>Color values can be specified with either 112233, #112233, [255,255,255], or rgb(255,255,255)
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @constructor
 * @param {HTMLElement | String} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.
 * Each attribute is an object with at minimum a "to" or "by" member defined.
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
YAHOO.util.ColorAnim = function(el, attributes, duration,  method) {
   if (el) {
      YAHOO.util.Anim.call(this, el, attributes, duration, method);
   }
};

YAHOO.util.ColorAnim.prototype = new YAHOO.util.Anim();

/**
 * toString method
 * @return {String} string represenation of anim obj
 */
YAHOO.util.ColorAnim.prototype.toString = function() {
   var el = this.getEl();
   var id = el.id || el.tagName;
   return ("ColorAnim " + id);
};

/**
 * Only certain attributes should be treated as colors.
 * @type Object
 */
YAHOO.util.ColorAnim.prototype.attributePattern = /color$/i;
YAHOO.util.ColorAnim.prototype.rgbPattern       = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
YAHOO.util.ColorAnim.prototype.hexPattern       = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
YAHOO.util.ColorAnim.prototype.hex3Pattern       = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;

/**
 * Attempts to parse the given string and return a 3-tuple.
 * @param {String} s The string to parse.
 * @return {Array} The 3-tuple of rgb values.
 */
YAHOO.util.ColorAnim.prototype.parseColor = function(s) {YAHOO.log('s = ' + s);
   if (s.length == 3) {
      return s;
   }

   var c = this.hexPattern.exec(s);
   if (c && c.length == 4) {
      return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
   }

   c = this.rgbPattern.exec(s);
   if (c && c.length == 4) {
      return [ parseInt(c[1]), parseInt(c[2]), parseInt(c[3]) ];
   }

   var c = this.hex3Pattern.exec(s);
   if (c && c.length == 4) {
      return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
   }
   
   return null;
};

/**
 * Returns the value computed by the animation's "method".
 * @param {String} attribute The name of the attribute.
 * @param {Number} start The value this attribute should start from for this animation.
 * @param {Number} end  The value this attribute should end at for this animation.
 * @return {Number} The Value to be applied to the attribute.
 */
YAHOO.util.ColorAnim.prototype.doMethod = function(attribute, start, end) {
   var val = null;

   if (this.attributePattern.test(attribute)) {
      var s = this.parseColor(start);
      var e = this.parseColor(end);

      val = [
         this.method(this.currentFrame, s[0], e[0] - s[0], this.totalFrames),
         this.method(this.currentFrame, s[1], e[1] - s[1], this.totalFrames),
         this.method(this.currentFrame, s[2], e[2] - s[2], this.totalFrames)
      ];
   } else {
      val = this.method(this.currentFrame, start, end - start, this.totalFrames);
   }
   return val;
},

YAHOO.util.ColorAnim.prototype.getParentColor = function(attribute) {
   var parent = this.getEl().parentNode; // try and get from an ancestor
   color = YAHOO.util.Dom.getStyle(parent, attribute);

   while (parent && color == 'transparent') {
      parent = parent.parentNode;
      color = YAHOO.util.Dom.getStyle(parent, attribute);
      if (parent.tagName.toUpperCase() == 'HTML') {
         color = 'ffffff';
      }
   }
   return color;
};

/**
 * Returns current value of the attribute.
 * @param {String} attribute The name of the attribute.
 * @return {Number} val The current value of the attribute.
 */
YAHOO.util.ColorAnim.prototype.getAttribute = function(attribute) {
   var val = null;
   var el = this.getEl();

   if (this.attributePattern.test(attribute)) {
      var color = YAHOO.util.Dom.getStyle(el, attribute);
      if (color == 'transparent') { // bgcolor default
         color = this.getParentColor(attribute);
      }
      val = this.parseColor(color);

   } else {
      val = parseFloat( YAHOO.util.Dom.getStyle(el, attribute) );
   }

   return val;
};

/**
 * Applies a value to an attribute
 * @param {String} attribute The name of the attribute.
 * @param {Number} val The value to be applied to the attribute.
 * @param {String} unit The unit ('px', '%', etc.) of the value.
 */
YAHOO.util.ColorAnim.prototype.setAttribute = function(attribute, val, unit) {
   var el = this.getEl();

   if (val && this.attributePattern.test(attribute)) {
      YAHOO.util.Dom.setStyle(el, attribute, 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')');
   } else {
      YAHOO.util.Dom.setStyle(el, attribute, val + unit);
   }
};
