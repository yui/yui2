package com.yahoo.astra.fl.charts.axes
{
	import com.yahoo.astra.fl.charts.IChart;
	
	/**
	 * Implements some of the most common axis functionality
	 * to prevent duplicate code in IAxis implementations.
	 * 
	 * <p>This class is not meant to be instantiated directly! It is an abstract base class.</p>
	 * 
	 * @author Josh Tynjala
	 */
	public class BaseAxis
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function BaseAxis()
		{
		}

	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * @private
		 * Storage for the chart property.
		 */
		private var _chart:IChart;
	
		/**
		 * @copy com.yahoo.astra.fl.charts.axes.IAxis#chart
	     */
		public function get chart():IChart
		{
			return this._chart;
		}
		
		/**
		 * @private
		 */
		public function set chart(value:IChart):void
		{
			this._chart = value;
		}
		
		/**
		 * @private
		 * Storage for the renderer property.
		 */
		private var _renderer:IAxisRenderer;
		
		//TODO: Consider having the renderer know about the axis
		//rather than the axis knowing about the renderer. This
		//change will allow multiple views to this model.
		//if this is implemented, a separate controller will be
		//needed too.
		/**
		 * The visual renderer applied to this axis.
		 */
		public function get renderer():IAxisRenderer
		{
			return this._renderer;
		}
		
		/**
		 * @private
		 */
		public function set renderer(value:IAxisRenderer):void
		{
			this._renderer = value;
		}
		
		/**
		 * @private
		 * Storage for the labelFunction property.
		 */
		private var _labelFunction:Function;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.axes.labelFunction
		 */
		public function get labelFunction():Function
		{
			return this._labelFunction;
		}
		
		/**
		 * @private
		 */
		public function set labelFunction(value:Function):void
		{
			this._labelFunction = value;
		}
		
		/**
		 * @private
		 * Storage for the reverse property.
		 */
		private var _reverse:Boolean = false;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.axes.IAxis#reverse
		 */
		public function get reverse():Boolean
		{
			return this._reverse;
		}
		
		/**
		 * @private
		 */
		public function set reverse(value:Boolean):void
		{
			this._reverse = value;
		}
		
		/**
		 * @private
		 * Storage for the title property.
		 */
		private var _title:String = "";
		
		/**
		 * @copy com.yahoo.astra.fl.charts.axes.IAxis#title
		 */
		public function get title():String
		{
			return this._title;
		}
		
		/**
		 * @private
		 */
		public function set title(value:String):void
		{
			this._title = value;
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
	
		/**
		 * @copy com.yahoo.astra.fl.charts.axes.IAxis#valueToLabel()
		 */
		public function valueToLabel(value:Object):String
		{
			if(value == null)
			{
				return "";
			}
			
			var text:String = value.toString();
			if(this._labelFunction != null)
			{
				text = this._labelFunction(value);
			}
			
			if(text == null)
			{
				text = "";
			}
			return text;
		}
	}
}