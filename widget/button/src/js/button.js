(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.util.Lang,


    // Private member variables

    m_oButtons = {},
    m_oFocusedButton = null;



// Private methods


function getFirstElement(p_oElement) {

    var oFirstChild = p_oElement.firstChild;

    if(oFirstChild) {

        if(oFirstChild.nodeType == 1) {

            return oFirstChild;

        }
        else {

            var oNextSibling = oFirstChild.nextSibling;

            if(oNextSibling.nodeType == 1) {
            
                return oNextSibling;
            
            }

        }

    }

}


function setAttributesFromSrcElement(p_oElement, p_oAttributes) {


    function setAttributeFromDOMAttribute(p_sAttribute) {

        if( !(p_sAttribute in p_oAttributes) ) {

            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because IE will return the innerText of a <BUTTON> for the 
                value attribute rather than the value of the "value" attribute.
            */
    
            var oAttribute = p_oElement.getAttributeNode(p_sAttribute);
    

            if(oAttribute && ("value" in oAttribute)) {

                p_oAttributes[p_sAttribute] = oAttribute.value;

            }

        }
    
    }


    function setFormElementProperties() {

        setAttributeFromDOMAttribute("type");

        if( !("disabled" in p_oAttributes) ) {

            p_oAttributes.disabled = p_oElement.disabled;

        }

        setAttributeFromDOMAttribute("name");
        setAttributeFromDOMAttribute("value");
        setAttributeFromDOMAttribute("title");

    }


    var sSrcElementTagName = p_oElement.tagName.toUpperCase();


    if( !("label" in p_oAttributes) ) {

        // Set the "label" property
    
        var sText = sSrcElementTagName == "INPUT" ? 
                        p_oElement.value : p_oElement.innerHTML;
    
    
        if(sText && sText.length > 0) {
            
            p_oAttributes.label = sText;
            
        } 

    }


    setAttributeFromDOMAttribute("tabindex");
    setAttributeFromDOMAttribute("accesskey");


    switch(sSrcElementTagName) {
    
        case "A":
        
            p_oAttributes.type = "link";

            setAttributeFromDOMAttribute("href");
            setAttributeFromDOMAttribute("target");

        break;

        case "INPUT":

            setFormElementProperties();

            if( !("checked" in p_oAttributes) ) {
    
                p_oAttributes.checked = p_oElement.checked;
    
            }

        break;

        case "BUTTON":

            setFormElementProperties();
            
            p_oElement.removeAttribute("name");
            p_oElement.removeAttribute("value");

            p_oElement.setAttribute("type", "button");

        break;
    
    }

}


function initConfig(p_oConfig) {

    var oAttributes = p_oConfig.attributes,
        oSrcElement = oAttributes.srcelement,
        sSrcElementTagName = oSrcElement.tagName.toUpperCase();


    switch(sSrcElementTagName) {
    
        case "SPAN":

            p_oConfig.element = oSrcElement;


            if( !("id" in oAttributes) && p_oConfig.element.id) {
            
                oAttributes.id = p_oConfig.element.id;
            
            }

            var oSpan = getFirstElement(p_oConfig.element);


            if(oSpan) {

                var oButton = getFirstElement(oSpan);


                if(oButton) {

                    var sButtonTagName = oButton.tagName.toUpperCase();


                    if(sButtonTagName == "A" || sButtonTagName == "BUTTON") {

                        setAttributesFromSrcElement.call(
                                this, 
                                oButton, 
                                oAttributes
                            );
                    
                    }
                
                }

            }
        
        break;

        case "INPUT":

            setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);

        break;
    
    }

}



//  Constructor


YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) { // Object literal representing the attributes of a button

        YAHOO.widget.Button.superclass.constructor.call(
            this,
            (this._createButtonElement(p_oElement)),
            p_oElement
        );

    }
    else {  // Source HTML element and optional set of attributes for a button


        var oSrcElement = Lang.isString(p_oElement) ? 
                            document.getElementById(p_oElement) : p_oElement;

        if(oSrcElement) {

            var oConfig = {
            
                element: null,
                attributes: (p_oAttributes || {})
                
            };
    
   
            oConfig.attributes.srcelement = oSrcElement;
    
            initConfig.call(this, oConfig);
    
    
            if(!oConfig.element) {
        
                oConfig.element = 
                    this._createButtonElement(oConfig.attributes);
        
            }
        
        
            YAHOO.widget.Button.superclass.constructor.call(
                this,
                oConfig.element,
                oConfig.attributes
            );
        
        }

    }

};


YAHOO.extend(YAHOO.widget.Button, YAHOO.util.Element, {


    _oButton: null,
    _oMenu: null,
    _oCommand: null,

    _bActivationKeyPressed: false,
    _bActivationButtonPressed: false,

    _bHasBlurHandler: false,
    _bHasKeyDownHandler: false,
    _bHasMouseOutHandler: false,
    _bHasMouseDownHandler: false,
    _bHasMouseUpHandler: false,
    _bHasKeyUpHandler: false,
    _bCheckable: false,


    ACTIVATION_BUTTON: 1,
    CHECK_ACTIVATION_KEYS: [32],
    ACTIVATION_KEYS: [13, 32],
    OPTION_AREA_WIDTH: 20,

    CSS_CLASS_NAME: "yuibutton",


    
    // Protected attribute setter methods


    _setType: function(p_sType) {

        this._bCheckable = (p_sType == "checkbox" || p_sType == "radio");
        
        if(p_sType == "splitbutton") {

            this.addListener("option", this._showMenu);

        }
    
    },


    _setLabel: function(p_sLabel) {

        this._oButton.innerHTML = p_sLabel;                

    },


    _setTabIndex: function(p_nTabIndex) {

        this._oButton.tabIndex = p_nTabIndex;

    },


    _setTitle: function(p_sTitle) {

        if(this.get("type") != "link") {

            this._oButton.title = p_sTitle;
   
        }

    },


    _setDisabled: function(p_bDisabled) {

        if(this.get("type") != "link") {

            if(p_bDisabled) {
    
                if(this.hasFocus()) {
                
                    this.blur();
                
                }

                this._oButton.setAttribute("disabled", "disabled");

                this.addClass("disabled");

            }
            else {
    
                this._oButton.removeAttribute("disabled");

                this.removeClass("disabled");
            
            }
   
        }

    },


    _setAccessKey: function(p_sAccessKey) {

        this._oButton.accessKey = p_sAccessKey;

    },


    _setHref: function(p_sHref) {

        if(this.get("type") == "link") {

            this._oButton.href = p_sHref;
        
        }

    },


    _setTarget: function(p_sTarget) {

        if(this.get("type") == "link") {

            this._oButton.setAttribute("target", p_sTarget);
        
        }

    },


    _setChecked: function(p_bChecked) {

        if(this._bCheckable) {

            if(p_bChecked) {

                this.addClass("checked");
            
            }
            else {

                this.removeClass("checked");
            
            }
        
        }

    },


    _setCommand: function(p_oCommand) {

        /*
            Remove any existing listeners if a command has already 
            been specified.
        */

        if(this._oCommand && (this._oCommand != p_oCommand)) {

            this.removeListener("command", this._oCommand.fn);

            this._oCommand = null;

        }


        if(
            !this._oCommand && 
            Lang.isObject(p_oCommand) && 
            ("fn" in p_oCommand) && 
            Lang.isFunction(p_oCommand.fn)
        ) {

            this.addListener(
                    "command", 
                    p_oCommand.fn, 
                    p_oCommand.obj, 
                    p_oCommand.scope
                );

            this._oCommand = p_oCommand;

        }
    
    },


    _setMenu: function(p_oMenu) {

        var oMenu;

        if(p_oMenu instanceof YAHOO.widget.Menu) {

            oMenu = p_oMenu;

        }
        else if(Lang.isArray(p_oMenu)) {

            oMenu = new YAHOO.widget.Menu(Dom.generateId());

            oMenu.addItems(p_oMenu);
           
        }
        else if(Lang.isString(p_oMenu) || (p_oMenu && p_oMenu.nodeName)) {

            oMenu = new YAHOO.widget.Menu(p_oMenu);
        
        }


        if(oMenu) {

            oMenu.showEvent.subscribe(this._onMenuShow, this, true);

            var oSrcElement = oMenu.srcElement;

            if(oSrcElement && oSrcElement.tagName.toUpperCase() == "SELECT") {

                oSrcElement.style.display = "none";


                // subscribe to the command events            

                var aItems = oMenu.getItems(),
                    nItems = aItems.length,
                    oItem;

                if(nItems > 0) {

                    var i = nItems - 1;

                    do {

                        oItem = aItems[i];

                        if(oItem) {

                            oItem.cfg.setProperty("command", {
                            
                                fn: this._onMenuItemCommand,
                                obj: oItem,
                                scope: this
                            
                            });

                        }
                    
                    }
                    while(i--);

                }

            }
        
            this.addListener("appendTo", this._onAppendTo);
 
            this._oMenu = oMenu;
 
        }
        else {

            this._oMenu = null;

        }

    },



    // Protected methods


    _createButtonElement: function(p_oAttributes) {
    
        var sTag = p_oAttributes.type == "link" ? 
                        "<a></a>" : "<button type=\"button\"></button>",
    
            oSpan = document.createElement("span");
    
        oSpan.innerHTML = "<span>" + sTag + "</span>";
    
    
        return oSpan;
    
    },


    _createHiddenField: function () {
    
        var oField,
            sType = this._bCheckable ? this.get("type") : "hidden";
    
        if(navigator.userAgent.indexOf("MSIE") != -1) {
    
            oField = document.createElement(
                                "<input type=\"" + sType + "\" name=\" \">"
                            );
        
        }
        else {
        
            oField = document.createElement("input");
            oField.type = sType;
    
        }
    
    
        oField.name = this.get("name");
        oField.value = this.get("value");
    
        if(this._bCheckable) {
    
            oField.checked = this.get("checked");
            oField.style.display = "none";        
        }
    
        return oField;   
    
    },


    _appendHiddenFieldToForm: function () {
    
        if(!this.get("disabled")) {
    
            var oForm = this.getForm(),
                oHiddenField = this._createHiddenField();
        
            if(oForm) {
        
                oForm.appendChild(oHiddenField);
            
            }
    
        }
    
    },


    _isActivationKey: function(p_nKeyCode) {

        var aKeyCodes = this._bCheckable ? 
                this.CHECK_ACTIVATION_KEYS : this.ACTIVATION_KEYS,

            nKeyCodes = aKeyCodes.length;

        if(nKeyCodes > 0) {

            var i = nKeyCodes - 1;

            do {

                if(p_nKeyCode == aKeyCodes[i]) {

                    return true;

                }

            }
            while(i--);
        
        }

    },


    _showMenu: function() {

        var oMenu = this._oMenu;

        if(oMenu) {

            YAHOO.widget.MenuManager.hideVisible();

            oMenu.cfg.applyConfig({
                    context:[this.get("id"), "tl", "bl"], 
                    clicktohide: false, 
                    visible: true 
                });
                
            oMenu.cfg.fireQueue();

        }            
    
    },


    _submitForm: function() {

        var oForm = this.getForm();

        if(oForm) {

            YAHOO.widget.Button.addHiddenFieldsToForm(oForm);

            this._appendHiddenFieldToForm();
            
            oForm.submit();
        
        }
    
    },


    _fireCommandEvent: function(p_oEvent) {

        if(this.isActive()) {

            this.fireEvent("command", p_oEvent);
        
        }
    
    },



    // Protected event handlers


    _onMouseOver: function(p_oEvent) {

        if(!this.get("disabled")) {

            if(!this._bHasMouseOutHandler && !this._bHasMouseDownHandler) {

                this.addListener("mouseout", this._onMouseOut);
                this.addListener("mousedown", this._onMouseDown);

                this._bHasMouseOutHandler = true;
                this._bHasMouseDownHandler = true;

            }

            this.addClass("hover");

            if(this._bActivationButtonPressed) {

                this.addClass("active");

            }

        }

    },


    _onMouseOut: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.removeClass("hover");

            this.removeClass("active");


            if(this._bActivationButtonPressed) {

                Event.addListener(
                            document, 
                            "mouseup", 
                            this._onDocumentMouseUp, 
                            this, 
                            true
                        );

            }

        }
        
    },


    _onDocumentMouseUp: function(p_oEvent) {
    
        this._bActivationButtonPressed = false;

        Event.removeListener(document, "mouseup", this._onDocumentMouseUp);

    },


    _onMouseDown: function(p_oEvent) {

        if(!this.get("disabled")) {

            if(!this._bHasMouseUpHandler) {

                this.addListener("mouseup", this._onMouseUp);

                this._bHasMouseUpHandler = true;
                
            }


            if((p_oEvent.which || p_oEvent.button) == this.ACTIVATION_BUTTON) {

        
                var sClassName;

                if(this.get("type") == "splitbutton") {
                
                    var oElement = this.get("element"),
                        nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);

                    if(
                        (
                            oElement.offsetWidth - 
                            this.OPTION_AREA_WIDTH
                        ) < nX
                    ) {

                        sClassName = "activemenu";
                        
                        this.fireEvent("option");

                    }
                    else {

                        sClassName = "active";

                    }
        
                }
                else {
        
                    sClassName = "active";
                
                }


                this.addClass(sClassName);
    
                this._bActivationButtonPressed = true;
            
            }

        }
        
    },


    _onMouseUp: function(p_oEvent) {

        if(!this.get("disabled")) {

            this._fireCommandEvent(p_oEvent);

            this.removeClass("active");
            
            if(this.get("type") == "splitbutton") {

                this.removeClass("activemenu");                

            }
            
            this._bActivationButtonPressed = false;
        
        }
        
    },


    _onFocus: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.addClass("focus");
    
            if(this._bActivationKeyPressed) {
    
                this.addClass("active");
           
            }
    
            m_oFocusedButton = this;
    
    
            if(!this._bHasBlurHandler && !this._bHasKeyDownHandler) {
    
                Event.addListener(
                        this._oButton, 
                        "blur", 
                        this._onBlur, 
                        this, 
                        true
                    );

                Event.addListener(
                        this._oButton, 
                        "keydown", 
                        this._onKeyDown, 
                        this, 
                        true
                    );
    
                this._bHasBlurHandler = true;
                this._bHasKeyDownHandler = true;
    
            }
    
    
            this.fireEvent("focus");

        }

    },
    

    _onBlur: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.removeClass("focus");
            this.removeClass("active");
    
    
            if(this._bActivationKeyPressed) {
    
                Event.addListener(
                            document, 
                            "keyup", 
                            this._onDocumentKeyUp, 
                            this, 
                            true
                        );
    
            }
    
    
            m_oFocusedButton = null;
    
            this.fireEvent("blur");

        }
       
    },


    _onDocumentKeyUp: function(p_oEvent) {

        if(this._isActivationKey(p_oEvent.keyCode)) {

            this._bActivationKeyPressed = false;
            
            Event.removeListener(document, "keyup", this._onDocumentKeyUp);
        
        }
    
    },


    _onKeyDown: function(p_oEvent) {

        if(!this.get("disabled")) {

            if(this._isActivationKey(p_oEvent.keyCode)) {

                this._bActivationKeyPressed = true;
                
                this.addClass("active");
            
            }

    
            if(!this._bHasKeyUpHandler) {
    
                Event.addListener(
                        this._oButton, 
                        "keyup", 
                        this._onKeyUp, 
                        this, 
                        true
                    );
    
                this._bHasKeyUpHandler = true;
            
            }

        }

    },


    _onKeyUp: function(p_oEvent) {

        if(!this.get("disabled")) {

            if(this._isActivationKey(p_oEvent.keyCode)) {

                this._fireCommandEvent(p_oEvent);
    
                this._bActivationKeyPressed = false;
    
                this.removeClass("active");


                if(this.get("type") == "splitbutton") {
    
                    this.removeClass("activemenu");                
    
                }

            }

        }

    },


    _onCommand: function(p_oEvent) {

        var sType = this.get("type");

        switch(sType) {
        
            case "checkbox":
            case "radio":

                this.set("checked", !(this.get("checked")));
            
            break;

            case "submit":

                this._submitForm();
            
            break;

            case "reset":

                var oForm = this.getForm();

                if(oForm) {

                    oForm.reset();
                
                }

            break;

            case "menubutton":

                this._showMenu();

            break;

            case "splitbutton":

                if(this._oMenu) {

                    this._oMenu.hide();

                }

                var oSrcElement = this.get("srcelement");

                if(oSrcElement && oSrcElement.type == "submit") {

                    this._submitForm();
                
                }
            
            break;

        }
    
    },

    
    _onDocumentMouseDown: function(p_oEvent, p_oButton) {

        var oTarget = Event.getTarget(p_oEvent),
            oButtonElement = this.get("element"),
            oMenuElement = this._oMenu.element;

        if(
            oTarget != oButtonElement && 
            !Dom.isAncestor(oButtonElement, oTarget) && 
            oTarget != oMenuElement && 
            !Dom.isAncestor(oMenuElement, oTarget)
        ) {

            this._oMenu.hide();
            
            Event.removeListener(
                    document, 
                    "mousedown", 
                    this._onDocumentMouseDown
                );    
        
        }

    },
    

    _onMenuShow: function(p_sType, p_aArgs, p_oButton) {

        Event.addListener(
            document, 
            "mousedown", 
            this._onDocumentMouseDown, 
            this, 
            true
        );
    
    },


    _onMenuItemCommand: function(p_sType, p_aArgs, p_oItem) {

        this._oMenu.srcElement.selectedIndex = p_oItem.index;

        if(this.get("srcelement").type == "submit") {

            this._submitForm();

        }

    },


    _onAppendTo: function() {

        this._oMenu.render(this.get("element").parentNode);   
    
    },



    // Public methods
    

    init: function(p_oElement, p_oAttributes) {

        var sTagName = p_oAttributes.type == "link" ? "A" : "BUTTON",
            oSrcElement = p_oAttributes.srcelement;


        this._oButton = p_oElement.getElementsByTagName(sTagName)[0];


        YAHOO.widget.Button.superclass.init.call(
                this, p_oElement, 
                p_oAttributes
            );


        var sId = this.get("id");

        if(!sId) {

            sId = Dom.generateId();

            this.set("id", sId);

        }

        m_oButtons[sId] = this;


        this.addClass(this.CSS_CLASS_NAME);
        this.addClass(this.get("type"));
    

        Event.addListener(this._oButton, "focus", this._onFocus, this, true);

        this.addListener("mouseover", this._onMouseOver);
        this.addListener("command", this._onCommand);


        /**
        * Fires when the button recieves focus.
        * @event focus
        */

        /**
        * Fires when the button loses focus.
        * @event blur
        */        

        /**
        * Fires when the button loses focus.
        * @event command
        */        

        var oContainer = this.get("container"),
            oElement = this.get("element");


        if(oContainer) {

            if(Lang.isString(oContainer)) {

                var me = this;

                function appendToContainer() {
                   
                    me.appendTo(this);
    
                }


                Event.onAvailable(oContainer, appendToContainer);

            }
            else {

                this.appendTo(oContainer);

            }

        }
        else if(
            !Dom.inDocument(oElement) && 
            oSrcElement && 
            oSrcElement.tagName.toUpperCase() == "INPUT"
        ) {

            this.appendTo(oSrcElement.parentNode);
            oSrcElement.parentNode.removeChild(oSrcElement);

        }

    },


    initAttributes: function(p_oAttributes) {

        var oAttributes = p_oAttributes || {};

        YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);


        this.register("type", {

            value: oAttributes.type,
            validator: Lang.isString,
            writeOnce: true,
            method: this._setType

        });


        this.register("label", {

            value: oAttributes.label,
            validator: Lang.isString,
            method: this._setLabel

        });


        this.register("value", {

            value: oAttributes.value

        });


        this.register("name", {

            value: oAttributes.name,
            validator: Lang.isString

        });

    
        this.register("tabindex", {

            value: oAttributes.tabindex,
            validator: Lang.isNumber,
            method: this._setTabIndex

        });


        this.configureAttribute("title", {

            value: oAttributes.title,
            validator: Lang.isString,
            method: this._setTitle

        });


        this.register("disabled", {

            value: oAttributes.disabled,
            validator: Lang.isBoolean,
            method: this._setDisabled

        });


        this.register("accesskey", {

            value: oAttributes.accesskey,
            validator: Lang.isString,
            method: this._setAccessKey

        });


        this.register("href", {

            value: oAttributes.href,
            validator: Lang.isString,
            method: this._setHref

        });


        this.register("target", {

            value: oAttributes.target,
            validator: Lang.isString,
            method: this._setTarget

        });


        this.register("checked", {

            value: oAttributes.checked,
            validator: Lang.isBoolean,
            method: this._setChecked

        });


        this.register("container", {

            value: oAttributes.container

        });


        this.register("srcelement", {

            value: oAttributes.srcelement,
            writeOnce: true

        });


        this.register("command", {

            value: oAttributes.command,
            method: this._setCommand
        
        });


        this.register("menu", {

            value: null,
            method: this._setMenu
        
        });

    },


    /**
    * Appends the HTMLElement into either the supplied parentNode.
    * @method appendTo
    * @param {HTMLElement | Element} parentNode The node to append to
    * @param {HTMLElement | Element} before An optional node to insert before
    */
    appendTo: function(parent, before) {

        YAHOO.widget.Button.superclass.appendTo.call(this, parent, before);

        if(this.get("element").parentNode) {

            this.fireEvent("appendTo");
        
        }

    },


    focus: function() {

        if(!this.get("disabled")) {
    
            this._oButton.focus();
        
        }

    },
    

    blur: function() {

        if(!this.get("disabled")) {

            this._oButton.blur();

        }

    },


    hasFocus: function() {

        return (m_oFocusedButton == this);
    
    },


    isActive: function() {

        return this.hasClass("active");
    
    },


    getForm: function() {

        return this._oButton.form;
    
    },
    

    destroy: function() {

        var oElement = this.get("element"),
            oParentNode = oElement.parentNode;

        Event.purgeElement(oElement);

        oParentNode.removeChild(oElement);
        
        delete m_oButtons[this.get("id")];

    },
    

    /**
    * @method toString
    * @description Returns a string representing the button.
    * @return {String}
    */
    toString: function() {
    
        return ("Button " + this.get("id"));
    
    }

});


YAHOO.widget.Button.addHiddenFieldsToForm = function(p_oForm) {

    var aButtons = Dom.getElementsByClassName("yuibutton", "span", p_oForm),
        nButtons = aButtons.length;


    if(nButtons > 0) {

        var oButton,
            sType;

        for(var i=0; i<nButtons; i++) {

            oButton = m_oButtons[aButtons[i].id];
            sType = oButton.get("type");


            if(sType == "radio" || sType == "checkbox") {

                oButton._appendHiddenFieldToForm();
            
            }
        
        }

    }

};


})();