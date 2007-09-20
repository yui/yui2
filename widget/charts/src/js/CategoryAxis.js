/**
 * A type of axis that displays items in categories.
 *
 * @namespace YAHOO.widget
 * @class CategoryAxis
 * @constructor
 */
YAHOO.widget.CategoryAxis = function()
{
	YAHOO.widget.CategoryAxis.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.CategoryAxis, YAHOO.widget.Axis,
{
	type: "category",
	
	/**
	 * A list of category names to display along this axis.
	 *
	 * @property categoryNames
	 * @type Array
	 */
	categoryNames: null,
	
	/**
	 * A string reference to the globally-accessible function that may be called to
	 * determine each of the label values for this axis.
	 *
	 * @property labelFunction
	 * @type String
	 */
	labelFunction: null
});