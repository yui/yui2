(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.util.Lang;
    
    /**
     * A representation of a Tab's label and content.
     * @namespace YAHOO.widget
     * @class TabLabel
     * @extends YAHOO.util.Element
     * @constructor
     * @param element {HTMLElement | String} (optional) The html element that 
     * represents the TabView. An element will be created if none provided.
     * @param {Object} properties A key map of initial properties
     */
    YAHOO.widget.TabLabel = function(element, properties) {
        properties = properties || {};
        
        YAHOO.widget.TabLabel.superclass.constructor.apply(this, arguments);
    };
    
    YAHOO.extend(YAHOO.widget.TabLabel, YAHOO.util.Element);
    var proto = YAHOO.widget.TabLabel.prototype;
    
    /**
     * Provides a readable name for the tab.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var el = this.get('element');
        var id = el.id || el.tagName;
        return "TabLabel " + id; 
    };
    
    /**
     * Registers TabLabel specific properties.
     * @method initProperties
     * @param {Object} properties Hash of initial properties
     */
    proto.initConfigs = function(properties) {
        properties = properties || {};
        YAHOO.widget.TabLabel.superclass.initConfigs.apply(this, arguments);
        
        var el = this.get('element');
        
        /**
         * Whether or not the tab is currently active
         * @config active
         * @type Boolean
         */
        this.register('active', {
            value: properties.active || this.hasClass(this.ACTIVE_CLASSNAME),
            method: function(value) {
                if ( this.get('disabled') ) {
                    YAHOO.log('set active cancelled: ' + this + ' disabled', 
                            'info', 'TabLabel');
                    return false;
                }
                
                if (value === true) {
                    this.addClass(this.ACTIVE_CLASSNAME);
                } else {
                    this.removeClass(this.ACTIVE_CLASSNAME);
                }
            },
            validator: Lang.isBoolean
        });
        
        /**
         * The tabIndex of the tab's label element.
         * Inactive tabs are taken out of tab order (value set to -1).
         * @config tabIndex
         * @type Number
         */
        this.configure('tabIndex', {
            value: this.get('active') ? this.get('element').tabIndex : -1,
            method: function(value) {
                this.get.tabIndex = value;
            },
            validator: Lang.isNumber
        });
        
        /**
         * The tab's content element.
         * @config diabled
         * @type Boolean
         * @default false
         */
        this.register('disabled', {
            value: properties.disabled|| false,
            validator: Lang.isBoolean
        });

        

    };
})();