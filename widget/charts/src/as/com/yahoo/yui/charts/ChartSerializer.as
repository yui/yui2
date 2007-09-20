package com.yahoo.yui.charts
{
	import com.yahoo.astra.fl.charts.*;
	import flash.utils.Dictionary;
	import flash.utils.getQualifiedClassName;
	import flash.utils.getDefinitionByName;
	
	public class ChartSerializer
	{
		
	//--------------------------------------
	//  Class Properties
	//--------------------------------------
	
		private static var shortNameToType:Object = {bar: BarChart, column: ColumnChart, line: LineChart, pie: PieChart};
		private static var typeToShortName:Dictionary = new Dictionary();
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		private static function initializeTypes():void
		{
			typeToShortName[BarChart] = "bar";
			typeToShortName[ColumnChart] = "column";
			typeToShortName[LineChart] = "line";
			typeToShortName[PieChart] = "pie";
		}
		initializeTypes();
		
		public static function getShortName(input:Object):String
		{
			if(!input) return null;
			
			if(input is String)
			{
				input = getDefinitionByName(input as String);
			}
			var shortName:String = shortNameToType[input];
			return shortName;
		}
		
		public static function getType(shortName:String):Class
		{
			return shortNameToType[shortName];
		}
	}
}