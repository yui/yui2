/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.12
*/

/**
*  The Container family of components is designed to enable developers to create different kinds of content-containing modules on the web. Module and Overlay are the most basic containers, and they can be used directly or extended to build custom containers. Also part of the Container family are four UI controls that extend Module and Overlay: Tooltip, Panel, Dialog, and SimpleDialog.
* @module container
* @title Container
* @requires yahoo,dom,event,dragdrop,animation
*/

/**
* Module is a JavaScript representation of the Standard Module Format. Standard Module Format is a simple standard for markup containers where child nodes representing the header, body, and footer of the content are denoted using the CSS classes "hd", "bd", and "ft" respectively. Module is the base class for all other classes in the YUI Container package.
* @namespace YAHOO.widget
* @class Module
* @constructor
* @param {String} el			The element ID representing the Module <em>OR</em>
* @param {HTMLElement} el		The element representing the Module
* @param {Object} userConfig	The configuration Object literal containing the configuration that should be set for this module. See configuration documentation for more details.
*/
YAHOO.widget.Module = function(el, userConfig) {
	if (el) { 
		this.init(el, userConfig); 
	}
};

/**
* Constant representing the prefix path to use for non-secure images
* @property YAHOO.widget.Module.IMG_ROOT
* @static
* @final
* @type String
*/
YAHOO.widget.Module.IMG_ROOT = "http://us.i1.yimg.com/us.yimg.com/i/";

/**
* Constant representing the prefix path to use for securely served images
* @property YAHOO.widget.Module.IMG_ROOT_SSL
* @static
* @final
* @type String
*/
YAHOO.widget.Module.IMG_ROOT_SSL = "https://a248.e.akamai.net/sec.yimg.com/i/";

/**
* Constant for the default CSS class name that represents a Module
* @property YAHOO.widget.Module.CSS_MODULE
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_MODULE = "module";

/**
* Constant representing the module header
* @property YAHOO.widget.Module.CSS_HEADER
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_HEADER = "hd";

/**
* Constant representing the module body
* @property YAHOO.widget.Module.CSS_BODY
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_BODY = "bd";

/**
* Constant representing the module footer
* @property YAHOO.widget.Module.CSS_FOOTER
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_FOOTER = "ft";

/**
* Constant representing the url for the "src" attribute of the iframe used to monitor changes to the browser's base font size
* @property YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL
* @static
* @final
* @type String
*/
YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL = "javascript:false;";

