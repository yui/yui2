/**
 * @class ColorAnim subclass for color fading
 * <p>Usage: <code>var myAnim = new Y.ColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, Y.Easing.easeOut);</code></p>
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
(function() {
   YAHOO.util.ColorAnim = function(el, attributes, duration,  method) {
      YAHOO.util.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
   };
   
   YAHOO.extend(YAHOO.util.ColorAnim, YAHOO.util.Anim);
   
   // shorthand
   var Y = YAHOO.util;
   var superclass = Y.ColorAnim.superclass;
   var proto = Y.ColorAnim.prototype;
   
   /**
    * toString method
    * @return {String} string represenation of anim obj
    */
   proto.toString = function() {
      var el = this.getEl();
      var id = el.id || el.tagName;
      return ("ColorAnim " + id);
   };
   
   /**
    * Only certain attributes should be treated as colors.
    * @type Object
    */
   proto.patterns.color = /color$/i;
   proto.patterns.rgb         = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
   proto.patterns.hex         = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
   proto.patterns.hex3        = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
   proto.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; // need rgba for safari
   
   /**
    * Attempts to parse the given string and return a 3-tuple.
    * @param {String} s The string to parse.
    * @return {Array} The 3-tuple of rgb values.
    */
   proto.parseColor = function(s) {
      if (s.length == 3) { return s; }
   
      var c = this.patterns.hex.exec(s);
      if (c && c.length == 4) {
         return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
      }
   
      c = this.patterns.rgb.exec(s);
      if (c && c.length == 4) {
         return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
      }
   
      c = this.patterns.hex3.exec(s);
      if (c && c.length == 4) {
         return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
      }
      
      return null;
   };
   
   /**
    * Returns current value of the attribute.
    * @param {String} attr The name of the attribute.
    * @return {Number} val The current value of the attribute.
    */
   proto.getAttribute = function(attr) {
      var el = this.getEl();
      if (  this.patterns.color.test(attr) ) {
         var val = YAHOO.util.Dom.getStyle(el, attr);
         
         if (this.patterns.transparent.test(val)) { // bgcolor default
            var parent = el.parentNode; // try and get from an ancestor
            val = Y.Dom.getStyle(parent, attr);
         
            while (parent && this.patterns.transparent.test(val)) {
               parent = parent.parentNode;
               val = Y.Dom.getStyle(parent, attr);
               if (parent.tagName.toUpperCase() == 'HTML') {
                  val = '#fff';
               }
            }
         }
      } else {
         val = superclass.getAttribute.call(this, attr);
      }

      return val;
   };
   
   /**
    * Returns the value computed by the animation's "method".
    * @param {String} attr The name of the attribute.
    * @param {Number} start The value this attribute should start from for this animation.
    * @param {Number} end  The value this attribute should end at for this animation.
    * @return {Number} The Value to be applied to the attribute.
    */
   proto.doMethod = function(attr, start, end) {
      var val;
   
      if ( this.patterns.color.test(attr) ) {
         val = [];
         for (var i = 0, len = start.length; i < len; ++i) {
            val[i] = superclass.doMethod.call(this, attr, start[i], end[i]);
         }
         
         val = 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';
      }
      else {
         val = superclass.doMethod.call(this, attr, start, end);
      }

      return val;
   };
   
   /**
    * Sets the actual values to be used during the animation.
    * Should only be needed for subclass use.
    * @param {Object} attr The attribute object
    * @private 
    */
   proto.setRuntimeAttribute = function(attr) {
      superclass.setRuntimeAttribute.call(this, attr);
      
      if ( this.patterns.color.test(attr) ) {
         var attributes = this.attributes;
         var start = this.parseColor(this.runtimeAttributes[attr].start);
         var end = this.parseColor(this.runtimeAttributes[attr].end);
         // fix colors if going "by"
         if ( typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined' ) {
            end = this.parseColor(attributes[attr].by);
         
            for (var i = 0, len = start.length; i < len; ++i) {
               end[i] = start[i] + end[i];
            }
         }
         
         this.runtimeAttributes[attr].start = start;
         this.runtimeAttributes[attr].end = end;
      }
   };
})();