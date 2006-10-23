/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 *
 * Base class for animated DOM objects.
 * @class Base animation class that provides the interface for building animated effects.
 * <p>Usage: var myAnim = new YAHOO.util.Anim(el, { width: { from: 10, to: 100 } }, 1, YAHOO.util.Easing.easeOut);</p>
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
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

YAHOO.util.Anim = function(el, attributes, duration, method) {
   if (el) {
      this.init(el, attributes, duration, method); 
   }
};

YAHOO.util.Anim.prototype = {
   /**
    * toString method
    * @return {String} string represenation of anim obj
    */
   toString: function() {
      var el = this.getEl();
      var id = el.id || el.tagName;
      return ("Anim " + id);
   },
   
   patterns: { // cached for performance
      noNegatives:      /width|height|opacity|padding/i, // keep at zero or above
      offsetAttribute:  /^((width|height)|(top|left))$/, // use offsetValue as default
      defaultUnit:      /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
      offsetUnit:       /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
   },
   
   /**
    * Returns the value computed by the animation's "method".
    * @param {String} attr The name of the attribute.
    * @param {Number} start The value this attribute should start from for this animation.
    * @param {Number} end  The value this attribute should end at for this animation.
    * @return {Number} The Value to be applied to the attribute.
    */
   doMethod: function(attr, start, end) {
      return this.method(this.currentFrame, start, end - start, this.totalFrames);
   },
   
   /**
    * Applies a value to an attribute
    * @param {String} attr The name of the attribute.
    * @param {Number} val The value to be applied to the attribute.
    * @param {String} unit The unit ('px', '%', etc.) of the value.
    */
   setAttribute: function(attr, val, unit) {
      if ( this.patterns.noNegatives.test(attr) ) {
         val = (val > 0) ? val : 0;
      }

      YAHOO.util.Dom.setStyle(this.getEl(), attr, val + unit);
   },                  
   
   /**
    * Returns current value of the attribute.
    * @param {String} attr The name of the attribute.
    * @return {Number} val The current value of the attribute.
    */
   getAttribute: function(attr) {
      var el = this.getEl();
      var val = YAHOO.util.Dom.getStyle(el, attr);

      if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
         return parseFloat(val);
      }
      
      var a = this.patterns.offsetAttribute.exec(attr) || [];
      var pos = !!( a[3] ); // top or left
      var box = !!( a[2] ); // width or height
      
      // use offsets for width/height and abs pos top/left
      if ( box || (YAHOO.util.Dom.getStyle(el, 'position') == 'absolute' && pos) ) {
         val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
      } else { // default to zero for other 'auto'
         val = 0;
      }

      return val;
   },
   
   /**
    * Returns the unit to use when none is supplied.
    * Applies the "defaultUnit" test to decide whether to use pixels or not
    * @param {attr} attr The name of the attribute.
    * @return {String} The default unit to be used.
    */
   getDefaultUnit: function(attr) {
       if ( this.patterns.defaultUnit.test(attr) ) {
         return 'px';
       }
       
       return '';
   },
      
   /**
    * Sets the actual values to be used during the animation.
    * Should only be needed for subclass use.
    * @param {Object} attr The attribute object
    * @private 
    */
   setRuntimeAttribute: function(attr) {
      var start;
      var end;
      var attributes = this.attributes;

      this.runtimeAttributes[attr] = {};
      
      var isset = function(prop) {
         return (typeof prop !== 'undefined');
      };
      
      if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
         return false; // note return; nothing to animate to
      }
      
      start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

      // To beats by, per SMIL 2.1 spec
      if ( isset(attributes[attr]['to']) ) {
         end = attributes[attr]['to'];
      } else if ( isset(attributes[attr]['by']) ) {
         if (start.constructor == Array) {
            end = [];
            for (var i = 0, len = start.length; i < len; ++i) {
               end[i] = start[i] + attributes[attr]['by'][i];
            }
         } else {
            end = start + attributes[attr]['by'];
         }
      }
      
      this.runtimeAttributes[attr].start = start;
      this.runtimeAttributes[attr].end = end;

      // set units if needed
      this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
   },

   /**
    * @param {String or HTMLElement} el Reference to the element that will be animated
    * @param {Object} attributes The attribute(s) to be animated.  
    * Each attribute is an object with at minimum a "to" or "by" member defined.  
    * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
    * All attribute names use camelCase.
    * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
    * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
    */ 
   init: function(el, attributes, duration, method) {
      /**
       * Whether or not the animation is running.
       * @private
       * @type Boolean
       */
      var isAnimated = false;
      
      /**
       * A Date object that is created when the animation begins.
       * @private
       * @type Date
       */
      var startTime = null;
      
      /**
       * The number of frames this animation was able to execute.
       * @private
       * @type Int
       */
      var actualFrames = 0; 

      /**
       * The element to be animated.
       * @private
       * @type HTMLElement
       */
      el = YAHOO.util.Dom.get(el);
      
      /**
       * The collection of attributes to be animated.  
       * Each attribute must have at least a "to" or "by" defined in order to animate.  
       * If "to" is supplied, the animation will end with the attribute at that value.  
       * If "by" is supplied, the animation will end at that value plus its starting value. 
       * If both are supplied, "to" is used, and "by" is ignored. 
       * @member YAHOO#util#Anim
       * Optional additional member include "from" (the value the attribute should start animating from, defaults to current value), and "unit" (the units to apply to the values).
       * @type Object
       */
      this.attributes = attributes || {};
      
      /**
       * The length of the animation.  Defaults to "1" (second).
       * @type Number
       */
      this.duration = duration || 1;
      
      /**
       * The method that will provide values to the attribute(s) during the animation. 
       * Defaults to "YAHOO.util.Easing.easeNone".
       * @type Function
       */
      this.method = method || YAHOO.util.Easing.easeNone;

      /**
       * Whether or not the duration should be treated as seconds.
       * Defaults to true.
       * @type Boolean
       */
      this.useSeconds = true; // default to seconds
      
      /**
       * The location of the current animation on the timeline.
       * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
       * @type Int
       */
      this.currentFrame = 0;
      
      /**
       * The total number of frames to be executed.
       * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
       * @type Int
       */
      this.totalFrames = YAHOO.util.AnimMgr.fps;
      
      
      /**
       * Returns a reference to the animated element.
       * @return {HTMLElement}
       */
      this.getEl = function() { return el; };
      
      /**
       * Checks whether the element is currently animated.
       * @return {Boolean} current value of isAnimated.    
       */
      this.isAnimated = function() {
         return isAnimated;
      };
      
      /**
       * Returns the animation start time.
       * @return {Date} current value of startTime.     
       */
      this.getStartTime = function() {
         return startTime;
      };      
      
      this.runtimeAttributes = {};
      
      var logger = {};
      logger.log = function() {YAHOO.log.apply(window, arguments)};
      
      logger.log('creating new instance of ' + this);
      
      /**
       * Starts the animation by registering it with the animation manager.   
       */
      this.animate = function() {
         if ( this.isAnimated() ) { return false; }
         
         this.currentFrame = 0;
         
         this.totalFrames = ( this.useSeconds ) ? Math.ceil(YAHOO.util.AnimMgr.fps * this.duration) : this.duration;
   
         YAHOO.util.AnimMgr.registerElement(this);
      };
        
      /**
       * Stops the animation.  Normally called by AnimMgr when animation completes.
       */ 
      this.stop = function() {
         YAHOO.util.AnimMgr.stop(this);
      };
      
      var onStart = function() {         
         this.onStart.fire();
         
         this.runtimeAttributes = {};
         for (var attr in this.attributes) {
            this.setRuntimeAttribute(attr);
         }
         
         isAnimated = true;
         actualFrames = 0;
         startTime = new Date(); 
      };
      
      /**
       * Feeds the starting and ending values for each animated attribute to doMethod once per frame, then applies the resulting value to the attribute(s).
       * @private
       */
       
      var onTween = function() {
         var data = {
            duration: new Date() - this.getStartTime(),
            currentFrame: this.currentFrame
         };
         
         data.toString = function() {
            return (
               'duration: ' + data.duration +
               ', currentFrame: ' + data.currentFrame
            );
         };
         
         this.onTween.fire(data);
         
         var runtimeAttributes = this.runtimeAttributes;
         
         for (var attr in runtimeAttributes) {
            this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
         }
         
         actualFrames += 1;
      };
      
      var onComplete = function() {
         var actual_duration = (new Date() - startTime) / 1000 ;
         
         var data = {
            duration: actual_duration,
            frames: actualFrames,
            fps: actualFrames / actual_duration
         };
         
         data.toString = function() {
            return (
               'duration: ' + data.duration +
               ', frames: ' + data.frames +
               ', fps: ' + data.fps
            );
         };
         
         isAnimated = false;
         actualFrames = 0;
         this.onComplete.fire(data);
      };
      
      /**
       * Custom event that fires after onStart, useful in subclassing
       * @private
       */   
      this._onStart = new YAHOO.util.CustomEvent('_start', this, true);

      /**
       * Custom event that fires when animation begins
       * Listen via subscribe method (e.g. myAnim.onStart.subscribe(someFunction)
       */   
      this.onStart = new YAHOO.util.CustomEvent('start', this);
      
      /**
       * Custom event that fires between each frame
       * Listen via subscribe method (e.g. myAnim.onTween.subscribe(someFunction)
       */
      this.onTween = new YAHOO.util.CustomEvent('tween', this);
      
      /**
       * Custom event that fires after onTween
       * @private
       */
      this._onTween = new YAHOO.util.CustomEvent('_tween', this, true);
      
      /**
       * Custom event that fires when animation ends
       * Listen via subscribe method (e.g. myAnim.onComplete.subscribe(someFunction)
       */
      this.onComplete = new YAHOO.util.CustomEvent('complete', this);
      /**
       * Custom event that fires after onComplete
       * @private
       */
      this._onComplete = new YAHOO.util.CustomEvent('_complete', this, true);

      this._onStart.subscribe(onStart);
      this._onTween.subscribe(onTween);
      this._onComplete.subscribe(onComplete);
   }
};

