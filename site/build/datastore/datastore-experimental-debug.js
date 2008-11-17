/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.6.0
*/
/*extern ActiveXObject, __flash_unloadHandler, __flash_savedUnloadHandler */
/*!
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
var deconcept = deconcept || {};

if(typeof deconcept.util == "undefined" || !deconcept.util)
{
	deconcept.util = {};
}

if(typeof deconcept.SWFObjectUtil == "undefined" || !deconcept.SWFObjectUtil)
{
	deconcept.SWFObjectUtil = {};
}

deconcept.SWFObject = function(swf, id, w, h, ver, c, quality, xiRedirectUrl, redirectUrl, detectKey)
{
	if(!document.getElementById) { return; }
	this.DETECT_KEY = detectKey ? detectKey : 'detectflash';
	this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params = {};
	this.variables = {};
	this.attributes = [];
	if(swf) { this.setAttribute('swf', swf); }
	if(id) { this.setAttribute('id', id); }
	if(w) { this.setAttribute('width', w); }
	if(h) { this.setAttribute('height', h); }
	if(ver) { this.setAttribute('version', new deconcept.PlayerVersion(ver.toString().split("."))); }
	this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
	if (!window.opera && document.all && this.installedVer.major > 7)
	{
		// only add the onunload cleanup if the Flash Player version supports External Interface and we are in IE
		deconcept.SWFObject.doPrepUnload = true;
	}
	if(c)
	{
		this.addParam('bgcolor', c);
	}
	var q = quality ? quality : 'high';
	this.addParam('quality', q);
	this.setAttribute('useExpressInstall', false);
	this.setAttribute('doExpressInstall', false);
	var xir = (xiRedirectUrl) ? xiRedirectUrl : window.location;
	this.setAttribute('xiRedirectUrl', xir);
	this.setAttribute('redirectUrl', '');
	if(redirectUrl)
	{
		this.setAttribute('redirectUrl', redirectUrl);
	}
};

deconcept.SWFObject.prototype =
{
	useExpressInstall: function(path)
	{
		this.xiSWFPath = !path ? "expressinstall.swf" : path;
		this.setAttribute('useExpressInstall', true);
	},
	setAttribute: function(name, value){
		this.attributes[name] = value;
	},
	getAttribute: function(name){
		return this.attributes[name];
	},
	addParam: function(name, value){
		this.params[name] = value;
	},
	getParams: function(){
		return this.params;
	},
	addVariable: function(name, value){
		this.variables[name] = value;
	},
	getVariable: function(name){
		return this.variables[name];
	},
	getVariables: function(){
		return this.variables;
	},
	getVariablePairs: function(){
		var variablePairs = [];
		var key;
		var variables = this.getVariables();
		for(key in variables)
		{
			if(variables.hasOwnProperty(key))
			{
				variablePairs[variablePairs.length] = key +"="+ variables[key];
			}
		}
		return variablePairs;
	},
	getSWFHTML: function() {
		var swfNode = "";
		var params = {};
		var key = "";
		var pairs = "";
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { // netscape plugin architecture
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "PlugIn");
				this.setAttribute('swf', this.xiSWFPath);
			}
			swfNode = '<embed type="application/x-shockwave-flash" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'" style="'+ this.getAttribute('style') +'"';
			swfNode += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
			params = this.getParams();
			for(key in params)
			{
				if(params.hasOwnProperty(key))
				{
					swfNode += [key] +'="'+ params[key] +'" ';
				}
			}
			pairs = this.getVariablePairs().join("&");
			if (pairs.length > 0){ swfNode += 'flashvars="'+ pairs +'"'; }
			swfNode += '/>';
		} else { // PC IE
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "ActiveX");
				this.setAttribute('swf', this.xiSWFPath);
			}
			swfNode = '<object id="'+ this.getAttribute('id') +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'" style="'+ this.getAttribute('style') +'">';
			swfNode += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
			params = this.getParams();
			for(key in params)
			{
				if(params.hasOwnProperty(key))
				{
					swfNode += '<param name="'+ key +'" value="'+ params[key] +'" />';
				}
			}
			pairs = this.getVariablePairs().join("&");
			if(pairs.length > 0) {swfNode += '<param name="flashvars" value="'+ pairs +'" />';}
			swfNode += "</object>";
		}
		return swfNode;
	},
	write: function(elementId)
	{
		if(this.getAttribute('useExpressInstall')) {
			// check to see if we need to do an express install
			var expressInstallReqVer = new deconcept.PlayerVersion([6,0,65]);
			if (this.installedVer.versionIsValid(expressInstallReqVer) && !this.installedVer.versionIsValid(this.getAttribute('version'))) {
				this.setAttribute('doExpressInstall', true);
				this.addVariable("MMredirectURL", escape(this.getAttribute('xiRedirectUrl')));
				document.title = document.title.slice(0, 47) + " - Flash Player Installation";
				this.addVariable("MMdoctitle", document.title);
			}
		}
		if(this.skipDetect || this.getAttribute('doExpressInstall') || this.installedVer.versionIsValid(this.getAttribute('version')))
		{
			var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
			n.innerHTML = this.getSWFHTML();
			return true;
		}
		else
		{
			if(this.getAttribute('redirectUrl') !== "")
			{
				document.location.replace(this.getAttribute('redirectUrl'));
			}
		}
		return false;
	}
};

/* ---- detection functions ---- */
deconcept.SWFObjectUtil.getPlayerVersion = function()
{
	var axo = null;
	var PlayerVersion = new deconcept.PlayerVersion([0,0,0]);
	if(navigator.plugins && navigator.mimeTypes.length)
	{
		var x = navigator.plugins["Shockwave Flash"];
		if(x && x.description)
		{
			PlayerVersion = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
		}
	}
	else if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0)
	{ // if Windows CE
		var counter = 3;
		while(axo)
		{
			try
			{
				counter++;
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+ counter);
//				document.write("player v: "+ counter);
				PlayerVersion = new deconcept.PlayerVersion([counter,0,0]);
			}
			catch(e)
			{
				axo = null;
			}
		}
	}
	else
	{ // Win IE (non mobile)
		// do minor version lookup in IE, but avoid fp6 crashing issues
		// see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
		try
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		}
		catch(e)
		{
			try
			{
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				PlayerVersion = new deconcept.PlayerVersion([6,0,21]);
				axo.AllowScriptAccess = "always"; // error if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
			}
			catch(e)
			{
				if(PlayerVersion.major == 6)
				{
					return PlayerVersion;
				}
			}
			try
			{
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			}
			catch(e) {}
		}
		
		if(axo !== null)
		{
			PlayerVersion = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
		}
	}
	return PlayerVersion;
};

