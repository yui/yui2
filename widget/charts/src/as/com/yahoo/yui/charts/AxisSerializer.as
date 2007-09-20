package com.yahoo.yui.charts
{
	import com.yahoo.astra.fl.charts.*;
	import flash.utils.Dictionary;
	import flash.utils.getQualifiedClassName;
	import flash.utils.getDefinitionByName;
	import com.yahoo.astra.utils.JavaScriptUtil;
	
	public class AxisSerializer
	{
		
	//--------------------------------------
	//  Class Properties
	//--------------------------------------
	
		private static var shortNameToType:Object = {numeric: NumericAxis, category: CategoryAxis, time: TimeAxis};
		private static var typeToShortName:Dictionary = new Dictionary();
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		private static function initializeTypes():void
		{
			typeToShortName[NumericAxis] = "numeric";
			typeToShortName[CategoryAxis] = "category";
			typeToShortName[TimeAxis] = "time";
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
		
		public static function writeAxis(input:IAxis):Object
		{
			var axis:Object = {type: getShortName(getQualifiedClassName(input))};
			return axis;
		}
		
		public static function readAxis(input:Object):IAxis
		{
			var AxisType:Class = AxisSerializer.getType(input.type);
			var axis:IAxis = new AxisType();
			
			axis.title = input.title;
			axis.orientation = input.orientation;
			axis.reverse = input.reverse;
			
			if(axis is NumericAxis)
			{
				var numericAxis:NumericAxis = NumericAxis(axis);
				numericAxis.minimum = input.minimum;
				numericAxis.maximum = input.maximum;
				numericAxis.majorUnit = input.majorUnit;
				numericAxis.minorUnit = input.minorUnit;
				numericAxis.alwaysShowZero = input.alwaysShowZero;
				numericAxis.scale = input.scale;
				numericAxis.labelFunction = JavaScriptUtil.createCallbackFunction(input.labelFunction).callback;
			}
			else if(axis is TimeAxis)
			{
				var timeAxis:TimeAxis = TimeAxis(axis);
				timeAxis.minimum = input.minimum;
				timeAxis.maximum = input.maximum;
				timeAxis.majorUnit = input.majorUnit;
				timeAxis.majorTimeUnit = input.majorTimeUnit;
				timeAxis.minorUnit = input.minorUnit;
				timeAxis.minorTimeUnit = input.minorTimeUnit;
				numericAxis.labelFunction = JavaScriptUtil.createCallbackFunction(input.labelFunction).callback;
			}
			else if(axis is CategoryAxis)
			{
				var categoryAxis:CategoryAxis = CategoryAxis(axis);
				categoryAxis.categoryNames = input.categoryNames;
				numericAxis.labelFunction = JavaScriptUtil.createCallbackFunction(input.labelFunction).callback;
			}
			return axis;
		}
	}
}