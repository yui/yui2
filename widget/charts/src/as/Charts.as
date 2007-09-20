package
{
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	import flash.external.ExternalInterface;
	import flash.system.LoaderContext;
	import flash.utils.getQualifiedClassName;
	import fl.managers.StyleManager;
	import com.yahoo.astra.fl.charts.*;
	import com.yahoo.astra.fl.charts.events.ChartEvent;
	import com.yahoo.astra.utils.JavaScriptUtil;
	import com.yahoo.astra.utils.LoaderUtil;
	import com.yahoo.yui.YUIAdapter;
	import com.yahoo.yui.LoggerCategory;
	import com.yahoo.yui.charts.*;

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
			
			//special style initialization
			StyleManager.setComponentStyle(Chart, "backgroundSkin", ChartBackground);
			StyleManager.setComponentStyle(DataTipRenderer, "backgroundSkin", ChartDataTipBackground);
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * @private (protected)
		 * A reference to the chart instance.
		 */
		protected var chart:Chart;
		
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
			}
			
			var ChartType:Class = ChartSerializer.getType(value);
			var chart:Chart = new ChartType();
			this.addChild(chart);
			
			this.component = chart;
			
			this.chart.addEventListener(ChartEvent.ITEM_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_DOUBLE_CLICK, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OUT, chartItemEventHandler, false, 0, true);
			this.chart.addEventListener(ChartEvent.ITEM_ROLL_OVER, chartItemEventHandler, false, 0, true);
			
			//var autoLoader:Object = LoaderUtil.createAutoLoader("fx.png")
			//this.chart.setStyle("backgroundSkin", autoLoader);
			//this.chart.setStyle("dataTipBackgroundSkin", autoLoader);
			//this.chart.setStyle("seriesMarkerSkins", [autoLoader]);
		}
		
		public function setDataProvider(value:Array):void
		{
			var dataProvider:Array = [];
			var seriesCount:int = value.length;
			for(var i:int = 0; i < seriesCount; i++)
			{
				dataProvider[i] = SeriesSerializer.readSeries(value[i]);
			}
			
			this.chart.dataProvider = dataProvider;
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
		 * 
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
			
			if(ExternalInterface.available)
			{
				ExternalInterface.addCallback("setType", setType);
				ExternalInterface.addCallback("setDataProvider", setDataProvider);
				ExternalInterface.addCallback("getCategoryNames", getCategoryNames);
				ExternalInterface.addCallback("setCategoryNames", setCategoryNames);
				ExternalInterface.addCallback("setDataTipFunction", setDataTipFunction);
				ExternalInterface.addCallback("getHorizontalField", getHorizontalField);
				ExternalInterface.addCallback("setHorizontalField", setHorizontalField);
				ExternalInterface.addCallback("getVerticalField", getVerticalField);
				ExternalInterface.addCallback("setVerticalField", setVerticalField);
				ExternalInterface.addCallback("getHorizontalAxisTitle", getHorizontalAxisTitle);
				ExternalInterface.addCallback("setHorizontalAxisTitle", setHorizontalAxisTitle);
				ExternalInterface.addCallback("getVerticalAxisTitle", getVerticalAxisTitle);
				ExternalInterface.addCallback("setVerticalAxisTitle", setVerticalAxisTitle);
				ExternalInterface.addCallback("getCategoryNames", getCategoryNames);
				ExternalInterface.addCallback("setCategoryNames", setCategoryNames);
				ExternalInterface.addCallback("setHorizontalAxis", setHorizontalAxis);
				ExternalInterface.addCallback("setVerticalAxis", setVerticalAxis);
			}
		}
		
		/**
		 * @private (protected)
		 * Since Chart is a Flash CS3 component, we should call drawNow() to be sure it updates properly.
		 */
		override protected function refreshComponentSize():void
		{
			super.refreshComponentSize();
			if(this.chart)
			{
				this.chart.drawNow();
			}
		}
		
		/**
		 * @private (protected)
		 * 
		 * Receives chart item mouse events and passes them out to JavaScript.
		 */
		protected function chartItemEventHandler(event:ChartEvent):void
		{
			var seriesIndex:int = (this.chart.dataProvider as Array).indexOf(event.series);
			var itemEvent:Object = {type: event.type, seriesIndex: seriesIndex, index: event.index};
			this.dispatchEventToJavaScript(itemEvent);
		}
	}
}
