
YAHOO.widget.PieChart = function(containerId, dataSource, attributes)
{
	YAHOO.widget.PieChart.superclass.constructor.call(this, "pie", containerId, dataSource, attributes);
};

YAHOO.lang.extend(YAHOO.widget.PieChart, YAHOO.widget.Chart,
{
	_initAttributes: function(attributes)
	{	
		YAHOO.widget.PieChart.superclass._initAttributes.call(this, attributes);
		
		this.getAttributeConfig("dataField",
		{
			method: this._getDataField
		});
   
		this.setAttributeConfig("dataField",
		{
			validator: YAHOO.lang.isString,
			method: this._setDataField
		});
   
		this.getAttributeConfig("categoryField",
		{
			method: this._getCategoryField
		});
   
		this.setAttributeConfig("categoryField",
		{
			validator: YAHOO.lang.isString,
			method: this._setCategoryField
		});
	},

	_getDataField: function()
	{
		return this._swf.getDataField();
	},

	_setDataField: function(value)
	{
		this._swf.setDataField(value);
	},

	_getCategoryField: function()
	{
		return this._swf.getCategoryField();
	},

	_setCategoryField: function(value)
	{
		this._swf.setCategoryField(value);
	}
});