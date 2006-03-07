/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
* @class
* Dialog is an implementation of Panel that behaves like an OS dialog. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for OK/Cancel and Yes/No can be utilized.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Dialog = function(el, userConfig) {
	if (arguments.length > 0)
	{
		YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Dialog.prototype = new YAHOO.widget.Panel();
YAHOO.widget.Dialog.prototype.constructor = YAHOO.widget.Dialog;

/**
* Reference to the Dialog's superclass, Panel
* @type class
* @final
*/
YAHOO.widget.Dialog.superclass = YAHOO.widget.Panel.prototype;

/**
* Constant for the standard network icon for a blocking action
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_BLOCK = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_ALARM = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_HELP  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_INFO  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_WARN  = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_TIP   = "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/tip16_1.gif";

/**
* Initializes the class's configurable properties which can be changed using the Dialog's Config object (cfg).
*/
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //
	this.cfg.addProperty("icon",	"none",		this.configIcon);
	this.cfg.addProperty("buttons",	"none",		this.configButtons);
}

/**
* Initializes the custom events for Dialog which are fired automatically at appropriate times by the Dialog class.
*/
YAHOO.widget.Dialog.prototype.initEvents = function() {
	YAHOO.widget.Dialog.superclass.initEvents.call(this);
	this.buttonClickEvent = new YAHOO.util.CustomEvent("buttonClick", this);
}

/*
* The Dialog initialization method, which is executed for Dialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	/**
	* Built-in button set for OK/Cancel buttons
	* @type object
	*/
	this.BUTTONS_OKCANCEL = { 
				"OK": {
					handler : this.handleOKClick,
					isDefault : true
				},
				"Cancel": {
					handler : this.handleCancelClick
				} };
	/**
	* Built-in button set for Yes/No buttons
	* @type object
	*/
	this.BUTTONS_YESNO = { 
				"Yes": {
					handler : this.handleYesClick,
					isDefault : true
				},
				"No": {
					handler : this.handleNoClick
				} };

	this.showEvent.subscribe(this.focusDefault, this, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}
	
	this.cfg.applyConfig({ close:false, visible:false });
}


// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "icon" configuration property
*/
YAHOO.widget.Dialog.prototype.configIcon = function(type, args, obj) {
	var iconURL = args[0];
	if (iconURL && iconURL != "none") {
		if (! this.icon) {
			this.icon = document.createElement("DIV");

			var firstChild = this.body.firstChild;
			if (firstChild) {
				this.body.insertBefore(this.icon, firstChild);
			} else {
				this.body.appendChild(this.icon);
			}	
		} else {
			this.icon.style.display = "block";
		}
		
		this.icon.className = "icon";
		this.icon.style.backgroundImage = "url(" + iconURL + ")";
		this.icon.style.height = this.body.offsetHeight + "px";

	} else {
		if (this.icon) {
			this.icon.style.display = "none";
		}
	}
}

/**
* The default event handler for the "buttons" configuration property
*/
YAHOO.widget.Dialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSet = null;
		this.buttonSet = document.createElement("SPAN");
		this.buttonSet.className = "button-group";

		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "yesno") {
			buttons = this.BUTTONS_YESNO;
		}

		for (var text in buttons) {
			var button = buttons[text];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				//if (this.browser == "ie") {
				this.defaultHtmlButton = htmlButton;//.cloneNode(true);
				//}
			}

			htmlButton.appendChild(document.createTextNode(text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			this.buttonSet.appendChild(htmlButton);

			button.htmlButton = htmlButton;

		}
		this.setFooter(this.buttonSet);
	} else {
		if (this.buttonSet)	{
			this.buttonSet.style.display = "none";
		}
	}
	this.cfg.refireEvent("underlay");
}

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
*/
YAHOO.widget.Dialog.prototype.focusDefault = function(type, args, obj) {
	this.defaultHtmlButton.focus();
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //


/**
* The default event handler fired when the user clicks OK in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleOKClick = function(e, obj) { }

/**
* The default event handler fired when the user clicks Cancel in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleCancelClick = function(e, obj) {
	obj.hide();
}

/**
* The default event handler fired when the user clicks Yes in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleYesClick = function(e, obj) { }

/**
* The default event handler fired when the user clicks No in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the Dialog itself
*/
YAHOO.widget.Dialog.prototype.handleNoClick = function(e, obj) {
	obj.hide();
}

// END BUILT-IN DOM EVENT HANDLERS //