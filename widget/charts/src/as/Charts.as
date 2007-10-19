package
{
	import fl.containers.UILoader;
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	import flash.events.ErrorEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.text.TextFormat;
	import flash.utils.getQualifiedClassName;
	import fl.managers.StyleManager;
	import com.yahoo.astra.fl.charts.*;
	import com.yahoo.astra.fl.charts.series.*;
	import com.yahoo.astra.fl.charts.skins.*;
	import com.yahoo.astra.fl.charts.events.ChartEvent;
	import com.yahoo.astra.fl.charts.legend.Legend;
	import com.yahoo.astra.utils.InstanceFactory;
	import com.yahoo.astra.utils.JavaScriptUtil;
	import com.yahoo.yui.YUIAdapter;
	import com.yahoo.yui.LoggerCategory;
	import com.yahoo.yui.charts.*;

	[SWF(backgroundColor=0xffffff)]
	/**
	 * A wrapper for the Astra Charts components to allow them to be used by the YUI library.
	 * 
	 * @author Josh Tynjala
	 */
	public class Charts extends YUIAdapter
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function Charts()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * @private (protected)
		 * A reference to the chart instance.
		 */
		protected var chart:Chart;
		
		protected var legend:Legend;
		
		protected var _legendDisplay:String = "left";
		
		public function get legendDisplay():String
		{
			return this._legendDisplay;
		}
		
		public function set legendDisplay(value:String):void
		{
			this._legendDisplay = value;
			this.refreshComponentSize();
		}
		
		/**
		 * @private (protected)
		 */
		protected var backgroundAndBorder:BackgroundAndBorder;
		
		/**
		 * @private
		 */
		override protected function get component():DisplayObject
		{
			//why do I have to do this? it's not ambiguous!
			return super.component;
		}
		
		/**
		 * @private
		 */
		override protected function set component(value:DisplayObject):void
		{
			this.chart = Chart(value);
			super.component = value;
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
		
		/**
		 * Creates a chart instance based on the specified type.
		 */
		public function setType(value:String):void
		{
			if(this.chart)
			{
				this.removeChild(this.chart);
				this.chart.removeEventListener(ChartEvent.ITEM_CLICK, chartItemEventHandler);
				this.chart.removeEventListener(ChartEvent.ITEM_DOUBLE_CLICK, chartItemEventHandler);
				this.chart.removeEventListener(ChartEvent.ITEM_ROLL_OUT, chartItemEventHandler);
				this.chart.removeEventListener(ChartEvent.ITEM_ROLL_OVER, chartItemEventHandler);
				this.chart.removeEventListener(MouseEvent.MOUSE_DOWN, chartItemExtraEventHandler);
			}
			
			var ChartType:Class = ChartSerializer.getType(value);
			var chart:Chart = new ChartType();
			chart.setStyle("contentPadding", 10 + this.backgroundAndBorder.borderWeight);
			chart.setStyle("backgroundSkin", Sprite);
			chart.setStyle("dataTipBackgroundSkin", ChartDataTipBackground);
			this.addChildAt(chart, 1);
			
			this.component = chart;
			this.chart.addEventListener(ChartEvent.ITEM_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_DOUBLE_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OUT, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OVER, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(MouseEvent.MOUSE_DOWN, chartItemExtraEventHandler, false, 0, true);
			
			this.log("Type set to \"" + value + "\"");
		}
		
		public function setDataProvider(value:Array, styleChanged:Boolean = false):void
		{
			var dataProvider:Array = [];
			var seriesCount:int = value.length;
			var seriesStyles:Array = [];
			for(var i:int = 0; i < seriesCount; i++)
			{
				var dataFromJavaScript:Object = value[i];
				var currentData:ISeries = this.chart.dataProvider[i] as ISeries;
				var seriesType:Class = SeriesSerializer.shortNameToSeriesType(dataFromJavaScript.type);
				var series:ISeries;
				if(currentData is seriesType)
				{
					//reuse the series if possible because we want animation
					series = SeriesSerializer.readSeries(dataFromJavaScript, currentData);
				}
				else
				{
					series = SeriesSerializer.readSeries(dataFromJavaScript);
				}
				dataProvider[i] = series;
			
				//this is where we parse the individual series styles, and we convert them
				//to the format the chart actually expects.
				//we fill in with defaults for styles that have not been specified
				if(dataFromJavaScript.style)
				{
					seriesStyles.push(dataFromJavaScript.style);
				}
				else seriesStyles.push(null);
			}
			
			this.log("Displaying " + seriesCount + " series.");
			
			//set data provider and new styles
			this.chart.dataProvider = dataProvider;
			this.chart.drawNow();
				
			if(styleChanged)
			{
				this.setSeriesStyles(seriesStyles);
			}
			
			if(this.legendDisplay != "none")
			{
				this.legend.dataProvider = this.chart.dataProvider as Array;
				this.refreshComponentSize();
			}
			else if(this.legend) //display: "none"
			{
				this.legend.visible = false;
			}
		}
		
		/**
		 * Returns the category names.
		 */
		public function getCategoryNames():Array
		{
			var categoryChart:ICategoryChart = this.chart as ICategoryChart;
			if(categoryChart)
			{
				return categoryChart.categoryNames;
			}
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Cannot find categoryNames on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the category names used if the data requires a category axis.
		 * This field should be used if the data does not define the category
		 * values directly.
		 */
		public function setCategoryNames(value:Array):void
		{
			var categoryChart:ICategoryChart = this.chart as ICategoryChart;
			if(categoryChart)
			{
				categoryChart.categoryNames = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set categoryNames on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the field used in complex objects to access data to be
		 * displayed on the PieChart.
		 */
		public function getDataField():String
		{
			var pieChart:PieChart = this.chart as PieChart;
			if(pieChart)
			{
				return pieChart.dataField;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find dataField on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the field used in complex objects to access data to be displayed
		 * on the PieChart.
		 */
		public function setDataField(value:String):void
		{
			var pieChart:PieChart = this.chart as PieChart;
			if(pieChart)
			{
				pieChart.dataField = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set dataField on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the field used in complex objects to access categories to be
		 * displayed on the PieChart.
		 */
		public function getCategoryField():String
		{
			var pieChart:PieChart = this.chart as PieChart;
			if(pieChart)
			{
				return pieChart.categoryField;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find categoryField on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the field used in complex objects to access categories to be displayed
		 * on the PieChart.
		 */
		public function setCategoryField(value:String):void
		{
			var pieChart:PieChart = this.chart as PieChart;
			if(pieChart)
			{
				pieChart.categoryField = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set categoryField on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the field used in complex objects to access data to be
		 * displayed on the horizontal axis.
		 */
		public function getHorizontalField():String
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				return cartesianChart.horizontalField;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find horizontalField on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the field used in complex objects to access data to be displayed
		 * on the horizontal axis. If the input data is XML, and the field is an
		 * attribute, be sure to include the "@" symbol at the beginning of the
		 * field name.
		 */
		public function setHorizontalField(value:String):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.horizontalField = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set horizontalField on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the field used in complex objects to access data to be
		 * displayed on the vertical axis.
		 */
		public function getVerticalField():String
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				return cartesianChart.verticalField;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find verticalField on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the field used in complex objects to access data to be displayed
		 * on the vertical axis. If the input data is XML, and the field is an
		 * attribute, be sure to include the "@" symbol at the beginning of the
		 * field name.
		 */
		public function setVerticalField(value:String):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.verticalField = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set verticalField on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the title displayed next to the vertical axis.
		 */
		public function getHorizontalAxisTitle():String
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				return cartesianChart.horizontalAxisTitle;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find horizontalAxisTitle on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the title displayed next to the horizontal axis.
		 */
		public function setHorizontalAxisTitle(value:String):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.horizontalAxisTitle = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set horizontalAxisTitle on a chart of type " + shortName);
			}
		}
		
		/**
		 * Returns the title displayed next to the vertical axis.
		 */
		public function getVerticalAxisTitle():String
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				return cartesianChart.verticalAxisTitle;
			}
			
			var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
			this.log("Unable to find verticalAxisTitle on a chart of type " + shortName);
			return null;
		}
		
		/**
		 * Sets the title displayed next to the vertical axis.
		 */
		public function setVerticalAxisTitle(value:String):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.verticalAxisTitle = value;
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set verticalAxisTitle on a chart of type " + shortName);
			}
		}
		
		/**
		 * Updates the horizontal axis with a new type.
		 */
		public function setHorizontalAxis(value:Object):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.horizontalAxis = AxisSerializer.readAxis(value);
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set horizontalAxis on a chart of type " + shortName);
			}
		}
		
		/**
		 * Updates the vertical axis with a new type.
		 */
		public function setVerticalAxis(value:Object):void
		{
			var cartesianChart:CartesianChart = this.chart as CartesianChart;
			if(cartesianChart)
			{
				cartesianChart.verticalAxis = AxisSerializer.readAxis(value);
			}
			else
			{
				var shortName:String = ChartSerializer.getShortName(getQualifiedClassName(this.chart));
				this.log("Unable to set verticalAxis on a chart of type " + shortName);
			}
		}
		
		/**
		 * Sets the JavaScript function to call to generate the chart's data tip.
		 */
		public function setDataTipFunction(value:String):void
		{
			var delegate:Object = {dataTipFunction: JavaScriptUtil.createCallbackFunction(value).callback};
			delegate.callback = function(item:Object, index:int, series:ISeries):String
			{
				return delegate.dataTipFunction(item, index, SeriesSerializer.writeSeries(series));
			}
			
			this.chart.dataTipFunction = delegate.callback;
		}
		
		/**
		 * Accepts a JavaScript-friendly set of styles for the chart itself.
		 */
		public function setStyles(styles:Object):void
		{
			for(var styleName:String in styles)
			{
				this.setStyle(styleName, styles[styleName]);
			}
		}
		
		public function setStyle(name:String, value:Object):void
		{
			switch(name)
			{
				case "padding":
					var contentPadding:Number = Number(value);
					//contentPadding += this.backgroundAndBorder.borderWeight;
					this.chart.setStyle("contentPadding", contentPadding);
					break;
				case "animationEnabled":
					this.chart.setStyle("animationEnabled", value);
					break;
				case "border":
					if(value.color != null)
					{
						this.backgroundAndBorder.borderColor = this.parseColor(value.color);
					}
					
					if(value.size != null)
					{
						this.backgroundAndBorder.borderWeight = value.size;
						this.refreshComponentSize();
					}
					break;
				case "background":
					if(value.color != null)
					{
						this.backgroundAndBorder.fillColor = this.parseColor(value.color);
					}
					
					if(value.image)
					{
						this.backgroundAndBorder.image = value.image;
					}
					
					if(value.alpha != null)
					{
						this.backgroundAndBorder.fillAlpha = value.alpha;
					}
					if(value.mode)
					{
						this.backgroundAndBorder.imageMode = value.mode;
					}
					break;
				case "font":
					var textFormat:TextFormat = TextFormatSerializer.readTextFormat(value);
					this.chart.setStyle("textFormat", textFormat);
					break;
				case "dataTip":
					this.setDataTipStyles(value);
					break;
				case "xAxis":
					this.setAxisStyles(value, "horizontal");
					break;
				case "yAxis":
					this.setAxisStyles(value, "vertical");
					break;
				case "legend":
					if(this.legend)
					{
						this.setLegendStyles(value);
					}
					break;
				default:
					this.log("Unknown style: " + name);
			}
		}
		
		public function setSeriesStyles(styles:Array):void
		{
			//will be filled based on the defaults or the series style definition, if present.
			var seriesColors:Array = [];
			var seriesMarkerSizes:Array = [];
			var seriesMarkerSkins:Array = [];
			var seriesCount:int = styles.length;
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:ISeries = ISeries(this.chart.dataProvider[i]);
				var style:Object = styles[i];
				
				//defaults
				var defaultColors:Array = [0x729fcf, 0xfcaf3e, 0x73d216, 0xfce94f, 0xad7fa8, 0x3465a4];
				if(series is PieSeries)
				{
					defaultColors = [defaultColors.concat()];
				}
				
				var defaultSize:Number = 10;
				if(series is ColumnSeries || series is BarSeries)
				{
					defaultSize = 20;
				}
				
				var defaultSkin:Object = RectangleSkin;
				if(series is LineSeries)
				{
					defaultSkin = CircleSkin;
				}
				else if(series is PieSeries)
				{
					defaultSkin = [defaultSkin];
				}
			
				//initialize styles with defaults
				var size:Number = defaultSize;
				var color:Object = defaultColors[i % defaultColors.length];
				var skin:Object = defaultSkin;
				if(style)
				{
					for(var styleName:String in style)
					{
						switch(styleName)
						{
							case "images":
								var images:Array = style.images as Array;
								var imageCount:int = images.length;
								for(var j:int = 0; j < imageCount; j++)
								{
									images[j] = this.createMarkerSkin(String(images[j]), series);
								}
								skin = images;
								break;
							case "image":
								skin = this.createMarkerSkin(style.image, series);
								break;
							case "colors":
								var colors:Array = style.colors;
								var colorCount:int = colors.length;
								for(j = 0; j < colorCount; j++)
								{
									colors[j] = this.parseColor(colors[j]);
								}
								color = colors;
								break;
							case "color":
								color = this.parseColor(style.color);
								break;
							case "size":
								size = Number(style.size);
								break;
							default:
								this.log("Unknown series style: " + styleName);
						}
					}
				}
				
				seriesColors[i] = color;
				seriesMarkerSizes[i] = size;
				seriesMarkerSkins[i] = skin;
			}
			
			this.chart.setStyle("seriesColors", seriesColors);
			this.chart.setStyle("seriesMarkerSizes", seriesMarkerSizes);
			this.chart.setStyle("seriesMarkerSkins", seriesMarkerSkins);

			this.chart.drawNow();
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		/**
		 * @private (protected)
		 * Initialize the functions that may be called by JavaScript through ExternalInterface.
		 */
		override protected function initializeComponent():void
		{
			
			super.initializeComponent();
			
			ExternalInterface.addCallback("setType", setType);
			ExternalInterface.addCallback("setStyle", setStyle);
			ExternalInterface.addCallback("setStyles", setStyles);
			ExternalInterface.addCallback("setSeriesStyles", setSeriesStyles);
			ExternalInterface.addCallback("setDataProvider", setDataProvider);
			ExternalInterface.addCallback("getCategoryNames", getCategoryNames);
			ExternalInterface.addCallback("setCategoryNames", setCategoryNames);
			ExternalInterface.addCallback("setDataTipFunction", setDataTipFunction);
			ExternalInterface.addCallback("getCategoryNames", getCategoryNames);
			ExternalInterface.addCallback("setCategoryNames", setCategoryNames);
			
			//CartesianChart
			ExternalInterface.addCallback("getHorizontalField", getHorizontalField);
			ExternalInterface.addCallback("setHorizontalField", setHorizontalField);
			ExternalInterface.addCallback("getVerticalField", getVerticalField);
			ExternalInterface.addCallback("setVerticalField", setVerticalField);
			ExternalInterface.addCallback("setHorizontalAxis", setHorizontalAxis);
			ExternalInterface.addCallback("setVerticalAxis", setVerticalAxis);
			
			//PieChart
			ExternalInterface.addCallback("getDataField", getDataField);
			ExternalInterface.addCallback("setDataField", setDataField);
			ExternalInterface.addCallback("getCategoryField", getCategoryField);
			ExternalInterface.addCallback("setCategoryField", setCategoryField);

			this.backgroundAndBorder = new BackgroundAndBorder();
			this.backgroundAndBorder.width = this.stage.stageWidth;
			this.backgroundAndBorder.height = this.stage.stageHeight;
			this.backgroundAndBorder.addEventListener(ErrorEvent.ERROR, backgroundErrorHandler);
			this.addChild(this.backgroundAndBorder);
			
			/*this.legend = new Legend();
			this.addChild(this.legend);*/
		}
		
		/**
		 * @private (protected)
		 * Since Chart is a Flash CS3 component, we should call drawNow() to be sure it updates properly.
		 */
		override protected function refreshComponentSize():void
		{
			super.refreshComponentSize();
			
			if(this.backgroundAndBorder)
			{
				this.backgroundAndBorder.width = this.stage.stageWidth;
				this.backgroundAndBorder.height = this.stage.stageHeight;
				this.backgroundAndBorder.drawNow();
				
				if(this.chart)
				{
					this.chart.x = this.chart.y = this.backgroundAndBorder.borderWeight;
					this.chart.width -= 2 * this.backgroundAndBorder.borderWeight;
					this.chart.height -= 2 * this.backgroundAndBorder.borderWeight;
				}
			}
			
			if(this.chart)
			{
				if(this.legend && this.legendDisplay != "none")
				{
					this.legend.drawNow();
					var padding:Number = this.chart.getStyle("contentPadding") as Number;
					if(this.legendDisplay == "left" || this.legendDisplay == "right")
					{
						if(this.legendDisplay == "left")
						{
							this.legend.x = padding;
							if(this.backgroundAndBorder)
							{
								this.legend.x += this.backgroundAndBorder.borderWeight;
							}
							this.chart.x += this.legend.width + padding;
						}
						else //right
						{
							this.legend.x = this.stage.stageWidth - this.legend.width - padding;
							if(this.backgroundAndBorder)
							{
								this.legend.x -= this.backgroundAndBorder.borderWeight;
							}
						}
						this.legend.y = (this.stage.stageHeight - this.legend.height) / 2;
						this.chart.width -= (this.legend.width + padding);
					}
					else
					{
						if(this.legendDisplay == "top")
						{
							this.legend.y = padding;
							if(this.backgroundAndBorder)
							{
								this.legend.y += this.backgroundAndBorder.borderWeight;
							}
							this.chart.y += this.legend.height + padding;
						}
						else //bottom
						{
							this.legend.y = this.stage.stageHeight - this.legend.height - padding;
							if(this.backgroundAndBorder)
							{
								this.legend.y -= this.backgroundAndBorder.borderWeight;
							}
						}
						this.legend.x = (this.stage.stageWidth - this.legend.width) / 2;
						this.chart.height -= (this.legend.height + padding);
					}
				}
				this.chart.drawNow();
			}
		}
		
		/**
		 * @private (protected)
		 * Logs errors for the background image loading.
		 */
		protected function backgroundErrorHandler(event:ErrorEvent):void
		{
			this.log(event.text, LoggerCategory.ERROR);
		}
		
		/**
		 * @private (protected)
		 * 
		 * Receives chart item mouse events and passes them out to JavaScript.
		 */
		protected function chartItemEventHandler(event:ChartEvent):void
		{
			var seriesIndex:int = (this.chart.dataProvider as Array).indexOf(event.series);
			var itemEvent:Object = {type: event.type, seriesIndex: seriesIndex, index: event.index, item: event.item};
			this.dispatchEventToJavaScript(itemEvent);
		}
		
		private var _lastMouseItem:ISeriesItemRenderer;
		
		protected function chartItemExtraEventHandler(event:MouseEvent):void
		{
			var dragEventType:String = "itemDragUpdate";
			var renderer:ISeriesItemRenderer = this._lastMouseItem;
			this._lastMouseItem = null;
			if(event.type == MouseEvent.MOUSE_DOWN)
			{
				//crawl up until we get to the chart or an item renderer
				var displayObject:DisplayObject = event.target as DisplayObject;
				while(!(displayObject is ISeriesItemRenderer) && !(displayObject is Chart))
				{
					displayObject = displayObject.parent;
				}
				
				if(displayObject is ISeriesItemRenderer)
				{
					renderer = ISeriesItemRenderer(displayObject);
				
					this.stage.addEventListener(MouseEvent.MOUSE_MOVE, chartItemExtraEventHandler);
					this.stage.addEventListener(MouseEvent.MOUSE_UP, chartItemExtraEventHandler);
				}
				else
				{
					renderer = null;
				}
				dragEventType = "itemDragStart";
			}
			else if(event.type == MouseEvent.MOUSE_UP)
			{
				dragEventType = "itemDragEnd";
				this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, chartItemExtraEventHandler);
				this.stage.removeEventListener(MouseEvent.MOUSE_UP, chartItemExtraEventHandler);
			}
			
			//if we've found an item renderer, dispatch the event
			if(renderer is ISeriesItemRenderer)
			{
				var seriesIndex:int = (this.chart.dataProvider as Array).indexOf(renderer.series);
				var itemIndex:int = renderer.series.dataProvider.indexOf(renderer.data)
				var itemEvent:Object = {type: dragEventType, seriesIndex: seriesIndex, index: itemIndex, item: renderer.data, x: this.mouseX, y: this.mouseY};
				this.dispatchEventToJavaScript(itemEvent);
				this._lastMouseItem = renderer;
			}
		}
		
		protected function setDataTipStyles(styles:Object):void
		{
			var contentPadding:Number = 6;
			if(styles.padding)
			{
				contentPadding = styles.padding;
			}
			
			if(styles.border || styles.background)
			{
				var backgroundFactory:InstanceFactory = this.createBorderBackgroundFactory();
				var border:Object = styles.border;
				if(border)
				{
					if(border.color != null)
					{
						backgroundFactory.properties.borderColor = this.parseColor(border.color)
					}
					if(border.size != null)
					{
						backgroundFactory.properties.borderWeight = border.size;
						contentPadding += border.size;
					}
				}
				var background:Object = styles.background;
				if(background)
				{
					if(background.color != null)
					{
						backgroundFactory.properties.fillColor = this.parseColor(background.color);
					}
					if(background.image)
					{
						backgroundFactory.properties.image = background.image;
					}
					if(background.alpha != null)
					{
						backgroundFactory.properties.fillAlpha = background.alpha;
					}
					if(background.mode)
					{
						backgroundFactory.properties.imageMode = background.mode;
					}
				}
				this.chart.setStyle("dataTipBackgroundSkin", backgroundFactory);
			}
			
			this.chart.setStyle("dataTipContentPadding", contentPadding);
			
			if(styles.font)
			{
				var textFormat:TextFormat = TextFormatSerializer.readTextFormat(styles.font);
				this.chart.setStyle("dataTipTextFormat", textFormat);
			}
		}
		
		protected function setAxisStyles(styles:Object, axisName:String):void
		{
			if(styles.color != null)
			{
				this.chart.setStyle(axisName + "AxisColor", this.parseColor(styles.color));
			}
			
			if(styles.size != null)
			{
				this.chart.setStyle(axisName + "AxisWeight", styles.size);
			}
				
			if(styles.majorGridLines)
			{
				var majorGridLines:Object = styles.majorGridLines;
				if(majorGridLines.color != null)
				{
					this.chart.setStyle(axisName + "AxisGridLineColor", this.parseColor(majorGridLines.color));
				}
				if(majorGridLines.size != null)
				{
					this.chart.setStyle(axisName + "AxisGridLineWeight", majorGridLines.size);
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisGridLines", majorGridLines.size > 0);
				}
			}
			
			if(styles.minorGridLines)
			{
				var minorGridLines:Object = styles.minorGridLines;
				if(minorGridLines.color != null)
				{
					this.chart.setStyle(axisName + "AxisMinorGridLineColor", this.parseColor(minorGridLines.color));
				}
				if(minorGridLines.size != null)
				{
					this.chart.setStyle(axisName + "AxisMinorGridLineWeight", minorGridLines.size);
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisMinorGridLines", minorGridLines.size > 0);
					this.log("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisMinorGridLines" + " " + minorGridLines.size + " " + (minorGridLines.size > 0));
				}
			}
			
			if(styles.majorTicks)
			{
				var majorTicks:Object = styles.majorTicks;
				if(majorTicks.color != null)
				{
					this.chart.setStyle(axisName + "AxisTickColor", this.parseColor(majorTicks.color));
				}
				if(majorTicks.size != null)
				{
					this.chart.setStyle(axisName + "AxisTickWeight", majorTicks.size);
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisTicks", majorTicks.size > 0);
				}
				if(majorTicks.length != null)
				{
					this.chart.setStyle(axisName + "AxisTickLength", majorTicks.length);
				}
				if(majorTicks.position)
				{
					this.chart.setStyle(axisName + "AxisTickPosition", majorTicks.position);
				}
			}
			
			if(styles.minorTicks)
			{
				var minorTicks:Object = styles.minorTicks;
				if(minorTicks.color != null)
				{
					this.chart.setStyle(axisName + "AxisMinorTickColor", this.parseColor(minorTicks.color));
				}
				if(minorTicks.size != null)
				{
					this.chart.setStyle(axisName + "AxisMinorTickWeight", minorTicks.size);
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisMinorTicks", minorTicks.size > 0);
				}
				if(minorTicks.length != null)
				{
					this.chart.setStyle(axisName + "AxisMinorTickLength", minorTicks.length);
				}
				if(minorTicks.position)
				{
					this.chart.setStyle(axisName + "AxisMinorTickPosition", minorTicks.position);
				}
			}
		}
		
		protected function setLegendStyles(styles:Object):void
		{
			if(styles.font)
			{
				var textFormat:TextFormat = TextFormatSerializer.readTextFormat(styles.font);
				this.legend.setStyle("textFormat", textFormat);
			}
			
			if(styles.spacing)
			{
				this.legend.setStyle("itemSpacing", styles.spacing);
			}
			
			if(styles.display)
			{
				switch(styles.display)
				{
					case "left":
					case "right":
						this.legend.setStyle("orientation", "vertical");
						break;
					default: //top, bottom
						this.legend.setStyle("orientation", "horizontal");
				}
				this.legendDisplay = styles.display;
			}
		}
		
	//--------------------------------------
	//  Private Methods
	//--------------------------------------
		
		/**
		 * @private
		 * Creates a pseudo-class to instantiate a BackgroundAndBorder object.
		 */
		private function createBorderBackgroundFactory():InstanceFactory
		{
			var factory:InstanceFactory = new InstanceFactory(BackgroundAndBorder);
			factory.properties =
			{
				fillColor: 0xffffff,
				fillAlpha: 1,
				borderColor: 0x000000,
				borderWeight: 1,
				image: null,
				imageMode: BackgroundImageMode.REPEAT
			};
			return factory;
		}
		
		private function createMarkerSkin(imagePath:String, series:ISeries):InstanceFactory
		{
			//a simple UILoader would be enough, but we want tiling
			var skin:InstanceFactory = this.createBorderBackgroundFactory();
			//turn off the border
			skin.properties.borderWeight = 0;
			//turn off the fill
			skin.properties.fillAlpha = 0;
			skin.properties.image = imagePath;
			if(series is LineSeries)
			{
				//make points fit to size and maintain their aspect ratio
				skin.properties.imageMode = BackgroundImageMode.STRETCH_AND_MAINTAIN_ASPECT_RATIO;
			}
			return skin;
		}
		
		private function parseColor(value:Object):uint
		{
			if(!(value is Number))
			{
				value = value.toString();
				if(value.indexOf("0x") != 0)
				{
					value = "0x" + value;
				}
				return parseInt(String(value), 16);
			}
			return uint(value);
		}
	}
}
