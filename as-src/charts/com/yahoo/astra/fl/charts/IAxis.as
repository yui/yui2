package com.yahoo.astra.fl.charts
{
	import flash.events.IEventDispatcher;
	import flash.geom.Rectangle;
    
	//--------------------------------------
	//  Styles
	//--------------------------------------
	
    //-- Axis
    
	/**
	 * The line weight for the axis.
	 * 
	 * @default 1
	 */
	[Style(name="axisWeight", type="int")]
    
	/**
	 * The line color for the axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="axisColor", type="uint")]
    
    //-- Title
    
	/**
	 * If true, the axis title is displayed.
	 * 
	 * @default true
	 */
	[Style(name="showTitle", type="Boolean")]
    
	/**
	 * The TextFormat object to use to render the axis title label.
     *
     * @default TextFormat("_sans", 11, 0x000000, false, false, false, '', '', TextFormatAlign.LEFT, 0, 0, 0, 0)
	 */
	[Style(name="titleTextFormat", type="TextFormat")]
    
    //-- Labels
    
	/**
	 * If true, labels are displayed on the axis.
	 * 
	 * @default true
	 */
	[Style(name="showLabels", type="Boolean")]
    
	/**
	 * The distance, in pixels, between a label and the axis.
	 * 
	 * @default 2
	 */
	[Style(name="labelDistance", type="Number")]
    
    //-- Grid Lines - Vertical Axis
    
	/**
	 * If true, grid lines will be displayed on the axis.
	 * 
	 * @default false
	 */
	[Style(name="showGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the grid lines on the axis.
	 * 
	 * @default 1
	 */
	[Style(name="gridLineWeight", type="int")]
    
	/**
	 * The line color for the grid lines on the axis.
	 * 
	 * @default #babdb6
	 */
	[Style(name="gridLineColor", type="uint")]
    
    //-- Minor Grid Lines - Vertical Axis
    
	/**
	 * If true, minor grid lines will be displayed on the axis.
	 * 
	 * @default false
	 */
	[Style(name="showMinorGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the minor grid lines on the axis.
	 * 
	 * @default 1
	 */
	[Style(name="minorGridLineWeight", type="int")]
    
	/**
	 * The line color for the minor grid lines on the axis.
	 * 
	 * @default #eeeeec
	 */
	[Style(name="minorGridLineColor", type="uint")]
    
	//-- Ticks
    
	/**
	 * If true, ticks are displayed on the axis.
	 * 
	 * @default true
	 */
	[Style(name="showTicks", type="Boolean")]
    
	/**
	 * The line weight for the ticks on the axis.
	 * 
	 * @default 1
	 */
	[Style(name="tickWeight", type="int")]
    
	/**
	 * The line color for the ticks on the axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="tickColor", type="uint")]
    
	/**
	 * The length of the ticks on the axis.
	 * 
	 * @default 4
	 */
	[Style(name="tickLength", type="Number")]
	
	/**
	 * The position of the ticks on the axis.
	 * 
	 * @default "cross"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="tickPosition", type="String")]
    
    //-- Minor ticks
    
	/**
	 * If true, ticks are displayed on the axis at minor positions.
	 * 
	 * @default true
	 */
	[Style(name="showMinorTicks", type="Boolean")]
	
	/**
	 * The line weight for the minor ticks on the axis.
	 * 
	 * @default 1
	 */
	[Style(name="minorTickWeight", type="int")]
    
	/**
	 * The line color for the minor ticks on the axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="minorTickColor", type="uint")]
    
	/**
	 * The length of the minor ticks on the axis.
	 * 
	 * @default 3
	 */
	[Style(name="minorTickLength", type="Number")]
	
	/**
	 * The position of the minor ticks on the axis.
	 * 
	 * @default "outside"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="minorTickPosition", type="String")]
	
	/**
	 * A renderer for an axis on a chart.
	 * 
	 * <p>Important: Must be a subclass of DisplayObject</p>
	 * 
	 * @see flash.display.DisplayObject

	 * @author Josh Tynjala
	 */
	public interface IAxis extends IEventDispatcher
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * The plot area to which this axis is associated.
	     */
		function get plotArea():IPlotArea;
		
		/**
		 * @private
		 */
		function set plotArea(value:IPlotArea):void;
		
		/**
		 * The text that will appear next to the axis to indicate information
		 * about the data that it displays.
		 * 
		 * <p>Note: If the axis orientation value is "vertical", the title will only
		 * be displayed if the title font is embedded.
		 */
		function get title():String;
		
		/**
		 * @private
		 */
		function set title(value:String):void;
		
		/**
		 * Determines if the axis is displayed vertically or horizontally.
		 * 
		 * @see com.yahoo.astra.fl.charts.AxisOrientation
		 */
		function get orientation():String;
		
		/**
		 * @private
		 */
		function set orientation(value:String):void;
		
		/**
		 * Sets the direction of the labels and other visual objects along the axis.
		 * By default, vertical axes draw objects from bottom to top, and horizontal
		 * axes draw objects from left to right.
		 */
		function get reverse():Boolean;
		
		/**
		 * @private
		 */
		function set reverse(value:Boolean):void;
		
		/**
		 * Represents the area where content should be drawn within the axis.
		 * This value is used to determine the containing plot area's own
		 * <code>contentBounds</code> property.
		 * 
		 * @see com.yahoo.astra.fl.charts.IPlotArea
		 */
		function get contentBounds():Rectangle;
		
		/**
		 * Determines if items such as labels and other visual objects affect the
		 * <code>contentBounds</code> property of the axis. If false, these objects
		 * may appear outside the chart bounds and overlap other display objects.
		 */
		function get overflowEnabled():Boolean;
		
		/**
		 * @private
		 */
		function set overflowEnabled(value:Boolean):void;
		
		/**
		 * A function may be set to determine the text value of the labels.
		 * 
		 * <pre>function labelFunction(value:Number):String</pre>
		 */
		function get labelFunction():Function;
		
		/**
		 * @private
		 */
		function set labelFunction(value:Function):void;
		
		/**
		 * If true, labels that overlap previously drawn labels will be hidden.
		 */
		function get hideOverlappingLabels():Boolean;
		
		/**
		 * @private
		 */
		function set hideOverlappingLabels(value:Boolean):void
		
		
	//--------------------------------------
	//  Methods
	//--------------------------------------
	
		/**
		 * Calculates the position of a data point along the axis.
		 * 
		 * @param value		The data used to determine the position
		 * @return			The display position in pixels on the axis
		 */
		function valueToLocal(value:Object):Number;
		
		/**
		 * Calculates the value of a data point along the axis based on a position.
		 * 
		 * @param position	The position in pixels used to determine the value
		 * @return			The value on the axis at that position
		 */
		function localToValue(position:Number):Object;
	
		/**
		 * Converts a value on the axis to formatted label text.
		 * 
		 * @param value		the value of the item for which a label is needed
		 * @return			the formatted label text
		 */
		 function valueToLabel(value:Object):String
	
		/**
		 * Determines the axis scale based on the input data set.
		 * Seperating this function from the draw method optimizes processing time,
		 * and it allows the plot area to synchronize its axes.
		 * 
		 * @param data		The complete dataset that could be drawn on the axis.
		 * @return			A limited dataset representing only data that will appear in the axis bounds.
		 */
		function updateScale(data:Array):void;
		
		/**
		 * Calculates the <code>contentBounds</code> value for the axis.
		 * Seperating this function from the draw method optimizes processing time,
		 * and it allows the plot area to synchronize its axes.
		 */
		function updateBounds():void;	
	}
}
