/**
 * Defines a CartesianChart's vertical or horizontal axis.
 *
 * @namespace YAHOO.widget
 * @class Axis
 * @constructor
 */
YAHOO.widget.Axis = function()
{
};

YAHOO.widget.Axis.prototype = 
{
	/**
	 * The type of axis.
	 *
	 * @property type
	 * @type String
	 */
	type: null,
	
	/**
	 * If true, the items on the axis will be drawn in opposite direction.
	 *
	 * @property reverse
	 * @type Boolean
	 */
	reverse: false,
	
	/**
	 * A string reference to the globally-accessible function that may be called to
	 * determine each of the label values for this axis. Also accepts function references.
	 *
	 * @property labelFunction
	 * @type String
	 */
	labelFunction: null
};