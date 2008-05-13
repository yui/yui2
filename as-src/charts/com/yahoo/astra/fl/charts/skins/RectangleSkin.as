package com.yahoo.astra.fl.charts.skins
{
	import fl.core.UIComponent;

	/**
	 * A skin shaped like a rectangle with a single color.
	 * 
	 * @author Josh Tynjala
	 */
	public class RectangleSkin extends UIComponent implements IProgrammaticSkin
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function RectangleSkin()
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
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
	
		/**
		 * @private
		 */
		override protected function draw():void
		{
			super.draw();
			
			//since the Blaze component architecture rounds the position,
			//we need to account for that to make sure the mark displays correctly.
			var xDiff:Number = this._x - Math.round(this._x);
			var yDiff:Number = this._y - Math.round(this._y);
			
			this.graphics.clear();
			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			
			this.graphics.lineStyle(0, 0, 0);
			this.graphics.beginFill(this._fillColor, 1);
			this.graphics.drawRect(xDiff, yDiff, this.width, this.height);
			this.graphics.endFill();
		}
		
	}
}