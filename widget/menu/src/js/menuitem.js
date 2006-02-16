YAHOO.widget.MenuItem = function (p_oObject) {

    if(p_oObject) {

        this.init(p_oObject);

    }

}

YAHOO.widget.MenuItem.prototype = {

    // Constants

    SUBMENU_INDICATOR_IMAGE_URL: 
        "http://competitor.corp.yahoo.com/menu/src/images/arrow.gif",

    FOCUSED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://competitor.corp.yahoo.com/menu/src/images/arrow_focus.gif",

    DISABLED_SUBMENU_INDICATOR_IMAGE_URL: 
        "http://competitor.corp.yahoo.com/menu/src/images/arrow_disabled.gif",

    COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT: "Collapsed.  Click to expand.",
    EXPANDED_SUBMENU_INDICATOR_ALT_TEXT: "Expanded.  Click to collapse.",
    DISABLED_SUBMENU_INDICATOR_ALT_TEXT: "Disabled.",


    // Private properties

    _nIndex: null,
    _bRendered: false,
    _oParent: null,
    _oSubMenu: null,
    _oLI: null,
    _oAnchor: null,
    _oText: null,
    _oHelpTextEM: null,
    _oSubMenuIndicatorIMG: null,
    _oSrcElement: null,
    _oValue: null,
    _sText: null,
    _sHelpText: null,
    _sURL: null,
    _bEmphasis: false,
    _bStrongEmphasis: false,
    _bDisabled: false,
    _bSelected: false,
    _MenuItem: true,


    // Public property accessor methods

    setIndex: function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            this._nIndex = p_nIndex;
            
        }

    },

    getIndex: function() {

        return (this._nIndex);

    },

    setRendered: function(p_bRendered) {

        if(typeof p_bRendered == "boolean") {

            this._bRendered = p_bRendered;

        }

    },

    isRendered: function() {

        return (this._bRendered);

    },

    setParent: function(p_oMenu) {

        if(p_oMenu && p_oMenu._Menu) {

            this._oParent = p_oMenu;

        }

    },

    getParent: function() {

        return (this._oParent);

    },

    setSubMenu: function(p_oMenu) {

        if(p_oMenu && p_oMenu._Menu) {

            this._oSubMenu = p_oMenu;
            p_oMenu.setParent(this);
            
        }

    },

    getSubMenu: function() {

       return (this._oSubMenu);

    },

    getElement: function() {

        return (this._oLI);

    },

    getSrcElement: function() {

        return (this._oSrcElement);

    },
    
    setValue: function(p_oValue) {

        if(p_oValue) {

            this._oValue = p_oValue;

        }

    },

    getValue: function() {

        return (this._oValue);

    },

    setText: function(p_sText) {

        if(typeof p_sText == "string") {

            this._sText = p_sText;

            if(this._oText) {

                this._oText.nodeValue = this._sText;

            }

        }

    },

    getText: function() {

        return (this._sText);

    },

    setHelpText: function(p_sHelpText) {

        if(typeof p_sHelpText == "string") {

            this._sHelpText = p_sHelpText;

            if(this._oLI) {

                if(this._oHelpTextEM) {
    
                    if(p_sHelpText.length == 0) {
    
                        this._removeClass(this._oLI, "hashelptext");
                        this._removeClass(this._oAnchor, "hashelptext"); 

                        this._oLI.removeChild(this._oHelpTextEM);
                        this._oHelpTextEM = null;
    
                    }
                    else {
    
                        this._oHelpTextEM.innerHTML = this._sText;
    
                    }
    
                }
                else {

                    this._addClass(this._oLI, "hashelptext");
                    this._addClass(this._oAnchor, "hashelptext"); 
                
                    var oHelpText = document.createElement("em");
                    oHelpText.innerHTML = this._sText;

                    this._oLI.insertBefore(
                        oHelpText,
                        this._oSubMenuIndicatorIMG
                    );

                    this._oHelpTextEM = oHelpText;

                }

            }

        }

    },

    getHelpText: function() {

        return (this._sHelpText);

    },

    setURL: function(p_sURL) {

        if(typeof p_sURL == "string") {

            this._sURL = p_sURL;

            if(this._oAnchor) {

                this._oAnchor.setAttribute("href", this._sURL);

            }

        } 

    },

    getURL: function() {

        return (this._sURL);

    },

    setEmphasis: function(p_bEmphasis) {

        if(typeof p_bEmphasis == "boolean") {

            this._bEmphasis = p_bEmphasis;

            if(this._bStrongEmphasis && this._bEmphasis) {

                this.setStrongEmphasis(false);

            }

            if(this._oAnchor) {

                var oEM;

                if(this._bEmphasis) {

                    oEM = document.createElement("em");
                    oEM.appendChild(this._oText);

                    this._oAnchor.appendChild(oEM);

                }
                else {

                    oEM = this._oAnchor.firstChild;

                    if(oEM.nodeType != 1) {
                        
                        oEM = this._oAnchor.childNodes[1];

                    }

                    this._oAnchor.removeChild(oEM);
                    this._oAnchor.appendChild(this._oText);

                }

            }

        }         

    },

    hasEmphasis: function() {

        return (this._bEmphasis);

    },

    setStrongEmphasis: function(p_bStrongEmphasis) {

        if(typeof p_bStrongEmphasis == "boolean") {

            this._bStrongEmphasis = p_bStrongEmphasis;

            if(this._bEmphasis && this._bStrongEmphasis) {

                this.setEmphasis(false);

            }

            if(this._oAnchor) {

                var oStrong;

                if(this._bStrongEmphasis) {

                    oStrong = document.createElement("strong");
                    oStrong.appendChild(this._oText);

                    this._oAnchor.appendChild(oStrong);

                }
                else {

                    oStrong = this._oAnchor.firstChild;

                    if(oStrong.nodeType != 1) {
                        
                        oStrong = this._oAnchor.childNodes[1];

                    }

                    this._oAnchor.removeChild(oStrong);
                    this._oAnchor.appendChild(this._oText);

                }

            }

        }         

    },

    hasStrongEmphasis: function() {

        return (this._bStrongEmphasis);

    },

    setDisabled: function(p_bDisabled) {

        if(typeof p_bDisabled == "boolean") {

            this._bDisabled = p_bDisabled;

            if(this._oLI) {
            
                if(this._bDisabled) {

                    this._oAnchor.removeAttribute("href");
                    this._oAnchor.removeAttribute("tabIndex");
    
                    this._addClass(this._oLI, "disabled");
                    this._addClass(this._oAnchor, "disabled");

                    if(this._oHelpTextEM) {

                        this._addClass(this._oHelpTextEM, "disabled");

                    }

                    this._oSubMenuIndicatorIMG.src = 
                        this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;

                    this._oSubMenuIndicatorIMG.alt = 
                        this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;
    
                }
                else {
    
                    this._oAnchor.setAttribute("href", this._sURL);
                    this._oAnchor.setAttribute("tabIndex", 0);

                    this._removeClass(this._oLI, "disabled");
                    this._removeClass(this._oAnchor, "disabled");

                    if(this._oHelpTextEM) {

                        this._removeClass(this._oHelpTextEM, "disabled");

                    }

                    this._oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;

                    this._oSubMenuIndicatorIMG.alt = 
                        this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
    
                }

            }

        }        

    },

    isDisabled: function() {

        return (this._bDisabled);

    },

    setSelected: function(p_bSelected) {

        if(typeof p_bSelected == "boolean" && !this._bDisabled) {

            this._bSelected = p_bSelected;

            if(this._oLI) {
            
                if(this._bSelected) {
    
                    this._addClass(this._oLI, "selected");
                    this._addClass(this._oAnchor, "selected");

                    if(this._oHelpTextEM) {

                        this._addClass(this._oHelpTextEM, "selected");

                    }

                    this._oSubMenuIndicatorIMG.src = 
                        this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;
    
                }
                else {
    
                    this._removeClass(this._oLI, "selected");
                    this._removeClass(this._oAnchor, "selected");

                    if(this._oHelpTextEM) {

                        this._removeClass(this._oHelpTextEM, "selected");

                    }

                    this._oSubMenuIndicatorIMG.src = 
                        this.SUBMENU_INDICATOR_IMAGE_URL;
    
                }

            }

        }

    },

    isSelected: function() {

        return (this._bSelected);

    },


    // Private methods

    _addClass: function(p_oElement, p_sClassName) {

        if(!this._classContains(p_oElement, p_sClassName)) {

            this._removeBehavior(p_oElement);

            p_oElement.className = 
                (p_oElement.className ? p_oElement.className + " " : "") + 
                p_sClassName;

        }
        
    },
    
    _classContains: function(p_oElement, p_sClassName) {

        return (
            p_oElement.className ? 
            p_oElement.className.indexOf(p_sClassName)+1 : false
        );

    },

    _removeClass: function(p_oElement, p_sClassName) {

        if(this._classContains(p_oElement, p_sClassName)) {

            this._removeBehavior(p_oElement);

            var oRegExp = 
                new RegExp("("+p_sClassName+")|("+p_sClassName+")","g");

            p_oElement.className = p_oElement.className.replace(oRegExp,"");

        }

    },

    _removeBehavior: function(p_oElement) {
    
        if(p_oElement.runtimeStyle) {

            p_oElement.runtimeStyle.behavior = "";
        
        }        
    
    },

    _createSubMenuIndicator: function() {

        var oSubMenuIndicatorImage = document.createElement("img");

        if(this._bDisabled) {

            oSubMenuIndicatorImage.src = 
                this.DISABLED_SUBMENU_INDICATOR_IMAGE_URL;

            oSubMenuIndicatorImage.alt = 
                this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;

        }
        else {

            oSubMenuIndicatorImage.src = 
                this.SUBMENU_INDICATOR_IMAGE_URL;

            oSubMenuIndicatorImage.alt = 
                this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

        }

        this._addClass(this._oLI, "hassubmenu");
        this._addClass(this._oAnchor, "hassubmenu");        
        
        this._oLI.appendChild(oSubMenuIndicatorImage);

        this._oSubMenuIndicatorIMG = oSubMenuIndicatorImage;

    },

    _focusSubMenuFirstMenuItem: function() {

        var oMenuItem;

        if(this._oSubMenu.getSubMenus().length > 0) {

            oMenuItem = this._oSubMenu.getSubMenu(0).getMenuItem(0);

        }
        else {

            oMenuItem = this._oSubMenu.getMenuItem(0);

        }

        if(oMenuItem) {

            oMenuItem.focus();

        }        

    },

    _getNextEnabledMenuItem: function(p_nMenuItemIndex, p_oMenu) {

        var oNextMenuItem;

        if(
            p_nMenuItemIndex < (p_oMenu.getMenuItems().length - 1)
        ) {

            oNextMenuItem = p_oMenu.getMenuItem((p_nMenuItemIndex+1));

        }
        else {

            // Check if this Menu instance is a member of a group

            var oParent = p_oMenu.getParent();

            if(oParent && oParent._Menu) {

                var oNextMenu, nNextMenuIndex;

                if(
                    p_oMenu.getIndex() < 
                    (oParent.getSubMenus().length - 1)
                ) {

                    nNextMenuIndex = p_oMenu.getIndex() + 1;

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

                return this._getNextEnabledMenuItem(
                            oNextMenuItem.getIndex(), 
                            oNextMenuItem.getParent()
                        );

            }
            else {

                return oNextMenuItem;

            }

        }

    },

    _getPreviousEnabledMenuItem: function(p_nMenuItemIndex, p_oMenu) {

        var oPreviousMenuItem;

        if(p_nMenuItemIndex > 0) {

            oPreviousMenuItem = p_oMenu.getMenuItem((p_nMenuItemIndex-1));

        }
        else {

            // Check if this Menu instance is a member of a group

            var oParent = p_oMenu.getParent();

            if(oParent && oParent._Menu) {

                var oPreviousMenu, nPreviousMenuIndex;

                if(p_oMenu.getIndex() > 0) {

                    nPreviousMenuIndex = p_oMenu.getIndex() - 1;

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

                return this._getPreviousEnabledMenuItem(
                            oPreviousMenuItem.getIndex(),
                            oPreviousMenuItem.getParent()
                        );

            }
            else {

                return oPreviousMenuItem;

            }

        }

    },

    _assignDOMEventHandlers: function() {

        var oEventUtil = YAHOO.util.Event;

        oEventUtil.addListener(
            this._oLI, 
            "mouseover", 
            this._elementMouseOver, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oLI, 
            "mouseout", 
            this._elementMouseOut, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oLI, 
            "mousedown", 
            this._elementMouseDown, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oLI, 
            "mouseup", 
            this._elementMouseUp, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oLI, 
            "click", 
            this._elementClick, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oAnchor, 
            "keydown", 
            this._anchorKeyDown, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oAnchor, 
            "keyup", 
            this._anchorKeyUp, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oAnchor, 
            "keypress", 
            this._anchorKeyPress, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oAnchor, 
            "focus", 
            this._anchorFocus, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oAnchor, 
            "blur", 
            this._anchorBlur,
            this,
            true
        );

    },


    // Private DOM event handlers

    _elementMouseOver: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            this.focus();
    
            if(!this._bDisabled && this._oSubMenu) {
    
                this.showSubMenu();
    
            }
    
            this.mouseOverEvent.fire(p_oEvent, this);

        }
    
    },

    _elementMouseOut: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            if(this._oSubMenu && this._oSubMenu.isVisible()) {
                
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
                        oDIV == this._oSubMenu.getElement() ||
                        oDIV.parentNode == this._oSubMenu.getElement()
                    )
                ) {
                    
                    this.setSelected(true);
    
                }
                else {
    
                    this._oSubMenu.hide();
                    this.blur();
    
                }
    
            }
            else {
    
                this.blur();
    
            }
    
            this.mouseOutEvent.fire(p_oEvent, this);
    
        }

    },

    _elementMouseDown: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            this.mouseDownEvent.fire(p_oEvent, this);

            return true;

        }

    },

    _elementMouseUp: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            this.mouseUpEvent.fire(p_oEvent, this);

            return true;

        }

    },

    _elementClick: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            var oTarget = YAHOO.util.Event.getTarget(p_oEvent, true);

            if(oTarget == this._oSubMenuIndicatorIMG) {

                if(this._oSubMenu.isVisible()) {

                    this.hideSubMenu();

                    this.focus();

                }
                else {

                    this.setSelected(true);
                    
                    this.showSubMenu();

                    this._focusSubMenuFirstMenuItem();

                }

            }


            this.clickEvent.fire(p_oEvent, this);

            return true;

        }

    },

    _anchorKeyDown: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            switch(p_oEvent.keyCode) {
    
                // up arrow
    
                case 38:
    
                    var oMenuItem = 
                        this._getPreviousEnabledMenuItem(
                            this._nIndex,
                            this._oParent
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
                        this._getNextEnabledMenuItem(
                            this._nIndex, 
                            this._oParent
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
    
                    if(this._oSubMenu) {
                    
                        this.showSubMenu();

                        this._focusSubMenuFirstMenuItem();

                        this.setSelected(true);
    
                        // Prevent the keydown event from scrolling the
                        // window right
                        YAHOO.util.Event.preventDefault(p_oEvent);
    
                    }
    
                break;
              
                
                // Left arrow and Esc key
    
                case 37:
                case 27:
    
                    var oParentMenu = this._oParent;
    
                    if(
                        oParentMenu.getParent() && 
                        oParentMenu.getParent()._Menu
                    ) {
    
                        oParentMenu = oParentMenu.getParent();
    
                    }
    
                    var oMenuItem = oParentMenu.getParent();
    
                    oParentMenu.hide();
    
                    if(oMenuItem) {
    
                        oMenuItem.setSelected(false);
                        oMenuItem.focus();
    
                    }
    
                    YAHOO.util.Event.preventDefault(p_oEvent);
    
                break;
    
            }
    
            this.keyDownEvent.fire(p_oEvent, this);

        }
    
    },
    
    _anchorKeyUp: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {
    
            this.keyUpEvent.fire(p_oEvent, this);

        }

    },
    
    _anchorKeyPress: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

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

    },

    _anchorFocus: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            var oParent = this._oParent.getParent(),
                oActiveMenuItem;
            

            if(oParent && oParent._Menu) {
    
                oActiveMenuItem = oParent.getActiveMenuItem();
            
            }
            else {
            
                oActiveMenuItem = this._oParent.getActiveMenuItem();
            
            }
       
        
            if(oActiveMenuItem && oActiveMenuItem != this) {
    
                if(oActiveMenuItem.isSelected()) {
        
                    oActiveMenuItem.setSelected(false);
        
                }
        
                var oSubMenu = oActiveMenuItem.getSubMenu();
        
                if(oSubMenu && oSubMenu.isVisible()) {
        
                    oSubMenu.hide();
        
                }
    
            }
        
            this._addClass(this._oLI, "focus");
            this._addClass(this._oAnchor, "focus");

            if(this._oHelpTextEM) {

                this._addClass(this._oHelpTextEM, "focus");

            }

            if(this._oSubMenu) {
    
                this._oSubMenuIndicatorIMG.src = 
                    this.FOCUSED_SUBMENU_INDICATOR_IMAGE_URL;
    
            }                

            this.focusEvent.fire(p_oEvent, this);

        }

    },

    _anchorBlur: function(p_oEvent, p_oMenuItem) {

        if(!this._bDisabled) {

            this._removeClass(this._oLI, "focus");
            this._removeClass(this._oAnchor, "focus");

            if(this._oHelpTextEM) {

                this._removeClass(this._oHelpTextEM, "focus");

            }

            if(this._oSubMenu && !this.isSelected()) {
    
                this._oSubMenuIndicatorIMG.src = 
                    this.SUBMENU_INDICATOR_IMAGE_URL;

            }
    
            this.blurEvent.fire(p_oEvent, this);

        }

    },


    // Public methods

    init: function(p_oObject) {

        if(p_oObject.tagName) {

            switch(p_oObject.tagName) {

                case "OPTION":

                    this._sText = p_oObject.text;
                    this._oValue = p_oObject.value;
                    this._oSrcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this._bDisabled = true;

                    }

                    if(p_oObject.selected) {

                        this._bSelected = true;

                    }

                break;

                case "OPTGROUP":

                    this._sText = p_oObject.label;
                    this._oSrcElement = p_oObject;

                    if(p_oObject.disabled || p_oObject.parentNode.disabled) {

                        this._bDisabled = true;

                    }

                    this.initSubTree();

                break;

                case "LI":

                    // Get the anchor node (if it exists)

                    var oAnchor = null;

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


                    // Set the "text" and/or the "URL" properties

                    if(oAnchor) {

                        this._sURL = oAnchor.getAttribute("href");                        

                        if(oAnchor.innerText) {
                
                            this._sText = oAnchor.innerText;
                
                        }
                        else {
                
                            var oRange = 
                                oAnchor.ownerDocument.createRange();
                
                            oRange.selectNodeContents(oAnchor);
                
                            this._sText = oRange.toString();             
                
                        }

                    }
                    else {

                        this._sText = p_oObject.firstChild.nodeValue;

                    }


                    this._oSrcElement = p_oObject;


                    // Check for the "bring your own HTML" scenario

                    if(
                        oAnchor && 
                        p_oObject.parentNode && 
                        p_oObject.parentNode.parentNode && 
                        p_oObject.parentNode.parentNode.tagName == "DIV" && 
                        this._classContains(
                            p_oObject.parentNode.parentNode, 
                            "yuimenu"
                        )
                    ) {

                        // Remove the "focus" class since a MenuItem cannot
                        // be focused by default

                        this._removeClass(p_oObject, "focus");
                        this._removeClass(oAnchor, "focus");


                        // Check to see if the MenuItem is disabled

                        if(this._classContains(p_oObject, "disabled")) {
    
                            this._bDisabled = true;

                            oAnchor.removeAttribute("href");
                            oAnchor.removeAttribute("tabIndex");

                            // Propagate the "disabled" class to the anchor
                            // if it isn't already applied

                            this._addClass(oAnchor, "disabled");


                            // Remove the "selected" class since a disabled 
                            // MenuItem cannot be selected

                            this._removeClass(p_oObject, "selected");
                            this._removeClass(oAnchor, "selected");
        
                        }
    
    
                        if(this._classContains(p_oObject, "selected")) {
    
                            this._bSelected = true;


                            // Propagate the "selected" class to the anchor
                            // if it isn't already applied
    
                            this._addClass(oAnchor, "selected");

                        }



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

                        if(oEmphasisNode) {

                            // Set a reference to the text node for the 
                            // "getText" and "setText" methods

                            this._oText = oEmphasisNode.firstChild;

                            switch(oEmphasisNode.tagName) {
    
                                case "EM":
    
                                    this._bEmphasis = true;
    
                                break;
    
                                case "STRONG":
    
                                    this._bStrongEmphasis = true;
    
                                break;
    
                            }

                        }
                        else {


                            // Set a reference to the text node for the 
                            // "getText" and "setText" methods

                            this._oText = oAnchor.firstChild;

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

                            // Propagate the "hashelptext" class to the LI
                            // and anchor if it isn't already applied
                            
                            this._addClass(p_oObject, "hashelptext");
                            this._addClass(oAnchor, "hashelptext");

                            this._sHelpText = oHelpText.innerHTML;
                            this._oHelpTextEM = oHelpText;

                            if(this._bDisabled) {

                                // Propagate the "disabled" class to the EM
                                // if it isn't already applied

                                this._addClass(oHelpText, "disabled");


                                // Remove the "selected" class if it exists
                                // because disabled MenuItems cannot be selected

                                this._removeClass(oHelpText, "selected");

                            }
                            else if (this._bSelected){

                                // Propagate the "selected" class to the EM
                                // if it isn't already applied

                                this._addClass(oHelpText, "selected");

                            }


                            // Remove the "focus" class if it exists
                            // because MenuItems cannot be focused by default

                            this._removeClass(oHelpText, "focus");

                        }

                        this._oAnchor = oAnchor;
                        this._oLI = p_oObject;


                        // Add the sub Menu arrow indicator if a sub Menu exists

                        var aULs = p_oObject.getElementsByTagName("ul");

                        if(aULs.length > 0) {

                            this._createSubMenuIndicator();

                        }

                        this._assignDOMEventHandlers();
                    
                    }

                    this.initSubTree();

                break;

            }

        }
        else if(typeof p_oObject == "string") {

            this._sText = p_oObject;

        }
        else if(p_oObject.text) {

            this._sText = p_oObject.text;

            if(p_oObject.helptext) {

                this.setHelpText(p_oObject.helptext);

            }

            if(p_oObject.value) {

                this._oValue = p_oObject.value;

            }

            if(p_oObject.url) {

                this._sURL = p_oObject.url;

            }

            if(p_oObject.emphasis) {
    
                this.setEmphasis(p_oObject.emphasis);
    
            }

            if(p_oObject.strongemphasis) {

                this.setStrongEmphasis(p_oObject.strongemphasis);

            }

            if(p_oObject.disabled) {

                this.setDisabled(p_oObject.disabled);

            }
            else if(p_oObject.selected) {

                this.setSelected(p_oObject.selected);

            }

        }


        // Create custom events

        var CustomEvent = YAHOO.util.CustomEvent;

        this.renderEvent = new CustomEvent("renderEvent", this);
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


        // Subscribe to custom events

        this.renderEvent.subscribe(this.onRender, this);
        this.destroyEvent.subscribe(this.onDestroy, this);
        this.mouseOverEvent.subscribe(this.onMouseOver, this);
        this.mouseOutEvent.subscribe(this.onMouseOut, this);
        this.mouseDownEvent.subscribe(this.onMouseDown, this);
        this.mouseUpEvent.subscribe(this.onMouseUp, this);
        this.clickEvent.subscribe(this.onClick, this);
        this.keyPressEvent.subscribe(this.onKeyPress, this);
        this.keyDownEvent.subscribe(this.onKeyDown, this);
        this.keyUpEvent.subscribe(this.onKeyUp, this);
        this.focusEvent.subscribe(this.onFocus, this);
        this.blurEvent.subscribe(this.onBlur, this);

    },

    initSubTree: function() {

        var aChildNodes = this._oSrcElement.childNodes,
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
            
                            this.setSubMenu((new Menu(oNode)));
            
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
    
                this.setSubMenu((new Menu(MenuManager.createMenuId())));
    
                var nOptions = aOptions.length;
    
                for(var n=0; n<nOptions; n++) {
    
                    this._oSubMenu.addMenuItem((new MenuItem(aOptions[n])));
    
                }
    
            }
    

            if(aULs.length > 0) {
    
                if(aULs.length > 1) {

                    var oMenu = new Menu(MenuManager.createMenuId()),
                        nULs = aULs.length;
        
                    for(var n=0; n<nULs; n++) {
        
                        oMenu.addSubMenu((new Menu(aULs[n])));
        
                    }
        
                    this.setSubMenu(oMenu);
                
                }
                else {

                    this.setSubMenu((new Menu(aULs[0])));
                
                }
    
            }        

        }

    },

    render: function() {

        if(!this._bRendered && this._sText && this._sText.length > 0) {

            var oLI = document.createElement("li"),
                oAnchor = document.createElement("a"),
                oTextNode = document.createTextNode(this._sText);


            if(this._nIndex == 0) {

                this._addClass(oLI, "first");

            }
    

            if(this._nIndex == (this._oParent.getMenuItems().length-1)) {

                this._addClass(oLI, "last");

            }


            if(this._bDisabled) {
    
                this._addClass(oLI, "disabled");
                this._addClass(oAnchor, "disabled");
    
            }
            else {

                if(this._sURL) {

                    oAnchor.setAttribute("href", this._sURL);
    
                }
    
                oAnchor.setAttribute("tabIndex", 0);


                if(this._bSelected) {
        
                    this._addClass(oLI, "selected");
                    this._addClass(oAnchor, "selected");
        
                }

            }


            if(this._bEmphasis) {
    
                var oEM = document.createElement("em");
                
                oEM.appendChild(oTextNode);
                oAnchor.appendChild(oEM);
    
            }
            else if(this._bStrongEmphasis) {

                var oStrong = document.createElement("strong");
                
                oStrong.appendChild(oTextNode);
                oAnchor.appendChild(oStrong);

            }
            else {
    
                oAnchor.appendChild(oTextNode);
    
            }
    

            oLI.appendChild(oAnchor);


            if(this._sHelpText && this._sHelpText.length > 0) {

                var oHelpText = document.createElement("em");
                oHelpText.innerHTML = this._sHelpText;


                if(this._bDisabled) {

                    this._addClass(oHelpText, "disabled");

                }
                else if(this._bSelected) {

                    this._addClass(oHelpText, "selected");

                }

                this._addClass(oLI, "hashelptext");
                this._addClass(oAnchor, "hashelptext");

                oLI.appendChild(oHelpText);

                this._oHelpTextEM = oHelpText;

            }


            this._oParent.getListNode().appendChild(oLI);


            this._oLI = oLI;
            this._oAnchor = oAnchor;
            this._oText = oTextNode;


            if(this._oSubMenu) {

                this._addClass(oLI, "hassubmenu");
                this._addClass(oAnchor, "hassubmenu");

                this._createSubMenuIndicator();
                this._oSubMenu.render();
    
            }


            this._assignDOMEventHandlers();


            this._bRendered = true;


            this.renderEvent.fire(this);

        }

    },

    destroy: function() {

        if(this._bRendered) {

            var oParentNode = this._oLI.parentNode;
    
            if(oParentNode) {
   
                oParentNode.removeChild(this._oLI);
    
                this.destroyEvent.fire(this);

            }

        }

    },

    focus: function() {

        if(!this._bDisabled && this._oAnchor) {

            this._oAnchor.focus();

        }

    },

    blur: function() {

        if(!this._bDisabled && this._oAnchor) {

            this._oAnchor.blur();

        }

    },

    showSubMenu: function() {

        if(this._oSubMenu) {

            this._oSubMenu.getElement().style.visibility = "hidden";

            this._oSubMenu.show();

            var oParentMenu = this.getParent();
            
            if(oParentMenu.getParent() && oParentMenu.getParent()._Menu) {

                oParentMenu = oParentMenu.getParent();
            
            }

            var aMenuItemPos = YAHOO.util.Dom.getXY(this._oLI),
                nMenuItemPageX = aMenuItemPos[0],
                nMenuItemPageY = aMenuItemPos[1],
                nMenuItemOffsetWidth = this._oLI.offsetWidth,
                nParentMenuRightPos = (nMenuItemPageX + nMenuItemOffsetWidth),
                nSubMenuOffsetWidth = this._oSubMenu.getElement().offsetWidth,
                nSubMenuOffsetHeight = this._oSubMenu.getElement().offsetHeight;

            var oSubMenuDIV = this._oSubMenu.getElement();

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

                    this._oSubMenu.setTopPos(this._oLI.offsetTop);
                
                }
                else {

                    this._oSubMenu.setBottomPos(
                        (
                            oParentMenu.getElement().offsetHeight - 
                            (this._oLI.offsetTop + this._oLI.offsetHeight) 
                        )
                    );

                }                
           
            }
            else {

                this._oSubMenu.setTopPos(this._oLI.offsetTop);
            
            }


            // Set the left position

            if(
                (nParentMenuRightPos + nSubMenuOffsetWidth) > 
                YAHOO.util.Dom.getClientWidth()
            ) {
            
                if(nMenuItemPageX > nSubMenuOffsetWidth) {

                    this._oSubMenu.setRightPos(nMenuItemOffsetWidth);

                }
                else {

                    this._oSubMenu.setLeftPos(nMenuItemOffsetWidth);
                
                }

            }
            else {

                this._oSubMenu.setLeftPos(nMenuItemOffsetWidth);
            
            }

            this._oSubMenu.getElement().style.visibility = "visible";
            
            this._oSubMenuIndicatorIMG.alt = 
                this.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;

        }

    },

    hideSubMenu: function() {

        if(this._oSubMenu) {

            this._oSubMenuIndicatorIMG.alt = 
                this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;

            this._oSubMenu.hide();

        }

    },


    // Event handlers

    onRender: function(p_sType, p_aArguments, p_oMenuItem) {

    },

    onDestroy: function(p_sType, p_aArguments, p_oMenuItem) {

    },

    onMouseOver: function(p_sType, p_aArguments, p_oMenuItem) {

    },
    
    onMouseOut: function(p_sType, p_aArguments, p_oMenuItem) {

    },
    
    onMouseDown: function(p_sType, p_aArguments, p_oMenuItem) {

    },
    
    onMouseUp: function(p_sType, p_aArguments, p_oMenuItem) {
    
    },
    
    onClick: function(p_sType, p_aArguments, p_oMenuItem) {

    },
    
    onKeyDown: function(p_sType, p_aArguments, p_oMenuItem) {
    
    },
    
    onKeyUp: function(p_sType, p_aArguments, p_oMenuItem) {
    
    },
    
    onKeyPress: function(p_sType, p_aArguments, p_oMenuItem) {

    },

    onFocus: function(p_sType, p_aArguments, p_oMenuItem) {

    },
    
    onBlur: function(p_sType, p_aArguments, p_oMenuItem) {

    }

}