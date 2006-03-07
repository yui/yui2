/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
* @class The MenuItem class allows you to create and modify an item for an Menu.
* @constructor
* @param {String/HTMLElement} p_oObject String or HTMLElement 
* (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
* source HTMLElement node.
* @param {Object} p_oUserConfig The configuration object literal containing 
* the configuration that should be set for this MenuItem. See configuration 
* documentation for more details.
*/
YAHOO.widget.MenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

    }

}

YAHOO.widget.MenuItem.prototype = {

    // Constants

    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator.
    * @final
    * @type String
    */
    SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_nrm_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuItem instance has focus.
    * @final
    * @type String
    */
    FOCUSED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_hov_1.gif",


    /**
    * Constant representing the path to the image to be used for the submenu
    * arrow indicator when a MenuItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/alt1/menuarorght9_dim_1.gif",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator.
    * @final
    * @type String
    */
    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator when the submenu is visible.
    * @final
    * @type String
    */
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",


    /**
    * Constant representing the alt text for the image to be used for the 
    * submenu arrow indicator when a MenuItem instance is disabled.
    * @final
    * @type String
    */
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    /**
    * Used to identify a MenuItem instance's type as MenuItem since checking the 
    * constructor property will not be reliable if MenuItem is subclassed.
    * @final  
    * @type {Boolean}
    */
    _MenuItem: true,


    // Public properties

    /**
    * Returns the ordinal position of a MenuItem instance relative to other 
    * MenuItems inside it's parent Menu instance.
    * @type Number
    */
    index: null,


    /**
    * Returns the parent Menu instance for a MenuItem instance.
    * @type {YAHOO.widget.Menu}
    */
    parent: null,


    /**
    * Returns the HTMLLIElement for a MenuItem instance.
    * @type {HTMLLIElement}
    */
    element: null,


    /**
    * Returns the HTMLElement (either HTMLLIElement, HTMLOptGroupElement or
    * HTMLOptionElement) used create the MenuItem instance.
    * @type {HTMLLIElement/HTMLOptGroupElement/HTMLOptionElement}
    */
    srcElement: null,


    /**
    * Specifies an arbitrary value for a MenuItem instance.
    * @type {Object}
    */
    value: null,


    /**
    * The MenuItem class's initialization method. This method is automatically
    * called by the constructor, and sets up all DOM references for
    * pre-existing markup, and creates required markup if it is not
    * already present.
    * @param {String/HTMLElement} p_oObject String or HTMLElement 
    * (either HTMLLIElement, HTMLOptGroupElement or HTMLOptionElement) of the 
    * source HTMLElement node.
    * @param {Object} p_oUserConfig The configuration object literal containing 
    * the configuration that should be set for this MenuItem. See configuration 
    * documentation for more details.
    */
    init: function(p_oObject, p_oUserConfig) {


        // Private member variables

        /**
        * Reference to the HTMLAnchorElement of the MenuItem's core internal
        * DOM structure.
        * @private
        * @type {HTMLAnchorElement}
        */
        var m_oAnchor = null,

            /**
            * Reference to the Text node of the MenuItem's core internal
            * DOM structure.
            * @private
            * @type {Text}
            */
            m_oText = null,


            /**
            * Reference to the HTMLElement (<EM>) used to create the optional
            * help text for a MenuItem instance.
            * @private
            * @type {HTMLElement}
            */
            m_oHelpTextEM = null,


            /**
            * Reference to the HTMLImageElement used to create the submenu
            * indicator for a MenuItem instance.
            * @private
            * @type {HTMLAnchorElement}
            */
            m_oSubMenuIndicatorIMG = null,


            /**
            * Reference to the submenu for a MenuItem instance.
            * @private
            * @type {YAHOO.widget.Menu}
            */
            m_oSubMenu = null,


            /**
            * Reference to the Dom utility singleton.
            * @private
            * @type {YAHOO.util.Dom}
            */
            m_oDom = YAHOO.util.Dom,


            /**
            * Reference to the Event utility singleton.
            * @private
            * @type {YAHOO.util.Event}
            */
            m_oEventUtil = YAHOO.util.Event,


            /**
            * String representing the user's browser's userAgent string.
            * @private
            * @type {String}
            */
            m_sUserAgent = navigator.userAgent.toLowerCase(),
    
    
            /**
            * String representing the user's browser.
            * @private
            * @type {String}
            */
            m_sBrowser = function() {
    
                var m_sUserAgent = navigator.userAgent.toLowerCase();
                
                if(m_sUserAgent.indexOf("opera") != -1) {
    
                    return "opera";
    
                }
                else if(m_sUserAgent.indexOf("msie") != -1) {
    
                    return "ie";
    
                }
                else if(m_sUserAgent.indexOf("safari") != -1) {
    
                    return "safari";
    
                }
                else if(m_sUserAgent.indexOf("gecko") != -1) {
    
                    return "gecko";
    
                }
                else {
    
                    return false;
    
                }
    
            }(),


            /**
            * Reference to the current context so that private methods have 
            * access to class members.
            * @private
            * @type {YAHOO.widget.MenuItem}
            */
            me = this;


        // Private methods

        /**
        * Determines if an object is a string
        * @private
        * @param {Object} p_oObject The object to be evaluated.
        * @return Returns true if the object is a string.
        * @type Boolean
        */
        var checkString = function(p_oObject) {

            return (typeof p_oObject == "string");

        };


        /**
        * Determines if an object is an HTMLElement.
        * @private
        * @param {Object} p_oObject The object to be evaluated.
        * @return Returns true if the object is an HTMLElement.
        * @type Boolean
        */
        var checkDOMNode = function(p_oObject) {

            return (p_oObject && p_oObject.tagName);

        };


        /**
        * Creates the core DOM structure for a MenuItem instance.
        * @private
        */
        var createRootNodeStructure = function() {

            me.element = document.createElement("li");

            m_oText = document.createTextNode("");

            m_oAnchor = document.createElement("a");
            m_oAnchor.appendChild(m_oText);
            
            me.cfg.refireEvent("url");

            me.element.appendChild(m_oAnchor);            

        };


        /**
        * Sets focus to the first MenuItem instance of a MenuItem
        * instances's submenu.
        * @private
        */
        var focusSubMenuFirstMenuItem = function() {
    
            var oMenuItem;
    
            if(m_oSubMenu.getSubMenus().length > 0) {
    
                oMenuItem = m_oSubMenu.getSubMenu(0).getMenuItem(0);
    
            }
            else {
    
                oMenuItem = m_oSubMenu.getMenuItem(0);
    
            }
    
            if(oMenuItem) {
    
                oMenuItem.focus();
    
            }        
    
        };


        /**
        * Finds the next enabled MenuItem instance in a Menu instance 
        * relative to the specified MenuItem index.
        * @private
        * @param {Number} p_nMenuItemIndex The index to begin the search.
        * @param {YAHOO.widget.Menu} p_oMenu A Menu instance to search.
        * @return Returns a MenuItem instance.
        * @type YAHOO.widget.MenuItem
        */
        var getNextEnabledMenuItem = function(p_nMenuItemIndex, p_oMenu) {
    
            var oNextMenuItem;
    
            if(
                p_nMenuItemIndex < (p_oMenu.getMenuItems().length - 1)
            ) {
    
                oNextMenuItem = p_oMenu.getMenuItem((p_nMenuItemIndex+1));
    
            }
            else {
    
                // Check if this Menu instance is a member of a group
    
                var oParent = p_oMenu.parent;
    
                if(oParent && oParent._Menu) {
    
                    var oNextMenu, nNextMenuIndex;
    
                    if(
                        p_oMenu.index < 
                        (oParent.getSubMenus().length - 1)
                    ) {
    
                        nNextMenuIndex = p_oMenu.index + 1;
    
                    }
                    else {
    
                        nNextMenuIndex = 0;
    
                    }
    
                    oNextMenu = oParent.getSubMenu(nNextMenuIndex);
    
                    if(oNextMenu) {
    
                        /*
                            Retrieve the first MenuItem instance in 
                            the next Menu
                        */ 
    
                        oNextMenuItem = oNextMenu.getMenuItem(0);
    
                    }
    
                }
                else {
    
                    /*
                        Retrieve the first MenuItem instance in the next 
                        parent Menu
                    */ 
    
                    oNextMenuItem = p_oMenu.getMenuItem(0);                    
    
                }
    
            }
    
    
            if(oNextMenuItem) {
    
                if(oNextMenuItem.cfg.getProperty("disabled")) {
    
                    return getNextEnabledMenuItem(
                                oNextMenuItem.index, 
                                oNextMenuItem.parent
                            );
    
                }
                else {
    
                    return oNextMenuItem;
    
                }
    
            }
    
        };


        /**
        * Finds the previous enabled MenuItem instance in a Menu instance 
        * relative to the specified MenuItem index.
        * @private
        * @param {Number} p_nMenuItemIndex The index to begin the search.
        * @param {YAHOO.widget.Menu} p_oMenu A Menu instance to search.
        * @return Returns a MenuItem instance.
        * @type YAHOO.widget.MenuItem
        */
        var getPreviousEnabledMenuItem = function(p_nMenuItemIndex, p_oMenu) {
    
            var oPreviousMenuItem;
    
            if(p_nMenuItemIndex > 0) {
    
                oPreviousMenuItem = p_oMenu.getMenuItem((p_nMenuItemIndex-1));
    
            }
            else {
    
                // Check if this Menu instance is a member of a group
    
                var oParent = p_oMenu.parent;
    
                if(oParent && oParent._Menu) {
    
                    var oPreviousMenu, nPreviousMenuIndex;
    
                    if(p_oMenu.index > 0) {
    
                        nPreviousMenuIndex = p_oMenu.index - 1;
    
                    }
                    else {
    
                        nPreviousMenuIndex = oParent.getSubMenus().length - 1;
    
                    }
    
                    oPreviousMenu = oParent.getSubMenu(nPreviousMenuIndex);
    
                    if(oPreviousMenu) {
    
                        /*
                            Retrieve the last MenuItem instance in 
                            the previous Menu
                        */ 
    
                        oPreviousMenuItem = 
                            oPreviousMenu.getMenuItem(
                                (oPreviousMenu.getMenuItems().length - 1)
                            );
    
                    }
    
                }
                else {
    
                    // Retrieve the last MenuItem instance in the parent Menu
    
                    oPreviousMenuItem = 
                        p_oMenu.getMenuItem(
                            (p_oMenu.getMenuItems().length - 1)
                        );                    
    
                }
    
            }
    
            if(oPreviousMenuItem) {
    
                if(oPreviousMenuItem.cfg.getProperty("disabled")) {
    
                    return getPreviousEnabledMenuItem(
                                oPreviousMenuItem.index,
                                oPreviousMenuItem.parent
                            );
    
                }
                else {
    
                    return oPreviousMenuItem;
    
                }
    
            }
    
        };


        /**
        * Iterates the source element's childNodes collection and uses the  
        * child nodes to instantiate Menu and MenuItem instances.
        * @private
        */
        var initSubTree = function() {
    
            var aChildNodes = me.srcElement.childNodes,
                nChildNodes = aChildNodes.length,
                oMenuManager = YAHOO.widget.MenuManager,
                Menu = YAHOO.widget.Menu,
                MenuItem = YAHOO.widget.MenuItem;
    
    
            if(nChildNodes > 0) {
    
                var oNode,
                    aULs = [],
                    aOptions = [];
        
                for(var i=0; i<nChildNodes; i++) {
                
                    oNode = aChildNodes[i];
                
                    if(oNode.nodeType == 1) {
                
                        switch(oNode.tagName) {
                
                            case "DIV":
                
                                me.cfg.setProperty(
                                    "submenu", 
                                    (new Menu(oNode))
                                );
                
                            break;
         
                            case "OPTION":
        
                                aOptions[aOptions.length] = oNode;
        
                            break;
               
                            case "UL":
                                
                                aULs[aULs.length] = oNode;
                
                            break;
                
                        }
        
                    }
                
                }        
    
    
                if(aOptions.length > 0) {
        
                    me.cfg.setProperty(
                        "submenu", 
                        (new Menu(oMenuManager.createMenuId()))
                    );
    
                    var nOptions = aOptions.length;
        
                    for(var n=0; n<nOptions; n++) {
        
                        m_oSubMenu.addMenuItem((new MenuItem(aOptions[n])));
        
                    }
        
                }
        
    
                if(aULs.length > 0) {
        
                    if(aULs.length > 1) {
    
                        var oMenu = new Menu(oMenuManager.createMenuId()),
                            nULs = aULs.length;
            
                        for(var n=0; n<nULs; n++) {
            
                            oMenu.addSubMenu((new Menu(aULs[n])));
            
                        }
    
                        me.cfg.setProperty(
                            "submenu", 
                            oMenu
                        );
                    
                    }
                    else {
    
                        me.cfg.setProperty(
                            "submenu", 
                            (new Menu(aULs[0]))
                        );
                    
                    }
        
                }        
    
            }
    
        };


        // Private DOM event handlers

        /**
        * "mouseover" event handler for the MenuItem's HTMLLIElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLLIElement that fired the event.
        */    
        var onElementMouseOver = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {

                var oRelatedTarget = m_oEventUtil.getRelatedTarget(p_oEvent),
                    oNode = oRelatedTarget,
                    bElementMouseOver = true;


                if(oNode) {

                    do {
    
                        if(oNode == this.element) {
    
                            bElementMouseOver = false;
                            break;
    
                        }
    
                        oNode = oNode.parentNode;
    
                    }
                    while(oNode);

                }


                if(bElementMouseOver) {
    
                    this.focus();


                    if(m_oSubMenu) {
            
                        this.showSubMenu();
            
                    }
            
                    this.mouseOverEvent.fire(p_oEvent);

                }
    
            }
        
        };


        /**
        * "mouseout" event handler for the MenuItem's HTMLLIElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLLIElement that fired the event.
        */
        var onElementMouseOut = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
                    
                var oRelatedTarget = m_oEventUtil.getRelatedTarget(p_oEvent),
                    oNode = oRelatedTarget,
                    bElementMouseOut = true,
                    bShowSubMenu = false;

                if(oNode) {

                    do {
    
                        if(m_oSubMenu && oNode == m_oSubMenu.element) {
    
                            bShowSubMenu = true;
    
                        }
    
                        if(oNode == this.element) {
    
                            bElementMouseOut = false;
                            break;
    
                        }
    
                        oNode = oNode.parentNode;
    
                    }
                    while(oNode);

                }

                if(bElementMouseOut) {

                    // Real mouseout

                    if(m_oSubMenu && m_oSubMenu.cfg.getProperty("visible")) {

                        m_oSubMenu.hide();
                
                    }

                    this.blur();

                    this.cfg.setProperty("selected", false);

                    this.mouseOutEvent.fire(p_oEvent);

                }
                else if(bShowSubMenu) {

                    // don't hide

                    this.cfg.setProperty("selected", true);

                }

            }
    
        };


        /**
        * "mousedown" event handler for the MenuItem's HTMLLIElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLLIElement that fired the event.
        */
        var onElementMouseDown = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                this.mouseDownEvent.fire(p_oEvent);
    
                return true;
    
            }
    
        };


        /**
        * "mouseup" event handler for the MenuItem's HTMLLIElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLLIElement that fired the event.
        */
        var onElementMouseUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                this.mouseUpEvent.fire(p_oEvent);
    
                return true;
    
            }
    
        };


        /**
        * "click" event handler for the MenuItem's HTMLLIElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLLIElement that fired the event.
        */
        var onElementClick = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                var oTarget = m_oEventUtil.getTarget(p_oEvent, true),
                    sURL = this.cfg.getProperty("url");


                if(oTarget == m_oAnchor) {

                    if(sURL && sURL != "#") {

                        return true; // Needed to tell Safari to follow the link

                    }
                    else {

                        m_oEventUtil.preventDefault(p_oEvent);
        
                        return false;

                    }

                }
                else {

                    if(oTarget == m_oSubMenuIndicatorIMG) {

                        if(m_oSubMenu.cfg.getProperty("visible")) {
        
                            this.hideSubMenu();
        
                            this.focus();
        
                        }
                        else {
        
                            this.cfg.setProperty("selected", true);
                            
                            this.showSubMenu();
        
                            focusSubMenuFirstMenuItem();
        
                        }

                    }
                    else if(sURL && sURL != "#") {

                        document.location = sURL;

                    }

                }
    
                this.clickEvent.fire(p_oEvent);
    
            }
    
        };


        /**
        * "keydown" event handler for the MenuItem's HTMLAnchorElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLAnchorElement that fired the event.
        */
        var onAnchorKeyDown = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                switch(p_oEvent.keyCode) {
        
                    // up arrow
        
                    case 38:
        
                        var oMenuItem = 
                            getPreviousEnabledMenuItem(
                                this.index,
                                this.parent
                            );
                
                        if(oMenuItem) {
                
                            oMenuItem.focus();
        
                            /*
                                Prevent the keydown event from scrolling the 
                                window up
                            */ 
    
                            m_oEventUtil.preventDefault(p_oEvent);
            
                        }
        
                    break;
        
        
                    // down arrow
        
                    case 40:
        
                        var oMenuItem = 
                            getNextEnabledMenuItem(
                                this.index, 
                                this.parent
                            );
                
                        if(oMenuItem) {
                
                            oMenuItem.focus();
        
                            /*
                                Prevent the keydown event from scrolling the 
                                window down
                            */ 

                            m_oEventUtil.preventDefault(p_oEvent);
            
                        }
        
                    break;
        
        
                    // Right arrow
        
                    case 39:
        
                        if(m_oSubMenu) {
                        
                            this.showSubMenu();
    
                            focusSubMenuFirstMenuItem();
    
                            this.cfg.setProperty("selected", true);
        
                            /*
                                Prevent the keydown event from scrolling the 
                                window right
                            */

                            m_oEventUtil.preventDefault(p_oEvent);
        
                        }
        
                    break;
                  
                    
                    // Left arrow and Esc key
        
                    case 37:
                    case 27:
        
                        var oParentMenu = this.parent;
        
                        if(
                            oParentMenu.parent && 
                            oParentMenu.parent._Menu
                        ) {
        
                            oParentMenu = oParentMenu.parent;
        
                        }
        
                        if(
                            oParentMenu.cfg.getProperty("position") == 
                                "absolute"
                        ) {

                            oParentMenu.hide();

                        }

                        var oMenuItem = oParentMenu.parent;
        
                        if(oMenuItem) {
        
                            oMenuItem.cfg.setProperty("selected", true);
                            oMenuItem.focus();
        
                        }
        
                        m_oEventUtil.preventDefault(p_oEvent);
        
                    break;
        
                }
        
                this.keyDownEvent.fire(p_oEvent);
    
            }
        
        };


        /**
        * "keyup" event handler for the MenuItem's HTMLAnchorElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLAnchorElement that fired the event.
        */
        var onAnchorKeyUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
        
                this.keyUpEvent.fire(p_oEvent);
    
            }
    
        };


        /**
        * "keypress" event handler for the MenuItem's HTMLAnchorElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLAnchorElement that fired the event.
        */        
        var onAnchorKeyPress = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                // Prevent the navigation keys from scrolling the page
    
                switch(p_oEvent.keyCode) {
    
                    case 27: // Esc
                    case 37: // Left
                    case 38: // Up    
                    case 39: // Right
                    case 40: // Down
    
                        m_oEventUtil.preventDefault(p_oEvent);
    
                    break;
    
                }
    
                this.keyPressEvent.fire(p_oEvent);
    
            }
    
        };


        /**
        * "focus" event handler for the MenuItem's HTMLAnchorElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLAnchorElement that fired the event.
        */  
        var onAnchorFocus = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                var oParent = this.parent.parent,
                    oActiveMenuItem;
                
    
                if(oParent && oParent._Menu) {
        
                    oActiveMenuItem = oParent.activeMenuItem;
                
                }
                else {
                
                    oActiveMenuItem = this.parent.activeMenuItem;
                
                }
           
            
                if(oActiveMenuItem && oActiveMenuItem != this) {
        
                    if(oActiveMenuItem.cfg.getProperty("selected")) {

                        oActiveMenuItem.cfg.setProperty(
                            "selected", 
                            false
                        );
            
                    }
            
                    var oSubMenu = oActiveMenuItem.cfg.getProperty("submenu");
            
                    if(oSubMenu && oSubMenu.cfg.getProperty("visible")) {
            
                        oSubMenu.hide();
            
                    }
        
                }

                // Deselect the MenuItem instance since an item should not
                // have both classes at once
                this.cfg.setProperty("selected", false);
            
                m_oDom.addClass(this.element, "focus");
                m_oDom.addClass(m_oAnchor, "focus");
    
                if(m_oHelpTextEM) {
    
                    m_oDom.addClass(m_oHelpTextEM, "focus");
    
                }
    
                if(m_oSubMenu) {
        
                    m_oSubMenuIndicatorIMG.src = 
                        this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;
        
                }                
    
                this.focusEvent.fire(p_oEvent);
    
            }
    
        };


        /**
        * "blur" event handler for the MenuItem's HTMLAnchorElement.
        * @private
        * @param {Event} p_oEvent Event object passed back by the 
        * event utility (YAHOO.util.Event).
        * @param {YAHOO.widget.MenuItem} p_oMenuItem The MenuItem instance
        * corresponding to the HTMLAnchorElement that fired the event.
        */  
        var onAnchorBlur = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                m_oDom.removeClass(this.element, "focus");
                m_oDom.removeClass(m_oAnchor, "focus");
    
                if(m_oHelpTextEM) {
    
                    m_oDom.removeClass(m_oHelpTextEM, "focus");
    
                }
    
                if(m_oSubMenu && !this.cfg.getProperty("selected")) {
        
                    m_oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
    
                }
        
                this.blurEvent.fire(p_oEvent);
    
            }
    
        };
    

        // Event handlers for configuration properties
    
        /**
        * Event handler for when the "text" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */
        this.configText = function(p_sType, p_aArguments, p_oObject) {
    
            var sText = p_aArguments[0];


            if(m_oText) {

                m_oText.nodeValue = sText;

            }
    
        };


        /**
        * Event handler for when the "helptext" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configHelpText = function(p_sType, p_aArguments, p_oObject) {
    
            var oHelpText = p_aArguments[0];


            var initHelpText = function() {

                m_oDom.addClass(me.element, "hashelptext");
                m_oDom.addClass(m_oAnchor, "hashelptext");

                if(me.cfg.getProperty("disabled")) {

                    me.cfg.refireEvent("disabled");

                }

                if(me.cfg.getProperty("selected")) {

                    me.cfg.refireEvent("selected");

                }                

            };

            var removeHelpText = function() {

                m_oDom.removeClass(me.element, "hashelptext");
                m_oDom.removeClass(m_oAnchor, "hashelptext"); 

                me.element.removeChild(m_oHelpTextEM);
                m_oHelpTextEM = null;

            };


            if(checkDOMNode(oHelpText)) {

                if(m_oHelpTextEM) {

                    var oParentNode = m_oHelpTextEM.parentNode;
                    oParentNode.replaceChild(oHelpText, m_oHelpTextEM);

                }
                else {

                    m_oHelpTextEM = oHelpText;

                    this.element.insertBefore(
                        m_oHelpTextEM, 
                        m_oSubMenuIndicatorIMG
                    );

                }

                initHelpText();

            }
            else if(checkString(oHelpText)) {

                if(oHelpText.length == 0) {

                    removeHelpText();

                }
                else {

                    if(!m_oHelpTextEM) {

                        m_oHelpTextEM = document.createElement("em");

                        this.element.insertBefore(
                            m_oHelpTextEM, 
                            m_oSubMenuIndicatorIMG
                        );

                    }

                    m_oHelpTextEM.innerHTML = oHelpText;

                    initHelpText();

                }

            }
            else if(!oHelpText && m_oHelpTextEM) {

                removeHelpText();

            }
    
        };


        /**
        * Event handler for when the "url" configuration property of
        * a MenuItem instance changes.  
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configURL = function(p_sType, p_aArguments, p_oObject) {
    
            var sURL = p_aArguments[0];

            if(!sURL) {

                sURL = "#";

            }

            m_oAnchor.setAttribute("href", sURL);

        };


        /**
        * Event handler for when the "emphasis" configuration property of
        * a MenuItem instance changes.  
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configEmphasis = function(p_sType, p_aArguments, p_oObject) {
    
            var bEmphasis = p_aArguments[0];
    

            if(bEmphasis && this.cfg.getProperty("strongemphasis")) {

                this.cfg.setProperty("strongemphasis", false);

            }


            if(m_oAnchor) {

                var oEM;

                if(bEmphasis) {

                    oEM = document.createElement("em");
                    oEM.appendChild(m_oText);

                    m_oAnchor.appendChild(oEM);

                }
                else {

                    if(
                        m_oAnchor.firstChild && 
                        m_oAnchor.firstChild.nodeType == 1 && 
                        m_oAnchor.firstChild.tagName == "EM"
                    ) {

                        oEM = m_oAnchor.firstChild;

                    }
                    else if(
                        m_oAnchor.childNodes[1] && 
                        m_oAnchor.childNodes[1].nodeType == 1 &&
                        m_oAnchor.childNodes[1].tagName == "EM"
                    ) {

                        oEM = m_oAnchor.childNodes[1];

                    }


                    m_oAnchor.removeChild(oEM);
                    m_oAnchor.appendChild(m_oText);

                }

            }
    
        };


        /**
        * Event handler for when the "strongemphasis" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configStrongEmphasis = function(p_sType, p_aArguments, p_oObject) {
    
            var bStrongEmphasis = p_aArguments[0];
    

            if(bStrongEmphasis && this.cfg.getProperty("emphasis")) {

                this.cfg.setProperty("emphasis", false);

            }

            if(m_oAnchor) {

                var oStrong;

                if(bStrongEmphasis) {

                    oStrong = document.createElement("strong");
                    oStrong.appendChild(m_oText);

                    m_oAnchor.appendChild(oStrong);

                }
                else {

                    if(
                        m_oAnchor.firstChild && 
                        m_oAnchor.firstChild.nodeType == 1 && 
                        m_oAnchor.firstChild.tagName == "STRONG"
                    ) {

                        oStrong = m_oAnchor.firstChild;

                    }
                    else if(
                        m_oAnchor.childNodes[1] && 
                        m_oAnchor.childNodes[1].nodeType == 1 &&
                        m_oAnchor.childNodes[1].tagName == "STRONG"
                    ) {

                        oStrong = m_oAnchor.childNodes[1];

                    }

                    m_oAnchor.removeChild(oStrong);
                    m_oAnchor.appendChild(m_oText);

                }

            }
    
        };


        /**
        * Event handler for when the "disabled" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configDisabled = function(p_sType, p_aArguments, p_oObject) {
    
            var bDisabled = p_aArguments[0];
    

            if(bDisabled) {

                this.cfg.setProperty("selected", false);

                m_oAnchor.removeAttribute("href");
                m_oAnchor.removeAttribute("tabIndex");

                m_oDom.addClass(this.element, "disabled");
                m_oDom.addClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.addClass(m_oHelpTextEM, "disabled");

                }

                if(m_oSubMenuIndicatorIMG) {

                    m_oSubMenuIndicatorIMG.src = 
                        this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;
    
                    m_oSubMenuIndicatorIMG.alt = 
                        this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

                }

            }
            else {

                m_oAnchor.setAttribute(
                    "href", 
                    this.cfg.getProperty("url")
                );

                m_oAnchor.setAttribute("tabIndex", 0);

                m_oDom.removeClass(this.element, "disabled");
                m_oDom.removeClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.removeClass(m_oHelpTextEM, "disabled");

                }

                if(m_oSubMenuIndicatorIMG) {

                    m_oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
    
                    m_oSubMenuIndicatorIMG.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                }

            }    
    
        };


        /**
        * Event handler for when the "selected" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */    
        this.configSelected = function(p_sType, p_aArguments, p_oObject) {
    
            var bSelected = p_aArguments[0];


            if(bSelected) {

                m_oDom.addClass(this.element, "selected");
                m_oDom.addClass(m_oAnchor, "selected");

                if(m_oHelpTextEM) {

                    m_oDom.addClass(m_oHelpTextEM, "selected");

                }

                if(m_oSubMenuIndicatorIMG) {

                    m_oSubMenuIndicatorIMG.src = 
                        this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;

                }

            }
            else {

                m_oDom.removeClass(this.element, "selected");
                m_oDom.removeClass(m_oAnchor, "selected");

                if(m_oHelpTextEM) {

                    m_oDom.removeClass(m_oHelpTextEM, "selected");

                }

                if(m_oSubMenuIndicatorIMG) {

                    m_oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;

                }

            }
    
    
        };


        /**
        * Event handler for when the "submenu" configuration property of
        * a MenuItem instance changes. 
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArguments Collection of arguments sent when the 
        * event was fired.
        * @param {YAHOO.widget.Menu} p_oMenu The Menu instance fired the event.
        */
        this.configSubMenu = function(p_sType, p_aArguments, p_oObject) {

            var oMenu = p_aArguments[0];

            if(oMenu) {

                oMenu.parent = this;

                m_oSubMenu = oMenu;

                m_oDom.addClass(this.element, "hassubmenu");
                m_oDom.addClass(m_oAnchor, "hassubmenu");

                if(!m_oSubMenuIndicatorIMG) { 

                    m_oSubMenuIndicatorIMG = document.createElement("img");

                    this.element.appendChild(m_oSubMenuIndicatorIMG);
            
                    m_oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
        
                    m_oSubMenuIndicatorIMG.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

                    if(this.cfg.getProperty("disabled")) {
    
                        this.cfg.refireEvent("disabled");
    
                    }

                    if(this.cfg.getProperty("selected")) {
    
                        this.cfg.refireEvent("selected");
    
                    }                

                }

                if(!m_oSubMenu.element.parentNode) {

                    this.element.appendChild(m_oSubMenu.element);

                }

            }
            else {

                m_oDom.removeClass(this.element, "hassubmenu");
                m_oDom.removeClass(oAnchor, "hassubmenu");

                if(m_oSubMenuIndicatorIMG) {

                    this.element.removeChild(m_oSubMenuIndicatorIMG);

                }

                if(m_oSubMenu) {

                    this.element.removeChild(m_oSubMenu);                    

                }

            }

        };


        /**
        * Causes a MenuItem instance to receive the focus and fires the
        * focus event.
        */
        this.focus = function() {
    
            if(!this.cfg.getProperty("disabled") && m_oAnchor) {

                m_oAnchor.focus();

                if(
                    m_sBrowser == "opera" && 
                    m_sUserAgent.indexOf("8.5") != -1
                ) {
    
                    var oEvent = document.createEvent("UIEvents");
                    oEvent.initUIEvent("focus", true, false, window, null);
    
                    m_oAnchor.dispatchEvent(oEvent);
        
                }

    
            }
    
        };


        /**
        * Causes a MenuItem instance to lose focus and fires the onblur event.
        */    
        this.blur = function() {
    
            if(!this.cfg.getProperty("disabled") && m_oAnchor) {

                m_oAnchor.blur();

                if(
                    m_sBrowser == "opera" && 
                    m_sUserAgent.indexOf("8.5") != -1
                ) {

                    var oEvent = document.createEvent("UIEvents");
                    oEvent.initUIEvent("blur", true, false, window, null);

                    m_oAnchor.dispatchEvent(oEvent);

                }
    
            }
    
        };


        /**
        * Displays the submenu for a MenuItem instance.
        */
        this.showSubMenu = function() {
    
            if(m_oSubMenu) {

                var aMenuItemPosition = m_oDom.getXY(this.element),
                    aSubMenuPosition = [];


                // Calculate the x position
                
                aSubMenuPosition[0] = 
                    (aMenuItemPosition[0] + this.element.offsetWidth);


                // Calculate the y position
    
                aSubMenuPosition[1] = aMenuItemPosition[1];


                // Position the menu

                m_oSubMenu.cfg.setProperty("xy", aSubMenuPosition);
               
                m_oSubMenu.show();

                m_oSubMenuIndicatorIMG.alt = 
                    this.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
    
            }
    
        };


        /**
        * Displays the submenu for a MenuItem instance.
        */
        this.hideSubMenu = function() {
    
            if(m_oSubMenu) {
    
                m_oSubMenuIndicatorIMG.alt = 
                    this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
                m_oSubMenu.hide();
    
            }
    
        };


        // Begin constructor logic


        // Create the config object

        this.cfg = new YAHOO.util.Config(this);


        // Define the config properties

        this.cfg.addProperty("text", null, this.configText, checkString);

        this.cfg.addProperty("helptext", null, this.configHelpText);
            
        this.cfg.addProperty("url", "#", this.configURL);

        this.cfg.addProperty(
            "emphasis", 
            false, 
            this.configEmphasis, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty(
            "strongemphasis", 
            false, 
            this.configStrongEmphasis, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty(
            "disabled", 
            false, 
            this.configDisabled, 
            this.cfg.checkBoolean
        );
    
        this.cfg.addProperty(
            "selected", 
            false, 
            this.configSelected, 
            this.cfg.checkBoolean
        );

        this.cfg.addProperty("submenu", null, this.configSubMenu);

        this.cfg.addProperty(
            "initsubmenus", 
            ((p_oUserConfig && (!p_oUserConfig.initsubmenus)) ? false : true)
        );


        if(checkString(p_oObject)) {

            createRootNodeStructure();

            this.cfg.setProperty("text", p_oObject);

        }
        else if(checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.text);
                    this.cfg.setProperty("value", p_oObject.value);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setProperty("disabled", true);

                    }

                    if(p_oObject.selected) {

                        this.cfg.setProperty("selected", true);

                    }

                break;

                case "OPTGROUP":

                    createRootNodeStructure();

                    this.cfg.setProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setProperty("disabled", true);

                    }

                    if(this.cfg.getProperty("initsubmenus")) {

                        initSubTree();

                    }

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = null,
                        sURL = null,
                        sText = null;

                    if(
                        p_oObject.firstChild && 
                        p_oObject.firstChild.nodeType == 1 && 
                        p_oObject.firstChild.tagName == "A"
                    ) {

                        oAnchor = p_oObject.firstChild;

                    }
                    else if(
                        p_oObject.childNodes[1] && 
                        p_oObject.childNodes[1].nodeType == 1 &&
                        p_oObject.childNodes[1].tagName == "A"
                    ) {

                        oAnchor = p_oObject.childNodes[1];

                    }


                    // Capture the "text" and/or the "URL"

                    if(oAnchor) {

                        sURL = oAnchor.getAttribute("href");                        

                        if(oAnchor.innerText) {
                
                            sText = oAnchor.innerText;
                
                        }
                        else {
                
                            var oRange = 
                                oAnchor.ownerDocument.createRange();
                
                            oRange.selectNodeContents(oAnchor);
                
                            sText = oRange.toString();             
                
                        }

                    }
                    else {

                        sText = p_oObject.firstChild.nodeValue;

                    }


                    this.srcElement = p_oObject;


                    // Check for the "bring your own HTML" scenario

                    if(
                        oAnchor && 
                        p_oObject.parentNode && // UL check

                        // body node check
                        p_oObject.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.tagName == "DIV" && 
                        m_oDom.hasClass(
                            p_oObject.parentNode.parentNode, 
                            "bd"
                        ) &&

                        // Root node check
                        p_oObject.parentNode.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.parentNode.tagName == "DIV" && 
                        m_oDom.hasClass(
                            p_oObject.parentNode.parentNode.parentNode, 
                            "yuimenu"
                        )
                    ) {

                        this.element = p_oObject;
                        m_oAnchor = oAnchor;
                        

                        /*
                            Remove the "focus" class since a MenuItem cannot 
                            be focused by default
                        */

                        m_oDom.removeClass(this.element, "focus");
                        m_oDom.removeClass(oAnchor, "focus");


                        // Check to see if the MenuItem is disabled

                        var bDisabled = 
                            m_oDom.hasClass(this.element, "disabled");


                        /*
                            Check to see if the MenuItem should be selected 
                            by default
                        */ 

                        var bSelected = 
                            m_oDom.hasClass(this.element, "selected");
    

                        // Check if emphasis has been applied to the MenuItem

                        var oEmphasisNode; // Either EM or STRONG

                        if(
                            oAnchor.firstChild && 
                            oAnchor.firstChild.nodeType == 1
                        ) {
    
                            oEmphasisNode = oAnchor.firstChild;
    
                        }
                        else if(
                            oAnchor.childNodes[1] && 
                            oAnchor.childNodes[1].nodeType == 1
                        ) {

                            oEmphasisNode = oAnchor.childNodes[1];

                        }


                        // Determine if the MenuItem has emphasis

                        var bEmphasis = false,
                            bStrongEmphasis = false;

                        if(oEmphasisNode) {

                            // Set a reference to the text node 

                            m_oText = oEmphasisNode.firstChild;

                            switch(oEmphasisNode.tagName) {
    
                                case "EM":
    
                                    bEmphasis = true;
    
                                break;
    
                                case "STRONG":
    
                                    bStrongEmphasis = true;
    
                                break;
    
                            }

                        }
                        else {

                            // Set a reference to the text node 

                            m_oText = oAnchor.firstChild;

                        }


                        // Check for the "help text" node (EM)

                        var oHelpText = null;

                        if(
                            oAnchor.nextSibling &&
                            oAnchor.nextSibling.nodeType == 1 &&
                            oAnchor.nextSibling.tagName == "EM"
                        ) {

                            oHelpText = oAnchor.nextSibling;

                        }
                        else if(
                            oAnchor.nextSibling &&
                            oAnchor.nextSibling.nextSibling &&
                            oAnchor.nextSibling.nextSibling.nodeType == 1 &&
                            oAnchor.nextSibling.nextSibling.tagName == "EM"
                        ) {

                            oHelpText =  oAnchor.nextSibling.nextSibling

                        }


                        if(oHelpText) {

                            m_oHelpTextEM = oHelpText;

                            /*
                                Propagate the "hashelptext" class to the LI and 
                                anchor if it isn't already applied
                            */
                            
                            m_oDom.addClass(this.element, "hashelptext");
                            m_oDom.addClass(oAnchor, "hashelptext");


                            /* 
                                Remove the "focus" class if it exists because 
                                MenuItems cannot be focused by default
                            */ 

                            m_oDom.removeClass(oHelpText, "focus");

                        }
                        else {

                            /* 
                                Remove the "hashelptext" class if it exists but
                                there is no help text present
                            */

                            m_oDom.removeClass(this.element, "hashelptext");
                            m_oDom.removeClass(oAnchor, "hashelptext");

                        }


                        /*
                            Set these properties silently to sync up the 
                            configuration object without making changes to the 
                            element's DOM
                        */ 

                        this.cfg.setProperty("text", sText, true);
                        this.cfg.setProperty("helptext", oHelpText, true);
                        this.cfg.setProperty("url", sURL, true);
                        this.cfg.setProperty("emphasis", bEmphasis, true);
                        this.cfg.setProperty(
                            "strongemphasis", 
                            bStrongEmphasis, 
                            true
                        );


                        /*
                            The "selected" and "disabled" properties are not set
                            silently to ensure that the associated class names
                            are applied correctly to the DOM elements
                        */ 

                        this.cfg.setProperty("selected", bSelected);
                        this.cfg.setProperty("disabled", bDisabled);
                    
                    }
                    else {

                        createRootNodeStructure();

                        this.cfg.setProperty("text", sText);
                        this.cfg.setProperty("url", sURL);

                    }

                    if(this.cfg.getProperty("initsubmenus")) {

                        initSubTree();

                    }

                break;

            }            

        }


        if(this.element) {

            m_oEventUtil.addListener(
                this.element, 
                "mouseover", 
                onElementMouseOver, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mouseout", 
                onElementMouseOut, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mousedown", 
                onElementMouseDown, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mouseup", 
                onElementMouseUp, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "click", 
                onElementClick, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keydown", 
                onAnchorKeyDown, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keyup", 
                onAnchorKeyUp, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keypress", 
                onAnchorKeyPress, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "focus", 
                onAnchorFocus, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "blur", 
                onAnchorBlur,
                this,
                true
            );            


            // Create custom events
    
            var CustomEvent = YAHOO.util.CustomEvent;
    
            /**
            * Fires when a MenuItem instances's HTMLLIElement is removed from
            * it's parent HTMLUListElement node.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.destroyEvent = new CustomEvent("destroyEvent", this);


            /**
            * Fires when the mouse has entered a MenuItem instance.  Passes
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);


            /**
            * Fires when the mouse has left a MenuItem instance.  Passes back  
            * the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);


            /**
            * Fires when the user clicks the on a MenuItem instance.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);


            /**
            * Fires when the user releases a mouse button while the mouse is 
            * over a MenuItem instance.  Passes back the DOM Event object as
            * an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);


            /**
            * Fires when the user clicks the on a MenuItem instance.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.clickEvent = new CustomEvent("clickEvent", this);


            /**
            * Fires when the user presses an alphanumeric key.  Passes back the 
            * DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyPressEvent = new CustomEvent("keyPressEvent", this);


            /**
            * Fires when the user presses a key.  Passes back the DOM Event 
            * object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyDownEvent = new CustomEvent("keyDownEvent", this);


            /**
            * Fires when the user releases a key.  Passes back the DOM Event 
            * object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.keyUpEvent = new CustomEvent("keyUpEvent", this);


            /**
            * Fires when a MenuItem instance receives focus.  Passes back the 
            * DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.focusEvent = new CustomEvent("focusEvent", this);


            /**
            * Fires when a MenuItem instance loses the input focus.  Passes 
            * back the DOM Event object as an argument.
            * @type {YAHOO.util.CustomEvent}
            * @see YAHOO.util.CustomEvent
            */
            this.blurEvent = new CustomEvent("blurEvent", this);


            if(p_oUserConfig) {
    
                this.cfg.applyConfig(p_oUserConfig);
    
            }        

        }

    },


	/**
	* Removes a MenuItem instance's HTMLLIElement from it's parent
    * HTMLUListElement node.
	*/
    destroy: function() {

        if(this.element) {

            var oParentNode = this.element;

            if(oParentNode) {

                oParentNode.removeChild(this.element);

                this.destroyEvent.fire();

            }

        }

    }

}