YAHOO.widget.Menu = function(p_oObject) {

    if(p_oObject) {

        this.init(p_oObject);

    }

}

YAHOO.widget.Menu.prototype = {

    // Private properties

    _sId: null,
    _nIndex: null,
    _bRendered : false,
    _sCSSClassName: "yuimenu",
    _oParent: null,
    _oActiveMenuItem: null,
    _oDIV: null,
    _oUL: null,
    _oSrcElement: null,
    _oPlaceholder: null,
    _bVisible: false,
    _aMenuItems: null,
    _aSubMenus: null,
    _Menu: true,
    

    // Public property accessor methods

    getId: function() {

        return (this._sId);

    },

    setIndex: function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            var nIndex = this._nIndex;

            this._nIndex = p_nIndex;

            if(nIndex != p_nIndex) {

                this.propertyChangeEvent.fire("index", p_nIndex);

            }
            
        }

    },

    getIndex: function() {

        return (this._nIndex);

    },

    setRendered: function(p_bRendered) {

        if(typeof p_bRendered == "boolean") {

            var bRendered = this._bRendered;

            this._bRendered = p_bRendered;

            if(bRendered != p_bRendered) {

                this.propertyChangeEvent.fire("rendered", p_bRendered);

            }

        }

    },

    isRendered: function() {

        return (this._bRendered);

    },

    setCSSClassName: function(p_sCSSClassName) {

        if(typeof p_sCSSClassName == "string") {

            var sCSSClassName = this._sCSSClassName;

            this._sCSSClassName = p_sCSSClassName;

            if(sCSSClassName != p_sCSSClassName) {

                this.propertyChangeEvent.fire("cssclassname", p_sCSSClassName);

            }

        }

    },

    getCSSClassName: function() {

        return (this._sCSSClassName);

    },

    setParent: function(p_oParent) {

        if(p_oParent && (p_oParent._Menu || p_oParent._MenuItem)) {

            var oParent = this._oParent;

            this._oParent = p_oParent;

            if(oParent != p_oParent) {

                this.propertyChangeEvent.fire("parent", p_oParent);

            }

        }

    },

    getParent: function() {

        return (this._oParent);

    },
    
    setActiveMenuItem: function(p_oMenuItem) {

        if(
            p_oMenuItem && 
            p_oMenuItem._MenuItem && 
            p_oMenuItem != this._oActiveMenuItem 
        ) {

            var oActiveMenuItem = this._oActiveMenuItem;

            this._oActiveMenuItem = p_oMenuItem;

            if(oActiveMenuItem != p_oMenuItem) {

                this.propertyChangeEvent.fire("activemenuitem", p_oMenuItem);

            }

        }

    },    
    
    getActiveMenuItem: function() {

        return (this._oActiveMenuItem);

    },

    getElement: function() {

        return (this._oDIV);

    },

    getListNode: function() {

        return (this._oUL);

    },

    getSrcElement: function() {

        return (this._oSrcElement);

    },

    setPlaceholder: function(p_oObject) {

        var oElement;

        if(typeof p_oObject == "string") {

            oElement = document.getElementById(p_oObject);

        }
        else if(p_oObject.tagName) {

            oElement = p_oObject;

        }

        if(oElement) {

            this._oPlaceholder = oElement;

        }

    },

    getPlaceholder: function() {

        return (this._oPlaceholder);

    },

    isVisible: function() {

        return (this._bVisible);

    },

    isActive: function() {

        return (YAHOO.widget.MenuManager.getActiveMenu() == this);

    },


    // Private Methods

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

    _addArrayItem: function(p_oArray, p_oItem, p_nIndex) {

        if(typeof p_nIndex == "number") {

            p_oArray.splice(p_nIndex, 0, p_oItem);

            p_oItem.setParent(this);


            // Update the index property of each member        
    
            var i = p_oArray.length-1;
    
            do {
                p_oArray[i].setIndex(i);
            }
            while(i--);

        }
        else {

            var nIndex = p_oArray.length;

            p_oArray[nIndex] = p_oItem;

            p_oItem.setIndex(nIndex);

            p_oItem.setParent(this);

        }

    },

    _removeArrayItemByIndex: function(p_oArray, p_nIndex) {

        var aArray = p_oArray.splice(p_nIndex, 1);


        // Update the index property of each member        

        var i = p_oArray.length-1;

        do {
            p_oArray[i].setIndex(i);
        }
        while(i--);


        // Return a reference to the item that was removed

        return (aArray[0]);

    },
    
    _removeArrayItemByValue: function(p_oArray, p_oItem) {

        var nIndex = -1;        

        var i = p_oArray.length-1;

        do {

            if(p_oArray[i] == p_oItem) {

                nIndex = i;
                break;    

            }

        }
        while(i--);

        if(nIndex > -1) {

            return (this._removeArrayItemByIndex(p_oArray, nIndex));

        }      

    },
    
    _clearParentMenuWidth: function(p_oMenuItem) {

        var oParentMenu = p_oMenuItem.getParent(),
            oParentMenuDIV;
        
        if(oParentMenu.getParent() && oParentMenu.getParent()._Menu) { 
        
            oParentMenu = oParentMenu.getParent();
            
        }

        oParentMenuDIV = oParentMenu.getElement();

        oParentMenu.pixelWidth = 
            YAHOO.util.Dom.getStyle(oParentMenuDIV, "width");

        oParentMenuDIV.style.width = "100%";

        if(oParentMenu.getParent()) {
        
            return this._clearParentMenuWidth(oParentMenu.getParent());
        
        }

    },
    
    _setParentMenuWidth: function(p_oMenuItem) {

        var oParentMenu = p_oMenuItem.getParent();

        if(oParentMenu.getParent() && oParentMenu.getParent()._Menu) { 
        
            oParentMenu = oParentMenu.getParent();
            
        }

        oParentMenu.getElement().style.width = oParentMenu.pixelWidth;
            
        if(oParentMenu.getParent()) {
        
            return this._setParentMenuWidth(oParentMenu.getParent());
        
        }
    
    },

    _assignDOMEventHandlers: function() {

        var oEventUtil = YAHOO.util.Event;

        oEventUtil.addListener(
            this._oDIV, 
            "mouseover", 
            this._elementMouseOver, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oDIV, 
            "mouseout", 
            this._elementMouseOut, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oDIV, 
            "mousedown", 
            this._elementMouseDown, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oDIV, 
            "mouseup", 
            this._elementMouseUp, 
            this,
            true
        );

        oEventUtil.addListener(
            this._oDIV, 
            "click", 
            this._elementClick, 
            this,
            true
        );

    },    
    

    // Private DOM event handlers

    _elementMouseOver: function(p_oEvent, p_oMenu) {

        if(!this._oParent || this._oParent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }
        
        this.mouseOverEvent.fire(p_oEvent, this);
    
    },

    _elementMouseOut: function(p_oEvent, p_oMenu) {

        if(!this._oParent || this._oParent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseOutEvent.fire(p_oEvent, this);
    
    },

    _elementMouseDown: function(p_oEvent, p_oMenu) {

        if(!this._oParent || this._oParent._MenuItem) {

            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseDownEvent.fire(p_oEvent, this);

        return true;

    },

    _elementMouseUp: function(p_oEvent, p_oMenu) {

        if(!this._oParent || this._oParent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseUpEvent.fire(p_oEvent, this);

        return true;

    },

    _elementClick: function(p_oEvent, p_oMenu) {

        var oTarget = YAHOO.util.Event.getTarget(p_oEvent, true);

        if(
            (!this._oParent || this._oParent._MenuItem) && 
            oTarget.tagName != "A"
        ) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.clickEvent.fire(p_oEvent, this);

        return true;
    
    },


    // Private CustomEvent event handlers

    _menuItemFocus: function(p_sType, p_aArguments, p_oMenu) {
    
        if(this._oParent && this._oParent._Menu) {

            this._oParent.setActiveMenuItem(p_aArguments[1]);
            YAHOO.widget.MenuManager.setActiveMenu(this._oParent);
        
        }
        else {

            this.setActiveMenuItem(p_aArguments[1]);
            YAHOO.widget.MenuManager.setActiveMenu(this);

        }    

    },


    // Public Methods

    init: function(p_oObject) {

        var oElement,
            MenuManager = YAHOO.widget.MenuManager;

        if(typeof p_oObject == "string") {

            this._sId = p_oObject;

            oElement = document.getElementById(this._sId);

        }
        else if(p_oObject.tagName) {

            oElement = p_oObject;

        }


        if(oElement) {

            switch(oElement.tagName) {

                case "DIV":

                    if(this._classContains(oElement, "yuimenu")) {

                        if(oElement.id) {
    
                            this._sId = oElement.id;
    
                        }
                        else {
    
                            this._sId = MenuManager.createMenuId();
                            oElement.id = this._sId;
    
                        }
    
                        this._oDIV = oElement;
                        this._oSrcElement = oElement;
                        
                        var oUL = this._oDIV.firstChild;
    
                        if(oUL) { 

                            // The first child node might be a text node

                            if(oUL.nodeType != 1) {
                                
                                oUL = this._oDIV.childNodes[1];
            
                            }
        
                            if(oUL.tagName == "UL") {

                                this._oUL = oUL;
                            
                            }
    
                        }
    
                        this._assignDOMEventHandlers();

                    }

                break;


                case "UL":
                case "SELECT":
                case "OPTGROUP":

                    this._sId = MenuManager.createMenuId();
                    this._oSrcElement = oElement;

                break;

            }

        }


        if(this._sId) {

            this._aMenuItems = [];
            this._aSubMenus = [];

            if(this._oSrcElement) {

                this.initSubTree();

            }


            // Create custom events

            var CustomEvent = YAHOO.util.CustomEvent;

            this.renderEvent = new CustomEvent("renderEvent", this);
            this.destroyEvent = new CustomEvent("destroyEvent", this);
            this.beforeShowEvent = new CustomEvent("beforeShowEvent", this);
            this.showEvent = new CustomEvent("showEvent", this);
            this.beforeHideEvent = new CustomEvent("beforeHideEvent", this);
            this.hideEvent = new CustomEvent("hideEvent", this);
            this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
            this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
            this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
            this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
            this.clickEvent = new CustomEvent("clickEvent", this);
            this.propertyChangeEvent = 
                    new CustomEvent("propertyChangeEvent", this);


            // Subscribe to custom events

            this.renderEvent.subscribe(this.onRender, this);
            this.destroyEvent.subscribe(this.onDestroy, this);
            this.beforeShowEvent.subscribe(this.onBeforeShow, this);
            this.showEvent.subscribe(this.onShow, this);
            this.beforeHideEvent.subscribe(this.onBeforeHide, this);
            this.hideEvent.subscribe(this.onHide, this);
            this.mouseOverEvent.subscribe(this.onMouseOver, this);
            this.mouseOutEvent.subscribe(this.onMouseOut, this);
            this.mouseDownEvent.subscribe(this.onMouseDown, this);
            this.mouseUpEvent.subscribe(this.onMouseUp, this);
            this.clickEvent.subscribe(this.onClick, this);
            this.propertyChangeEvent.subscribe(this.onPropertyChange, this);

            MenuManager.addMenu(this);

        }

    },

    initSubTree: function() {

        var oNode,
            Menu = YAHOO.widget.Menu,
            MenuItem = YAHOO.widget.MenuItem;

        for (var i=0; (oNode = this._oSrcElement.childNodes[i]); i++) {
        
            switch(oNode.tagName) {
    
                case "LI":
                case "OPTGROUP":
                case "OPTION":
                
                    this.addMenuItem((new MenuItem(oNode)));
    
                break;
    
                case "UL":

                    if(
                        oNode.parentNode && 
                        oNode.parentNode.tagName == "DIV" && 
                        this._classContains(oNode.parentNode, "yuimenu")
                    ) {

                        var oLI;

                        for (var n=0; (oLI = oNode.childNodes[n]); n++) {

                            if(oLI.nodeType == 1) {

                                this.addMenuItem((new MenuItem(oLI)));

                            }

                        }

                    }
                    else {

                        this.addSubMenu((new Menu(oNode)));

                    }

                break;

                case "DIV":
    
                    this.addSubMenu((new Menu(oNode)));
    
                break;
    
            }
        
        }

    },

    renderMenuElement: function() {

        var oDIV = document.createElement("div");
        oDIV.id = this._sId;

        this._addClass(oDIV, this._sCSSClassName);

        if(
            this._oParent && 
            this._oParent._Menu && 
            (this._oParent.getSubMenus().length >= 2)
        ) {

            if(this._nIndex == 0) {

                this._addClass(oDIV, "first");

            }

            if(this._nIndex == (this._oParent.getSubMenus().length-1)) {

                this._addClass(oDIV, "last");

            }

        }
        
        if(this._aMenuItems.length > 0) {
        
            var oUL = document.createElement("ul");
            oDIV.appendChild(oUL);
        
        }

        return oDIV;

    },

    renderMenuItems: function() {

        if(this._aMenuItems.length > 0) {            
    
            var nMenuItems = this._aMenuItems.length;
    
            for(var i=0; i<nMenuItems; i++) {
    
                this._aMenuItems[i].render();
    
            }
    
        }

    },

    renderSubMenus: function() {

        if(this._aSubMenus.length > 0) {
    
            var nSubMenus = this._aSubMenus.length;
    
            for(var i=0; i<nSubMenus; i++) {
    
                this._aSubMenus[i].render();
    
            }
    
        }

    },

    render: function(p_bHideSourceElement) {

        if(
            (!this._bRendered) && 
            (this._oParent || this._oPlaceholder || this._oSrcElement)
         ) {

            // Create the root node of the Menu if it doesn't already exist

            if((!this._oDIV) || (!this._bRendered && this._oDIV)) {
                
                this._oDIV = this.renderMenuElement();

                this._assignDOMEventHandlers();

                var oUL = this._oDIV.firstChild;

                if(oUL && oUL.nodeType != 1) {
                    
                    oUL = this._oDIV.childNodes[1];

                }

                this._oUL = oUL;

            }

            if(this._oParent) {

                this._oParent.getElement().appendChild(this._oDIV);

            }
            else if(this._oPlaceholder) {

                this._oPlaceholder.appendChild(this._oDIV);

                if(this._oSrcElement) {

                    if(p_bHideSourceElement) {

                        this._oSrcElement.style.display = "none";

                    }
                    else {

                        var oParentNode = this._oSrcElement.parentNode;
                        oParentNode.removeChild(this._oSrcElement);                    

                    }

                }

            }
            else if(this._oSrcElement) {

                if(p_bHideSourceElement) {

                    this._oSrcElement.style.display = "none";

                }
                else {

                    var oParentNode = this._oSrcElement.parentNode;
                    oParentNode.replaceChild(this._oDIV, this._oSrcElement);


                }

            }

            this.renderMenuItems();

            this.renderSubMenus();

            this._bRendered = true;

            this.renderEvent.fire(this);

        }

    },

    destroy: function() {

        if(this._bRendered) {

            var oParentNode = this._oDIV.parentNode;
    
            if(oParentNode) {
   
                oParentNode.removeChild(this._oDIV);
    
                this.destroyEvent.fire(this);

            }

        }

    },
    
    show: function() {

        if(!this._bVisible && this._oDIV) {

            this.beforeShowEvent.fire(this);

            if(this.getParent() && this.getParent()._MenuItem) {
            
                this._clearParentMenuWidth(this.getParent());
            
            }
            
            this._oDIV.style.display = "block";

            if(this._oDIV.style.width.length == 0) {

                var oDom = YAHOO.util.Dom;

                var nBorderWidth = 
                    parseInt(
                        oDom.getStyle(this._oDIV, 'borderLeftWidth'),
                        10
                    );

                nBorderWidth += 
                    parseInt(
                        oDom.getStyle(this._oDIV, 'borderRightWidth'),
                        10
                    );

                var nPadding = 
                    parseInt(
                        oDom.getStyle(this._oDIV, 'paddingLeft'), 
                        10
                    );

                nPadding += 
                    parseInt(
                        oDom.getStyle(this._oDIV, 'paddingRight'), 
                        10
                    );

                var nWidth = this._oDIV.offsetWidth;

                if(document.compatMode && document.compatMode == "CSS1Compat") {

                    nWidth = nWidth - (nBorderWidth + nPadding);

                }
                
                this._oDIV.style.width = nWidth + "px";
                
            }

            if(this.getParent() && this.getParent()._MenuItem) {
            
                this._setParentMenuWidth(this.getParent());

            }
            
            this._bVisible = true;

            this.showEvent.fire(this);

        }

    },

    hide: function() {

        if(this._bVisible) {

            this.beforeHideEvent.fire(this);
    
            this._oDIV.style.display = "none";
            this._bVisible = false;

            this.hideActiveMenuItem();

            this.hideEvent.fire(this);

        }

    },

    hideActiveMenuItem: function() {
        
        var oActiveMenuItem;

        if(this._oParent && this._oParent._Menu) {

            oActiveMenuItem = this._oParent.getActiveMenuItem();
        
        }
        else {
        
            oActiveMenuItem = this._oActiveMenuItem;
        
        }
        
        if(oActiveMenuItem) {

            if(oActiveMenuItem.isSelected()) {

                oActiveMenuItem.setSelected(false);

            }

            var oSubMenu = oActiveMenuItem.getSubMenu();

            if(oSubMenu && oSubMenu.isVisible()) {

                oSubMenu.hide();

            }

        }        

    },

    setTopPos: function(p_nTop, p_sUnit) {

        var sUnit = p_sUnit || "px";
    
        this._oDIV.style.top = p_nTop + sUnit;

    },

    setRightPos: function(p_nRight, p_sUnit) {

        var sUnit = p_sUnit || "px";
    
        this._oDIV.style.right = p_nRight + sUnit;
    
    },

    setBottomPos: function(p_nBottom, p_sUnit) {

        var sUnit = p_sUnit || "px";

        this._oDIV.style.bottom = p_nBottom + sUnit;
    
    },

    setLeftPos: function(p_nLeft, p_sUnit) {

        var sUnit = p_sUnit || "px";
        
        this._oDIV.style.left = p_nLeft + sUnit;
    
    },

    addMenuItem: function(p_oMenuItem, p_nIndex) {

        if(p_oMenuItem && p_oMenuItem._MenuItem) {

            p_oMenuItem.focusEvent.subscribe(
                this._menuItemFocus, 
                this,
                true
            );

            this._addArrayItem(this._aMenuItems, p_oMenuItem, p_nIndex);

        }

    },

    removeMenuItem: function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenuItem;

            if(p_oObject._MenuItem) {

                oMenuItem = 
                    this._removeArrayItemByValue(this._aMenuItems, p_oObject);           

            }
            else if(typeof p_oObject == "number") {

                oMenuItem = 
                    this._removeArrayItemByIndex(this._aMenuItems, p_oObject);

            }

            if(oMenuItem) {

                oMenuItem.destroy();

            }

        }

    },

    getMenuItems: function() {

        return (this._aMenuItems);

    },

    getMenuItem: function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return (this._aMenuItems[p_nIndex]);

        }

    },

    addSubMenu: function(p_oMenu, p_nIndex) {

        if(p_oMenu && p_oMenu._Menu) {

            this._addArrayItem(this._aSubMenus, p_oMenu, p_nIndex);

        }

    },

    removeSubMenu: function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenu;

            if(p_oObject._Menu) {

                oMenu = 
                    this._removeArrayItemByValue(this._aSubMenus, p_oObject);           

            }
            else if(typeof p_oObject == "number") {

                oMenu = 
                    this._removeArrayItemByIndex(this._aSubMenus, p_oObject);

            }

            if(oMenu) {

                oMenu.destroy();

            }

        }

    },

    getSubMenus: function() {

        return (this._aSubMenus);

    },

    getSubMenu: function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return (this._aSubMenus[p_nIndex]);

        }

    },

    
    // Event handlers

    onRender: function(p_sType, p_aArguments, p_oMenu) {

    },

    onDestroy: function(p_sType, p_aArguments, p_oMenu) {

    },

    onBeforeShow: function(p_sType, p_aArguments, p_oMenu) {

    },

    onShow: function(p_sType, p_aArguments, p_oMenu) {

    },
    
    onBeforeHide: function(p_sType, p_aArguments, p_oMenu) {

    },

    onHide: function(p_sType, p_aArguments, p_oMenu) {

    },

    onMouseOver: function(p_sType, p_aArguments, p_oMenu) {

    },
    
    onMouseOut: function(p_sType, p_aArguments, p_oMenu) {

    },
    
    onMouseDown: function(p_sType, p_aArguments, p_oMenu) {

    },
    
    onMouseUp: function(p_sType, p_aArguments, p_oMenu) {
    
    },
    
    onClick: function(p_sType, p_aArguments, p_oMenu) {
    
    },

    onPropertyChange: function(p_sType, p_aArguments, p_oMenuItem) {

    }

}