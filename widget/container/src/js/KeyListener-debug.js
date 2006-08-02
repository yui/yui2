/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.11.2
*/

/**
* KeyListener is a utility that provides an easy interface for listening for keydown/keyup events fired against DOM elements.
* @param {Element}	attachTo	The element or element ID to which the key event should be attached
* @param {string}	attachTo	The element or element ID to which the key event should be attached
* @param {object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
* @param {function}	handler		The CustomEvent handler to fire when the key event is detected
* @param {object}	handler		An object literal representing the handler. 
* @param {string}	event		Optional. The event (keydown or keyup) to listen for. Defaults automatically to keydown.
* @constructor
*/
YAHOO.util.KeyListener = function(attachTo, keyData, handler, event) {
	if (! attachTo) {
		YAHOO.log("No attachTo element specified", "error");
	}
	if (! keyData) {
		YAHOO.log("No keyData specified", "error");
	}
	if (! handler) {
		YAHOO.log("No handler specified", "error");
	}

	if (! event) {
		event = YAHOO.util.KeyListener.KEYDOWN;
	}

	var keyEvent = new YAHOO.util.CustomEvent("keyPressed");
	
	this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
	this.disabledEvent = new YAHOO.util.CustomEvent("disabled");

	if (typeof attachTo == 'string') {
		attachTo = document.getElementById(attachTo);
	}

	if (typeof handler == 'function') {
		keyEvent.subscribe(handler);
	} else {
		keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
	}

	/**
	* Handles the key event when a key is pressed.
	* @private
	*/
	function handleKeyPress(e, obj) {
		var keyPressed = e.charCode || e.keyCode;
		
		if (! keyData.shift) {	
			keyData.shift = false; 
		}
		if (! keyData.alt) {	
			keyData.alt = false;
		}
		if (! keyData.ctrl) {
			keyData.ctrl = false;
		}

		// check held down modifying keys first
		if (e.shiftKey == keyData.shift && 
			e.altKey   == keyData.alt &&
			e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match

			if (keyData.keys instanceof Array) {
				for (var i=0;i<keyData.keys.length;i++) {
					if (keyPressed == keyData.keys[i]) {
						keyEvent.fire(keyPressed, e);
						break;
					}
				}
			} else {
				if (keyPressed == keyData.keys) {
					keyEvent.fire(keyPressed, e);
				}
			}
		}
	}

	this.enable = function() {
		if (! this.enabled) {
			YAHOO.util.Event.addListener(attachTo, event, handleKeyPress);
			this.enabledEvent.fire(keyData);
		}
		this.enabled = true;
	};

	this.disable = function() {
		if (this.enabled) {
			YAHOO.util.Event.removeListener(attachTo, event, handleKeyPress);
			this.disabledEvent.fire(keyData);
		}
		this.enabled = false;
	};

	/**
	* Returns a string representation of the object.
	* @type string
	*/ 
	this.toString = function() {
		return "KeyListener [" + keyData.keys + "] " + attachTo.tagName + (attachTo.id ? "[" + attachTo.id + "]" : "");
	};

};

/**
* Constant representing the DOM "keydown" event.
* @final
*/
YAHOO.util.KeyListener.KEYDOWN = "keydown";

/**
* Constant representing the DOM "keyup" event.
* @final
*/
YAHOO.util.KeyListener.KEYUP = "keyup";

/**
* Boolean indicating the enabled/disabled state of the Tooltip
* @type Booleam
*/
YAHOO.util.KeyListener.prototype.enabled = null;

/**
* Enables the KeyListener, by dynamically attaching the key event to the appropriate DOM element.
*/
YAHOO.util.KeyListener.prototype.enable = function() {};

/**
* Disables the KeyListener, by dynamically removing the key event from the appropriate DOM element.
*/
YAHOO.util.KeyListener.prototype.disable = function() {};

/**
* CustomEvent fired when the KeyListener is enabled
* args: keyData
* @type YAHOO.util.CustomEvent
*/
YAHOO.util.KeyListener.prototype.enabledEvent = null;

/**
* CustomEvent fired when the KeyListener is disabled
* args: keyData
* @type YAHOO.util.CustomEvent
*/
YAHOO.util.KeyListener.prototype.disabledEvent = null;