deconcept.PlayerVersion = function(arrVersion)
{
	this.major = arrVersion[0] !== null ? parseInt(arrVersion[0], 0) : 0;
	this.minor = arrVersion[1] !== null ? parseInt(arrVersion[1], 0) : 0;
	this.rev = arrVersion[2] !== null ? parseInt(arrVersion[2], 0) : 0;
};

deconcept.PlayerVersion.prototype.versionIsValid = function(fv)
{
	if(this.major < fv.major)
	{
		return false;
	}
	if(this.major > fv.major)
	{
		return true;
	}
	if(this.minor < fv.minor)
	{
		return false;
	}
	if(this.minor > fv.minor)
	{
		return true;
	}
	if(this.rev < fv.rev)
	{
		return false;
	}
	return true;
};

/* ---- get value of query string param ---- */
deconcept.util =
{
	getRequestParameter: function(param)
	{
		var q = document.location.search || document.location.hash;
		if(param === null) { return q; }
		if(q)
		{
			var pairs = q.substring(1).split("&");
			for(var i=0; i < pairs.length; i++)
			{
				if (pairs[i].substring(0, pairs[i].indexOf("=")) == param)
				{
					return pairs[i].substring((pairs[i].indexOf("=") + 1));
				}
			}
		}
		return "";
	}
};

/* fix for video streaming bug */
deconcept.SWFObjectUtil.cleanupSWFs = function()
{
	var objects = document.getElementsByTagName("OBJECT");
	for(var i = objects.length - 1; i >= 0; i--)
	{
		objects[i].style.display = 'none';
		for(var x in objects[i])
		{
			if(typeof objects[i][x] == 'function')
			{
				objects[i][x] = function(){};
			}
		}
	}
};

