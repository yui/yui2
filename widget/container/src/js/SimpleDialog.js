/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* SimpleDialog is a simple implementation of Dialog that can be used to submit a single value. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @param {string}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {Element}	el	The element representing the SimpleDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.SimpleDialog = function(el, userConfig) {
	if (arguments.length > 0) {
		this.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.SimpleDialog.prototype = new YAHOO.widget.Dialog();
YAHOO.widget.SimpleDialog.prototype.constructor = YAHOO.widget.SimpleDialog;

/**
* Reference to the SimpleDialog's superclass, Dialog
* @type class
* @final
*/
YAHOO.widget.SimpleDialog.prototype.superclass = YAHOO.widget.Dialog.prototype;

/**
* Constant for the standard network icon for a blocking action
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_BLOCK = "nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_ALARM = "nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_HELP  = "nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_INFO  = "nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_WARN  = "nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.ICON_TIP   = "nt/ic/ut/bsc/tip16_1.gif";

/**
* Constant representing the default CSS class used for a SimpleDialog
* @type string
* @final
*/
YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG = "simple-dialog";

/**
* Initializes the class's configurable properties which can be changed using the SimpleDialog's Config object (cfg).
*/
YAHOO.widget.SimpleDialog.prototype.initDefaultConfig = function() {
	this.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //
	this.cfg.addProperty("icon",	{ value:"none",	handler:this.configIcon, suppressEvent:true } );
	this.cfg.addProperty("text",	{ value:"", handler:this.configText, suppressEvent:true, supercedes:["icon"] } );
}


/*
* The SimpleDialog initialization method, which is executed for SimpleDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {Element}	el	The element representing the SimpleDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
*/
YAHOO.widget.SimpleDialog.prototype.init = function(el, userConfig) {
	this.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.beforeInitEvent.fire(YAHOO.widget.SimpleDialog);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG);

	this.cfg.queueProperty("postmethod", "manual");

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	this.beforeRenderEvent.subscribe(function() {
		if (! this.body) {
			this.setBody("");
		}
	}, this, true);

	this.initEvent.fire(YAHOO.widget.SimpleDialog);

}
/**
* Prepares the SimpleDialog's internal FORM object, creating one if one is not currently present, and adding the value hidden field.
*/
YAHOO.widget.SimpleDialog.prototype.registerForm = function() {
	this.superclass.registerForm.call(this);
	this.form.innerHTML += "<input type=\"hidden\" name=\"" + this.id + "\" value=\"\"/>";
}

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Fired when the "icon" property is set.
*/
YAHOO.widget.SimpleDialog.prototype.configIcon = function(type,args,obj) {
	var icon = args[0];
	if (icon && icon != "none") {
		var iconHTML = "<img src=\"" + this.imageRoot + icon + "\" class=\"icon\" />";
		this.body.innerHTML = iconHTML + this.body.innerHTML;
	}
}

/**
* Fired when the "text" property is set.
*/
YAHOO.widget.SimpleDialog.prototype.configText = function(type,args,obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
		this.cfg.refireEvent("icon");
	}
}
// END BUILT-IN PROPERTY EVENT HANDLERS //
