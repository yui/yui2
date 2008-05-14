package
{
	import com.adobe.serialization.json.JSON;
	import com.yahoo.astra.fl.charts.*;
	import com.yahoo.astra.fl.charts.events.ChartEvent;
	import com.yahoo.astra.fl.charts.legend.Legend;
	import com.yahoo.astra.fl.charts.series.*;
	import com.yahoo.astra.fl.charts.skins.*;
	import com.yahoo.astra.utils.InstanceFactory;
	import com.yahoo.astra.utils.JavaScriptUtil;
	import com.yahoo.yui.LoggerCategory;
	import com.yahoo.yui.YUIAdapter;
	import com.yahoo.yui.charts.*;
	
	import fl.core.UIComponent;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.ErrorEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.text.TextFormat;
	import flash.utils.getQualifiedClassName;

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
		
		protected var _legendDisplay:String = "none";
		
		public function get legendDisplay():String
		{
			return this._legendDisplay;
		}
		
		public function set legendDisplay(value:String):void
		{
			this._legendDisplay = value;
			this.refreshComponentSize();
		}
		
		protected var _spacing:Number = 6;
		
		public function get spacing():Number
		{
			return this._spacing;
		}
		
		public function set spacing(value:Number):void
		{
			this._spacing = value;
			this.refreshComponentSize();
		}
		
		protected var _padding:Number = 10;
		
		public function get padding():Number
		{
			return this._padding;
		}
		
		public function set padding(value:Number):void
		{
			this._padding = value;
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
			chart.setStyle("contentPadding", 0);
			chart.setStyle("backgroundSkin", Sprite);
			var backgroundFactory:InstanceFactory = this.createBorderBackgroundFactory();
			backgroundFactory.properties.fillColor = 0xffffff;
			backgroundFactory.properties.fillAlpha = 0.9;
			backgroundFactory.properties.borderWeight = 1;
			backgroundFactory.properties.borderColor = 0x000000;
			chart.setStyle("dataTipBackgroundSkin", backgroundFactory);
			chart.setStyle("seriesMarkerSkins", []);
			this.addChildAt(chart, 1);
			
			this.component = chart;
			this.chart.addEventListener(ChartEvent.ITEM_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_DOUBLE_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OUT, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OVER, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(MouseEvent.MOUSE_DOWN, chartItemExtraEventHandler, false, 0, true);
			
			this.chart.legend = this.legend;
			
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
			
			//make sures the series are created!
			this.chart.drawNow();
			
			//set the styles for the series
			if(styleChanged)
			{
				this.setSeriesStyles(seriesStyles);
			}
			
			this.refreshComponentSize();
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
		 * Accepts a JSON-encoded set of styles for the chart itself.
		 * Flash Player versions below 9.0.60 don't encode ExternalInterface
		 * calls correctly!
		 */
		public function setStyles(styles:String):void
		{
			if(!styles) return;
			var parsedStyles:Object = JSON.decode(styles);
			for(var styleName:String in parsedStyles)
			{
				this.setStyle(styleName, parsedStyles[styleName], false);
			}
		}
		
		public function setStyle(name:String, value:Object, json:Boolean = true):void
		{
			if(json && value)
			{
				//by default, we assume it's json data, only setStyles will send false
				value = JSON.decode(value as String);
			}
			
			var needsSizingRefresh:Boolean = false;
			
			switch(name)
			{
				case "padding":
					this.padding = value as Number;
					needsSizingRefresh = true;
					break;
				case "spacing":
					this.spacing = value as Number;
					needsSizingRefresh = true;
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
						needsSizingRefresh = true;
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
					this.setLegendStyles(value);
					break;
				default:
					this.log("Unknown style: " + name);
			}
			
			if(needsSizingRefresh)
			{
				this.refreshComponentSize();
			}
		}
		
		public function setSeriesStyles(styles:Array):void
		{
			var defaultPointSkins:Array = [CircleSkin, DiamondSkin, RectangleSkin, TriangleSkin];
			var defaultSeriesColors:Array =
					[0x00b8bf, 0x8dd5e7, 0xedff9f, 0xffa928, 0xc0fff6, 0xd00050,
					0xc6c6c6, 0xc3eafb, 0xfcffad, 0xcfff83, 0x444444, 0x4d95dd,
					0xb8ebff, 0x60558f, 0x737d7e, 0xa64d9a, 0x8e9a9b, 0x803e77];
					
			//will be filled based on the defaults or the series style definition, if present.
			var seriesColors:Array = [];
			var seriesCount:int = Math.min(this.chart.dataProvider.length, styles.length);
			for(var i:int = 0; i < seriesCount; i++)
			{
				var series:ISeries = ISeries(this.chart.dataProvider[i]);
				var style:Object = styles[i];
				if(style)
				{
					style = JSON.decode(style as String);
				}
				
				//defaults
				var defaultColors:Array = defaultSeriesColors.concat();
				if(series is PieSeries)
				{
					defaultColors = [defaultColors];
				}
				
				var defaultSize:Number = 10;
				if(series is ColumnSeries || series is BarSeries)
				{
					defaultSize = 20;
				}
				
				var defaultSkin:Object = RectangleSkin;
				if(series is LineSeries)
				{
					defaultSkin = defaultPointSkins[i % defaultPointSkins.length];
				}
				else if(series is PieSeries)
				{
					defaultSkin = [defaultSkin];
				}
			
				//initialize styles with defaults
				var color:Object = defaultColors[i % defaultColors.length];
				var skin:Object = defaultSkin;
				var mode:Object = "repeat";
				if(style)
				{
					for(var styleName:String in style)
					{
						switch(styleName)
						{
							case "images":
								if(!series is PieSeries)
								{
									this.log(styleName + " style not supported by specified series type.");
									break;
								}
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
								if(!(series is LineSeries))
								{
									skin.properties.fillColor = color;
									skin.properties.fillAlpha = 1;
								}
								break;
							case "mode":
								mode = style.mode;
								break;
							case "colors":
								if(!series is PieSeries)
								{
									this.log(styleName + " style not supported by specified series type.");
									break;
								}
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
								if(skin is InstanceFactory && !(series is LineSeries))
								{
									skin.properties.fillColor = color;
									skin.properties.fillAlpha = 1;
								}
								break;
							case "size":
								UIComponent(series).setStyle("markerSize", style.size);
								break;
							case "lineSize":
								UIComponent(series).setStyle("lineWeight", style.lineSize);
								break;
							case "connectPoints":
								UIComponent(series).setStyle("connectPoints", style.connectPoints);
								break;
							case "connectDiscontinuousPoints":
								UIComponent(series).setStyle("connectDiscontinuousPoints", style.connectDiscontinuousPoints);
								break;
							case "discontinuousDashLength":
								UIComponent(series).setStyle("discontinuousDashLength", style.discontinuousDashLength);
								break;
							default:
								this.log("Unknown series style: " + styleName);
						}
					}
				}
				if(mode)
				{
					if(skin is InstanceFactory)
					{
						skin.properties.imageMode = mode;
					}
					else if(skin is Array)
					{
						var skinCount:int = (skin as Array).length;
						for(j = 0; j < skinCount; j++)
						{
							var subSkin:InstanceFactory = skin[j] as InstanceFactory;
							if(subSkin)
							{
								subSkin.properties.imageMode = mode;
							}
						}
					}
				}
				
				if(series is PieSeries)
				{
					PieSeries(series).setStyle("markerSkins", skin);
				}
				else UIComponent(series).setStyle("markerSkin", skin);
				
				seriesColors[i] = color;
			}
			this.chart.setStyle("seriesColors", seriesColors);

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
			
			try
			{
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
			}
			catch(error:SecurityError)
			{
				//do nothing. it will be caught by the YUIAdapter.
			}

			this.backgroundAndBorder = new BackgroundAndBorder();
			this.backgroundAndBorder.width = this.stage.stageWidth;
			this.backgroundAndBorder.height = this.stage.stageHeight;
			this.backgroundAndBorder.addEventListener(ErrorEvent.ERROR, backgroundErrorHandler);
			this.addChild(this.backgroundAndBorder);
			
			this.legend = new Legend();
			this.legend.setStyle("backgroundSkin", Shape);
			this.addChild(this.legend);
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
			}
			
			if(this.chart)
			{
				this.chart.x = this.chart.y = this.backgroundAndBorder.borderWeight + this.padding;
				this.chart.width -= 2 * (this.backgroundAndBorder.borderWeight + this.padding);
				this.chart.height -= 2 * (this.backgroundAndBorder.borderWeight + this.padding);
				if(this.legend && this.legendDisplay != "none")
				{
					this.legend.visible = true;
					//we need to draw because the legend resizes itself
					this.legend.drawNow();
					
					if(this.legendDisplay == "left" || this.legendDisplay == "right")
					{
						if(this.legendDisplay == "left")
						{
							this.legend.x = this.backgroundAndBorder.borderWeight + this.padding;
							this.chart.x = this.legend.x + this.legend.width + this.spacing;
						}
						else //right
						{
							this.legend.x = this.stage.stageWidth - this.backgroundAndBorder.borderWeight - this.legend.width - padding;
						}
						//center vertically
						this.legend.y = Math.max(0, (this.stage.stageHeight - this.legend.height) / 2);
						this.chart.width -= (this.legend.width + this.spacing);
					}
					else //top or bottom
					{
						if(this.legendDisplay == "top")
						{
							this.legend.y = this.backgroundAndBorder.borderWeight + this.padding;
							this.chart.y = this.legend.y + this.legend.height + this.spacing;
						}
						else //bottom
						{
							this.legend.y = this.stage.stageHeight - this.backgroundAndBorder.borderWeight - this.legend.height - padding;
						}
						//center horizontally
						this.legend.x = Math.max(0, (this.stage.stageWidth - this.legend.width) / 2);
						this.chart.height -= (this.legend.height + this.spacing);
					}
				}
				else
				{
					this.legend.visible = false;
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
			var type:String = event.type.replace("Roll", "Mouse");
			type += "Event";
			var seriesIndex:int = (this.chart.dataProvider as Array).indexOf(event.series);
			var itemEvent:Object = {type: type, seriesIndex: seriesIndex, index: event.index, item: event.item, x: this.mouseX, y: this.mouseY};
			this.dispatchEventToJavaScript(itemEvent);
		}
		
		private var _lastMouseItem:ISeriesItemRenderer;
		
		protected function chartItemExtraEventHandler(event:MouseEvent):void
		{
			var dragEventType:String = "itemDragEvent";
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
				dragEventType = "itemDragStartEvent";
			}
			else if(event.type == MouseEvent.MOUSE_UP)
			{
				dragEventType = "itemDragEndEvent";
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
			if(styles.padding >= 0)
			{
				contentPadding = styles.padding;
			}
			
			if(styles.border || styles.background)
			{
				//defaults
				var backgroundFactory:InstanceFactory = this.createBorderBackgroundFactory();
				backgroundFactory.properties.fillColor = 0xffffff;
				backgroundFactory.properties.fillAlpha = 0.9;
				backgroundFactory.properties.borderWeight = 1;
				backgroundFactory.properties.borderColor = 0x000000;
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
			
			if(styles.showLabels != null)
			{
				this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisLabels", styles.showLabels);
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
				}
				if(majorTicks.length != null)
				{
					this.chart.setStyle(axisName + "AxisTickLength", majorTicks.length);
				}
				if(majorTicks.display)
				{
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisTicks", majorTicks.display != "none");
					if(majorTicks.display != "none")
					{
						this.chart.setStyle(axisName + "AxisTickPosition", majorTicks.display);
					}
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
				}
				if(minorTicks.length != null)
				{
					this.chart.setStyle(axisName + "AxisMinorTickLength", minorTicks.length);
				}
				if(minorTicks.display)
				{
					this.chart.setStyle("show" + axisName.substr(0, 1).toUpperCase() + axisName.substr(1) + "AxisMinorTicks", minorTicks.display != "none");
					if(minorTicks.display != "none")
					{
						this.chart.setStyle(axisName + "AxisMinorTickPosition", minorTicks.display);
					}
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
			
			if(styles.spacing != null)
			{
				this.legend.setStyle("gap", styles.spacing);
			}
			
			if(styles.display)
			{
				switch(styles.display)
				{
					case "left":
					case "right":
						this.legend.setStyle("direction", "vertical");
						break;
					default: //top, bottom
						this.legend.setStyle("direction", "horizontal");
				}
				this.legendDisplay = styles.display;
			}
			
			var contentPadding:Number = 6;
			if(styles.padding != null)
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
				this.legend.setStyle("backgroundSkin", backgroundFactory);
			}
			
			this.legend.setStyle("contentPadding", contentPadding);
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
				borderWeight: 0,
				image: null,
				imageMode: BackgroundImageMode.REPEAT
			};
			factory.methods =
			{
				addEventListener: [ErrorEvent.ERROR, backgroundLoadErrorHandler, false, 0, true]
			};
			return factory;
		}
		
		private function backgroundLoadErrorHandler(event:ErrorEvent):void
		{
			this.log(event.text, LoggerCategory.ERROR);
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
			skin.properties.imageMode = BackgroundImageMode.REPEAT;
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
				var valueAsString:String = value.toString().replace("#", "");
				if(valueAsString.indexOf("0x") != 0)
				{
					valueAsString = "0x" + valueAsString;
				}
				return parseInt(String(valueAsString), 16);
			}
			return uint(value);
		}
	}
}
