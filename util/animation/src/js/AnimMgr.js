/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
*/

/**
 * @class Handles animation queueing and threading.
 * Used by Anim and subclasses.
 */
YAHOO.util.AnimMgr = new function() {
   /** 
    * Reference to the animation Interval
    * @private
    * @type Int
    */
   var thread = null;
   
   /** 
    * The current queue of registered animation objects.
    * @private
    * @type Array
    */   
   var queue = [];

   /** 
    * The number of active animations.
    * @private
    * @type Int
    */      
   var tweenCount = 0;

   /** 
    * Base frame rate (frames per second). 
    * Arbitrarily high for better x-browser calibration (slower browsers drop more frames).
    * @type Int
    * 
    */
   this.fps = 200;

   /** 
    * Interval delay in milliseconds, defaults to fastest possible.
    * @type Int
    * 
    */
   this.delay = 1;

   /**
    * Adds an animation instance to the animation queue.
    * All animation instances must be registered in order to animate.
    * @param {object} tween The Anim instance to be be registered
    */
   this.registerElement = function(tween) {
      if ( tween.isAnimated() ) { return false; }// but not if already animating
      
      queue[queue.length] = tween;
      tweenCount += 1;

      this.start();
   };
   
   /**
    * Starts the animation thread.
	 * Only one thread can run at a time.
    */   
   this.start = function() {
      if (thread === null) { thread = setInterval(this.run, this.delay); }
   };

   /**
    * Stops the animation thread or a specific animation instance.
    * @param {object} tween A specific Anim instance to stop (optional)
    * If no instance given, Manager stops thread and all animations.
    */   
   this.stop = function(tween) {
      if (!tween)
      {
         clearInterval(thread);
         for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i].isAnimated()) {
               queue[i].stop();  
            }
         }
         queue = [];
         thread = null;
         tweenCount = 0;
      }
      else {
         tween.stop();     
         tweenCount -= 1;
         
         if (tweenCount <= 0) { this.stop(); }
      }
   };
   
   /**
    * Called per Interval to handle each animation frame.
    */   
   this.run = function() {
      for (var i = 0, len = queue.length; i < len; ++i) {
         var tween = queue[i];
         if ( !tween || !tween.isAnimated() ) { continue; }

         if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null)
         {
            tween.currentFrame += 1;
            
            if (tween.useSeconds) {
               correctFrame(tween);
            }
            
            var data = {
               duration: new Date() - tween.getStartTime(),
               currentFrame: tween.currentFrame
            };
            
            data.toString = function() {
               return (
                  ', duration: ' + data.duration +
                  ', currentFrame: ' + data.currentFrame
               );
            };
            
            tween.onTween.fire(data);     
            tween._onTween.fire();        
         }
         else { YAHOO.util.AnimMgr.stop(tween); }
      }
   };
   
   /**
    * On the fly frame correction to keep animation on time.
    * @private
    * @param {Object} tween The Anim instance being corrected.
    */
   var correctFrame = function(tween) {
      var frames = tween.totalFrames;
      var frame = tween.currentFrame;
      var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
      var elapsed = (new Date() - tween.getStartTime());
      var tweak = 0;
      
      if (elapsed < tween.duration * 1000) { // check if falling behind
         tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
      } else { // went over duration, so jump to end
         tweak = frames - (frame + 1); 
      }
      if (tweak > 0 && isFinite(tweak)) { // adjust if needed
         if (tween.currentFrame + tweak >= frames) {// dont go past last frame
            tweak = frames - (frame + 1);
         }
         
         tween.currentFrame += tweak;     
      }
   };
};