// fixes bug in some fp9 versions see http://blog.deconcept.com/2006/07/28/swfobject-143-released/
if(deconcept.SWFObject.doPrepUnload)
{
	if(!deconcept.unloadSet)
	{
		deconcept.SWFObjectUtil.prepUnload = function()
		{
			__flash_unloadHandler = function(){};
			__flash_savedUnloadHandler = function(){};
			window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs);
		};
		window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
		deconcept.unloadSet = true;
	}
}

/* add document.getElementById if needed (mobile IE < 5) */
if(!document.getElementById && document.all)
{
	document.getElementById = function(id) { return document.all[id]; };
}

/* add some aliases for ease of use/backwards compatibility */
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject; // for legacy support
var SWFObject = deconcept.SWFObject;

/**
 * Wraps Flash embedding functionality and allows communication with SWF through
 * attributes.
 *
 * @namespace YAHOO.widget
 * @class FlashAdapter
 * @uses YAHOO.util.AttributeProvider
 */
YAHOO.widget.FlashAdapter = function(swfURL, containerID, attributes)
{
	// set up the initial events and attributes stuff
	this._queue = this._queue || [];
	this._events = this._events || {};
	this._configs = this._configs || {};
	attributes = attributes || {};
	
	//the Flash Player external interface code from Adobe doesn't play nicely
	//with the default value, yui-gen, in IE
	this._id = attributes.id = attributes.id || YAHOO.util.Dom.generateId(null, "yuigen");
	attributes.version = attributes.version || "9.0.45";
	attributes.backgroundColor = attributes.backgroundColor || "#ffffff";
	
	//we can't use the initial attributes right away
	//so save them for once the SWF finishes loading
	this._attributes = attributes;
	
	this._swfURL = swfURL;
	this._containerID = containerID;
	
	//embed the SWF file in the page
	this._embedSWF(this._swfURL, this._containerID, attributes.id, attributes.version,
		attributes.backgroundColor, attributes.expressInstall, attributes.wmode);
	
	/**
	 * Fires when the SWF is initialized and communication is possible.
	 * @event contentReady
	 */
	//Fix for iframe cross-domain issue with FF2x 
	try
	{
		this.createEvent("contentReady");
	}
	catch(e){}
};

