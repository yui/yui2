/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.12
*/

/**
* SimpleDialog is a simple implementation of Dialog that can be used to submit a single value. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @namespace YAHOO.widget
* @class SimpleDialog
* @extends YAHOO.widget.Dialog
* @constructor
* @param {String}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the SimpleDialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
*/
YAHOO.widget.SimpleDialog = function(el, userConfig) {
	YAHOO.widget.SimpleDialog.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.SimpleDialog, YAHOO.widget.Dialog);

/**
* Constant for the standard network icon for a blocking action
* @property YAHOO.widget.SimpleDialog.ICON_BLOCK
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_BLOCK = "nt/ic/ut/bsc/blck16_1.gif";

/**
* Constant for the standard network icon for alarm
* @property YAHOO.widget.SimpleDialog.ICON_ALARM
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_ALARM = "nt/ic/ut/bsc/alrt16_1.gif";

/**
* Constant for the standard network icon for help
* @property YAHOO.widget.SimpleDialog.ICON_HELP
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_HELP  = "nt/ic/ut/bsc/hlp16_1.gif";

/**
* Constant for the standard network icon for info
* @property YAHOO.widget.SimpleDialog.ICON_INFO
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_INFO  = "nt/ic/ut/bsc/info16_1.gif";

/**
* Constant for the standard network icon for warn
* @property YAHOO.widget.SimpleDialog.ICON_WARN
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_WARN  = "nt/ic/ut/bsc/warn16_1.gif";

/**
* Constant for the standard network icon for a tip
* @property YAHOO.widget.SimpleDialog.ICON_TIP
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_TIP   = "nt/ic/ut/bsc/tip16_1.gif";

/**
* Constant representing the default CSS class used for a SimpleDialog
* @property YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG = "simple-dialog";

/**
* Initializes the class's configurable properties which can be changed using the SimpleDialog's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.SimpleDialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.SimpleDialog.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //

	/**
	* Sets the informational icon for the SimpleDialog
	* @config icon
	* @type String
	* @default "none"
	*/
	this.cfg.addProperty("icon",	{ value:"none",	handler:this.configIcon, suppressEvent:true } );
	
	/**
	* Sets the text for the SimpleDialog
	* @config text
	* @type String
	* @default ""
	*/
	this.cfg.addProperty("text",	{ value:"", handler:this.configText, suppressEvent:true, supercedes:["icon"] } );
};


/**
* The SimpleDialog initialization method, which is executed for SimpleDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the SimpleDialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
*/
YAHOO.widget.SimpleDialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.SimpleDialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

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

};
/**
* Prepares the SimpleDialog's internal FORM object, creating one if one is not currently present, and adding the value hidden field.
* @method registerForm
*/
YAHOO.widget.SimpleDialog.prototype.registerForm = function() {
	YAHOO.widget.SimpleDialog.superclass.registerForm.call(this);
	this.form.innerHTML += "<input type=\"hidden\" name=\"" + this.id + "\" value=\"\"/>";
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Fired when the "icon" property is set.
* @method configIcon
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.SimpleDialog.prototype.configIcon = function(type,args,obj) {
	var icon = args[0];
	if (icon && icon != "none") {
		var iconHTML = "<img src=\"" + this.imageRoot + icon + "\" class=\"icon\" />";
		this.body.innerHTML = iconHTML + this.body.innerHTML;
	}
};

/**
* Fired when the "text" property is set.
* @method configText
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.SimpleDialog.prototype.configText = function(type,args,obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
		this.cfg.refireEvent("icon");
	}
};
// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the SimpleDialog
*/ 
YAHOO.widget.SimpleDialog.prototype.toString = function() {
	return "SimpleDialog " + this.id;
};