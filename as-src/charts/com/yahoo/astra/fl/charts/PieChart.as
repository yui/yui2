package com.yahoo.astra.fl.charts
{
	import flash.geom.Rectangle;
	import fl.core.UIComponent;
	import com.yahoo.astra.utils.NumberUtil;
	import com.yahoo.astra.fl.charts.series.ISeries;
	import com.yahoo.astra.fl.charts.series.PieSeries;
	import com.yahoo.astra.fl.charts.skins.RectangleSkin;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	/**
     * An Array containing the default colors for each series. These colors are
     * used for markers in most cases, but they may apply to lines, fills, or
     * other graphical items.
	 * 
	 * <p>Important: In the PieChart, a series uses multiple colors. The <code>seriesColors</code>
	 * style is designed to work with multiple series where the index in the Array
	 * corresponds to the series index. As a result, to set the colors on a PieChart,
	 * an Array of color values should appear at each index in the outer Array.</p>
     *
     * @default [ [ 0xfcaf3e, 0x73d216, 0x729fcf, 0xfce94f, 0xad7fa8, 0x3465a4 ], [ 0x3465a4, 0xad7fa8, 0xfce94f, 0x729fcf, 0x73d216, 0xfcaf3e ] ]
     */
    [Style(name="seriesColors", type="Array")]
	
	/**
	 * A chart that displays its data points with pie-like wedges.
	 * 
	 * @author Josh Tynjala
	 */
	public class PieChart extends Chart implements ICategoryChart
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
		
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{
			seriesColors: [
			[
				0x00b8bf, 0x8dd5e7, 0xc0fff6, 0xffa928, 0xedff9f, 0xd00050,
				0xc6c6c6, 0xc3eafb, 0xfcffad, 0xcfff83, 0x444444, 0x4d95dd,
				0xb8ebff, 0x60558f, 0x737d7e, 0xa64d9a, 0x8e9a9b, 0x803e77
			] ],
			seriesMarkerSkins: []
		};
		
		/**
		 * @private
		 * The chart styles that correspond to styles on each series.
		 */
		private static const PIE_SERIES_STYLES:Object = 
		{
			markerSkins: "seriesMarkerSkins",
			fillColors: "seriesColors"
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
			return mergeStyles(defaultStyles, Chart.getStyleDefinition());
		}
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function PieChart()
		{
			super();
			this.defaultSeriesType = PieSeries;
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Displays a message in live preview mode when there is no dataProvider.
		 */
		protected var livePreviewMessage:TextField;
		
		/**
		 * @private
		 * Storage for the dataField property.
		 */
		private var _dataField:String;
		
		/**
		 * The field used to access data for this series.
		 */
		public function get dataField():String
		{
			return this._dataField;
		}
		
		/**
		 * @private
		 */
		public function set dataField(value:String):void
		{
			if(this._dataField != value)
			{
				this._dataField = value;
				this.invalidate();
			}
		}
		
		/**
		 * @private
		 * Storage for the categoryField property.
		 */
		private var _categoryField:String;
		
		/**
		 * The field used to access categories for this series.
		 */
		public function get categoryField():String
		{
			return this._categoryField;
		}
		
		/**
		 * @private
		 */
		public function set categoryField(value:String):void
		{
			if(this._categoryField != value)
			{
				this._categoryField = value;
				this.invalidate();
			}
		}
		
		private var _categoryNamesSetByUser:Boolean = false;
		
		/**
		 * @private
		 * Storage for the categoryNames property.
		 */
		private var _categoryNames:Array;
		
		[Inspectable]
		/**
		 * The names of the categories displayed on the category axis. If the
		 * chart does not have a category axis, this value will be ignored.
		 */
		public function get categoryNames():Array
		{
			return this._categoryNames;
		}
		
		/**
		 * @private
		 */
		public function set categoryNames(value:Array):void
		{
			if(this._categoryNames != value)
			{
				this._categoryNames = value;
				this._categoryNamesSetByUser = value != null;
				this.invalidate();
			}
		}
	
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
		
		/**
		 *
		 */
		public function seriesToDataField(series:PieSeries):String
		{
			var field:String = this.dataField;
			if(series.dataField)
			{
				field = series.dataField;
			}
			
			return field;
		}
		
		/**
		 *
		 */
		public function seriesToCategoryField(series:PieSeries):String
		{
			var field:String = this.categoryField;
			if(series.categoryField)
			{
				field = series.categoryField;
			}
			
			return field;
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
			if(this.isLivePreview)
			{
				//special case for live previews with no data.
				this.livePreviewMessage = new TextField();
				this.livePreviewMessage.autoSize = TextFieldAutoSize.LEFT;
				this.livePreviewMessage.defaultTextFormat = this.getStyleValue("textFormat") as TextFormat;
				this.livePreviewMessage.text = "No live preview data";
				this.addChild(this.livePreviewMessage);
			}
		}
		
		/**
		 * @private
		 */
		override protected function draw():void
		{
			super.draw();
			
			if(this.isLivePreview)
			{
				//special case for live previews with no data.
				this.livePreviewMessage.visible = !this.dataProvider || this.dataProvider.length == 0;
				this.livePreviewMessage.x = (this.width - this.livePreviewMessage.width) / 2;
				this.livePreviewMessage.y = (this.height - this.livePreviewMessage.height) / 2;
			}
			
			var contentPadding:Number = this.getStyleValue("contentPadding") as Number;
			var seriesWidth:Number = this.width - 2 * contentPadding;
			var seriesHeight:Number = this.height - 2 * contentPadding;
			
			this.content.x = this.content.y = contentPadding;
			
			if(!this._categoryNamesSetByUser)
			{
				this.generateCategories(this.series);
			}
			
			var seriesCount:int = this.series.length;
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:UIComponent = this.series[i] as UIComponent;
				this.copyStylesToSeries(ISeries(series), PIE_SERIES_STYLES);
				
				PieSeries(series).categoryNames = this.categoryNames;
				
				//if a pie chart contains more than one series, each additional series should be
				//a little bit smaller so that they can all be visible to the viewer.				
				series.width = seriesWidth - i * seriesWidth / seriesCount;
				series.height = seriesHeight - i * seriesHeight / seriesCount;
				
				//reposition the series based on the calculated dimensions
				series.x = (seriesWidth - series.width) / 2;
				series.y = (seriesHeight - series.height) / 2;
				series.drawNow();
			}
			
			this.updateLegend();
		}
		
		protected function generateCategories(data:Array):void
		{
			//auto-detect the category labels
			var maxSeriesLength:int = 0;
			var seriesCount:int = data.length;
			var uniqueCategoryValues:Array = [];
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:PieSeries = data[i] as PieSeries;
				var seriesLength:int = series.length;
				maxSeriesLength = Math.max(seriesLength, maxSeriesLength);
				
				// determine the field for this axis
				var currentCategoryField:String = this.seriesToCategoryField(series);
				
				for(var j:int = 0; j < seriesLength; j++)
				{
					var item:Object = series.dataProvider[j];
					var category:String = j.toString();
					if(item.hasOwnProperty(currentCategoryField))
					{
						category = item[currentCategoryField];
					}
					if(uniqueCategoryValues.indexOf(category) < 0)
					{
						uniqueCategoryValues.push(category);
					}
				}
			}
			this._categoryNames = uniqueCategoryValues;
		}
		
		/**
		 * @private
		 */
		override protected function defaultDataTipFunction(item:Object, index:int, series:ISeries):String
		{
			//get the series display name first
			var text:String = super.defaultDataTipFunction(item, index, series);
			if(text.length > 0) text += "\n";
			
			var pieSeries:PieSeries = PieSeries(series);
			
			var category:String = pieSeries.itemToCategory(item, index);
			text += category + "\n";
			
			var data:Number = pieSeries.itemToData(item);
			text += data + "\n";
			
			var percentage:Number = pieSeries.itemToPercentage(item);
			percentage *= 100;
			text += (percentage < 0.01 ? "< 0.01" : NumberUtil.roundToPrecision(percentage, 2)) + "%";
			
			return text;
		}
		
	}
}