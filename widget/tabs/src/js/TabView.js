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
     * @param {HTMLElement | String | Object} el(optional) The html 
     * element that represents the TabView, or the attribute object to use. 
     * An element will be created if none provided.
     * @param {Object} attr (obtional) A key map of the tabView's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    YAHOO.widget.TabView = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !Lang.isString(el) && !el.nodeName) {
            attr = el; // treat first arg as attr object
            el = attr.element || null;
        }
        
        _registerStatic.call(this);
        
        if (!el && !attr.element) { // create if we dont have one
            el = _createTabViewElement.call(this, attr);
        }
    	YAHOO.widget.TabView.superclass.constructor.call(this, el, attr); 
    };

    YAHOO.extend(YAHOO.widget.TabView, YAHOO.util.Element);
    
    var proto = YAHOO.widget.TabView.prototype;
    var Dom = YAHOO.util.Dom;
    var Lang = YAHOO.util.Lang;
    var Event = YAHOO.util.Event;
    var Tab = YAHOO.widget.Tab;
    
    /**
     * Adds a Tab to the TabView instance.  
     * If no index is specified, the tab is added to the end of the tab list.
     * @method addTab
     * @param {YAHOO.widget.Tab} tab A Tab instance to add.
     * @param {Integer} index The position to add the tab. 
     * @return void
     */
    proto.addTab = function(tab, index) {
        var tabs = this.get('tabs');
        index = (index === undefined) ? tabs.length : index;
        
        var before = this.getTab(index);
        
        var self = this;
        var el = this.get('element');
        var labelGroup = this.get('labelGroup');
        var contentGroup = this.get('contentGroup');

        var tabElement = tab.get('element');
        var panelElement = (tab.get('panel')) ? 
                tab.get('panel').get('element') : null;

        if ( before ) {
            labelGroup.insertBefore(tabElement, before.get('element'));
        } else {
            labelGroup.appendChild(tabElement);
        }

        if ( panelElement && !Dom.isAncestor(el, panelElement) ) { // TODO: match index?
            contentGroup.appendChild(panelElement);
        }
        
        if ( !tab.get('active') ) {
            tab.get('panel').set('visible', false);
        } else {
            this.set('activeTab', tab);
        }

        tab.addListener(
            tab.ACTIVATION_EVENT,
            function(e) {
                YAHOO.util.Event.preventDefault(e);
                self.set('activeTab', this);
            }
        );
        
        tabs.splice(index, 0, tab);
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
        var labelGroup = this.get('labelGroup');
        
        //YAHOO.util.Event.preventDefault(e);
        
        if (Dom.isAncestor(labelGroup, target) ) {
            var tabEl;
            var tab = null;
            var panel;
            var tabs = this.get('tabs');

            for (var i = 0, len = tabs.length; i < len; i++) {
                tabEl = tabs[i].get('element');
                panel = tabs[i].get('panel');

                if ( target == tabEl || Dom.isAncestor(tabEl, target) ) {
                    tab = tabs[i]; // TODO: what if panel in tab?
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
     * Returns the index of given tab.
     * @method getTabIndex
     * @param {YAHOO.widget.Tab} tab The tab whose index will be returned.
     * @return int
     */
    proto.getTabIndex = function(tab) {
        var index = null;
        var tabs = this.get('tabs');
    	for (var i = 0, len = tabs.length; i < len; ++i) {
            if (tab == tabs[i]) {
                index = i;
                break;
            }
        }
        
        return index;
    };
    
    /**
     * Removes the specified Tab from the TabView.
     * @method removeItem
     * @param {YAHOO.widget.Tab} item The Tab instance to be removed.
     * @return void
     */
    proto.removeTab = function(tab) {
        this.get('labelGroup').removeChild( tab.get('element') );
        this.get('contentGroup').removeChild( tab.get('panel').get('element') );
        this._configs.tabs.value.splice(this.getTabIndex(tab), 1);
    	
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
     * The transiton to use when swapping tabPanels.
     * @method panelTransition
     */
    proto.panelTransition = function(newPanel, oldPanel) {
        if (newPanel) {  
            newPanel.set('visible', true);
        }
        
        if (oldPanel) {
            oldPanel.set('visible', false);
        }
    };
    
    /**
     * Registers TabView specific properties.
     * @method initConfigs
     * @param {Object} attr Hash of initial attributes
     */
    proto.initConfigs = function(attr) {
        YAHOO.widget.TabView.superclass.initConfigs.call(this, attr);
        
        var el = this.get('element');
        
        /**
         * The Tabs belonging to the TabView instance.
         * @config tabs
         * @type Array
         */
        this.register('tabs', {
            value: [],
            readOnly: true
        });

        /**
         * The container for the tabView's label elements.
         * @config labelGroup
         * @type HTMLElement
         */
        this.register('labelGroup', {
            value: attr.labelGroup || 
                    _getByClassOrTag( el, this.get('LABEL_GROUP_CLASS'), 
                            this.get('LABEL_GROUP_TAG') )[0] || 
                    _createLabelGroup.call(this)
        });
            
        /**
         * The container for the tabView's TabPanel elements.
         * @config contentGroup
         * @type HTMLElement
         */
        this.register('contentGroup', {
            value: attr.contentGroup || 
                    _getByClassOrTag( el, this.get('CONTENT_GROUP_CLASS'), 
                            this.get('CONTENT_GROUP_TAG') )[0] || 
                    _createContentGroup.call(this)
        });
        
        /**
         * The tab currently active.
         * @config activeTab
         * @type YAHOO.widget.Tab
         */
        this.register('activeTab', {
            value: attr.activeTab,
            method: function(tab) {
                var activeTab = this.get('activeTab');
                var newPanel,
                    oldPanel;
               
                if (tab) { // might be unsetting
                    tab.set('active', true);
                    newPanel = tab.get('panel');
                }
                
                if (activeTab && activeTab != tab) {
                    activeTab.set('active', false); // refresh if active TODO: reload dynamic?
                    oldPanel = activeTab.get('panel');
                }
                
                this.panelTransition(newPanel, oldPanel);
            },
            validator: function(value) {
                return !value.get('disabled');
            }
        });

        if ( this.get('labelGroup') ) {
            _initTabs.call(this);
        }
        
        for (var type in this.DOM_EVENTS) {
            if ( this.DOM_EVENTS.propertyIsEnumerable(type) ) {
                this.addListener.call(this, type, this.DOMEventHandler);
            }
        }
    };
    
    /**
     * Creates Tab instances from a collection of HTMLElements.
     * @method createTabs
     * @private
     * @param {Array|HTMLCollection} elements The elements to use for Tabs.
     * @return void
     */
    var _initTabs = function() {
        var tab,
            attr,
            el = this.get('element'),
            node,
            tabs,
            panels,
            panel,
            labelGroup = this.get('labelGroup') || _createLabelGroup.call(this),
            contentGroup = this.get('contentGroup')  || _createContentGroup.call(this);
            
        tabs = _getChildNodes(labelGroup);
        panels = _getChildNodes(contentGroup);

        for (var i = 0, len = tabs.length; i < len; ++i) {
            attr = {};
            
            panel = panels[i] || null;
            attr.panel = new YAHOO.widget.TabPanel(panel);

            tab = new YAHOO.widget.Tab(tabs[i], attr);

            this.addTab(tab);
            
            if (tab.hasClass(tab.ACTIVE_CLASS) ) {
                this._configs.activeTab.value = tab; // TODO: no method call ?
            } else {
                tab.get('panel').set('visible', false);
            }
        }
    };
    
    var _createTabViewElement = function(attr) {
        var el = document.createElement( this.get('TAG') );

        if ( this.get('CLASS') ) {
            el.className = this.get('CLASS');
        }
        
        return el;
    };
    
    var _createLabelGroup = function(attr) {
        var el = document.createElement( this.get('LABEL_GROUP_TAG') );

        if ( this.get('LABEL_GROUP_CLASS') ) {
            el.className = this.get('LABEL_GROUP_CLASS');
        }
        
        this.get('element').appendChild(el);
        
        return el;
    };
    
    var _createContentGroup = function(attr) {
        var el = document.createElement( this.get('CONTENT_GROUP_TAG') );

        if ( this.get('CONTENT_GROUP_CLASS') ) {
            el.className = this.get('CONTENT_GROUP_CLASS');
        }
        
        this.get('element').appendChild(el);
        
        return el;
    };
    
    var _getByClassOrTag = function(parent, className, tagName, depth) {
        //TODO: implement depth
        var collection = Dom.getElementsByClassName(className, tagName, parent);
        
        if (!collection || collection.length === 0) {
            collection = parent.getElementsByTagName(tagName);
        }

        return collection;
    };
    
    var _registerStatic = function(attr) { // TODO: feed attr?
        this.register('TAG', { value: 'div', writeOnce: true });
        this.register('CLASS', { value: 'navset', writeOnce: true });
        this.register('LABEL_GROUP_TAG', { value: 'ul', writeOnce: true });
        this.register('LABEL_GROUP_CLASS', { value: 'nav', writeOnce: true });
        this.register('CONTENT_GROUP_TAG', { value: 'div', writeOnce: true });
        this.register('CONTENT_GROUP_CLASS', { value: 'nav-content', writeOnce: true });
        this.register('TAB_TAG', { value: 'li', writeOnce: true });
        this.register('TAB_CLASS', { value: '', writeOnce: true });
    };
    
    var _getChildNodes = function(el) {
        var nodes = [];
        var childNodes = el.childNodes;
        
        for (var i = 0, len = childNodes.length; i < len; ++i) {
            if (childNodes[i].nodeType == 1) {
                nodes[nodes.length] = childNodes[i];
            }
        }
        
        return nodes;
    };
    
})();