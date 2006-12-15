


/**
* Creates an item for a menu module.
* 
* @param {String} p_oObject String specifying the text of the menu module item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying the 
* <code>&#60;li&#62;</code> element of the menu module item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object specifying 
* the <code>&#60;optgroup&#62;</code> element of the menu module item.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object specifying the 
* <code>&#60;option&#62;</code> element of the menu module item.
* @param {Object} p_oObject Object literal specifying the configuration
* for the menu item. See configuration class documentation for more details.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the menu module item. See configuration class documentation
* for more details.
* @class MenuModuleItem
* @constructor
* @deprecated As of version 0.12, all MenuModuleItem functionality has been 
* implemented directly in YAHOO.widget.MenuItem, making YAHOO.widget.MenuItem 
* the base class for all menu items.
*/
YAHOO.widget.MenuModuleItem = YAHOO.widget.MenuItem;