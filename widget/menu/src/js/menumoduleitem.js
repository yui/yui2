/**
* The MenuModuleItem class allows you to create and modify an item for a
* MenuModule instance.
* 
* @param {String} p_oObject The text of the MenuModuleItem to be 
* created.
* @param {HTMLElement} p_oObject The HTMLElement representing the source node 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of 
* the MenuModuleItem.
* @param {Object} p_oConfig The configuration object literal containing 
* the configuration for a MenuItem instance. See the configuration 
* class documentation for more details.
* @class MenuModuleItem
* @constructor
* @deprecated As of version 0.12, all MenuModuleItem functionality has been 
* implemented directly in YAHOO.widget.MenuItem, making YAHOO.widget.MenuItem 
* the base class for all menu items.
*/
YAHOO.widget.MenuModuleItem = YAHOO.widget.MenuItem;