/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright © 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

YAHOO.util.Easing = {

   /**
    * Uniform speed between points.
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeNone: function (t, b, c, d) {
   	return c*t/d + b;
   },
   
   /**
    * Begins slowly and accelerates towards end. (quadratic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeIn: function (t, b, c, d) {
   	return c*(t/=d)*t + b;
   },

   /**
    * Begins quickly and decelerates towards end.  (quadratic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeOut: function (t, b, c, d) {
   	return -c *(t/=d)*(t-2) + b;
   },
   
   /**
    * Begins slowly and decelerates towards end. (quadratic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeBoth: function (t, b, c, d) {
   	if ((t/=d/2) < 1) return c/2*t*t + b;
   	return -c/2 * ((--t)*(t-2) - 1) + b;
   },
   
   /**
    * Begins slowly and accelerates towards end. (quartic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeInStrong: function (t, b, c, d) {
   	return c*(t/=d)*t*t*t + b;
   },
   
   /**
    * Begins quickly and decelerates towards end.  (quartic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeOutStrong: function (t, b, c, d) {
   	return -c * ((t=t/d-1)*t*t*t - 1) + b;
   },
   
   /**
    * Begins slowly and decelerates towards end. (quartic)
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   easeBothStrong: function (t, b, c, d) {
   	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
   	return -c/2 * ((t-=2)*t*t*t - 2) + b;
   },

   /**
    * snap in elastic effect
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number} p Period (optional)
    * @return {Number} The computed value for the current animation frame.
    */

   elasticIn: function (t, b, c, d, a, p) {
   	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
   	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
   	else var s = p/(2*Math.PI) * Math.asin (c/a);
   	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
   },

   /**
    * snap out elastic effect
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number} p Period (optional)
    * @return {Number} The computed value for the current animation frame.
    */
   elasticOut: function (t, b, c, d, a, p) {
   	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
   	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
   	else var s = p/(2*Math.PI) * Math.asin (c/a);
   	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
   },
   
   /**
    * snap both elastic effect
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number} p Period (optional)
    * @return {Number} The computed value for the current animation frame.
    */
   elasticBoth: function (t, b, c, d, a, p) {
   	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
   	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
   	else var s = p/(2*Math.PI) * Math.asin (c/a);
   	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
   	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
   },


   /**
    * back easing in - backtracking slightly, then reversing direction and moving to target
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number) s Overshoot (optional)
    * @return {Number} The computed value for the current animation frame.
    */
   backIn: function (t, b, c, d, s) {
   	if (typeof s == undefined) s = 1.70158;
   	return c*(t/=d)*t*((s+1)*t - s) + b;
   },

   /**
    * back easing out - moving towards target, overshooting it slightly,
    * then reversing and coming back to target
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number) s Overshoot (optional)
    * @return {Number} The computed value for the current animation frame.
    */
   backOut: function (t, b, c, d, s) {
   	if (typeof s == undefined) s = 1.70158;
   	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
   },
   
   /**
    * back easing in/out - backtracking slightly, then reversing direction and moving to target,
    * then overshooting target, reversing, and finally coming back to target
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @param {Number) s Overshoot (optional)
    * @return {Number} The computed value for the current animation frame.
    */
   backBoth: function (t, b, c, d, s) {
   	if (typeof s == undefined) s = 1.70158; 
   	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
   	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
   },

   /**
    * bounce in
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   bounceIn: function (t, b, c, d) {
   	return c - YAHOO.util.Easing.bounceOut(d-t, 0, c, d) + b;
   },
   
   /**
    * bounce out
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   bounceOut: function (t, b, c, d) {
   	if ((t/=d) < (1/2.75)) {
   		return c*(7.5625*t*t) + b;
   	} else if (t < (2/2.75)) {
   		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
   	} else if (t < (2.5/2.75)) {
   		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
   	} else {
   		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
   	}
   },
   
   /**
    * bounce both
    * @param {Number} t Time value used to compute current value.
    * @param {Number} b Starting value.
    * @param {Number} c Delta between start and end values.
    * @param {Number} d Total length of animation.
    * @return {Number} The computed value for the current animation frame.
    */
   bounceBoth: function (t, b, c, d) {
   	if (t < d/2) return YAHOO.util.Easing.bounceIn(t*2, 0, c, d) * .5 + b;
   	return YAHOO.util.Easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
   }
};

