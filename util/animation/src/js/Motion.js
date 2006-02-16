// Copyright (c) 2006 Yahoo! Inc. All rights reserved.
/**
 * @class Anim subclass for moving elements along a path defined by the "points" member of "attributes".  All "points" are arrays with x, y coordinates.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Motion(el, { points: { to: [800, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
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
YAHOO.util.Motion = function(el, attributes, duration, method) {
   if (el) {
      this.initMotion(el, attributes, duration, method);
   }
};

YAHOO.util.Motion.prototype = new YAHOO.util.Anim();

/**
 * Per attribute units that should be used by default.
 * Motion points default to 'px' units.
 * @type Object
 */
YAHOO.util.Motion.prototype.defaultUnits.points = 'px';

/**
 * Returns the value computed by the animation's "method".
 * @param {String} attribute The name of the attribute.
 * @param {Number} start The value this attribute should start from for this animation.
 * @param {Number} end  The value this attribute should end at for this animation.
 * @return {Number} The Value to be applied to the attribute.
 */
YAHOO.util.Motion.prototype.doMethod = function(attribute, start, end) {
   var val = null;
   
   if (attribute == 'points') {
      var translatedPoints = this.getTranslatedPoints();
      var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;				
   
      if (translatedPoints) {
         val = YAHOO.util.Bezier.getPosition(translatedPoints, t);
      }
      
   } else {
      val = this.method(this.currentFrame, start, end - start, this.totalFrames);
   }
   
   return val;
};

/**
 * Returns current value of the attribute.
 * @param {String} attribute The name of the attribute.
 * @return {Number} val The current value of the attribute.
 */
YAHOO.util.Motion.prototype.getAttribute = function(attribute) {
   var val = null;
   
   if (attribute == 'points') {
      val = [ this.getAttribute('left'), this.getAttribute('top') ];
      if ( isNaN(val[0]) ) { val[0] = 0; }
      if ( isNaN(val[1]) ) { val[1] = 0; }
   } else {
      val = parseFloat( YAHOO.util.Dom.getStyle(this.getEl(), attribute) );
   }
   
   return val;
};

/**
 * Applies a value to an attribute
 * @param {String} attribute The name of the attribute.
 * @param {Number} val The value to be applied to the attribute.
 * @param {String} unit The unit ('px', '%', etc.) of the value.
 */
YAHOO.util.Motion.prototype.setAttribute = function(attribute, val, unit) {
   if (attribute == 'points') {
      YAHOO.util.Dom.setStyle(this.getEl(), 'left', val[0] + unit);
      YAHOO.util.Dom.setStyle(this.getEl(), 'top', val[1] + unit);
   } else {
      YAHOO.util.Dom.setStyle(this.getEl(), attribute, val + unit); 
   }
};

/**
 * @param {HTMLElement | String} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */ 
YAHOO.util.Motion.prototype.initMotion = function(el, attributes, duration, method) {
   YAHOO.util.Anim.call(this, el, attributes, duration, method);
   
   attributes = attributes || {};
   attributes.points = attributes.points || {};
   attributes.points.control = attributes.points.control || [];
   
   this.attributes = attributes;
   
   var start;
   var end = null;
   var translatedPoints = null;
   
   this.getTranslatedPoints = function() { return translatedPoints; };
   
   var translateValues = function(val, self) {
      var pageXY = YAHOO.util.Dom.getXY(self.getEl());
      val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];
   
      return val; 
   };
   
   var onStart = function() {
      start = this.getAttribute('points');
      var attributes = this.attributes;
      var control =  attributes['points']['control'] || [];

      if (control.length > 0 && control[0].constructor != Array) { // could be single point or array of points
         control = [control];
      }
      
      if (YAHOO.util.Dom.getStyle(this.getEl(), 'position') == 'static') { // default to relative
         YAHOO.util.Dom.setStyle(this.getEl(), 'position', 'relative');
      }

      if (typeof attributes['points']['from'] != 'undefined') {
         YAHOO.util.Dom.setXY(this.getEl(), attributes['points']['from']); // set to from point
         start = this.getAttribute('points'); // get actual offset values
      } 
      else if ((start[0] === 0 || start[1] === 0)) { // these sometimes up when auto
         YAHOO.util.Dom.setXY(this.getEl(), YAHOO.util.Dom.getXY(this.getEl())); // set it to current position, giving offsets
         start = this.getAttribute('points'); // get actual offset values
      }

      var i, len;
      // TO beats BY, per SMIL 2.1 spec
      if (typeof attributes['points']['to'] != 'undefined') {
         end = translateValues(attributes['points']['to'], this);
         
         for (i = 0, len = control.length; i < len; ++i) {
            control[i] = translateValues(control[i], this);
         }
         
      } else if (typeof attributes['points']['by'] != 'undefined') {
         end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1]];
         
         for (i = 0, len = control.length; i < len; ++i) {
            control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
         }
      }

      if (end) {
         translatedPoints = [start];
         
         if (control.length > 0) { translatedPoints = translatedPoints.concat(control); }
         
         translatedPoints[translatedPoints.length] = end;
      }
   };
   
   this._onStart.subscribe(onStart);
};

