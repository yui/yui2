package com.yahoo.astra.fl.charts.legend
{
	/**
	 * Properties required by a chart's legend.
	 * 
	 * @see com.yahoo.astra.fl.charts.Chart
	 * 
	 * @author Josh Tynjala
	 */
	public interface ILegend
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * An Array of LegendItemData objects.
		 * 
		 * @see com.yahoo.astra.fl.charts.legend.LegendItemData
		 */
		function get dataProvider():Array
		
		/**
		 * @private
		 */
		function set dataProvider(value:Array):void;
	}
}