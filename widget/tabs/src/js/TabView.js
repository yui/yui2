(function() {

    /**
     * The tabview module provides a widget for managing content bound to tabs.
     * @module tabview
     *
     */
    /**
     * A widget to control tabbed views.
     * @namespace YAHOO.widget
     * @class TabView
     * @extends YAHOO.util.Element
     * @constructor
     * @param element {HTMLElement | String} (optional) The html element that 
     * represents the TabView. An element will be created if none provided.
     * @param {Object} properties A key map of initial properties
     */
    YAHOO.widget.TabView = function(element, properties) {
    	YAHOO.widget.TabView.superclass.constructor.apply(this, arguments); 
    };

    YAHOO.extend(YAHOO.widget.TabView, YAHOO.util.Element);
    
    var proto = YAHOO.widget.TabView.prototype;
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    
	/**
     * The className of a TabView's element.
	 * @property TAB_MODULE_CLASSNAME
	 * @type String
     * @default 'navset'
	 */
	proto.TAB_MODULE_CLASSNAME = 'navset';
    
	/**
     * The tag name of the tabs' containing element.
	 * @property TAB_CONTAINER_TAGNAME
	 * @type String
     * @default 'ul'
	 */
	proto.TAB_CONTAINER_TAGNAME = 'ul';
    
	/**
     * The className of the tabs' containing element.
	 * @property TAB_CONTAINER_CLASSNAME
	 * @type String
     * @default 'nav'
	 */
	proto.TAB_CONTAINER_CLASSNAME = 'nav';
    
	/**
     * The tag name of the tab contents' containing element.
	 * @property CONTENT_CONTAINER_TAGNAME
	 * @type String
     * @default 'div'
	 */
	proto.PANEL_CONTAINER_TAGNAME = 'div';
    
	/**
     * The tag name of the tab contents' containing element.
	 * @property CONTENT_CONTAINER_CLASSNAME
	 * @type String
     * @default 'nav-content'
	 */
	proto.PANEL_CONTAINER_CLASSNAME = 'nav-content';
    
    proto.PANEL_TAGNAME = 'div';
    
    /**
     * Adds a Tab to the TabView instance.  
     * If no index is specified, the tab is added to the end of the tab list.
     * @method addTab
     * @param {YAHOO.widget.Tab} tab A Tab instance to add.
     * @param {Integer} index The position to add the tab. 
     * @return void
     */
    proto.addTab = function(tab, index) {
        var tabs = this._configs.tabs.value;
        index = (index === undefined) ? tabs.length : index;
        tabs.splice(index, 0, tab);
        var self = this;
        var tabElement = tab.get('element');

        if ( !Dom.isAncestor(this.get('element'), tabElement) ) {
            if (index == tabs.length) {
                this.tabContainer.insertBefore(tabElement, 
                        this.getTab(index).get('element'));
            } else {
                this.tabContainer.appendChild(tabElement);
            }
        }
        
        tab.addListener(
            tab.ACTIVATION_EVENT,
            function(e) {
                var active = self.get('activeTab');
                if (active) {
                    active.set('active', false);
                }
                
                this.set('active', true);
            }
        );
        
        tab.addListener('activeChange', function(value) {
            if (value === true) {
                self._configs.activeTab.value = this;
            }
        });
    };

    /**
     * Routes childNode events.
     * @method DOMEventHandler
     * @param {event} e The Dom event that is being handled.
     * @return void
     */
    proto.DOMEventHandler = function(e) {
        var el = this.get('element');
        var target = YAHOO.util.Event.getTarget(e);
        
        YAHOO.util.Event.preventDefault(e);
        
        if (Dom.isAncestor(this.tabContainer, target )) {
            var tabEl;
            var tab = null;
            var tabs = this.get('tabs');
            
            for (var i = 0, len = tabs.length; i < len; i++) {
                tabEl = tabs[i].get('element');

                if ( target == tabEl || Dom.isAncestor(tabEl, target) ) {
                    tab = tabs[i];
                    break; // note break
                }
            } 
            
            if (tab) {
                tab.fireEvent(e.type, e);
            }
        }
    };
    
    /**
     * Returns the Tab instance at the specified index.
     * @method getTab
     * @param {Integer} index The position of the Tab.
     * @return YAHOO.widget.Tab
     */
    proto.getTab = function(index) {
    	return this.get('tabs')[index];
    };
    
    /**
     * Removes the specified Tab from the TabView.
     * @method removeItem
     * @param {YAHOO.widget.Tab} item The Tab instance to be removed.
     * @return void
     */
    proto.removeTab = function(item) {
    	
    };
    
    /**
     * Creates Tab instances from a collection of HTMLElements.
     * @method createTabs
     * @param {Array|HTMLCollection} elements The elements to use for Tabs.
     * @return void
     */
    proto.createTabs = function(elements) {
        var tab;
        var props;
        var element;
        var h = 0;
        var contentParent = this.getElementsByClassName(
                this.PANEL_CONTAINER_CLASSNAME, 
                this.PANEL_CONTAINER_TAGNAME)[0];
                
        var contentElements = [];
        var node;
        
        for (var i = 0, len = contentParent.childNodes.length; i < len; ++i) {
            node = contentParent.childNodes[i];
            if (node.nodeType == 1) {
                contentElements[contentElements.length] = node;
            }
        }

        for (i = 0, len = elements.length; i < len; ++i) {
            props = {};
            props.contentParent = contentParent;
            element = elements[i];

            if (!contentElements[i]) {
                contentElements[i] = 
                        document.createElement(this.PANEL_TAGNAME);
                contentParent.appendChild(contentElements[i]);
                if (this.PANEL_CLASSNAME) {
                    contentElements[i].set('className', this.PANEL_CLASSNAME);
                }
            }
            
            props.panel = new YAHOO.widget.TabPanel(contentElements[i]);
            
            tab = new YAHOO.widget.Tab(element, props);

            this.addTab(tab);
            if (tab.hasClass(tab.ACTIVE_CLASSNAME)) {
                tab.set('active', true);
            } else {
                tab.set('active', false);
            }
        }
    };
    
    
    /**
     * Creates a container for the Tab elements.
     * @method createTabContainer
     * @return HTMLElement
     */
    proto.createTabContainer = function() {        
        var tabContainer = document.createElement(this.TAB_CONTAINER_TAGNAME);
        Dom.addClass(this.TAB_CONTAINER_CLASSNAME, tabContainer);
        element.appendChild(tabContainer);
        return tabContainer;
    };
    
    /**
     * Provides a readable name for the TabView instance.
     * @method toString
     * @return String
     */
    proto.toString = function() {
        var name = this.get('id') || this.get('tagName');
        return "TabView " + name; 
    };
    
    /**
     * Registers TabView specific properties.
     * @method initProperties
     * @param {Object} properties Hash of initial properties
     */
    proto.initConfigs = function(properties) {
        properties = properties || {};
        YAHOO.widget.TabView.superclass.initConfigs.call(this, properties); 
        var tabElements = [];
        var element = this.get('element');
        
        this.tabContainer = Dom.getElementsByClassName(this.TAB_CONTAINER_CLASSNAME, 
                    this.TAB_CONTAINER_TAGNAME, element)[0] || this.createTabContainer();
                    
        tabElements = this.tabContainer.getElementsByTagName(YAHOO.widget.Tab.prototype.TAGNAME);
        
        
        /**
         * The tab currently active.
         * @config activeTab
         * @type YAHOO.widget.Tab
         */
        this.register('activeTab', {
            value: properties.activeTab || null,
            method: function(tab) {
                var activeTab = this.get('activeTab');
                
                if (tab) { // might be unsetting
                    tab.set('active', true);
                    if (activeTab) {
                        activeTab.set('active', false);
                    }
                }
            }
        });
        
        /**
         * The Tabs belonging to the TabView instance.
         * @config tabs
         * @type Array
         */
        this.register('tabs', {
            value: properties.tabs || []
        });

        this.createTabs(tabElements);
        
        for (var type in this.DOM_EVENTS) {
            if ( this.DOM_EVENTS.propertyIsEnumerable(type) ) {
                this.addListener.call(this, type, this.DOMEventHandler);
            }
        }
    };
})();