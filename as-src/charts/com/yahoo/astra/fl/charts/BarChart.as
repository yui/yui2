package com.yahoo.astra.fl.charts
{
	import com.yahoo.astra.fl.charts.series.BarSeries;
	
	import fl.core.UIComponent;
	
	/**
	 * A chart that displays its data points with horizontal bars.
	 * 
	 * @author Josh Tynjala
	 */
	public class BarChart extends CartesianChart
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
		
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{	
			showHorizontalAxisGridLines: true,
			showHorizontalAxisTicks: true,
			showHorizontalAxisMinorTicks: true,
			showVerticalAxisGridLines: false,
			showVerticalAxisTicks: false,
			showVerticalAxisMinorTicks: false
		};
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		/**
		 * @private
		 * @copy fl.core.UIComponent#getStyleDefinition()
		 */
		public static function getStyleDefinition():Object
		{
			return mergeStyles(defaultStyles, CartesianChart.getStyleDefinition());
		}
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function BarChart()
		{
			super();
			this.defaultSeriesType = BarSeries;
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		/**
		 * @private
		 */
		override protected function configUI():void
		{
			super.configUI();
			
			var numericAxis:NumericAxis = new NumericAxis();
			this.horizontalAxis = numericAxis;
			
			var categoryAxis:CategoryAxis = new CategoryAxis();
			this.verticalAxis = categoryAxis;
		}
		
		/**
		 * @private
		 * Positions and updates the series objects.
		 * Bars must be positioned next to each other.
		 */
		override protected function drawSeries():void
		{
			super.drawSeries();
			
			//this function looks like a total hack, but it's actually kind of clever
			
			var markerSizes:Array = [];
			var defaultMarkerSize:Number = BarSeries.getStyleDefinition().markerSize;
			
			var seriesCount:int = this.series.length;
			var totalMarkerSize:Number = 0;
			var maximumAllowedMarkerSize:Number = this._contentBounds.height / CategoryAxis(this.verticalAxis).categoryNames.length / BarSeries.getSeriesCount(this);
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:UIComponent = UIComponent(this.series[i]);
				if(!(series is BarSeries))
				{
					continue;
				}
				
				series.y = 0;
				
				var markerSize:Object = series.getStyle("markerSize");
				if(markerSize === null)
				{
					//get the default value
					markerSize = defaultMarkerSize;
				}
				markerSize = Math.floor(Math.min(maximumAllowedMarkerSize, markerSize as Number));
				markerSizes.push(markerSize);
				totalMarkerSize += markerSize;
			}
			
			var yPosition:Number = 0;
			for(i = 0; i < seriesCount; i++)
			{
				series = UIComponent(this.series[i]);
				if(!(series is BarSeries))
				{
					continue;
				}
				
				series.y += -(totalMarkerSize / 2) + yPosition;
				yPosition += markerSizes[i];
			}
		}
	}
}
