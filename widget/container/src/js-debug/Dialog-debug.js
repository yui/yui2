/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.12
*/

/**
* Dialog is an implementation of Panel that can be used to submit form data. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for Submit/Cancel and OK/Cancel can be utilized. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @namespace YAHOO.widget
* @class Dialog
* @extends YAHOO.widget.Panel
* @constructor
* @param {String}	el	The element ID representing the Dialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the Dialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Dialog, YAHOO.widget.Panel);

/**
* Constant representing the default CSS class used for a Dialog
* @property YAHOO.widget.Dialog.CSS_DIALOG
* @static
* @final
* @type String
*/
YAHOO.widget.Dialog.CSS_DIALOG = "dialog";

/**
* Initializes the class's configurable properties which can be changed using the Dialog's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);

	/**
	* The internally maintained callback object for use with the Connection utility
	* @property callback
	* @type Object
	*/
	this.callback = {
		/**
		* The function to execute upon success of the Connection submission
		* @property callback.success
		* @type Function
		*/
		success : null,
		/**
		* The function to execute upon failure of the Connection submission
		* @property callback.failure
		* @type Function
		*/
		failure : null,
		/**
		* The arbitraty argument or arguments to pass to the Connection callback functions
		* @property callback.argument
		* @type Object
		*/
		argument: null
	};

	// Add form dialog config properties //
	
	/**
	* The method to use for posting the Dialog's form. Possible values are "async", "form", and "manual".
	* @config postmethod 
	* @type String
	* @default async
	*/
	this.cfg.addProperty("postmethod", { value:"async", validator:function(val) { 
													if (val != "form" && val != "async" && val != "none" && val != "manual") {
														return false;
													} else {
														return true;
													}
												} });

	/**
	* Object literal(s) defining the buttons for the Dialog's footer.
	* @config buttons
	* @type Object[]
	* @default "none"
	*/
	this.cfg.addProperty("buttons",		{ value:"none",	handler:this.configButtons } );
};

/**
* Initializes the custom events for Dialog which are fired automatically at appropriate times by the Dialog class.
* @method initEvents
*/
YAHOO.widget.Dialog.prototype.initEvents = function() {
	YAHOO.widget.Dialog.superclass.initEvents.call(this);

	/**
	* CustomEvent fired prior to submission
	* @event beforeSumitEvent
	*/	
	this.beforeSubmitEvent	= new YAHOO.util.CustomEvent("beforeSubmit");
	
	/**
	* CustomEvent fired after submission
	* @event submitEvent
	*/
	this.submitEvent		= new YAHOO.util.CustomEvent("submit");

	/**
	* CustomEvent fired prior to manual submission
	* @event manualSubmitEvent
	*/
	this.manualSubmitEvent	= new YAHOO.util.CustomEvent("manualSubmit");

	/**
	* CustomEvent fired prior to asynchronous submission
	* @event asyncSubmitEvent
	*/	
	this.asyncSubmitEvent	= new YAHOO.util.CustomEvent("asyncSubmit");

	/**
	* CustomEvent fired prior to form-based submission
	* @event formSubmitEvent
	*/
	this.formSubmitEvent	= new YAHOO.util.CustomEvent("formSubmit");

	/**
	* CustomEvent fired after cancel
	* @event cancelEvent
	*/
	this.cancelEvent		= new YAHOO.util.CustomEvent("cancel");
};

/**
* The Dialog initialization method, which is executed for Dialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the Dialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the Dialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level
	
	this.beforeInitEvent.fire(YAHOO.widget.Dialog);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Dialog.CSS_DIALOG);

	this.cfg.setProperty("visible", false);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	this.renderEvent.subscribe(this.registerForm, this, true);

	this.showEvent.subscribe(this.focusFirst, this, true);
	this.beforeHideEvent.subscribe(this.blurButtons, this, true);

	this.beforeRenderEvent.subscribe(function() {
		var buttonCfg = this.cfg.getProperty("buttons");
		if (buttonCfg && buttonCfg != "none") {
			if (! this.footer) {
				this.setFooter("");
			}
		}
	}, this, true);

	this.initEvent.fire(YAHOO.widget.Dialog);
};

/**
* Performs the submission of the Dialog form depending on the value of "postmethod" property.
* @method doSubmit
*/
YAHOO.widget.Dialog.prototype.doSubmit = function() {
	var pm = this.cfg.getProperty("postmethod");
	switch (pm) {
		case "async":
			var method = this.form.getAttribute("method") || 'POST';
			method = method.toUpperCase();
			YAHOO.util.Connect.setForm(this.form);
			var cObj = YAHOO.util.Connect.asyncRequest(method, this.form.getAttribute("action"), this.callback);
			this.asyncSubmitEvent.fire();
			break;
		case "form":
			this.form.submit();
			this.formSubmitEvent.fire();
			break;
		case "none":
		case "manual":
			this.manualSubmitEvent.fire();
			break;
	}
};

