package com.yahoo.astra.fl.charts.series
{
	import com.yahoo.astra.fl.charts.legend.LegendItemData;
	
	import fl.core.InvalidationType;
	
	import flash.events.Event;

	/**
	 * Functionality common to most series appearing in cartesian charts.
	 * Generally, a <code>CartesianSeries</code> object shouldn't be
	 * instantiated directly. Instead, a subclass with a concrete implementation
	 * should be used.
	 * 
	 * @author Josh Tynjala
	 */
	public class CartesianSeries extends Series implements ILegendItemSeries
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function CartesianSeries(data:Object = null)
		{
			super(data);
		}
	
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Storage for the horizontalField property.
		 */
		private var _horizontalField:String;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.ISeries#horizontalField
		 */
		public function get horizontalField():String
		{
			return this._horizontalField;
		}
		
		/**
		 * @private
		 */
		public function set horizontalField(value:String):void
		{
			if(this._horizontalField != value)
			{
				this._horizontalField = value;
				this.dispatchEvent(new Event("dataChange"));
				this.invalidate(InvalidationType.DATA);
			}
		}
		
		/**
		 * @private
		 * Storage for the verticalField property.
		 */
		private var _verticalField:String;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.ISeries#verticalField
		 */
		public function get verticalField():String
		{
			return this._verticalField;
		}
		
		/**
		 * @private
		 */
		public function set verticalField(value:String):void
		{
			if(this._verticalField != value)
			{
				this._verticalField = value;
				this.dispatchEvent(new Event("dataChange"));
				this.invalidate(InvalidationType.DATA);
			}
		}
	
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
		
		/**
		 * @copy com.yahoo.astra.fl.charts.series.ILegendItemSeries#createLegendItemData()
		 */
		public function createLegendItemData():LegendItemData
		{
			return new LegendItemData(this.displayName, this.getStyleValue("markerSkin"), this.getStyleValue("fillColor") as uint);
		}
		
	}
}