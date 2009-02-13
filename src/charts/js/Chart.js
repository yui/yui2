/**
 * The Charts widget provides a Flash control for displaying data
 * graphically by series across A-grade browsers with Flash Player installed.
 *
 * @module charts
 * @requires yahoo, dom, event, datasource
 * @title Charts Widget
 * @experimental
 */
 
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Chart class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class Chart
 * @uses YAHOO.widget.FlashAdapter
 * @constructor
 * @param type {String} The char type. May be "line", "column", "bar", or "pie"
 * @param containerId {HTMLElement} Container element for the Flash Player instance.
 * @param dataSource {YAHOO.util.DataSource} DataSource instance.
 * @param attributes {object} (optional) Object literal of configuration values.
 */
YAHOO.widget.Chart = function(type, containerId, dataSource, attributes)
{
	YAHOO.widget.Chart.superclass.constructor.call(this, YAHOO.widget.Chart.SWFURL, containerId, attributes);
	
	this._type = type;
	this._dataSource = dataSource;
	
	/**
	 * Fires when the user moves the mouse over the bounds of an item renderer in the chart.
	 *
	 * @event itemMouseOverEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemMouseOverEvent");
	
	/**
	 * Fires when the user moves the mouse out of the bounds of an item renderer in the chart.
	 *
	 * @event itemMouseOutEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemMouseOutEvent");
	
	/**
	 * Fires when the user clicks an item renderer in the chart with the mouse.
	 *
	 * @event itemClickEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemClickEvent");
	
	/**
	 * Fires when the user double-clicks an item renderer in the chart with the mouse.
	 *
	 * @event itemDoubleClickEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemDoubleClickEvent");
	
	/**
	 * Fires when the user presses the mouse down on an item to initiate a drag action.
	 *
	 * @event itemDragStartEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemDragStartEvent");
	
	/**
	 * Fires when the user moves the mouse during a drag action.
	 *
	 * @event itemDragEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemDragEvent");

	/**
	 * Fires when the user releases the mouse during a drag action.
	 *
	 * @event itemDragEndEvent
	 * @param event.type {String} The event type
	 * @param event.item {Object} The data displayed by the renderer
	 * @param event.index {Number} The position within the series that the item appears.
	 * @param event.seriesIndex {Number} The position within the series definition that the series appears.
	 * @param event.x {Number} The horizontal position of the mouse, relative to the SWF.
	 * @param event.y {Number} The vertical position of the mouse, relative to the SWF.
	 */
	this.createEvent("itemDragEndEvent");
};