/**
* Prepares the Dialog's internal FORM object, creating one if one is not currently present.
* @method registerForm
*/
YAHOO.widget.Dialog.prototype.registerForm = function() {
	var form = this.element.getElementsByTagName("FORM")[0];

	if (! form) {
		var formHTML = "<form name=\"frm_" + this.id + "\" action=\"\"></form>";
		this.body.innerHTML += formHTML;
		form = this.element.getElementsByTagName("FORM")[0];
	}

	this.firstFormElement = function() {
		for (var f=0;f<form.elements.length;f++ ) {
			var el = form.elements[f];
			if (el.focus) {
				if (el.type && el.type != "hidden") {
					return el;
				}
			}
		}
		return null;
	}();

	this.lastFormElement = function() {
		for (var f=form.elements.length-1;f>=0;f-- ) {
			var el = form.elements[f];
			if (el.focus) {
				if (el.type && el.type != "hidden") {
					return el;
				}
			}
		}
		return null;
	}();

	this.form = form;

	if (this.cfg.getProperty("modal") && this.form) {

		var me = this;
		
		var firstElement = this.firstFormElement || this.firstButton;
		if (firstElement) {
			this.preventBackTab = new YAHOO.util.KeyListener(firstElement, { shift:true, keys:9 }, {fn:me.focusLast, scope:me, correctScope:true} );
			this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
			this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
		}

		var lastElement = this.lastButton || this.lastFormElement;
		if (lastElement) {
			this.preventTabOut = new YAHOO.util.KeyListener(lastElement, { shift:false, keys:9 }, {fn:me.focusFirst, scope:me, correctScope:true} );
			this.showEvent.subscribe(this.preventTabOut.enable, this.preventTabOut, true);
			this.hideEvent.subscribe(this.preventTabOut.disable, this.preventTabOut, true);
		}
	}
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "buttons" configuration property
* @method configButtons
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Dialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSpan = null;
		this.buttonSpan = document.createElement("SPAN");
		this.buttonSpan.className = "button-group";

		for (var b=0;b<buttons.length;b++) {
			var button = buttons[b];

			var htmlButton = document.createElement("BUTTON");
			htmlButton.setAttribute("type", "button");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(button.text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this, true);

			this.buttonSpan.appendChild(htmlButton);		
			button.htmlButton = htmlButton;

			if (b === 0) {
				this.firstButton = button.htmlButton;
			}

			if (b == (buttons.length-1)) {
				this.lastButton = button.htmlButton;
			}

		}

		this.setFooter(this.buttonSpan);

		this.cfg.refireEvent("iframe");
		this.cfg.refireEvent("underlay");
	} else { // Do cleanup
		if (this.buttonSpan) {
			if (this.buttonSpan.parentNode) {
				this.buttonSpan.parentNode.removeChild(this.buttonSpan);
			}

			this.buttonSpan = null;
			this.firstButton = null;
			this.lastButton = null;
			this.defaultHtmlButton = null;
		}
	}
};


/**
* The default event handler used to focus the first field of the form when the Dialog is shown.
* @method focusFirst
*/
YAHOO.widget.Dialog.prototype.focusFirst = function(type,args,obj) {
	if (args) {
		var e = args[1];
		if (e) {
			YAHOO.util.Event.stopEvent(e);
		}
	}

	if (this.firstFormElement) {
		this.firstFormElement.focus();
	} else {
		this.focusDefaultButton();
	}
};

