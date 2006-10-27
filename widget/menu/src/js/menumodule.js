/**
* The base class for all menuing containers.
* 
* @param {String} p_oElement The HTMLElement ID representing the source node 
* (either HTMLSelectElement or HTMLDivElement) of the MenuModule.
* @param {Element} p_oElement The HTMLElement representing the MenuModule to 
* be created.
* @param {Object} p_oConfig Optional. The configuration object literal 
* containing the configuration for a MenuModule instance. See 
* configuration class documentation for more details.
* @class MenuModule
* @constructor
* @extends YAHOO.widget.Overlay
* @deprecated As of version 0.12, all MenuModule functionality has been 
* implemented directly in YAHOO.widget.Menu, making YAHOO.widget.Menu the base 
* class for all menuing containers.
*/
YAHOO.widget.MenuModule = YAHOO.widget.Menu;