YAHOO.extend(YAHOO.widget.FlashAdapter, YAHOO.util.AttributeProvider,
{
	/**
	 * The URL of the SWF file.
	 * @property _swfURL
	 * @type String
	 * @private
	 */
	_swfURL: null,

	/**
	 * The ID of the containing DIV.
	 * @property _containerID
	 * @type String
	 * @private
	 */
	_containerID: null,

	/**
	 * A reference to the embedded SWF file.
	 * @property _swf
	 * @private
	 */
	_swf: null,

	/**
	 * The id of this instance.
	 * @property _id
	 * @type String
	 * @private
	 */
	_id: null,

	/**
	 * Indicates whether the SWF has been initialized and is ready
	 * to communicate with JavaScript
	 * @property _initialized
	 * @type Boolean
	 * @private
	 */
	_initialized: false,
	
	/**
	 * The initializing attributes are stored here until the SWF is ready.
	 * @property _attributes
	 * @type Object
	 * @private
	 */
	_attributes: null, //the intializing attributes

	/**
	 * Public accessor to the unique name of the FlashAdapter instance.
	 *
	 * @method toString
	 * @return {String} Unique name of the FlashAdapter instance.
	 */
	toString: function()
	{
		return "FlashAdapter " + this._id;
	},

	/**
	 * Nulls out the entire FlashAdapter instance and related objects and removes attached
	 * event listeners and clears out DOM elements inside the container. After calling
	 * this method, the instance reference should be expliclitly nulled by implementer,
	 * as in myChart = null. Use with caution!
	 *
	 * @method destroy
	 */
	destroy: function()
	{
		//kill the Flash Player instance
		if(this._swf)
		{
			var container = YAHOO.util.Dom.get(this._containerID);
			container.removeChild(this._swf);
		}
		
		var instanceName = this._id;
		
		//null out properties
		for(var prop in this)
		{
			if(YAHOO.lang.hasOwnProperty(this, prop))
			{
				this[prop] = null;
			}
		}
		
		YAHOO.log("FlashAdapter instance destroyed: " + instanceName);
	},

	/**
	 * Embeds the SWF in the page and associates it with this instance.
	 *
	 * @method _embedSWF
	 * @private
	 */
	_embedSWF: function(swfURL, containerID, swfID, version, backgroundColor, expressInstall, wmode)
	{
		//standard SWFObject embed
		var swfObj = new deconcept.SWFObject(swfURL, swfID, "100%", "100%", version, backgroundColor);

		if(expressInstall)
		{
			swfObj.useExpressInstall(expressInstall);
		}

		//make sure we can communicate with ExternalInterface
		swfObj.addParam("allowScriptAccess", "always");
		
		if(wmode)
		{
			swfObj.addParam("wmode", wmode);
		}
		
		//again, a useful ExternalInterface trick
		swfObj.addVariable("allowedDomain", document.location.hostname);

		//tell the SWF which HTML element it is in
		swfObj.addVariable("elementID", swfID);

		// set the name of the function to call when the swf has an event
		swfObj.addVariable("eventHandler", "YAHOO.widget.FlashAdapter.eventHandler");

		var container = YAHOO.util.Dom.get(containerID);
		var result = swfObj.write(container);
		if(result)
		{
			this._swf = YAHOO.util.Dom.get(swfID);
			//if successful, let's add an owner property to the SWF reference
			//this will allow the event handler to communicate with a YAHOO.widget.FlashAdapter
			this._swf.owner = this;
		}
		else
		{
			YAHOO.log("Unable to load SWF " + swfURL);
		}
	},

	/**
	 * Handles or re-dispatches events received from the SWF.
	 *
	 * @method _eventHandler
	 * @private
	 */
	_eventHandler: function(event)
	{
		var type = event.type;
		switch(type)
		{
			case "swfReady":
   				this._loadHandler();
				return;
			case "log":
				YAHOO.log(event.message, event.category, this.toString());
				return;
		}
		
		//be sure to return after your case or the event will automatically fire!
		this.fireEvent(type, event);
	},

	/**
	 * Called when the SWF has been initialized.
	 *
	 * @method _loadHandler
	 * @private
	 */
	_loadHandler: function()
	{
		this._initialized = false;
		this._initAttributes(this._attributes);
		this.setAttributes(this._attributes, true);
		
		this._initialized = true;
		this.fireEvent("contentReady");
	},
	
	set: function(name, value)
	{
		//save all the attributes in case the swf reloads
		//so that we can pass them in again
		this._attributes[name] = value;
		YAHOO.widget.FlashAdapter.superclass.set.call(this, name, value);
	},
	
	/**
	 * Initializes the attributes.
	 *
	 * @method _initAttributes
	 * @private
	 */
	_initAttributes: function(attributes)
	{
		//should be overridden if other attributes need to be set up

		/**
		 * @attribute wmode
		 * @description Sets the window mode of the Flash Player control. May be
		 *		"window", "opaque", or "transparent". Only available in the constructor
		 *		because it may not be set after Flash Player has been embedded in the page.
		 * @type String
		 */
		 
		/**
		 * @attribute expressInstall
		 * @description URL pointing to a SWF file that handles Flash Player's express
		 *		install feature. Only available in the constructor because it may not be
		 *		set after Flash Player has been embedded in the page.
		 * @type String
		 */

		/**
		 * @attribute version
		 * @description Minimum required version for the SWF file. Only available in the constructor because it may not be
		 *		set after Flash Player has been embedded in the page.
		 * @type String
		 */

		/**
		 * @attribute backgroundColor
		 * @description The background color of the SWF. Only available in the constructor because it may not be
		 *		set after Flash Player has been embedded in the page.
		 * @type String
		 */
		 
		/**
		 * @attribute altText
		 * @description The alternative text to provide for screen readers and other assistive technology.
		 * @type String
		 */
		this.getAttributeConfig("altText",
		{
			method: this._getAltText
		});
		this.setAttributeConfig("altText",
		{
			method: this._setAltText
		});
		
		/**
		 * @attribute swfURL
		 * @description Absolute or relative URL to the SWF displayed by the FlashAdapter. Only available in the constructor because it may not be
		 *		set after Flash Player has been embedded in the page.
		 * @type String
		 */
		this.getAttributeConfig("swfURL",
		{
			method: this._getSWFURL
		});
	},
	
	/**
	 * Getter for swfURL attribute.
	 *
	 * @method _getSWFURL
	 * @private
	 */
	_getSWFURL: function()
	{
		return this._swfURL;
	},
	
	/**
	 * Getter for altText attribute.
	 *
	 * @method _getAltText
	 * @private
	 */
	_getAltText: function()
	{
		return this._swf.getAltText();
	},

	/**
	 * Setter for altText attribute.
	 *
	 * @method _setAltText
	 * @private
	 */
	_setAltText: function(value)
	{
		return this._swf.setAltText(value);
	}
});