/**
* Sets the focus to the last button in the button or form element in the Dialog
* @method focusLast
*/
YAHOO.widget.Dialog.prototype.focusLast = function(type,args,obj) {
	if (args) {
		var e = args[1];
		if (e) {
			YAHOO.util.Event.stopEvent(e);
		}
	}

	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		this.focusLastButton();
	} else {
		if (this.lastFormElement) {
			this.lastFormElement.focus();
		}
	}
};

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
* @method focusDefaultButton
*/
YAHOO.widget.Dialog.prototype.focusDefaultButton = function() {
	if (this.defaultHtmlButton) {
		this.defaultHtmlButton.focus();
	}
};

/**
* Blurs all the html buttons
* @method blurButtons
*/
YAHOO.widget.Dialog.prototype.blurButtons = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[0].htmlButton;
		if (html) {
			html.blur();
		}
	}
};

/**
* Sets the focus to the first button in the button list
* @method focusFirstButton
*/
YAHOO.widget.Dialog.prototype.focusFirstButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[0].htmlButton;
		if (html) {
			html.focus();
		}
	}
};

/**
* Sets the focus to the first button in the button list
* @method focusLastButton
*/
YAHOO.widget.Dialog.prototype.focusLastButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[buttons.length-1].htmlButton;
		if (html) {
			html.focus();
		}
	}
};

// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Built-in function hook for writing a validation function that will be checked for a "true" value prior to a submit. This function, as implemented by default, always returns true, so it should be overridden if validation is necessary.
* @method validate
*/
YAHOO.widget.Dialog.prototype.validate = function() {
	return true;
};

/**
* Executes a submit of the Dialog followed by a hide, if validation is successful.
* @method submit
*/
YAHOO.widget.Dialog.prototype.submit = function() {
	if (this.validate()) {
		this.beforeSubmitEvent.fire();
		this.doSubmit();
		this.submitEvent.fire();
		this.hide();
		return true;
	} else {
		return false;
	}
};

/**
* Executes the cancel of the Dialog followed by a hide.
* @method cancel
*/
YAHOO.widget.Dialog.prototype.cancel = function() {
	this.cancelEvent.fire();
	this.hide();	
};

/**
* Returns a JSON-compatible data structure representing the data currently contained in the form.
* @method getData
* @return {Object} A JSON object reprsenting the data of the current form.
*/
YAHOO.widget.Dialog.prototype.getData = function() {
	var form = this.form;
	var data = {};

	if (form) {
		for (var i in this.form) {
			var formItem = form[i];
			if (formItem) {
				if (formItem.tagName) { // Got a single form item
					switch (formItem.tagName) {
						case "INPUT":
							switch (formItem.type) {
								case "checkbox": 
									data[i] = formItem.checked;
									break;
								case "textbox":
								case "text":
								case "hidden":
									data[i] = formItem.value;
									break;
							}
							break;
						case "TEXTAREA":
							data[i] = formItem.value;
							break;
						case "SELECT":
							var val = [];
							for (var x=0;x<formItem.options.length;x++)	{
								var option = formItem.options[x];
								if (option.selected) {
									var selval = option.value;
									if (! selval || selval === "") {
										selval = option.text;
									}
									val[val.length] = selval;
								}
							}
							data[i] = val;
							break;
					}
				} else if (formItem[0] && formItem[0].tagName) { // this is an array of form items
					if (formItem[0].tagName == "INPUT") {
						switch (formItem[0].type) {
							case "radio":
								for (var r=0; r<formItem.length; r++) {
									var radio = formItem[r];
									if (radio.checked) {
										data[radio.name] = radio.value;
										break;
									}
								}
								break;
							case "checkbox":
								var cbArray = [];
								for (var c=0; c<formItem.length; c++) {
									var check = formItem[c];
									if (check.checked) {
										cbArray[cbArray.length] = check.value;
									}
								}
								data[formItem[0].name] = cbArray;
								break;
						}
					}
				}
			}
		}	
	}
	return data;
};

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the Dialog
*/ 
YAHOO.widget.Dialog.prototype.toString = function() {
	return "Dialog " + this.id;
};