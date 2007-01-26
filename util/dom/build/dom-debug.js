/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 *
 */

(function() {
    var Y = YAHOO.util,     // internal shorthand
        getStyle,           // for load time browser branching
        setStyle,           // ditto
        id_counter = 0,     // for use with generateId
        propertyCache = {}; // for faster hyphen converts
    
    // brower detection
    var ua = navigator.userAgent.toLowerCase(),
        isOpera = (ua.indexOf('opera') > -1),
        isSafari = (ua.indexOf('safari') > -1),
        isGecko = (!isOpera && !isSafari && ua.indexOf('gecko') > -1),
        isIE = (!isOpera && ua.indexOf('msie') > -1); 
    
    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i
    };

    var logger = {};
    logger.log = function() { YAHOO.log.apply(window, arguments); };
    
    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; // no hyphens
        }
        
        if (propertyCache[property]) { // already converted
            return propertyCache[property];
        }
        
        while( patterns.HYPHEN.exec(property) ) {
            property = property.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        
        propertyCache[property] = property;
        return property;
        //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
    };
    
    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        getStyle = function(el, property) {
            var value = null;
            
            var computed = document.defaultView.getComputedStyle(el, '');
            if (computed) { // test computed before touching for safari
                value = computed[toCamel(property)];
            }
            
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE) { // IE method
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity' :// IE opacity uses filter
                    var val = 100;
                    try { // will error if no DXImageTransform
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            val = el.filters('alpha').opacity;
                        } catch(e) {
                            logger.log('getStyle: IE filter failed',
                                    'error', 'Dom');
                        }
                    }
                    return val / 100;
                    break;
                default: 
                    // test currentStyle before touching
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { // default to inline only
        getStyle = function(el, property) { return el.style[property]; };
    }
    
    if (isIE) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( typeof el.style.filter == 'string' ) { // in case not appended
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; // when no layout or cant tell
                        }
                    }
                    break;
                default:
                el.style[property] = val;
            }
        };
    } else {
        setStyle = function(el, property, val) {
            el.style[property] = val;
        };
    }
    
    /**
     * Provides helper methods for DOM elements.
     * @namespace YAHOO.util
     * @class Dom
     */
    YAHOO.util.Dom = {
        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            if (!el) { return null; } // nothing to work with
            
            if (typeof el != 'string' && !(el instanceof Array) ) { // assuming HTMLElement or HTMLCollection, so pass back as is
                logger.log('get(' + el + ') returning ' + el, 'info', 'Dom');
                return el;
            }
            
            if (typeof el == 'string') { // ID
                logger.log('get("' + el + '") returning ' + document.getElementById(el), 'info', 'Dom');
                return document.getElementById(el);
            }
            else { // array of ID's and/or elements
                var collection = [];
                for (var i = 0, len = el.length; i < len; ++i) {
                    collection[collection.length] = Y.Dom.get(el[i]);
                }
                
                logger.log('get("' + el + '") returning ' + collection, 'info', 'Dom');
                return collection;
            }

            logger.log('element ' + el + ' not found', 'error', 'Dom');
            return null; // safety, should never happen
        },
    
        /**
         * Normalizes currentStyle and ComputedStyle.
         * @method getStyle
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property whose value is returned.
         * @return {String | Array} The current value of the style property for the element(s).
         */
        getStyle: function(el, property) {
            property = toCamel(property);
            
            var f = function(element) {
                return getStyle(element, property);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
         * @method setStyle
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property to be set.
         * @param {String} val The value to apply to the given property.
         */
        setStyle: function(el, property, val) {
            property = toCamel(property);
            
            var f = function(element) {
                setStyle(element, property, val);
                logger.log('setStyle setting ' + property + ' to ' + val, 'info', 'Dom');
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Array} The XY position of the element(s)
         */
        getXY: function(el) {
            var f = function(el) {
    
            // has to be part of document to have pageXY
                if (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') {
                    logger.log('getXY failed: element not available', 'error', 'Dom');
                    return false;
                }
                
                var parentNode = null;
                var pos = [];
                var box;
                
                if (el.getBoundingClientRect) { // IE
                    box = el.getBoundingClientRect();
                    var doc = document;
                    if ( !this.inDocument(el) && parent.document != document) {// might be in a frame, need to get its scroll
                        doc = parent.document;

                        if ( !this.isAncestor(doc.documentElement, el) ) {
                            logger.log('getXY failed: element not available', 'error', 'Dom');
                            return false;                      
                        }

                    }

                    var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
                    var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
                    
                    return [box.left + scrollLeft, box.top + scrollTop];
                }
                else { // safari, opera, & gecko
                    pos = [el.offsetLeft, el.offsetTop];
                    parentNode = el.offsetParent;
                    if (parentNode != el) {
                        while (parentNode) {
                            pos[0] += parentNode.offsetLeft;
                            pos[1] += parentNode.offsetTop;
                            parentNode = parentNode.offsetParent;
                        }
                    }
                    if (isSafari && this.getStyle(el, 'position') == 'absolute' ) { // safari doubles in some cases
                        pos[0] -= document.body.offsetLeft;
                        pos[1] -= document.body.offsetTop;
                    } 
                }
                
                if (el.parentNode) { parentNode = el.parentNode; }
                else { parentNode = null; }
        
                while (parentNode && parentNode.tagName.toUpperCase() != 'BODY' && parentNode.tagName.toUpperCase() != 'HTML') 
                { // account for any scrolled ancestors
                    if (Y.Dom.getStyle(parentNode, 'display') != 'inline') { // work around opera inline scrollLeft/Top bug
                        pos[0] -= parentNode.scrollLeft;
                        pos[1] -= parentNode.scrollTop;
                    }
                    
                    if (parentNode.parentNode) {
                        parentNode = parentNode.parentNode; 
                    } else { parentNode = null; }
                }
        
                logger.log('getXY returning ' + pos, 'info', 'Dom');
                
                return pos;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {String | Array} The X position of the element(s)
         */
        getX: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[0];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {String | Array} The Y position of the element(s)
         */
        getY: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[1];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { // default to relative
                    this.setStyle(el, 'position', 'relative');
                    style_pos = 'relative';
                }

                var pageXY = this.getXY(el);
                if (pageXY === false) { // has to be part of doc to have pageXY
                    logger.log('setXY failed: element not available', 'error', 'Dom');
                    return false; 
                }
                
                var delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle(el, 'left'), 10 ),
                    parseInt( this.getStyle(el, 'top'), 10 )
                ];
            
                if ( isNaN(delta[0]) ) {// in case of 'auto'
                    delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                } 
                if ( isNaN(delta[1]) ) { // in case of 'auto'
                    delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
                } 
        
                if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
                if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
              
                if (!noRetry) {
                    var newXY = this.getXY(el);

                    // if retry is true, try one more time if we miss 
                   if ( (pos[0] !== null && newXY[0] != pos[0]) || 
                        (pos[1] !== null && newXY[1] != pos[1]) ) {
                       this.setXY(el, pos, true);
                   }
                }        
        
                logger.log('setXY setting position to ' + pos, 'info', 'Dom');
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x The value to use as the X coordinate for the element(s).
         */
        setX: function(el, x) {
            Y.Dom.setXY(el, [x, null]);
        },
        
        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x To use as the Y coordinate for the element(s).
         */
        setY: function(el, y) {
            Y.Dom.setXY(el, [null, y]);
        },
        
        /**
         * Returns the region position of the given element.
         * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
         * @method getRegion
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
         */
        getRegion: function(el) {
            var f = function(el) {
                var region = new Y.Region.getRegion(el);
                logger.log('getRegion returning ' + region, 'info', 'Dom');
                return region;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns the width of the client (viewport).
         * @method getClientWidth
         * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
         * @return {Int} The width of the viewable area of the page.
         */
        getClientWidth: function() {
            return Y.Dom.getViewportWidth();
        },
        
        /**
         * Returns the height of the client (viewport).
         * @method getClientHeight
         * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
         * @return {Int} The height of the viewable area of the page.
         */
        getClientHeight: function() {
            return Y.Dom.getViewportHeight();
        },

        /**
         * Returns a array of HTMLElements with the given class.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsByClassName
         * @param {String} className The class name to match against
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @return {Array} An array of elements that have the given class name
         */
        getElementsByClassName: function(className, tag, root) {
            var method = function(el) { return Y.Dom.hasClass(el, className); };
            return Y.Dom.getElementsBy(method, tag, root);
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            
            var f = function(el) {
                logger.log('hasClass returning ' + re.test(el['className']), 'info', 'Dom');
                return re.test(el['className']);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) { return; } // already present
                
                logger.log('addClass adding ' + className, 'info', 'Dom');
                
                el['className'] = [el['className'], className].join(' ');
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         */
        removeClass: function(el, className) {
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');

            var f = function(el) {
                if (!this.hasClass(el, className)) { return; } // not present
                
                logger.log('removeClass removing ' + className, 'info', 'Dom');
                
                var c = el['className'];
                el['className'] = c.replace(re, ' ');
                if ( this.hasClass(el, className) ) { // in case of multiple adjacent
                    this.removeClass(el, className);
                }
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = new RegExp('(?:^|\\s+)' + oldClassName + '(?:\\s+|$)', 'g');

            var f = function(el) {
                logger.log('replaceClass replacing ' + oldClassName + ' with ' + newClassName, 'info', 'Dom');
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return; // note return
                }
            
                el['className'] = el['className'].replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.replaceClass(el, oldClassName, newClassName);
                }
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Generates a unique ID
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';
            el = el || {};
            
            var f = function(el) {
                if (el) {
                    el = Y.Dom.get(el);
                } else {
                    el = {}; // just generating ID in this case
                }
                
                if (!el.id) {
                    el.id = prefix + id_counter++; 
                    logger.log('generateId generating ' + el.id, 'info', 'Dom');
                } // dont override existing
                
                logger.log('generateId returning ' + el.id, 'info', 'Dom');
                
                return el.id;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method isAncestor
         * @param {String | HTMLElement} haystack The possible ancestor
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not the haystack is an ancestor of needle
         */
        isAncestor: function(haystack, needle) {
            haystack = Y.Dom.get(haystack);
            if (!haystack || !needle) { return false; }
            
            var f = function(needle) {
                if (haystack.contains && !isSafari) { // safari "contains" is broken
                    logger.log('isAncestor returning ' + haystack.contains(needle), 'info', 'Dom');
                    return haystack.contains(needle);
                }
                else if ( haystack.compareDocumentPosition ) {
                    logger.log('isAncestor returning ' + !!(haystack.compareDocumentPosition(needle) & 16), 'info', 'Dom');
                    return !!(haystack.compareDocumentPosition(needle) & 16);
                }
                else { // loop up and test each parent
                    var parent = needle.parentNode;
                    
                    while (parent) {
                        if (parent == haystack) {
                            logger.log('isAncestor returning true', 'info', 'Dom');
                            return true;
                        }
                        else if (!parent.tagName || parent.tagName.toUpperCase() == 'HTML') {
                            logger.log('isAncestor returning false', 'info', 'Dom');
                            return false;
                        }
                        
                        parent = parent.parentNode;
                    }
                    logger.log('isAncestor returning false', 'info', 'Dom');
                    return false;
                }     
            };
            
            return Y.Dom.batch(needle, f, Y.Dom, true);      
        },
        
        /**
         * Determines whether an HTMLElement is present in the current document.
         * @method inDocument         
         * @param {String | HTMLElement} el The element to search for
         * @return {Boolean} Whether or not the element is present in the current document
         */
        inDocument: function(el) {
            var f = function(el) {
                return this.isAncestor(document.documentElement, el);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.

         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         */
        getElementsBy: function(method, tag, root) {
            tag = tag || '*';
            
            var nodes = [];
            
            if (root) {
                root = Y.Dom.get(root);
                if (!root) { // if no root node, then no children
                    return nodes;
                }
            } else {
                root = document;
            }
            
            var elements = root.getElementsByTagName(tag);
            
            if ( !elements.length && (tag == '*' && root.all) ) {
                elements = root.all; // IE < 6
            }
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) { nodes[nodes.length] = elements[i]; }
            }

            logger.log('getElementsBy returning ' + nodes, 'info', 'Dom');
            
            return nodes;
        },
        
        /**
         * Returns an array of elements that have had the supplied method applied.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} override (optional) Whether or not to override the scope of "method" with "o"
         * @return {HTMLElement | Array} The element(s) with the method applied
         */
        batch: function(el, method, o, override) {
            var id = el;
            el = Y.Dom.get(el);
            
            var scope = (override) ? o : window;
            
            if (!el || el.tagName || !el.length) { // is null or not a collection (tagName for SELECT and others that can be both an element and a collection)
                if (!el) {
                    logger.log(id + ' not available', 'error', 'Dom');
                    return false;
                }
                return method.call(scope, el, o);
            } 
            
            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                if (!el[i]) {
                    id = el[i];
                    logger.log(id + ' not available', 'error', 'Dom');
                }
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        },
        
        /**
         * Returns the height of the document.
         * @method getDocumentHeight
         * @return {Int} The height of the actual document (which includes the body and its margin).
         */
        getDocumentHeight: function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;

            var h = Math.max(scrollHeight, Y.Dom.getViewportHeight());
            logger.log('getDocumentHeight returning ' + h, 'info', 'Dom');
            return h;
        },
        
        /**
         * Returns the width of the document.
         * @method getDocumentWidth
         * @return {Int} The width of the actual document (which includes the body and its margin).
         */
        getDocumentWidth: function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            var w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
            logger.log('getDocumentWidth returning ' + w, 'info', 'Dom');
            return w;
        },

        /**
         * Returns the current height of the viewport.
         * @method getViewportHeight
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportHeight: function() {
            var height = self.innerHeight; // Safari, Opera
            var mode = document.compatMode;
        
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
        
            logger.log('getViewportHeight returning ' + height, 'info', 'Dom');
            return height;
        },
        
        /**
         * Returns the current width of the viewport.
         * @method getViewportWidth
         * @return {Int} The width of the viewable area of the page (excludes scrollbars).
         */
        
        getViewportWidth: function() {
            var width = self.innerWidth;  // Safari
            var mode = document.compatMode;
            
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ?
                        document.documentElement.clientWidth : // Standards
                        document.body.clientWidth; // Quirks
            }
            logger.log('getViewportWidth returning ' + width, 'info', 'Dom');
            return width;
        }
    };
})();
/**
 * A region is a representation of an object on a grid.  It is defined
 * by the top, right, bottom, left extents, so is rectangular by default.  If 
 * other shapes are required, this class could be extended to support it.
 * @namespace YAHOO.util
 * @class Region
 * @param {Int} t the top extent
 * @param {Int} r the right extent
 * @param {Int} b the bottom extent
 * @param {Int} l the left extent
 * @constructor
 */
YAHOO.util.Region = function(t, r, b, l) {

    /**
     * The region's top extent
     * @property top
     * @type Int
     */
    this.top = t;
    
    /**
     * The region's top extent as index, for symmetry with set/getXY
     * @property 1
     * @type Int
     */
    this[1] = t;

    /**
     * The region's right extent
     * @property right
     * @type int
     */
    this.right = r;

    /**
     * The region's bottom extent
     * @property bottom
     * @type Int
     */
    this.bottom = b;

    /**
     * The region's left extent
     * @property left
     * @type Int
     */
    this.left = l;
    
    /**
     * The region's left extent as index, for symmetry with set/getXY
     * @property 0
     * @type Int
     */
    this[0] = l;
};

/**
 * Returns true if this region contains the region passed in
 * @method contains
 * @param  {Region}  region The region to evaluate
 * @return {Boolean}        True if the region is contained with this region, 
 *                          else false
 */
YAHOO.util.Region.prototype.contains = function(region) {
    return ( region.left   >= this.left   && 
             region.right  <= this.right  && 
             region.top    >= this.top    && 
             region.bottom <= this.bottom    );

    // this.logger.debug("does " + this + " contain " + region + " ... " + ret);
};

/**
 * Returns the area of the region
 * @method getArea
 * @return {Int} the region's area
 */
YAHOO.util.Region.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};

/**
 * Returns the region where the passed in region overlaps with this one
 * @method intersect
 * @param  {Region} region The region that intersects
 * @return {Region}        The overlap region, or null if there is no overlap
 */
YAHOO.util.Region.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    );
    var r = Math.min( this.right,  region.right  );
    var b = Math.min( this.bottom, region.bottom );
    var l = Math.max( this.left,   region.left   );
    
    if (b >= t && r >= l) {
        return new YAHOO.util.Region(t, r, b, l);
    } else {
        return null;
    }
};

