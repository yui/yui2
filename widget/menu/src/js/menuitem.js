YAHOO.widget.MenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

    }

}

YAHOO.widget.MenuItem.prototype = {

    // Constants

    SUBMENU_INDICATOR_IMAGE_URL: "../src/img/arrow.gif",
    FOCUSED_SUBMENU_INDICATOR_IMAGE_URL: "../src/img/arrow_focus.gif",
    DISABLED_SUBMENU_INDICATOR_IMAGE_URL: "../src/img/arrow_disabled.gif",
    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    // Public properties

    index: null,
    parent: null,
    element: null,
    srcElement: null,
    value: null,
    _MenuItem: true,

    init: function(p_oObject, p_oUserConfig) {


        // Private member variables

        var m_oAnchor = null,
            m_oText = null,
            m_oHelpTextEM = null,
            m_oSubMenuIndicatorIMG = null,
            m_oSubMenu = null,
            m_oDom = YAHOO.util.Dom,

            m_sUserAgent = navigator.userAgent.toLowerCase(),
    
            m_sBrowser = function() {
    
                var m_sUserAgent = navigator.userAgent.toLowerCase();
                
                if(m_sUserAgent.indexOf('opera') != -1) {
    
                    return 'opera';
    
                }
                else if(m_sUserAgent.indexOf('msie') != -1) {
    
                    return 'ie';
    
                }
                else if(m_sUserAgent.indexOf('safari') != -1) {
    
                    return 'safari';
    
                }
                else if(m_sUserAgent.indexOf('gecko') != -1) {
    
                    return 'gecko';
    
                }
                else {
    
                    return false;
    
                }
    
            }(),

            m_oEventUtil = YAHOO.util.Event,
            me = this;


        // Private methods

        var checkString = function(p_oValue) {

            return (typeof p_oValue == "string");

        };

        var checkDOMNode = function(p_oValue) {

            return (p_oValue && p_oValue.tagName);

        };

        var createRootNodeStructure = function() {

            me.element = document.createElement("li");

            m_oText = document.createTextNode("");

            m_oAnchor = document.createElement("a");
            m_oAnchor.appendChild(m_oText);

            me.element.appendChild(m_oAnchor);            

        };

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
    
                        // Retrieve the first MenuItem instance in 
                        // the next Menu
    
                        oNextMenuItem = oNextMenu.getMenuItem(0);
    
                    }
    
                }
                else {
    
                    // Retrieve the first MenuItem instance in the next
                    // parent Menu
    
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
    
                        // Retrieve the last MenuItem instance in 
                        // the previous Menu
    
                        oPreviousMenuItem = 
                            oPreviousMenu.getMenuItem(
                                (oPreviousMenu.getMenuItems().length - 1)
                            );
    
                    }
    
                }
                else {
    
                    // Retrieve the last MenuItem instance in the 
                    // parent Menu
    
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

        var initSubTree = function() {
    
            var aChildNodes = me.srcElement.childNodes,
                nChildNodes = aChildNodes.length,
                MenuManager = YAHOO.widget.MenuManager,
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
                        (new Menu(MenuManager.createMenuId()))
                    );
    
                    var nOptions = aOptions.length;
        
                    for(var n=0; n<nOptions; n++) {
        
                        m_oSubMenu.addMenuItem((new MenuItem(aOptions[n])));
        
                    }
        
                }
        
    
                if(aULs.length > 0) {
        
                    if(aULs.length > 1) {
    
                        var oMenu = new Menu(MenuManager.createMenuId()),
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
    
        var elementMouseOver = function(p_oEvent, p_oMenuItem) {
    
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
            
                    this.mouseOverEvent.fire(p_oEvent, this);

                }
    
            }
        
        };

        var elementMouseOut = function(p_oEvent, p_oMenuItem) {
    
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

                    this.mouseOutEvent.fire(p_oEvent, this);

                }
                else if(bShowSubMenu) {

                    // don't hide

                    this.cfg.setProperty("selected", true);

                }

            }
    
        };

        var elementMouseDown = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                this.mouseDownEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var elementMouseUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                this.mouseUpEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var elementClick = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
    
                var oTarget = m_oEventUtil.getTarget(p_oEvent, true);
    
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

                var sURL = this.cfg.getProperty("url");

                if(sURL) {

                    document.location = sURL;

                }
    
                this.clickEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var anchorKeyDown = function(p_oEvent, p_oMenuItem) {
    
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
        
                            // Prevent the keydown event from scrolling the 
                            // window up
    
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
        
                            // Prevent the keydown event from scrolling the 
                            // window down
                            m_oEventUtil.preventDefault(p_oEvent);
            
                        }
        
                    break;
        
        
                    // Right arrow
        
                    case 39:
        
                        if(m_oSubMenu) {
                        
                            this.showSubMenu();
    
                            focusSubMenuFirstMenuItem();
    
                            this.cfg.setProperty("selected", true);
        
                            // Prevent the keydown event from scrolling the
                            // window right
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
        
                        var oMenuItem = oParentMenu.parent;
        
                        oParentMenu.hide();
        
                        if(oMenuItem) {
        
                            oMenuItem.cfg.setProperty("selected", true);
                            oMenuItem.focus();
        
                        }
        
                        m_oEventUtil.preventDefault(p_oEvent);
        
                    break;
        
                }
        
                this.keyDownEvent.fire(p_oEvent, this);
    
            }
        
        };
    
        var anchorKeyUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getProperty("disabled")) {
        
                this.keyUpEvent.fire(p_oEvent, this);
    
            }
    
        };
        
        var anchorKeyPress = function(p_oEvent, p_oMenuItem) {
    
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
    
                this.keyPressEvent.fire(p_oEvent, this);
    
            }
    
        };

        var anchorFocus = function(p_oEvent, p_oMenuItem) {
    
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
            
                    var oSubMenu = 
                        oActiveMenuItem.cfg.getProperty("submenu");
            
                    if(oSubMenu && oSubMenu.cfg.getProperty("visible")) {
            
                        oSubMenu.hide();
            
                    }
        
                }
            
                m_oDom.addClass(this.element, "focus");
                m_oDom.addClass(m_oAnchor, "focus");
    
                if(m_oHelpTextEM) {
    
                    m_oDom.addClass(m_oHelpTextEM, "focus");
    
                }
    
                if(m_oSubMenu) {
        
                    m_oSubMenuIndicatorIMG.src = 
                        this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;
        
                }                
    
                this.focusEvent.fire(p_oEvent, this);
    
            }
    
        };

        var anchorBlur = function(p_oEvent, p_oMenuItem) {
    
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
        
                this.blurEvent.fire(p_oEvent, this);
    
            }
    
        };
    
        this.configText = function(p_sType, p_aArguments, p_oObject) {
    
            var sText = p_aArguments[0];


            if(m_oText) {

                m_oText.nodeValue = sText;

            }
    
        };
    
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
    
        this.configURL = function(p_sType, p_aArguments, p_oObject) {
    
            var sURL = p_aArguments[0];

            if(!sURL) {

                sURL = "#";

            }

            m_oAnchor.setAttribute("href", sURL);

        };
    
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

        this.configSubMenu = function(p_sType, p_aArguments, p_oObject) {

            var oMenu = p_aArguments[0];

            if(oMenu) {

                oMenu.parent = this;

                m_oSubMenu = oMenu;

                if(!m_oSubMenu.element.parentNode) {

                    this.element.appendChild(m_oSubMenu.element);

                }

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

                m_oDom.addClass(this.element, "hassubmenu");
                m_oDom.addClass(m_oAnchor, "hassubmenu");

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
            
        this.cfg.addProperty("url", null, this.configURL);

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
                        

                        // Remove the "focus" class since a MenuItem cannot
                        // be focused by default

                        m_oDom.removeClass(this.element, "focus");
                        m_oDom.removeClass(oAnchor, "focus");


                        // Check to see if the MenuItem is disabled

                        var bDisabled = 
                            m_oDom.hasClass(this.element, "disabled");


                        // Check to see if the MenuItem should be selected 
                        // by default

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
                elementMouseOver, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mouseout", 
                elementMouseOut, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mousedown", 
                elementMouseDown, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "mouseup", 
                elementMouseUp, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                this.element, 
                "click", 
                elementClick, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keydown", 
                anchorKeyDown, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keyup", 
                anchorKeyUp, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "keypress", 
                anchorKeyPress, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "focus", 
                anchorFocus, 
                this,
                true
            );
    
            m_oEventUtil.addListener(
                m_oAnchor, 
                "blur", 
                anchorBlur,
                this,
                true
            );            


            // Create custom events
    
            var CustomEvent = YAHOO.util.CustomEvent;
    
            this.destroyEvent = new CustomEvent("destroyEvent", this);
            this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
            this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
            this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
            this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
            this.clickEvent = new CustomEvent("clickEvent", this);
            this.keyPressEvent = new CustomEvent("keyPressEvent", this);
            this.keyDownEvent = new CustomEvent("keyDownEvent", this);
            this.keyUpEvent = new CustomEvent("keyUpEvent", this);
            this.focusEvent = new CustomEvent("focusEvent", this);
            this.blurEvent = new CustomEvent("blurEvent", this);


            if(p_oUserConfig) {
    
                this.cfg.applyConfig(p_oUserConfig);
    
            }        

        }

    },

    destroy: function() {

        if(this.element) {

            var oParentNode = this.element

            if(oParentNode) {

                oParentNode.removeChild(this.element);

                this.destroyEvent.fire(this);

            }

        }

    }

}