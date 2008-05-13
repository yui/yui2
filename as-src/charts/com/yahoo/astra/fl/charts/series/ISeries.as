package com.yahoo.astra.fl.charts.series
{
	import flash.display.DisplayObject;
	import flash.events.IEventDispatcher;
	import flash.geom.Point;
	import com.yahoo.astra.fl.charts.Chart;
	import com.yahoo.astra.fl.charts.series.ISeriesItemRenderer;
	
	//--------------------------------------
	//  Events
	//--------------------------------------

	/**
	 * Dispatched when the data property for an ISeries changes.
	 */
	[Event(name="dataChange", type="flash.events.Event")]
	
	/**
	 * A renderer for a series displayed on a chart.
	 * 
	 * <p>Important: Must be a subclass of DisplayObject</p>
	 * 
	 * @see flash.display.DisplayObject
	 * @author Josh Tynjala
	 */
	public interface ISeries extends IEventDispatcher
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * The chart in which this series appears.
		 */
		function get chart():Chart;
		
		/**
		 * @private
		 */
		function set chart(value:Chart):void;
		
		/**
		 * The data provider for this series. Accepts <code>Array</code> or <code>XMLList</code> objects.
		 */
		function get dataProvider():Object;
		
		/**
		 * @private
		 */
		function set dataProvider(value:Object):void;
		
		/**
		 * The name of the series as it appears to the user.
		 */
		function get displayName():String;
		
		/**
		 * @private
		 */
		function set displayName(value:String):void;
		
		/**
		 * The number of items in the series.
		 */
		function get length():int;
		
	//--------------------------------------
	//  Methods
	//--------------------------------------
		
		/**
		 * Creates a copy of the ISeries object.
		 * 
		 * @return a new ISeries object
		 */
		function clone():ISeries;
		
		function itemRendererToIndex(renderer:ISeriesItemRenderer):int;
		
		function itemToItemRenderer(item:Object):ISeriesItemRenderer;
	}
}
