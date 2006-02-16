// Copyright (c) 2006 Yahoo! Inc. All rights reserved.
/**
 *
 * @class Used to calculate Bezier splines for any number of control points.
 *
 */
YAHOO.util.Bezier = new function() 
{
   /**
    * Get the current position of the animated element based on t.
    * @param {array} points An array containing Bezier points.
    * Each point is an array of "x" and "y" values (0 = x, 1 = y)
    * At least 2 points are required (start and end).
    * First point is start. Last point is end.
    * Additional control points are optional.    
    * @param {float} t Basis for determining current position (0 < t < 1)
    * @return {object} An object containing int x and y member data
    */
   this.getPosition = function(points, t)
   {  
      var n = points.length;
      var tmp = [];

      for (var i = 0; i < n; ++i){
         tmp[i] = [points[i][0], points[i][1]]; // save input
      }
      
      for (var j = 1; j < n; ++j) {
         for (i = 0; i < n - j; ++i) {
            tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
            tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
         }
      }
   
      return [ tmp[0][0], tmp[0][1] ]; 
   
   };
};
