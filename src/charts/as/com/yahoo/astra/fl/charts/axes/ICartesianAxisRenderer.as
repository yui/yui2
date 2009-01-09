package com.yahoo.astra.fl.charts.axes
{
	import flash.geom.Rectangle;
	
	/**
	 * Interface for a cartesian chart's axis renderers.
	 * 
	 * @see com.yahoo.astra.fl.charts.CartesianChart
	 */
	public interface ICartesianAxisRenderer extends IAxisRenderer
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * Determines if the axis is displayed vertically or horizontally.
		 * 
		 * @see com.yahoo.astra.fl.charts.axes.AxisOrientation
		 */
		function get orientation():String;
		
		/**
		 * @private
		 */
		function set orientation(value:String):void;
		
		/**
		 * The title text to display on the axis.
		 */
		function get title():String;
		
		/**
		 * @private
		 */
		function set title(value:String):void;
		
		/**
		 * Represents the area where content should be drawn within the axis.
		 * This value is used to determine the containing chart's own
		 * <code>contentBounds</code> property.
		 */
		function get contentBounds():Rectangle;
		
	//--------------------------------------
	//  Methods
	//--------------------------------------
	
		/**
		 * Calculates the <code>contentBounds</code> value for the axis renderer.
		 * Seperating this function from the draw method optimizes processing time,
		 * and it allows the chart to synchronize its axes.
		 */
		function updateBounds():void;
	}
}