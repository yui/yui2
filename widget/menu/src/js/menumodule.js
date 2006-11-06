


/**
* The base class for all menuing containers.
* 
* @param {String} p_oElement String specifying the id attribute of the <code>&#60;div&#62;</code> element of the menu module.
* @param {String} p_oElement String specifying the id attribute of the <code>&#60;select&#62;</code> element to be used as the data source for the menu module.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying the <code>&#60;div&#62;</code> element of the menu module.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object specifying the <code>&#60;select&#62;</code> element to be used as the data source for the menu module.
* @param {Object} p_oConfig Optional. Object literal specifying the configuration for the menu module. See configuration class documentation for more details.
* @class MenuModule
* @constructor
* @extends YAHOO.widget.Overlay
* @deprecated As of version 0.12, all MenuModule functionality has been 
* implemented directly in YAHOO.widget.Menu, making YAHOO.widget.Menu the base 
* class for all menuing containers.
*/
YAHOO.widget.MenuModule = YAHOO.widget.Menu;