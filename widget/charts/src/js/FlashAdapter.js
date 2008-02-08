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
	
	//embed the SWF file in the page
	this._embedSWF(this._swfURL, containerID, attributes.id, attributes.version, attributes.backgroundColor, attributes.expressInstall);
	
	/**
	 * Fires when the SWF is initialized and communication is possible.
	 * @event contentReady
	 */
	this.createEvent("contentReady");
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
	 * Embeds the SWF in the page and associates it with this instance.
	 *
	 * @method _embedSWF
	 * @private
	 */
	_embedSWF: function(swfURL, containerID, swfID, version, backgroundColor, expressInstall)
	{
		//standard SWFObject embed
		var swfObj = new deconcept.SWFObject(swfURL, swfID, "100%", "100%", version, backgroundColor);

		if(expressInstall)
		{
			swfObj.useExpressInstall(expressInstall);
		}

		//make sure we can communicate with ExternalInterface
		swfObj.addParam("allowScriptAccess", "always");
		
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
		this._initAttributes(this._attributes);
		this.setAttributes(this._attributes, true);
		this._attributes = null;
		
		this.fireEvent("contentReady");
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
		 * @attribute swfURL
		 * @description Absolute or relative URL to the SWF displayed by the FlashAdapter.
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