/**
 * Returns the region representing the smallest region that can contain both
 * the passed in region and this region.
 * @method union
 * @param  {Region} region The region that to create the union with
 * @return {Region}        The union region
 */
YAHOO.util.Region.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );

    return new YAHOO.util.Region(t, r, b, l);
};

/**
 * toString
 * @method toString
 * @return string the region properties
 */
YAHOO.util.Region.prototype.toString = function() {
    return ( "Region {"    +
             "top: "       + this.top    + 
             ", right: "   + this.right  + 
             ", bottom: "  + this.bottom + 
             ", left: "    + this.left   + 
             "}" );
};

/**
 * Returns a region that is occupied by the DOM element
 * @method getRegion
 * @param  {HTMLElement} el The element
 * @return {Region}         The region that the element occupies
 * @static
 */
YAHOO.util.Region.getRegion = function(el) {
    var p = YAHOO.util.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new YAHOO.util.Region(t, r, b, l);
};

/////////////////////////////////////////////////////////////////////////////


/**
 * A point is a region that is special in that it represents a single point on 
 * the grid.
 * @namespace YAHOO.util
 * @class Point
 * @param {Int} x The X position of the point
 * @param {Int} y The Y position of the point
 * @constructor
 * @extends YAHOO.util.Region
 */
YAHOO.util.Point = function(x, y) {
   if (x instanceof Array) { // accept output from Dom.getXY
      y = x[1];
      x = x[0];
   }
   
    /**
     * The X position of the point, which is also the right, left and index zero (for Dom.getXY symmetry)
     * @property x
     * @type Int
     */

    this.x = this.right = this.left = this[0] = x;
     
    /**
     * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
     * @property y
     * @type Int
     */
    this.y = this.top = this.bottom = this[1] = y;
};