/**
 * Receives event messages from SWF and passes them to the correct instance
 * of FlashAdapter.
 *
 * @method YAHOO.widget.FlashAdapter.eventHandler
 * @static
 * @private
 */
YAHOO.widget.FlashAdapter.eventHandler = function(elementID, event)
{
	var loadedSWF = YAHOO.util.Dom.get(elementID);
	if(!loadedSWF.owner)
	{
		//fix for ie: if owner doesn't exist yet, try again in a moment
		setTimeout(function() { YAHOO.widget.FlashAdapter.eventHandler( elementID, event ); }, 0);
	}
	else
	{
		loadedSWF.owner._eventHandler(event);
	}
};

/**
 * The number of proxy functions that have been created.
 * @static
 * @private
 */
YAHOO.widget.FlashAdapter.proxyFunctionCount = 0;

/**
 * Creates a globally accessible function that wraps a function reference.
 * Returns the proxy function's name as a string for use by the SWF through
 * ExternalInterface.
 *
 * @method YAHOO.widget.FlashAdapter.createProxyFunction
 * @static
 * @private
 */
YAHOO.widget.FlashAdapter.createProxyFunction = function(func)
{
	var index = YAHOO.widget.FlashAdapter.proxyFunctionCount;
	YAHOO.widget.FlashAdapter["proxyFunction" + index] = function()
	{
		return func.apply(null, arguments);
	};
	YAHOO.widget.FlashAdapter.proxyFunctionCount++;
	return "YAHOO.widget.FlashAdapter.proxyFunction" + index.toString();
};

/**
 * Removes a function created with createProxyFunction()
 * 
 * @method YAHOO.widget.FlashAdapter.removeProxyFunction
 * @static
 * @private
 */
YAHOO.widget.FlashAdapter.removeProxyFunction = function(funcName)
{
	//quick error check
	if(!funcName || funcName.indexOf("YAHOO.widget.FlashAdapter.proxyFunction") < 0)
	{
		return;
	}
	
	funcName = funcName.substr(26);
	YAHOO.widget.FlashAdapter[funcName] = null;
};

/**
 * Creates a store, which can be used to set and get information on a
 * user's local machine. This is similar to a browser cookie, except the 
 * allowed store is larger and can be shared across browsers.
 *
 * @module datastore
 * @requires yahoo, dom, event, element
 * @title DataStore Util
 * @beta
 */

/**
 * Class for the YUI DataStore util.
 *
 * @namespace YAHOO.util
 * @class DataStore
 * @uses YAHOO.widget.FlashAdapter
 * @constructor
 * @param containerId {HTMLElement} Container element for the Flash Player instance.
 * @param attributes {Object} Properties for embedding the SWF.
 */
