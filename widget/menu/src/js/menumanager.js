/**
* @class The MenuManager is a singleton class that helps manage every Menu
* instance that is created.
* @constructor
*/
YAHOO.widget.MenuManager = function () {

    /**
    * Collection of Menu instances.
    * @private
    * @type {Object}
    */
    var m_oMenus = {},

        /**
        * Collection of visible Menu instances.
        * @private
        * @type {Object}
        */
        m_oVisibleMenus = {},


        /**
        * Number of Menu ids that have been generated.
        * @private
        * @type {Number}
        */
        m_nMenuIds = 0,


        /**
        * The base prefix for all generated menu ids.
        * @private
        * @type {String}
        */
        m_sMenuIdBase = "yuimenu",


        /**
        * Reference to the current context so that private methods have access 
        * to class members
        * @private
        * @type {YAHOO.widget.MenuManager}
        */
        me = this;


    // Private methods

    /**
    * Adds an item to a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {YAHOO.widget.Menu} p_oItem The Menu instance to be added.
    */
    var addItem = function(p_oCollection, p_oItem) {

          p_oCollection[p_oItem.id] = p_oItem;

    };


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {String/YAHOO.widget.Menu} p_oValue String id of or object
    * reference for the Menu instance to be removed.
    */
    var removeItem = function(p_oCollection, p_oValue) {

        if(p_oValue) {

            if(p_oValue._Menu) {

                oItem = removeItemByValue(p_oCollection, p_oValue);

            }

            if(typeof p_oValue == "string") {

                oItem = removeItemByKey(p_oCollection, p_oValue);

            }

            if(oItem && oItem === me.activeMenu) {

                me.activeMenu = null;

            }

        }        

    };


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {String} p_sElementId String id of the Menu to be removed.
    */
    var removeItemByKey = function(p_oCollection, p_sElementId) {

        var oItem = null;
        
        if(p_oCollection[p_sElementId]) {

            oItem = p_oCollection[p_sElementId];
            delete p_oCollection[p_sElementId];

        }

        return oItem;

    };


    /**
    * Removes an item from a collection.  Used to manage a the collection of  
    * Menu and visible Menu instances.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {Object} p_oCollection The object instance to be modified.
    * @param {YAHOO.widget.Menu} p_oItem Object reference for the Menu
    * instance to be removed.
    */
    var removeItemByValue = function(p_oCollection, p_oItem) {

        var oItem = null;

        for(var i in p_oCollection) {

            if(p_oCollection[i] == p_oItem) {

                oItem = p_oCollection[i];
                delete p_oCollection[i];
                break;

            }

        }

        return oItem;

    };


    // Private CustomEvent event handlers

    /**
    * "show" YAHOO.util.CustomEvent handler for each Menu instance.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu that fired the event.
    */
    var onMenuShow = function(p_sType, p_aArguments, p_oMenu) {

        if(p_oMenu) {

            addItem(m_oVisibleMenus, p_oMenu);

            me.activeMenu = p_oMenu;
            
        }

    };


    /**
    * "hide" YAHOO.util.CustomEvent handler for each Menu instance.
    * @member YAHOO.widget.MenuManager
    * @private
    * @param {String} p_sType The name of the event that was fired.
    * @param {Array} p_aArguments Collection of arguments sent when the 
    * event was fired.
    * @param {YAHOO.widget.Menu} p_oMenu The Menu that fired the event.
    */
    var onMenuHide = function(p_sType, p_aArguments, p_oMenu) {

        removeItem(m_oVisibleMenus, p_oMenu);

    };


    /**
    * Returns the currently active Menu.
    * @member YAHOO.widget.MenuManager
    * @type {YAHOO.widget.Menu}
    */
    me.activeMenu = null;

    return {

        /**
        * Generates a unique id for a Menu instance.
        * @member YAHOO.widget.MenuManager
        * @return Returns a new id
        * @type {String}
        */
        createMenuId: function() {

            var sMenuId = (m_sMenuIdBase + (m_nMenuIds++));

            return sMenuId;

        },


        /**
        * Registers a Menu instance.
        * @member YAHOO.widget.MenuManager
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance to be added.
        */
        addMenu: function(p_oMenu) {

            if(p_oMenu) {

                addItem(m_oMenus, p_oMenu);

                p_oMenu.showEvent.subscribe(onMenuShow, p_oMenu);
                p_oMenu.hideEvent.subscribe(onMenuHide, p_oMenu);

                me.activeMenu = p_oMenu;

            }

        },


        /**
        * Removes the Menu from the known list of Menu and visible
        * Menu instances.
        * @member YAHOO.widget.MenuManager
        * @param {String/YAHOO.widget.Menu} p_oValue String id of or object
        * reference for the Menu instance to be removed.
        */
        removeMenu: function(p_oValue) {

            removeItem(m_oMenus, p_oValue);
            removeItem(m_oVisibleMenus, p_oValue);

        },


        /**
        * Hides all visible Menu instances.
        * @member YAHOO.widget.MenuManager
        */
        hideVisibleMenus: function() {

            for(var i in m_oVisibleMenus) {

                m_oVisibleMenus[i].hide();

            }

            m_oVisibleMenus = {};

        },


        /**
        * Returns a collection of all of the registered Menu instances.
        * @member YAHOO.widget.MenuManager
        * @return Returns a collection Menu instances.
        * @type Object
        */
        getMenus: function() {

            return m_oMenus;

        },


        /**
        * Returns the Menu instance with the specified id.
        * @member YAHOO.widget.MenuManager
        * @return Returns a Menu instance.
        * @type YAHOO.widget.Menu
        */
        getMenu: function(p_sElementId) {

            if(p_sElementId && m_oMenus[p_sElementId]) {

                return m_oMenus[p_sElementId];

            }

        },


        /**
        * Returns a collection of all of the visible Menu instances.
        * @member YAHOO.widget.MenuManager
        * @return Returns a collection Menu instances.
        * @type Object
        */
        getVisibleMenus: function() {

            return m_oVisibleMenus;

        }

    };

} ();