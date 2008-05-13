package com.yahoo.astra.fl.charts
{
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.geom.ColorTransform;
	import flash.events.Event;
	import flash.display.DisplayObject;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import fl.core.UIComponent;
	import fl.core.InvalidationType;
	import com.yahoo.astra.fl.charts.series.ISeries;
	import com.yahoo.astra.fl.charts.series.CartesianSeries;
	
	//--------------------------------------
	//  Styles
	//--------------------------------------
	
	//-- Vertical Axis
    
	/**
	 * The line weight, in pixels, for the vertical axis.
	 * 
	 * @default 1
	 */
	[Style(name="verticalAxisWeight", type="int")]
    
	/**
	 * The line color for the vertical axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="verticalAxisColor", type="uint")]
    
    //-- Labels - Vertical Axis
    
	/**
	 * If true, labels will be displayed on the vertical axis.
	 * 
	 * @default true
	 */
	[Style(name="showVerticalAxisLabels", type="Boolean")]
    
	/**
	 * The distance, in pixels, between a label and the vertical axis.
	 * 
	 * @default 2
	 */
	[Style(name="verticalAxisLabelDistance", type="Number")]
    
    //-- Grid Lines - Vertical Axis
    
	/**
	 * If true, grid lines will be displayed on the vertical axis.
	 * 
	 * @default false
	 */
	[Style(name="showVerticalAxisGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the grid lines on the vertical axis.
	 * 
	 * @default 1
	 */
	[Style(name="verticalAxisGridLineWeight", type="int")]
    
	/**
	 * The line color for the grid lines on the vertical axis.
	 * 
	 * @default #babdb6
	 */
	[Style(name="verticalAxisGridLineColor", type="uint")]
    
    //-- Minor Grid Lines - Vertical Axis
    
	/**
	 * If true, minor grid lines will be displayed on the vertical axis.
	 * 
	 * @default false
	 */
	[Style(name="showVerticalAxisMinorGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the minor grid lines on the vertical axis.
	 * 
	 * @default 1
	 */
	[Style(name="verticalAxisMinorGridLineWeight", type="int")]
    
	/**
	 * The line color for the minor grid lines on the vertical axis.
	 * 
	 * @default #eeeeec
	 */
	[Style(name="verticalAxisMinorGridLineColor", type="uint")]
    
	//-- Ticks - Vertical Axis
    
	/**
	 * If true, ticks will be displayed on the vertical axis.
	 * 
	 * @default true
	 */
	[Style(name="showVerticalAxisTicks", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the ticks on the vertical axis.
	 * 
	 * @default 1
	 */
	[Style(name="verticalAxisTickWeight", type="int")]
    
	/**
	 * The line color for the ticks on the vertical axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="verticalAxisTickColor", type="uint")]
    
	/**
	 * The length, in pixels, of the ticks on the vertical axis.
	 * 
	 * @default 4
	 */
	[Style(name="verticalAxisTickLength", type="Number")]
	
	/**
	 * The position of the ticks on the vertical axis.
	 * 
	 * @default "cross"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="verticalAxisTickPosition", type="String")]
    
    //-- Minor ticks - Vertical Axis
    
	/**
	 * If true, ticks will be displayed on the vertical axis at minor positions.
	 * 
	 * @default true
	 */
	[Style(name="showVerticalAxisMinorTicks", type="Boolean")]
	
	/**
	 * The line weight, in pixels, for the minor ticks on the vertical axis.
	 * 
	 * @default 1
	 */
	[Style(name="verticalAxisMinorTickWeight", type="int")]
    
	/**
	 * The line color for the minor ticks on the vertical axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="verticalAxisMinorTickColor", type="uint")]
    
	/**
	 * The length of the minor ticks on the vertical axis.
	 * 
	 * @default 3
	 */
	[Style(name="verticalAxisMinorTickLength", type="Number")]
	
	/**
	 * The position of the minor ticks on the vertical axis.
	 * 
	 * @default "outside"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="verticalAxisMinorTickPosition", type="String")]
	
	//-- Title - Vertical Axis
	
	/**
	 * If true, the vertical axis title will be displayed.
	 * 
	 * @default 2
	 */
	[Style(name="showVerticalAxisTitle", type="Boolean")]
	
	/**
	 * The TextFormat object to use to render the vertical axis title label.
     *
     * @default TextFormat("_sans", 11, 0x000000, false, false, false, '', '', TextFormatAlign.LEFT, 0, 0, 0, 0)
	 */
	[Style(name="verticalAxisTitleTextFormat", type="TextFormat")]
	
	//-- Horizontal Axis
    
	/**
	 * The line weight, in pixels, for the horizontal axis.
	 * 
	 * @default 1
	 */
	[Style(name="horizontalAxisWeight", type="int")]
    
	/**
	 * The line color for the horizontal axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="horizontalAxisColor", type="uint")]
    
    //-- Labels - Horizontal Axis
    
	/**
	 * If true, labels will be displayed on the horizontal axis.
	 * 
	 * @default true
	 */
	[Style(name="showHorizontalAxisLabels", type="Boolean")]
    
	/**
	 * The distance, in pixels, between a label and the horizontal axis.
	 * 
	 * @default 2
	 */
	[Style(name="horizontalAxisLabelDistance", type="Number")]
    
    //-- Grid Lines - Horizontal Axis
    
	/**
	 * If true, grid lines will be displayed on the horizontal axis.
	 * 
	 * @default false
	 */
	[Style(name="showHorizontalAxisGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the grid lines on the horizontal axis.
	 * 
	 * @default 1
	 */
	[Style(name="horizontalAxisGridLineWeight", type="int")]
    
	/**
	 * The line color for the grid lines on the horizontal axis.
	 * 
	 * @default #babdb6
	 */
	[Style(name="horizontalAxisGridLineColor", type="uint")]
    
    //-- Minor Grid Lines - Horizontal Axis
    
	/**
	 * If true, minor grid lines will be displayed on the horizontal axis.
	 * 
	 * @default false
	 */
	[Style(name="showHorizontalAxisMinorGridLines", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the minor grid lines on the horizontal axis.
	 * 
	 * @default 1
	 */
	[Style(name="horizontalAxisMinorGridLineWeight", type="int")]
    
	/**
	 * The line color for the minor grid lines on the horizontal axis.
	 * 
	 * @default #eeeeec
	 */
	[Style(name="horizontalAxisMinorGridLineColor", type="uint")]
    
	//-- Ticks - Horizontal Axis
    
	/**
	 * If true, ticks will be displayed on the horizontal axis.
	 * 
	 * @default true
	 */
	[Style(name="showHorizontalAxisTicks", type="Boolean")]
    
	/**
	 * The line weight, in pixels, for the ticks on the horizontal axis.
	 * 
	 * @default 1
	 */
	[Style(name="horizontalAxisTickWeight", type="int")]
    
	/**
	 * The line color for the ticks on the horizontal axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="horizontalAxisTickColor", type="uint")]
    
	/**
	 * The length, in pixels, of the ticks on the horizontal axis.
	 * 
	 * @default 4
	 */
	[Style(name="horizontalAxisTickLength", type="Number")]
	
	/**
	 * The position of the ticks on the horizontal axis.
	 * 
	 * @default "cross"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="horizontalAxisTickPosition", type="String")]
    
    //-- Minor ticks - Horizontal Axis
    
	/**
	 * If true, ticks will be displayed on the horizontal axis at minor positions.
	 * 
	 * @default true
	 */
	[Style(name="showHorizontalAxisMinorTicks", type="Boolean")]
	
	/**
	 * The line weight, in pixels, for the minor ticks on the horizontal axis.
	 * 
	 * @default 1
	 */
	[Style(name="horizontalAxisMinorTickWeight", type="int")]
    
	/**
	 * The line color for the minor ticks on the horizontal axis.
	 * 
	 * @default #888a85
	 */
	[Style(name="horizontalAxisMinorTickColor", type="uint")]
    
	/**
	 * The length of the minor ticks on the horizontal axis.
	 * 
	 * @default 3
	 */
	[Style(name="horizontalAxisMinorTickLength", type="Number")]
	
	/**
	 * The position of the minor ticks on the horizontal axis.
	 * 
	 * @default "outside"
	 * @see com.yahoo.astra.fl.charts.TickPosition
	 */
	[Style(name="horizontalAxisMinorTickPosition", type="String")]
	
	//-- Title - Horizontal Axis
	
	/**
	 * If true, the horizontal axis title will be displayed.
	 * 
	 * @default 2
	 */
	[Style(name="showHorizontalAxisTitle", type="Boolean")]
	
	/**
	 * The TextFormat object to use to render the horizontal axis title label.
     *
     * @default TextFormat("_sans", 11, 0x000000, false, false, false, '', '', TextFormatAlign.LEFT, 0, 0, 0, 0)
	 */
	[Style(name="horizontalAxisTitleTextFormat", type="TextFormat")]
	
	/**
	 * A chart based on the cartesian coordinate system (x, y).
	 * 
	 * @author Josh Tynjala
	 */
	public class CartesianChart extends Chart implements IPlotArea, ICategoryChart
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
	
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{
			//axis
			horizontalAxisWeight: 1,
			horizontalAxisColor: 0x888a85,
			
			//title
			showHorizontalAxisTitle: true,
			horizontalAxisTitleTextFormat: new TextFormat("_sans", 11, 0x000000, false, false, false, "", "", TextFormatAlign.LEFT, 0, 0, 0, 0),
			
			//labels
			showHorizontalAxisLabels: true,
			horizontalAxisLabelDistance: 2,
			
			//grid lines
			horizontalAxisGridLineWeight: 1,
			horizontalAxisGridLineColor: 0xbabdb6,
			showHorizontalAxisGridLines: false,
			horizontalAxisMinorGridLineWeight: 1,
			horizontalAxisMinorGridLineColor: 0xeeeeec,
			showHorizontalAxisMinorGridLines: false,
			
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
			verticalAxisWeight: 1,
			verticalAxisColor: 0x888a85,
			
			//title
			showVerticalAxisTitle: true,
			verticalAxisTitleTextFormat: new TextFormat("_sans", 11, 0x000000, false, false, false, "", "", TextFormatAlign.LEFT, 0, 0, 0, 0),
			
			//labels
			showVerticalAxisLabels: true,
			verticalAxisLabelDistance: 2,
			
			//grid lines
			showVerticalAxisGridLines: true,
			verticalAxisGridLineWeight: 1,
			verticalAxisGridLineColor: 0xbabdb6,
			verticalAxisMinorGridLineWeight: 1,
			verticalAxisMinorGridLineColor: 0xeeeeec,
			showVerticalAxisMinorGridLines: false,
			
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
			axisWeight: "horizontalAxisWeight",
			axisColor: "horizontalAxisColor",
			textFormat: "textFormat",
			showTitle: "showHorizontalAxisTitle",
			titleTextFormat: "horizontalAxisTitleTextFormat",
			labelDistance: "horizontalAxisLabelDistance",
			showLabels: "showHorizontalAxisLabels",
			gridLineWeight: "horizontalAxisGridLineWeight",
			gridLineColor: "horizontalAxisGridLineColor",
			showGridLines: "showHorizontalAxisGridLines",
			minorGridLineWeight: "horizontalAxisMinorGridLineWeight",
			minorGridLineColor: "horizontalAxisMinorGridLineColor",
			showMinorGridLines: "showHorizontalAxisMinorGridLines",
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
		 * The chart styles that correspond to styles on the vertical axis.
		 */
		private static const VERTICAL_AXIS_STYLES:Object = 
		{
			axisWeight: "verticalAxisWeight",
			axisColor: "verticalAxisColor",
			textFormat: "textFormat",
			showTitle: "showVerticalAxisTitle",
			titleTextFormat: "verticalAxisTitleTextFormat",
			labelDistance: "verticalAxisLabelDistance",
			showLabels: "showVerticalAxisLabels",
			gridLineWeight: "verticalAxisGridLineWeight",
			gridLineColor: "verticalAxisGridLineColor",
			showGridLines: "showVerticalAxisGridLines",
			minorGridLineWeight: "verticalAxisMinorGridLineWeight",
			minorGridLineColor: "verticalAxisMinorGridLineColor",
			showMinorGridLines: "showVerticalAxisMinorGridLines",
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
		 */
		protected var horizontalGridLines:Sprite;
		
		/**
		 * @private
		 */
		protected var horizontalMinorGridLines:Sprite;
		
		/**
		 * @private
		 */
		protected var verticalGridLines:Sprite;
		
		/**
		 * @private
		 */
		protected var verticalMinorGridLines:Sprite;
		
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
				//remove the old horizontal axis and any related grid lines
				if(this._horizontalAxis)
				{
					if(this.horizontalGridLines)
					{
						this.removeChild(this.horizontalGridLines);
						this.horizontalGridLines = null;
					}
						
					if(this.horizontalMinorGridLines)
					{
						this.removeChild(this.horizontalMinorGridLines);
						this.horizontalMinorGridLines = null;
					}
					this.removeChild(DisplayObject(this._horizontalAxis));
				}
				this._horizontalAxis = axis;
				
				if(this._horizontalAxis)
				{
					this._horizontalAxis.plotArea = this;
					this._horizontalAxis.orientation = AxisOrientation.HORIZONTAL;
				
					var horizontalAxis:UIComponent = this._horizontalAxis as UIComponent;
					if(horizontalAxis.hasOwnProperty("gridLines"))
					{
						this.horizontalGridLines = new Sprite();
						this.addChild(this.horizontalGridLines);
						horizontalAxis["gridLines"] = this.horizontalGridLines;
					}
					
					if(horizontalAxis.hasOwnProperty("minorGridLines"))
					{
						this.horizontalMinorGridLines = new Sprite();
						this.addChild(this.horizontalMinorGridLines);
						horizontalAxis["minorGridLines"] = this.horizontalMinorGridLines;
					}
					this.addChild(horizontalAxis);
				}
				
				this.invalidate("axes");
			}
		}
		
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
				if(this._verticalAxis)
				{
					if(this.verticalGridLines)
					{
						this.removeChild(this.verticalGridLines);
						this.verticalGridLines = null;
					}
						
					if(this.verticalMinorGridLines)
					{
						this.removeChild(this.verticalMinorGridLines);
						this.verticalMinorGridLines = null;
					}

					this.removeChild(DisplayObject(this._verticalAxis))
				}
				this._verticalAxis = axis;
				this._verticalAxis.plotArea = this;
				this._verticalAxis.orientation = AxisOrientation.VERTICAL;
				
				if(this._verticalAxis)
				{
					var verticalAxis:UIComponent = this._verticalAxis as UIComponent;
					
					if(verticalAxis.hasOwnProperty("gridLines"))
					{
						this.verticalGridLines = new Sprite();
						this.addChild(this.verticalGridLines);
						verticalAxis["gridLines"] = this.verticalGridLines;
					}
					if(verticalAxis.hasOwnProperty("minorGridLines"))
					{
						this.verticalMinorGridLines = new Sprite();
						this.addChild(this.verticalMinorGridLines);
						verticalAxis["minorGridLines"] = this.verticalMinorGridLines;
					}
					this.addChild(verticalAxis);
				}
				
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
		 * @copy com.yahoo.astra.fl.charts.IPlotArea@axisToField()
		 */
		public function axisToField(axis:IAxis):String
		{
			if(axis == this.horizontalAxis) return this.horizontalField;
			else if(axis == this.verticalAxis) return this.verticalField;
			return null;
		}
		
		/**
		 * @copy com.yahoo.astra.fl.charts.IPlotArea@axisAndSeriesToField()
		 */
		public function axisAndSeriesToField(axis:IAxis, series:ISeries):String
		{
			var cartesianSeries:CartesianSeries = series as CartesianSeries;
			var field:String = this.axisToField(axis);
			if(axis.orientation == AxisOrientation.VERTICAL && cartesianSeries.verticalField)
			{
				field = cartesianSeries.verticalField;
			}
			else if(axis.orientation == AxisOrientation.HORIZONTAL && cartesianSeries.horizontalField)
			{
				field = cartesianSeries.horizontalField;
			}
			
			return field;
		}
		
		/**
		 * @copy com.yahoo.astra.fl.charts.IPlotArea@fieldToAxis()
		 */
		public function fieldToAxis(field:String):IAxis
		{
			if(field == this.horizontalField) return this.horizontalAxis;
			else if(field == this.verticalField) return this.verticalAxis;
			return null;
		}
	
		/**
		 * @copy com.yahoo.astra.fl.charts.IPlotArea#dataToLocal()
		 */
		public function dataToLocal(data:Object, series:ISeries):Point
		{
			var horizontalField:String = this.axisAndSeriesToField(this.horizontalAxis, series);
			var horizontalValue:Object = data[horizontalField];
			var xPosition:Number = this._horizontalAxis.valueToLocal(horizontalValue);
			
			var verticalField:String = this.axisAndSeriesToField(this.verticalAxis, series);
			var verticalValue:Object = data[verticalField];
			var yPosition:Number = this._verticalAxis.valueToLocal(verticalValue);
			
			return new Point(xPosition, yPosition);
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
		 * Positions and sizes the axes based on their edge metrics.
		 */
		protected function drawAxes():void
		{		
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var axisWidth:Number = this.width - (2 * contentPadding);
			var axisHeight:Number = this.height - (2 * contentPadding);
			
			var horizontalAxis:UIComponent = this._horizontalAxis as UIComponent;
			horizontalAxis.move(contentPadding, contentPadding);
			horizontalAxis.width = axisWidth;
			horizontalAxis.height = axisHeight;
			this._horizontalAxis.overflowEnabled = this.overflowEnabled;
			this._horizontalAxis.title = this.horizontalAxisTitle;
			this.setChildIndex(horizontalAxis, this.numChildren - 1);
			if(horizontalAxis is CategoryAxis && this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
			{
				(this.horizontalAxis as CategoryAxis).categoryNames = this._explicitCategoryNames;
			}
			this.copyStylesToChild(horizontalAxis, CartesianChart.HORIZONTAL_AXIS_STYLES);
						
			var verticalAxis:UIComponent = this._verticalAxis as UIComponent;
			verticalAxis.move(contentPadding, contentPadding);
			verticalAxis.width = axisWidth;
			verticalAxis.height = axisHeight;
			this._verticalAxis.overflowEnabled = this.overflowEnabled;
			this._verticalAxis.title = this.verticalAxisTitle;
			this.setChildIndex(verticalAxis, this.numChildren - 1);
			if(verticalAxis is CategoryAxis && this._explicitCategoryNames && this._explicitCategoryNames.length > 0)
			{
				(this.verticalAxis as CategoryAxis).categoryNames = this._explicitCategoryNames;
			}
			this.copyStylesToChild(verticalAxis, CartesianChart.VERTICAL_AXIS_STYLES);
			
			this.updateAxisScalesAndBounds();
			
			this.drawGridLines();
				
			//force the redraw now so that we get the correct series positioning
			horizontalAxis.drawNow();
			verticalAxis.drawNow();
		}
		
		/**
		 * @private
		 * Determines the axis scales, and positions the axes based on their
		 * <code>contentBounds</code> properties.
		 */
		protected function updateAxisScalesAndBounds():void
		{
			this._horizontalAxis.updateScale(this.series);
			this._verticalAxis.updateScale(this.series);
			
			//update the bounds twice to catch all changes
			this.calculateContentBounds();
			this.calculateContentBounds();
		}
		
		/**
		 * @private
		 * Combine the content bounds to determine the series positioning.
		 */
		protected function calculateContentBounds():void
		{
			this.horizontalAxis.updateBounds();
			this.verticalAxis.updateBounds();
			
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var axisWidth:Number = this.width - (2 * contentPadding);
			var axisHeight:Number = this.height - (2 * contentPadding);
			
			var horizontalAxis:UIComponent = this._horizontalAxis as UIComponent;
			var verticalAxis:UIComponent = this._verticalAxis as UIComponent;
			
			var horizontalBounds:Rectangle = this._horizontalAxis.contentBounds;
			var verticalBounds:Rectangle = this._verticalAxis.contentBounds;
			this._contentBounds = new Rectangle();
			
			this._contentBounds.x = Math.max(horizontalBounds.x, verticalBounds.x);
			this._contentBounds.y = Math.max(horizontalBounds.y, verticalBounds.y);
			this._contentBounds.width = Math.min(horizontalBounds.width, verticalBounds.width);
			this._contentBounds.height = Math.min(horizontalBounds.height, verticalBounds.height);
			
			var hRight:Number = horizontalAxis.width - horizontalBounds.width - horizontalBounds.x;
			var hBottom:Number = horizontalAxis.height - horizontalBounds.height - horizontalBounds.y;
			var vRight:Number = verticalAxis.width - verticalBounds.width - verticalBounds.x;
			var vBottom:Number = verticalAxis.height - verticalBounds.height - verticalBounds.y;
			
			horizontalAxis.x = contentPadding + this._contentBounds.x - horizontalBounds.x;
			horizontalAxis.y = contentPadding + this._contentBounds.y - horizontalBounds.y;
			horizontalAxis.width = axisWidth - Math.max(0, vRight - hRight) - (this._contentBounds.x - horizontalBounds.x);
			horizontalAxis.height = axisHeight - Math.max(0, vBottom - hBottom) - (this._contentBounds.y - horizontalBounds.y);
			
			verticalAxis.x = contentPadding + this._contentBounds.x - verticalBounds.x;
			verticalAxis.y = contentPadding + this._contentBounds.y - verticalBounds.y;
			verticalAxis.width = axisWidth - Math.max(0, hRight - vRight) - (this._contentBounds.x - verticalBounds.x);
			verticalAxis.height = axisHeight - Math.max(0, hBottom - vBottom) - (this._contentBounds.y - verticalBounds.y);
		}
		
		/**
		 * @private
		 * Draws the axis grid lines, if they exist.
		 */
		protected function drawGridLines():void
		{
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var horizontalAxis:UIComponent = this._horizontalAxis as UIComponent;
			var verticalAxis:UIComponent = this._verticalAxis as UIComponent;
			
			var index:int = 0;
			if(this.background) index++;
			
			//add and update the grid lines
			if(horizontalAxis.hasOwnProperty("minorGridLines") && this.horizontalMinorGridLines)
			{
				this.setChildIndex(this.horizontalMinorGridLines, index++);
				this.horizontalMinorGridLines.x = contentPadding + this.contentBounds.x;
				this.horizontalMinorGridLines.y = contentPadding + this.contentBounds.y;
			}
			
			if(verticalAxis.hasOwnProperty("minorGridLines") && this.verticalMinorGridLines)
			{
				this.setChildIndex(this.verticalMinorGridLines, index++);
				this.verticalMinorGridLines.x = contentPadding + this.contentBounds.x;
				this.verticalMinorGridLines.y = contentPadding + this.contentBounds.y;
			}
			
			if(horizontalAxis.hasOwnProperty("gridLines") && this.horizontalGridLines)
			{
				this.setChildIndex(this.horizontalGridLines, index++);
				this.horizontalGridLines.x = contentPadding + this.contentBounds.x;
				this.horizontalGridLines.y = contentPadding + this.contentBounds.y;
			}
			
			if(verticalAxis.hasOwnProperty("gridLines") && this.verticalGridLines)
			{
				this.setChildIndex(this.verticalGridLines, index++);
				this.verticalGridLines.x = contentPadding + this.contentBounds.x;
				this.verticalGridLines.y = contentPadding + this.contentBounds.y;
			}
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
					if(!isNaN(Number(item)))
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
			
			if(!this.verticalAxis)
			{
				var numericAxis:NumericAxis = new NumericAxis();
				this.verticalAxis = numericAxis;
			}
		}
		
		/**
		 * @private
		 * Determines the text that will appear on the data tip.
		 */
		override protected function defaultDataTipFunction(item:Object, index:int, series:ISeries):String
		{
			var text:String = super.defaultDataTipFunction(item, index, series);
			if(text.length > 0) text += "\n";
			
			//if we have a category axis, display the category
			var categoryAxis:CategoryAxis = this.verticalAxis as CategoryAxis;
			var categoryField:String = this.axisAndSeriesToField(this.verticalAxis, series);
			var otherAxis:IAxis = this.horizontalAxis;
			if(!categoryAxis)
			{
				categoryAxis = this.horizontalAxis as CategoryAxis;
				categoryField = this.axisAndSeriesToField(this.horizontalAxis, series);
				otherAxis = this.verticalAxis;
			}
			if(categoryAxis)
			{
				var category:Object = null;
				if(item.hasOwnProperty(categoryField))
				{
					category = item[categoryField];
				}
				else if(this.categoryNames && this.categoryNames.length > index)
				{
					category = this.categoryNames[index];
				}
				else category = index;
				text += categoryAxis.valueToLabel(category) + "\n";
				
				var otherField:String = this.axisAndSeriesToField(otherAxis, series);
				if(item.hasOwnProperty(otherField))
				{
					text += otherAxis.valueToLabel(item[otherField]);
				}
				else text += item;
			}
			else
			{
				var verticalField:String = this.axisAndSeriesToField(this.verticalAxis, series);
				var horizontalField:String = this.axisAndSeriesToField(this.horizontalAxis, series);
				if(item.hasOwnProperty(verticalField))
				{
					text += verticalAxis.valueToLabel(item[verticalField]) + "\n";
				}
				if(item.hasOwnProperty(horizontalField))
				{
					text += horizontalAxis.valueToLabel(item[horizontalField]) + "\n";
				}
				
			}
			return text;
		}
	}
}
