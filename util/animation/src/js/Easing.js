/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
*/

/**
 * @class Class for defining the acceleration rate and path of animations.
 */
YAHOO.util.Easing = new function() {

   /**
    * Uniform speed between points.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.easeNone = function(t, b, c, d) {
	return b+c*(t/=d); 
   };
   
   /**
    * Begins slowly and accelerates towards end.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.easeIn = function(t, b, c, d) {
   	return b+c*((t/=d)*t*t);
   };
   
   /**
    * Begins quickly and decelerates towards end.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.easeOut = function(t, b, c, d) {
   	var ts=(t/=d)*t;
   	var tc=ts*t;
   	return b+c*(tc + -3*ts + 3*t);
   };
   
   /**
    * Begins slowly and decelerates towards end.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.easeBoth = function(t, b, c, d) {
   	var ts=(t/=d)*t;
   	var tc=ts*t;
   	return b+c*(-2*tc + 3*ts);
   };
   
   /**
    * Begins by going below staring value.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.backIn = function(t, b, c, d) {
   	var ts=(t/=d)*t;
   	var tc=ts*t;
   	return b+c*(-3.4005*tc*ts + 10.2*ts*ts + -6.2*tc + 0.4*ts);
   };
   
   /**
    * End by going beyond ending value.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.backOut = function(t, b, c, d) {
   	var ts=(t/=d)*t;
   	var tc=ts*t;
   	return b+c*(8.292*tc*ts + -21.88*ts*ts + 22.08*tc + -12.69*ts + 5.1975*t);
   };
   
   /**
    * Starts by going below staring value, and ends by going beyond ending value.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   this.backBoth = function(t, b, c, d) {
   	var ts=(t/=d)*t;
   	var tc=ts*t;
   	return b+c*(0.402*tc*ts + -2.1525*ts*ts + -3.2*tc + 8*ts + -2.05*t);
   };
};
