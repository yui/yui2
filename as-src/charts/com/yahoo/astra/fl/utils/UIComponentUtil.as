package com.yahoo.astra.fl.utils
{
	import com.yahoo.astra.utils.InstanceFactory;
	
	import flash.display.DisplayObject;
	import flash.utils.getDefinitionByName;
	
	/**
	 * Utility functions for use with UIComponents.
	 * 
	 * @author Josh Tynjala
	 */
	public class UIComponentUtil
	{
		/**
		 * Using an input, such as a component style, tries to convert the input
		 * to a DisplayObject.
		 * 
		 * <p>Possible inputs include Class, a String representatation of a
		 * fully-qualified class name, Function, any existing instance of
		 * a DisplayObject, or InstanceFactory.</p>
		 * 
		 * @see com.yahoo.astra.utils.InstanceFactory
		 * 
		 * @param target	the parent of the new instance
		 * @param input		the object to convert to a DisplayObject instance
		 */
		public static function getDisplayObjectInstance(target:DisplayObject, input:Object):DisplayObject
		{
			if(input is InstanceFactory)
			{
				return InstanceFactory(input).createInstance() as DisplayObject;
			}
			//added Function as a special case because functions can be used with the new keyword
			else if(input is Class || input is Function)
			{ 
				return (new input()) as DisplayObject; 
			}
			else if(input is DisplayObject)
			{
				(input as DisplayObject).x = 0;
				(input as DisplayObject).y = 0;
				return input as DisplayObject;
			}

			var classDef:Object = null;
			try
			{
				classDef = flash.utils.getDefinitionByName(input.toString());
			}
			catch(e:Error)
			{
				try
				{
					classDef = target.loaderInfo.applicationDomain.getDefinition(input.toString()) as Object;
				}
				catch (e:Error)
				{
					// Nothing
				}
			}

			if(classDef == null)
			{
				return null;
			}
			return (new classDef()) as DisplayObject;
		}

	}
}