YAHOO.util.Point.prototype = new YAHOO.util.Region();

/**
 * Provides Attribute configurations.
 * @namespace YAHOO.util
 * @class Attribute
 * @constructor
 * @param hash {Object} The intial Attribute.
 * @param {YAHOO.util.AttributeProvider} The owner of the Attribute instance.
 */

YAHOO.util.Attribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};

YAHOO.util.Attribute.prototype = {
	/**
     * The name of the attribute.
	 * @property name
	 * @type String
	 */
    name: undefined,
    
	/**
     * The value of the attribute.
	 * @property value
	 * @type String
	 */
    value: null,
    
	/**
     * The owner of the attribute.
	 * @property owner
	 * @type YAHOO.util.AttributeProvider
	 */
    owner: null,
    
	/**
     * Whether or not the attribute is read only.
	 * @property readOnly
	 * @type Boolean
	 */
    readOnly: false,
    
	/**
     * Whether or not the attribute can only be written once.
	 * @property writeOnce
	 * @type Boolean
	 */
    writeOnce: false,

	/**
     * The attribute's initial configuration.
     * @private
	 * @property _initialConfig
	 * @type Object
	 */
    _initialConfig: null,
    
	/**
     * Whether or not the attribute's value has been set.
     * @private
	 * @property _written
	 * @type Boolean
	 */
    _written: false,
    
	/**
     * The method to use when setting the attribute's value.
     * The method recieves the new value as the only argument.
	 * @property method
	 * @type Function
	 */
    method: null,
    
	/**
     * The validator to use when setting the attribute's value.
	 * @property validator
	 * @type Function
     * @return Boolean
	 */
    validator: null,
    
    /**
     * Retrieves the current value of the attribute.
     * @method getValue
     * @return {any} The current value of the attribute.
     */
    getValue: function() {
        return this.value;
    },
    
    /**
     * Sets the value of the attribute and fires beforeChange and change events.
     * @method setValue
     * @param {Any} value The value to apply to the attribute.
     * @param {Boolean} silent If true the change events will not be fired.
     * @return {Boolean} Whether or not the value was set.
     */
    setValue: function(value, silent) {
        var beforeRetVal;
        var owner = this.owner;
        var name = this.name;
        
        var event = {
            type: name, 
            prevValue: this.getValue(),
            newValue: value
        };
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            return false; // write not allowed
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; // invalid value
        }

        if (!silent) {
            beforeRetVal = owner.fireBeforeChangeEvent(event);
            if (beforeRetVal === false) {
                YAHOO.log('setValue ' + name + 
                        'cancelled by beforeChange event', 'info', 'Attribute');
                return false;
            }
        }

        if (this.method) {
            this.method.call(owner, value);
        }
        
        this.value = value;
        this._written = true;
        
        event.type = name;
        
        if (!silent) {
            this.owner.fireChangeEvent(event);
        }
        
        return true;
    },
    
    /**
     * Allows for configuring the Attribute's properties.
     * @method configure
     * @param {Object} map A key-value map of Attribute properties.
     * @param {Boolean} init Whether or not this should become the initial config.
     */
    configure: function(map, init) {
        map = map || {};
        this._written = false; // reset writeOnce
        this._initialConfig = this._initialConfig || {};
        
        for (var key in map) {
            if ( key && map.hasOwnProperty(key) ) {
                this[key] = map[key];
                if (init) {
                    this._initialConfig[key] = map[key];
                }
            }
        }
    },
    
    /**
     * Resets the value to the initial config value.
     * @method resetValue
     * @return {Boolean} Whether or not the value was set.
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    
    /**
     * Resets the attribute config to the initial config state.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    
    /**
     * Resets the value to the current value.
     * Useful when values may have gotten out of sync with actual properties.
     * @method refresh
     * @return {Boolean} Whether or not the value was set.
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};

(function() {
    var Lang = YAHOO.util.Lang;

    /*
    Copyright (c) 2006, Yahoo! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.yahoo.net/yui/license.txt
    */
    
    /**
     * Provides and manages YAHOO.util.Attribute instances
     * @namespace YAHOO.util
     * @class AttributeProvider
     * @uses YAHOO.util.EventProvider
     */
    YAHOO.util.AttributeProvider = function() {};
    
    YAHOO.util.AttributeProvider.prototype = {
        
        /**
         * A key-value map of Attribute configurations
         * @property _configs
         * @protected (may be used by subclasses and augmentors)
         * @private
         * @type {Object}
         */
        _configs: null,
        /**
         * Returns the current value of the attribute.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(key){
            var configs = this._configs || {};
            var config = configs[key];
            
            if (!config) {
                YAHOO.log(key + ' not found', 'error', 'AttributeProvider');
                return undefined;
            }
            
            return config.value;
        },
        
        /**
         * Sets the value of a config.
         * @method set
         * @param {String} key The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set.
         */
        set: function(key, value, silent){
            var configs = this._configs || {};
            var config = configs[key];
            
            if (!config) {
                YAHOO.log('set failed: ' + key + ' not found',
                        'error', 'AttributeProvider');
                return false;
            }
            
            return config.setValue(value, silent);
        },
    
        /**
         * Returns an array of attribute names.
         * @method getAttributeKeys
         * @return {Array} An array of attribute names.
         */
        getAttributeKeys: function(){
            var configs = this._configs;
            var keys = [];
            var config;
            for (var key in configs) {
                config = configs[key];
                if ( configs.hasOwnProperty(key) && 
                        !Lang.isUndefined(config) ) {
                    keys[keys.length] = key;
                }
            }
            
            return keys;
        },
        
        /**
         * Sets multiple attribute values.
         * @method setAttributes
         * @param {Object} map  A key-value map of attributes
         * @param {Boolean} silent Whether or not to suppress change events
         */
        setAttributes: function(map, silent){
            for (var key in map) {
                if ( map.hasOwnProperty(key) ) {
                    this.set(key, map[key], silent);
                }
            }
        },
    
        /**
         * Resets the specified attribute's value to its initial value.
         * @method resetValue
         * @param {String} key The name of the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set
         */
        resetValue: function(key, silent){
            var configs = this._configs || {};
            if (configs[key]) {
                this.set(key, configs[key]._initialConfig.value, silent);
                return true;
            }
            return false;
        },
    
        /**
         * Sets the attribute's value to its current value.
         * @method refresh
         * @param {String | Array} key The attribute(s) to refresh
         * @param {Boolean} silent Whether or not to suppress change events
         */
        refresh: function(key, silent){
            var configs = this._configs;
            
            key = ( ( Lang.isString(key) ) ? [key] : key ) || 
                    this.getAttributeKeys();
            
            for (var i = 0, len = key.length; i < len; ++i) { 
                if ( // only set if there is a value and not null
                    configs[key[i]] && 
                    ! Lang.isUndefined(configs[key[i]].value) &&
                    ! Lang.isNull(configs[key[i]].value) ) {
                    configs[key[i]].refresh(silent);
                }
            }
        },
    
        /**
         * Adds an Attribute to the AttributeProvider instance. 
         * @method register
         * @param {String} key The attribute's name
         * @param {Object} map A key-value map containing the
         * attribute's properties.
         * @deprecated Use setAttributeConfig
         */
        register: function(key, map) {
            this.setAttributeConfig(key, map);
        },
        
        
        /**
         * Returns the attribute's properties.
         * @method getAttributeConfig
         * @param {String} key The attribute's name
         * @private
         * @return {object} A key-value map containing all of the
         * attribute's properties.
         */
        getAttributeConfig: function(key) {
            var configs = this._configs || {};
            var config = configs[key] || {};
            var map = {}; // returning a copy to prevent overrides
            
            for (key in config) {
                if ( config.hasOwnProperty(key) ) {
                    map[key] = config[key];
                }
            }
    
            return map;
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method setAttributeConfig
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        setAttributeConfig: function(key, map, init) {
            var configs = this._configs || {};
            map = map || {};
            if (!configs[key]) {
                map.name = key;
                configs[key] = new YAHOO.util.Attribute(map, this);
            } else {
                configs[key].configure(map, init);
            }
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method configureAttribute
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        configureAttribute: function(key, map, init) {
            this.setAttributeConfig(key, map, init);
        },
        
        /**
         * Resets an attribute to its intial configuration. 
         * @method resetAttributeConfig
         * @param {String} key The attribute's name.
         * @private
         */
        resetAttributeConfig: function(key){
            var configs = this._configs || {};
            configs[key].resetConfig();
        },
        
        /**
         * Fires the attribute's beforeChange event. 
         * @method fireBeforeChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to handlers.
         */
        fireBeforeChangeEvent: function(e) {
            var type = 'before';
            type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
            e.type = type;
            return this.fireEvent(e.type, e);
        },
        
        /**
         * Fires the attribute's change event. 
         * @method fireChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to the handlers.
         */
        fireChangeEvent: function(e) {
            e.type += 'Change';
            return this.fireEvent(e.type, e);
        }
    };
    
    YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();

(function() {
// internal shorthand
var Dom = YAHOO.util.Dom,
    Lang = YAHOO.util.Lang,
    EventPublisher = YAHOO.util.EventPublisher,
    AttributeProvider = YAHOO.util.AttributeProvider;

/**
 * Element provides an interface to an HTMLElement's attributes and common
 * methods.  Other commonly used attributes are added as well.
 * @namespace YAHOO.util
 * @class Element
 * @uses YAHOO.util.AttributeProvider
 * @constructor
 * @param el {HTMLElement | String} The html element that 
 * represents the Element.
 * @param {Object} map A key-value map of initial config names and values
 */
YAHOO.util.Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

YAHOO.util.Element.prototype = {
	/**
     * Dom events supported by the Element instance.
	 * @property DOM_EVENTS
	 * @type Object
	 */
    DOM_EVENTS: null,

	/**
     * Wrapper for HTMLElement method.
	 * @method appendChild
	 * @param {Boolean} deep Whether or not to do a deep clone
	 */
    appendChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').appendChild(child);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method getElementsByTagName
	 * @param {String} tag The tagName to collect
	 */
    getElementsByTagName: function(tag) {
        return this.get('element').getElementsByTagName(tag);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method hasChildNodes
	 * @return {Boolean} Whether or not the element has childNodes
	 */
    hasChildNodes: function() {
        return this.get('element').hasChildNodes();
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method insertBefore
	 * @param {HTMLElement} element The HTMLElement to insert
	 * @param {HTMLElement} before The HTMLElement to insert
     * the element before.
	 */
    insertBefore: function(element, before) {
        element = element.get ? element.get('element') : element;
        before = (before && before.get) ? before.get('element') : before;
        
        this.get('element').insertBefore(element, before);
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method removeChild
	 * @param {HTMLElement} child The HTMLElement to remove
	 */
    removeChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').removeChild(child);
        return true;
    },
    
	/**
     * Wrapper for HTMLElement method.
	 * @method replaceChild
	 * @param {HTMLElement} newNode The HTMLElement to insert
	 * @param {HTMLElement} oldNode The HTMLElement to replace
	 */
    replaceChild: function(newNode, oldNode) {
        newNode = newNode.get ? newNode.get('element') : newNode;
        oldNode = oldNode.get ? oldNode.get('element') : oldNode;
        return this.get('element').replaceChild(newNode, oldNode);
    },

    
    /**
     * Registers Element specific attributes.
     * @method initAttributes
     * @param {Object} map A key-value map of initial attribute configs
     */
    initAttributes: function(map) {
        map = map || {}; 
        var element = Dom.get(map.element) || null;
        
        /**
         * The HTMLElement the Element instance refers to.
         * @config element
         * @type HTMLElement
         */
        this.setAttributeConfig('element', {
            value: element,
            readOnly: true
         });
    },

    /**
     * Adds a listener for the given event.  These may be DOM or 
     * customEvent listeners.  Any event that is fired via fireEvent
     * can be listened for.  All handlers receive an event object. 
     * @method addListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The handler to call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    addListener: function(type, fn, obj, scope) {
        var el = this.get('element');
        var scope = scope || this;
        
        el = this.get('id') || el;
        
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                YAHOO.util.Event.addListener(el, type, function(e) {
                    if (e.srcElement && !e.target) { // supplement IE with target
                        e.target = e.srcElement;
                    }
                    this.fireEvent(type, e);
                }, obj, scope);
            }
            
            this.createEvent(type, this);
            this._events[type] = true;
        }
        
        this.subscribe.apply(this, arguments); // notify via customEvent
    },
    
    
    /**
     * Alias for addListener
     * @method on
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    on: function() { this.addListener.apply(this, arguments); },
    
    
    /**
     * Remove an event listener
     * @method removeListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     */
    removeListener: function(type, fn) {
        this.unsubscribe.apply(this, arguments);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method addClass
	 * @param {String} className The className to add
	 */
    addClass: function(className) {
        Dom.addClass(this.get('element'), className);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method getElementsByClassName
	 * @param {String} className The className to collect
	 * @param {String} tag (optional) The tag to use in
     * conjunction with class name
     * @return {Array} Array of HTMLElements
	 */
    getElementsByClassName: function(className, tag) {
        return Dom.getElementsByClassName(className, tag,
                this.get('element') );
    },
    
	/**
     * Wrapper for Dom method.
	 * @method hasClass
	 * @param {String} className The className to add
     * @return {Boolean} Whether or not the element has the class name
	 */
    hasClass: function(className) {
        return Dom.hasClass(this.get('element'), className); 
    },
    
	/**
     * Wrapper for Dom method.
	 * @method removeClass
	 * @param {String} className The className to remove
	 */
    removeClass: function(className) {
        return Dom.removeClass(this.get('element'), className);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method replaceClass
	 * @param {String} oldClassName The className to replace
	 * @param {String} newClassName The className to add
	 */
    replaceClass: function(oldClassName, newClassName) {
        return Dom.replaceClass(this.get('element'), 
                oldClassName, newClassName);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method setStyle
	 * @param {String} property The style property to set
	 * @param {String} value The value to apply to the style property
	 */
    setStyle: function(property, value) {
        var el = this.get('element');
        if (!el) {
            this._queue[this._queue.length] = ['setStyle', arguments];
            return false;
        }        
        return Dom.setStyle(this.get('element'),  property, value);
    },
    
	/**
     * Wrapper for Dom method.
	 * @method getStyle
	 * @param {String} property The style property to retrieve
	 * @return {String} The current value of the property
	 */
    getStyle: function(property) {
        return Dom.getStyle(this.get('element'),  property);
    },
    
	/**
     * Apply any queued set calls.
	 * @method fireQueue
	 */
    fireQueue: function() {
        var queue = this._queue;
        for (var i = 0, len = queue.length; i < len; ++i) {
            this[queue[i][0]].apply(this, queue[i][1]);
        }
    },
    
	/**
     * Appends the HTMLElement into either the supplied parentNode.
	 * @method appendTo
	 * @param {HTMLElement | Element} parentNode The node to append to
	 * @param {HTMLElement | Element} before An optional node to insert before
	 */
    appendTo: function(parent, before) {
        parent = (parent.get) ?  parent.get('element') : Dom.get(parent);
        
        this.fireEvent('beforeAppendTo', {
            type: 'beforeAppendTo',
            target: parent
        });
        
        
        before = (before && before.get) ? 
                before.get('element') : Dom.get(before);
        var element = this.get('element');
        
        if (!element) {
            YAHOO.log('appendTo failed: element not available',
                    'error', 'Element');
            return false;
        }
        
        if (!parent) {
            YAHOO.log('appendTo failed: parent not available',
                    'error', 'Element');
            return false;
        }
        
        if (element.parent != parent) {
            if (before) {
                parent.insertBefore(element, before);
            } else {
                parent.appendChild(element);
            }
        }
        
        YAHOO.log(element + 'appended to ' + parent);
        
        this.fireEvent('appendTo', {
            type: 'appendTo',
            target: parent
        });
        
        /* TODO: move to TabView or deprecate?
        var newAddition =  !Dom.inDocument(element);
        if (!newAddition) {
            return false; // note return; no refresh if in document
        }
        
        // if a new addition, refresh HTMLElement any applied attributes
        var keys = this.getAttributeKeys();
        
        for (var key in keys) { // only refresh HTMLElement attributes
            if ( !Lang.isUndefined(element[key]) ) {
                this.refresh(key);
            }
        }
        */
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element; // avoid loop due to 'element'
        if (el && !configs[key] && !Lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[this._queue.length] = ['set', arguments];
            if (this._configs[key]) {
                this._configs[key].value = value; // so "get" works while queueing
            
            }
            return;
        }
        
        // set it on the element if not configured and is an HTML attribute
        if ( !this._configs[key] && !Lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    setAttributeConfig: function(key, map, init) {
        var el = this.get('element');

        if (el && !this._configs[key] && !Lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key, map);
        } else {
            AttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
        }
    },
    
    getAttributeKeys: function() {
        var el = this.get('element');
        var keys = AttributeProvider.prototype.getAttributeKeys.call(this);
        
        //add any unconfigured element keys
        for (var key in el) {
            if (!this._configs[key]) {
                keys[key] = keys[key] || el[key];
            }
        }
        
        return keys;
    },
    
    init: function(el, attr) {
        this._queue = this._queue || [];
        this._events = this._events || {};
        this._configs = this._configs || {};
        attr = attr || {};
        attr.element = attr.element || el || null;

        this.DOM_EVENTS = {
            'click': true,
            'keydown': true,
            'keypress': true,
            'keyup': true,
            'mousedown': true,
            'mousemove': true,
            'mouseout': true, 
            'mouseover': true, 
            'mouseup': true
        };
        
        var readyHandler = function() {
            this.initAttributes(attr);
            this.setAttributes(attr, true);
            this.fireQueue();
            this.fireEvent('contentReady', {
                type: 'contentReady',
                target: attr.element
            });
        };

        if ( Lang.isString(el) ) {
            _registerHTMLAttr.call(this, 'id', { value: el });
            YAHOO.util.Event.onAvailable(el, function() {
                attr.element = Dom.get(el);
                this.fireEvent('available', {
                    type: 'available',
                    target: attr.element
                }); 
            }, this, true);
            
            YAHOO.util.Event.onContentReady(el, function() {
                readyHandler.call(this);
            }, this, true);
        } else {
            readyHandler.call(this);
        }        
    }
};

/**
 * Sets the value of the property and fires beforeChange and change events.
 * @private
 * @method _registerHTMLAttr
 * @param {YAHOO.util.Element} element The Element instance to
 * register the config to.
 * @param {String} key The name of the config to register
 * @param {Object} map A key-value map of the config's params
 */
var _registerHTMLAttr = function(key, map) {
    var el = this.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    this._configs[key] = new YAHOO.util.Attribute(map, this);
};

/**
 * Fires when the Element's HTMLElement can be retrieved by Id.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> available<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('available', handler);</code></p>
 * @event available
 */
 
/**
 * Fires when the Element's HTMLElement subtree is rendered.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> contentReady<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('contentReady', handler);</code></p>
 * @event contentReady
 */


YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();

YAHOO.register("dom", YAHOO.util.Dom, {version: "@VERSION@", build: "@BUILD@"});
