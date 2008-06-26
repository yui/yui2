package com.yahoo.astra.fl.charts
{
	import com.yahoo.astra.fl.charts.axes.AxisOrientation;
	import com.yahoo.astra.fl.charts.axes.CategoryAxis;
	import com.yahoo.astra.fl.charts.axes.DefaultAxisRenderer;
	import com.yahoo.astra.fl.charts.axes.DefaultGridLinesRenderer;
	import com.yahoo.astra.fl.charts.axes.IAxis;
	import com.yahoo.astra.fl.charts.axes.ICartesianAxisRenderer;
	import com.yahoo.astra.fl.charts.axes.IGridLinesRenderer;
	import com.yahoo.astra.fl.charts.axes.IStackingAxis;
	import com.yahoo.astra.fl.charts.axes.NumericAxis;
	import com.yahoo.astra.fl.charts.axes.TimeAxis;
	import com.yahoo.astra.fl.charts.series.CartesianSeries;
	import com.yahoo.astra.fl.charts.series.ISeries;
	import com.yahoo.astra.fl.charts.series.IStackedSeries;
	import com.yahoo.astra.fl.utils.UIComponentUtil;
	
	import fl.core.InvalidationType;
	import fl.core.UIComponent;
	
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	//--------------------------------------
	//  Styles
	//--------------------------------------
	
	/**
	 * An object containing style values to be passed to the vertical axis
	 * renderer. The available styles are listed with the class that is used as the
	 * axis renderer.
	 * 
	 * @example
	 * <listing version="3.0">
	 * {
	 * 	showTicks: true,
	 * 	tickWeight: 1,
	 * 	tickColor: 0x999999,
	 * 	showMinorTicks: true,
	 * 	minorTickWeight: 1,
	 * 	minorTickColor: 0xcccccc
	 * }
	 * </listing>
	 * 
	 * <p><strong>Note:</strong> Previously, all styles for the axis renderers
	 * were listed as individual styles on the chart, but since it is possible
	 * to use a renderer class that has completely different styles than the
	 * default renderer, we need to deprecate the previous method to allow
	 * maximum flexibility when new or custom renderers are added.</p>
	 * 
	 * <p>The old styles still exist, and legacy code will continue to work
	 * for the time being. However, it is recommended that you begin porting
	 * code to the new system as soon as possible.</p>
	 * 
	 * <p>For the vertical axis, you should use the following method to set
	 * styles at runtime:</p>
	 * 
	 * @example
	 * <listing version="3.0">
	 * chart.setVerticalAxisStyle("showTicks", false);
	 * </listing>
	 * 
	 * @see setVerticalAxisStyle()
	 * @see com.yahoo.astra.fl.charts.axes.DefaultAxisRenderer
	 */
	[Style(name="verticalAxisStyles", type="Object")]
    
	/**
	 * The class used to instantiate the visual representation of the vertical
	 * axis.
	 * 
	 * @default DefaultAxisRenderer
	 * @see com.yahoo.astra.fl.charts.axes.DefaultAxisRenderer
	 */
	[Style(name="verticalAxisRenderer", type="Class")]
	
	/**
	 * An object containing style values to be passed to the horizontal axis
	 * renderer. The available styles are listed with the class that is used as the
	 * axis renderer.
	 * 
	 * @example
	 * <listing version="3.0">
	 * {
	 * 	showTicks: true,
	 * 	tickWeight: 1,
	 * 	tickColor: 0x999999,
	 * 	showMinorTicks: true,
	 * 	minorTickWeight: 1,
	 * 	minorTickColor: 0xcccccc
	 * }
	 * </listing>
	 * 
	 * <p><strong>Note:</strong> Previously, all styles for the grid lines
	 * renderer were listed as individual styles on the chart, but since it is
	 * possible to use a renderer class that has completely different styles
	 * than the default renderer, we need to deprecate the previous
	 * method to allow maximum flexibility when new or custom renderers are
	 * added.</p>
	 * 
	 * <p>The old styles still exist, and legacy code will continue to work
	 * for the time being. However, it is recommended that you begin porting
	 * code to the new system as soon as possible.</p>
	 * 
	 * <p>For the horizontal axis, you should use the following method to set
	 * styles at runtime:</p>
	 * 
	 * @example
	 * <listing version="3.0">
	 * chart.setHorizontalAxisStyle("showTicks", false);
	 * </listing>
	 * 
	 * @see setHorizontalAxisStyle()
	 * @see com.yahoo.astra.fl.charts.axes.DefaultAxisRenderer
	 */
	[Style(name="horizontalAxisStyles", type="Object")]
    
	/**
	 * The class used to instantiate the visual representation of the horizontal
	 * axis.
	 * 
	 * @default DefaultAxisRenderer
	 * @see com.yahoo.astra.fl.charts.axes.DefaultAxisRenderer
	 */
	[Style(name="horizontalAxisRenderer", type="Class")]
	
	/**
	 * An object containing style values to be passed to the vertical axis grid
	 * lines renderer. The available styles are listed with the class that is used as the
	 * grid lines renderer.
	 * 
	 * @example
	 * <listing version="3.0">
	 * {
	 * 	showLines: true,
	 * 	lineWeight: 1,
	 * 	lineColor: 0x999999,
	 * 	showMinorLines: false
	 * }
	 * </listing>
	 * 
	 * <p><strong>Note:</strong> Previously, all styles for the grid lines were listed as individual
	 * styles on the chart, but since it is possible to use a renderer class
	 * that has completely different styles, we need to deprecate the previous
	 * method to allow maximum flexibility when new or custom renderers are
	 * added.</p>
	 * 
	 * <p>The old styles still exist, and legacy code will continue to work
	 * for the time being. However, it is recommended that you begin porting
	 * code to the new system as soon as possible.</p>
	 * 
	 * <p>For the vertical axis grid lines, you should use the following method to set
	 * styles at runtime:</p>
	 * 
	 * @example
	 * <listing version="3.0">
	 * chart.setVerticalAxisGridLinesStyle("lineColor", 0x999999);
	 * </listing>
	 * 
	 * @see setVerticalAxisGridLinesStyle()
	 * @see com.yahoo.astra.fl.charts.axes.DefaultGridLinesRenderer
	 */
	[Style(name="verticalAxisGridLinesStyles", type="Object")]
    
	/**
	 * The class used to instantiate the vertical axis grid lines.
	 * 
	 * @default DefaultGridLinesRenderer
	 * @see com.yahoo.astra.fl.charts.axes.DefaultGridLinesRenderer
	 */
	[Style(name="verticalAxisGridLinesRenderer", type="Class")]
	
	/**
	 * An object containing style values to be passed to the horizontal axis grid
	 * lines renderer. The available styles are listed with the class that is used as the
	 * grid lines renderer.
	 * 
	 * @example
	 * <listing version="3.0">
	 * {
	 * 	showLines: true,
	 * 	lineWeight: 1,
	 * 	lineColor: 0x999999,
	 * 	showMinorLines: false
	 * }
	 * </listing>
	 * 
	 * <p><strong>Note:</strong> Previously, all styles for the grid lines were listed as individual
	 * styles on the chart, but since it is possible to use a renderer class
	 * that has completely different styles, we need to deprecate the previous
	 * method to allow maximum flexibility when new or custom renderers are
	 * added.</p>
	 * 
	 * <p>The old styles still exist, and legacy code will continue to work
	 * for the time being. However, it is recommended that you begin porting
	 * code to the new system as soon as possible.</p>
	 * 
	 * <p>For the horizontal axis grid lines, you should use the following method to set
	 * styles at runtime:</p>
	 * 
	 * @example
	 * <listing version="3.0">
	 * chart.setHorizontalAxisGridLinesStyle("lineColor", 0x999999);
	 * </listing>
	 * 
	 * @see setHorizontalAxisGridLinesStyle()
	 * @see com.yahoo.astra.fl.charts.axes.DefaultGridLinesRenderer
	 */
	[Style(name="horizontalAxisGridLinesStyles", type="Object")]
    
	/**
	 * The class used to instantiate the horizontal axis grid lines.
	 * 
	 * @default DefaultGridLinesRenderer
	 */
	[Style(name="horizontalAxisGridLinesRenderer", type="Class")]
	
	//-- DEPRECATED Vertical Axis styles
    
	/**
	 * If false, the vertical axis is not drawn. Titles, labels, ticks, and grid
	 * lines may still be drawn, however, so you must specifically hide each
	 * item if nothing should be drawn.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showVerticalAxis", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the vertical axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="verticalAxisWeight", type="int")]
    
	/**
	 * The line color for the vertical axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="verticalAxisColor", type="uint")]
    
    //-- Labels - Vertical Axis
    
	/**
	 * If true, labels will be displayed on the vertical axis.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showVerticalAxisLabels", type="Boolean")]
    
	/**
	 * The distance, in pixels, between a label and the vertical axis.
	 * 
	 * @default 2
	 * @deprecated
	 */
	[Style(name="verticalAxisLabelDistance", type="Number")]
    
	/**
	 * Defines the TextFormat used by labels on the vertical axis. If null,
	 * the <code>textFormat</code> style will be used.
	 * 
	 * @default null
	 * @deprecated
	 */
	[Style(name="verticalAxisTextFormat", type="TextFormat")]
    
	/** 
	 * If true, labels that overlap previously drawn labels on the axis will be
	 * hidden. The first and last labels on the axis will always be drawn.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="verticalAxisHideOverlappingLabels", type="Boolean")]
    
	/** 
	 * The angle, in degrees, of the labels on the vertical axis. May be a value
	 * between <code>-90</code> and <code>90</code>. The font must be embedded
	 * in the SWF and the <code>embedFonts</code> style on the chart must be set
	 * to <code>true</code> before labels may be rotated. If these conditions
	 * aren't met, the labels will not be rotated.
	 * 
	 * @default 0
	 * @deprecated
	 */
	[Style(name="verticalAxisLabelRotation", type="Number")]
    
    //-- Grid - Vertical Axis
    
	/**
	 * An Array of <code>uint</code> color values that is used to draw
	 * alternating fills between the vertical axis' grid lines.
	 * 
	 * @default []
	 * @deprecated
	 */
	[Style(name="verticalAxisGridFillColors", type="Array")]
    
	/**
	 * An Array of alpha values (in the range of 0 to 1) that is used to draw
	 * alternating fills between the vertical axis' grid lines.
	 * 
	 * @default []
	 * @deprecated
	 */
	[Style(name="verticalAxisGridFillAlphas", type="Array")]
    
    //-- DEPRECATED Grid Lines styles - Vertical Axis
    
	/**
	 * If true, grid lines will be displayed on the vertical axis.
	 * 
	 * @default false
	 * @deprecated
	 */
	[Style(name="showVerticalAxisGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the grid lines on the vertical axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="verticalAxisGridLineWeight", type="int")]
    
	/**
	 * The line color for the grid lines on the vertical axis.
	 * 
	 * @default #babdb6
	 * @deprecated
	 */
	[Style(name="verticalAxisGridLineColor", type="uint")]
    
    //-- Minor Grid Lines - Vertical Axis
    
	/**
	 * If true, minor grid lines will be displayed on the vertical axis.
	 * 
	 * @default false
	 * @deprecated
	 */
	[Style(name="showVerticalAxisMinorGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the minor grid lines on the vertical axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorGridLineWeight", type="int")]
    
	/**
	 * The line color for the minor grid lines on the vertical axis.
	 * 
	 * @default #eeeeec
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorGridLineColor", type="uint")]
    
	//-- Ticks - Vertical Axis
    
	/**
	 * If true, ticks will be displayed on the vertical axis.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showVerticalAxisTicks", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the ticks on the vertical axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="verticalAxisTickWeight", type="int")]
    
	/**
	 * The line color for the ticks on the vertical axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="verticalAxisTickColor", type="uint")]
    
	/**
	 * The length, in pixels, of the ticks on the vertical axis.
	 * 
	 * @default 4
	 * @deprecated
	 */
	[Style(name="verticalAxisTickLength", type="Number")]
	
	/**
	 * The position of the ticks on the vertical axis.
	 * 
	 * @default "cross"
	 * @see com.yahoo.astra.fl.charts.axes.TickPosition
	 * @deprecated
	 */
	[Style(name="verticalAxisTickPosition", type="String")]
    
    //-- Minor ticks - Vertical Axis
    
	/**
	 * If true, ticks will be displayed on the vertical axis at minor positions.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showVerticalAxisMinorTicks", type="Boolean")]
	
	/**
	 * The line weight, in pixels, for the minor ticks on the vertical axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorTickWeight", type="int")]
    
	/**
	 * The line color for the minor ticks on the vertical axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorTickColor", type="uint")]
    
	/**
	 * The length of the minor ticks on the vertical axis.
	 * 
	 * @default 3
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorTickLength", type="Number")]
	
	/**
	 * The position of the minor ticks on the vertical axis.
	 * 
	 * @default "outside"
	 * @see com.yahoo.astra.fl.charts.axes.TickPosition
	 * @deprecated
	 */
	[Style(name="verticalAxisMinorTickPosition", type="String")]
	
	//-- Title - Vertical Axis
	
	/**
	 * If true, the vertical axis title will be displayed.
	 * 
	 * @default 2
	 * @deprecated
	 */
	[Style(name="showVerticalAxisTitle", type="Boolean")]
	
	/**
	 * The TextFormat object to use to render the vertical axis title label.
     *
     * @default TextFormat("_sans", 11, 0x000000, false, false, false, '', '', TextFormatAlign.LEFT, 0, 0, 0, 0)
	 * @deprecated
	 */
	[Style(name="verticalAxisTitleTextFormat", type="TextFormat")]
	
	//-- DEPRECATED Horizontal Axis styles
    
	/**
	 * If false, the horizontal axis is not drawn. Titles, labels, ticks, and grid
	 * lines may still be drawn, however, so you must specifically hide each
	 * item if nothing should be drawn.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showHorizontalAxis", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the horizontal axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="horizontalAxisWeight", type="int")]
    
	/**
	 * The line color for the horizontal axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="horizontalAxisColor", type="uint")]
    
    //-- Labels - Horizontal Axis
    
	/**
	 * If true, labels will be displayed on the horizontal axis.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisLabels", type="Boolean")]
    
	/**
	 * The distance, in pixels, between a label and the horizontal axis.
	 * 
	 * @default 2
	 * @deprecated
	 */
	[Style(name="horizontalAxisLabelDistance", type="Number")]
    
	/**
	 * Defines the TextFormat used by labels on the horizontal axis. If null,
	 * the <code>textFormat</code> style will be used.
	 * 
	 * @default null
	 * @deprecated
	 */
	[Style(name="horizontalAxisTextFormat", type="TextFormat")]
    
	/** 
	 * If true, labels that overlap previously drawn labels on the axis will be
	 * hidden. The first and last labels on the axis will always be drawn.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="horizontalAxisHideOverlappingLabels", type="Boolean")]
    
	/** 
	 * The angle, in degrees, of the labels on the horizontal axis. May be a value
	 * between <code>-90</code> and <code>90</code>. The font must be embedded
	 * in the SWF and the <code>embedFonts</code> style on the chart must be set
	 * to <code>true</code> before labels may be rotated. If these conditions
	 * aren't met, the labels will not be rotated.
	 * 
	 * @default 0
	 * @deprecated
	 */
	[Style(name="horizontalAxisLabelRotation", type="Number")]
    
    //-- Grid - Horizontal Axis
    
	/**
	 * An Array of <code>uint</code> color values that is used to draw
	 * alternating fills between the horizontal axis' grid lines.
	 * 
	 * @default []
	 * @deprecated
	 */
	[Style(name="horizontalAxisGridFillColors", type="Array")]
    
	/**
	 * An Array of alpha values (in the range of 0 to 1) that is used to draw
	 * alternating fills between the horizontal axis' grid lines.
	 * 
	 * @default []
	 * @deprecated
	 */
	[Style(name="horizontalAxisGridFillAlphas", type="Array")]
    
    //-- DEPRECATED Grid Lines - Horizontal Axis
    
	/**
	 * If true, grid lines will be displayed on the horizontal axis.
	 * 
	 * @default false
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the grid lines on the horizontal axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="horizontalAxisGridLineWeight", type="int")]
    
	/**
	 * The line color for the grid lines on the horizontal axis.
	 * 
	 * @default #babdb6
	 * @deprecated
	 */
	[Style(name="horizontalAxisGridLineColor", type="uint")]
    
    //-- Minor Grid Lines - Horizontal Axis
    
	/**
	 * If true, minor grid lines will be displayed on the horizontal axis.
	 * 
	 * @default false
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisMinorGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the minor grid lines on the horizontal axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorGridLineWeight", type="int")]
    
	/**
	 * The line color for the minor grid lines on the horizontal axis.
	 * 
	 * @default #eeeeec
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorGridLineColor", type="uint")]
    
	//-- Ticks - Horizontal Axis
    
	/**
	 * If true, ticks will be displayed on the horizontal axis.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisTicks", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the ticks on the horizontal axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="horizontalAxisTickWeight", type="int")]
    
	/**
	 * The line color for the ticks on the horizontal axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="horizontalAxisTickColor", type="uint")]
    
	/**
	 * The length, in pixels, of the ticks on the horizontal axis.
	 * 
	 * @default 4
	 * @deprecated
	 */
	[Style(name="horizontalAxisTickLength", type="Number")]
	
	/**
	 * The position of the ticks on the horizontal axis.
	 * 
	 * @default "cross"
	 * @see com.yahoo.astra.fl.charts.axes.TickPosition
	 * @deprecated
	 */
	[Style(name="horizontalAxisTickPosition", type="String")]
    
    //-- Minor ticks - Horizontal Axis
    
	/**
	 * If true, ticks will be displayed on the horizontal axis at minor positions.
	 * 
	 * @default true
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisMinorTicks", type="Boolean")]
	
	/**
	 * The line weight, in pixels, for the minor ticks on the horizontal axis.
	 * 
	 * @default 1
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorTickWeight", type="int")]
    
	/**
	 * The line color for the minor ticks on the horizontal axis.
	 * 
	 * @default #888a85
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorTickColor", type="uint")]
    
	/**
	 * The length of the minor ticks on the horizontal axis.
	 * 
	 * @default 3
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorTickLength", type="Number")]
	
	/**
	 * The position of the minor ticks on the horizontal axis.
	 * 
	 * @default "outside"
	 * @see com.yahoo.astra.fl.charts.axes.TickPosition
	 * @deprecated
	 */
	[Style(name="horizontalAxisMinorTickPosition", type="String")]
	
	//-- Title - Horizontal Axis
	
	/**
	 * If true, the horizontal axis title will be displayed.
	 * 
	 * @default 2
	 * @deprecated
	 */
	[Style(name="showHorizontalAxisTitle", type="Boolean")]
	
	/**
	 * The TextFormat object to use to render the horizontal axis title label.
     *
     * @default TextFormat("_sans", 11, 0x000000, false, false, false, '', '', TextFormatAlign.LEFT, 0, 0, 0, 0)
	 * @deprecated
	 */
	[Style(name="horizontalAxisTitleTextFormat", type="TextFormat")]
	
	/**
	 * A chart based on the cartesian coordinate system (x, y).
	 * 
	 * @author Josh Tynjala
	 */
	public class CartesianChart extends Chart implements IChart, ICategoryChart
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
	
		/**
		 * @private
		 * Exists simply to reference dependencies that aren't used
		 * anywhere else by this component.
		 */
		private static const DEPENDENCIES:Array = [TimeAxis];
	
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{
			horizontalAxisStyles: {},
			horizontalAxisGridLinesStyles: {},
			horizontalAxisRenderer: DefaultAxisRenderer,
			horizontalAxisGridLinesRenderer: DefaultGridLinesRenderer,
			
			verticalAxisStyles: {},
			verticalAxisGridLinesStyles: {},
			verticalAxisRenderer: DefaultAxisRenderer,
			verticalAxisGridLinesRenderer: DefaultGridLinesRenderer,
			
			//DEPRECATED BELOW THIS POINT!
			//(to be removed in a future version)
			
			//axis
			showHorizontalAxis: true,
			horizontalAxisWeight: 1,
			horizontalAxisColor: 0x888a85,
			
			//title
			showHorizontalAxisTitle: true,
			horizontalAxisTitleTextFormat: new TextFormat("_sans", 11, 0x000000, false, false, false, "", "", TextFormatAlign.LEFT, 0, 0, 0, 0),
			
			//labels
			showHorizontalAxisLabels: true,
			horizontalAxisTextFormat: null,
			horizontalAxisLabelDistance: 2,
			horizontalAxisHideOverlappingLabels: true,
			horizontalAxisLabelRotation: 0,
			
			//grid lines
			horizontalAxisGridLineWeight: 1,
			horizontalAxisGridLineColor: 0xbabdb6,
			showHorizontalAxisGridLines: false,
			horizontalAxisMinorGridLineWeight: 1,
			horizontalAxisMinorGridLineColor: 0xeeeeec,
			showHorizontalAxisMinorGridLines: false,
			horizontalAxisGridFillColors: [],
			horizontalAxisGridFillAlphas: [],
			
			//ticks
			showHorizontalAxisTicks: false,
			horizontalAxisTickWeight: 1,
			horizontalAxisTickColor: 0x888a85,
			horizontalAxisTickLength: 4,
			horizontalAxisTickPosition: "cross",
			showHorizontalAxisMinorTicks: false,
			horizontalAxisMinorTickWeight: 1,
			horizontalAxisMinorTickColor: 0x888a85,
			horizontalAxisMinorTickLength: 3,
			horizontalAxisMinorTickPosition: "outside",
			
			//axis
			showVerticalAxis: true,
			verticalAxisWeight: 1,
			verticalAxisColor: 0x888a85,
			
			//title
			showVerticalAxisTitle: true,
			verticalAxisTitleTextFormat: new TextFormat("_sans", 11, 0x000000, false, false, false, "", "", TextFormatAlign.LEFT, 0, 0, 0, 0),
			
			//labels
			showVerticalAxisLabels: true,
			verticalAxisTextFormat: null,
			verticalAxisLabelDistance: 2,
			verticalAxisHideOverlappingLabels: true,
			verticalAxisLabelRotation: 0,
			
			//grid lines
			showVerticalAxisGridLines: true,
			verticalAxisGridLineWeight: 1,
			verticalAxisGridLineColor: 0xbabdb6,
			verticalAxisMinorGridLineWeight: 1,
			verticalAxisMinorGridLineColor: 0xeeeeec,
			showVerticalAxisMinorGridLines: false,
			verticalAxisGridFillColors: [],
			verticalAxisGridFillAlphas: [],
			
			//ticks
			showVerticalAxisTicks: true,
			verticalAxisTickWeight: 1,
			verticalAxisTickColor: 0x888a85,
			verticalAxisTickLength: 4,
			verticalAxisTickPosition: "cross",
			showVerticalAxisMinorTicks: true,
			verticalAxisMinorTickWeight: 1,
			verticalAxisMinorTickColor: 0x888a85,
			verticalAxisMinorTickLength: 3,
			verticalAxisMinorTickPosition: "outside"
		};
		
		/**
		 * @private
		 * The chart styles that correspond to styles on the horizontal axis.
		 */
		private static const HORIZONTAL_AXIS_STYLES:Object = 
		{
			showAxis: "showHorizontalAxis",
			axisWeight: "horizontalAxisWeight",
			axisColor: "horizontalAxisColor",
			
			textFormat: "textFormat",
			embedFonts: "embedFonts",
			hideOverlappingLabels: "horizontalAxisHideOverlappingLabels",
			labelRotation: "horizontalAxisLabelRotation",
			labelDistance: "horizontalAxisLabelDistance",
			showLabels: "showHorizontalAxisLabels",
			
			showTitle: "showHorizontalAxisTitle",
			titleTextFormat: "horizontalAxisTitleTextFormat",
			
			tickWeight: "horizontalAxisTickWeight",
			tickColor: "horizontalAxisTickColor",
			tickLength: "horizontalAxisTickLength",
			tickPosition: "horizontalAxisTickPosition",
			showTicks: "showHorizontalAxisTicks",

			minorTickWeight: "horizontalAxisMinorTickWeight",
			minorTickColor: "horizontalAxisMinorTickColor",
			minorTickLength: "horizontalAxisMinorTickLength",
			minorTickPosition: "horizontalAxisMinorTickPosition",
			showMinorTicks: "showHorizontalAxisMinorTicks"
		};
		
		/**
		 * @private
		 * The chart styles that correspond to styles on the horizontal axis
		 * grid lines.
		 */
		private static const HORIZONTAL_GRID_LINES_STYLES:Object =
		{
			lineWeight: "horizontalAxisGridLineWeight",
			lineColor: "horizontalAxisGridLineColor",
			showLines: "showHorizontalAxisGridLines",
			
			minorLineWeight: "horizontalAxisMinorGridLineWeight",
			minorLineColor: "horizontalAxisMinorGridLineColor",
			showMinorLines: "showHorizontalAxisMinorGridLines",
			
			fillColors: "horizontalAxisGridFillColors",
			fillAlphas: "horizontalAxisGridFillAlphas"
		}
		
		/**
		 * @private
		 * The chart styles that correspond to styles on the vertical axis.
		 */
		private static const VERTICAL_AXIS_STYLES:Object = 
		{
			showAxis: "showVerticalAxis",
			axisWeight: "verticalAxisWeight",
			axisColor: "verticalAxisColor",
			
			textFormat: "textFormat",
			embedFonts: "embedFonts",
			hideOverlappingLabels: "verticalAxisHideOverlappingLabels",
			labelRotation: "verticalAxisLabelRotation",
			labelDistance: "verticalAxisLabelDistance",
			showLabels: "showVerticalAxisLabels",
			
			showTitle: "showVerticalAxisTitle",
			titleTextFormat: "verticalAxisTitleTextFormat",
			
			tickWeight: "verticalAxisTickWeight",
			tickColor: "verticalAxisTickColor",
			tickLength: "verticalAxisTickLength",
			tickPosition: "verticalAxisTickPosition",
			showTicks: "showVerticalAxisTicks",
			
			minorTickWeight: "verticalAxisMinorTickWeight",
			minorTickColor: "verticalAxisMinorTickColor",
			minorTickLength: "verticalAxisMinorTickLength",
			minorTickPosition: "verticalAxisMinorTickPosition",
			showMinorTicks: "showVerticalAxisMinorTicks"
		};
		
		/**
		 * @private
		 * The chart styles that correspond to styles on the vertical axis
		 * grid lines.
		 */
		private static const VERTICAL_GRID_LINES_STYLES:Object =
		{
			lineWeight: "verticalAxisGridLineWeight",
			lineColor: "verticalAxisGridLineColor",
			showLines: "showVerticalAxisGridLines",
			
			minorLineWeight: "verticalAxisMinorGridLineWeight",
			minorLineColor: "verticalAxisMinorGridLineColor",
			showMinorLines: "showVerticalAxisMinorGridLines",
			
			fillColors: "verticalAxisGridFillColors",
			fillAlphas: "verticalAxisGridFillAlphas"
		}
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		/**
		 * @copy fl.core.UIComponent#getStyleDefinition()
		 */
		public static function getStyleDefinition():Object
		{
			return mergeStyles(defaultStyles, Chart.getStyleDefinition());
		}
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function CartesianChart()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Storage for the contentBounds property.
		 */
		protected var _contentBounds:Rectangle = new Rectangle();
	
		/**
		 * The rectangular bounds where the cartesian chart's data is drawn.
		 */
		public function get contentBounds():Rectangle
		{
			return this._contentBounds;
		}
		
		/**
		 * @private
		 */
		protected var horizontalGridLines:IGridLinesRenderer;
		
		/**
		 * @private
		 */
		protected var verticalGridLines:IGridLinesRenderer;
		
		/**
		 * @private
		 */
		protected var verticalMinorGridLines:Sprite;
		
		/**
		 * @private
		 * The visual representation of the horizontal axis.
		 */
		protected var horizontalAxisRenderer:ICartesianAxisRenderer;
		
		/**
		 * @private
		 * Storage for the horizontalAxis property.
		 */
		private var _horizontalAxis:IAxis;
		
		/**
		 * The axis representing the horizontal range.
		 */
		public function get horizontalAxis():IAxis
		{
			return this._horizontalAxis;
		}
		
		/**
		 * @private
		 */
		public function set horizontalAxis(axis:IAxis):void
		{
			if(this._horizontalAxis != axis)
			{
				this._horizontalAxis = axis;
				this._horizontalAxis.chart = this;
				
				this.invalidate("axes");
			}
		}
		
		/**
		 * @private
		 * The visual representation of the horizontal axis.
		 */
		protected var verticalAxisRenderer:ICartesianAxisRenderer;
		
		/**
		 * @private
		 * Storage for the verticalAxis property.
		 */
		private var _verticalAxis:IAxis;
		
		/**
		 * The axis representing the vertical range.
		 */
		public function get verticalAxis():IAxis
		{
			return this._verticalAxis;
		}
		
		/**
		 * @private
		 */
		public function set verticalAxis(axis:IAxis):void
		{
			if(this._verticalAxis != axis)
			{
				this._verticalAxis = axis;
				this._verticalAxis.chart = this;
				this.invalidate("axes");
			}
		}
	
	//-- Data
		
		/**
		 * @private
		 * Storage for the horizontalField property.
		 */
		private var _horizontalField:String = "category";
		
		[Inspectable(defaultValue="category",verbose=1)]
		/**
		 * If the items displayed on the chart are complex objects, the horizontalField string
		 * defines the property to access when determining the x value.
		 */
		public function get horizontalField():String
		{
			return this._horizontalField;
		}
		
		/**
		 * @private
		 */
		public function set horizontalField(value:String):void
		{
			if(this._horizontalField != value)
			{
				this._horizontalField = value;
				this.invalidate(InvalidationType.DATA);
			}
		}
		
		/**
		 * @private
		 * Storage for the verticalField property.
		 */
		private var _verticalField:String = "value";
		
		[Inspectable(defaultValue="value",verbose=1)]
		/**
		 * If the items displayed on the chart are complex objects, the verticalField string
		 * defines the property to access when determining the y value.
		 */
		public function get verticalField():String
		{
			return this._verticalField;
		}
		
		/**
		 * @private
		 */
		public function set verticalField(value:String):void
		{
			if(this._verticalField != value)
			{
				this._verticalField = value;
				this.invalidate(InvalidationType.DATA);
			}
		}
		
	//-- Titles
		
		/**
		 * @private
		 * Storage for the horizontalAxisTitle property.
		 */
		private var _horizontalAxisTitle:String = "";
		
		[Inspectable(defaultValue="")]
		/**
		 * The title text displayed on the horizontal axis.
		 */
		public function get horizontalAxisTitle():String
		{
			return this._horizontalAxisTitle;
		}
		
		/**
		 * @private
		 */
		public function set horizontalAxisTitle(value:String):void
		{
			if(this._horizontalAxisTitle != value)
			{
				this._horizontalAxisTitle = value;
				this.invalidate(InvalidationType.DATA);
				this.invalidate("axes");
			}
		}
		
		/**
		 * @private
		 * Storage for the verticalAxisTitle property.
		 */
		private var _verticalAxisTitle:String = "";
		
		[Inspectable(defaultValue="")]
		/**
		 * The title text displayed on the horizontal axis.
		 */
		public function get verticalAxisTitle():String
		{
			return this._verticalAxisTitle;
		}
		
		/**
		 * @private
		 */
		public function set verticalAxisTitle(value:String):void
		{
			if(this._verticalAxisTitle != value)
			{
				this._verticalAxisTitle = value;
				this.invalidate(InvalidationType.DATA);
				this.invalidate("axes");
			}
		}
		
	//-- Category names
		
		/**
		 * @private
		 * Storage for the categoryNames property.
		 */
		private var _explicitCategoryNames:Array;
		
		[Inspectable]
		/**
		 * The names of the categories displayed on the category axis. If the
		 * chart does not have a category axis, this value will be ignored.
		 */
		public function get categoryNames():Array
		{
			if(this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
			{
				return this._explicitCategoryNames;
			}
			else if(this.horizontalAxis is CategoryAxis)
			{
				return CategoryAxis(this.horizontalAxis).categoryNames;
			}
			else if(this.verticalAxis is CategoryAxis)
			{
				return CategoryAxis(this.verticalAxis).categoryNames;
			}
			return null;
		}
		
		/**
		 * @private
		 */
		public function set categoryNames(value:Array):void
		{
			if(this._explicitCategoryNames != value)
			{
				this._explicitCategoryNames = value;
				this.invalidate(InvalidationType.DATA);
				this.invalidate("axes");
			}
		}
		
		/**
		 * @private
		 * Storage for the overflowEnabled property.
		 */
		private var _overflowEnabled:Boolean = false;
		
		[Inspectable(defaultValue=false,verbose=1)]
		/**
		 * If false, which is the default, the axes will be resized to fit within the defined
		 * bounds of the plot area. However, if set to true, the axes themselves will grow to
		 * fit the plot area bounds and the labels and other items that normally cause the
		 * resize will be drawn outside.
		 */
		public function get overflowEnabled():Boolean
		{
			return this._overflowEnabled;
		}
		
		/**
		 * @private
		 */
		public function set overflowEnabled(value:Boolean):void
		{
			if(this._overflowEnabled != value)
			{
				this._overflowEnabled = value;
				this.invalidate("axes");
			}
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
	
		/**
		 * @inheritDoc
		 */
		public function itemToPosition(series:ISeries, itemIndex:int):Point
		{
			var horizontalValue:Object = this.itemToAxisValue(series, itemIndex, this.horizontalAxis);
			var xPosition:Number = this.horizontalAxis.valueToLocal(horizontalValue);
			
			var verticalValue:Object = this.itemToAxisValue(series, itemIndex, this.verticalAxis);
			var yPosition:Number = this.verticalAxis.valueToLocal(verticalValue);
			
			return new Point(xPosition, yPosition);
		}
		
		/**
		 * @private
		 */
		public function itemToAxisValue(series:ISeries, itemIndex:int, axis:IAxis, stack:Boolean = true):Object
		{
			if(!stack || !ChartUtil.isStackingAllowed(axis, series))
			{
				var item:Object = series.dataProvider[itemIndex];
				var valueField:String = this.axisAndSeriesToField(axis, series);
				return item[valueField];
			}
			
			var type:Class = UIComponentUtil.getClassDefinition(series);
			var stackAxis:IStackingAxis = IStackingAxis(axis);
			var stackValue:Object;
			var allSeriesOfType:Array = ChartUtil.findSeriesOfType(series, this);
			var seriesIndex:int = allSeriesOfType.indexOf(series);
			var values:Array = [];
			for(var i:int = 0; i <= seriesIndex; i++)
			{
				var stackedSeries:IStackedSeries = IStackedSeries(allSeriesOfType[i]);
				item = stackedSeries.dataProvider[itemIndex];
				valueField = this.axisAndSeriesToField(stackAxis, stackedSeries);
				values.unshift(item[valueField]);
			}
			
			if(values.length > 0)
			{
				stackValue = stackAxis.stack.apply(stackAxis, values);
			}
			return stackValue;
		}
		
		/**
		 * Sets a style on the horizontal axis.
		 */
		public function setHorizontalAxisStyle(name:String, value:Object):void
		{
			this.setComplexStyle("horizontalAxisStyles", name, value);
		}
		
		/**
		 * Sets a style on the vertical axis.
		 */
		public function setVerticalAxisStyle(name:String, value:Object):void
		{
			this.setComplexStyle("verticalAxisStyles", name, value);
		}
		
		/**
		 * Sets a style on the horizontal axis grid lines.
		 */
		public function setHorizontalAxisGridLinesStyle(name:String, value:Object):void
		{
			this.setComplexStyle("horizontalAxisGridLinesStyles", name, value);
		}
		
		/**
		 * Sets a style on the vertical axis grid lines.
		 */
		public function setVerticalAxisGridLinesStyle(name:String, value:Object):void
		{
			this.setComplexStyle("verticalAxisGridLinesStyles", name, value);
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		 
		/**
		 * @private
		 */
		override protected function draw():void
		{
			var dataInvalid:Boolean = this.isInvalid(InvalidationType.DATA);
			var stylesInvalid:Boolean = this.isInvalid(InvalidationType.STYLES);
			var sizeInvalid:Boolean = this.isInvalid(InvalidationType.SIZE);
			var axesInvalid:Boolean = this.isInvalid("axes")
			
			super.draw();
			
			if(stylesInvalid)
			{
				this.updateRenderers();
			}
			
			if(sizeInvalid || dataInvalid || stylesInvalid || axesInvalid)
			{
				this.drawAxes();
					
				//the series display objects are dependant on the axes, so all series redraws must
				//happen after the axes have redrawn
				this.drawSeries();	
			}
			
			this.updateLegend();
		}
		
		/**
		 * @private
		 * Make sure no numeric points exist. Convert to objects compatible with the axes.
		 */
		override protected function refreshSeries():void
		{
			super.refreshSeries();
			
			var numericAxis:IAxis = this.horizontalAxis;
			var otherAxis:IAxis = this.verticalAxis;
			if(this.verticalAxis is NumericAxis)
			{
				numericAxis = this.verticalAxis;
				otherAxis = this.horizontalAxis;
			}
						
			var seriesCount:int = this.series.length;
			for(var i:int = 0; i < seriesCount; i++)
			{
				var currentSeries:ISeries = this.series[i] as ISeries;
				
				var numericField:String = this.axisAndSeriesToField(numericAxis, currentSeries);
				var otherField:String = this.axisAndSeriesToField(otherAxis, currentSeries);
				
				var seriesLength:int = currentSeries.length;
				for(var j:int = 0; j < seriesLength; j++)
				{
					var item:Object = currentSeries.dataProvider[j];
					if(item is Number || !isNaN(Number(item)))
					{
						//if we only have a number, then it is safe to convert
						//to a default type for a category chart.
						//if it's not a number, then the user is expected to update
						//the x and y fields so that the plot area knows how to handle it.
						var point:Object = {};
						point[numericField] = item;
						
						//we assume it's a category axis
						if(this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
						{
							point[otherField] = this.categoryNames[j];
						}
						else point[otherField] = j;
						currentSeries.dataProvider[j] = point;
					}
				}
			}
		}
		
		/**
		 * @private
		 * Creates the default axes. Without user intervention, the x-axis is a category
		 * axis and the y-axis is a numeric axis.
		 */
		override protected function configUI():void
		{
			super.configUI();
			
			//by default, the x axis is for categories. other types of charts will need
			//to override this if they need a numeric or other type of axis
			if(!this.horizontalAxis)
			{
				var categoryAxis:CategoryAxis = new CategoryAxis();
				this.horizontalAxis = categoryAxis;
			}
			
			if(!this.horizontalAxisRenderer)
			{
				var RendererClass:Class = this.getStyleValue("horizontalAxisRenderer") as Class;
				this.horizontalAxisRenderer = new RendererClass(AxisOrientation.HORIZONTAL);
				this.addChild(DisplayObject(this.horizontalAxisRenderer));
				this.horizontalAxis.renderer = this.horizontalAxisRenderer;
			}
			
			if(!this.verticalAxis)
			{
				var numericAxis:NumericAxis = new NumericAxis();
				numericAxis.stackingEnabled = true;
				this.verticalAxis = numericAxis;
			}
			
			if(!this.verticalAxisRenderer)
			{
				RendererClass = this.getStyleValue("verticalAxisRenderer") as Class;
				this.verticalAxisRenderer = new RendererClass(AxisOrientation.VERTICAL);
				this.addChild(DisplayObject(this.verticalAxisRenderer));
				this.verticalAxis.renderer = this.verticalAxisRenderer;
			}
		}
		
		/**
		 * @private
		 * Determines the text that will appear on the data tip.
		 */
		override protected function defaultDataTipFunction(item:Object, index:int, series:ISeries):String
		{
			var text:String = super.defaultDataTipFunction(item, index, series);
			if(text.length > 0)
			{
				text += "\n";
			}
			
			var categoryAxis:CategoryAxis = this.verticalAxis as CategoryAxis;
			var otherAxis:IAxis = this.horizontalAxis;
			if(!categoryAxis)
			{
				categoryAxis = this.horizontalAxis as CategoryAxis;
				otherAxis = this.verticalAxis;
			}
			
			//if we have a category axis, the category is always displayed first
			if(categoryAxis)
			{
				var categoryValue:Object = this.itemToAxisValue(series, index, categoryAxis, false);
				text += categoryAxis.valueToLabel(categoryValue) + "\n";
				
				var otherValue:Object = this.itemToAxisValue(series, index, otherAxis, false);
				text += otherAxis.valueToLabel(otherValue) + "\n";
			}
			//otherwise, display the horizontal axis value first
			else
			{
				var horizontalValue:Object = this.itemToAxisValue(series, index, this.horizontalAxis, false);
				text += horizontalAxis.valueToLabel(horizontalValue) + "\n";
				
				var verticalValue:Object = this.itemToAxisValue(series, index, this.verticalAxis, false);
				text += verticalAxis.valueToLabel(verticalValue) + "\n";
			}
			return text;
		}
	
		/**
		 * @private
		 * Positions and updates the series objects.
		 */
		protected function drawSeries():void
		{
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var seriesWidth:Number = this._contentBounds.width;
			var seriesHeight:Number = this._contentBounds.height;
			
			var contentScrollRect:Rectangle = new Rectangle(0, 0, seriesWidth, seriesHeight);
			this.content.x = contentPadding + this._contentBounds.x;
			this.content.y = contentPadding + this._contentBounds.y;
			
			this.content.scrollRect = contentScrollRect;
			
			var seriesCount:int = this.series.length;
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:UIComponent = this.series[i] as UIComponent;
				series.width = seriesWidth;
				series.height = seriesHeight;
				series.drawNow();
			}
		}
		
		/**
		 * @private
		 * Removes the old axis renderers and create new instances.
		 */
		protected function updateRenderers():void
		{
			//create axis renderers
			
			if(this.horizontalAxisRenderer)
			{
				this.removeChild(DisplayObject(this.horizontalAxisRenderer));
				this.horizontalAxisRenderer = null;
			}
			var RendererClass:Class = this.getStyleValue("horizontalAxisRenderer") as Class;
			this.horizontalAxisRenderer = new RendererClass(AxisOrientation.HORIZONTAL);
			this.addChild(DisplayObject(this.horizontalAxisRenderer));
			this.copyStylesToChild(UIComponent(this.horizontalAxisRenderer), CartesianChart.HORIZONTAL_AXIS_STYLES);
			this.copyStyleObjectToChild(UIComponent(this.horizontalAxisRenderer), this.getStyleValue("horizontalAxisStyles"));
			var horizontalAxisTextFormat:TextFormat = this.getStyleValue("horizontalAxisTextFormat") as TextFormat;
			if(horizontalAxisTextFormat)
			{
				UIComponent(this.horizontalAxisRenderer).setStyle("textFormat", horizontalAxisTextFormat);
			}
			
			if(this.verticalAxisRenderer)
			{
				this.removeChild(DisplayObject(this.verticalAxisRenderer));
				this.verticalAxisRenderer = null;
			}
			RendererClass = this.getStyleValue("verticalAxisRenderer") as Class;
			this.verticalAxisRenderer = new RendererClass(AxisOrientation.VERTICAL);
			this.addChild(DisplayObject(this.verticalAxisRenderer));
			this.copyStylesToChild(UIComponent(verticalAxisRenderer), CartesianChart.VERTICAL_AXIS_STYLES);
			this.copyStyleObjectToChild(UIComponent(this.verticalAxisRenderer), this.getStyleValue("verticalAxisStyles"));
			var verticalAxisTextFormat:TextFormat = this.getStyleValue("verticalAxisTextFormat") as TextFormat;
			if(verticalAxisTextFormat)
			{
				UIComponent(this.verticalAxisRenderer).setStyle("textFormat", verticalAxisTextFormat);
			}
			
			//create grid lines renderers
			
			if(this.horizontalGridLines)
			{
				this.removeChild(DisplayObject(this.horizontalGridLines));
			}
			RendererClass = this.getStyleValue("horizontalAxisGridLinesRenderer") as Class;
			this.horizontalGridLines = new RendererClass();
			this.horizontalGridLines.axisRenderer = this.horizontalAxisRenderer;
			this.addChild(DisplayObject(this.horizontalGridLines));
			this.copyStylesToChild(UIComponent(this.horizontalGridLines), CartesianChart.HORIZONTAL_GRID_LINES_STYLES);
			this.copyStyleObjectToChild(UIComponent(this.horizontalGridLines), this.getStyleValue("horizontalAxisGridLinesStyles")); 
			
			if(this.verticalGridLines)
			{
				this.removeChild(DisplayObject(this.verticalGridLines));
			}
			RendererClass = this.getStyleValue("verticalAxisGridLinesRenderer") as Class;
			this.verticalGridLines = new RendererClass();
			this.verticalGridLines.axisRenderer = this.verticalAxisRenderer;
			this.addChild(DisplayObject(this.verticalGridLines));
			this.copyStylesToChild(UIComponent(this.verticalGridLines), CartesianChart.VERTICAL_GRID_LINES_STYLES);
			this.copyStyleObjectToChild(UIComponent(this.verticalGridLines), this.getStyleValue("verticalAxisGridLinesStyles")); 
		}
		
		/**
		 * @private
		 * Positions and sizes the axes based on their edge metrics.
		 */
		protected function drawAxes():void
		{	
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var axisWidth:Number = this.width - (2 * contentPadding);
			var axisHeight:Number = this.height - (2 * contentPadding);
			
			this.horizontalAxis.renderer = this.horizontalAxisRenderer;
			if(horizontalAxis is CategoryAxis && this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
			{
				CategoryAxis(this.horizontalAxis).categoryNames = this._explicitCategoryNames;
			}
			var horizontalAxisRenderer:UIComponent = UIComponent(this.horizontalAxisRenderer);
			horizontalAxisRenderer.move(contentPadding, contentPadding);
			horizontalAxisRenderer.setSize(axisWidth, axisHeight);
			this.setChildIndex(horizontalAxisRenderer, this.numChildren - 1);
						
			this.verticalAxis.renderer = this.verticalAxisRenderer;
			if(verticalAxis is CategoryAxis && this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
			{
				CategoryAxis(this.verticalAxis).categoryNames = this._explicitCategoryNames;
			}
			var verticalAxisRenderer:UIComponent = UIComponent(this.verticalAxisRenderer);
			verticalAxisRenderer.move(contentPadding, contentPadding);
			verticalAxisRenderer.setSize(axisWidth, axisHeight);
			this.setChildIndex(verticalAxisRenderer, this.numChildren - 1);
			
			//TODO: This should probably be done differently...
			this.horizontalAxisRenderer.title = this.horizontalAxis.title;
			this.verticalAxisRenderer.title = this.verticalAxis.title;
			
			this.updateAxisScalesAndBounds();
			horizontalAxisRenderer.drawNow();
			verticalAxisRenderer.drawNow();
			
			this.drawGridLines();
		}
		
		/**
		 * @private
		 * Determines the axis scales, and positions the axes based on their
		 * <code>contentBounds</code> properties.
		 */
		protected function updateAxisScalesAndBounds():void
		{
			//reset the ticks and minor ticks (start with a clean axis)
			this.horizontalAxisRenderer.ticks = [];
			this.horizontalAxisRenderer.minorTicks = [];
			this.verticalAxisRenderer.ticks = [];
			this.verticalAxisRenderer.minorTicks = [];
			
			/*
				we need to run this a few times because the axis positions and
				sizes are slowly corrected until they properly align themselves.
				
				NOTE: If this seems to be failing, increase the loop count.
				more iterations == more accuracy
				
				worst case scenario: use a while loop and check to see if
				calculateContentBounds() has made changes to the sizes or
				positions of the renderers. if not, then break. if there have
				been corrections, keep going. I suggest that you stop the loop
				at 10 iterations because that's most likely an infinite loop.
				you're probably only running into rounding errors at that point,
				so there's little reason to continue anyway.
			*/
			this.calculateContentBounds();
			
			var count:int = 0;
			do
			{
				var hOldContentBounds:Rectangle = this.horizontalAxisRenderer.contentBounds.clone();
				var vOldContentBounds:Rectangle = this.verticalAxisRenderer.contentBounds.clone();
				this._horizontalAxis.updateScale(this.series);
				this._verticalAxis.updateScale(this.series);
				this.calculateContentBounds();
				count++;
			}
			//if count == 10, we're close enough
			while(count < 10 &&
				(!hOldContentBounds.equals(this.horizontalAxisRenderer.contentBounds) ||
				!vOldContentBounds.equals(this.verticalAxisRenderer.contentBounds)))
		}
		
		/**
		 * @private
		 * Combine the content bounds to determine the series positioning.
		 */
		protected function calculateContentBounds():void
		{
			this.horizontalAxisRenderer.updateBounds();
			this.verticalAxisRenderer.updateBounds();
			
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var axisWidth:Number = this.width - (2 * contentPadding);
			var axisHeight:Number = this.height - (2 * contentPadding);
			
			var horizontalAxisRenderer:UIComponent = this.horizontalAxisRenderer as UIComponent;
			var verticalAxisRenderer:UIComponent = this.verticalAxisRenderer as UIComponent;
			
			var horizontalBounds:Rectangle = this.horizontalAxisRenderer.contentBounds;
			var verticalBounds:Rectangle = this.verticalAxisRenderer.contentBounds;
			this._contentBounds = new Rectangle();
			
			this._contentBounds.x = Math.max(horizontalBounds.x, verticalBounds.x);
			this._contentBounds.y = Math.max(horizontalBounds.y, verticalBounds.y);
			this._contentBounds.width = Math.min(horizontalBounds.width, verticalBounds.width);
			this._contentBounds.height = Math.min(horizontalBounds.height, verticalBounds.height);
			
			var hRight:Number = horizontalAxisRenderer.width - horizontalBounds.width - horizontalBounds.x;
			var hBottom:Number = horizontalAxisRenderer.height - horizontalBounds.height - horizontalBounds.y;
			var vRight:Number = verticalAxisRenderer.width - verticalBounds.width - verticalBounds.x;
			var vBottom:Number = verticalAxisRenderer.height - verticalBounds.height - verticalBounds.y;
			var contentBottom:Number = Math.max(hBottom, vBottom);
			var contentRight:Number = Math.max(hRight, vRight);
			
			horizontalAxisRenderer.x = contentPadding + this._contentBounds.x - horizontalBounds.x;
			horizontalAxisRenderer.y = contentPadding + this._contentBounds.y - horizontalBounds.y;
			horizontalAxisRenderer.width = axisWidth - (contentRight - hRight) - (this._contentBounds.x - horizontalBounds.x);
			horizontalAxisRenderer.height = axisHeight - (contentBottom - hBottom) - (this._contentBounds.y - horizontalBounds.y);
			verticalAxisRenderer.x = contentPadding + this._contentBounds.x - verticalBounds.x;
			verticalAxisRenderer.y = contentPadding + this._contentBounds.y - verticalBounds.y;
			verticalAxisRenderer.width = axisWidth - (contentRight - vRight) - (this._contentBounds.x - verticalBounds.x);
			verticalAxisRenderer.height = axisHeight - (contentBottom - vBottom) - (this._contentBounds.y - verticalBounds.y);
		}
		
		/**
		 * @private
		 * Draws the axis grid lines, if they exist.
		 */
		protected function drawGridLines():void
		{
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var horizontalAxisRenderer:UIComponent = this.horizontalAxisRenderer as UIComponent;
			var verticalAxisRenderer:UIComponent = this.verticalAxisRenderer as UIComponent;
			
			var index:int = 0;
			if(this.background)
			{
				index++;
			}
			
			if(this.horizontalGridLines)
			{
				var horizontalGridLines:UIComponent = this.horizontalGridLines as UIComponent;
				this.setChildIndex(horizontalGridLines, index++);
				horizontalGridLines.x = contentPadding + this.contentBounds.x;
				horizontalGridLines.y = contentPadding + this.contentBounds.y;
				horizontalGridLines.drawNow();
			}
			
			if(this.verticalGridLines)
			{
				var verticalGridLines:UIComponent = this.verticalGridLines as UIComponent;
				this.setChildIndex(verticalGridLines, index++);
				verticalGridLines.x = contentPadding + this.contentBounds.x;
				verticalGridLines.y = contentPadding + this.contentBounds.y;
				verticalGridLines.drawNow();
			}
		}
		 
		 /**
		  * @private
		  */
		 protected function setComplexStyle(complexName:String, subStyleName:String, subStyleValue:Object):void
		 {
			var container:Object = this.getStyleValue(complexName);
			var copy:Object = {};
			for(var prop:String in container)
			{
				copy[prop] = container[prop];
			}
			copy[subStyleName] = subStyleValue;
			this.setStyle(complexName, copy);
		 } 
		
		/**
		 * @private
		 */
		protected function copyStyleObjectToChild(child:UIComponent, styles:Object):void
		{
			if(!child)
			{
				return;
			}
			
			for(var prop:String in styles)
			{
				child.setStyle(prop, styles[prop]);
			}
		}
		
		/**
		 * @private
		 */
		protected function axisAndSeriesToField(axis:IAxis, series:ISeries):String
		{
			var cartesianSeries:CartesianSeries = series as CartesianSeries;
			var field:String = this.axisToField(axis);
			var renderer:ICartesianAxisRenderer = this.axisToAxisRenderer(axis);
			if(renderer.orientation == AxisOrientation.VERTICAL && cartesianSeries.verticalField)
			{
				field = cartesianSeries.verticalField;
			}
			else if(renderer.orientation == AxisOrientation.HORIZONTAL && cartesianSeries.horizontalField)
			{
				field = cartesianSeries.horizontalField;
			}
			
			return field;
		}
	
		/**
		 * @private
		 */
		protected function axisToField(axis:IAxis):String
		{
			if(axis == this.horizontalAxis)
			{
				return this.horizontalField;
			}
			else if(axis == this.verticalAxis)
			{
				return this.verticalField;
			}
			return null;
		}
		
		/**
		 * @private
		 */
		protected function fieldToAxis(field:String):IAxis
		{
			if(field == this.horizontalField)
			{
				return this.horizontalAxis;
			}
			else if(field == this.verticalField)
			{
				return this.verticalAxis;
			}
			return null;
		}
		
		/**
		 * @private
		 * Finds the renderer for the specified axis.
		 */
		protected function axisToAxisRenderer(axis:IAxis):ICartesianAxisRenderer
		{
			if(axis == this.horizontalAxis)
			{
				return this.horizontalAxisRenderer;
			}
			else if(axis == this.verticalAxis)
			{
				return this.verticalAxisRenderer;
			}
			return null;
		}
	}
}
