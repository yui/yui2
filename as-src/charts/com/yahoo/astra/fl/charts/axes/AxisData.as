package com.yahoo.astra.fl.charts.axes
{
	public class AxisData
	{
		public function AxisData(position:Number, value:Object, label:String)
		{
			this.position = position;
			this.value = value;
			this.label = label;
		}

		public var position:Number;
		public var value:Object;
		public var label:String;
	}
}