YAHOO.widget.Module.prototype = {
	/**
	* The class's constructor function
	* @property contructor
	* @type Function
	*/
	constructor : YAHOO.widget.Module,

	/**
	* The main module element that contains the header, body, and footer
	* @property element
	* @type HTMLElement
	*/
	element : null, 

	/**
	* The header element, denoted with CSS class "hd"
	* @property header
	* @type HTMLElement
	*/
	header : null,

	/**
	* The body element, denoted with CSS class "bd"
	* @property body
	* @type HTMLElement
	*/
	body : null,

	/**
	* The footer element, denoted with CSS class "ft"
	* @property footer
	* @type HTMLElement
	*/
	footer : null,

	/**
	* The id of the element
	* @property id
	* @type String
	*/
	id : null,

	/**
	* The String representing the image root
	* @property imageRoot
	* @type String
	*/
	imageRoot : YAHOO.widget.Module.IMG_ROOT,
		
	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	* @method initEvents
	*/
	initEvents : function() {

		/**
		* CustomEvent fired prior to class initalization.
		* @event beforeInitEvent
		* @param {class} classRef	class reference of the initializing class, such as this.beforeInitEvent.fire(YAHOO.widget.Module)
		*/
		this.beforeInitEvent = new YAHOO.util.CustomEvent("beforeInit");

		/**
		* CustomEvent fired after class initalization.
		* @event initEvent
		* @param {class} classRef	class reference of the initializing class, such as this.beforeInitEvent.fire(YAHOO.widget.Module)
		*/		
		this.initEvent = new YAHOO.util.CustomEvent("init");

		/**
		* CustomEvent fired when the Module is appended to the DOM
		* @event appendEvent
		*/
		this.appendEvent = new YAHOO.util.CustomEvent("append");

		/**
		* CustomEvent fired before the Module is rendered
		* @event beforeRenderEvent
		*/
		this.beforeRenderEvent = new YAHOO.util.CustomEvent("beforeRender");

		/**
		* CustomEvent fired after the Module is rendered
		* @event renderEvent
		*/
		this.renderEvent = new YAHOO.util.CustomEvent("render");
	
		/**
		* CustomEvent fired when the header content of the Module is modified
		* @event changeHeaderEvent
		* @param {String/HTMLElement} content	String/element representing the new header content
		*/
		this.changeHeaderEvent = new YAHOO.util.CustomEvent("changeHeader");
		
		/**
		* CustomEvent fired when the body content of the Module is modified
		* @event changeBodyEvent
		* @param {String/HTMLElement} content	String/element representing the new body content
		*/		
		this.changeBodyEvent = new YAHOO.util.CustomEvent("changeBody");
		
		/**
		* CustomEvent fired when the footer content of the Module is modified
		* @event changeFooterEvent
		* @param {String/HTMLElement} content	String/element representing the new footer content
		*/
		this.changeFooterEvent = new YAHOO.util.CustomEvent("changeFooter");

		/**
		* CustomEvent fired when the content of the Module is modified
		* @event changeContentEvent
		*/
		this.changeContentEvent = new YAHOO.util.CustomEvent("changeContent");

		/**
		* CustomEvent fired when the Module is destroyed
		* @event destroyEvent
		*/
		this.destroyEvent = new YAHOO.util.CustomEvent("destroy");
		
		/**
		* CustomEvent fired before the Module is shown
		* @event beforeShowEvent
		*/
		this.beforeShowEvent = new YAHOO.util.CustomEvent("beforeShow");

		/**
		* CustomEvent fired after the Module is shown
		* @event showEvent
		*/
		this.showEvent = new YAHOO.util.CustomEvent("show");

		/**
		* CustomEvent fired before the Module is hidden
		* @event beforeHideEvent
		*/
		this.beforeHideEvent = new YAHOO.util.CustomEvent("beforeHide");

		/**
		* CustomEvent fired after the Module is hidden
		* @event hideEvent
		*/
		this.hideEvent = new YAHOO.util.CustomEvent("hide");
	}, 

	/**
	* String representing the current user-agent platform
	* @property platform
	* @type String
	*/
	platform : function() {
					var ua = navigator.userAgent.toLowerCase();
					if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
						return "windows";
					} else if (ua.indexOf("macintosh") != -1) {
						return "mac";
					} else {
						return false;
					}
				}(),

	/**
	* String representing the current user-agent browser
	* @property browser
	* @type String
	*/
	browser : function() {
			var ua = navigator.userAgent.toLowerCase();
				  if (ua.indexOf('opera')!=-1) { // Opera (check first in case of spoof)
					 return 'opera';
				  } else if (ua.indexOf('msie 7')!=-1) { // IE7
					 return 'ie7';
				  } else if (ua.indexOf('msie') !=-1) { // IE
					 return 'ie';
				  } else if (ua.indexOf('safari')!=-1) { // Safari (check before Gecko because it includes "like Gecko")
					 return 'safari';
				  } else if (ua.indexOf('gecko') != -1) { // Gecko
					 return 'gecko';
				  } else {
					 return false;
				  }
			}(),

	/**
	* Boolean representing whether or not the current browsing context is secure (https)
	* @property isSecure
	* @type Boolean
	*/
	isSecure : function() {
		if (window.location.href.toLowerCase().indexOf("https") === 0) {
			return true;
		} else {
			return false;
		}
	}(),

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initDefaultConfig : function() {
		// Add properties //
		
		/**
		* Specifies whether the Module is visible on the page.
		* @config visible
		* @type Boolean
		* @default true
		*/
		this.cfg.addProperty("visible", { value:true, handler:this.configVisible, validator:this.cfg.checkBoolean } );
		
		/**
		* Object or array of objects representing the ContainerEffect classes that are active for animating the container.
		* @config effect
		* @type Object
		* @default null
		*/
		this.cfg.addProperty("effect", { suppressEvent:true, supercedes:["visible"] } );
		
		/**
		* Specifies whether to create a special proxy iframe to monitor for user font resizing in the document
		* @config monitorresize
		* @type Boolean
		* @default true
		*/
		this.cfg.addProperty("monitorresize", { value:true, handler:this.configMonitorResize } );
	},

	/**
	* The Module class's initialization method, which is executed for Module and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
	* @method init
	* @param {String}	el	The element ID representing the Module <em>OR</em>
	* @param {HTMLElement}	el	The element representing the Module
	* @param {Object}	userConfig	The configuration Object literal containing the configuration that should be set for this module. See configuration documentation for more details.
	*/
	init : function(el, userConfig) {

		this.initEvents();

		this.beforeInitEvent.fire(YAHOO.widget.Module);

		/**
		* The Module's Config object used for monitoring configuration properties.
		* @property cfg
		* @type YAHOO.util.Config
		*/
		this.cfg = new YAHOO.util.Config(this);
		
		if (this.isSecure) {
			this.imageRoot = YAHOO.widget.Module.IMG_ROOT_SSL;
		}

		if (typeof el == "string") {
			var elId = el;

			el = document.getElementById(el);
			if (! el) {
				el = document.createElement("DIV");
				el.id = elId;
			}
		}

		this.element = el;
		
		if (el.id) {
			this.id = el.id;
		} 

		var childNodes = this.element.childNodes;

		if (childNodes) {
			for (var i=0;i<childNodes.length;i++) {
				var child = childNodes[i];
				switch (child.className) {
					case YAHOO.widget.Module.CSS_HEADER:
						this.header = child;
						break;
					case YAHOO.widget.Module.CSS_BODY:
						this.body = child;
						break;
					case YAHOO.widget.Module.CSS_FOOTER:
						this.footer = child;
						break;
				}
			}
		}

		this.initDefaultConfig();

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Module.CSS_MODULE);

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}

		// Subscribe to the fireQueue() method of Config so that any queued configuration changes are
		// excecuted upon render of the Module
		if (! YAHOO.util.Config.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
			this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true);
		}

		this.initEvent.fire(YAHOO.widget.Module);
	},

	/**
	* Initialized an empty IFRAME that is placed out of the visible area that can be used to detect text resize.
	* @method initResizeMonitor
	*/
	initResizeMonitor : function() {

        if(this.browser != "opera") {

            var resizeMonitor = document.getElementById("_yuiResizeMonitor");
    
            if (! resizeMonitor) {
    
                resizeMonitor = document.createElement("iframe");
    
                var bIE = (this.browser.indexOf("ie") === 0);
    
                if(this.isSecure && 
                   YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL && 
                   bIE) {
    
                  resizeMonitor.src = 
                       YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL;
    
                }                

                resizeMonitor.id = "_yuiResizeMonitor";
                resizeMonitor.style.visibility = "hidden";
                
                document.body.appendChild(resizeMonitor);
    
                resizeMonitor.style.width = "10em";
                resizeMonitor.style.height = "10em";
                resizeMonitor.style.position = "absolute";
                
                var nLeft = -1 * resizeMonitor.offsetWidth,
                    nTop = -1 * resizeMonitor.offsetHeight;
    
                resizeMonitor.style.top = nTop + "px";
                resizeMonitor.style.left =  nLeft + "px";
                resizeMonitor.style.borderStyle = "none";
                resizeMonitor.style.borderWidth = "0";
                YAHOO.util.Dom.setStyle(resizeMonitor, "opacity", "0");
                
                resizeMonitor.style.visibility = "visible";
    
                if(!bIE) {
    
                    var doc = resizeMonitor.contentWindow.document;
    
                    doc.open();
                    doc.close();
                
                }
    
            }
    
            if(resizeMonitor && resizeMonitor.contentWindow) {
    
                this.resizeMonitor = resizeMonitor;
    
                YAHOO.util.Event.addListener(this.resizeMonitor.contentWindow, "resize", this.onDomResize, this, true);
    
            }
        
        }

	},

	/**
	* Event handler fired when the resize monitor element is resized.
	* @method onDomResize
	* @param {DOMEvent} e	The DOM resize event
	* @param {Object} obj	The scope object passed to the handler
	*/
	onDomResize : function(e, obj) { 

        var nLeft = -1 * this.resizeMonitor.offsetWidth,
            nTop = -1 * this.resizeMonitor.offsetHeight;
        
        this.resizeMonitor.style.top = nTop + "px";
        this.resizeMonitor.style.left =  nLeft + "px";
	
	},

	/**
	* Sets the Module's header content to the HTML specified, or appends the passed element to the header. If no header is present, one will be automatically created.
	* @method setHeader
	* @param {String}	headerContent	The HTML used to set the header <em>OR</em>
	* @param {HTMLElement}	headerContent	The HTMLElement to append to the header
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
	* @method appendToHeader
	* @param {HTMLElement}	element	The element to append to the header
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
	* @method setBody
	* @param {String}	bodyContent	The HTML used to set the body <em>OR</em>
	* @param {HTMLElement}	bodyContent	The HTMLElement to append to the body
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
	* @method appendToBody
	* @param {HTMLElement}	element	The element to append to the body
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
	* @method setFooter
	* @param {String}	footerContent	The HTML used to set the footer <em>OR</em>
	* @param {HTMLElement}	footerContent	The HTMLElement to append to the footer
	*/	
	setFooter : function(footerContent) {
		if (! this.footer) {
			this.footer = document.createElement("DIV");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		if (typeof footerContent == "string") {
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
	* @method appendToFooter
	* @param {HTMLElement}	element	The element to append to the footer
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
	* @method render
	* @param {String}	appendToNode	The element id to which the Module should be appended to prior to rendering <em>OR</em>
	* @param {HTMLElement}	appendToNode	The element to which the Module should be appended to prior to rendering	
	* @param {HTMLElement}	moduleElement	OPTIONAL. The element that represents the actual Standard Module container. 
	* @return {Boolean} Success or failure of the render
	*/
	render : function(appendToNode, moduleElement) {
		this.beforeRenderEvent.fire();

		if (! moduleElement) {
			moduleElement = this.element;
		}

		var me = this;
		var appendTo = function(element) {
			if (typeof element == "string") {
				element = document.getElementById(element);
			}
			
			if (element) {
				element.appendChild(me.element);
				me.appendEvent.fire();
			}
		};

		if (appendToNode) {
			appendTo(appendToNode);
		} else { // No node was passed in. If the element is not pre-marked up, this fails
			if (! YAHOO.util.Dom.inDocument(this.element)) {
				return false;
			}
		}

		// Need to get everything into the DOM if it isn't already
		
		if (this.header && ! YAHOO.util.Dom.inDocument(this.header)) {
			// There is a header, but it's not in the DOM yet... need to add it
			var firstChild = moduleElement.firstChild;
			if (firstChild) { // Insert before first child if exists
				moduleElement.insertBefore(this.header, firstChild);
			} else { // Append to empty body because there are no children
				moduleElement.appendChild(this.header);
			}
		}

		if (this.body && ! YAHOO.util.Dom.inDocument(this.body)) {
			// There is a body, but it's not in the DOM yet... need to add it
			if (this.footer && YAHOO.util.Dom.isAncestor(this.moduleElement, this.footer)) { // Insert before footer if exists in DOM
				moduleElement.insertBefore(this.body, this.footer);
			} else { // Append to element because there is no footer
				moduleElement.appendChild(this.body);
			}
		}

		if (this.footer && ! YAHOO.util.Dom.inDocument(this.footer)) {
			// There is a footer, but it's not in the DOM yet... need to add it
			moduleElement.appendChild(this.footer);
		}

		this.renderEvent.fire();
		return true;
	},

	/**
	* Removes the Module element from the DOM and sets all child elements to null.
	* @method destroy
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
	* @method show
	*/
	show : function() {
		this.cfg.setProperty("visible", true);
	},

	/**
	* Hides the Module element by setting the visible configuration property to false. Also fires two events: beforeHideEvent prior to the visibility change, and hideEvent after.
	* @method hide
	*/
	hide : function() {
		this.cfg.setProperty("visible", false);
	},

	// BUILT-IN EVENT HANDLERS FOR MODULE //

	/**
	* Default event handler for changing the visibility property of a Module. By default, this is achieved by switching the "display" style between "block" and "none".
	* This method is responsible for firing showEvent and hideEvent.
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	* @method configVisible
	*/
	configVisible : function(type, args, obj) {
		var visible = args[0];
		if (visible) {
			this.beforeShowEvent.fire();
			YAHOO.util.Dom.setStyle(this.element, "display", "block");
			this.showEvent.fire();
		} else {
			this.beforeHideEvent.fire();
			YAHOO.util.Dom.setStyle(this.element, "display", "none");
			this.hideEvent.fire();
		}
	},

	/**
	* Default event handler for the "monitorresize" configuration property
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	* @method configMonitorResize
	*/
	configMonitorResize : function(type, args, obj) {
		var monitor = args[0];
		if (monitor) {
			this.initResizeMonitor();
		} else {
			YAHOO.util.Event.removeListener(this.resizeMonitor, "resize", this.onDomResize);
			this.resizeMonitor = null;
		}
	}
};

/**
* Returns a String representation of the Object.
* @method toString
* @return {String}	The string representation of the Module
*/ 
YAHOO.widget.Module.prototype.toString = function() {
	return "Module " + this.id;
};