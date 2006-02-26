YAHOO.widget.MenuItem = function(p_oObject, p_oUserConfig) {

    if(p_oObject) {

        this.init(p_oObject, p_oUserConfig);

    }

}

YAHOO.widget.MenuItem.prototype = {

    // Constants

    SUBMENU_INDICATOR_IMAGE_URL: 
        "../src/img/arrow.gif",

    FOCUSED_SUBMENU_INDICATOR_IMAGE_URL: 
        "../src/img/arrow_focus.gif",

    DISABLED_SUBMENU_INDICATOR_IMAGE_URL: 
        "../src/img/arrow_disabled.gif",

    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    // Public properties

    index: null,
    parent: null,
    element: null,
    srcElement: null,
    _MenuItem: true,

    init: function(p_oObject, p_oUserConfig) {


        // Private member variables

        var m_oAnchor,
            m_oText,
            m_oHelpTextEM,
            m_oSubMenuIndicatorIMG,
            m_oSubMenu: null,
            m_oDom = YAHOO.util.Dom,
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

        var createSubMenuIndicator = function() {
    
            m_oSubMenuIndicatorIMG = document.createElement("img");
    
            if(me.cfg.getConfigProperty("disabled")) {
    
                m_oSubMenuIndicatorIMG.src = 
                    me.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;
    
                m_oSubMenuIndicatorIMG.alt = 
                    me.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;
    
            }
            else {
    
                m_oSubMenuIndicatorIMG.src = 
                    me.SUBMENU_INDICATOR_IMAGE_URL;
    
                m_oSubMenuIndicatorIMG.alt = 
                    me.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
            }
    
            oDom.addClass(me.element, "hassubmenu");
            oDom.addClass(m_oAnchor, "hassubmenu");      
            
            me.element.appendChild(m_oSubMenuIndicatorIMG);
    
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
    
                if(oNextMenuItem.isDisabled()) {
    
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
    
                if(oPreviousMenuItem.isDisabled()) {
    
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


        // Private DOM event handlers
    
        var elementMouseOver = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                this.focus();
        
                if(m_oSubMenu) {
        
                    this.showSubMenu();
        
                }
        
                this.mouseOverEvent.fire(p_oEvent, this);
    
            }
        
        };

        var elementMouseOut = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                if(m_oSubMenu && m_oSubMenu.isVisible()) {
                    
                    var oRelatedTarget = 
                            YAHOO.util.Event.getRelatedTarget(p_oEvent),
                        oDIV;
            
                    if(oRelatedTarget) {
            
                        switch(oRelatedTarget.tagName) {
            
                            case "A":
            
                                oDIV = 
                                    oRelatedTarget.parentNode.parentNode.parentNode;
            
                            break;
            
                            case "EM":
                            case "STRONG":
            
                                oDIV = 
                                    oRelatedTarget.parentNode.parentNode.parentNode.parentNode;
            
                            break;
            
                            case "LI":
            
                                oDIV = oRelatedTarget.parentNode.parentNode;
            
                            break;
            
                            case "UL":
            
                                oDIV = oRelatedTarget.parentNode;
            
                            break;
            
                            case "DIV":
                
                                oDIV = oRelatedTarget;
            
                            break;
            
                        }
                    
                    }
        
                    if(
                        oDIV && 
                        (
                            oDIV == m_oSubMenu.element ||
                            oDIV.parentNode == m_oSubMenu.element
                        )
                    ) {
                        
                        this.cfg.setConfigProperty("selected", true);

        
                    }
                    else {
        
                        m_oSubMenu.hide();
                        this.blur();
        
                    }
        
                }
                else {
        
                    this.blur();
        
                }
        
                this.mouseOutEvent.fire(p_oEvent, this);
        
            }
    
        };

        var elementMouseDown = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                this.mouseDownEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var elementMouseUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                this.mouseUpEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var elementClick = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                var oTarget = YAHOO.util.Event.getTarget(p_oEvent, true);
    
                if(oTarget == m_oSubMenuIndicatorIMG) {
    
                    if(m_oSubMenu.isVisible()) {
    
                        this.hideSubMenu();
    
                        this.focus();
    
                    }
                    else {
    
                        this.cfg.setConfigProperty("selected", true);
                        
                        this.showSubMenu();
    
                        focusSubMenuFirstMenuItem();
    
                    }
    
                }
    
    
                this.clickEvent.fire(p_oEvent, this);
    
                return true;
    
            }
    
        };

        var anchorKeyDown = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
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
    
                            YAHOO.util.Event.preventDefault(p_oEvent);
            
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
                            YAHOO.util.Event.preventDefault(p_oEvent);
            
                        }
        
                    break;
        
        
                    // Right arrow
        
                    case 39:
        
                        if(m_oSubMenu) {
                        
                            this.showSubMenu();
    
                            focusSubMenuFirstMenuItem();
    
                            this.cfg.setConfigProperty("selected", true);
        
                            // Prevent the keydown event from scrolling the
                            // window right
                            YAHOO.util.Event.preventDefault(p_oEvent);
        
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
        
                            oMenuItem.cfg.setConfigProperty("selected", true);
                            oMenuItem.focus();
        
                        }
        
                        YAHOO.util.Event.preventDefault(p_oEvent);
        
                    break;
        
                }
        
                this.keyDownEvent.fire(p_oEvent, this);
    
            }
        
        };
    
        var anchorKeyUp = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
        
                this.keyUpEvent.fire(p_oEvent, this);
    
            }
    
        };
        
        var anchorKeyPress = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                // Prevent the navigation keys from scrolling the page
    
                switch(p_oEvent.keyCode) {
    
                    case 27: // Esc
                    case 37: // Left
                    case 38: // Up    
                    case 39: // Right
                    case 40: // Down
    
                        YAHOO.util.Event.preventDefault(p_oEvent);
    
                    break;
    
                }
    
                this.keyPressEvent.fire(p_oEvent, this);
    
            }
    
        };

        var anchorFocus = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                var oParent = this.parent.parent,
                    oActiveMenuItem;
                
    
                if(oParent && oParent._Menu) {
        
                    oActiveMenuItem = oParent.getActiveMenuItem();
                
                }
                else {
                
                    oActiveMenuItem = this.parent.getActiveMenuItem();
                
                }
           
            
                if(oActiveMenuItem && oActiveMenuItem != this) {
        
                    if(oActiveMenuItem.cfg.getConfigProperty("selected")) {

                        oActiveMenuItem.cfg.setConfigProperty(
                            "selected", 
                            false
                        );
            
                    }
            
                    var oSubMenu = 
                        oActiveMenuItem.cfg.getConfigProperty("submenu");
            
                    if(oSubMenu && oSubMenu.cfg.getConfigProperty("visible")) {
            
                        oSubMenu.hide();
            
                    }
        
                }
            
                oDom.addClass(this.element, "focus");
                oDom.addClass(m_oAnchor, "focus");
    
                if(m_oHelpTextEM) {
    
                    oDom.addClass(m_oHelpTextEM, "focus");
    
                }
    
                if(m_oSubMenu) {
        
                    m_oSubMenuIndicatorIMG.src = 
                        this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;
        
                }                
    
                this.focusEvent.fire(p_oEvent, this);
    
            }
    
        };

        var anchorBlur = function(p_oEvent, p_oMenuItem) {
    
            if(!this.cfg.getConfigProperty("disabled")) {
    
                oDom.removeClass(this.element, "focus");
                oDom.removeClass(m_oAnchor, "focus");
    
                if(m_oHelpTextEM) {
    
                    oDom.removeClass(m_oHelpTextEM, "focus");
    
                }
    
                if(m_oSubMenu && !this.cfg.getConfigProperty("selected")) {
        
                    m_oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
    
                }
        
                this.blurEvent.fire(p_oEvent, this);
    
            }
    
        };


        // Privileged methods

        this.initDefaultConfig = function() {
    
            this.cfg = new YAHOO.util.Config(this);
    
    
            // Add properties //
    
            this.cfg.addConfigProperty(
                "text", 
                null, 
                this.configText, 
                checkString
            );
    
            this.cfg.addConfigProperty(
                "value", 
                null
            );
    
            this.cfg.addConfigProperty(
                "helptext", 
                null, 
                this.configHelpText 
            );
    
            this.cfg.addConfigProperty(
                "url", 
                null, 
                this.configURL
            );
    
            this.cfg.addConfigProperty(
                "emphasis", 
                false, 
                this.configEmphasis, 
                this.cfg.checkBoolean
            );
    
            this.cfg.addConfigProperty(
                "strongemphasis", 
                false, 
                this.configStrongEmphasis, 
                this.cfg.checkBoolean
            );
    
            this.cfg.addConfigProperty(
                "disabled", 
                false, 
                this.configDisabled, 
                this.cfg.checkBoolean
            );
        
            this.cfg.addConfigProperty(
                "selected", 
                false, 
                this.configSelected, 
                this.cfg.checkBoolean
            );

            this.cfg.addConfigProperty(
                "submenu", 
                null, 
                this.configSubMenu
            );
    
        };
    
        this.configText = function(p_sType, p_aArguments, p_oObject) {
    
            var sText = p_aArguments[0];


            if(m_oText) {

                m_oText.nodeValue = sText;

            }
    
        };
    
        this.configHelpText = function(p_sType, p_aArguments, p_oObject) {
    
            var oHelpText = args[0];


            var removeHelpText = function() {

                m_oDom.removeClass(this.element, "hashelptext");
                m_oDom.removeClass(m_oAnchor, "hashelptext"); 

                this.element.removeChild(m_oHelpTextEM);
                m_oHelpTextEM = null;

            };


            if(checkDOMNode(oHelpText)) {

                if(m_oHelpTextEM) {

                    var oParentNode = m_oHelpTextEM.parentNode;
                    oParentNode.replaceChild(oHelpText, m_oHelpTextEM);

                }
                else {

                    this.element.insertBefore(
                        m_oHelpTextEM, 
                        m_oSubMenuIndicatorIMG
                    );

                }

                m_oDom.addClass(this.element, "hashelptext");
                m_oDom.addClass(m_oAnchor, "hashelptext");

            }
            else if(checkString(oHelpText)) {

                if(oHelpText.length == 0) {

                    removeHelpText();

                }
                else {

                    if(!m_oHelpTextEM) {

                        m_oHelpTextEM = document.createElement("em");

                    }

                    m_oHelpTextEM.innerHTML = oHelpText;

                    m_oDom.addClass(this.element, "hashelptext");
                    m_oDom.addClass(m_oAnchor, "hashelptext");

                }

            }
            else if(!oHelpText && m_oHelpTextEM) {

                removeHelpText();

            }
    
        };
    
        this.configURL = function(p_sType, p_aArguments, p_oObject) {
    
            var sURL = p_aArguments[0];


            if(sURL.length > 0) {

                m_oAnchor.setAttribute("href", sURL);

            }
            else {

                m_oAnchor.removeAttribute("href");
    
            }

        };
    
        this.configEmphasis = function(p_sType, p_aArguments, p_oObject) {
    
            var bEmphasis = p_aArguments[0];
    

            if(bEmphasis && this.cfg.getConfigProperty("strongemphasis")) {

                this.cfg.setConfigProperty("strongemphasis", false);

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
    

            if(bStrongEmphasis && this.cfg.getConfigProperty("emphasis")) {

                this.cfg.setConfigProperty("emphasis", false);

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

                this.cfg.setConfigProperty("selected", false);

                m_oAnchor.removeAttribute("href");
                m_oAnchor.removeAttribute("tabIndex");

                m_oDom.addClass(this.element, "disabled");
                m_oDom.addClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.addClass(m_oHelpTextEM, "disabled");

                }

                m_oSubMenuIndicatorIMG.src = 
                    this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;

                m_oSubMenuIndicatorIMG.alt = 
                    this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

            }
            else {

                m_oAnchor.setAttribute(
                    "href", 
                    this.cfg.getConfigProperty("url")
                );

                m_oAnchor.setAttribute("tabIndex", 0);

                m_oDom.removeClass(this.element, "disabled");
                m_oDom.removeClass(m_oAnchor, "disabled");

                if(m_oHelpTextEM) {

                    m_oDom.removeClass(m_oHelpTextEM, "disabled");

                }

                m_oSubMenuIndicatorIMG.src = 
                    this.SUBMENU_INDICATOR_IMAGE_URL;

                m_oSubMenuIndicatorIMG.alt = 
                    this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

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

                m_oSubMenuIndicatorIMG.src = 
                    this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;

            }
            else {

                m_oDom.removeClass(this.element, "selected");
                m_oDom.removeClass(m_oAnchor, "selected");

                if(m_oHelpTextEM) {

                    oDom.removeClass(m_oHelpTextEM, "selected");

                }

                m_oSubMenuIndicatorIMG.src = 
                    this.SUBMENU_INDICATOR_IMAGE_URL;

            }
    
    
        };

        this.configSubMenu = function(p_sType, p_aArguments, p_oObject) {

            var oMenu = p_aArguments[0];

            m_oSubMenu = oMenu;

            oMenu.parent = this;

            if(oMenu) {

                m_oDom.addClass(this.element, "hassubmenu");
                m_oDom.addClass(oAnchor, "hassubmenu");

                createSubMenuIndicator();

            }
            else {

                m_oDom.removeClass(this.element, "hassubmenu");
                m_oDom.removeClass(oAnchor, "hassubmenu");

                this.element.removeChild(m_oSubMenuIndicatorIMG);

            }

        };

        this.focus = function() {
    
            if(!this.cfg.getConfigProperty("disabled") && m_oAnchor) {
    
                m_oAnchor.focus();
    
            }
    
        };
    
        this.blur = function() {
    
            if(!this.cfg.getConfigProperty("disabled") && m_oAnchor) {
    
                m_oAnchor.blur();
    
            }
    
        };

        this.showSubMenu = function() {
    
            if(m_oSubMenu) {
    
                m_oSubMenu.element.style.visibility = "hidden";
    
                m_oSubMenu.show();
    
                var oParentMenu = this.parent;
                
                if(oParentMenu.parent && oParentMenu.parent._Menu) {
    
                    oParentMenu = oParentMenu.parent;
                
                }
    
                var aMenuItemPos = YAHOO.util.Dom.getXY(this.element),
                    nMenuItemPageX = aMenuItemPos[0],
                    nMenuItemPageY = aMenuItemPos[1],
                    nMenuItemOffsetWidth = this.element.offsetWidth,
                    nParentMenuRightPos = (nMenuItemPageX + nMenuItemOffsetWidth),
                    nSubMenuOffsetWidth = m_oSubMenu.element.offsetWidth,
                    nSubMenuOffsetHeight = m_oSubMenu.element.offsetHeight;
    
                var oSubMenuDIV = m_oSubMenu.element;
    
                oSubMenuDIV.style.left = "";
                oSubMenuDIV.style.right = "";
                oSubMenuDIV.style.top = "";
                oSubMenuDIV.style.bottom = "";
    
                // Set the top position
    
                if(
                    (nMenuItemPageY + nSubMenuOffsetHeight) >
                    YAHOO.util.Dom.getClientHeight()
                ) {
    
                    var nTopPos = (nMenuItemPageY - nSubMenuOffsetHeight);
    
                    if(nTopPos < 0) {
    
                        m_oSubMenu.setTopPos(this.element.offsetTop);
                    
                    }
                    else {
    
                        m_oSubMenu.setBottomPos(
                            (
                                oParentMenu.element.offsetHeight - 
                                (this.element.offsetTop + this.element.offsetHeight) 
                            )
                        );
    
                    }                
               
                }
                else {
    
                    m_oSubMenu.setTopPos(this.element.offsetTop);
                
                }
    
    
                // Set the left position
    
                if(
                    (nParentMenuRightPos + nSubMenuOffsetWidth) > 
                    YAHOO.util.Dom.getClientWidth()
                ) {
                
                    if(nMenuItemPageX > nSubMenuOffsetWidth) {
    
                        m_oSubMenu.setRightPos(nMenuItemOffsetWidth);
    
                    }
                    else {
    
                        m_oSubMenu.setLeftPos(nMenuItemOffsetWidth);
                    
                    }
    
                }
                else {
    
                    m_oSubMenu.setLeftPos(nMenuItemOffsetWidth);
                
                }
    
                m_oSubMenu.element.style.visibility = "visible";
                
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

        this.initDefaultConfig();


        if(checkString(p_oObject)) {

            createRootNodeStructure();

            this.cfg.setConfigProperty("text", p_oObject);

        }
        else if(checkDOMNode(p_oObject)) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    createRootNodeStructure();

                    this.cfg.setConfigProperty("text", p_oObject.text);
                    this.cfg.setConfigProperty("value", p_oObject.value);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setConfigProperty("disabled", true);

                    }

                    if(p_oObject.selected) {

                        this.cfg.setConfigProperty("selected", true);

                    }

                break;

                case "OPTGROUP":

                    createRootNodeStructure();

                    this.cfg.setConfigProperty("text", p_oObject.label);

                    this.srcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this.cfg.setConfigProperty("disabled", true);

                    }

                    this.initSubTree();

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
                        p_oObject.parentNode && 
                        p_oObject.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.tagName == "DIV" && 
                        m_oDom.hasClass(
                            p_oObject.parentNode.parentNode, 
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

                            // Propagate the "hashelptext" class to the LI
                            // and anchor if it isn't already applied
                            
                            m_oDom.addClass(this.element, "hashelptext");
                            m_oDom.addClass(oAnchor, "hashelptext");


                            // Remove the "focus" class if it exists
                            // because MenuItems cannot be focused by default

                            m_oDom.removeClass(oHelpText, "focus");

                        }


                        /*
                            Set these properties silently to sync up the 
                            configuration object without making changes to the 
                            element's DOM
                        */ 

                        this.cfg.setConfigProperty("text", sText, true);
                        this.cfg.setConfigProperty("helptext", oHelpText, true);
                        this.cfg.setConfigProperty("url", sURL, true);
                        this.cfg.setConfigProperty("emphasis", bEmphasis, true);
                        this.cfg.setConfigProperty(
                            "strongemphasis", 
                            bStrongEmphasis, 
                            true
                        );


                        /*
                            The "selected" and "disabled" properties are not set
                            silently to ensure that the associated class names
                            are applied correctly to the DOM elements
                        */ 

                        this.cfg.setConfigProperty("selected", bSelected);
                        this.cfg.setConfigProperty("disabled", bDisabled);
                    
                    }
                    else {

                        createRootNodeStructure();

                        this.cfg.setConfigProperty("text", sText);
                        this.cfg.setConfigProperty("url", sURL);

                    }


                    this.initSubTree();

                break;

            }            

        }


        if(this.element) {

            var oEventUtil = YAHOO.util.Event;
    
            oEventUtil.addListener(
                this.element, 
                "mouseover", 
                elementMouseOver, 
                this,
                true
            );
    
            oEventUtil.addListener(
                this.element, 
                "mouseout", 
                elementMouseOut, 
                this,
                true
            );
    
            oEventUtil.addListener(
                this.element, 
                "mousedown", 
                elementMouseDown, 
                this,
                true
            );
    
            oEventUtil.addListener(
                this.element, 
                "mouseup", 
                elementMouseUp, 
                this,
                true
            );
    
            oEventUtil.addListener(
                this.element, 
                "click", 
                elementClick, 
                this,
                true
            );
    
            oEventUtil.addListener(
                m_oAnchor, 
                "keydown", 
                anchorKeyDown, 
                this,
                true
            );
    
            oEventUtil.addListener(
                m_oAnchor, 
                "keyup", 
                anchorKeyUp, 
                this,
                true
            );
    
            oEventUtil.addListener(
                m_oAnchor, 
                "keypress", 
                anchorKeyPress, 
                this,
                true
            );
    
            oEventUtil.addListener(
                m_oAnchor, 
                "focus", 
                anchorFocus, 
                this,
                true
            );
    
            oEventUtil.addListener(
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

    initSubTree: function() {

        var aChildNodes = this.srcElement.childNodes,
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
            
                            this.cfg.setConfigProperty(
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
    
                this.cfg.setConfigProperty(
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

                    this.cfg.setConfigProperty(
                        "submenu", 
                        oMenu
                    );
                
                }
                else {

                    this.cfg.setConfigProperty(
                        "submenu", 
                        (new Menu(aULs[0]))
                    );
                
                }
    
            }        

        }

    },

    destory: function() {

        if(this.element) {

            var oParentNode = this.element

            if(oParentNode) {

                oParentNode.removeChild(this.element);

                this.destroyEvent.fire(this);

            }

        }

    }

}