/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
*/

/**
 * @class Provides helper methods for DOM elements.
 */
YAHOO.util.Dom = new function() {

   /**
    * Returns an HTMLElement reference
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @return {HTMLElement} A DOM reference to an HTML element.
    */
   this.get = function(el) {
      if (typeof el == 'string') { // accept object or id
         el = document.getElementById(el);
      }
      
      return el;
   };

   /**
    * Normalizes currentStyle and ComputedStyle.
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {String} property The style property whose value is returned.
    * @return {String} The current value of the style property.
    */
   this.getStyle = function(el, property) {
      var value = null;
      var dv = document.defaultView;
   
      el = this.get(el);
      
      if (property == 'opacity' && el.filters) {// IE opacity
         value = 1;
         try {
            value = el.filters.item('DXImageTransform.Microsoft.Alpha').opacity / 100;
         } catch(e) {
            try {
               value = el.filters.item('alpha').opacity / 100;
            } catch(e) {}
         }
      }
      else if (el.style[property]) {
         value = el.style[property];    
      }
      else if (el.currentStyle && el.currentStyle[property]) {
         value = el.currentStyle[property];
      }
      else if ( dv && dv.getComputedStyle )
      {  // convert camelCase to hyphen-case
         
         var converted = '';
         for(i = 0, len = property.length;i < len; ++i) {
            if (property.charAt(i) == property.charAt(i).toUpperCase()) {
               converted = converted + '-' + property.charAt(i).toLowerCase();
            } else {
               converted = converted + property.charAt(i);
            }
         }
         
         if (dv.getComputedStyle(el, '').getPropertyValue(converted)) {
            value = dv.getComputedStyle(el, '').getPropertyValue(converted);
         }
      }

      return value;
   };

   /**
    * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {String} property The style property to be set.
    * @param {String} val The value to apply to the given property.
    */
   this.setStyle = function(el, property, val) {
      el = this.get(el);
      switch(property) {
         case 'opacity' :
            if (el.filters) {
               el.style.filter = 'alpha(opacity=' + val * 100 + ')';
               
               if (!el.currentStyle.hasLayout) {
                  el.style.zoom = 1;
               }
            } else {
               el.style.opacity = val;
               el.style['-moz-opacity'] = val;
               el.style['-khtml-opacity'] = val;
            }
            break;
         default :
            el.style[property] = val;
      }
   };
   
   /**
    * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getXY = function(el) {
      el = this.get(el);

      // has to be part of document to have pageXY
      if (el.parentNode === null || this.getStyle(el, 'display') == 'none') {
         return false;
      }
      
      /**
       * Position of the html element (x, y)
       * @private
       * @type Array
       */
      var parent = null;
      var pos = [];
      var box;
      
      if (el.getBoundingClientRect) { // IE
         box = el.getBoundingClientRect();
         var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
         var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
         
         return [box.left + scrollLeft, box.top + scrollTop];
      }
      else if (document.getBoxObjectFor) { // gecko
         box = document.getBoxObjectFor(el);
         pos = [box.x, box.y];
      }
      else { // safari/opera
         pos = [el.offsetLeft, el.offsetTop];
         parent = el.offsetParent;
         if (parent != el) {
            while (parent) {
               pos[0] += parent.offsetLeft;
               pos[1] += parent.offsetTop;
               parent = parent.offsetParent;
            }
         }
         
         // opera (& safari absolute) incorrectly account for body offsetTop
         var ua = navigator.userAgent.toLowerCase();
         if (
            ua.indexOf('opera') != -1 
            || ( ua.indexOf('safari') != -1 && this.getStyle(el, 'position') == 'absolute' ) 
         ) {
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;
         } 
      }
      
      if (el.parentNode) { parent = el.parentNode; }
      else { parent = null; }

      while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
         pos[0] -= parent.scrollLeft;
         pos[1] -= parent.scrollTop;

         if (parent.parentNode) { parent = parent.parentNode; } 
         else { parent = null; }
      }

      return pos;
   };
   
   /**
    * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getX = function(el) {
      return this.getXY(el)[0];
   };
   
   /**
    * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    */
   this.getY = function(el) {
      return this.getXY(el)[1];
   };
   
   /**
    * Set the position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {array} pos Contains X & Y values for new position (coordinates are page-based)
    */
   this.setXY = function(el, pos, noRetry) {
      el = this.get(el);
      var pageXY = YAHOO.util.Dom.getXY(el);
      if (pageXY === false) { return false; } // has to be part of doc to have pageXY

      if (this.getStyle(el, 'position') == 'static') { // default to relative
         this.setStyle(el, 'position', 'relative');
      }
      
      var delta = [
         parseInt( YAHOO.util.Dom.getStyle(el, 'left'), 10 ),
         parseInt( YAHOO.util.Dom.getStyle(el, 'top'), 10 )
      ];
   
      if ( isNaN(delta[0]) ) { delta[0] = 0; } // defalts to 'auto'
      if ( isNaN(delta[1]) ) { delta[1] = 0; }

      if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
      if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }

      var newXY = this.getXY(el);

      // if retry is true, try one more time if we miss
      if (!noRetry && (newXY[0] != pos[0] || newXY[1] != pos[1]) ) {
         this.setXY(el, pos, true);
      }
      
      return true;
   };
   
   /**
    * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {Int} x to use as the X coordinate.
    */
   this.setX = function(el, x) {
      return this.setXY(el, [x, null]);
   };
   
   /**
    * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
    * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @param {Int} Value to use as the Y coordinate.
    */
   this.setY = function(el, y) {
      return this.setXY(el, [null, y]);
   };
   
   /**
    * Returns the region position of the given element.
    * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
    * @param {String or HTMLElement} Accepts either a string to use as an ID for getting a DOM reference, or an actual DOM reference.
    * @return {Region} A Region instance containing "top, left, bottom, right" member data.
    */
   this.getRegion = function(el) {
      el = this.get(el);
      return new YAHOO.util.Region.getRegion(el);
   };
   
   /**
    * Returns the width of the client (viewport).
    * @return {Int} The width of the viewable area of the page.
    */
   this.getClientWidth = function() {
      return (
         document.documentElement.offsetWidth
         || document.body.offsetWidth
      );
   };
   
   /**
    * Returns the height of the client (viewport).
    * @return {Int} The height of the viewable area of the page.
    */
   this.getClientHeight = function() {
      return (
         self.innerHeight 
         || document.documentElement.clientHeight
         || document.body.clientHeight
      );
   };
   
   this.getElementsByClassName = function(className, tag, root) {
      root = root || document;
		tag = tag || '*';
      var nodes = [];
      var elements = root.getElementsByTagName(tag);
      var re = new RegExp('\\b' + className + '\\b');

		for ( var i = 0, len = elements.length; i < len; ++i) {
         if ( re.test(elements[i]['className']) ) {
            nodes[nodes.length] = elements[i];
         }
      }
      
      return nodes;
   }; 

   this.hasClass = function(el, className) {
      el = this.get(el);
      var re = new RegExp('\\b' + className + '\\b');
      return re.test(el['className']);
   };

   this.addClass = function(el, className) {
      if (this.hasClass(el, className)) { return false; } // already present
      
      el = this.get(el);
      el['className'] = [el['className'],className].join(' ');
      
      return true;
   };

   this.removeClass = function(el, className) {
      if (!this.hasClass(el, className)) { return false; } // not present
      
      el = this.get(el);
      var re = new RegExp('\\b' + className + '\\b');
      var c = el['className'];
      
      el['className'] = c.replace( re, '');
      
      return true;
   };
};
