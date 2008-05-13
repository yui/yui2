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
			axis.hideOverlappingLabels = input.hideOverlappingLabels;
			if(input.labelFunction)
			{
				axis.labelFunction = JavaScriptUtil.createCallbackFunction(input.labelFunction).callback;
			}
			
			if(axis is NumericAxis)
			{
				var numericAxis:NumericAxis = NumericAxis(axis);
				if(input.minimum != null && !isNaN(input.minimum))
				{
					numericAxis.minimum = input.minimum;
				}
				if(input.maximum != null && !isNaN(input.maximum))
				{
					numericAxis.maximum = input.maximum;
				}
				if(input.majorUnit != null && !isNaN(input.majorUnit))
				{
					numericAxis.majorUnit = input.majorUnit;
				}
				if(input.minorUnit != null && !isNaN(input.minorUnit))
				{
					numericAxis.minorUnit = input.minorUnit;
				}
				numericAxis.snapToUnits = input.snapToUnits;
				numericAxis.alwaysShowZero = input.alwaysShowZero;
				numericAxis.scale = input.scale;
			}
			else if(axis is TimeAxis)
			{
				var timeAxis:TimeAxis = TimeAxis(axis);
				if(input.minimum != null && !isNaN(input.minimum))
				{
					timeAxis.minimum = input.minimum;
				}
				if(input.maximum != null && !isNaN(input.maximum))
				{
					timeAxis.maximum = input.maximum;
				}
				if(input.majorUnit != null && !isNaN(input.majorUnit))
				{
					timeAxis.majorUnit = input.majorUnit;
				}
				if(input.majorTimeUnit != null)
				{
					timeAxis.majorTimeUnit = input.majorTimeUnit;
				}
				if(input.minorUnit != null && !isNaN(input.minorUnit))
				{
					timeAxis.minorUnit = input.minorUnit;
				}
				if(input.minorTimeUnit != null)
				{
					timeAxis.minorTimeUnit = input.minorTimeUnit;
				}
				timeAxis.snapToUnits = input.snapToUnits;
			}
			else if(axis is CategoryAxis)
			{
				var categoryAxis:CategoryAxis = CategoryAxis(axis);
				if(input.categoryNames != null)
				{
					categoryAxis.categoryNames = input.categoryNames;
				}
			}
			return axis;
		}
	}
}