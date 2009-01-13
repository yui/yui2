package com.yahoo.astra.fl.charts.skins
{
	import fl.core.UIComponent;
	import flash.display.Sprite;

	/**
	 * A skin shaped like a circle with a single color.
	 * 
	 * @author Josh Tynjala
	 */
	public class CircleSkin extends UIComponent implements IProgrammaticSkin
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function CircleSkin()
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
		
		private var _border:Sprite;
		
		private var _fill:Sprite;
		
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
			
			
			
			if(_border == null)
			{
				_border = new Sprite();
				this.addChild(_border);
			}
			_border.graphics.clear();
			_border.graphics.lineStyle(0, 0, 0);
			_border.graphics.beginFill(this.borderColor, 1);
			_border.graphics.drawCircle(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2);
			_border.graphics.endFill();
			
			if(_fill == null)
			{
				_fill = new Sprite();
				this.addChild(_fill);
			}
			_fill.graphics.clear();
			_fill.graphics.lineStyle(0, 0 , 0);
			_fill.graphics.beginFill(this.fillColor, 1);
			_fill.graphics.drawCircle((this.width / 2), (this.height / 2), Math.min(this.width-2, this.height-2)/2);
			_fill.graphics.endFill();	
		}
		
	}
}