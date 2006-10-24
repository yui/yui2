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
    YAHOO.widget.TabPanel = function(element, properties) {

        properties = properties || {};
        
        YAHOO.widget.TabPanel.superclass.constructor.apply(this, arguments);
    };
    
    YAHOO.extend(YAHOO.widget.TabPanel, YAHOO.util.Element);
    var proto = YAHOO.widget.TabPanel.prototype;
    
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
    proto.initConfigs = function(properties) {
        properties = properties || {};
        YAHOO.widget.TabPanel.superclass.initConfigs.apply(this, arguments);
        
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
})();