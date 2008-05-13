package com.yahoo.astra.fl.charts
{
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.events.IEventDispatcher;
	import com.yahoo.astra.fl.charts.series.ISeries;
	
	/**
	 * An interface for a chart with a drawing area.
	 * 
	 * @author Josh Tynjala
	 */
	public interface IPlotArea extends IEventDispatcher
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * The data displayed in the plot area.
		 */
		function get dataProvider():Object;
		
		/**
		 * @private
		 */
		function set dataProvider(value:Object):void;
		
		/**
		 * When data is encountered where an ISeries is expected, it will be converted
		 * to this default type.
		 */
		function get defaultSeriesType():Object;
		
		/**
		 * @private
		 */
		function set defaultSeriesType(value:Object):void;
		
		/**
		 * The <code>Rectangle</code> representing the area where content should be
		 * drawn within the plot area.
		 */
		function get contentBounds():Rectangle;
		
	//--------------------------------------
	//  Methods
	//--------------------------------------
	
		/**
		 * Calculates the position of a data point along the axis.
		 * 
		 * @param data		The data used to determine the position
		 * @param series	The series in which the data appears.
		 * @return			The display position in pixels on the axis
		 */
		function dataToLocal(data:Object, series:ISeries):Point;
		
		/**
		 * Returns the property field corresponding to the input axis.
		 * 
		 * @param axis		an IAxis object appearing in this plot area
		 * @return			the property field to retrieve data for the input axis
		 */
		function axisToField(axis:IAxis):String;
		
		/**
		 * Returns the axis corresponding to the input data field.
		 * 
		 * @param field		a data field corresponding to one of this plot area's axes.
		 * @return			the axis correpsonding to the input data field.
		 */
		function fieldToAxis(field:String):IAxis;
		
		/**
		 * Determines the field used to access data for the input axis and series.
		 * The field may be the chart's default value, or the overridden value
		 * from the input series.
		 * 
		 * @param axis			an IAxis object
		 * @param series		an ISeries object that may have custom data fields
		 * @return				the field associated with this axis for the input series
		 */
		function axisAndSeriesToField(axis:IAxis, series:ISeries):String;
	}
}
