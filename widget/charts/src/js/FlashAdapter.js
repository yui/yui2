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
	attributes.version = attributes.version || "9";
	attributes.backgroundColor = attributes.backgroundColor || "#ffffff";
	
	//we can't use the initial attributes right away
	//so save them for once the SWF finishes loading
	this._attributes = attributes;
	
	this._swfURL = swfURL;
	
	//embed the SWF file in the page
	this._embedSWF(this._swfURL, containerID, attributes.id, attributes.version, attributes.backgroundColor, attributes.expressInstall);
	
	//the contentReady event will tell developers that they may begin
	//manipulating this widget.
	this.createEvent("contentReady");
};

YAHOO.extend(YAHOO.widget.FlashAdapter, YAHOO.util.AttributeProvider,
{
	_swfURL: null,
	_swf: null, //a reference to the embedded SWF file
	_id: null,
	_attributes: null, //the intializing attributes

	toString: function()
	{
		return "FlashAdapter " + this._id;
	},

	//allow an event handler to be specified
	_embedSWF: function(swfURL, containerID, swfID, version, backgroundColor, expressInstall)
	{
		//standard SWFObject embed
		var swfObj = new deconcept.SWFObject(swfURL, swfID, "100%", "100%", version, backgroundColor, expressInstall);

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
		else YAHOO.log("Unable to load SWF " + swfURL);
	},

	_eventHandler: function(event)
	{
		var type = event.type;
		switch(type)
		{
			case "swfReady":
			{
   				this._loadHandler();
				return;
			}
			case "log":
			{
				YAHOO.log(event.message, event.category, this.toString());
				return;
			}
		}
		
		//be sure to return after your case or the event will automatically fire!
		this.fireEvent(type, event);
	},

	_loadHandler: function()
	{
		this._initAttributes(this._attributes);
		this.setAttributes(this._attributes, true);
		this._attributes = null;
		
		this.fireEvent("contentReady");
	},
	
	_initAttributes: function(attributes)
	{
		//should be overridden if other attributes need to be set up
		
		this.getAttributeConfig("swfURL",
		{
			method: this._getSWFURL
		});
	},
	
	_getSWFURL: function()
	{
		return this._swfURL;
	}
});

YAHOO.widget.FlashAdapter.eventHandler = function(elementID, event)
{
	var loadedSWF = YAHOO.util.Dom.get(elementID);
	if(!loadedSWF.owner)
	{
		//fix for ie: if owner doesn't exist yet, try again in a moment
		setTimeout(function() { YAHOO.widget.FlashAdapter.eventHandler( elementID, event ); }, 0);
	}
	else loadedSWF.owner._eventHandler(event);
};