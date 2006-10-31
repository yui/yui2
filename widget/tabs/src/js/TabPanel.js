(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.util.Lang;
    
    /**
     * A representation of a Tab's label and content.
     * @namespace YAHOO.widget
     * @class TabPanel
     * @extends YAHOO.util.Element
     * @constructor
     * @param element {HTMLElement | String} (optional) The html element that 
     * represents the TabView. An element will be created if none provided.
     * @param {Object} properties A key map of initial properties
     */
    YAHOO.widget.TabPanel = function(el, attr) {
        attr = attr || {};
        
        if (!el && !attr.element) {
            el = _createPanelElement.call(this, attr);
        } else if (arguments.length == 1 && !Lang.isString(el) && !el.nodeName) {
            attr = el;
            el = attr.element;
        }
        
        YAHOO.widget.TabPanel.superclass.constructor.call(this, el, attr);
    };
    
    YAHOO.extend(YAHOO.widget.TabPanel, YAHOO.util.Element);
    var proto = YAHOO.widget.TabPanel.prototype;
    
	/**
     * The default tag name for a Tab's label's content element.
	 * @property CONTENT_TAGNAME
	 * @type String
     * @default 'div'
	 */
	proto.TAG = 'div';
    
	/**
     * The default tag name for a Tab's label element.
	 * @property LABEL_TAGNAME
	 * @type String
     * @default 'a'
	 */
	proto.CLASS = '';
    
    /**
     * Provides a readable name for the tab.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var el = this.get('element');
        var id = el.id || el.tagName;
        return "TabPanel " + id; 
    };
    
    /**
     * Registers TabPanel specific properties.
     * @method initProperties
     * @param {Object} properties Hash of initial properties
     */
    proto.initConfigs = function(attr) {
        YAHOO.widget.TabPanel.superclass.initConfigs.call(this, attr);
        
        var el = this.get('element');

        this.configure('visible', {
            method: function(value) {
                if (value) {
                    Dom.setStyle(el, 'display', 'block');
                } else {
                    Dom.setStyle(el, 'display', 'none');
                }
            }
        });
    };
    
    var _createPanelElement = function() {
        var el = document.createElement(this.TAG);
        
        if (this.CLASS) {
            el.className = this.CLASS;
        }
        
        return el;
    };
})();