/**
 * A type of axis whose units are measured in time-based values.
 *
 * @namespace YAHOO.widget
 * @class TimeAxis
 * @constructor
 */
YAHOO.widget.TimeAxis = function()
{
	YAHOO.widget.TimeAxis.superclass.constructor.call(this);
};

YAHOO.lang.extend(YAHOO.widget.TimeAxis, YAHOO.widget.Axis,
{
	type: "time",
	
	/**
	 * The minimum value drawn by the axis. If not set explicitly, the axis minimum
	 * will be calculated automatically.
	 *
	 * @property minimum
	 * @type Date
	 */
	minimum: null,

	/**
	 * The maximum value drawn by the axis. If not set explicitly, the axis maximum
	 * will be calculated automatically.
	 *
	 * @property maximum
	 * @type Number
	 */
	maximum: null,
	
	/**
	 * The spacing between major intervals on this axis.
	 *
	 * @property majorUnit
	 * @type Number
	 */
	majorUnit: NaN,
	
	/**
	 * The time unit used by the majorUnit.
	 *
	 * @property majorTimeUnit
	 * @type String
	 */
	majorTimeUnit: null,
	
	/**
	 * The spacing between minor intervals on this axis.
	 *
	 * @property majorUnit
	 * @type Number
	 */
	minorUnit: NaN,
	
	/**
	 * The time unit used by the minorUnit.
	 *
	 * @property majorTimeUnit
	 * @type String
	 */
	minorTimeUnit: null,

	/**
	 * If true, the labels, ticks, gridlines, and other objects will snap to
	 * the nearest major or minor unit. If false, their position will be based
	 * on the minimum value.
	 *
	 * @property snapToUnits
	 * @type Boolean
	 */
	snapToUnits: true,

	/**
	 * A string reference to the globally-accessible function that may be called to
	 * determine each of the label values for this axis.
	 *
	 * @property labelFunction
	 * @type String
	 */
	labelFunction: null
});