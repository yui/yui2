/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
*/

/**
 * @class Anim subclass for scrolling elements to a position defined by the "scroll" member of "attributes".  All "scroll" members are arrays with x, y scroll positions.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Scroll(el, { scroll: { to: [0, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @constructor
 * @param {String or HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
YAHOO.util.Scroll = function(el, attributes, duration,  method) {
   if (el) {
      YAHOO.util.Anim.call(this, el, attributes, duration, method);
   }
};

YAHOO.util.Scroll.prototype = new YAHOO.util.Anim();

/**
 * Per attribute units that should be used by default.
 * Scroll positions default to no units.
 * @type Object
 */
YAHOO.util.Scroll.prototype.defaultUnits.scroll = ' ';

/**
 * Returns the value computed by the animation's "method".
 * @param {String} attribute The name of the attribute.
 * @param {Number} start The value this attribute should start from for this animation.
 * @param {Number} end  The value this attribute should end at for this animation.
 * @return {Number} The Value to be applied to the attribute.
 */
YAHOO.util.Scroll.prototype.doMethod = function(attribute, start, end) {
   var val = null;

   if (attribute == 'scroll') {
      val = [
         this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
         this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
      ];
      
   } else {
      val = this.method(this.currentFrame, start, end - start, this.totalFrames);
   }
   return val;
}

/**
 * Returns current value of the attribute.
 * @param {String} attribute The name of the attribute.
 * @return {Number} val The current value of the attribute.
 */
YAHOO.util.Scroll.prototype.getAttribute = function(attribute) {
   var val = null;
   var el = this.getEl();
   
   if (attribute == 'scroll') {
      val = [ el.scrollLeft, el.scrollTop ];
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
YAHOO.util.Scroll.prototype.setAttribute = function(attribute, val, unit) {
   var el = this.getEl();
   
   if (attribute == 'scroll') {
      el.scrollLeft = val[0];
      el.scrollTop = val[1];
   } else {
      YAHOO.util.Dom.setStyle(el, attribute, val + unit); 
   }
};



