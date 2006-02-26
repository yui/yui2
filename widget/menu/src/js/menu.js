YAHOO.widget.Menu = function(p_oElement, p_oUserConfig) {

	if (arguments.length > 0) {

		YAHOO.widget.Menu.superclass.constructor.call(
            this, 
            p_oElement, 
            p_oUserConfig
        );

	}

}

YAHOO.widget.Menu.prototype = new YAHOO.widget.Overlay();
YAHOO.widget.Menu.prototype.constructor = YAHOO.widget.Menu;
YAHOO.widget.Menu.superclass = YAHOO.widget.Overlay.prototype;


// Public properties

YAHOO.widget.Menu.prototype.index = null;
YAHOO.widget.Menu.prototype.cssClassName = "yuimenu";
YAHOO.widget.Menu.prototype.parent = null;
YAHOO.widget.Menu.prototype.activeMenuItem = null;
YAHOO.widget.Menu.prototype.srcElement = null;
YAHOO.widget.Menu.prototype._Menu = true;


// Public methods

YAHOO.widget.Menu.prototype.init = function(p_oElement, p_oUserConfig) {

    /* 
        Note that we don't pass the user config in here yet because we only 
        want it executed once, at the lowest subclass level
    */ 

	YAHOO.widget.Menu.superclass.init.call(this, p_oElement);  


    // Private member variables

    var m_aMenuItems = [],
        m_aSubMenus = [],
        m_oListElement,


        // Create a reference to the MenuManager singleton

        m_oMenuManager = YAHOO.widget.MenuManager, 


        /*
            Create a reference to the current context so that private methods
            have access to class members
        */    

        me = this;


    // Private methods

    var addArrayItem = function(p_oArray, p_oItem, p_nIndex) {

        if(typeof p_nIndex == "number") {

            p_oArray.splice(p_nIndex, 0, p_oItem);

            p_oItem.parent = me;


            // Update the index and className properties of each member        
            
            updateArrayItemProperties(p_oArray);

        }
        else {

            var nIndex = p_oArray.length;

            p_oArray[nIndex] = p_oItem;

            p_oItem.index = nIndex;

            p_oItem.parent = me;

            if(nIndex == 0) {

                YAHOO.util.Dom.addClass(p_oItem.element, "first");

            }

        }

    };
    
    var removeArrayItemByIndex = function(p_oArray, p_nIndex) {

        var aArray = p_oArray.splice(p_nIndex, 1);


        // Update the index and className properties of each member        
        
        updateArrayItemProperties(p_oArray);


        // Return a reference to the item that was removed

        return aArray[0];

    };
    
    var removeArrayItemByValue = function(p_oArray, p_oItem) {

        var nIndex = -1,
            i = p_oArray.length-1;

        do {

            if(p_oArray[i] == p_oItem) {

                nIndex = i;
                break;    

            }

        }
        while(i--);

        if(nIndex > -1) {

            return removeArrayItemByIndex(p_oArray, nIndex);

        }      

    };

    var updateArrayItemProperties = function(p_oArray) {

        var oDom = YAHOO.util.Dom,
            i = p_oArray.length-1;


        // Update the index and className properties of each member        

        do {

            p_oArray[i].index = i;

            switch(i) {

                case 0:

                    oDom.addClass(p_oArray[i].element, "first");

                break;

                default:

                    oDom.removeClass(p_oArray[i].element, "first");


                break;

            }

        }
        while(i--);

    };

    var clearParentMenuWidth = function(p_oMenuItem) {

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
        
            return clearParentMenuWidth(oParentMenu.getParent());
        
        }

    };

    var setParentMenuWidth = function(p_oMenuItem) {

        var oParentMenu = p_oMenuItem.getParent();

        if(oParentMenu.getParent() && oParentMenu.getParent()._Menu) { 
        
            oParentMenu = oParentMenu.getParent();
            
        }

        oParentMenu.getElement().style.width = oParentMenu.pixelWidth;
            
        if(oParentMenu.getParent()) {
        
            return setParentMenuWidth(oParentMenu.getParent());
        
        }
    
    };
    
    var removeBehavior = function() {

        if(me.element.runtimeStyle) {
    
            me.element.runtimeStyle.behavior = "";
    
        }

    };


    // Private DOM event handlers

    var elementMouseOver = function(p_oEvent, p_oMenu) {

        if(!this.parent || this.parent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }
        
        this.mouseOverEvent.fire(p_oEvent, this);
    
    };

    var elementMouseOut = function(p_oEvent, p_oMenu) {

        if(!this.parent || this.parent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseOutEvent.fire(p_oEvent, this);
    
    };

    var elementMouseDown = function(p_oEvent, p_oMenu) {

        if(!this.parent || this.parent._MenuItem) {

            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseDownEvent.fire(p_oEvent, this);

        return true;

    };
    
    var elementMouseUp = function(p_oEvent, p_oMenu) {

        if(!this.parent || this.parent._MenuItem) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.mouseUpEvent.fire(p_oEvent, this);

        return true;

    };
        
    var elementClick = function(p_oEvent, p_oMenu) {

        var oTarget = YAHOO.util.Event.getTarget(p_oEvent, true);

        if(
            (!this.parent || this.parent._MenuItem) && 
            oTarget.tagName != "A"
        ) {
        
            YAHOO.util.Event.stopPropagation(p_oEvent);

        }

        this.clickEvent.fire(p_oEvent, this);

        return true;
    
    };


    // Private CustomEvent handlers

    var menuItemFocus = function(p_sType, p_aArguments, p_oMenu) {
    
        if(this.parent && this.parent._Menu) {

            this.parent.activeMenuItem = p_aArguments[1];
            m_oMenuManager.setActiveMenu(this.parent);
        
        }
        else {

            this.activeMenuItem = p_aArguments[1];
            m_oMenuManager.setActiveMenu(this);

        }    

    };


    // Privileged methods

    this.addMenuItem = function(p_oMenuItem, p_nIndex) {

        if(p_oMenuItem && p_oMenuItem._MenuItem) {

            p_oMenuItem.focusEvent.subscribe(
                menuItemFocus, 
                this,
                true
            );

            addArrayItem(m_aMenuItems, p_oMenuItem, p_nIndex);

        }

    };

    this.removeMenuItem = function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenuItem;

            if(p_oObject._MenuItem) {

                oMenuItem = 
                    removeArrayItemByValue(m_aMenuItems, p_oObject);           

            }
            else if(typeof p_oObject == "number") {

                oMenuItem = 
                    removeArrayItemByIndex(m_aMenuItems, p_oObject);

            }

            if(oMenuItem) {

                oMenuItem.destroy();

            }

        }

    };
        
    this.getMenuItems = function() {

        return m_aMenuItems;

    };

    this.getMenuItem = function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return m_aMenuItems[p_nIndex];

        }

    };

    this.addSubMenu = function(p_oMenu, p_nIndex) {

        if(p_oMenu && p_oMenu._Menu) {

            p_oMenu.cfg.setConfigProperty("iframe", false);

            addArrayItem(m_aSubMenus, p_oMenu, p_nIndex);

        }

    };
        
    this.removeSubMenu = function(p_oObject) {

        if(typeof p_oObject != "undefined") {

            var oMenu;

            if(p_oObject._Menu) {

                oMenu = removeArrayItemByValue(m_aSubMenus, p_oObject);           

            }
            else if(typeof p_oObject == "number") {

                oMenu = removeArrayItemByIndex(m_aSubMenus, p_oObject);

            }

            if(oMenu) {

                oMenu.destroy();

            }

        }

    };
        
    this.getSubMenus = function() {

        return m_aSubMenus;

    };

    this.getSubMenu = function(p_nIndex) {

        if(typeof p_nIndex == "number") {

            return m_aSubMenus[p_nIndex];

        }

    };

    this.renderMenuItems = function() {
    
        if(m_aMenuItems.length > 0) {            
    
            var nMenuItems = m_aMenuItems.length
                oMenuItem,
                oSubMenu;
    
            for(var i=0; i<nMenuItems; i++) {
    
                oMenuItem = m_aMenuItems[i];
                
                m_oListElement.appendChild(oMenuItem.element);

                oSubMenu = oMenuItem.cfg.getConfigProperty("submenu")

                if(oSubMenu) {

                    oSubMenu.render();

                }
    
            }
    
        }
    
    };
    
    this.renderSubMenus = function() {
    
        if(m_aSubMenus.length > 0) {
    
            var nSubMenus = m_aSubMenus.length,
                oMenu;
    
            for(var i=0; i<nSubMenus; i++) {
    
                oMenu = m_aSubMenus[i];

                oMenu.render();

                oMenu.appendTo(this.body);
    
            }
    
        }
    
    };
    
    this.render = function(p_bAppendToNode, p_bHideSourceElement) {
   
        var oDom = YAHOO.util.Dom;
               
        oDom.addClass(this.element, this.cssClassName);


        /*
            If the menu contains MenuItem instances, create the list element 
            (UL) and append it to the body of the module
        */        

        if(m_aMenuItems.length > 0 && !m_oListElement) {
        
            var oUL = document.createElement("ul");
            oDIV.appendChild(oUL);
        
            this.setBodyContent(oUL);

            m_oListElement = oUL;

        }


        /*
            Determine whether to hide or destory the source element
        */ 

        if(this.srcElement) {

            if(p_bHideSourceElement) {
    
                this.srcElement.style.display = "none";
    
            }
            else {
    
                var oParentNode = this.srcElement.parentNode;
                oParentNode.removeChild(this.srcElement);
    
            }

        }

        this.renderMenuItems();


        // Continue with the superclass implementation of this method

        YAHOO.widget.Overlay.superclass.render.call(this, p_bAppendToNode);


        this.renderSubMenus();
    
    };


   this.configVisible = function(type, args, me) {
    
        var val = args[0];

        if (!val) {
    
            YAHOO.util.Dom.setStyle(
                (this.container || this.element), 
                "visibility", 
                "hidden"
            );
    
            var oActiveMenuItem;
        
            if(this.parent && this.parent._Menu) {
        
                oActiveMenuItem = this.parent.activeMenuItem;
            
            }
            else {
            
                oActiveMenuItem = this.activeMenuItem;
            
            }
            
            if(oActiveMenuItem) {
        
                if(oActiveMenuItem.isSelected()) {
        
                    oActiveMenuItem.setSelected(false);
        
                }
        
                var oSubMenu = oActiveMenuItem.getSubMenu();
        
                if(oSubMenu && oSubMenu.getConfigProperty("visible")) {
        
                    oSubMenu.hide();
        
                }
        
            }
    
        } else {
    
            if(this.parent && this.parent._MenuItem) {
            
                clearParentMenuWidth(this.parent);
            
            }
            
            YAHOO.util.Dom.setStyle(
                (this.container || this.element), 
                "visibility", 
                "visible"
            );
    
            if(this.element.style.width.length == 0) {
    
                var oDom = YAHOO.util.Dom;
    
                var nBorderWidth = 
                    parseInt(
                        oDom.getStyle(this.element, "borderLeftWidth"), 
                        10
                    );
    
                nBorderWidth += 
                    parseInt(
                        oDom.getStyle(this.element, "borderRightWidth"), 
                        10
                    );
    
                var nPadding = 
                    parseInt(
                        oDom.getStyle(this.element, "paddingLeft"), 
                        10
                    );
    
                nPadding += 
                    parseInt(
                        oDom.getStyle(this.element, "paddingRight"), 
                        10
                    );
    
                var nWidth = this.element.offsetWidth;
    
                if(
                    document.compatMode && 
                    document.compatMode == "CSS1Compat"
                ) {
    
                    nWidth = nWidth - (nBorderWidth + nPadding);
    
                }
                
                this.element.style.width = nWidth + "px";
                
            }
    
            if(this.parent && this.parent._MenuItem) {
            
                setParentMenuWidth(this.parent);
    
            }
    
        }
    
    };


    if(this.element) {

        switch(this.element.tagName) {

            case "DIV":

                if(YAHOO.util.Dom.hasClass(this.element, "yuimenu")) {

                    this.srcElement = this.element;
                    

                    // Get the list node (UL) if it exists

                    if(
                        this.element.firstChild && 
                        this.element.firstChild.nodeType == 1 && 
                        this.element.firstChild.tagName == "UL"
                    ) {

                        m_oListElement = this.element.firstChild;

                    }
                    else if(
                        this.element.childNodes[1] && 
                        this.element.childNodes[1].nodeType == 1 &&
                        this.element.childNodes[1].tagName == "UL"
                    ) {

                        m_oListElement = this.element.childNodes[1];

                    }


                }

            break;


            case "UL":
            case "SELECT":

                this.srcElement = this.element;


                /*
    
                    If the source element is not a standard module, give the 
                    standard module a unique id so that both elements can be
                    referenced seperately
    
                */

                if(this.id == this.srcElement.id) {

                    this.id = m_oMenuManager.createMenuId();
                    this.element.id = this.id;
        
                }

            break;


            /*

                If the element supplied is not a UL, SELECT, or a standard 
                module, exit right away.

            */

            default:

                return false;

            break;

        }


        /*
            Check to make sure that the element has an id. If not, use the 
            MenuManager to create a new id for the element.
        */ 

        if(!this.id) {

            this.id = m_oMenuManager.createMenuId();
            this.element.id = this.id;

        }


        var oEventUtil = YAHOO.util.Event,
            CustomEvent = YAHOO.util.CustomEvent;


        // Assign DOM event handlers

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


        // Create custom events

        this.mouseOverEvent = new CustomEvent("mouseOverEvent", this);
        this.mouseOutEvent = new CustomEvent("mouseOutEvent", this);
        this.mouseDownEvent = new CustomEvent("mouseDownEvent", this);
        this.mouseUpEvent = new CustomEvent("mouseUpEvent", this);
        this.clickEvent = new CustomEvent("clickEvent", this);

        m_oMenuManager.addMenu(this);


        if (p_oUserConfig) {
    
            this.cfg.applyConfig(p_oUserConfig);
    
        }

    }

};

YAHOO.widget.Menu.prototype.initSubTree = function() {

    var oNode,
        Menu = YAHOO.widget.Menu,
        MenuItem = YAHOO.widget.MenuItem;

    for (var i=0; (oNode = this.srcElement.childNodes[i]); i++) {
    
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
                    YAHOO.util.Dom.hasClass(oNode.parentNode, "yuimenu")
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

};