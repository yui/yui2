package com.yahoo.yui.charts
{
	import flash.utils.Dictionary;
	import flash.utils.getQualifiedClassName;
	import flash.utils.getDefinitionByName;
	import com.yahoo.astra.fl.charts.series.*;
	
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
			}
			return series;
		}
	}
}