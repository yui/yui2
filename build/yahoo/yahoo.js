/*                                                                                                                                                      
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 0.12.0
*/ 

/**
 * The YAHOO object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  YAHOO.util, YAHOO.widget, and YAHOO.example are namespaces
 * created automatically for and used by the library.
 * @module yahoo
 * @title  YAHOO Global
 */

/**
 * The YAHOO global namespace object
 * @class YAHOO
 * @static
 */
if (typeof YAHOO == "undefined") {
    YAHOO = {};
}

/**
 * Returns the namespace specified and creates it if it doesn't exist
 * <pre>
 * YAHOO.namespace("property.package");
 * YAHOO.namespace("YAHOO.property.package");
 * </pre>
 * Either of the above would create YAHOO.property, then
 * YAHOO.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * YAHOO.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 * @method namespace
 * @static
 * @param  {String} ns The name of the namespace
 * @return {Object}    A reference to the namespace object
 */
YAHOO.namespace = function(ns) {

    if (!ns || !ns.length) {
        return null;
    }

    var levels = ns.split(".");
    var nsobj = YAHOO;

    // YAHOO is implied, so it is ignored if it is included
    for (var i=(levels[0] == "YAHOO") ? 1 : 0; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }

    return nsobj;
};

/**
 * Uses YAHOO.widget.Logger to output a log message, if the widget is available.
 *
 * @method log
 * @static
 * @param  {string}  sMsg       The message to log.
 * @param  {string}  sCategory  The log category for the message.  Default
 *                              categories are "info", "warn", "error", time".
 *                              Custom categories can be used as well. (opt)
 * @param  {string}  sSource    The source of the the message (opt)
 * @return {boolean}            True if the log operation was successful.
 */
YAHOO.log = function(sMsg, sCategory, sSource) {
    var l = YAHOO.widget.Logger;
    if(l && l.log) {
        return l.log(sMsg, sCategory, sSource);
    } else {
        return false;
    }
};

/**
 * Utility to set up the prototype, constructor and superclass properties to
 * support an inheritance strategy that can chain constructors and methods.
 *
 * @method extend
 * @static
 * @param {function} subclass   the object to modify
 * @param {function} superclass the object to inherit
 * @param {Object}   overrides  additional properties/methods to add to the
 *                              subclass prototype.  These will override the
 *                              matching items obtained from the superclass 
 *                              if present.
 */
YAHOO.extend = function(subclass, superclass, overrides) {
    var f = function() {};
    f.prototype = superclass.prototype;
    subclass.prototype = new f();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass.prototype;
    if (superclass.prototype.constructor == Object.prototype.constructor) {
        superclass.prototype.constructor = superclass;
    }

    if (overrides) {
        for (var i in overrides) {
            subclass.prototype[i] = overrides[i];
        }
    }
};

/**
 * Applies all prototype properties in the supplier to the receiver if the
 * receiver does not have these properties yet.  Optionally, one or more
 * methods/properties can be specifified (as additional parameters).  This
 * option will overwrite the property if receiver has it already.
 *
 * @method augment
 * @static
 * @param {function} receiver  the object to augment
 * @param {function} supplier  the object to augment the receiver with
 * @param {String*}  arguments zero or more properties methods to augment the
 *                             receiver with.  If none specified, everything
 *                             in the supplier will be used unless it would
 *                             overwrite an existing property in the receiver
 */
YAHOO.augment = function(receiver, supplier) {
    var args = [receiver.prototype, supplier.prototype];
    for (var i=2; i<arguments.length; ++i) {
        args.push(arguments[i]);
    }
    YAHOO.mixin.apply(YAHOO, args);
};

/*
 * Generic object mixer used by YAHOO.augment.  Included for completeness, and
 * in case there is need to use the mixin technique on static objects or 
 * instances.
 */
YAHOO.mixin = function(receiver, supplier) {
    if (arguments[2]) {
        for (var i=2; i<arguments.length; ++i) {
            receiver[arguments[i]] = supplier[arguments[i]];
        }
    } else {
        for (var prop in supplier) { 
            if (!receiver[prop]) {
                receiver[prop] = supplier[prop];
            }
        }
    }
};

YAHOO.namespace("util");
YAHOO.namespace("widget");
YAHOO.namespace("example");

