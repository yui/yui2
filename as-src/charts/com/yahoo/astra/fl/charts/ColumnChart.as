package com.yahoo.astra.fl.charts
{
	import com.yahoo.astra.fl.charts.series.ColumnSeries;
	
	import fl.core.UIComponent;
	
	/**
	 * A chart that displays its data points with vertical columns.
	 * 
	 * @author Josh Tynjala
	 */
	public class ColumnChart extends CartesianChart
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
		
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{
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
		public function ColumnChart()
		{
			super();
			this.defaultSeriesType = ColumnSeries;
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		/**
		 * @private
		 * Positions and updates the series objects.
		 * Columns must be positioned next to each other.
		 */
		override protected function drawSeries():void
		{
			super.drawSeries();
			
			//this function looks like a total hack, but it's actually kind of clever
			
			var markerSizes:Array = [];
			var defaultMarkerSize:Number = ColumnSeries.getStyleDefinition().markerSize;
			
			var seriesCount:int = this.series.length;
			var totalMarkerSize:Number = 0;
			var maximumAllowedMarkerSize:Number = this._contentBounds.width / CategoryAxis(this.horizontalAxis).categoryNames.length / ColumnSeries.getSeriesCount(this);
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:UIComponent = UIComponent(this.series[i]);
				if(!(series is ColumnSeries))
				{
					continue;
				}
				
				series.x = 0;
				var markerSize:Object = series.getStyle("markerSize");
				if(markerSize === null)
				{
					markerSize = defaultMarkerSize;
				}
				markerSize = Math.floor(Math.min(maximumAllowedMarkerSize, markerSize as Number));
				markerSizes.push(markerSize);
				totalMarkerSize += markerSize;
			}
			
			var xPosition:Number = 0;
			for(i = 0; i < seriesCount; i++)
			{
				series = UIComponent(this.series[i]);
				if(!(series is ColumnSeries))
				{
					continue;
				}
				
				series.x += -(totalMarkerSize / 2) + xPosition;
				xPosition += markerSizes[i];
			}
		}
		
	}
}
