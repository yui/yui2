/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
* @class
* FormDialog is an implementation of Panel that can be used to submit form data. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for Submit/Cancel and OK/Cancel can be utilized. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.FormDialog = function(el, userConfig) {
	if (arguments.length > 0) {
		YAHOO.widget.FormDialog.superclass.constructor.call(this, el, userConfig);
	}
}

YAHOO.widget.FormDialog.prototype = new YAHOO.widget.Panel();
YAHOO.widget.FormDialog.prototype.constructor = YAHOO.widget.FormDialog;

/**
* Reference to the FormDialog's superclass, Panel
* @type class
* @final
*/
YAHOO.widget.FormDialog.superclass = YAHOO.widget.Panel.prototype;

/**
* Constant representing the default CSS class used for a FormDialog
* @type string
* @final
*/
YAHOO.widget.FormDialog.CSS_FORMDIALOG = "form-dialog";

/**
* Initializes the class's configurable properties which can be changed using the FormDialog's Config object (cfg).
*/
YAHOO.widget.FormDialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.FormDialog.superclass.initDefaultConfig.call(this);

	/**
	* The internally maintained callback object for use with the Connection utility
	* @type object
	* @private
	*/
	var callback = {
		success : null,
		failure : null,
		argument: null,
		scope : this
	}

	/**
	* The default handler fired when the "success" property is changed
	*/ 
	this.configOnSuccess = function(type, args, obj) {
		var fn = args[0];
		callback.success = fn;
	}

	/**
	* The default handler fired when the "failure" property is changed
	*/ 
	this.configOnFailure = function(type, args, obj) {
		var fn = args[0];
		callback.failure = fn;
	}

	/**
	* Executes a submission of the form based on the value of the postmethod property.
	*/
	this.doSubmit = function() {
		var method = this.cfg.getProperty("postmethod");
		switch (method) {
			case "async":
				YAHOO.util.Connect.setForm(this.form.name);
				var cObj = YAHOO.util.Connect.asyncRequest('POST', this.form.action, callback);
				this.asyncSubmitEvent.fire();
				break;
			case "form":
				this.form.submit();
				this.formSubmitEvent.fire();
				break;
			case "none":
				this.manualSubmitEvent.fire();
				break;
		}
	}

	// Add form dialog config properties //
	this.cfg.addProperty("postmethod", "async", null, 
												function(val) { 
													if (val != "form" && val != "async" && val != "none") {
														return false;
													} else {
														return true;
													}
												});

	this.cfg.addProperty("buttons",		"none",	this.configButtons);
	this.cfg.addProperty("onsuccess",	null,	this.configOnSuccess, null, null, true);
	this.cfg.addProperty("onfailure",	null,	this.configOnFailure, null, null, true);
}

/**
* Initializes the custom events for FormDialog which are fired automatically at appropriate times by the FormDialog class.
*/
YAHOO.widget.FormDialog.prototype.initEvents = function() {
	YAHOO.widget.FormDialog.superclass.initEvents.call(this);

	this.submitEvent		= new YAHOO.util.CustomEvent("submit");

	this.manualSubmitEvent	= new YAHOO.util.CustomEvent("manualSubmit");
	this.asyncSubmitEvent	= new YAHOO.util.CustomEvent("asyncSubmit");
	this.formSubmitEvent	= new YAHOO.util.CustomEvent("formSubmit");

	this.cancelEvent		= new YAHOO.util.CustomEvent("cancel");
}

/*
* The FormDialog initialization method, which is executed for FormDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @param {string}	el	The element ID representing the FormDialog <em>OR</em>
* @param {Element}	el	The element representing the FormDialog
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this FormDialog. See configuration documentation for more details.
*/
YAHOO.widget.FormDialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.FormDialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.FormDialog.CSS_FORMDIALOG);

	/**
	* Built-in button set for OK/Cancel buttons
	* @type Array
	*/	
	this.BUTTONS_OKCANCEL = [ 
				{	text : "OK",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "Cancel",
					handler : this.handleCancelClick
				}];

	/**
	* Built-in button set for Submit/Cancel buttons
	* @type Array
	*/
	this.BUTTONS_SUBMITCANCEL = [ 
				{	text : "Submit",
					handler : this.handleSubmitClick,
					isDefault : true
				},
				{	text : "Cancel",
					handler : this.handleCancelClick
				}];


	var me = this;

	/**
	* Reference to the form 
	* @type object
	*/
	var form = this.element.getElementsByTagName("FORM")[0];
	if (form) {
		this.form = form;
	} else {
		this.renderEvent.subscribe(function(){
												var form = this.element.getElementsByTagName("FORM")[0];
												if (form) {
													this.form = form;
													if (this.cfg.getProperty("modal")) {
														this.preventBackTab = new YAHOO.util.KeyListener(this.form[0], { shift:true, keys:9 }, {fn:me.focusLastButton, scope:me, correctScope:true});
														this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
														this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
													}
												}
											 }, this, true);
	}

	this.showEvent.subscribe(this.focusFirstField, this, true);
	this.beforeHideEvent.subscribe(this.blurButtons, this, true);

	if (userConfig) {
		this.cfg.applyConfig(userConfig);
	}

	if (this.cfg.getProperty("modal") && this.form) {
		this.preventBackTab = new YAHOO.util.KeyListener(this.form[0], { shift:true, keys:9 }, {fn:me.focusLastButton, scope:me, correctScope:true} );
		this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
		this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
	}
}


// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler for the "buttons" configuration property
*/
YAHOO.widget.FormDialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSpan = null;
		this.buttonSpan = document.createElement("SPAN");
		this.buttonSpan.className = "button-group";
		
		if (buttons == "okcancel") {
			buttons = this.BUTTONS_OKCANCEL;
		} else if (buttons == "submitcancel") {
			buttons = this.BUTTONS_SUBMITCANCEL;
		}

		for (var b=0;b<buttons.length;b++) {
			var button = buttons[b];
			var htmlButton = document.createElement("BUTTON");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(button.text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this);
			
			var me = this;

			if (b == (buttons.length-1)) {
				if (this.cfg.getProperty("modal")) {
					this.restrictFocus = new YAHOO.util.KeyListener(htmlButton, { shift:false, keys:9 }, {fn:me.focusFirstField,scope:me,correctScope:true} );
					this.showEvent.subscribe(this.restrictFocus.enable, this.restrictFocus, true);
					this.hideEvent.subscribe(this.restrictFocus.disable, this.restrictFocus, true);
					this.restrictFocus.enable();
				}
			}

			this.buttonSpan.appendChild(htmlButton);		
			button.htmlButton = htmlButton;
		}

		this.setFooter(this.buttonSpan);
	} else {
		if (this.buttonSpan)	{
			this.buttonSpan.style.display = "none";
		}
	}
	this.cfg.refireEvent("iframe");
	this.cfg.refireEvent("underlay");
}

/**
* The default event handler used to focus the first field of the form when the FormDialog is shown.
*/
YAHOO.widget.FormDialog.prototype.focusFirstField = function(type, args, obj) {
	if (this.form) {
		this.form[0].focus();
	}
}

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
*/
YAHOO.widget.FormDialog.prototype.focusDefault = function() {
	this.defaultHtmlButton.focus();
}

/**
* Blurs all the html buttons
*/
YAHOO.widget.FormDialog.prototype.blurButtons = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.blur();
	}
}

/**
* Sets the focus to the first button in the button list
*/
YAHOO.widget.FormDialog.prototype.focusFirstButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[0].htmlButton;
		html.focus();
	}
}
/**
* Sets the focus to the last button in the button list
*/
YAHOO.widget.FormDialog.prototype.focusLastButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons) {
		var html = buttons[buttons.length-1].htmlButton;
		html.focus();
	}
}

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //

/**
* The default event handler fired when the user clicks OK or Submit in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the FormDialog itself
*/
YAHOO.widget.FormDialog.prototype.handleSubmitClick = function(e, obj) { 
	obj.submit();
}

/**
* The default event handler fired when the user clicks Cancel in the built-in button set
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument, in this case, the FormDialog itself
*/
YAHOO.widget.FormDialog.prototype.handleCancelClick = function(e, obj) {
	obj.cancel();
}

// END BUILT-IN DOM EVENT HANDLERS //

/**
* Built-in function hook for writing a validation function that will be checked for a "true" value prior to a submit. This function, as implemented by default, always returns true, so it should be overridden if validation is necessary.
*/
YAHOO.widget.FormDialog.prototype.validate = function() {
	return true;
}

/**
* Executes a submit of the FormDialog followed by a hide, if validation is successful.
*/
YAHOO.widget.FormDialog.prototype.submit = function() {
	if (this.validate()) {
		this.doSubmit();
		this.submitEvent.fire();
		this.hide();
		return true;
	} else {
		return false;
	}
}

/**
* Executes the cancel of the FormDialog followed by a hide.
*/
YAHOO.widget.FormDialog.prototype.cancel = function() {
	this.cancelEvent.fire();
	this.hide();	
}

/**
* Returns a JSON data structure representing the data currently contained in the form.
* @return {object} A JSON object reprsenting the data of the current form.
*/
YAHOO.widget.FormDialog.prototype.getData = function() {
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
									data[i] = formItem.value;
									break;
							}
							break;
						case "TEXTAREA":
							data[i] = formItem.value;
							break;
						case "SELECT":
							var val = new Array();
							for (var x=0;x<formItem.options.length;x++)	{
								var option = formItem.options[x];
								if (option.selected) {
									var selval = option.value;
									if (! selval || selval == "") {
										selval = option.text;
									}
									val[val.length] = selval;
								}
							}
							data[i] = val;
							break;
					}
				} else if (formItem[0] && formItem[0].tagName) { // this is an array of form items
					switch (formItem[0].tagName) {
						case"INPUT" :
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
									var cbArray = new Array();
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
}