YAHOO.extend(YAHOO.widget.Chart, YAHOO.widget.FlashAdapter,
{
	/**
	 * The type of this chart instance.
	 * @property _type
	 * @type String
	 * @private
	 */
	_type: null,

	/**
	 * The id returned from the DataSource's setInterval function.
	 * @property _pollingID
	 * @type Number
	 * @private
	 */
	_pollingID: null,

	/**
	 * The time, in ms, between requests for data.
	 * @property _pollingInterval
	 * @type Number
	 * @private
	 */
	_pollingInterval: null,

	/**
	 * Stores a reference to the dataTipFunction created by
	 * YAHOO.widget.FlashAdapter.createProxyFunction()
	 * @property _dataTipFunction
	 * @type String
	 * @private
	 */
	_dataTipFunction: null,
	
	/**
	 * Stores references to series labelFunction values created by
	 * YAHOO.widget.FlashAdapter.createProxyFunction()
	 * @property _seriesLabelFunctions
	 * @type Array
	 * @private
	 */
	_seriesLabelFunctions: null,

	/**
	 * Public accessor to the unique name of the Chart instance.
	 *
	 * @method toString
	 * @return {String} Unique name of the Chart instance.
	 */
	toString: function()
	{
		return "Chart " + this._id;
	},
	
	/**
	 * Sets a single style value on the Chart instance.
	 *
	 * @method setStyle
	 * @param name {String} Name of the Chart style value to change.
	 * @param value {Object} New value to pass to the Chart style.
	 */
	setStyle: function(name, value)
	{
		//we must jsonify this because Flash Player versions below 9.0.60 don't handle
		//complex ExternalInterface parsing correctly
		value = YAHOO.lang.JSON.stringify(value);
		this._swf.setStyle(name, value);
	},
	
	/**
	 * Resets all styles on the Chart instance.
	 *
	 * @method setStyles
	 * @param styles {Object} Initializer for all Chart styles.
	 */
	setStyles: function(styles)
	{
		//we must jsonify this because Flash Player versions below 9.0.60 don't handle
		//complex ExternalInterface parsing correctly
		styles = YAHOO.lang.JSON.stringify(styles);
		this._swf.setStyles(styles);
	},
	
	/**
	 * Sets the styles on all series in the Chart.
	 *
	 * @method setSeriesStyles
	 * @param styles {Array} Initializer for all Chart series styles.
	 */
	setSeriesStyles: function(styles)
	{
		//we must jsonify this because Flash Player versions below 9.0.60 don't handle
		//complex ExternalInterface parsing correctly
		for(var i = 0; i < styles.length; i++)
		{
			styles[i] = YAHOO.lang.JSON.stringify(styles[i]);	
		}
		this._swf.setSeriesStyles(styles);
	},
	
	destroy: function()
	{
		//stop polling if needed
		if(this._dataSource !== null)
		{
			if(this._pollingID !== null)
			{
				this._dataSource.clearInterval(this._pollingID);
				this._pollingID = null;
			}
		}
		
		//remove proxy functions
		if(this._dataTipFunction)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._dataTipFunction);
		}
		
		//call last
		YAHOO.widget.Chart.superclass.destroy.call(this);
	},
	
	/**
	 * Initializes the attributes.
	 *
	 * @method _initAttributes
	 * @private
	 */
	_initAttributes: function(attributes)
	{
		YAHOO.widget.Chart.superclass._initAttributes.call(this, attributes);

		/**
		 * @attribute request
		 * @description Request to be sent to the Chart's DataSource.
		 * @type String
		 */
		this.getAttributeConfig("request",
		{
			method: this._getRequest
		});
		
		this.setAttributeConfig("request",
		{
			method: this._setRequest
		});
		
		/**
		 * @attribute dataSource
		 * @description The DataSource instance to display in the Chart.
		 * @type DataSource
		 */
		this.getAttributeConfig("dataSource",
		{
			method: this._getDataSource
		});
		
		this.setAttributeConfig("dataSource",
		{
			method: this._setDataSource
		});
		
		/**
		 * @attribute series
		 * @description Defines the series to be displayed by the Chart.
		 * @type Array
		 */
		this.getAttributeConfig("series",
		{
			method: this._getSeriesDefs
		});
		
		this.setAttributeConfig("series",
		{
			method: this._setSeriesDefs
		});
		
		/**
		 * @attribute categoryNames
		 * @description Defines the names of the categories to be displayed in the Chart..
		 * @type Array
		 */
		this.getAttributeConfig("categoryNames",
		{
			method: this._getCategoryNames
		});
		
		this.setAttributeConfig("categoryNames",
		{
			validator: YAHOO.lang.isArray,
			method: this._setCategoryNames
		});
		
		/**
		 * @attribute dataTipFunction
		 * @description The string representation of a globally-accessible function
		 * that may be called by the SWF to generate the datatip text for a Chart's item.
		 * @type String
		 */
		this.getAttributeConfig("dataTipFunction",
		{
			method: this._getDataTipFunction
		});
		
		this.setAttributeConfig("dataTipFunction",
		{
			method: this._setDataTipFunction
		});

		/**
		 * @attribute polling
		 * @description A numeric value indicating the number of milliseconds between
		 * polling requests to the DataSource.
		 * @type Number
		 */
		this.getAttributeConfig("polling",
		{
			method: this._getPolling
		});

		this.setAttributeConfig("polling",
		{
			method: this._setPolling
		});
	},
	
	/**
	 * Called when the SWF is ready for communication. Sets the type, initializes
	 * the styles, and sets the DataSource.
	 *
	 * @method _loadHandler
	 * @private
	 */
	_loadHandler: function()
	{
		//the type is set separately because it must be first!
		this._swf.setType(this._type);
		
		//set initial styles
		if(this._attributes.style)
		{
			var style = this._attributes.style;
			this.setStyles(style);		
		}
		
		YAHOO.widget.Chart.superclass._loadHandler.call(this);
		
		if(this._dataSource)
		{
			this.set("dataSource", this._dataSource);
		}
	},

	/**
	 * Sends (or resends) the request to the DataSource.
	 *
	 * @method refreshData
	 */
	refreshData: function()
	{
		if(!this._initialized)
		{
			return;
		}
		
		if(this._dataSource !== null)
		{
			if(this._pollingID !== null)
			{
				this._dataSource.clearInterval(this._pollingID);
				this._pollingID = null;
			}
			
			if(this._pollingInterval > 0)
			{
				this._pollingID = this._dataSource.setInterval(this._pollingInterval, this._request, this._loadDataHandler, this);
			}
			this._dataSource.sendRequest(this._request, this._loadDataHandler, this);
		}
	},

	/**
	 * Called when the DataSource receives new data. The series definitions are used
	 * to build a data provider for the SWF chart.
	 *
	 * @method _loadDataHandler
	 * @private
	 */
	_loadDataHandler: function(request, response, error)
	{
		if(this._swf)
		{
			if(error)
			{
				YAHOO.log("Unable to load data.", "error");
			}
			else
			{
				var i;
				if(this._seriesLabelFunctions)
				{
					var count = this._seriesLabelFunctions.length;
					for(i = 0; i < count; i++)
					{
						YAHOO.widget.FlashAdapter.removeProxyFunction(this._seriesLabelFunctions[i]);
					}
					this._seriesLabelFunction = null;
				}
				this._seriesLabelFunctions = [];

				//make a copy of the series definitions so that we aren't
				//editing them directly.
				var dataProvider = [];	
				var seriesCount = 0;
				var currentSeries = null;
				if(this._seriesDefs !== null)
				{
					seriesCount = this._seriesDefs.length;
					for(i = 0; i < seriesCount; i++)
					{
						currentSeries = this._seriesDefs[i];
						var clonedSeries = {};
						for(var prop in currentSeries)
						{
							if(YAHOO.lang.hasOwnProperty(currentSeries, prop))
							{
								if(prop == "style")
								{
									if(currentSeries.style !== null)
									{
										clonedSeries.style = YAHOO.lang.JSON.stringify(currentSeries.style);
									}
								}

								else if(prop == "labelFunction")
								{
									if(currentSeries.labelFunction !== null &&
										typeof currentSeries.labelFunction == "function")
									{
										clonedSeries.labelFunction = YAHOO.widget.FlashAdapter.createProxyFunction(currentSeries.labelFunction);
										this._seriesLabelFunctions.push(clonedSeries.labelFunction);
									}
								}

								else
								{
									clonedSeries[prop] = currentSeries[prop];
								}
							}
						}
						dataProvider.push(clonedSeries);
					}
				}

				if(seriesCount > 0)
				{
					for(i = 0; i < seriesCount; i++)
					{
						currentSeries = dataProvider[i];
						if(!currentSeries.type)
						{
							currentSeries.type = this._type;
						}
						currentSeries.dataProvider = response.results;
					}
				}
				else
				{
					var series = {type: this._type, dataProvider: response.results};
					dataProvider.push(series);
				}
				this._swf.setDataProvider(dataProvider);
			}
		}
	},

	/**
	 * Storage for the request attribute.
	 * 
	 * @property _request
	 * @private
	 */
	_request: "",
	
	/**
	 * Getter for the request attribute.
	 *
	 * @method _getRequest
	 * @private
	 */
	_getRequest: function()
	{
		return this._request;
	},
	
	/**
	 * Setter for the request attribute.
	 *
	 * @method _setRequest
	 * @private
	 */
	_setRequest: function(value)
	{
		this._request = value;
		this.refreshData();
	},

	/**
	 * Storage for the dataSource attribute.
	 * 
	 * @property _dataSource
	 * @private
	 */
	_dataSource: null,
	
	/**
	 * Getter for the dataSource attribute.
	 *
	 * @method _getDataSource
	 * @private
	 */
	_getDataSource: function()
	{
		return this._dataSource;
	},

	/**
	 * Setter for the dataSource attribute.
	 *
	 * @method _setDataSource
	 * @private
	 */
	_setDataSource: function(value)
	{	
		this._dataSource = value;
		this.refreshData();
	},
	
	/**
	 * Storage for the series attribute.
	 * 
	 * @property _seriesDefs
	 * @private
	 */
	_seriesDefs: null,
	
	/**
	 * Getter for the series attribute.
	 *
	 * @method _getSeriesDefs
	 * @private
	 */
	_getSeriesDefs: function()
	{
		return this._seriesDefs;
	},
	
	/**
	 * Setter for the series attribute.
	 *
	 * @method _setSeriesDefs
	 * @private
	 */
	_setSeriesDefs: function(value)
	{
		this._seriesDefs = value;
		this.refreshData();
	},

	/**
	 * Getter for the categoryNames attribute.
	 *
	 * @method _getCategoryNames
	 * @private
	 */
	_getCategoryNames: function()
	{
		this._swf.getCategoryNames();
	},

	/**
	 * Setter for the categoryNames attribute.
	 *
	 * @method _setCategoryNames
	 * @private
	 */
	_setCategoryNames: function(value)
	{
		this._swf.setCategoryNames(value);
	},
	
	/**
	 * Setter for the dataTipFunction attribute.
	 *
	 * @method _setDataTipFunction
	 * @private
	 */
	_setDataTipFunction: function(value)
	{
		if(this._dataTipFunction)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._dataTipFunction);
		}
		
		if(value && typeof value == "function")
		{
			value = YAHOO.widget.FlashAdapter.createProxyFunction(value);
			this._dataTipFunction = value;
		}
		this._swf.setDataTipFunction(value);
	},

	/**
	 * Getter for the polling attribute.
	 *
	 * @method _getPolling
	 * @private
	 */
	_getPolling: function()
	{
		return this._pollingInterval;
	},

	/**
	 * Setter for the polling attribute.
	 *
	 * @method _setPolling
	 * @private
	 */
	_setPolling: function(value)
	{
		this._pollingInterval = value;
		this.refreshData();
	}
});

/**
 * Storage for the dataTipFunction attribute.
 *
 * @property Chart.SWFURL
 * @private
 * @static
 * @final
 * @default "assets/charts.swf"
 */
YAHOO.widget.Chart.SWFURL = "assets/charts.swf";