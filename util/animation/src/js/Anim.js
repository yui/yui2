/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
* /

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

YAHOO.util.Anim = function(el, attributes, duration, method) 
{
   if (el) {
      this.init(el, attributes, duration, method); 
   }
};

YAHOO.util.Anim.prototype = {
   /**
    * Returns the value computed by the animation's "method".
    * @param {String} attribute The name of the attribute.
    * @param {Number} start The value this attribute should start from for this animation.
    * @param {Number} end  The value this attribute should end at for this animation.
    * @return {Number} The Value to be applied to the attribute.
    * @member
    */
   doMethod: function(attribute, start, end) {
      return this.method(this.currentFrame, start, end - start, this.totalFrames);
   },
   
   /**
    * Applies a value to an attribute
    * @param {String} attribute The name of the attribute.
    * @param {Number} val The value to be applied to the attribute.
    * @param {String} unit The unit ('px', '%', etc.) of the value.
    * @member
    */
   setAttribute: function(attribute, val, unit) {
      YAHOO.util.Dom.setStyle(this.getEl(), attribute, val + unit); 
   },                  
   
   /**
    * Returns current value of the attribute.
    * @param {String} attribute The name of the attribute.
    * @return {Number} val The current value of the attribute.
    * @member
    */
   getAttribute: function(attribute) {
      return parseFloat( YAHOO.util.Dom.getStyle(this.getEl(), attribute));
   },
   
   /**
    * The default unit to use for all attributes if not defined per attribute.
    * @type String
    * @member
    */
   defaultUnit: 'px',
   
   /**
    * Per attribute units that should be used by default.
    * @type Object
    * @member
    */
   defaultUnits: {},

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
       * A Date object that is created when the animation ends.
       * @private
       * @type Date
       */
      var endTime = null;
      
      /**
       * The number of frames this animation was able to execute.
       * @private
       * @type Int
       */
      var actualFrames = 0;
      
      /**
       * The attribute values that will be used if no "from" is supplied.
       * @private
       * @type Object
       */
      var defaultValues = {};      

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
       * @member
       */
      this.duration = duration || 1;
      
      /**
       * The method that will provide values to the attribute(s) during the animation. 
       * Defaults to "YAHOO.util.Easing.easeNone".
       * @type Function
       * @member
       */
      this.method = method || YAHOO.util.Easing.easeNone;

      /**
       * Whether or not the duration should be treated as seconds.
       * Defaults to true.
       * @type Boolean
       * @member
       */
      this.useSeconds = true; // default to seconds
      
      /**
       * The location of the current animation on the timeline.
       * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
       * @type Int
       * @member
       */
      this.currentFrame = 0;
      
      /**
       * The total number of frames to be executed.
       * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
       * @type Int
       * @member
       */
      this.totalFrames = YAHOO.util.AnimMgr.fps;
      
      
      /**
       * Returns a reference to the animated element.
       * @return {HTMLElement}
       * @member
       */
      this.getEl = function() { return el; };
      
      
      /**
       * Sets the default value to be used when "from" is not supplied.
       * @param {String} attribute The attribute being set.
       * @param {Number} val The default value to be applied to the attribute.
       * @member
       */
      this.setDefault = function(attribute, val) {
         if ( val.constructor != Array && (val == 'auto' || isNaN(val)) ) { // if 'auto' or NaN, set defaults for well known attributes, zero for others
            switch(attribute) {
               case'width':
                  val = el.clientWidth || el.offsetWidth; // computed width
                  break;
               case 'height':
                  val = el.clientHeight || el.offsetHeight; // computed height
                  break;
               case 'left':
                  if (YAHOO.util.Dom.getStyle(el, 'position') == 'absolute') {
                     val = el.offsetLeft; // computed left
                  } else {
                     val = 0;
                  }
                  break;
               case 'top':
                  if (YAHOO.util.Dom.getStyle(el, 'position') == 'absolute') {
                     val = el.offsetTop; // computed top
                  } else {
                     val = 0;
                  }
                  break;                     
               default:
                  val = 0;
            }
         }

         defaultValues[attribute] = val;
      }
      
      /**
       * Returns the default value for the given attribute.
       * @param {String} attribute The attribute whose value will be returned.
       * @member
       */      
      this.getDefault = function(attribute) {
         return defaultValues[attribute];
      };
      
      /**
       * Checks whether the element is currently animated.
       * @return {Boolean} current value of isAnimated.
       * @member       
       */
      this.isAnimated = function() {
         return isAnimated;
      };
      
      /**
       * Returns the animation start time.
       * @return {Date} current value of startTime.
       * @member       
       */
      this.getStartTime = function() {
         return startTime;
      };      
      
      /**
       * Starts the animation by registering it with the animation manager.
       * @member       
       */
      this.animate = function() {
         if ( this.isAnimated() ) { return false; }
         
         this.onStart.fire();
         this._onStart.fire();
         
         this.totalFrames = ( this.useSeconds ) ? Math.ceil(YAHOO.util.AnimMgr.fps * this.duration) : this.duration;
         YAHOO.util.AnimMgr.registerElement(this);
         
         // get starting values or use defaults
         var attributes = this.attributes;
         var el = this.getEl();
         var val;
         
         for (var attribute in attributes) {
            val = this.getAttribute(attribute);
            this.setDefault(attribute, val);
         }
         
         isAnimated = true;
         actualFrames = 0;
         startTime = new Date();   
      };
        
      /**
       * Stops the animation.  Normally called by AnimMgr when animation completes.
       * @member YAHOO.util.Anim    
       */ 
      this.stop = function() {
         if ( !this.isAnimated() ) { return false; } 
         
         this.currentFrame = 0;
         
         endTime = new Date();
         
         var data = {
            time: endTime,
            duration: endTime - startTime,
            frames: actualFrames,
            fps: actualFrames / this.duration
         };

         isAnimated = false;  
         actualFrames = 0;
         
         this.onComplete.fire(data);
      };
      
      /**
       * Feeds the starting and ending values for each animated attribute to doMethod once per frame, then applies the resulting value to the attribute(s).
       * @private
       */
      var onTween = function() {
         var start;
         var end = null;
         var val;
         var unit;
         var attributes = this['attributes'];
         
         for (var attribute in attributes) {
            unit = attributes[attribute]['unit'] || this.defaultUnits[attribute] || this.defaultUnit;
   
            if (typeof attributes[attribute]['from'] != 'undefined') {
               start = attributes[attribute]['from'];
            } else {
               start = this.getDefault(attribute);
            }
   

            // To beats by, per SMIL 2.1 spec
            if (typeof attributes[attribute]['to'] != 'undefined') {
               end = attributes[attribute]['to'];
            } 
            else if (typeof attributes[attribute]['by'] != 'undefined') 
            {
               if (typeof start !== 'string') {
                  end = [];
                  for (var i = 0, len = start.length; i < len; ++i)
                  {
                     end[i] = start[i] + attributes[attribute]['by'][i];
                  }
               }
               else
               {
                  end = start + attributes[attribute]['by'];
               }
            }
   
            // if end is null, dont change value
            if (end !== null && typeof end != 'undefined') {
   
               val = this.doMethod(attribute, start, end);
               
               // negative not allowed for these (others too, but these are most common)
               if ( (attribute == 'width' || attribute == 'height' || attribute == 'opacity') && val < 0 ) {
                  val = 0;
               }
               
               this.setAttribute(attribute, val, unit); 
            }
         }
         
         actualFrames += 1;
      };
      
      /**
       * Custom event that fires after onStart, useful in subclassing
       * @private
       */   
      this._onStart = new YAHOO.util.CustomEvent('_onStart', this);
      
      /**
       * Custom event that fires when animation begins
       * Listen via subscribe method (e.g. myAnim.onStart.subscribe(someFunction)
       * @member
       */   
      this.onStart = new YAHOO.util.CustomEvent('start', this);
      
      /**
       * Custom event that fires between each frame
       * Listen via subscribe method (e.g. myAnim.onTween.subscribe(someFunction)
       * @member
       */
      this.onTween = new YAHOO.util.CustomEvent('tween', this);
      
      /**
       * Custom event that fires after onTween
       * @private
       */
      this._onTween = new YAHOO.util.CustomEvent('_tween', this);
      
      /**
       * Custom event that fires when animation ends
       * Listen via subscribe method (e.g. myAnim.onComplete.subscribe(someFunction)
       * @member
       */
      this.onComplete = new YAHOO.util.CustomEvent('complete', this);

      this._onTween.subscribe(onTween);
   }
};

