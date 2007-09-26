package com.yahoo.yui.charts
{
	import fl.core.InvalidationType;
	import fl.core.UIComponent;
	import flash.display.CapsStyle;
	import flash.display.JointStyle;
	import flash.display.Loader;
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;

	public class BackgroundAndBorder extends UIComponent
	{
		private static const GRAPHICS_INVALID:String = "graphics";
		private static const IMAGE_INVALID:String = "image";
		
		public function BackgroundAndBorder()
		{
			super();
		}
		
		private var _fillColor:uint = 0xffffff;
		
		public function get fillColor():uint
		{
			return this._fillColor;
		}
		
		public function set fillColor(value:uint):void
		{
			if(this._fillColor != value)
			{
				this._fillColor = value;
				this.invalidate(GRAPHICS_INVALID);
			}
		}
		
		private var _borderColor:uint = 0x000000;
		
		public function get borderColor():uint
		{
			return this._borderColor;
		}
		
		public function set borderColor(value:uint):void
		{
			if(this._borderColor != value)
			{
				this._borderColor = value;
				this.invalidate(GRAPHICS_INVALID);
			}
		}
		
		private var _borderWeight:Number = 0;
		
		public function get borderWeight():Number
		{
			return this._borderWeight;
		}
		
		public function set borderWeight(value:Number):void
		{
			if(this._borderWeight != value)
			{
				this._borderWeight = value;
				this.invalidate(GRAPHICS_INVALID);
			}
		}
		
		protected var loader:Loader;
		
		private var _image:String;
		
		public function get image():String
		{
			return this._image;
		}
		
		public function set image(value:String):void
		{
			if(this._image != value)
			{
				this._image = value;
				this.invalidate(IMAGE_INVALID);
			}
		}
		
		override protected function draw():void
		{
			var graphicsInvalid:Boolean = this.isInvalid(GRAPHICS_INVALID);
			var imageInvalid:Boolean = this.isInvalid(IMAGE_INVALID);
			var sizeInvalid:Boolean = this.isInvalid(InvalidationType.SIZE);
			
			if(sizeInvalid || graphicsInvalid)
			{
				this.graphics.clear();
				if(this._borderWeight == 0)
				{
					//if border is zero, we need to do some special stuff
					this.graphics.lineStyle(0, 0, 0);
				}
				else this.graphics.lineStyle(this._borderWeight, this._borderColor, 1, true, "normal", CapsStyle.SQUARE, JointStyle.MITER);
				this.graphics.beginFill(this.fillColor, 1);
				this.graphics.drawRect(this._borderWeight / 2, this._borderWeight / 2, this.width - this._borderWeight, this.height - this._borderWeight);
				this.graphics.endFill();
			}
			
			if(imageInvalid)
			{
				if(this.loader)
				{
					this.removeChild(this.loader);
					this.loader = null;
				}
				
				if(this._image)
				{
					this.loader = new Loader();
					this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loaderCompleteHandler);
					this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, loaderErrorHandler);
					this.loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, loaderErrorHandler);
					this.loader.load(new URLRequest(this.image), new LoaderContext(true));
					this.addChild(this.loader);
				}
			}
			
			if(sizeInvalid)
			{
				if(this.loader && this.loader.content)
				{
					var halfBorderWeight:Number = this._borderWeight / 2;
					this.loader.x = this._borderWeight;
					this.loader.y = this._borderWeight;
					this.loader.width = this.width - this._borderWeight * 2;
					this.loader.height = this.height - this._borderWeight * 2;
				}
			}
			
			super.draw();
		}
		
		/**
		 * @private
		 * Once the loader has finished loading, it's time for a redraw so that
		 * it apppears at the correct size.
		 */
		private function loaderCompleteHandler(event:Event):void
		{
			this.invalidate(InvalidationType.SIZE);
		}
		
		/**
		 * @private
		 * If we encounter an error loading the data, notify as needed.
		 */
		private function loaderErrorHandler(event:Event):void
		{
			var errorText:String = Object(event).text;
			if(this.hasEventListener(ErrorEvent.ERROR))
			{
				this.dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, false, false, errorText));
			}
			else
			{
				throw new Error(errorText);
			}
		}
		
	}
	
}
