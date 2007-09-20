package com.yahoo.yui.charts
{
	import com.yahoo.astra.fl.charts.ISeries;
	import com.yahoo.astra.fl.charts.series.*;
	import flash.utils.Dictionary;
	import flash.utils.getQualifiedClassName;
	import flash.utils.getDefinitionByName;
	
	public class SeriesSerializer
	{
		
	//--------------------------------------
	//  Class Properties
	//--------------------------------------
	
		private static var shortNameToSeriesType:Object = {bar: BarSeries, column: ColumnSeries, line: LineSeries, pie: PieSeries};
		private static var seriesTypeToShortName:Dictionary = new Dictionary();
	
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
		
		private static function initializeSeriesTypes():void
		{
			seriesTypeToShortName[BarSeries] = "bar";
			seriesTypeToShortName[ColumnSeries] = "column";
			seriesTypeToShortName[LineSeries] = "line";
			seriesTypeToShortName[PieSeries] = "pie";
		}
		initializeSeriesTypes();
		
		public static function writeSeries(input:ISeries):Object
		{
			if(!input) return null;
			
			var type:String = seriesTypeToShortName[getDefinitionByName(getQualifiedClassName(input))];
			var series:Object = {type: type, data: input.dataProvider, displayName: input.displayName};
			if(input is CartesianSeries)
			{
				var cartesianSeries:CartesianSeries = CartesianSeries(input);
				series.verticalField = cartesianSeries.verticalField;
				series.horizontalField = cartesianSeries.horizontalField;
			}
			else if(input is PieSeries)
			{
				series.dataField = PieSeries(input).dataField;
			}
			return series;
		}
		
		public static function readSeries(input:Object):ISeries
		{
			if(!input || !input.type) return null;
			
			var SeriesType:Class = shortNameToSeriesType[input.type];
			var series:ISeries = new SeriesType()
			series.dataProvider = input.dataProvider;
			series.displayName = input.displayName;
			if(series is CartesianSeries)
			{
				var cartesianSeries:CartesianSeries = CartesianSeries(series);
				cartesianSeries.verticalField = input.verticalField;
				cartesianSeries.horizontalField = input.horizontalField;
			}
			else if(series is PieSeries)
			{
				PieSeries(series).dataField = input.dataField;
			}
			return series;
		}
	}
}