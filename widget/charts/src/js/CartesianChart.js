YAHOO.widget.CartesianChart = function(type, containerId, dataSource, attributes)
{
	YAHOO.widget.CartesianChart.superclass.constructor.call(this, type, containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.CartesianChart, YAHOO.widget.Chart,
{

	_initAttributes: function(attributes)
	{	
		YAHOO.widget.CartesianChart.superclass._initAttributes.call(this, attributes);

		this.getAttributeConfig("horizontalField",
		{
			method: this._getHorizontalField
		});

		this.setAttributeConfig("horizontalField",
		{
			validator: YAHOO.lang.isString,
			method: this._setHorizontalField
		});

		this.getAttributeConfig("verticalField",
		{
			method: this._getVerticalField
		});

		this.setAttributeConfig("verticalField",
		{
			validator: YAHOO.lang.isString,
			method: this._setVerticalField
		});

		this.getAttributeConfig("horizontalAxisTitle",
		{
			method: this._getHorizontalAxisTitle
		});

		this.setAttributeConfig("horizontalAxisTitle",
		{
			validator: YAHOO.lang.isString,
			method: this._setHorizontalAxisTitle
		});

		this.getAttributeConfig("verticalAxisTitle",
		{
			method: this._getVerticalAxisTitle
		});

		this.setAttributeConfig("verticalAxisTitle",
		{
			validator: YAHOO.lang.isString,
			method: this._setVerticalAxisTitle
		});

		this.setAttributeConfig("horizontalAxis",
		{
			method: this._setHorizontalAxis
		});

		this.setAttributeConfig("verticalAxis",
		{
			method: this._setVerticalAxis
		});
	},

	_getHorizontalField: function()
	{
		return this._swf.getHorizontalField();
	},

	_setHorizontalField: function(value)
	{
		this._swf.setHorizontalField(value);
	},

	_getVerticalField: function()
	{
		return this._swf.getVerticalField();
	},

	_setVerticalField: function(value)
	{
		this._swf.setVerticalField(value);
	},

	_getHorizontalAxisTitle: function()
	{
		return this._swf.getHorizontalAxisTitle();
	},

	_setHorizontalAxisTitle: function(value)
	{
		this._swf.setHorizontalAxisTitle(value);
	},

	_getVerticalAxisTitle: function()
	{
		return this._swf.getVerticalAxisTitle();
	},

	_setVerticalAxisTitle: function(value)
	{
		this._swf.setVerticalAxisTitle(value);
	},

	_setHorizontalAxis: function(value)
	{
		this._swf.setHorizontalAxis(value);
	},

	_setVerticalAxis: function(value)
	{
		this._swf.setVerticalAxis(value);
	}
});