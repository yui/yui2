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
     * @param {Object} attr (optional) A key map of the tabView's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    YAHOO.widget.TabView = function(el, attr) {
        attr = attr || {};
        if (arguments.length == 1 && !Lang.isString(el) && !el.nodeName) {
            attr = el; // treat first arg as attr object
            el = attr.element || null;
        }
        
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
     * The className to add when building from scratch. 
     * @property CLASSNAME
     * @default "navset"
     */
    proto.CLASSNAME = 'yui-navset';
    
    /**
     * The className of the HTMLElement containing the TabView's tab elements
     * to look for when building from existing markup, or to add when building
     * from scratch. 
     * All childNodes of the tab container are treated as Tabs when building
     * from existing markup.
     * @property TAB_PARENT_CLASSNAME
     * @default "nav"
     */
    proto.TAB_PARENT_CLASSNAME = 'yui-nav';
    
    /**
     * The className of the HTMLElement containing the TabView's label elements
     * to look for when building from existing markup, or to add when building
     * from scratch. 
     * All childNodes of the content container are treated as content elements when
     * building from existing markup.
     * @property CONTENT_PARENT_CLASSNAME
     * @default "nav-content"
     */
    proto.CONTENT_PARENT_CLASSNAME = 'yui-content';
    
    proto._tabParent = null;
    proto._contentParent = null; 
    
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
        if (!tabs) { // not ready yet
            this._queue[this._queue.length] = ['addTab', arguments];
            return false;
        }
        
        index = (index === undefined) ? tabs.length : index;
        
        var before = this.getTab(index);
        
        var self = this;
        var el = this.get('element');
        var tabParent = this._tabParent;
        var contentParent = this._contentParent;

        var tabElement = tab.get('element');
        var contentEl = tab.get('contentEl');

        if ( before ) {
            tabParent.insertBefore(tabElement, before.get('element'));
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
            self.set('activeTab', this, true);
        };
        
        tab.addListener( tab.get('activationEvent'), activate);
        
        tab.addListener('activationEventChange', function(e) {
            if (e.prevValue != e.newValue) {
                tab.removeListener(e.prevValue, activate);
                tab.addListener(e.newValue, activate);
            }
        });
        
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
        var tabParent = this._tabParent;
        
        if (Dom.isAncestor(tabParent, target) ) {
            var tabEl;
            var tab = null;
            var contentEl;
            var tabs = this.get('tabs');

            for (var i = 0, len = tabs.length; i < len; i++) {
                tabEl = tabs[i].get('element');
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
     * @method removeTab
     * @param {YAHOO.widget.Tab} item The Tab instance to be removed.
     * @return void
     */
    proto.removeTab = function(tab) {
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
        
        this._tabParent.removeChild( tab.get('element') );
        this._contentParent.removeChild( tab.get('contentEl') );
        this._configs.tabs.value.splice(index, 1);
    	
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
     * The transiton to use when switching between tabs.
     * @method contentTransition
     */
    proto.contentTransition = function(newTab, oldTab) {
        newTab.set('contentVisible', true);
        oldTab.set('contentVisible', false);
    };
    
    /**
     * Registers TabView specific properties.
     * @method initAttributes
     * @param {Object} attr Hash of initial attributes
     */
    proto.initAttributes = function(attr) {
        YAHOO.widget.TabView.superclass.initAttributes.call(this, attr);
        
        if (!attr.orientation) {
            attr.orientation = 'top';
        }
        
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
         * @config orientation
         * @type String
         * @default "top"
         */
        this.register('orientation', {
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
         * @config activeIndex
         * @type Int
         */
        this.register('activeIndex', {
            value: attr.activeIndex,
            method: function(value) {
                this.set('activeTab', this.getTab(value));
            },
            validator: function(value) {
                return !this.getTab(value).get('disabled'); // cannot activate if disabled
            }
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
                
                if (tab) {  
                    tab.set('active', true);
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

        if ( this._tabParent ) {
            _initTabs.call(this);
        }
        
        for (var type in this.DOM_EVENTS) {
            if ( this.DOM_EVENTS.hasOwnProperty(type) ) {
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
            contentEl;
            
        var el = this.get('element');   
        var tabs = _getChildNodes(this._tabParent);
        var contentElements = _getChildNodes(this._contentParent);

        for (var i = 0, len = tabs.length; i < len; ++i) {
            attr = {};
            
            if (contentElements[i]) {
                attr.contentEl = contentElements[i];
            }

            tab = new YAHOO.widget.Tab(tabs[i], attr);
            this.addTab(tab);
            
            if (tab.hasClass(tab.ACTIVE_CLASSNAME) ) {
                this._configs.activeTab.value = tab; // dont invoke method
            }
        }
    };
    
    var _createTabViewElement = function(attr) {
        var el = document.createElement('div');

        if ( this.CLASSNAME ) {
            el.className = this.CLASSNAME;
        }
        
        return el;
    };
    
    var _createTabParent = function(attr) {
        var el = document.createElement('ul');

        if ( this.TAB_PARENT_CLASSNAME ) {
            el.className = this.TAB_PARENT_CLASSNAME;
        }
        
        this.get('element').appendChild(el);
        
        return el;
    };
    
    var _createContentParent = function(attr) {
        var el = document.createElement('div');

        if ( this.CONTENT_PARENT_CLASSNAME ) {
            el.className = this.CONTENT_PARENT_CLASSNAME;
        }
        
        this.get('element').appendChild(el);
        
        return el;
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

/**
 * Fires before the activeTab is changed.
 * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
 * <p>If handler returns false, the change will be cancelled, and the value will not
 * be set.</p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> beforeActiveTabChange<br>
 * <code>&lt;<a href="YAHOO.widget.Tab.html">YAHOO.widget.Tab</a>&gt;
 * prevValue</code> the currently active tab<br>
 * <code>&lt;<a href="YAHOO.widget.Tab.html">YAHOO.widget.Tab</a>&gt;
 * newValue</code> the tab to be made active</p>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var previous = e.prevValue};<br>
 * myTabs.addListener('beforeActiveTabChange', handler);</code></p>
 * @event beforeActiveTabChange
 */
    
/**
 * Fires after the activeTab is changed.
 * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> activeTabChange<br>
 * <code>&lt;<a href="YAHOO.widget.Tab.html">YAHOO.widget.Tab</a>&gt;
 * prevValue</code> the formerly active tab<br>
 * <code>&lt;<a href="YAHOO.widget.Tab.html">YAHOO.widget.Tab</a>&gt;
 * newValue</code> the new active tab</p>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var previous = e.prevValue};<br>
 * myTabs.addListener('activeTabChange', handler);</code></p>
 * @event activeTabChange
 */
 
/**
 * Fires before the orientation is changed.
 * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
 * <p>If handler returns false, the change will be cancelled, and the value will not
 * be set.</p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> beforeOrientationChange<br>
 * <code>&lt;String&gt;
 * prevValue</code> the current orientation<br>
 * <code>&lt;String&gt;
 * newValue</code> the new orientation to be applied</p>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var previous = e.prevValue};<br>
 * myTabs.addListener('beforeOrientationChange', handler);</code></p>
 * @event beforeOrientationChange
 */
    
/**
 * Fires after the orientation is changed.
 * <p>See: <a href="YAHOO.util.Element.html#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> orientationChange<br>
 * <code>&lt;String&gt;
 * prevValue</code> the former orientation<br>
 * <code>&lt;String&gt;
 * newValue</code> the new orientation</p>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var previous = e.prevValue};<br>
 * myTabs.addListener('orientationChange', handler);</code></p>
 * @event orientationChange
 */
})();