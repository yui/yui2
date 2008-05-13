package com.yahoo.astra.layout.modes
{
	import flash.display.DisplayObjectContainer;
	import flash.events.IEventDispatcher;
	import flash.geom.Rectangle;
	
	/**
	 * Defines the properties and functions required
	 * for layout modes used by ILayoutContainer.
	 * 
	 * @author Josh Tynjala
	 */
	public interface ILayoutMode extends IEventDispatcher
	{
		
	//--------------------------------------
	//  Methods
	//--------------------------------------
	
		/**
		 * Children of the target DisplayObjectContainer will be positioned and sized
		 * based on a specified rectangle. There is no requirement that the children
		 * remain entirely within that rectangle.
		 * 
		 * <p>Returns the actual rectangular region in which the laid out
		 * children will appear. This may be larger or smaller than the
		 * suggested rectangle. This returned value is expected to be used by
		 * container components to determine if scrollbars are needed.</p>
		 * 
		 * @param target		The DisplayObjectContainer whose children will be laid out.
		 * @param bounds		The rectangular region in which the children should be laid out.
		 * @return				The actual region in which the children are contained.
		 */
		function layoutChildren(target:DisplayObjectContainer, bounds:Rectangle):Rectangle;
	}
}