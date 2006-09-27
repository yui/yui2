YAHOO.widget.Button = function(p_oObject) {

    if(p_oObject) {

        this.init(p_oObject);

    }

};

YAHOO.widget.Button._initEventHandlers = true;

YAHOO.widget.Button._buttons = {};

YAHOO.widget.Button._activeButton = null;

YAHOO.widget.Button._getFirstElement = function(p_oElement) {

    var oElement;

    if(p_oElement.firstChild && p_oElement.firstChild.nodeType == 1) {

        oElement = p_oElement.firstChild;

    }
    else if(
        p_oElement.firstChild && 
        p_oElement.firstChild.nextSibling && 
        p_oElement.firstChild.nextSibling.nodeType == 1
    ) {

        oElement = p_oElement.firstChild.nextSibling;

    }

    return oElement;

};


YAHOO.widget.Button.onDOMEvent = function(p_oEvent) {

    var Event = YAHOO.util.Event;


    // Map of DOM event types to Custom Event types

    var oEventTypes =  {
            "click" : "clickEvent",
            "mousedown": "mouseDownEvent",
            "mouseup": "mouseUpEvent",
            "mouseover": "mouseOverEvent",
            "mouseout": "mouseOutEvent",
            "keydown": "keyDownEvent",
            "keyup": "keyUpEvent",
            "keypress": "keyPressEvent"
        };


    var sCustomEventType = oEventTypes[p_oEvent.type];
    var oTarget = Event.getTarget(p_oEvent);
    var oButtonRoot; // The outermost SPAN of a YAHOO.widget.Button instance
    var sTagName;
    

    if(oTarget && oTarget.tagName) {

        sTagName = oTarget.tagName.toUpperCase(); // XHTML compatibility

        switch(sTagName) {
        
            case "A":
            case "BUTTON":
    
                oButtonRoot = oTarget.parentNode.parentNode;
            
            break;
            
            case "SPAN":

                var oFirstElement = 
                    YAHOO.widget.Button._getFirstElement(oTarget);

                var sFirstElementTagName;

                if(oFirstElement) {
                
                    sFirstElementTagName = oFirstElement.tagName;

                    if(
                        sFirstElementTagName == "BUTTON" || 
                        sFirstElementTagName == "A"
                    ) {

                        // The target was possibly the inner SPAN, so go up one
        
                        oButtonRoot = oFirstElement.parentNode;
                    
                    }
                    else {

                        oButtonRoot = oTarget;

                    }
                
                }
    
            break;
    
        }
    
    }


    if(
        oButtonRoot && 
        YAHOO.util.Dom.hasClass(oButtonRoot, "yuibutton") && 
        oButtonRoot.id
    ) {

        var oButton = YAHOO.widget.Button._buttons[oButtonRoot.id];


        // Fire the associated custom event for the Button instance
    
        oButton[sCustomEventType].fire(p_oEvent);
    
    }
    else if(
        p_oEvent.type == "mousedown" && 
        YAHOO.widget.Button._activeButton
    ) {

        YAHOO.widget.Button._activeButton.blur();
    
    }

};


