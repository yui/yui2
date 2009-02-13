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
		
		/**
		 * @attribute style
		 * @description Standard set of values used to style the chart. Can only be set in the constructor or
		 * through the <code>setStyle</code> (individually) and <code>setStyles</code> (all) methods.
		 * @type Object
		 *
		 *<p>Available styles are listed below:</p>
		 *<code>padding</code>
		 *<p>A numeric value that specifies the spacing around the edge of the chart's contents. Unlike CSS padding in HTML, the chart's padding does not increase the dimensions of the chart.</p>
		 *<code>animationEnabled</code>
		 *<p>A Boolean value that specifies whether marker animations are enabled or not. The default value is <code>true</code>, meaning that markers will animate when data changes.</p>
		 *<code>font</code>
		 *<p>One may declare a <code>font</code> style to customize the default axis text, including the font name, size, color and more. It is represented as an Object value that contains several substyles.</p>
		 *<dl>
		 *	<dt><code>name</code></dt>
		 *		<dd>Accepts a String that is either the name of the font or a list of comma-delimited font names, similar to the way font-family works in CSS.</dd>
		 *	<dt><code>color</code></dt>
		 *		<dd>A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>Accepts a numeric value for the point size. No other font size units are available.</dd>
		 *	<dt><code>bold</code></dt>
		 *		<dd>Boolean value to set if the font is displayed in bold.</dd>
		 *	<dt><code>italic</code></dt>
		 *		<dd>Boolean value to set if the font is displayed in italics.</dd>
		 *	<dt><code>underline</code></dt>
		 *		<dd>Boolean value to set if the font is displayed with an underline.</dd>
		 *</dl>
		 *<code>border</code>
		 *<p>The <code>border</code> style allows a developer to add a colored border around the chart. The chart itself will decrease in dimensions to accomodate the border. It is represented as an Object value that contains several substyles.</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>the border thickness in pixels</dd>
		 *</dl>
		 *<code>background</code>
		 *<p>The <code>background</code> style allows one to customize the background color or image. It is represented as an Object value that contains several substyles.</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>Specifies the background fill color. If an image is present, this fill color will appear behind the image. A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>alpha</code></dt>
		 *		<dd>A value from <code>0.0</code> to <code>1.0</code> that refers to the transparency of the background color. This is most useful when used on the data tip background.</dd>
		 *	<dt><code>image</code></dt>
		 *		<dd>The URL of a JPG, PNG, GIF, or SWF image. May be relative or absolute. Relative URLs are relative to the HTML document in which the chart is embedded.</dd>
		 *	<dt><code>mode</code></dt>
		 *		<dd>The method used to display the background image. May be <code>"repeat"</code> (default), <code>"repeat-x"</code>, <code>"repeat-y"</code>, <code>"no-repeat"</code>, or <code>"stretch"</code>.</dd>
		 *</dl>
		 *<p>The <code>mode</code> value will be covered in more detail below in the <a href="#advancedskins">Advanced Skinning</a> section.</p>
		 *<code>legend</code>
		 *<p>The <code>legend</code> style lets a developer customize the appearance of the legend. It is represented as an Object value that contains several substyles.</p>
		 *<dl>
		 *	<dt><code>display</code></dt>
		 *		<dd>Specifies the location where the legend will be drawn. Accepted values include <code>"none"</code>, <code>"left"</code>, <code>"right"</code>, <code>"top"</code>, and <code>"bottom"</code>. The default value is <code>"none"</code>.</dd>
		 *	<dt><code>spacing</code></dt>
		 *		<dd>A value that specifies the number of pixels between each of the items displayed in the legend.</dd>
		 *	<dt><code>padding</code></dt>
		 *		<dd>Same as the <code>padding</code> style described above.</dd>
		 *	<dt><code>border</code></dt>
		 *		<dd>Same as the <code>border</code> style described above.</dd>
		 *	<dt><code>background</code></dt>
		 *		<dd>Same as the <code>background</code> style described above.</dd>
		 *	<dt><code>font</code></dt>
		 *		<dd>Same as the <code>font</code> style described above.</dd>
		 *</dl>
		 *<code>dataTip</code>
		 *<p>The <code>dataTip</code> style lets a developer customize the appearance of the data tip. It is represented as an Object value that contains several substyles.</p>
		 *<dl>
		 *	<dt><code>padding</code></dt>
		 *		<dd>Same as the <code>padding</code> style described above.</dd>
		 *	<dt><code>border</code></dt>
		 *		<dd>Same as the <code>border</code> style described above.</dd>
		 *	<dt><code>background</code></dt>
		 *		<dd>Same as the <code>background</code> style described above.</dd>
		 *	<dt><code>font</code></dt>
		 *		<dd>Same as the <code>font</code> style described above.</dd>
		 *</dl>
		 *<code>xAxis and yAxis</code>
		 *<p>The <code>xAxis</code> and <code>yAxis</code> styles allow one to customize the appearance of either axis. They are represented as Object values that contain several substyles.</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>The color of the axis itself. A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>A numeric value that represents the thickness of the axis itself. A value of <code>0</code> will hide the axis (but not the labels).</dd>
		 *	<dt><code>showLabels</code></dt>
		 *		<dd>If <code>true</code>, the labels are displayed. If <code>false</code>, they are hidden.</dd>
		 *	<dt><code>hideOverlappingLabels</code></dt>
		 *		<dd>Indicates whether or not to hide overlapping labels. This style will be used on the Category Axis when <code>calculateCategoryCount</code> is <code>false</code>The style will be used on the <code>TimeAxis</code> and <code>NumericAxis</code> when the user specifies the <code>majorUnit</code>. Otherwise, the axes will place the labels so that they do not overlap.</dd>
		 *	<dt><code>labelRotation</code></dt>
		 *		<dd>Indicates the rotation of the labels on the axis. Acceptable values are -90 through 90. Labels will display most clearly when set to <code>90</code>, <code>-90</code> or <code>0</code>. The default value is <code>0</code>.</dd>
		 *	<dt><code>labelSpacing</code></dt>
		 *		<dd>The distance, in pixels, between labels on an axis. The default value is <code>2</code>.</dd>
		 *	<dt><code>labelDistance</code></dt>
		 *		<dd>The distance, in pixels, between a label and the axis. The default value is <code>2</code>.</dd>
		 *	<dt><code>titleRotation</code></dt>
		 *		<dd>Indicates the rotation of the title on the axis.</dd>
		 *	<dt><code>titleDistance</code></dt>
		 *		<dd>The distance, in pixels, between a title and the axis labels. The default value is <code>2</code>.</dd>
		 *	<dt><code>majorGridLines</code></dt>
		 *		<dd>Described below.</dd>
		 *	<dt><code>minorGridLines</code></dt>
		 *		<dd>Described below.</dd>
		 *		 <dt><code>zeroGridLine</code></dt>
		 *		<dd>Described below.</dd>
		 *	<dt><code>majorTicks</code></dt>
		 *		<dd>Described below.</dd>
		 *	<dt><code>minorTicks</code></dt>
		 *		<dd>Described below.</dd>
		 *</dl>
		 *<code>majorGridLines and minorGridLines</code>
		 *<p>The <code>majorGridLines</code> and <code>minorGridLines</code> styles have a couple of substyles that need extra explanation. As shown above, <code>majorGridLines</code> and <code>minorGridLines</code> are substyles of the <code>xAxis</code> and <code>yAxis</code> styles.</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>The color of the grid lines. A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>A numeric value that represents the thickness of the grid lines. To hide the grid lines, set the <code>size</code> substyle to <code>0</code> (zero). If the grid lines are hidden by default, a thickness greater than zero must be specified to show them.</dd>
		 *</dl>
		 *<code>zeroGridLine</code>
		 *<p>The <code>zeroGridLine</code> style allows for emphasis on the zero grid line when it falls beyond the origin of the axis. The <code>zeroGridLine</code> style has the following substyles:</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>The color of the zero grid line. A hex-formatted string or number value like <code>"ff0000"</code> or <code>0xff0000</code>.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>A numeric value that represents the thickness of the zero grid line. To hide the grid line, set the <code>size</code> substyle to <code>0</code>.</dd>
		 *</dl>
		 *<code>majorTicks and minorTicks</code>
		 *<p>The <code>majorTicks</code> and <code>minorTicks</code> styles have a couple of substyles that need extra explanation. As shown above, <code>majorTicks</code> and <code>minorTicks</code> are substyles of the <code>xAxis</code> and <code>yAxis</code> styles.</p>
		 *<dl>
		 *	<dt><code>color</code></dt>
		 *		<dd>The color of the ticks. Same accepted formats as <code>color</code> styles described above.</dd>
		 *	<dt><code>size</code></dt>
		 *		<dd>A numeric value that represents the thickness of the ticks. This style may need to be set to a valid numeric value greater than zero if the ticks are not shown by default.</dd>
		 *	<dt><code>length</code></dt>
		 *		<dd>The number of pixels the ticks extend from the axis. This style may need to be set to a valid numeric value greater than zero if the ticks are not shown by default.</dd>
		 *	<dt><code>display</code></dt>
		 *		<dd>Specifies how the ticks are drawn. Accepted values include <code>"none"</code>, <code>"inside"</code>, <code>"outside"</code>, and <code>"cross"</code>. In many cases, <code>"none"</code> is the default.</dd>
		 *</dl>
		 */
		
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