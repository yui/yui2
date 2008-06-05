package com.yahoo.astra.fl.charts.axes
{	
	import com.yahoo.astra.utils.NumberUtil;
	
	import fl.core.InvalidationType;
	import fl.core.UIComponent;
	
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;

	/**
	 * The default axis renderer for a cartesian chart.
	 * 
	 * @see com.yahoo.astra.fl.charts.CartesianChart
	 */
	public class DefaultAxisRenderer extends UIComponent implements ICartesianAxisRenderer
	{
		
	//--------------------------------------
	//  Class Variables
	//--------------------------------------
		
		/**
		 * @private
		 */
		private static var defaultStyles:Object = 
		{
			//axis
			showAxis: true,
			axisWeight: 1,
			axisColor: 0x888a85,
			
			//labels
			showLabels: true,
			labelDistance: 2,
			embedFonts: false,
			hideOverlappingLabels: true,
			
			//title
			showTitle: true,
			
			//ticks
			showTicks: true,
			tickWeight: 1,
			tickColor: 0x888a85,
			tickLength: 4,
			tickPosition: TickPosition.CROSS,
			
			//minor ticks
			showMinorTicks: true,
			minorTickWeight: 1,
			minorTickColor: 0x888a85,
			minorTickLength: 3,
			minorTickPosition: TickPosition.OUTSIDE
		};
		
	//--------------------------------------
	//  Class Methods
	//--------------------------------------
	
		/**
		 * @copy fl.core.UIComponent#getStyleDefinition()
		 */
		public static function getStyleDefinition():Object
		{
			return mergeStyles(defaultStyles, UIComponent.getStyleDefinition());
		}
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
		
		/**
		 * Constructor.
		 */
		public function DefaultAxisRenderer(orientation:String)
		{
			super();
			this.orientation = orientation;
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Storage for the TextFields used for labels on this axis.
		 */
		protected var labelTextFields:Array = [];
		
		/**
		 * @private
		 * A cache to allow the reuse of TextFields when redrawing the renderer.
		 */
		private var _labelCache:Array;
		
		/**
		 * @private
		 * The TextField used to display the axis title.
		 */
		protected var titleTextField:TextField;
		
		/**
		 * @inheritDoc
		 */
		public function get length():Number
		{
			if(this.orientation == AxisOrientation.VERTICAL)
			{
				return this.contentBounds.height;
			}
			return this.contentBounds.width;
		}
		
		/**
		 * @private
		 * Storage for the orientation property.
		 */
		private var _orientation:String = AxisOrientation.VERTICAL;
		
		/**
		 * @inheritDoc
		 */
		public function get orientation():String
		{
			return this._orientation;
		}
		
		/**
		 * @private
		 */
		public function set orientation(value:String):void
		{
			if(this._orientation != value)
			{
				this._orientation = value;
				this.invalidate();
			}
		}
		
		/**
		 * @private
		 * Storage for the contentBounds property.
		 */
		protected var _contentBounds:Rectangle = new Rectangle();
		
		/**
		 * @inheritDoc
		 */
		public function get contentBounds():Rectangle
		{
			return this._contentBounds;
		}
		
		private var _ticks:Array = [];
		
		/**
		 * @inheritDoc
		 */
		public function get ticks():Array
		{
			return this._ticks;
		}
		
		public function set ticks(value:Array):void
		{
			this._ticks = value;
			this.invalidate(InvalidationType.DATA);
		}
		
		private var _minorTicks:Array = [];
		
		/**
		 * @inheritDoc
		 */
		public function get minorTicks():Array
		{
			return this._minorTicks;
		}
		
		public function set minorTicks(value:Array):void
		{
			this._minorTicks = value;
			this.invalidate(InvalidationType.DATA);
		}
		
		/**
		 * @private
		 * Storage for the title property.
		 */
		private var _title:String = "";
		
		/**
		 * @inheritDoc
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
			if(this._title != value)
			{
				this._title = value ? value : "";
				this.invalidate();
			}
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------
	
		public function updateBounds():void
		{
			var showLabels:Boolean = this.getStyleValue("showLabels") as Boolean;
			var labelDistance:Number = this.getStyleValue("labelDistance") as Number;
			var textFormat:TextFormat = this.getStyleValue("textFormat") as TextFormat;
			var embedFonts:Boolean = this.getStyleValue("embedFonts") as TextFormat;
			
			this.createCache();
			this.updateLabels(this.ticks, showLabels, textFormat, embedFonts);
			this.clearCache();
			
			this.updateTitle();
			
			this.calculateContentBounds();
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		override protected function configUI():void
		{
			super.configUI();
			
			if(!this.titleTextField)
			{
				this.titleTextField = new TextField();
				this.titleTextField.autoSize = TextFieldAutoSize.LEFT;
				this.addChild(this.titleTextField);
			}
		}
		
		override protected function draw():void
		{
			this.graphics.clear();
			
			this.positionTitle();
			
			var showTicks:Boolean = this.getStyleValue("showTicks") as Boolean;
			var showMinorTicks:Boolean = this.getStyleValue("showMinorTicks") as Boolean;
			var filteredMinorTicks:Array = this.minorTicks.concat();
			if(showMinorTicks && showTicks)
			{
				//filter out minor ticks that appear at the same position
				//as major ticks.
				filteredMinorTicks = filteredMinorTicks.filter(function(item:AxisData, index:int, source:Array):Boolean
				{
					return !this.ticks.some(function(item2:AxisData, index2:int, source2:Array):Boolean
					{
						//using fuzzyEquals because we may encounter rounding errors
						return NumberUtil.fuzzyEquals(item.position, item2.position, 10);
					});
				}, this);
			}
			
			var showLabels:Boolean = this.getStyleValue("showLabels") as Boolean;
			var labelDistance:Number = this.getStyleValue("labelDistance") as Number;
			var textFormat:TextFormat = this.getStyleValue("textFormat") as TextFormat;
			this.drawLabels(this.ticks, showLabels, labelDistance);
			
			this.drawAxis();
			
			var tickPosition:String = this.getStyleValue("tickPosition") as String;
			var tickLength:Number = this.getStyleValue("tickLength") as Number;
			var tickWeight:int = this.getStyleValue("tickWeight") as int;
			var tickColor:uint = this.getStyleValue("tickColor") as uint;
			this.drawTicks(this.ticks, showTicks, tickPosition, tickLength, tickWeight, tickColor);
			
			var minorTickPosition:String = this.getStyleValue("minorTickPosition") as String;
			var minorTickLength:Number = this.getStyleValue("minorTickLength") as Number;
			var minorTickWeight:int = this.getStyleValue("minorTickWeight") as int;
			var minorTickColor:uint = this.getStyleValue("minorTickColor") as uint;
			this.drawTicks(filteredMinorTicks, showMinorTicks, minorTickPosition, minorTickLength, minorTickWeight, minorTickColor);
			
			super.draw();	
		}
		
		protected function updateTitle():void
		{
			var showTitle:Boolean = this.getStyleValue("showTitle") as Boolean;
			if(!showTitle)
			{
				this.titleTextField.text = "";
			}
			else
			{
				var textFormat:TextFormat = this.getStyleValue("titleTextFormat") as TextFormat;
				var embedFonts:Boolean = this.getStyleValue("embedFonts") as Boolean;
				this.titleTextField.defaultTextFormat = textFormat;
				this.titleTextField.embedFonts = embedFonts;
				this.titleTextField.text = this.title;
				if(this.orientation == AxisOrientation.VERTICAL && embedFonts)
				{
					this.titleTextField.rotation = 90;
				}
			}
		}
		
		/**
		 * @private
		 */
		protected function positionTitle():void
		{
			var showTitle:Boolean = this.getStyleValue("showTitle") as Boolean;
			this.titleTextField.visible = showTitle;
			if(showTitle)
			{
				if(this.orientation == AxisOrientation.VERTICAL)
				{
					if(this.titleTextField.rotation != 0)
					{
						this.titleTextField.x = this.titleTextField.width;
					}
					this.titleTextField.y = this.contentBounds.y + (this.contentBounds.height - this.titleTextField.height) / 2;
				}
				else //horizontal
				{
					this.titleTextField.x = this.contentBounds.x + (this.contentBounds.width - this.titleTextField.width) / 2;
					this.titleTextField.y = this.height - this.titleTextField.height;
				}
			}
		}
	
		/**
		 * Draws the axis origin line.
		 */
		protected function drawAxis():void
		{
			var showAxis:Boolean = this.getStyleValue("showAxis") as Boolean;
			if(!showAxis)
			{
				return;
			}
			
			var axisWeight:int = this.getStyleValue("axisWeight") as int;
			var axisColor:uint = this.getStyleValue("axisColor") as uint;
			this.graphics.lineStyle(axisWeight, axisColor);
			if(this.orientation == AxisOrientation.VERTICAL)
			{
				//we round these values because that's what the Flash CS3 components do
				//with positions
				var verticalX:Number = Math.round(this.contentBounds.x);
				var verticalStart:Number = Math.round(this.contentBounds.y);
				var verticalEnd:Number = Math.round(this.contentBounds.y + this.contentBounds.height);
				this.graphics.moveTo(verticalX, verticalStart);
				this.graphics.lineTo(verticalX, verticalEnd);
			}
			else //horizontal
			{
				var horizontalY:Number = Math.round(this.contentBounds.y + this.contentBounds.height);
				var horizontalStart:Number = Math.round(this.contentBounds.x);
				var horizontalEnd:Number = Math.round(this.contentBounds.x + this.contentBounds.width);
				this.graphics.moveTo(horizontalStart, horizontalY);
				this.graphics.lineTo(horizontalEnd, horizontalY);
			}
		}
		
		protected function drawTicks(data:Array, showTicks:Boolean, tickPosition:String,
			tickLength:Number, tickWeight:Number, tickColor:uint):void
		{
			if(!showTicks)
			{
				return;
			}
			
			this.graphics.lineStyle(tickWeight, tickColor);
			
			var dataCount:int = data.length;
			for(var i:int = 0; i < dataCount; i++)
			{
				var axisData:AxisData = AxisData(data[i]);
				if(isNaN(axisData.position))
				{
					//skip bad positions
					continue;
				}
				
				var position:Number = axisData.position;
				if(this.orientation == AxisOrientation.VERTICAL)
				{
					position += this.contentBounds.y;
				}
				else
				{
					position += this.contentBounds.x;
				}
				position = Math.round(position);
				switch(tickPosition)
				{
					case TickPosition.OUTSIDE:
					{
						if(this.orientation == AxisOrientation.VERTICAL)
						{
							this.graphics.moveTo(this.contentBounds.x - tickLength, position);
							this.graphics.lineTo(this.contentBounds.x, position);
						}
						else
						{
							this.graphics.moveTo(position, this.contentBounds.y + this.contentBounds.height);
							this.graphics.lineTo(position, this.contentBounds.y + this.contentBounds.height + tickLength);
						}
						break;
					}
					case TickPosition.INSIDE:
					{
						if(this.orientation == AxisOrientation.VERTICAL)
						{
							this.graphics.moveTo(this.contentBounds.x, position);
							this.graphics.lineTo(this.contentBounds.x + tickLength, position);
						}
						else
						{
							this.graphics.moveTo(position, this.contentBounds.y + this.contentBounds.height - tickLength);
							this.graphics.lineTo(position, this.contentBounds.y + this.contentBounds.height);
						}
						break;
					}
					default: //CROSS
					{
						if(this.orientation == AxisOrientation.VERTICAL)
						{
							this.graphics.moveTo(this.contentBounds.x - tickLength / 2, position);
							this.graphics.lineTo(this.contentBounds.x + tickLength / 2, position);
						}
						else
						{
							this.graphics.moveTo(position, this.contentBounds.y + this.contentBounds.height - tickLength / 2);
							this.graphics.lineTo(position, this.contentBounds.y + this.contentBounds.height + tickLength / 2);
						}
						break;
					}
				}
			}
		}
		
		protected function drawLabels(data:Array, showLabels:Boolean, labelDistance:Number):void
		{	
			if(!showLabels)
			{
				return;
			}
			
			var dataCount:int = data.length;
			for(var i:int = 0; i < dataCount; i++)
			{
				if(this.labelTextFields.length < i)
				{
					break;
				}
				
				var axisData:AxisData = AxisData(data[i]);
				if(isNaN(axisData.position))
				{
					//skip bad positions
					continue;
				}
				
				var position:Number = axisData.position;
				var label:TextField = TextField(this.labelTextFields[i]);
				if(this.orientation == AxisOrientation.VERTICAL)
				{
					position += this.contentBounds.y;
					if(showLabels)
					{
						label.x = Math.round(this.contentBounds.x - label.width - labelDistance);
						label.y = Math.round(position - label.height / 2);
					}
				}
				else
				{
					position += this.contentBounds.x;
					if(showLabels)
					{
						label.x = Math.round(position - label.width / 2);
						label.y = Math.round(this.contentBounds.height + labelDistance);
					}
				}
			}
			
			this.handleOverlappingLabels();
		}
		
		protected function createCache():void
		{
			this._labelCache = this.labelTextFields.concat();
			this.labelTextFields = [];
		}
		
		protected function clearCache():void
		{
			var cacheLength:int = this._labelCache.length;
			for(var i:int = 0; i < cacheLength; i++)
			{
				var label:TextField = TextField(this._labelCache.shift());
				this.removeChild(label);
			}
		}
		
		protected function handleOverlappingLabels():void
		{
			var showLabels:Boolean = this.getStyleValue("showLabels");
			var hideOverlappingLabels:Boolean = this.getStyleValue("hideOverlappingLabels");
			if(!showLabels || !hideOverlappingLabels)
			{
				return;
			}
			
			//sort the labels array so that they're in visual order
			//it doesn't matter if we change the indexes in this Array
			if(this.orientation == AxisOrientation.VERTICAL)
			{
				//be sure to reverse if we have a vertical orientation
				//because the axis starts from the bottom
				this.labelTextFields = this.labelTextFields.sortOn("y", Array.NUMERIC).reverse();
			}
			else
			{
				this.labelTextFields = this.labelTextFields.sortOn("x", Array.NUMERIC);
			}
			
			var lastVisibleLabel:TextField;
			var labelCount:int = this.labelTextFields.length;
			for(var i:int = 0; i < labelCount; i++)
			{
				var label:TextField = TextField(this.labelTextFields[i]);
				label.visible = true;
				if(lastVisibleLabel)
				{
					if(this.orientation == AxisOrientation.VERTICAL)
					{
						if(label.y + label.height > lastVisibleLabel.y)
						{
							//keep the last label, and hide the one before it (unless that's the minimum)
							if(i == labelCount - 1)
							{
								lastVisibleLabel.visible = this.labelTextFields.indexOf(lastVisibleLabel) == 0;
							}
							else
							{
								label.visible = false;
							}	
						}
					}
					else
					{
						if(lastVisibleLabel.x + lastVisibleLabel.width > label.x)
						{
							//keep the last label, and hide the one before it (unless that's the minimum)
							if(i == labelCount - 1)
							{
								lastVisibleLabel.visible = this.labelTextFields.indexOf(lastVisibleLabel) == 0;
							}
							else
							{
								label.visible = false;
							}
						}
					}
				}
				if(label.visible)
				{
					lastVisibleLabel = label;
				}
			}
		}
		
		protected function updateLabels(data:Array, showLabels:Boolean, textFormat:TextFormat, embedFonts:Boolean):void
		{
			if(!showLabels)
			{
				return;
			}
			
			var dataCount:int = data.length;
			for(var i:int = 0; i < dataCount; i++)
			{
				var axisData:AxisData = AxisData(data[i]);
				if(isNaN(axisData.position))
				{
					//skip bad positions
					continue;
				}
				
				var label:TextField = this.getLabel();
				label.defaultTextFormat = textFormat;
				label.embedFonts = embedFonts;
				label.text = axisData.label;
				this.labelTextFields.push(label);
			}
		}
		
		protected function getLabel():TextField
		{
			if(this._labelCache.length > 0)
			{
				return TextField(this._labelCache.shift());
			}
			var label:TextField = new TextField();
			label.selectable = false;
			label.autoSize = TextFieldAutoSize.LEFT;
			this.addChild(label);
			return label;
		}
		
		/**
		 * Determines the rectangular bounds where data may be drawn within this axis.
		 */
		protected function calculateContentBounds():void
		{
			this._contentBounds = new Rectangle(0, 0, this.width, this.height);
			
			var overflowEnabled:Boolean = this.getStyleValue("overflowEnabled");
			if(overflowEnabled)
			{
				return;
			}
			
			var labelCount:int = this.labelTextFields.length;
			if(labelCount > 0)
			{
				var firstLabel:TextField = this.labelTextFields[0] as TextField;
				var lastLabel:TextField = this.labelTextFields[this.labelTextFields.length - 1] as TextField;
			}
			
			var maxLabelSize:Number = 0;
			for(var i:int = 0; i < labelCount; i++)
			{
				var label:TextField = TextField(this.labelTextFields[i]);
				if(this.orientation == AxisOrientation.VERTICAL)
				{
					maxLabelSize = Math.max(label.width, maxLabelSize);
				}
				else
				{
					maxLabelSize = Math.max(label.height, maxLabelSize);
				}
			}
			
			var showTicks:Boolean = this.getStyleValue("showTicks") as Boolean;
			var showMinorTicks:Boolean = this.getStyleValue("showMinorTicks") as Boolean;
			var tickLength:Number = this.getStyleValue("tickLength") as Number;
			var minorTickLength:Number = this.getStyleValue("minorTickLength") as Number;
			var tickPosition:String = this.getStyleValue("tickPosition") as String;
			var minorTickPosition:String = this.getStyleValue("minorTickPosition") as String;
			var labelDistance:Number = this.getStyleValue("labelDistance") as Number;
			if(this.orientation == AxisOrientation.VERTICAL)
			{
				var firstLabelHeight:Number = 0;
				var lastLabelHeight:Number = 0;
				if(this.labelTextFields.length > 0)
				{
					if(firstLabel.text.length > 0) firstLabelHeight = firstLabel.height;
					if(lastLabel.text.length > 0) lastLabelHeight = lastLabel.height;
				}
				
				var contentBoundsX:Number = 0;
				if(this.labelTextFields.length > 0)
				{
					contentBoundsX = maxLabelSize + labelDistance;
				}
				
				var tickContentBoundsX:Number = 0;
				if(showTicks)
				{
					switch(tickPosition)
					{
						case TickPosition.OUTSIDE:
						case TickPosition.CROSS:
							tickContentBoundsX = tickLength;
							break;
					}
				}
				if(showMinorTicks)
				{
					switch(minorTickPosition)
					{
						case TickPosition.OUTSIDE:
						case TickPosition.CROSS:
							tickContentBoundsX = Math.max(tickContentBoundsX, minorTickLength);
					}
				}
				contentBoundsX += tickContentBoundsX;
				this._contentBounds.x += contentBoundsX;
				this._contentBounds.width -= contentBoundsX;
				
				var contentBoundsY:Number = 0;
				if(this.labelTextFields.length > 0) contentBoundsY = firstLabelHeight / 2;
				this._contentBounds.y += contentBoundsY;
				this._contentBounds.height -=  contentBoundsY;
				
				if(this.labelTextFields.length > 0) this._contentBounds.height -= lastLabelHeight / 2
			}
			else
			{
				var firstLabelWidth:Number = 0;
				var lastLabelWidth:Number = 0;
				if(this.labelTextFields.length > 0)
				{
					if(firstLabel.text.length > 0) firstLabelWidth = firstLabel.width;
					if(lastLabel.text.length > 0) lastLabelWidth = lastLabel.width;
				}
				
				contentBoundsX = 0;
				if(this.labelTextFields.length > 0) contentBoundsX = firstLabelWidth / 2;
				this._contentBounds.x += contentBoundsX;
				this._contentBounds.width -= contentBoundsX;
				
				if(this.labelTextFields.length > 0)
				{
					this._contentBounds.width -= lastLabelWidth / 2;
					this._contentBounds.height -= (maxLabelSize + labelDistance);
				}
				
				var tickHeight:Number = 0;
				if(showTicks)
				{
					switch(tickPosition)
					{
						case TickPosition.OUTSIDE:
						case TickPosition.CROSS:
							tickHeight = tickLength;
							break;
					}
				}
				if(showMinorTicks)
				{
					switch(minorTickPosition)
					{
						case TickPosition.OUTSIDE:
						case TickPosition.CROSS:
							tickHeight = Math.max(tickHeight, minorTickLength);
							break;
					}
				}
				
				this._contentBounds.height -= tickHeight;
			}
			
			
			var showTitle:Boolean = this.getStyleValue("showTitle") as Boolean;
			if(!showTitle || !this.title)
			{
				return;
			}
			
			if(this.orientation == AxisOrientation.VERTICAL)
			{
				this._contentBounds.x += this.titleTextField.width;
				this._contentBounds.width -= this.titleTextField.width;
			}
			else
			{
				this._contentBounds.height -= this.titleTextField.height;
			}
		}
	}
}