YAHOO.widget.Button.prototype = {

    // Constants

    CSS_CLASS_NAME: "yuibutton",


    // Private properties
    
    _sType: null,
    _oSrcElement: null,
    _oMenuSrcElement: null,
    _oMenu: null,
    _oElement: null,
    _oSelectElement: null,
    _oText: "",
    _oButton: null,
    _oHiddenField: null,
    _oImage: null, 
    _bChecked: false,
    _bHasFocus: false,
    _bAddedMenuEventHandlers: false,
    _bSubmitFormOnClick: false,
    _bMouseDownTargetIsArrow: false,

    // Public properties

    text: null,
    value: null,
    id: null,
    name: null,
    tabIndex: null,
    title: null,
    disabled: false,
    form: null,
    imageSrc: null,
    imageAlt: null,
    accessKey: null,
    URL: null,
    textAlign: "right",
    target: null,
    menu: null,

    // Events

    clickEvent: null,
    focusEvent: null,
    blurEvent: null,
    mouseOverEvent: null,
    propertyChangeEvent: null,
    renderEvent: null,
    destroyEvent: null,


    // Property accessor methods

    setProperty: function(p_sName, p_oValue, p_bSilent) {

        if(typeof this[p_sName] != "undefined") {

            if(this._aProperties && this._aProperties[p_sName] && this._aProperties[p_sName].validator && !this._aProperties[p_sName].validator.call(this, p_oValue)) {
    
                return;
            
            }
    
            if(this[p_sName] != p_oValue) {

                if(
                    this._aProperties && 
                    this._aProperties[p_sName] && 
                    this._aProperties[p_sName].setter
                ) {
                
                    this._aProperties[p_sName].setter.call(this, p_oValue);
                    
                }
                else {

                    this[p_sName] = p_oValue;
                
                }

                if(!p_bSilent) {

                    this.propertyChangeEvent.fire(p_sName, p_oValue);

                }

            }

        }

    },

    registerProperty: function(p_oProperty) {
        
        if(typeof this[p_oProperty.name] != "undefined") {

            if(typeof this._aProperties == "undefined") {
            
                this._aProperties = {};
            
            }

            this._aProperties[p_oProperty.name] = {};

            if(this._isFunction(p_oProperty.setter)) {

                this._aProperties[p_oProperty.name].setter = p_oProperty.setter;

            }

            if(this._isFunction(p_oProperty.validator)) {

                this._aProperties[p_oProperty.name].validator = p_oProperty.validator;
            
            }

        }        
    
    },

    setText: function(p_sText) {

        this.text = p_sText;

        this._oText.nodeValue = p_sText;

    },

    setValue: function(p_sValue) {

        this.value = p_sValue;

        if(this._sType != "link" && this._oHiddenField) {
       
            this._oHiddenField.value = p_sValue;
        
        }

    },

    setId: function(p_sId) {

        this.id = p_sId;

        this._oElement.id = p_sId;
    
    },
    
    setName: function(p_sName) {

        this.name = p_sName;

        if(this._sType != "link") {

            /*
                Use the attribute "yuiname" over "name," or IE will submit the
                value of the <BUTTON> element.
            */

            this._oButton.setAttribute("yuiname", p_sName);
   
        }
    
    },
    
    setTabIndex: function(p_nTabIndex) {

        this.tabIndex = p_nTabIndex;

        this._oButton.tabIndex = p_nTabIndex;
    
    },
    
    setTitle: function(p_sTitle) {

        this.title = p_sTitle;

        if(this._sType != "link") {

            this._oButton.title = p_sTitle;

        }

    },

    setChecked: function(p_bChecked) {
    
        if(this._sType == "radio" || this._sType == "checkbox") {

            if(this._oHiddenField) {

                if(p_bChecked) {
    
                    if(this._sType == "radio") {
    
                        var me = this;
                        var aCheckedButtons = [];
        
                        var isYUIButton = function(p_oElement) { 
        
                            if(p_oElement.getAttribute("yuiname") == me.name) {
    
                                var oParent = p_oElement.parentNode.parentNode;
                                
                                if(
                                    YAHOO.util.Dom.hasClass(
                                        oParent, 
                                        me.CSS_CLASS_NAME
                                    )
                                ) {
        
                                    aCheckedButtons[aCheckedButtons.length] = 
                                        oParent;
                
                                    return true;
                                
                                }
        
                            }
        
                        };
        
                        YAHOO.util.Dom.getElementsBy(isYUIButton, "button");
                        YAHOO.util.Dom.removeClass(aCheckedButtons, "active");
    
                    }
    
                    this._oHiddenField.checked = true;
                    YAHOO.util.Dom.addClass(this._oElement, "active");
                
                }
                else {
    
                    this._oHiddenField.checked = false;
                    YAHOO.util.Dom.removeClass(this._oElement, "active");
                
                }
            
            }
            else {
            
                this._bChecked = p_bChecked;
            
            }
            
            this.propertyChangeEvent.fire("checked", p_bChecked);
        
        }
    
    },

    getChecked: function() {
    
        if(this._sType == "radio" || this._sType == "checkbox") {
        
            if(this._oHiddenField) {
            
                return this._oHiddenField.checked;
            
            }
            else {
            
                return this._bChecked;
            
            }
        }

    },
   
    setDisabled: function(p_bDisabled) {

        this.disabled = p_bDisabled;

        var oButton = this._oButton;

        if(this._sType != "link") {

            if(p_bDisabled) {
    
                if(this.hasFocus()) {
                
                    this.blur();
                
                }

                oButton.setAttribute("disabled", "disabled");

                if(this._oHiddenField) {

                    this._oHiddenField.setAttribute("disabled", "disabled");

                }

                YAHOO.util.Dom.addClass(this._oElement, "disabled");

            }
            else {
    
                oButton.removeAttribute("disabled");
                
                if(this._oHiddenField) {
                
                    this._oHiddenField.removeAttribute("disabled");

                }

                YAHOO.util.Dom.removeClass(this._oElement, "disabled");
            
            }

        }

    },

    setImageSrc: function(p_sImageSrc) {

        this.imageSrc = p_sImageSrc;

        var oImage = this._oImage;

        if(!oImage) {
        
            oImage = document.createElement("img");

            this._oButton.appendChild(oImage);
            
            this._oImage = oImage;
        
        }

        oImage.src = p_sImageSrc;
        
        if(this.imageAlt) {
        
            this.setImageAlt();
        
        }        
    
    },

    setImageAlt: function(p_sImageAlt) {

        this.imageAlt = p_sImageAlt;

        var oImage = this._oImage;
        
        if(oImage) {

            oImage.alt = p_sImageAlt;
        
        }
    
    },

    setAccessKey: function(p_sAccessKey) {

        this.accessKey = p_sAccessKey;

        this._oButton.accessKey = p_sAccessKey;
    
    },

    setURL: function(p_sURL) {

        this.URL = p_sURL;

        if(this._sType == "link") {

            this._oButton.href = p_sURL;
        
        }
    
    },

    setTextAlign: function(p_sTextAlign) {

        this.textAlign = p_sTextAlign;

        var oImage = this._oImage;
        var oText = this._oText;
        var oParent = this._oText.parentNode;

        if(oImage) {

            switch(p_sTextAlign) {
            
                case "top":
                    
                    oImage.style.display = "block";
                    oParent.insertBefore(oImage, oText);
                    oParent.style.textAlign = "center";
                    
                break;
                
                case "right":

                    oImage.style.display = "inline";
                    oParent.insertBefore(oImage, oText);
                    oParent.style.textAlign = "left";
                
                break;
                
                case "bottom":

                    oImage.style.display = "block";
                    oParent.insertBefore(oText, oImage);
                    oParent.style.textAlign = "center";
                
                break;
                
                case "left":

                    oImage.style.display = "inline";
                    oParent.insertBefore(oText, oImage);
                    oParent.style.textAlign = "left";
                
                break;
            
            }
        
        }
        
    },

    setTarget: function(p_sTarget) {

        this.target = p_sTarget;
        
        if(this._sType == "link") {

            this._oButton.setAttribute("target", p_sTarget);
        
        }
    
    },

    setMenu: function(p_oObject) {

        if(p_oObject instanceof YAHOO.widget.MenuModule) {

            this._oMenu = p_oObject;

        }


        var oElement;

        if(this._isString(p_oObject)) {
        
            oElement = document.getElementById(p_oObject);

        }
        else if(p_oObject.tagName) {

             oElement = p_oObject;     
        
        }



        if(this._oMenu || oElement) {

            if(oElement) {

                this._oMenuSrcElement = oElement;
    
                if(oElement.tagName.toUpperCase() == "SELECT") {
        
                    oElement.style.display = "none";

                    this._oSelectElement = oElement;
                
                }
            
            }
    
            YAHOO.util.Dom.addClass(this._oElement, ("yui" + this._sType));

        }

    },

    getType: function() {

        return this._sType;
    
    },

    getElement: function() {
    
        return this._oElement;
    
    },
    
    getSrcElement: function() {
    
        return this._oSrcElement;
    
    },
    
    getMenu: function() {

        return this._oMenu;
    
    },


    // Private methods
    
    _isString: function(p_oValue) {
    
        return typeof p_oValue == "string";
    
    },

    _isBoolean: function(p_oValue) {

        return typeof p_oValue == "boolean";

    },
    
    _isNumber: function(p_oValue) {

        return typeof p_oValue == "number" && isFinite(p_oValue);

    },    

    _isFunction: function(p_oValue) {

        return typeof p_oValue == "function";

    },

    _isObject: function(p_oValue) {

        return (p_oValue && typeof p_oValue == "object") || 
            isFunction(p_oValue);

    },

    _isTextAlignValue: function(p_oValue) {
    
        if(this._isString(p_oValue)) {
        
            return ("top,right,bottom,left".indexOf(p_oValue) != -1);
        
        }
    
    },

    _createButtonDOM: function() {

        var oOuterSpan = document.createElement("span");
        var oInnerSpan = document.createElement("span");
        var sTagName = (this._sType == "link") ? "a" : "button";
        var oButton = document.createElement(sTagName);

        if(sTagName == "button") {

            oButton.setAttribute("type", "button");
        
        }

        var oText = document.createTextNode("");

        oButton.appendChild(oText);
        oInnerSpan.appendChild(oButton);
        oOuterSpan.appendChild(oInnerSpan);

        this._oElement = oOuterSpan;
        this._oText = oText;
        this._oButton = oButton;

        return oOuterSpan;
        
    },

    _createHiddenField: function() {
    
        var oField;
        var sType;

        switch(this._sType) {
        
            case "radio":
            case "checkbox":
                
                sType = this._sType;
                
            break;
            
            case "submit":

                sType = "hidden";            
            
            break;
        
        }
        
        if(navigator.userAgent.indexOf("MSIE") != -1) {
        
            var aTag = ["<input type=\""];
            aTag[1] = sType;
            aTag[2] = "\"";

            if(this.name) {
            
                aTag[3] = " name=\"";
                aTag[4] = this.name;
                aTag[5] = "\"";
                
            }

            aTag[6] = ">";
            
            oField = document.createElement(aTag.join(""));
        
        }
        else {
        
            oField = document.createElement("input");
            oField.type = sType;
            oField.name = this.name;

        }
        
        oField.value = this.value;

        if(this.disabled) {
        
            oField.setAttribute("disabled", "disabled");
        
        }

        if(sType != "hidden") {
    
            oField.style.display = "none";
    
        }

        return oField;   
    
    },    

    _syncDOMPropertiesToButton: function(p_oDOMObject) {

        var me = this;

        var setPropertyFromDOMAttribute = function(p_sProperty, p_sAttribute) {
        
            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because IE will return the innerText of a <BUTTON> for the 
                value attribute rather than the value of the "value" attribute
            */

            var oAttribute = p_oDOMObject.getAttributeNode(p_sAttribute);

            if(oAttribute && oAttribute.value && oAttribute.value.length > 0) {
            
                me.setProperty(p_sProperty, oAttribute.value, true);
            
            }
        
        };

        var setImageProperties = function() {

            var aImg = p_oDOMObject.getElementsByTagName("img");
            
            if(aImg.length == 1) {

                var oImg = aImg[0];

                me._oImage = oImg;

                me.setProperty("imageSrc", oImg.src, true);
                me.setProperty("imageAlt", oImg.alt, true);
                            
            }
        
        };

        var setFormElementProperties = function() {

            me._sType = p_oDOMObject.type;

            me.setProperty("disabled", p_oDOMObject.disabled, true);

            setPropertyFromDOMAttribute("name", "name");
            setPropertyFromDOMAttribute("value", "value");
            setPropertyFromDOMAttribute("title", "title");

        };


        var sSrcElementTagName = p_oDOMObject.tagName.toUpperCase();


        // Set the "text" property

        var sText = "";

        if(sSrcElementTagName == "INPUT") {

            sText = p_oDOMObject.value;       
        
        }
        else {
    
            if(p_oDOMObject.innerText) {
    
                sText = p_oDOMObject.innerText;
    
            }
            else {
    
                var oRange = p_oDOMObject.ownerDocument.createRange();
                oRange.selectNodeContents(p_oDOMObject);
    
                sText = oRange.toString();
            
            }

        }
    

        if(sText && sText.length > 0) {

            this.setProperty("text", sText, true);
            
        } 


        // Sync DOM properties to class properties

        setPropertyFromDOMAttribute("tabIndex", "tabindex");
        setPropertyFromDOMAttribute("accessKey", "accesskey");
        setPropertyFromDOMAttribute("id", "id");        


        switch(sSrcElementTagName) {
        
            case "A":
            
                this._sType = "link";
                setPropertyFromDOMAttribute("URL", "href");
                setPropertyFromDOMAttribute("target", "target");
                setImageProperties();

            break;

            case "INPUT":

                setFormElementProperties();            
                this.setChecked(p_oDOMObject.checked);

            break;

            case "BUTTON":

                setImageProperties();
                setFormElementProperties();
                
                this._oElement.removeAttribute("name");
                this._oElement.removeAttribute("value");
                this._oElement.setAttribute("type", "button");

                var aChildNodes = this._oButton.childNodes;
                var i = aChildNodes.length - 1;

                do {
                
                    if(aChildNodes[i].nodeType == 3) {
                    
                        this._oText = aChildNodes[i];
                        break;
                    
                    }
                
                }
                while(i--);

            break;
        
        }


        if(this._sType == "submit") {
        
            this._bSubmitFormOnClick = true;
        
        }
    
    },


    // Private DOM event handlers

    _onMenuItemMouseDown: function(p_sType, p_aArgs, p_oButton) {

        p_oButton._oSelectElement.selectedIndex = this.index;

        if(p_oButton.form && p_oButton._bSubmitFormOnClick) {

            var oHiddenField = p_oButton._createHiddenField();

            p_oButton.form.appendChild(oHiddenField);
            p_oButton.form.submit();

        }
    
    },

    _onClick: function(p_sType, p_aArgs, p_oButton) {

        if(!this.disabled) {

            if(this._sType == "radio" || this._sType == "checkbox") {
    
                this.setChecked(!this.getChecked());
    
            }
            else {

                if(!this._bMouseDownTargetIsArrow && (this._sType == "submit" || (this._bSubmitFormOnClick && this._sType == "splitbutton"))) {
    
                    var oHiddenField = this._createHiddenField();
    
                    this.form.appendChild(oHiddenField);
                    this.form.submit();
                
                }
            
            }
        
        }

    },

    _onMouseOver: function(p_sType, p_aArgs, p_oButton) {

        if(!this.disabled) {

            YAHOO.util.Dom.addClass(this._oElement, "hover");

        }

    },

    _onMouseOut: function(p_sType, p_aArgs, p_oButton) {

        if(!this.disabled) {

            YAHOO.util.Dom.removeClass(this._oElement, "hover");
    
            if(!(this._sType == "radio" || this._sType == "checkbox" || (this._sType == "splitbutton" && this._bMouseDownTargetIsArrow) || this._sType == "menubutton")) {
                
                YAHOO.util.Dom.removeClass(this._oElement, "active");
        
            }
        
        }
        
    },

    _onMouseDown: function(p_sType, p_aArgs, p_oButton) {

        if(!this.disabled) {

            if(this._bMouseDownTargetIsArrow) {
            
                YAHOO.util.Dom.removeClass(this._oElement, "activemenu");
                
                if(this._oMenu && this._oMenu.cfg.getProperty("visible")) {
                
                    this._oMenu.hide();
                
                }
            
            }



            if(this._oMenuSrcElement && !this._oMenu) {

                var oMenu = new YAHOO.widget.Menu(this._oMenuSrcElement);
                oMenu.render(this._oMenuSrcElement.parentNode);
            
                this._oMenu = oMenu;
            
            }


            if(!this.hasFocus()) {
            
                this.focus();
            
            }

            var sClassName = "";

            this._bMouseDownTargetIsArrow = false;
    
            if(this._sType == "splitbutton") {
            
                var oEvent = p_aArgs[0];

                var nX = oEvent.layerX || oEvent.offsetX;
    
                if((this._oElement.offsetWidth - 20) < nX) {
    
                    sClassName = "activemenu";
                
                    this._bMouseDownTargetIsArrow = true;

                }
                else {
    
                    sClassName = "active";
                
                }
    
            }
            else {
    
                sClassName = "active";
            
            }
    

            YAHOO.util.Dom.addClass(this._oElement, sClassName);


            if(
                (
                    this._sType == "menubutton" || 
                    (this._sType == "splitbutton" && this._bMouseDownTargetIsArrow)
                ) &&
                this._oMenu
            ) {

                if(this._oSelectElement && !this._bAddedMenuEventHandlers) {
                
                    var aItems = this._oMenu.getItemGroups()[0];
                    var i = aItems.length - 1;
                    
                    do {
                    
                        aItems[i].mouseDownEvent.subscribe(this._onMenuItemMouseDown, this);
                    
                    }
                    while(i--);
                
                    this._bAddedMenuEventHandlers = true;
                
                }

                this._oMenu.cfg.applyConfig({ context:[this.id, "tl", "bl"], clicktohide: false, visible: true });
                this._oMenu.cfg.fireQueue();
            
            }
        
        }

    },
    
    _onMouseUp: function(p_sType, p_aArgs, p_oButton) {

        if(!this.disabled) {
    
            if(!(this._sType == "radio" || this._sType == "checkbox" || (this._sType == "splitbutton" && this._bMouseDownTargetIsArrow) || this._sType == "menubutton")) {
                
                YAHOO.util.Dom.removeClass(this._oElement, "active");
        
            }
        
        }
        
    },

    _onElementRender: function(p_sType, p_sArgs, p_oButton) {
    
        if(!this._oHiddenField && (this._sType == "radio" || this._sType == "checkbox")) {

            var oHiddenField = this._createHiddenField();
            
            this._oElement.parentNode.appendChild(oHiddenField);

            this._oHiddenField = oHiddenField;
            
            if(this._bChecked) {

                this.setChecked(true);

            }
            
        }
    
    },

    // Public methods

    init: function(p_oObject) {

        if(YAHOO.widget.Button._initEventHandlers) {

            YAHOO.util.Event.addListener(document, "click", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "mouseover", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "mouseout", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "mousedown", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "mouseup", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "keydown", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "keyup", YAHOO.widget.Button.onDOMEvent);
            YAHOO.util.Event.addListener(document, "keypress", YAHOO.widget.Button.onDOMEvent);          

            YAHOO.widget.Button._initEventHandlers = false;

        }


        this.clickEvent = new YAHOO.util.CustomEvent("click", this);
        this.mouseDownEvent = new YAHOO.util.CustomEvent("mousedown", this);
        this.mouseUpEvent = new YAHOO.util.CustomEvent("mouseup", this);        
        this.mouseOverEvent = new YAHOO.util.CustomEvent("mouseover", this);
        this.mouseOutEvent = new YAHOO.util.CustomEvent("mouseout", this);
        this.keyDownEvent = new YAHOO.util.CustomEvent("keydown", this);
        this.keyUpEvent = new YAHOO.util.CustomEvent("keyup", this);
        this.keyPressEvent = new YAHOO.util.CustomEvent("keypress", this);
        this.focusEvent = new YAHOO.util.CustomEvent("focus", this);
        this.blurEvent = new YAHOO.util.CustomEvent("blur", this);
        this.propertyChangeEvent = new YAHOO.util.CustomEvent("propertychange", this);
        this.renderEvent = new YAHOO.util.CustomEvent("render", this);
        this.destroyEvent = new YAHOO.util.CustomEvent("destroy", this);
        
        
        this.clickEvent.subscribe(this._onClick, this, true);
        this.mouseOverEvent.subscribe(this._onMouseOver, this, true);
        this.mouseOutEvent.subscribe(this._onMouseOut, this, true);
        this.mouseDownEvent.subscribe(this._onMouseDown, this, true);
        this.mouseUpEvent.subscribe(this._onMouseUp, this, true);


        this.registerProperty({ name: "text", setter: this.setText, validator: this._isString });
        this.registerProperty({ name: "value", setter: this.setValue, validator: this._isString });
        this.registerProperty({ name: "id", setter: this.setId, validator: this._isString });
        this.registerProperty({ name: "name", setter: this.setName, validator: this._isString });
        this.registerProperty({ name: "tabIndex", setter: this.setTabIndex, validator: this._isNumber });
        this.registerProperty({ name: "title", setter: this.setTitle, validator: this._isString });
        this.registerProperty({ name: "disabled", setter: this.setDisabled, validator: this._isBoolean });
        this.registerProperty({ name: "imageSrc", setter: this.setImageSrc, validator: this._isString });
        this.registerProperty({ name: "imageAlt", setter: this.setImageAlt, validator: this._isString });
        this.registerProperty({ name: "accessKey", setter: this.setAccessKey, validator: this._isString });
        this.registerProperty({ name: "URL", setter: this.setURL, validator: this._isString });
        this.registerProperty({ name: "textAlign", setter: this.setTextAlign, validator: this._isTextAlignValue });
        this.registerProperty({ name: "target", setter: this.setTarget, validator: this._isString });
        this.registerProperty({ name: "menu", setter: this.setMenu });


        var oElement;
        var oSrcElement;   
        var oConfigs;
    
        if(this._isString(p_oObject)) {

            oSrcElement = document.getElementById(p_oObject);

            // Create a new button from a text label

            if(!oSrcElement) {

                this._sType = "button";
                this._oElement = this._createButtonDOM();
                this.setProperty("text", p_oObject, true);

            }
        
        }
        else if(this._isObject(p_oObject)) {

            oConfigs = p_oObject;

            if(p_oObject.id) {
            
                oSrcElement = document.getElementById(p_oObject.id);

            }
            else {

                // Create a new button from configuration object

                this._sType = p_oObject.type;
                this._oElement = this._createButtonDOM();

            }
        
        }


        var sSrcElementTagName;


        if(oSrcElement) {

            sSrcElementTagName = oSrcElement.tagName.toUpperCase();
        
            switch(sSrcElementTagName) {
            
                case "SPAN":

                    this.id = oSrcElement.id;

                    var oSpan = YAHOO.widget.Button._getFirstElement(oSrcElement);

                    if(oSpan) {

                        var oElement = YAHOO.widget.Button._getFirstElement(oSpan);

                        if(oElement) {

                            switch(oElement.tagName.toUpperCase()) {

                                case "INPUT":

                                    this._oElement = this._createButtonDOM();
                                    this._oElement.setAttribute("id", this.id);
                                    this._oSrcElement = oSrcElement;
                                    this._syncDOMPropertiesToButton(oElement);

                                break;
                            
                                case "A":
                                case "BUTTON":

                                    this._oButton = oElement;
                                    this._oElement = oSrcElement;
                                    this._oSrcElement = oSrcElement;
                                    this._syncDOMPropertiesToButton(oElement);
                                
                                break;
                            
                            }
                        
                        }

                    }
                
                break;

                case "BUTTON":
                case "INPUT":
                case "A":

                    if(sSrcElementTagName == "A") {

                        this._sType = "link";
                    
                    }

                    this._oElement = this._createButtonDOM();
                    this._oSrcElement = oSrcElement;
                    this._syncDOMPropertiesToButton(oSrcElement);

                break;
            
            }
        
        }


        if(this._oElement) {


            if(oConfigs) {

                if(oConfigs.type) {

                    this._sType = oConfigs.type;

                }

                this.setProperty("text", oConfigs.text, true);
                this.setProperty("value", oConfigs.value, true);
                this.setProperty("id", oConfigs.id, true);
                this.setProperty("name", oConfigs.name, true);
                this.setProperty("tabIndex", oConfigs.tabIndex, true);
                this.setProperty("title", oConfigs.title, true);
                this.setProperty("disabled", oConfigs.disabled, true);
                this.setProperty("imageSrc", oConfigs.imageSrc, true);
                this.setProperty("imageAlt", oConfigs.imageAlt, true);
                this.setProperty("textAlign", oConfigs.textAlign, true);
                this.setProperty("accessKey", oConfigs.accessKey, true);
                this.setProperty("URL", oConfigs.URL, true);
                this.setProperty("menu", oConfigs.menu, true);

                if(oConfigs.checked) {

                    this.setChecked(oConfigs.checked);

                }

            }


            if(!this.id) {
                
                this.setProperty("id", YAHOO.util.Dom.generateId());
            
            }

            YAHOO.widget.Button._buttons[this.id] = this;


            YAHOO.util.Dom.addClass(this._oElement, this.CSS_CLASS_NAME);

            if(this._sType == "menubutton") {

                YAHOO.util.Dom.addClass(this._oElement, "yuimenubutton");
            
            }

            if(this._sType == "splitbutton") {

                YAHOO.util.Dom.addClass(this._oElement, "yuisplitbutton");
            
            }

            this.renderEvent.subscribe(this._onElementRender, this, true);



        }
        
    },
    
    render: function(p_oTarget) {

        var oTarget = p_oTarget;

        if(this._isString(p_oTarget)) {

            oTarget = document.getElementById(p_oTarget);
        
        }

        if(oTarget) {

            if(this._oSrcElement) {

                this._oSrcElement.parentNode.removeChild(this._oSrcElement);

            }

            oTarget.appendChild(this._oElement);
        
        }
        else {
        
            if(this._oSrcElement) {

                this._oSrcElement.parentNode.replaceChild(this._oElement, this._oSrcElement);

            }                
        
        }


        if(this._oButton.form) {

            this.form = this._oButton.form;
        
        }


        this.renderEvent.fire();

    },

    destroy: function() {

        this.destroyEvent.fire();
    
    },
    
    focus: function() {

        if(!this.disabled) {

            if(YAHOO.widget.Button._activeButton) {
            
                YAHOO.widget.Button._activeButton.blur();
                
            }

            YAHOO.util.Dom.addClass(this._oElement, "focus");
    
            this._oButton.focus();

            this._bHasFocus = true;
            
            YAHOO.widget.Button._activeButton = this;

            this.focusEvent.fire();
        
        }

    },
    
    blur: function() {

        if(!this.disabled) {

            YAHOO.util.Dom.removeClass(this._oElement, "focus");
    

            if(this._sType == "splitbutton") {

                YAHOO.util.Dom.removeClass(this._oElement, "activemenu");

            }

            if(this._sType == "menubutton") {

                YAHOO.util.Dom.removeClass(this._oElement, "active");

            }


            this._oButton.blur();

            this._bHasFocus = false;

            if(YAHOO.widget.Button._activeButton == this) {
            
                YAHOO.widget.Button._activeButton = null;
            
            }

            var oMenu = this.getMenu();
            
            if(oMenu) {
            
                oMenu.hide();
            
            }

            this.blurEvent.fire();

        }

    },
    
    hasFocus: function() {

        return this._bHasFocus;
    
    }

};