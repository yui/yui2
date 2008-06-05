package com.yahoo.astra.fl.charts
{
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.events.IEventDispatcher;
	import com.yahoo.astra.fl.charts.series.ISeries;
	import com.yahoo.astra.fl.charts.axes.IAxis;
	
	/**
	 * Methods and properties expected to be defined by all charts.
	 * 
	 * @author Josh Tynjala
	 */
	public interface IChart extends IEventDispatcher
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * The data to be displayed by the chart. Accepted data types include
		 * all of the following:
		 * 
		 * <ul>
		 * 	<li>An ISeries instance with its own data provider.</li>
		 * 	<li>An Array containing ISeries instances</li>
		 * 	<li>An Array containing Numbers.</li>
		 * 	<li>An Array containing complex objects.</li>
		 * 	<li>An XMLList</li>
		 * 	<li>An Array containing Arrays of Numbers or complex objects.
		 * </ul>
		 * 
		 * <p>Note: When complex objects or XML is used in the data provider,
		 * developers must define "fields" used to access data used by the chart.
		 * For instance, CartesianChart exposes <code>horizontalField</code> and
		 * <code>verticalField</code> properties. PieChart exposes <code>dataField</code>
		 * and <code>categoryField</code> properties.
		 * 
		 * @see com.yahoo.astra.fl.charts.series.ISeries
		 */
		function get dataProvider():Object;
		
		/**
		 * @private
		 */
		function set dataProvider(value:Object):void;
		
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
