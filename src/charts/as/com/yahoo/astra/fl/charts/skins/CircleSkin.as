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
		
		/**
		 * @private
		 * Storage for the fill alpha.
		 */
		private var _fillAlpha:Number = 1;
		
		/**
		 * The alpha value of the fill.
		 */
		public function get fillAlpha():Number
		{
			return _fillAlpha;
		}

		/**
		 * @private (setter)
		 */
		public function set fillAlpha(value:Number):void
		{
			if(this._fillAlpha != value)
			{
				this._fillAlpha = value;
				this.invalidate();
			}
		}
		
		/**
		 * @private
		 * Storage for the border alpha.
		 */
		private var _borderAlpha:Number = 1;
		
		/**
		 * The alpha value of the border.
		 */
		public function get borderAlpha():Number
		{
			return _borderAlpha;
		}
		
		/**
		 * @private (setter)
		 */
		public function set borderAlpha(value:Number):void
		{
			if(this._borderAlpha != value)
			{
				this._borderAlpha = value;
				this.invalidate();
			}
		}
		
		/**
		 * @private 
		 * Sprite used to render the border.
		 */
		private var _border:Sprite;
		
		/**
		 * @private
		 * Sprite used to render the fill.
		 */
		private var _fill:Sprite;
		
		/**
		 * @private
		 * Sprite used to mask the border when applicable.
		 */
		private var _mask:Sprite; 
		
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
			_border.graphics.beginFill(this.borderColor, this.borderAlpha);
			_border.graphics.drawCircle(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2);
			_border.graphics.endFill();
			_border.cacheAsBitmap = true;			

			if(_mask == null)
			{
				_mask = new Sprite();
				this.addChild(_mask);
				_mask.cacheAsBitmap = true;
				_border.mask = _mask;
			}
			
			var maskAlpha:Number;
			var maskLineStyle:Number;
			var maskBuffer:Number;
			if(this.fillAlpha < 1)
			{
				maskAlpha = 0;
				maskLineStyle = 2;
				maskBuffer = 0;
			}
			else
			{
				maskAlpha = 1;
				maskLineStyle = 0;
				maskBuffer = 1;				
			}
			_mask.graphics.clear();
			_mask.graphics.lineStyle(maskLineStyle, 0x000000, maskLineStyle);
			_mask.graphics.beginFill(0x000000, maskAlpha);
			_mask.graphics.drawCircle((this.width / 2), (this.height / 2), Math.min(this.width + maskBuffer, this.height + maskBuffer) / 2);			
			_mask.graphics.endFill();				

			if(_fill == null)
			{
				_fill = new Sprite();
				this.addChild(_fill);
			}
			_fill.graphics.clear();
			_fill.graphics.lineStyle(0, 0 , 0);
			_fill.graphics.beginFill(this.fillColor, this.fillAlpha);
			_fill.graphics.drawCircle((this.width / 2), (this.height / 2), Math.min(this.width-2, this.height-2) / 2);
			_fill.graphics.endFill();	
		}
		
	}
}