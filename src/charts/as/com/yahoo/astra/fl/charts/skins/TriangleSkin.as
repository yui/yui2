package com.yahoo.astra.fl.charts.skins
{
	import fl.core.UIComponent;

	/**
	 * A skin shaped like a triangle with a single color.
	 * 
	 * @author Josh Tynjala
	 */
	public class TriangleSkin extends UIComponent implements IProgrammaticSkin
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function TriangleSkin()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Storage for the fillColor property.
		 */
		private var _fillColor:uint = 0x000000;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.skins.IProgrammaticSkin#fillColor
		 */
		public function get fillColor():uint
		{
			return this._fillColor;
		}
		
		/**
		 * @private
		 */
		public function set fillColor(value:uint):void
		{
			if(this._fillColor != value)
			{
				this._fillColor = value;
				this.invalidate();
			}
		}
		
		/**
		 * @private 
		 * Storage for outline color
		 */
		private var _borderColor:uint;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.skins.IProgrammaticSkin#borderColor
		 */
		public function get borderColor():uint
		{
			return _borderColor;
		}
		
		/**
		 * @private (setter)
		 */
		public function set borderColor(value:uint):void
		{
			if(this._borderColor != value)
			{
				this._borderColor = value;
				this.invalidate();
			}
		}		
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
	
		/**
		 * @private
		 */
		override protected function draw():void
		{
			super.draw();
			
			this.graphics.clear();
			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			
			if(this.borderColor == this.fillColor)
			{
				this.graphics.lineStyle(0, 0, 0);
			}
			else
			{
				this.graphics.lineStyle(1, this.borderColor, 1);
			}
			this.graphics.beginFill(this._fillColor, 1);
			
			var w:Number = this.width * 1.25;
			var h:Number = w * Math.sqrt(3) / 2;

			this.graphics.moveTo(w / 2, 0);
			this.graphics.lineTo(w, h);
			this.graphics.lineTo(0, h);
			this.graphics.lineTo(w / 2, 0);
			this.graphics.endFill();
		}
		
	}
}