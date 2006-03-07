/**
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.10.0
* @class 
* Module is a JavaScript representation of the Standard Module Format. Standard Module Format is a simple standard for markup containers where child nodes representing the header, body, and footer of the content are denoted using the CSS classes "hd", "bd", and "ft" respectively. Module is the base class for all other classes in the YUI Container package.
* @param {string}	el	The element ID representing the Module <em>OR</em>
* @param {Element}	el	The element representing the Module
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this module. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Module = function(el, userConfig) {
	if (el) { 
		this.init(el, userConfig); 
	}
}

/**
* Constant representing the module header
* @type string
* @final
*/
YAHOO.widget.Module.CSS_HEADER = "hd";

/**
* Constant representing the module body
* @type string
* @final
*/
YAHOO.widget.Module.CSS_BODY   = "bd";

/**
* Constant representing the module footer
* @type string
* @final
*/
YAHOO.widget.Module.CSS_FOOTER = "ft";

YAHOO.widget.Module.prototype = {

	/**
	* The class's constructor function
	* @type function
	*/
	constructor : YAHOO.widget.Module,

	/**
	* The main module element that contains the header, body, and footer
	* @type Element
	*/
	element : null, 

	/**
	* The header element, denoted with CSS class "hd"
	* @type Element
	*/
	header : null,

	/**
	* The body element, denoted with CSS class "bd"
	* @type Element
	*/
	body : null,

	/**
	* The footer element, denoted with CSS class "ft"
	* @type Element
	*/
	footer : null,

	/**
	* Array of elements
	* @type Element[]
	*/
	childNodesInDOM : null,

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initEvents : function() {
		this.appendEvent		= new YAHOO.util.CustomEvent("append");
		this.beforeRenderEvent	= new YAHOO.util.CustomEvent("beforeRender");
		this.renderEvent		= new YAHOO.util.CustomEvent("render");

		this.changeHeaderEvent	= new YAHOO.util.CustomEvent("changeHeader");
		this.changeBodyEvent	= new YAHOO.util.CustomEvent("changeBody");
		this.changeFooterEvent	= new YAHOO.util.CustomEvent("changeFooter");

		this.changeContentEvent = new YAHOO.util.CustomEvent("changeContent");

		this.destroyEvent		= new YAHOO.util.CustomEvent("destroy");
		this.beforeShowEvent	= new YAHOO.util.CustomEvent("beforeShow", this);
		this.showEvent			= new YAHOO.util.CustomEvent("show", this);
		this.beforeHideEvent	= new YAHOO.util.CustomEvent("beforeHide", this);
		this.hideEvent			= new YAHOO.util.CustomEvent("hide", this);
	}, 

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initDefaultConfig : function() {
		this.cfg = new YAHOO.util.Config(this);

		// Add properties //
		this.cfg.addProperty("visible", null, this.configVisible, this.cfg.checkBoolean, this.element, true);
	},

	/**
	* The Module class's initialization method, which is executed for Module and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
	* @param {string}	el	The element ID representing the Module <em>OR</em>
	* @param {Element}	el	The element representing the Module
	* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this module. See configuration documentation for more details.
	*/
	init : function(el, userConfig) {

		if (typeof el == "string")
		{
			var elId = el;

			el = document.getElementById(el);
			if (! el)
			{
				el = document.createElement("DIV");
				el.id = elId;
			}
		}

		this.element = el;
		this.id = el.id;
		
		this.childNodesInDOM = [null,null,null];

		var childNodes = this.element.childNodes;

		if (childNodes)
		{
			for (var i=0;i<childNodes.length;i++)
			{
				var child = childNodes[i];
				switch (child.className)
				{
					case YAHOO.widget.Module.CSS_HEADER:
						this.header = child;
						this.childNodesInDOM[0] = child;
						break;
					case YAHOO.widget.Module.CSS_BODY:
						this.body = child;
						this.childNodesInDOM[1] = child;
						break;
					case YAHOO.widget.Module.CSS_FOOTER:
						this.footer = child;
						this.childNodesInDOM[2] = child;
						break;
				}
			}
		}

		this.initEvents();
		this.initDefaultConfig();
		
		if (userConfig) {
			this.cfg.applyConfig(userConfig);
		}
	},

	/**
	* Sets the Module's header content to the HTML specified, or appends the passed element to the header. If no header is present, one will be automatically created.
	* @param {string}	headerContent	The HTML used to set the header <em>OR</em>
	* @param {Element}	headerContent	The Element to append to the header
	*/	
	setHeader : function(headerContent) {
		if (! this.header) {
			this.header = document.createElement("DIV");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}
		
		if (typeof headerContent == "string") {
			this.header.innerHTML = headerContent;
		} else {
			this.header.innerHTML = "";
			this.header.appendChild(headerContent);
		}

		this.changeHeaderEvent.fire(headerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the header. If no header is present, one will be automatically created.
	* @param {Element}	element	The element to append to the header
	*/	
	appendToHeader : function(element) {
		if (! this.header) {
			this.header = document.createElement("DIV");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}
		
		this.header.appendChild(element);
		this.changeHeaderEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's body content to the HTML specified, or appends the passed element to the body. If no body is present, one will be automatically created.
	* @param {string}	bodyContent	The HTML used to set the body <em>OR</em>
	* @param {Element}	bodyContent	The Element to append to the body
	*/		
	setBody : function(bodyContent) {
		if (! this.body) {
			this.body = document.createElement("DIV");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		if (typeof bodyContent == "string")
		{
			this.body.innerHTML = bodyContent;
		} else {
			this.body.innerHTML = "";
			this.body.appendChild(bodyContent);
		}

		this.changeBodyEvent.fire(bodyContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the body. If no body is present, one will be automatically created.
	* @param {Element}	element	The element to append to the body
	*/
	appendToBody : function(element) {
		if (! this.body) {
			this.body = document.createElement("DIV");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		this.body.appendChild(element);
		this.changeBodyEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's footer content to the HTML specified, or appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @param {string}	footerContent	The HTML used to set the footer <em>OR</em>
	* @param {Element}	footerContent	The Element to append to the footer
	*/	
	setFooter : function(footerContent) {
		if (! this.footer) {
			this.footer = document.createElement("DIV");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		if (typeof footerContent == "string")
		{
			this.footer.innerHTML = footerContent;
		} else {
			this.footer.innerHTML = "";
			this.footer.appendChild(footerContent);
		}

		this.changeFooterEvent.fire(footerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @param {Element}	element	The element to append to the footer
	*/
	appendToFooter : function(element) {
		if (! this.footer) {
			this.footer = document.createElement("DIV");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		this.footer.appendChild(element);
		this.changeFooterEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Renders the Module by inserting the elements that are not already in the main Module into their correct places. Optionally appends the Module to the specified node prior to the render's execution. NOTE: For Modules without existing markup, the appendToNode argument is REQUIRED. If this argument is ommitted and the current element is not present in the document, the function will return false, indicating that the render was a failure.
	* @param {string}	appendToNode	The element id to which the Module should be appended to prior to rendering <em>OR</em>
	* @param {Element}	appendToNode	The element to which the Module should be appended to prior to rendering	
	* @return {boolean} Success or failure of the render
	*/
	render : function(appendToNode) {
		this.beforeRenderEvent.fire();

		var me = this;
		var appendTo = function(element) {
			if (typeof element == "string") {
				element = document.getElementById(element);
			}
			
			if (element) {
				element.appendChild(me.element);
				me.appendEvent.fire();
			}
		}

		if (appendToNode) {
			if (typeof appendToNode == "string") {
				el = document.getElementById(el);
				if (! el) {
					el = document.createElement("DIV");
					el.id = elId;
				}
			}
			appendTo(appendToNode);
		} else { // No node was passed in. If the element is not pre-marked up, this fails
			if (! YAHOO.util.Dom._elementInDom(this.element)) {
				return false;
			}
		}

		// Need to get everything into the DOM if it isn't already
		
		if ((! this.childNodesInDOM[0]) && this.header) {
			// There is a header, but it's not in the DOM yet... need to add it
			var firstChild = this.element.firstChild;
			if (firstChild) { // Insert before first child if exists
				this.element.insertBefore(this.header, firstChild);
			} else { // Append to empty body because there are no children
				this.element.appendChild(this.header);
			}
		}

		if ((! this.childNodesInDOM[1]) && this.body) {
			// There is a body, but it's not in the DOM yet... need to add it
			if (this.childNodesInDOM[2]) { // Insert before footer if exists in DOM
				this.element.insertBefore(this.body, this.childNodesInDOM[2]);
			} else { // Append to element because there is no footer
				this.element.appendChild(this.body);
			}
		}

		if ((! this.childNodesInDOM[2]) && this.footer) {
			// There is a footer, but it's not in the DOM yet... need to add it
			this.element.appendChild(this.footer);
		}
		
		this.cfg.fireDeferredEvents();
		this.renderEvent.fire();

		return true;
	},

	/**
	* Removes the Module element from the DOM and sets all child elements to null.
	*/
	destroy : function() {
		if (this.element) {
			var parent = this.element.parentNode;
		}
		if (parent) {
			parent.removeChild(this.element);
		}

		this.element = null;
		this.header = null;
		this.body = null;
		this.footer = null;

		this.destroyEvent.fire();
	},

	/**
	* Shows the Module element by setting the visible configuration property to true. Also fires two events: beforeShowEvent prior to the visibility change, and showEvent after.
	*/
	show : function() {
		this.beforeShowEvent.fire();
		this.cfg.setProperty("visible", true);
		this.showEvent.fire();
	},

	/**
	* Hides the Module element by setting the visible configuration property to false. Also fires two events: beforeHideEvent prior to the visibility change, and hideEvent after.
	*/
	hide : function() {
		this.beforeHideEvent.fire();
		this.cfg.setProperty("visible", false);
		this.hideEvent.fire();
	},

	// BUILT-IN EVENT HANDLERS FOR MODULE //

	/**
	* Default event handler for changing the visibility property of a Module. By default, this is achieved by switching the "display" style between "block" and "none".
	*/
	configVisible : function(type, args, obj) {
		var visible = args[0];
		if (visible) {
			YAHOO.util.Dom.setStyle(this.element, "display", "block");
		} else {
			YAHOO.util.Dom.setStyle(this.element, "display", "none");
		}
	}
}