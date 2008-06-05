package com.yahoo.yui.charts
{
	import com.yahoo.astra.fl.charts.series.*;
	import com.yahoo.astra.utils.JavaScriptUtil;
	
	import flash.utils.Dictionary;
	import flash.utils.getDefinitionByName;
	import flash.utils.getQualifiedClassName;
	
	public class SeriesSerializer
	{
		
	//--------------------------------------
	//  Class Properties
	//--------------------------------------
	
		private static var shortNameToSeriesTypeHash:Object = {bar: BarSeries, column: ColumnSeries, line: LineSeries, pie: PieSeries};
		private static var seriesTypeToShortNameHash:Dictionary = new Dictionary();
	
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
		
		private static function initializeSeriesTypes():void
		{
			seriesTypeToShortNameHash[BarSeries] = "bar";
			seriesTypeToShortNameHash[ColumnSeries] = "column";
			seriesTypeToShortNameHash[LineSeries] = "line";
			seriesTypeToShortNameHash[PieSeries] = "pie";
		}
		initializeSeriesTypes();
		
		public static function shortNameToSeriesType(name:String):Class
		{
			return shortNameToSeriesTypeHash[name];
		}
		
		public static function seriesTypeToShortName(type:Class):String
		{
			return seriesTypeToShortNameHash[type];
		}
		
		public static function writeSeries(input:ISeries):Object
		{
			if(!input) return null;
			
			var type:String = seriesTypeToShortNameHash[getDefinitionByName(getQualifiedClassName(input))];
			var series:Object = {type: type, data: input.dataProvider, displayName: input.displayName};
			if(input is CartesianSeries)
			{
				var cartesianSeries:CartesianSeries = CartesianSeries(input);
				series.yField = cartesianSeries.verticalField;
				series.xField = cartesianSeries.horizontalField;
			}
			else if(input is PieSeries)
			{
				series.dataField = PieSeries(input).dataField;
				series.categoryField = PieSeries(input).categoryField;
			}
			return series;
		}
		
		public static function readSeries(input:Object, series:ISeries = null):ISeries
		{
			if(!input || !input.type) return null;
			
			if(!series)
			{
				var SeriesType:Class = shortNameToSeriesTypeHash[input.type];
				series = new SeriesType()
			}
			series.dataProvider = input.dataProvider;
			series.displayName = input.displayName;
			if(series is CartesianSeries)
			{
				var cartesianSeries:CartesianSeries = CartesianSeries(series);
				cartesianSeries.verticalField = input.yField;
				cartesianSeries.horizontalField = input.xField;
			}
			else if(series is PieSeries)
			{
				PieSeries(series).dataField = input.dataField;
				PieSeries(series).categoryField = input.categoryField;
				if(input.hasOwnProperty("labelFunction"))
				{
					PieSeries(series).labelFunction = JavaScriptUtil.createCallbackFunction(input.labelFunction).callback;
				}
			}
			return series;
		}
	}
}