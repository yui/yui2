/**
 * CartesianChart class for the YUI Charts widget.
 *
 * @namespace YAHOO.widget
 * @class CartesianChart
 * @uses YAHOO.widget.Chart
 * @constructor
 * @param type {String} The char type. May be "line", "column", or "bar"
 * @param containerId {HTMLElement} Container element for the Flash Player instance.
 * @param dataSource {YAHOO.util.DataSource} DataSource instance.
 * @param attributes {object} (optional) Object literal of configuration values.
 */
 YAHOO.widget.CartesianChart = function(type, containerId, dataSource, attributes)
{
	YAHOO.widget.CartesianChart.superclass.constructor.call(this, type, containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.CartesianChart, YAHOO.widget.Chart,
{
	/**
	 * Stores a reference to the xAxis labelFunction created by
	 * YAHOO.widget.FlashAdapter.createProxyFunction()
	 * @property _xAxisLabelFunction
	 * @type String
	 * @private
	 */
	_xAxisLabelFunction: null,
	
	/**
	 * Stores a reference to the yAxis labelFunction created by
	 * YAHOO.widget.FlashAdapter.createProxyFunction()
	 * @property _yAxisLabelFunction
	 * @type String
	 * @private
	 */
	_yAxisLabelFunction: null,
	
	destroy: function()
	{
		//remove proxy functions
		if(this._xAxisLabelFunction)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._xAxisLabelFunction);
			this._xAxisLabelFunction = null;
		}
		
		if(this._yAxisLabelFunction)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._yAxisLabelFunction);
			this._yAxisLabelFunction = null;
		}
	
		//call last
		YAHOO.widget.CartesianChart.superclass.destroy.call(this);
	},
	
	/**
	 * Initializes the attributes.
	 *
	 * @method _initAttributes
	 * @private
	 */
	_initAttributes: function(attributes)
	{	
		YAHOO.widget.CartesianChart.superclass._initAttributes.call(this, attributes);

		/**
		 * @attribute xField
		 * @description The field in each item that corresponds to a value on the x axis.
		 * @type String
		 */
		this.getAttributeConfig("xField",
		{
			method: this._getXField
		});

		this.setAttributeConfig("xField",
		{
			validator: YAHOO.lang.isString,
			method: this._setXField
		});

		/**
		 * @attribute yField
		 * @description The field in each item that corresponds to a value on the x axis.
		 * @type String
		 */
		this.getAttributeConfig("yField",
		{
			method: this._getYField
		});

		this.setAttributeConfig("yField",
		{
			validator: YAHOO.lang.isString,
			method: this._setYField
		});

		/**
		 * @attribute xAxis
		 * @description A custom configuration for the horizontal x axis.
		 * @type Axis
		 */
		this.setAttributeConfig("xAxis",
		{
			method: this._setXAxis
		});

		/**
		 * @attribute yAxis
		 * @description A custom configuration for the vertical y axis.
		 * @type Axis
		 */
		this.setAttributeConfig("yAxis",
		{
			method: this._setYAxis
		});
	},

	/**
	 * Getter for the xField attribute.
	 *
	 * @method _getXField
	 * @private
	 */
	_getXField: function()
	{
		return this._swf.getHorizontalField();
	},

	/**
	 * Setter for the xField attribute.
	 *
	 * @method _setXField
	 * @private
	 */
	_setXField: function(value)
	{
		this._swf.setHorizontalField(value);
	},

	/**
	 * Getter for the yField attribute.
	 *
	 * @method _getYField
	 * @private
	 */
	_getYField: function()
	{
		return this._swf.getVerticalField();
	},

	/**
	 * Setter for the yField attribute.
	 *
	 * @method _setYField
	 * @private
	 */
	_setYField: function(value)
	{
		this._swf.setVerticalField(value);
	},
	
	/**
	 * Setter for the xAxis attribute.
	 *
	 * @method _setXAxis
	 * @private
	 */
	_setXAxis: function(value)
	{
		if(this._xAxisLabelFunction !== null)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._xAxisLabelFunction);
			this._xAxisLabelFunction = null;
		}
		
		var clonedXAxis = {};
		for(var prop in value)
		{
			if(prop == "labelFunction")
			{
				if(value.labelFunction !== null)
				{
					if(typeof value.labelFunction == "function")
					{
						clonedXAxis.labelFunction = YAHOO.widget.FlashAdapter.createProxyFunction(value.labelFunction);
					}
					else
					{
						clonedXAxis.labelFunction = value.labelFunction;
					}
					this._xAxisLabelFunction = clonedXAxis.labelFunction;
				}
			}
			else
			{
				clonedXAxis[prop] = value[prop];
			}
		}
		this._swf.setHorizontalAxis(clonedXAxis);
	},

	/**
	 * Getter for the yAxis attribute.
	 *
	 * @method _setYAxis
	 * @private
	 */
	_setYAxis: function(value)
	{
		if(this._yAxisLabelFunction !== null)
		{
			YAHOO.widget.FlashAdapter.removeProxyFunction(this._yAxisLabelFunction);
			this._yAxisLabelFunction = null;
		}

		var clonedYAxis = {};
		for(var prop in value)
		{
			if(prop == "labelFunction")
			{
				if(value.labelFunction !== null)
				{
					if(typeof value.labelFunction == "function")
					{
						clonedYAxis.labelFunction = YAHOO.widget.FlashAdapter.createProxyFunction(value.labelFunction);
					}
					else
					{
						clonedYAxis.labelFunction = value.labelFunction;
					}
					this._yAxisLabelFunction = clonedYAxis.labelFunction;
				}
			}
			else
			{
				clonedYAxis[prop] = value[prop];
			}
		}
		this._swf.setVerticalAxis(clonedYAxis);
	}
});