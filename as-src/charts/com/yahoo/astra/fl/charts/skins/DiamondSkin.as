package com.yahoo.astra.fl.charts.skins
{
	import fl.core.UIComponent;

	/**
	 * A skin shaped like a diamond with a single color.
	 * 
	 * @author Josh Tynjala
	 */
	public class DiamondSkin extends UIComponent implements IProgrammaticSkin
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function DiamondSkin()
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
			
			this.graphics.clear();
			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			
			this.graphics.lineStyle(0, 0, 0);
			this.graphics.beginFill(this._fillColor, 1);
			
			var w:Number = 5 * Math.min(this.width, this.height) / 4;
			var h:Number = w;
			
			var startX:Number = (this.width - w) / 2;
			var startY:Number = (this.height - h) / 2;
			var endX:Number = startX + w;
			var endY:Number = startY + h;
			
			this.graphics.moveTo(startX, this.height / 2);
			this.graphics.lineTo(this.width / 2, startY);
			this.graphics.lineTo(endX, this.height / 2);
			this.graphics.lineTo(this.width / 2, endY);
			this.graphics.lineTo(startX, this.height / 2);
			this.graphics.endFill();
		}
		
	}
}