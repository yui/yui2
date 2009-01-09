package com.yahoo.astra.fl.charts.skins
{
	/**
	 * A type of skin that supports color customization.
	 * 
	 * @author Josh Tynjala
	 */
	public interface IProgrammaticSkin
	{
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
	
		/**
		 * The color used to draw the skin.
		 */
		function get fillColor():uint;
		
		/**
		 * @private
		 */
		function set fillColor(value:uint):void;
	}
}