YAHOO.util.DataStore = function(containerID, attributes, swfURL)
{
	YAHOO.util.DataStore.superclass.constructor.call(this, YAHOO.util.DataStore.SWFURL, containerID, attributes);
	
	/**
	 * Fires when an error occurs
	 *
	 * @event error
	 * @param event.type {String} The event type
	 * @param event.message {String} The data 
	 * 
	 */
	this.createEvent("error");
	
	/**
	 * Fires when a store is saved successfully
	 *
	 * @event success
	 * @param event.type {String} The event type
	 * 
	 */
	this.createEvent("success");
	
	
	/**
	 * Fires when the save is pending, due to a request for additional storage
	 *
	 * @event error
	 * @param event.type {String} The event type
	 * 
	 */
	this.createEvent("pending");
	
	
	/**
	 * Fires as the settings dialog displays
	 *
	 * @event error
	 * @param event.type {String} The event type
	 * 
	 */
	this.createEvent("openDialog");
	
	/**
	 * Fires when a settings dialog is not able to be displayed due to 
	 * the SWF not being large enough to show it. In this case, the developer
	 * needs to resize the SWF to width of 215px and height of 138px or above, 
	 * or display an external settings page.
	 *
	 * @event openExternalDialog
	 * @param event.type {String} The event type
	 * 
	 */
	this.createEvent("openExternalDialog");
};

YAHOO.extend(YAHOO.util.DataStore, YAHOO.widget.FlashAdapter,
{


	/**
	 * Public accessor to the unique name of the DataStore instance.
	 *
	 * @method toString
	 * @return {String} Unique name of the DataStore instance.
	 */
	toString: function()
	{
		return "DataStore " + this._id;
	},
	
	
	   /**
	    * Saves data to local storage. It returns a String that can
		* be one of three values: "true" if the storage succeeded; "false" if the user
		* has denied storage on their machine, and "pending" if storage is permitted,
		* but the storage space allotted is not sufficient.
		* <p>The size limit for the passed parameters is ~40Kb.</p>
		* @method setItem
	    * @param item {Object} The data to store
	    * @param location {String} The name of the "cookie" or store 
		* @return {Boolean} Whether or not the save was successful
	    * 
	    */
		setItem: function(data, location) 
		{
			YAHOO.log("SETTING " +data +" to "+ location);
			return this._swf.setItem(data, location);
		} ,
	    
	    /**
	    * Returns the item in storage, if any.
	    * @method getItem
	    * @param location {String} The name of the "cookie" or store
		* @return {Object} The data
	    * 
	    */
		getItem: function(location) 
		{
			return this._swf.getItem(location);
		} ,

	    /**
	    * Removes the item in storage, if any.
	    * @method removeItem
	    * @param location {String} The name of the "cookie" or store
	    * 
	    */
		removeItem: function(location) 
		{
			YAHOO.log("removing " + location);
			return this._swf.removeItem(location);
		} ,
		
	   /**
	    * Removes all data in local storage for this domain.
	    * <p>Be careful when using this method, as it may 
	    * remove stored information that is used by other applications
	    * in this domain </p>
	    * @method clear
	    */		
		clear: function() 
		{
			return this._swf.clear();
		} ,
		
	    /**
	     *  Gets the current size, in KB, of the amount of space taken by the current store.
	     * @method calculateSize
	     */		
		calculateSize: function() 
		{
			return this._swf.calculateSize();
		} ,
		
	    /**
	     * Gets the timestamp of the last store. This value is automatically set when 
	     * data is stored.
	     * @method getLastModified
	     * @return A Date object
	     */
		getLastModified: function() 
		{
			return this._swf.getLastModified();
		} ,
		
		/**
		* This method requests more storage if the amount is above 100KB. (e.g.,
		* if the <code>store()</code> method returns "pending".
		* The request dialog has to be displayed within the Flash player itself
		* so the SWF it is called from must be visible and at least 215px x 138px in size.
		* 
		* @method setSize
		* @param value The size, in KB
		*/		
		setSize: function(value) 
		{
			return this._swf.setSize(value);
		} ,
		
		/**
		 * Displays the settings dialog to allow the user to configure
		 * storage settings manually. If the SWF height and width are smaller than
		 * what is allowable to display the local settings panel,
		 * an openExternalDialog message will be sent to JavaScript.
		 * @method displaySettings
		 */		
		displaySettings: function() 
		{
			return this._swf.displaySettings();
		} 

});


YAHOO.util.DataStore.SWFURL = "datastore.swf";

YAHOO.register("datastore", YAHOO.util.DataStore, {version: "2.6.0", build: "1285"});
