YAHOO.namespace("util");

/**
 * The UserAction object provides functions that simulate events occurring in
 * the browser. Since these are simulated events, they do not behave exactly
 * as regular, user-initiated events do, but can be used to test simple
 * user interactions safely.
 *
 * @namespace YAHOO.util
 * @class UserAction
 * @static
 */
YAHOO.util.UserAction = {

    //--------------------------------------------------------------------------
    // Generic event methods
    //--------------------------------------------------------------------------

    /**
     * Fires an event that normally would be fired by the keyboard (keyup,
     * keydown, keypress). Make sure to specify either keyCode or charCode as
     * an option.
     * @private
     * @param {String} type The type of event ("keyup", "keydown" or "keypress").
     * @param {HTMLElement} target The target of the event.
     * @param {Object} options Options for the event. Either keyCode or charCode
     *                         are required.
     * @method fireKeyEvent
     * @static
     */
    fireKeyEvent : function (type /*:String*/, target /*:HTMLElement*/,  
                             options /*:Object*/) /*:Void*/ {
        //XXX: Not Done!
        var event /*:Event*/ = null; 
        options = options || {};   
        target = YAHOO.util.Dom.get(target);

        //official DOM way
        if (YAHOO.lang.isFunction(document.createEvent)){ //DOM Level 2
            if (!YAHOO.lang.isUndefined(window.KeyEvent)) { //Firefox
                event = document.createEvent("KeyEvents");
                event.initKeyEvent(type, true, true, window, 
                                   options.ctrlKey||false, 
                                   options.altKey||false,
                                   options.shiftKey||false,
                                   options.metaKey||false,
                                   options.keyCode||0, 
                                   options.charCode||0);                            
            } else { //DOM Level 2
                event = document.createEvent("UIEvents");
                event.initUIEvent(type, true, true, window, 1);   
                event.keyCode = options.keyCode || 0;
                event.altKey = options.altKey||false;
                event.ctrlKey = options.ctrlKey||false;
                event.shiftKey = options.shiftKey||false;
                event.metaKey = options.metaKey||false;
                event.charCode = options.charCode||0;     
            }
            
            //fire the event
            target.dispatchEvent(event);
        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
            event = document.createEventObject();
            event.ctrlKey = options.ctrlKey||false;
            event.altKey = options.AltKey||false;
            event.shiftKey = options.shiftKey||false;
            event.metaKey = options.metaKey||false;
            event.keyCode = options.keyCode|options.charCode||0;
            
            target.fireEvent("on" + type, event);       
        } else {
            throw new Error("Could not fire event '" + type + "'.");
        }
    
    },
    
    /**
     * Fires an event that normally would be fired by the mouse. 
     * @private
     * @param {String} type The type of event ("mouseup", "mousedown", "click",
     *                      "mousemove", "mouseover", or "mouseout").
     * @param {HTMLElement} target The target of the event.
     * @param {Object} options Options for the event. Either keyCode or charCode
     *                         are required.
     * @method fireMouseEvent
     * @static     
     */    
    fireMouseEvent : function (type /*:String*/, target /*:HTMLElement*/,  
                               options /*:Object*/) /*:Void*/ {
    
        var event /*:Event*/ = null; 
        options = options || {};   
        target = YAHOO.util.Dom.get(target);

        //official DOM way
        if (YAHOO.lang.isFunction(document.createEvent)){ //DOM Level 2

            event = document.createEvent("MouseEvents");

            if (YAHOO.lang.isFunction(event.initMouseEvent)){ //not all browsers support this yet            
                event.initMouseEvent(type, true, true, window, null,
                                     options.screenX||0, options.screenY||0, 
                                     options.clientX||0, options.clientY||0, 
                                     options.ctrlKey||false, options.altKey||false, 
                                     options.shiftKey||false, options.metaKey||false, 
                                     options.button||0, options.relatedTarget);
                                     
            } else if (YAHOO.lang.isFunction(event.initEvent)){ //last fallback - older versions of Safari
                event = document.createEvent("UIEvents");
                event.initEvent(type, true, true);
                event.screenX = options.screenX||0;
                event.screenY = options.screenY||0;
                event.clientX = options.clientX||0;
                event.clientY = options.clientY||0;
                event.altKey = options.altKey||false;
                event.ctrlKey = options.ctrlKey||false;
                event.metaKey = options.metaKey||false;
                event.shiftKey = options.shiftKey||false;
                event.relatedTarget = options.relatedTarget;
            }

            
            if (options.relatedTarget && !event.relatedTarget){
                if (type == "mouseout"){
                    event.toElement = options.relatedTarget;
                } else if (type == "mouseover"){
                    event.fromElement = options.relatedTarget;
                }
            } 
          
            //fire the event
            target.dispatchEvent(event);
        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
            event = document.createEventObject();
            event.screenX = options.screenX||0;
            event.screenY = options.screenY||0;
            event.clientX = options.clientX||0;
            event.clientY = options.clientY||0;
            event.altKey = options.altKey||false;
            event.ctrlKey = options.ctrlKey||false;
            event.metaKey = options.metaKey||false;
            event.shiftKey = options.shiftKey||false;
            event.relatedTarget = options.relatedTarget;
            
            //fix button property for IE's wacky implementation
            switch(options.button){
                case 0:
                    event.button = 1;
                    break;
                case 1:
                    event.button = 4;
                    break;
                default:
                    event.button = 0;                    
            }
            
            target.fireEvent("on" + type, event);       
        } else {
            throw new Error("Could not fire event '" + type + "'.");
        }
    
    },    
    
    //--------------------------------------------------------------------------
    // Mouse events
    //--------------------------------------------------------------------------

    /**
     * Simulates a click on a particular element.
     * @param {HTMLElement} target The element to click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method click
     * @static     
     */
    click : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent("click", target, options);
    },
    
    /**
     * Simulates a double click on a particular element.
     * @param {HTMLElement} target The element to double click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method dblclick
     * @static
     */
    dblclick : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent("click", target, options);
    },
    
    /**
     * Simulates a mousedown on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousedown
     * @static
     */
    mousedown : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent("mousedown", target, options);
    },
    
    /**
     * Simulates a mousemove on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousemove
     * @static
     */
    mousemove : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent("mousemove", target, options);
    },
    
    /**
     * Simulates a mouseout event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved to.
     * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
     * toElement is assigned in its place. IE doesn't allow toElement to be
     * be assigned, so relatedTarget is assigned in its place. Both of these
     * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
     * in both browsers.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseout
     * @static
     */
    mouseout : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent("mouseout", target, options);
    },
    
    /**
     * Simulates a mouseover event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved from.
     * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
     * fromElement is assigned in its place. IE doesn't allow fromElement to be
     * be assigned, so relatedTarget is assigned in its place. Both of these
     * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
     * in both browsers.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseover
     * @static
     */
    mouseover : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent("mouseover", target, options);
    },
    
    /**
     * Simulates a mouseup on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseup
     * @static
     */
    mouseup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent("mouseup", target, options);
    },
    
    //--------------------------------------------------------------------------
    // Key events
    //--------------------------------------------------------------------------

    /**
     * Simulates a keydown event on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keydown
     * @static
     */
    keydown : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireKeyEvent("keydown", target, options);
    },
    
    /**
     * Simulates a keypress on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keypress
     * @static
     */
    keypress : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireKeyEvent("keypress", target, options);
    },
    
    /**
     * Simulates a keyup event on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keyup
     * @static
     */
    keyup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireKeyEvent("keyup", target, options);
    }
    

};