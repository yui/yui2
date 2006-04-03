/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * A static factory class for tree view expand/collapse animations
 *
 * @constructor
 */
YAHOO.widget.TVAnim = function() {
    return {
        /**
         * Constant for the fade in animation
         * 
         * @type string
         */
        FADE_IN: "TVFadeIn",

        /**
         * Constant for the fade out animation
         * 
         * @type string
         */
        FADE_OUT: "TVFadeOut",

        /**
         * Returns a ygAnim instance of the given type
         *
         * @param type {string} the type of animation
         * @param el {HTMLElement} the element to element (probably the children div)
         * @param callback {function} function to invoke when the animation is done.
         * @return {YAHOO.util.Animation} the animation instance
         */
        getAnim: function(type, el, callback) {
            if (YAHOO.widget[type]) {
                return new YAHOO.widget[type](el, callback);
            } else {
                return null;
            }
        },

        /**
         * Returns true if the specified animation class is available
         *
         * @param type {string} the type of animation
         * @return {boolean} true if valid, false if not
         */
        isValid: function(type) {
            return (YAHOO.widget[type]);
        }
    };
} ();

