(function() {

    /**
     * The tabview module provides a widget for managing content bound to tabs.
     * @module tabview
     * @requires yahoo, dom, event, element
     *
     */

    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Tab = YAHOO.widget.Tab,
        doc = document;
    
    // STRING CONSTANTS
    var ELEMENT = 'element';
    
    /**
     * A widget to control tabbed views.
     * @namespace YAHOO.widget
     * @class TabView
     * @extends YAHOO.util.Element
     * @constructor
     * @param {HTMLElement | String | Object} el(optional) The html 
     * element that represents the TabView, or the attribute object to use. 
     * An element will be created if none provided.
     * @param {Object} attr (optional) A key map of the tabView's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    var TabView = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el; // treat first arg as attr object
            el = attr.element || null;
        }
        
        if (!el && !attr.element) { // create if we dont have one
            el = _createTabViewElement.call(this, attr);
        }
    	TabView.superclass.constructor.call(this, el, attr); 
    };

    YAHOO.extend(TabView, YAHOO.util.Element, {
        /**
         * The className to add when building from scratch. 
         * @property CLASSNAME
         * @default "navset"
         */
        CLASSNAME: 'yui-navset',
        
        /**
         * The className of the HTMLElement containing the TabView's tab elements
         * to look for when building from existing markup, or to add when building
         * from scratch. 
         * All childNodes of the tab container are treated as Tabs when building
         * from existing markup.
         * @property TAB_PARENT_CLASSNAME
         * @default "nav"
         */
        TAB_PARENT_CLASSNAME: 'yui-nav',
        
        /**
         * The className of the HTMLElement containing the TabView's label elements
         * to look for when building from existing markup, or to add when building
         * from scratch. 
         * All childNodes of the content container are treated as content elements when
         * building from existing markup.
         * @property CONTENT_PARENT_CLASSNAME
         * @default "nav-content"
         */
        CONTENT_PARENT_CLASSNAME: 'yui-content',
        
        _tabParent: null,
        _contentParent: null,
        
        /**
         * Adds a Tab to the TabView instance.  
         * If no index is specified, the tab is added to the end of the tab list.
         * @method addTab
         * @param {YAHOO.widget.Tab} tab A Tab instance to add.
         * @param {Integer} index The position to add the tab. 
         * @return void
         */
        addTab: function(tab, index) {
            var tabs = this.get('tabs');
            if (!tabs) { // not ready yet
                this._queue[this._queue.length] = ['addTab', arguments];
                return false;
            }
            
            index = (index === undefined) ? tabs.length : index;
            
            var before = this.getTab(index);
            
            var self = this;
            var el = this.get(ELEMENT);
            var tabParent = this._tabParent;
            var contentParent = this._contentParent;

            var tabElement = tab.get(ELEMENT);
            var contentEl = tab.get('contentEl');

            if ( before ) {
                tabParent.insertBefore(tabElement, before.get(ELEMENT));
            } else {
                tabParent.appendChild(tabElement);
            }

            if ( contentEl && !Dom.isAncestor(contentParent, contentEl) ) {
                contentParent.appendChild(contentEl);
            }
            
            if ( !tab.get('active') ) {
                tab.set('contentVisible', false, true); /* hide if not active */
            } else {
                this.set('activeTab', tab, true);
                
            }

            var activate = function(e) {
                YAHOO.util.Event.preventDefault(e);
                var silent = false;

                if (this == self.get('activeTab')) {
                    silent = true; // dont fire activeTabChange if already active
                }
                self.set('activeTab', this, silent);
            };
            
            tab.addListener( tab.get('activationEvent'), activate);
            
            tab.addListener('activationEventChange', function(e) {
                if (e.prevValue != e.newValue) {
                    tab.removeListener(e.prevValue, activate);
                    tab.addListener(e.newValue, activate);
                }
            });
            
            tabs.splice(index, 0, tab);
        },

        /**
         * Routes childNode events.
         * @method DOMEventHandler
         * @param {event} e The Dom event that is being handled.
         * @return void
         */
        DOMEventHandler: function(e) {
            var el = this.get(ELEMENT);
            var target = YAHOO.util.Event.getTarget(e);
            var tabParent = this._tabParent;
            
            if (Dom.isAncestor(tabParent, target) ) {
                var tabEl;
                var tab = null;
                var contentEl;
                var tabs = this.get('tabs');

                for (var i = 0, len = tabs.length; i < len; i++) {
                    tabEl = tabs[i].get(ELEMENT);
                    contentEl = tabs[i].get('contentEl');

                    if ( target == tabEl || Dom.isAncestor(tabEl, target) ) {
                        tab = tabs[i];
                        break; // note break
                    }
                } 
                
                if (tab) {
                    tab.fireEvent(e.type, e);
                }
            }
        },
        
        /**
         * Returns the Tab instance at the specified index.
         * @method getTab
         * @param {Integer} index The position of the Tab.
         * @return YAHOO.widget.Tab
         */
        getTab: function(index) {
            return this.get('tabs')[index];
        },
        
        /**
         * Returns the index of given tab.
         * @method getTabIndex
         * @param {YAHOO.widget.Tab} tab The tab whose index will be returned.
         * @return int
         */
        getTabIndex: function(tab) {
            var index = null;
            var tabs = this.get('tabs');
            for (var i = 0, len = tabs.length; i < len; ++i) {
                if (tab == tabs[i]) {
                    index = i;
                    break;
                }
            }
            
            return index;
        },
        
        /**
         * Removes the specified Tab from the TabView.
         * @method removeTab
         * @param {YAHOO.widget.Tab} item The Tab instance to be removed.
         * @return void
         */
        removeTab: function(tab) {
            var tabCount = this.get('tabs').length;

            var index = this.getTabIndex(tab);
            var nextIndex = index + 1;
            if ( tab == this.get('activeTab') ) { // select next tab
                if (tabCount > 1) {
                    if (index + 1 == tabCount) {
                        this.set('activeIndex', index - 1);
                    } else {
                        this.set('activeIndex', index + 1);
                    }
                }
            }
            
            this._tabParent.removeChild( tab.get(ELEMENT) );
            this._contentParent.removeChild( tab.get('contentEl') );
            this._configs.tabs.value.splice(index, 1);
            
        },
        
        /**
         * Provides a readable name for the TabView instance.
         * @method toString
         * @return String
         */
        toString: function() {
            var name = this.get('id') || this.get('tagName');
            return "TabView " + name; 
        },
        
        /**
         * The transiton to use when switching between tabs.
         * @method contentTransition
         */
        contentTransition: function(newTab, oldTab) {
            newTab.set('contentVisible', true);
            oldTab.set('contentVisible', false);
        },
        
        /**
         * setAttributeConfigs TabView specific properties.
         * @method initAttributes
         * @param {Object} attr Hash of initial attributes
         */
        initAttributes: function(attr) {
            TabView.superclass.initAttributes.call(this, attr);
            
            if (!attr.orientation) {
                attr.orientation = 'top';
            }
            
            var el = this.get(ELEMENT);

            if (!Dom.hasClass(el, this.CLASSNAME)) {
                Dom.addClass(el, this.CLASSNAME);        
            }
            
            /**
             * The Tabs belonging to the TabView instance.
             * @attribute tabs
             * @type Array
             */
            this.setAttributeConfig('tabs', {
                value: [],
                readOnly: true
            });

            /**
             * The container of the tabView's label elements.
             * @property _tabParent
             * @private
             * @type HTMLElement
             */
            this._tabParent = 
                    this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,
                            'ul' )[0] || _createTabParent.call(this);
                
            /**
             * The container of the tabView's content elements.
             * @property _contentParent
             * @type HTMLElement
             * @private
             */
            this._contentParent = 
                    this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,
                            'div')[0] ||  _createContentParent.call(this);
            
            /**
             * How the Tabs should be oriented relative to the TabView.
             * @attribute orientation
             * @type String
             * @default "top"
             */
            this.setAttributeConfig('orientation', {
                value: attr.orientation,
                method: function(value) {
                    var current = this.get('orientation');
                    this.addClass('yui-navset-' + value);
                    
                    if (current != value) {
                        this.removeClass('yui-navset-' + current);
                    }
                    
                    switch(value) {
                        case 'bottom':
                        this.appendChild(this._tabParent);
                        break;
                    }
                }
            });
            
            /**
             * The index of the tab currently active.
             * @attribute activeIndex
             * @type Int
             */
            this.setAttributeConfig('activeIndex', {
                value: attr.activeIndex,
                method: function(value) {
                    //this.set('activeTab', this.getTab(value));
                },
                validator: function(value) {
                    return !this.getTab(value).get('disabled'); // cannot activate if disabled
                }
            });
            
            /**
             * The tab currently active.
             * @attribute activeTab
             * @type YAHOO.widget.Tab
             */
            this.setAttributeConfig('activeTab', {
                value: attr.activeTab,
                method: function(tab) {
                    var activeTab = this.get('activeTab');
                    
                    if (tab) {
                        tab.set('active', true);
                        //this._configs['activeIndex'].value = this.getTabIndex(tab); // keep in sync
                    }
                    
                    if (activeTab && activeTab != tab) {
                        activeTab.set('active', false);
                    }
                    
                    if (activeTab && tab != activeTab) { // no transition if only 1
                        this.contentTransition(tab, activeTab);
                    } else if (tab) {
                        tab.set('contentVisible', true);
                    }
                },
                validator: function(value) {
                    return !value.get('disabled'); // cannot activate if disabled
                }
            });

            this.on('activeTabChange', this._handleActiveTabChange);
            this.on('activeIndexChange', this._handleActiveIndexChange);

            YAHOO.log('attributes initialized', 'info', 'TabView');
            if ( this._tabParent ) {
                _initTabs.call(this);
            }
            
            // Due to delegation we add all DOM_EVENTS to the TabView container
            // but IE will leak when unsupported events are added, so remove these
            this.DOM_EVENTS.submit = false;
            this.DOM_EVENTS.focus = false;
            this.DOM_EVENTS.blur = false;

            for (var type in this.DOM_EVENTS) {
                if ( YAHOO.lang.hasOwnProperty(this.DOM_EVENTS, type) ) {
                    this.addListener.call(this, type, this.DOMEventHandler);
                }
            }
        },

        _handleActiveTabChange: function(e) {
            var activeIndex = this.get('activeIndex'),
                newIndex = this.getTabIndex(e.newValue);

            if (activeIndex !== newIndex) {
                if (!(this.set('activeIndex', newIndex)) ) { // NOTE: setting
                     // revert if activeIndex update fails (cancelled via beforeChange) 
                    this.set('activeTab', e.prevValue);
                }
            }
        },
        
        _handleActiveIndexChange: function(e) {
            // no set if called from ActiveTabChange event
            if (e.newValue !== this.getTabIndex(this.get('activeTab'))) {
                if (!(this.set('activeTab', this.getTab(e.newValue))) ) { // NOTE: setting
                     // revert if activeTab update fails (cancelled via beforeChange) 
                    this.set('activeIndex', e.prevValue);
                }
            }
        }
    });
    
    
    /**
     * Creates Tab instances from a collection of HTMLElements.
     * @method initTabs
     * @private
     * @return void
     */
    var _initTabs = function() {
        var tab,
            attr,
            contentEl;
            
        var el = this.get(ELEMENT);   
        var tabs = Dom.getChildren(this._tabParent);
        var contentElements = Dom.getChildren(this._contentParent);

        for (var i = 0, len = tabs.length; i < len; ++i) {
            attr = {};
            
            if (contentElements[i]) {
                attr.contentEl = contentElements[i];
            }

            tab = new YAHOO.widget.Tab(tabs[i], attr);
            this.addTab(tab);
            
            if (tab.hasClass(tab.ACTIVE_CLASSNAME) ) {
                this._configs.activeTab.value = tab; // dont invoke method
                this._configs.activeIndex.value = this.getTabIndex(tab);
            }
        }
    };
    
    var _createTabViewElement = function(attr) {
        var el = doc.createElement('div');

        if ( this.CLASSNAME ) {
            el.className = this.CLASSNAME;
        }
        
        YAHOO.log('TabView Dom created', 'info', 'TabView');
        return el;
    };
    
    var _createTabParent = function(attr) {
        var el = doc.createElement('ul');

        if ( this.TAB_PARENT_CLASSNAME ) {
            el.className = this.TAB_PARENT_CLASSNAME;
        }
        
        this.get(ELEMENT).appendChild(el);
        
        return el;
    };
    
    var _createContentParent = function(attr) {
        var el = doc.createElement('div');

        if ( this.CONTENT_PARENT_CLASSNAME ) {
            el.className = this.CONTENT_PARENT_CLASSNAME;
        }
        
        this.get(ELEMENT).appendChild(el);
        
        return el;
    };
    
    YAHOO.widget.TabView = TabView;
})();

