package com.yahoo.astra.fl.charts.series
{
	import com.yahoo.astra.fl.charts.skins.IProgrammaticSkin;
	import com.yahoo.astra.fl.utils.UIComponentUtil;
	
	import fl.core.InvalidationType;
	import fl.core.UIComponent;
	
	import flash.display.DisplayObject;

	//--------------------------------------
	//  Styles
	//--------------------------------------
	
	/**
     * The DisplayObject subclass used to display the background.
     */
    [Style(name="skin", type="Class")]
    
	/**
	 * The color used by a skin that uses fill colors.
	 */
    [Style(name="fillColor", type="uint")]
    
    /**
     * The primary item renderer class for a chart series.
     * 
     * @see com.yahoo.astra.fl.charts.series.Series 
     * 
     * @author Josh Tynjala
     */
	public class SeriesItemRenderer extends UIComponent implements ISeriesItemRenderer
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function SeriesItemRenderer()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		protected var aspectRatio:Number = 1;
		
		/**
		 * @private
		 */
		protected var skin:DisplayObject;
		
		/**
		 * @private
		 * Storage for the series property.
		 */
		private var _series:ISeries;
		
		public function get series():ISeries
		{
			return this._series;
		}
		
		/**
		 * @private
		 */
		public function set series(value:ISeries):void
		{
			if(this._series != value)
			{
				this._series = value;
				this.invalidate(InvalidationType.DATA)
			}
		}
		
		/**
		 * @private
		 * Storage for the data property.
		 */
		private var _data:Object;
		
		/**
		 * @copy com.yahoo.astra.fl.charts.IDataTipRenderer#data
		 */
		public function get data():Object
		{
			return this._data;
		}
		
		/**
		 * @private
		 */
		public function set data(value:Object):void
		{
			if(this._data != value)
			{
				this._data = value;
				this.invalidate(InvalidationType.DATA);
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
			var stylesInvalid:Boolean = this.isInvalid(InvalidationType.STYLES);
			var sizeInvalid:Boolean = this.isInvalid(InvalidationType.SIZE);
			
			if(stylesInvalid)
			{
				if(this.skin)
				{
					this.removeChild(this.skin);
					this.skin = null;
				}
				
				var SkinType:Object = this.getStyleValue("skin");
				this.skin = UIComponentUtil.getDisplayObjectInstance(this, SkinType);
				if(this.skin)
				{
					this.addChildAt(this.skin, 0);
			
					if(this.skin is UIComponent)
					{
						(this.skin as UIComponent).drawNow();
					}
					this.aspectRatio = this.skin.width / this.skin.height;
				}
			}
			
			if(this.skin && (stylesInvalid || sizeInvalid))
			{
				this.skin.width = this.width;
				this.skin.height = this.height;
				
				if(this.skin is IProgrammaticSkin)
				{
					var fillColor:uint = this.getStyleValue("fillColor") as uint;
					(this.skin as IProgrammaticSkin).fillColor = fillColor;
				}
				
				if(this.skin is UIComponent)
				{
					(this.skin as UIComponent).drawNow();
				}
			}
			
			super.draw();
		}
		
	}
}