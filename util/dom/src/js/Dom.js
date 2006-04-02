/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @class Provides helper methods for DOM elements.
 */
YAHOO.util.Dom = function() {}
YAHOO.util.Dom.prototype = {
      /**
       * Returns an HTMLElement reference
       * @param {String/HTMLElement/Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @return {HTMLElement/Array} A DOM reference to an HTML element or an array of HTMLElements.
       */
      get: function(el) {
         if (typeof el != 'string' && !(el instanceof Array) )
         { // assuming HTMLElement or HTMLCollection, so pass back as is
            return el;
         }
         
         if (typeof el == 'string') 
         { // ID
            return document.getElementById(el);
         }
         else
         { // array of ID's and/or elements
            var collection = [];
            for (var i = 0, len = el.length; i < len; ++i)
            {
               collection[collection.length] = this.get(el[i]);
            }
            
            return collection;
         }

         return null; // safety, should never happen
      },
   
      /**
       * Normalizes currentStyle and ComputedStyle.
       * @param {String/HTMLElement/Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @param {String} property The style property whose value is returned.
       * @return {String/Array} The current value of the style property for the element(s).
       */
      getStyle: function(el, property) {
         var f = function(el, self) {
            var value = null;
            var dv = document.defaultView;
            
            if (property == 'opacity' && el.filters) 
            {// IE opacity
               value = 1;
               try {
                  value = el.filters.item('DXImageTransform.Microsoft.Alpha').opacity / 100;
               } catch(e) {
                  try {
                     value = el.filters.item('alpha').opacity / 100;
                  } catch(e) {}
               }
            }
            else if (el.style[property]) 
            {
               value = el.style[property];
            }
            else if (el.currentStyle && el.currentStyle[property]) {
               value = el.currentStyle[property];
            }
            else if ( dv && dv.getComputedStyle )
            {  // convert camelCase to hyphen-case
               
               var converted = '';
               for(i = 0, len = property.length;i < len; ++i) {
                  if (property.charAt(i) == property.charAt(i).toUpperCase()) 
                  {
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
         
         return this.batch(el, f, this);
      },
   
      /**
       * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @param {String} property The style property to be set.
       * @param {String} val The value to apply to the given property.
       */
      setStyle: function(el, property, val) {
         var f = function(el, self) {
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
         
         this.batch(el, f, this);
      },
      
      /**
       * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
       @ return {Array} The XY position of the element(s)
       */
      getXY: function(el) {
         var f = function(el, self) {
   
         // has to be part of document to have pageXY
            if (el.parentNode === null || self.getStyle(el, 'display') == 'none') {
               return false;
            }
            
            var parent = null;
            var pos = [];
            var box;
            
            if (el.getBoundingClientRect) { // IE
               box = el.getBoundingClientRect();
               Math.max ( document.documentElement.scrollTop  , document.body.scrollTop );
               var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
               var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
               
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
               if (
                  ua.indexOf('opera') != -1 
                  || ( ua.indexOf('safari') != -1 && self.getStyle(el, 'position') == 'absolute' ) 
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
         
         return this.batch(el, f, this);
      },
      
      /**
       * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
       * @return {String/Array} The X position of the element(s)
       */
      getX: function(el) {
         return this.getXY(el)[0];
      },
      
      /**
       * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
       * @return {String/Array} The Y position of the element(s)
       */
      getY: function(el) {
         return this.getXY(el)[1];
      },
      
      /**
       * Set the position of an html element in page coordinates, regardless of how the element is positioned.
       * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
       * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
       * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
       */
      setXY: function(el, pos, noRetry) {
         var f = function(el, self) {
   
            var style_pos = self.getStyle(el, 'position')
            if (style_pos == 'static') { // default to relative
               self.setStyle(el, 'position', 'relative');
               style_pos = 'relative';
            }
            
            var pageXY = YAHOO.util.Dom.getXY(el);
            if (pageXY === false) { return false; } // has to be part of doc to have pageXY
            
            var delta = [
               parseInt( YAHOO.util.Dom.getStyle(el, 'left'), 10 ),
               parseInt( YAHOO.util.Dom.getStyle(el, 'top'), 10 )
            ];
         
            if ( isNaN(delta[0]) ) // defaults to 'auto'
            { 
               delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
            } 
            if ( isNaN(delta[1]) ) // defaults to 'auto'
            { 
               delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
            } 
      
            if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
            if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
      
            var newXY = self.getXY(el);
      
            // if retry is true, try one more time if we miss
            if (!noRetry && (newXY[0] != pos[0] || newXY[1] != pos[1]) ) {
               var retry = function() { YAHOO.util.Dom.setXY(el, pos, true) };
               setTimeout(retry, 0); // "delay" for IE resize timing issue
            }
         };
         
         this.batch(el, f, this);
      },
      
      /**
       * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
       * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @param {Int} x to use as the X coordinate for the element(s).
       */
      setX: function(el, x) {
         this.setXY(el, [x, null]);
      },
      
      /**
       * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
       * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @param {Int} x to use as the Y coordinate for the element(s).
       */
      setY: function(el, y) {
         this.setXY(el, [null, y]);
      },
      
      /**
       * Returns the region position of the given element.
       * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
       * @param {String/HTMLElement/Arra a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
       * @return {Region/Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
       */
      getRegion: function(el) {
         var f = function(el, self) {
            return new YAHOO.util.Region.getRegion(el);
         };
         
         return this.batch(el, f, this);
      },
      
      /**
       * Returns the width of the client (viewport).
       * @return {Int} The width of the viewable area of the page.
       */
      getClientWidth: function() {
         return (
            document.documentElement.offsetWidth
            || document.body.offsetWidth
         );
      },
      
      /**
       * Returns the height of the client (viewport).
       * @return {Int} The height of the viewable area of the page.
       */
      getClientHeight: function() {
         return (
            self.innerHeight 
            || document.documentElement.clientHeight
            || document.body.clientHeight
         );
      },

      /**
       * Returns a array of HTMLElements with the given class
       * For optimized performance, include a tag and/or root node if possible
       * @param {String} className The class name to match against
       * @param {String} tag (optional) The tag name of the elements being collected
       * @param {String/HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
       * @return {Array} An array of elements that have the given class name
       */
      getElementsByClassName: function(className, tag, root) {
         var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
         
         var method = function(el) { return re.test(el['className']); };
         
         return this.getElementsBy(method, tag, root);
      },

      /**
       * Determines whether an HTMLElement has the given className
       * @param {String/HTMLElement/Array} el The element or collection to test
       * @param {String} className the class name to search for
       * @return {Boolean/Array} A boolean value or array of boolean values
       */
      hasClass: function(el, className) {
         var f = function(el, self) {
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(el['className']);
         };
         
         return this.batch(el, f, this);
      },
   
      /**
       * Adds a class name to a given element or collection of elements
       * @param {String/HTMLElement/Array} el The element or collection to add the class to
       * @param {String} className the class name to add to the class attribute
       */
      addClass: function(el, className) {
         var f = function(el, self) {
            if (self.hasClass(el, className)) { return; } // already present
            
            el['className'] = [el['className'], className].join(' ');
         };
         
         this.batch(el, f, this);
      },
   
      /**
       * Removes a class name from a given element or collection of elements
       * @param {String/HTMLElement/Array} el The element or collection to remove the class from
       * @param {String} className the class name to remove from the class attribute
       */
      removeClass: function(el, className) {
         var f = function(el, self) {
            if (!self.hasClass(el, className)) { return; } // not present
            
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
            var c = el['className'];
            
            el['className'] = c.replace( re, ' ');
         };
         
         this.batch(el, f, this);
      },
      
      /**
       * Replace a class with another class for a given element or collection of elements.
       * If no oldClassName is present, the newClassName is simply added.
       * @param {String/HTMLElement/Array} el The element or collection to remove the class from
       * @param {String} oldClassName the class name to be replaced
       * @param {String} newClassName the class name that will be replacing the old class name
       */
      replaceClass: function(el, oldClassName, newClassName) {
         var f = function(el, self) {
            self.removeClass(el, oldClassName);
            self.addClass(el, newClassName);
         };
         
         this.batch(el, f, this);
      },
      
      /**
       * Generates a unique ID
       * @param {String/HTMLElement/Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present)
       * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen")
       * @return {String/Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
       */
      generateId: function(el, prefix) {
         prefix = prefix || 'yui-gen';
         
         var f = function(el, self) {
            el = el || {}; // just generating ID in this case
            
            if (!el.id) { el.id = prefix + id_counter++; } // dont override existing
            
            return el.id;
         }
         
         return this.batch(el, f, this);
      },
      
      /**
       * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy
       * @param {String/HTMLElement} haystack The possible ancestor
       * @param {String/HTMLElement} needle The possible descendent
       * @return {Boolean} Whether or not the haystack is an ancestor of needle
       */
      isAncestor: function(haystack, needle) {
         haystack = this.get(haystack);
         if (!haystack || !needle) { return false; }
         
         var f = function(needle, self) {
            if (haystack.contains && ua.indexOf('safari') < 0) 
            { // safari "contains" is broken
               return haystack.contains(needle);
            }
            else if ( haystack.compareDocumentPosition ) 
            {
               return !!(haystack.compareDocumentPosition(needle) & 16);
            }
            else 
            { // loop up and test each parent
               var parent = needle.parentNode;
               
               while (parent) {
                  if (parent == haystack) {
                     return true;
                  }
                  else if (parent.tagName == 'HTML') {
                     return false;
                  }
                  
                  parent = parent.parentNode;
               }
               
               return false;
            }    
         };
         
         return this.batch(needle, f, this);     
      },
      
      /**
       * Determines whether an HTMLElement is present in the current document
       * @param {String/HTMLElement} el The element to search for
       * @return {Boolean} Whether or not the element is present in the current document
       */
      inDocument: function(el) {
         var f = function(el, self) {
            return self.isAncestor(document.documentElement, el);
         };
         
         return this.batch(el, f, this);
      },
      
      /**
       * Returns a array of HTMLElements that pass the test applied by supplied boolean method
       * For optimized performance, include a tag and/or root node if possible
       * @param {Function} method A boolean method to test elements with
       * @param {String} tag (optional) The tag name of the elements being collected
       * @param {String/HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
       */
      getElementsBy: function(method, tag, root) {
         tag = tag || '*';
         root = this.get(root) || document;
         
         var nodes = [];
         var elements = root.getElementsByTagName(tag);
         
         for (var i = 0, len = elements.length; i < len; ++i) 
         {
            if ( method(elements[i]) ) { nodes[nodes.length] = elements[i]; }
         }

         return nodes;
      },
      
      /**
       * Returns an array of elements that have had the supplied method applied.
       * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) )
       * @param {String/HTMLElement/Array} el (optional) An element or array of elements to apply the method to
       * @param {String} method The method to apply to the element(s)
       * @param {Generic} (optional) o An optional arg that is passed to the supplied method
       * @return {HTMLElement/Array} The element(s) with the method applied
       */
      batch: function(el, method, o) {
         el = this.get(el);
         
         if (!el || !el.length) { return method(el, o); } // is null or not a collection
         
         var collection = [];
         
         for (var i = 0, len = el.length; i < len; ++i)
         {
            collection[collection.length] = method(el[i], o);
         }
         
         return collection;
      }
   }

