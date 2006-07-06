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
(function() {
   YAHOO.util.Scroll = function(el, attributes, duration,  method) {
      if (el) { // dont break existing subclasses not using YAHOO.extend
         YAHOO.util.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
      }
   };

   YAHOO.extend(YAHOO.util.Scroll, YAHOO.util.ColorAnim);
   
   // shorthand
   var Y = YAHOO.util;
   var superclass = Y.Scroll.superclass;
   var prototype = Y.Scroll.prototype;

   /**
    * toString method
    * @return {String} string represenation of anim obj
    */
   prototype.toString = function() {
      var el = this.getEl();
      var id = el.id || el.tagName;
      return ("Scroll " + id);
   };
   
   /**
    * Returns the value computed by the animation's "method".
    * @param {String} attr The name of the attribute.
    * @param {Number} start The value this attribute should start from for this animation.
    * @param {Number} end  The value this attribute should end at for this animation.
    * @return {Number} The Value to be applied to the attribute.
    */
   prototype.doMethod = function(attr, start, end) {
      var val = null;
   
      if (attr == 'scroll') {
         val = [
            this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
            this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
         ];
         
      } else {
         val = superclass.doMethod.call(this, attr, start, end);
      }
      return val;
   };
   
   /**
    * Returns current value of the attribute.
    * @param {String} attr The name of the attribute.
    * @return {Number} val The current value of the attribute.
    */
   prototype.getAttribute = function(attr) {
      var val = null;
      var el = this.getEl();
      
      if (attr == 'scroll') {
         val = [ el.scrollLeft, el.scrollTop ];
      } else {
         val = superclass.getAttribute.call(this, attr);
      }
      
      return val;
   };
   
   /**
    * Applies a value to an attribute
    * @param {String} attr The name of the attribute.
    * @param {Number} val The value to be applied to the attribute.
    * @param {String} unit The unit ('px', '%', etc.) of the value.
    */
   prototype.setAttribute = function(attr, val, unit) {
      var el = this.getEl();
      
      if (attr == 'scroll') {
         el.scrollLeft = val[0];
         el.scrollTop = val[1];
      } else {
         superclass.setAttribute.call(this, attr, val, unit);
      }
   };
})();
