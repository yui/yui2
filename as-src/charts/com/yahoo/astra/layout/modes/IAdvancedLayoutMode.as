package com.yahoo.astra.layout.modes
{
	import flash.display.DisplayObject;
	
	/**
	 * Defines the methods required for layout modes that have
	 * advanced configuration settings for individual children.
	 * 
	 * @author Josh Tynjala
	 */
	public interface IAdvancedLayoutMode extends ILayoutMode
	{
		/**
		 * Registers a specific display object with the layout algorithm. If certain
		 * settings need to be specified for individual display objects, they
		 * should be passed to the layout algorithm here.
		 */
		function addClient(target:DisplayObject, configuration:Object = null):void
		
		/**
		 * Unregisters a specific display object from the layout algorithm.
		 */
		function removeClient(target:DisplayObject):void
	}
}