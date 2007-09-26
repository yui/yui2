package com.yahoo.yui
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.display.DisplayObject;
	import flash.errors.IOError;
	import flash.events.Event;
	import flash.external.ExternalInterface;

	public class YUIAdapter extends Sprite
	{
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------
	
		/**
		 * Constructor.
		 */
		public function YUIAdapter()
		{
			super();
			
			this.stage.addEventListener(Event.RESIZE, stageResizeHandler);
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			
			if(ExternalInterface.available)
			{
				this.initializeComponent();
			
				var swfReady:Object = {type: "swfReady"};
				this.dispatchEventToJavaScript(swfReady);
			}
			else
			{
				throw new IOError("Flash YUIComponent cannot communicate with JavaScript content.");
			}
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * The element id that references the SWF in the HTML.
		 */
		protected var elementID:String;
		
		/**
		 * The globally accessible JavaScript function that accepts events through ExternalInterface.
		 */
		protected var javaScriptEventHandler:String;
		
		/**
		 * The reference to the Flash component.
		 */
		private var _component:DisplayObject;
		
		protected function get component():DisplayObject
		{
			return this._component;
		}
		
		protected function set component(value:DisplayObject):void
		{
			this._component = value;
			this.refreshComponentSize();
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		
		protected function initializeComponent():void
		{
			this.elementID = this.loaderInfo.parameters["elementID"];
			this.javaScriptEventHandler = this.loaderInfo.parameters["eventHandler"];
		}
		
		protected function log(message:Object, category:String = null):void
		{
			if(message == null) message = "";
			this.dispatchEventToJavaScript({type: "log", message: message.toString(), category: category});
		}
		
		/**
		 * @private (protected)
		 *
		 * Dispatches an event object to the JavaScript wrapper element.
		 */
		protected function dispatchEventToJavaScript(event:Object):void
		{
			ExternalInterface.call(this.javaScriptEventHandler, this.elementID, event);
		}

		/**
		 * @private (protected)
		 * 
		 * The size of the SWF/stage is dependant on the container it is in.
		 * The visual component will resize to match the stage size.
		 */
		protected function stageResizeHandler(event:Event):void
		{
			this.refreshComponentSize();
		}
		
		protected function refreshComponentSize():void
		{
			if(this.component)
			{
				this.component.width = this.stage.stageWidth;
				this.component.height = this.stage.stageHeight;
				this.log("resize (width: " + this.stage.stageWidth + ", height: " + this.stage.stageHeight + ")", LoggerCategory.INFO);
			}
		}
	}
}