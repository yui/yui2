package com.yahoo.astra.utils
{
	/**
	 * Used to estimate text field properties for strings
	 * 
	 * @author Tripp Bridges
	 */
	
	import com.yahoo.astra.display.BitmapText;
	import flash.display.Sprite;
	import flash.text.*;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.PixelSnapping;
	
	public class TextUtil
	{
		/**
		 * Returns the potential width of a string when rendered in a text field. Takes into account 
		 * the <code>TextFormat</code> settings and the rotation.
		 *
		 * @param textValue The string that will be used.
		 * @param tf		The TextFormat object that will be applied.
		 * @param rotation	The rotation that will be applied
		 *
		 */
		public static function getTextWidth(textValue:String, tf:TextFormat, rotation:Number = 0):Number
		{
			rotation = Math.max(-90, Math.min(rotation, 90));			
			var textField:BitmapText = new BitmapText();
			textField.selectable = false;
			textField.autoSize = rotation < 0 ? TextFieldAutoSize.RIGHT : TextFieldAutoSize.LEFT;			
			if(tf != null) textField.defaultTextFormat = tf;
			textField.text = textValue;
			textField.rotation = rotation;
			return textField.width;
		}
		
		/**
		 * Returns the potential height of a string when rendered in a text field. Takes into account 
		 * the <code>TextFormat</code> settings and the rotation.
		 *
		 * @param textValue The string that will be used.
		 * @param tf		The TextFormat object that will be applied.
		 * @param rotation	The rotation that will be applied		 
		 */
		public static function getTextHeight(textValue:String, tf:TextFormat, rotation:Number = 0):Number
		{
			rotation = Math.max(-90, Math.min(rotation, 90));
			var textField:BitmapText = new BitmapText();
			textField.selectable = false;
			textField.autoSize = rotation < 0 ? TextFieldAutoSize.RIGHT : TextFieldAutoSize.LEFT;			
			if(tf != null) textField.defaultTextFormat = tf;
			textField.text = textValue;
			textField.rotation = rotation;
			return textField.height;
			
		}
		
		/**
		 * Returns the dimensions of a text field if rotated.
		 *
		 * @param textField		The text field to be used	
		 * @param rotation		The rotation to be applied
		 */
		public static function getBitmapTextSize(textField:TextField, rotation:Number):Object
		{
			var spr:Sprite = new Sprite();
			var bitmapDataText:BitmapData = new BitmapData(textField.width, textField.height, true, 0);
			bitmapDataText.draw(textField);
			var bm:Bitmap = new Bitmap(bitmapDataText, PixelSnapping.AUTO, true);
			spr.addChild(bm);
			spr.rotation = rotation;
			return {width:spr.width, height:spr.height};						
		}
		
	}
}