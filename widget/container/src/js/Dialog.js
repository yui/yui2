/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* Dialog is a simple implementation of FormDialog that can be used to submit a single value. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Dialog = function(el, userConfig) {
	if (arguments.length > 0) {
		YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.Dialog.prototype = new YAHOO.widget.FormDialog();
YAHOO.widget.Dialog.prototype.constructor = YAHOO.widget.Dialog;

/**
* Reference to the Dialog's superclass, FormDialog
* @type class
* @final
*/
YAHOO.widget.Dialog.superclass = YAHOO.widget.FormDialog.prototype;

/**
* Constant for the standard network icon for a blocking action
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_BLOCK = "nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_ALARM = "nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_HELP  = "nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_INFO  = "nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_WARN  = "nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @type string
* @final
*/
YAHOO.widget.Dialog.ICON_TIP   = "nt/ic/ut/bsc/tip16_1.gif";

/**
* Constant representing the default CSS class used for a Dialog
* @type string
* @final
*/
YAHOO.widget.Dialog.CSS_DIALOG = "dialog";

/**
* Initializes the class's configurable properties which can be changed using the Dialog's Config object (cfg).
*/
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //
	this.cfg.addProperty("icon",	{ value:"none",	handler:this.configIcon, suppressEvent:true } );
	this.cfg.addProperty("text",	{ value:"", handler:this.configText, suppressEvent:true, supercedes:["icon"] } );
}


/*
* The Dialog initialization method, which is executed for Dialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the Dialog <em>OR</em>
* @param {Element}	el	The element representing the Dialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Dialog.CSS_DIALOG);

	this.cfg.queueProperty("postmethod", "manual");

	if (userConfig) {
		this.cfg.applyConfig(userConfig);
	}

	this.beforeRenderEvent.subscribe(function() {
		if (! this.body) {
			this.setBody("");
		}
	}, this, true);

}
/**
* Prepares the Dialog's internal FORM object, creating one if one is not currently present, and adding the value hidden field.
*/
YAHOO.widget.Dialog.prototype.registerForm = function() {
	YAHOO.widget.Dialog.superclass.registerForm.call(this);
	this.form.innerHTML += "<input type=\"hidden\" name=\"" + this.id + "\" value=\"\"/>";
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Fired when the "icon" property is set.
*/
YAHOO.widget.Dialog.prototype.configIcon = function(type,args,obj) {
	var icon = args[0];
	if (icon && icon != "none") {
		var iconHTML = "<img src=\"" + this.imageRoot + icon + "\" class=\"icon\" />";
		this.body.innerHTML = iconHTML + this.body.innerHTML;
	}
}

/**
* Fired when the "text" property is set.
*/
YAHOO.widget.Dialog.prototype.configText = function(type,args,obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
	}
}
// END BUILT-IN PROPERTY EVENT HANDLERS //
