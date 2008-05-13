package com.yahoo.astra.fl.charts.series
{
	import com.yahoo.astra.animation.Animation;
	import com.yahoo.astra.animation.AnimationEvent;
	import com.yahoo.astra.fl.charts.*;
	import com.yahoo.astra.fl.charts.skins.RectangleSkin;
	
	import fl.core.UIComponent;
	
	import flash.display.DisplayObject;
	import flash.geom.Point;
	import flash.utils.Dictionary;

	/**
	 * Renders data points as a series of vertical columns.
	 * 
	 * @author Josh Tynjala
	 */
	public class ColumnSeries extends CartesianSeries
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
	
		/**
		 * @private
		 */
		private static var defaultStyles:Object =
		{
			markerSkin: RectangleSkin,
			markerSize: 18
		};
	
		/**
		 * @private
		 * Holds an array of ColumnSeries objects for each plot area in which they appear.
		 */
		private static var seriesInCharts:Dictionary = new Dictionary();
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		/**
		 * @private
		 * When a column series is added to a Chart, it should be registered with that Chart.
		 * This allows it to determine proper positioning since column positions depend on other columns.
		 */
		private static function registerSeries(chart:Chart, series:ColumnSeries):void
		{
			var columns:Array = seriesInCharts[chart];
			if(!columns)
			{
				columns = [];
				seriesInCharts[chart] = columns;
			}
			
			columns.push(series);
		}
		
		/**
		 * @private
		 * When a column series is removed from its parent Chart, it should be unregistered.
		 */
		private static function unregisterSeries(chart:Chart, series:ColumnSeries):void
		{
			var columns:Array = seriesInCharts[chart];
			if(columns)
			{
				var index:int = columns.indexOf(series);
				if(index >= 0) columns.splice(index, 1);
			}
		}
		
		/**
		 * @private
		 * Returns the number of ColumnSeries objects appearing in a particular Chart.
		 * This value may be used to determine the position of the series.
		 */
		public static function getSeriesCount(chart:Chart):int
		{
			var columns:Array = seriesInCharts[chart];
			if(columns) return columns.length;
			return 0;
		}
		
		/**
		 * @private
		 * Returns the index of a ColumnSeries within a plot area.
		 * This value may be used to determine the position of the series.
		 */
		private static function seriesToIndex(chart:Chart, series:ColumnSeries):int
		{
			var columns:Array = seriesInCharts[chart];
			if(columns)
			{
				return columns.indexOf(series);
			}
			return -1;
		}
		
		/**
		 * @private
		 * Returns the ColumnSeries at the specified index within a plot area.
		 */
		private static function indexToSeries(chart:Chart, index:int):ColumnSeries
		{
			var columns:Array = seriesInCharts[chart];
			if(columns)
			{
				return columns[index];
			}
			
			return null;
		}
			
		/**
		 * @copy fl.core.UIComponent#getStyleDefinition()
		 */
		public static function getStyleDefinition():Object
		{
			return mergeStyles(defaultStyles, Series.getStyleDefinition());
		}
		
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function ColumnSeries(data:Object = null)
		{
			super(data);
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * @private
		 * The Animation instance that controls animation in this series.
		 */
		private var _animation:Animation;
	
		/**
		 * @private
		 */
		override public function set chart(value:Chart):void
		{
			if(this.chart != value)
			{
				if(this.chart) unregisterSeries(this.chart, this);
				super.chart = value;
				if(this.chart)
				{
					if(!(this.chart is CartesianChart))
					{
						throw new Error("Objects of type ColumnSeries may only be added to a CartesianChart.");
					}
					registerSeries(this.chart, this);
				}
			}
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
	
		/**
		 * @copy com.yahoo.astra.fl.charts.ISeries#clone()
		 */
		override public function clone():ISeries
		{
			var series:ColumnSeries = new ColumnSeries();
			if(this.dataProvider is Array)
			{
				//copy the array rather than pass it by reference
				series.dataProvider = (this.dataProvider as Array).concat();
			}
			else if(this.dataProvider is XMLList)
			{
				series.dataProvider = (this.dataProvider as XMLList).copy();
			}
			series.displayName = this.displayName;
			series.horizontalField = this.horizontalField;
			series.verticalField = this.verticalField;
			
			return series;
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		/**
		 * @private
		 */
		override protected function draw():void
		{
			super.draw();
			
			//if we don't have data, let's get out of here
			if(!this.dataProvider) return;
			
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			
			//grab the axes
			var valueAxis:NumericAxis = cartesianChart.verticalAxis as NumericAxis;
			var categoryAxis:CategoryAxis = cartesianChart.horizontalAxis as CategoryAxis;
			if(!categoryAxis)
			{
				throw new Error("To use a ColumnSeries object, the horizontal axis of the chart it appears within must be a CategoryAxis.");
				return;
			}
			
			//variables we need in the loop (and shouldn't look up a gazillion times)
			var originPosition:Number = valueAxis.valueToLocal(valueAxis.origin);
			var seriesIndex:int = seriesToIndex(this.chart, this);
			var markerSize:Number = this.getStyleValue("markerSize") as Number;
			var maximumAllowedMarkerSize:Number = (this.width / categoryAxis.categoryNames.length) / getSeriesCount(this.chart);
			//we need to use floor because CS3 UIComponents round the position
			markerSize = Math.floor(Math.min(maximumAllowedMarkerSize, markerSize));
			
			var startValues:Array = [];
			var endValues:Array = [];
			var itemCount:int = this.length;
			for(var i:int = 0; i < itemCount; i++)
			{
				var item:Object = this.dataProvider[i];
				var position:Point = cartesianChart.dataToLocal(item, this);
				
				var marker:DisplayObject = this.markers[i] as DisplayObject;
				
				marker.x = position.x;
				
				marker.width = markerSize;
				
				//if we have a bad position, don't display the marker
				if(isNaN(position.x) || isNaN(position.y))
				{
					this.invalidateMarker(ISeriesItemRenderer(marker));
				}
				else if(this.isMarkerInvalid(ISeriesItemRenderer(marker)))
				{
					//initialize the marker to the origin
					marker.y = originPosition;
					marker.height = 0;
				
					if(marker is UIComponent) 
					{
						(marker as UIComponent).drawNow();
					}
					this.validateMarker(ISeriesItemRenderer(marker));
				}
				
				//stupid Flash UIComponent rounding!
				position.y = Math.round(position.y);
				originPosition = Math.round(originPosition);
				
				var calculatedHeight:Number = originPosition - position.y;
				if(calculatedHeight < 0)
				{
					calculatedHeight = Math.abs(calculatedHeight);
					position.y = Math.round(originPosition);
					//always put the marker on the origin
					marker.y = position.y;
				}
				
				startValues.push(marker.y, marker.height);
				endValues.push(position.y, calculatedHeight);
			}
			
			//handle animating all the markers in one fell swoop.
			if(this._animation)
			{
				this._animation.removeEventListener(AnimationEvent.UPDATE, tweenUpdateHandler);
				this._animation.removeEventListener(AnimationEvent.COMPLETE, tweenUpdateHandler);
				this._animation = null;
			}
			
			//don't animate on livepreview!
			if(this.isLivePreview || !this.getStyleValue("animationEnabled"))
			{
				this.drawMarkers(endValues);
			}
			else
			{
				var animationDuration:int = this.getStyleValue("animationDuration") as int;
				var animationEasingFunction:Function = this.getStyleValue("animationEasingFunction") as Function;
				
				this._animation = new Animation(animationDuration, startValues, endValues);
				this._animation.addEventListener(AnimationEvent.UPDATE, tweenUpdateHandler);
				this._animation.addEventListener(AnimationEvent.COMPLETE, tweenUpdateHandler);
				this._animation.easingFunction = animationEasingFunction;
			}
		}
		
		protected function tweenUpdateHandler(event:AnimationEvent):void
		{
			var data:Array = event.parameters as Array;
			this.drawMarkers(data);
		}
		
		protected function drawMarkers(data:Array):void
		{
			var itemCount:int = this.length;
			for(var i:int = 0; i < itemCount; i++)
			{
				var marker:DisplayObject = this.markers[i] as DisplayObject;
				var markerY:Number = data[i * 2];
				var markerHeight:Number = data[i * 2 + 1];
				marker.y = markerY;
				marker.height = markerHeight;
				
				if(marker is UIComponent) 
				{
					(marker as UIComponent).drawNow();
				}
			}
		}
		
	}
}