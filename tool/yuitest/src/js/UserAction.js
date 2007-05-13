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
     * Simulates a key event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateKeyEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: keyup, keydown, and keypress.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 3 specifies that all key events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 3 specifies that all
     *      key events can be cancelled. The default 
     *      is true.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} keyCode (Optional) The code for the key that is in use. 
     *      The default is 0.
     * @param {int} charCode (Optional) The Unicode code for the character
     *      associated with the key being used. The default is 0.
     */
    simulateKeyEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                 bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                 view /*:Window*/,
                                 ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                 shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                 keyCode /*:int*/,        charCode /*:int*/) /*:Void*/                             
    {
        //check target
        target = YAHOO.util.Dom.get(target);        
        if (!target){
            throw new Error("simulateKeyEvent(): Invalid target.");
        }
        
        //check event type
        if (YAHOO.lang.isString(type)){
            type = type.toLowerCase();
            switch(type){
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                case "textevent": //DOM Level 3
                    type = "keypress";
                default:
                    throw new Error("simulateKeyEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateKeyEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (!YAHOO.lang.isBoolean(bubbles)){
            bubbles = true; //all key events bubble
        }
        if (!YAHOO.lang.isBoolean(cancelable)){
            cancelable = true; //all key events can be cancelled
        }
        if (!YAHOO.lang.isObject(view)){
            view = window; //view is typically window
        }
        if (!YAHOO.lang.isBoolean(ctrlKey)){
            ctrlKey = false;
        }
        if (!YAHOO.lang.isBoolean(altKey)){
            altKey = false;
        }
        if (!YAHOO.lang.isBoolean(shiftKey)){
            shiftKey = false;
        }
        if (!YAHOO.lang.isNumber(keyCode)){
            keyCode = 0;
        }
        if (!YAHOO.lang.isNumber(charCode)){
            charCode = 0; 
        }
        
        //check for DOM-compliant browsers first
        if (YAHOO.lang.isFunction(document.createEvent)){
        
            //try to create a mouse event
            var event /*:MouseEvent*/ = null;
            
            try {
                
                //try to create key event
                event = document.createEvent("KeyEvents");
                
                /*
                 * Interesting problem: Firefox implemented a non-standard
                 * version of initKeyEvent() based on DOM Level 2 specs.
                 * Key event was removed from DOM Level 2 and re-introduced
                 * in DOM Level 3 with a different interface. Firefox is the
                 * only browser with any implementation of Key Events, so for
                 * now, assume it's Firefox if the above line doesn't error.
                 */
                //TODO: Decipher between Firefox's implementation and a correct one.
                event.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                    altKey, shiftKey, metaKey, keyCode, charCode);       
                
            } catch (ex /*:Error*/){
            
                //create regular UI event
                event = document.createEvent("UIEvents");
                
                //try to use initUIEvent (Safari 2.x can't do this)
                try {
                    event.initUIEvent(type, bubbles, cancelable, view, 0);
                } catch (uiError /*:Error*/) {
                    event.initEvent(type, bubbles, cancelable);
                    event.view = view;                
                }

                //initialize
                event.altKey = altKey;
                event.ctrlKey = ctrlKey;
                event.shiftKey = shiftKey;
                event.metaKey = metaKey;
                event.keyCode = keyCode;
                event.charCode = charCode;              
            }
            
            //fire the event
            target.dispatchEvent(event);

        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
        
            //create an IE event object
            var event = document.createEventObject();
            
            //assign available properties
            event.bubbles = bubbles;
            event.cancelable = cancelable;
            event.view = view;
            event.ctrlKey = ctrlKey;
            event.altKey = altKey;
            event.shiftKey = shiftKey;
            event.metaKey = metaKey;
            
            /*
             * IE doesn't support charCode explicitly. CharCode should
             * take precedence over any keyCode value for accurate
             * representation.
             */
            event.keyCode = (charCode > 0) ? charCode : keyCode;
            
            //fire the event
            target.fireEvent("on" + type, event);  
                    
        } else {
            throw new Error("simulateKeyEvent(): No event simulation framework present.");
        }
    },

    /**
     * Simulates a mouse event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateMouseEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default 
     *      is true for all events except mousemove, for which the default 
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     * @param {int} screenX (Optional) The x-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} screenY (Optional) The y-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} clientX (Optional) The x-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {int} clientY (Optional) The y-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} button (Optional) The button being pressed while the event
     *      is executing. The value should be 0 for the primary mouse button
     *      (typically the left button), 1 for the terciary mouse button
     *      (typically the middle button), and 2 for the secondary mouse button
     *      (typically the right button). The default is 0.
     * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
     *      this is the element that the mouse has moved to. For mouseover
     *      events, this is the element that the mouse has moved from. This
     *      argument is ignored for all other events. The default is null.
     */
    simulateMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                   view /*:Window*/,        detail /*:int*/, 
                                   screenX /*:int*/,        screenY /*:int*/, 
                                   clientX /*:int*/,        clientY /*:int*/,       
                                   ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                   shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                   button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
    {
        
        //check target
        target = YAHOO.util.Dom.get(target);        
        if (!target){
            throw new Error("simulateMouseEvent(): Invalid target.");
        }
        
        //check event type
        if (YAHOO.lang.isString(type)){
            type = type.toLowerCase();
            switch(type){
                case "mouseover":
                case "mouseout":
                case "mousedown":
                case "mouseup":
                case "click":
                case "dblclick":
                case "mousemove":
                    break;
                default:
                    throw new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateMouseEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (!YAHOO.lang.isBoolean(bubbles)){
            bubbles = true; //all mouse events bubble
        }
        if (!YAHOO.lang.isBoolean(cancelable)){
            cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
        }
        if (!YAHOO.lang.isObject(view)){
            view = window; //view is typically window
        }
        if (!YAHOO.lang.isNumber(detail)){
            detail = 1;  //number of mouse clicks must be at least one
        }
        if (!YAHOO.lang.isNumber(screenX)){
            screenX = 0; 
        }
        if (!YAHOO.lang.isNumber(screenY)){
            screenY = 0; 
        }
        if (!YAHOO.lang.isNumber(clientX)){
            clientX = 0; 
        }
        if (!YAHOO.lang.isNumber(clientY)){
            clientY = 0; 
        }
        if (!YAHOO.lang.isBoolean(ctrlKey)){
            ctrlKey = false;
        }
        if (!YAHOO.lang.isBoolean(altKey)){
            altKey = false;
        }
        if (!YAHOO.lang.isBoolean(shiftKey)){
            shiftKey = false;
        }
        if (!YAHOO.lang.isBoolean(metaKey)){
            metaKey = false;
        }
        if (!YAHOO.lang.isNumber(button)){
            button = 0; 
        }
        
        //check for DOM-compliant browsers first
        if (YAHOO.lang.isFunction(document.createEvent)){
        
            //try to create a mouse event
            var event /*:MouseEvent*/ = document.createEvent("MouseEvents");
            
            //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (event.initMouseEvent){
                event.initMouseEvent(type, bubbles, cancelable, view, detail,
                                     screenX, screenY, clientX, clientY, 
                                     ctrlKey, altKey, shiftKey, metaKey, 
                                     button, relatedTarget);
            } else { //Safari
            
                //the closest thing available in Safari 2.x is UIEvents
                event = document.createEvent("UIEvents");
                event.initEvent(type, bubbles, cancelable);
                event.view = view;
                event.detail = detail;
                event.screenX = screenX;
                event.screenY = screenY;
                event.clientX = clientX;
                event.clientY = clientY;
                event.ctrlKey = ctrlKey;
                event.altKey = altKey;
                event.metaKey = metaKey;
                event.shiftKey = shiftKey;
                event.button = button;
                event.relatedTarget = relatedTarget;
            }
            
            /*
             * Check to see if relatedTarget has been assigned. Firefox
             * versions less than 2.0 don't allow it to be assigned via
             * initMouseEvent() and the property is readonly after event
             * creation, so in order to keep YAHOO.util.getRelatedTarget()
             * working, assign to the IE proprietary toElement property
             * for mouseout event and fromElement property for mouseover
             * event.
             */
            if (relatedTarget && !event.relatedTarget){
                if (type == "mouseout"){
                    event.toElement = relatedTarget;
                } else if (type == "mouseover"){
                    event.fromElement = relatedTarget;
                }
            }
            
            //fire the event
            target.dispatchEvent(event);

        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
        
            //create an IE event object
            var event = document.createEventObject();
            
            //assign available properties
            event.bubbles = bubbles;
            event.cancelable = cancelable;
            event.view = view;
            event.detail = detail;
            event.screenX = screenX;
            event.screenY = screenY;
            event.clientX = clientX;
            event.clientY = clientY;
            event.ctrlKey = ctrlKey;
            event.altKey = altKey;
            event.metaKey = metaKey;
            event.shiftKey = shiftKey;

            //fix button property for IE's wacky implementation
            switch(button){
                case 0:
                    event.button = 1;
                    break;
                case 1:
                    event.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    event.button = 0;                    
            }    

            /*
             * Have to use relatedTarget because IE won't allow assignment
             * to toElement or fromElement on generic events. This keeps
             * YAHOO.util.Event.getRelatedTarget() functional.
             */
            event.relatedTarget = relatedTarget;
            
            //fire the event
            target.fireEvent("on" + type, event);
                    
        } else {
            throw new Error("simulateMouseEvent(): No event simulation framework present.");
        }
    },

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
    xfireKeyEvent : function (type /*:String*/, target /*:HTMLElement*/,  
                             options /*:Object*/) /*:Void*/ {
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
                event.keyCode = options.keyCode||options.charCode||0;
                event.altKey = options.altKey||false;
                event.ctrlKey = options.ctrlKey||false;
                event.shiftKey = options.shiftKey||false;
                event.metaKey = options.metaKey||false;
                event.charCode = options.charCode||options.keyCode||0;     
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
    
    //--------------------------------------------------------------------------
    // Mouse events
    //--------------------------------------------------------------------------

    /**
     * Simulates a mouse event on a particular element.
     * @param {HTMLElement} target The element to click on.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseEvent
     * @static
     */
    fireMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                           options /*:Object*/) /*:Void*/
    {
        options = options || {};
        this.simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail, options.screenX,        
            options.screenY, options.clientX, options.clientY, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, options.button,         
            options.relatedTarget);        
    },

    /**
     * Simulates a click on a particular element.
     * @param {HTMLElement} target The element to click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method click
     * @static     
     */
    click : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "click", options);
    },
    
    /**
     * Simulates a double click on a particular element.
     * @param {HTMLElement} target The element to double click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method dblclick
     * @static
     */
    dblclick : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent( target, "dblclick", options);
    },
    
    /**
     * Simulates a mousedown on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousedown
     * @static
     */
    mousedown : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mousedown", options);
    },
    
    /**
     * Simulates a mousemove on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousemove
     * @static
     */
    mousemove : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mousemove", options);
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
        this.fireMouseEvent(target, "mouseout", options);
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
        this.fireMouseEvent(target, "mouseover", options);
    },
    
    /**
     * Simulates a mouseup on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseup
     * @static
     */
    mouseup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mouseup", options);
    },
    
    //--------------------------------------------------------------------------
    // Key events
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
                             options /*:Object*/) /*:Void*/ 
    {
        options = options || {};
        this.simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, 
            options.keyCode, options.charCode);    
    },
    
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