YAHOO.widget.MenuManager = function () {

    var m_oActiveMenu = null;
    var m_oMenus = {};
    var m_oVisibleMenus = {};
    var m_aMenuIds = [];
    var m_sMenuIdBase = "yuimenu";

    function addItem(p_oCollection, p_oItem) {

          p_oCollection[p_oItem.id] = p_oItem;

    }

    function removeItem(p_oCollection, p_oValue) {

        if(p_oValue) {

            if(p_oValue._Menu) {

                oItem = removeItemByValue(p_oCollection, p_oValue);

            }

            if(typeof p_oValue == "string") {

                oItem = removeItemByKey(p_oCollection, p_oValue);

            }

            if(oItem && oItem.isActive()) {

                m_oActiveMenu = null;

            }

        }        

    }

    function removeItemByKey(p_oCollection, p_sElementId) {

        var oItem = null;
        
        if(p_oCollection[p_sElementId]) {

            oItem = p_oCollection[p_sElementId];
            delete p_oCollection[p_sElementId];

        }

        return oItem;

    }

    function removeItemByValue(p_oCollection, p_oItem) {

        var oItem = null;

        for(var i in p_oCollection) {

            if(p_oCollection[i] == p_oItem) {

                oItem = p_oCollection[i];
                delete p_oCollection[i];
                break;

            }

        }

        return oItem;

    }

    function addVisibleMenu(p_sType, p_aArguments, p_oMenuManager) {

        if(p_aArguments[0]) {

            addItem(m_oVisibleMenus, p_aArguments[0]);

            m_oActiveMenu = p_aArguments[0];
            
        }

    }

    function removeVisibleMenu(p_sType, p_aArguments, p_oMenuManager) {

        removeItem(m_oVisibleMenus, p_aArguments[0]);

    }

    return {

        createMenuId: function() {

            var sMenuId = (m_sMenuIdBase + m_aMenuIds.length);

            m_aMenuIds[m_aMenuIds.length] = sMenuId;

            return sMenuId;

        },

        setActiveMenu: function(p_oMenu) {

            if(p_oMenu && p_oMenu._Menu) {

                m_oActiveMenu = p_oMenu;

            }

        },

        getActiveMenu : function() {

            return m_oActiveMenu;

        },

        addMenu : function(p_oMenu) {

            if(p_oMenu) {

                addItem(m_oMenus, p_oMenu);

                p_oMenu.showEvent.subscribe(addVisibleMenu, this, true);
                p_oMenu.hideEvent.subscribe(removeVisibleMenu, this, true);
                
                m_oActiveMenu = p_oMenu;

            }

        },

        removeMenu : function(p_oValue) {

            removeItem(m_oMenus, p_oValue);
            removeItem(m_oVisibleMenus, p_oValue);

        },

        hideVisibleMenus : function() {

            for(var i in m_oVisibleMenus) {

                m_oVisibleMenus[i].hide();

            }

            m_oVisibleMenus = {};

        },

        getMenus : function() {

            return m_oMenus;

        },

        getMenu : function(p_sElementId) {

            if(p_sElementId && m_oMenus[p_sElementId]) {

                return m_oMenus[p_sElementId];

            }

        },

        getVisibleMenus : function() {

            return m_oVisibleMenus;

        }

    };

} ();