(function() {

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.util.Lang,

    m_oActiveButton = null;


function getFirstElement(p_oElement) {

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

}


function setAttributesFromSrcElement(p_oElement, p_oAttributes) {


    function setAttributeFromDOMAttribute(p_sAttribute) {

        if(Lang.isUndefined(p_oAttributes[p_sAttribute])) {

            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because IE will return the innerText of a <BUTTON> for the 
                value attribute rather than the value of the "value" attribute.
            */
    
            var oAttribute = p_oElement.getAttributeNode(p_sAttribute);
    

            if(oAttribute && oAttribute.value && oAttribute.value.length > 0) {
            
                p_oAttributes[p_sAttribute] = oAttribute.value;
            
            }

        }
    
    }


    function setFormElementProperties() {

        setAttributeFromDOMAttribute("type");

        if(Lang.isUndefined(p_oAttributes.disabled)) {

            p_oAttributes.disabled = p_oElement.disabled;

        }

        setAttributeFromDOMAttribute("name");
        setAttributeFromDOMAttribute("value");
        setAttributeFromDOMAttribute("title");

    }


    var sSrcElementTagName = p_oElement.tagName.toUpperCase();


    if(Lang.isUndefined(p_oAttributes.label)) {

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

            if(Lang.isUndefined(p_oAttributes.checked)) {
    
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


function createHiddenField(p_sType, p_sName) {

    var oField,
        sType;

    switch(p_sType) {
    
        case "radio":
        case "checkbox":
            
            sType = p_sType;
            
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
            aTag[4] = p_sName;
            aTag[5] = "\"";
            
        }

        aTag[6] = ">";
        
        oField = document.createElement(aTag.join(""));
    
    }
    else {
    
        oField = document.createElement("input");
        oField.type = sType;
        oField.name = p_sName;

    }
    

    if(sType != "hidden") {

        oField.style.display = "none";

    }

    return oField;   

}


function createButtonElement(p_oAttributes) {

    var aTag = ["<span>"];

    if(p_oAttributes.type == "link") {

        aTag[1] = ["<a></a>"];    
    }
    else {

        aTag[1] = ["<button type=\"button\"></button>"];
    
    }

    aTag[2] = ["</span>"];


    var oSpan = document.createElement("span");

    oSpan.innerHTML = aTag.join("");


    return oSpan;

}


function initConfig(p_oConfig) {

    var oAttributes = p_oConfig.attributes,
        oSrcElement = oAttributes.srcelement,
        sSrcElementTagName = oSrcElement.tagName.toUpperCase();


    switch(sSrcElementTagName) {
    
        case "SPAN":

            p_oConfig.element = oSrcElement;


            if(Lang.isUndefined(oAttributes.id) && p_oConfig.element.id) {
            
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


function appendHiddenFieldToForm() {

    var oForm = this._oButton.form,
        oHiddenField = this._oHiddenField;

    if(oForm) {

        oForm.appendChild(oHiddenField);
    
    }

}


YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) { // Object literal representing the attributes of a button

        YAHOO.widget.Button.superclass.constructor.call(
            this,
            (createButtonElement.call(this, p_oElement)),
            p_oElement
        );

    }
    else {  // Source HTML element and optional set of attributes for a button

        var oConfig = {
        
            element: null,
            attributes: (p_oAttributes || {})
            
        };


        if(Lang.isString(p_oElement)) {

            var me = this;

            Event.onAvailable(p_oElement, function() {

                oConfig.attributes.srcelement = this;
                
                initConfig.call(me, oConfig);

                if(!oConfig.element) {
            
                    oConfig.element = 
                        createButtonElement.call(me, oConfig.attributes);
            
                }
            
            
                YAHOO.widget.Button.superclass.constructor.call(
                    me,
                    oConfig.element,
                    oConfig.attributes
                );

            });

        }
        else {

            oConfig.attributes.srcelement = p_oElement;
        
            initConfig.call(this, oConfig);


            if(!oConfig.element) {
        
                oConfig.element = 
                    createButtonElement.call(this, oConfig.attributes);
        
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

    init: function(p_oElement, p_oAttributes) {

        var sType = p_oAttributes.type,
            sTagName = sType == "link" ? "A" : "BUTTON",
            bCheckable = (sType == "radio" || sType == "checkbox"),
            oSrcElement = p_oAttributes.srcelement;


        this._oButton = p_oElement.getElementsByTagName(sTagName)[0];


        if(oSrcElement && bCheckable) {

            this._oHiddenField = oSrcElement;
            this._oHiddenField.style.display = "none";

        }
        else if(bCheckable || sType == "submit") {
    
            this._oHiddenField = 
                createHiddenField.call(this, sType, p_oAttributes.name);
        
        }


        YAHOO.widget.Button.superclass.init.call(
                this, p_oElement, 
                p_oAttributes
            );


        this.addClass(this.CSS_CLASS_NAME);
    

        Event.addListener(this._oButton, "focus", this._onFocus, this, true);
        Event.addListener(this._oButton, "blur", this._onBlur, this, true);
    
        this.addListener("mouseover", this._onMouseOver);
        this.addListener("mouseout", this._onMouseOut);
        this.addListener("mousedown", this._onMouseDown);
        this.addListener("mouseup", this._onMouseUp);


        this.createEvent("focus");
        this.createEvent("blur");


        var oContainer = this.get("container"),
            oElement = this.get("element"),
            me = this;


        if(oContainer) {

            if(Lang.isString(oContainer)) {


                function appendToContainer() {
    
                    this.appendChild(oElement);
    
                    if(bCheckable) {
    
                        appendHiddenFieldToForm.call(me);
    
                    }
    
                }


                Event.onAvailable(oContainer, appendToContainer);

            }
            else {

                oContainer.appendChild(oElement);

                if(bCheckable) {

                    appendHiddenFieldToForm.call(me);

                }

            }

        }
        else if(
            !Dom.inDocument(oElement) && 
            oSrcElement && 
            oSrcElement.tagName.toUpperCase() == "INPUT"
        ) {

            oSrcElement.parentNode.replaceChild(oElement, oSrcElement);

            if(bCheckable) {

                appendHiddenFieldToForm.call(me);

            }

        }
        else {

            if(bCheckable) {

                appendHiddenFieldToForm.call(me);

            }
        
        }

    },


    _oButton: null,
    
    
    _oHiddenField: null,


    CSS_CLASS_NAME: "yuibutton",


    initAttributes: function(p_oAttributes) {

        var oAttributes = p_oAttributes || {};

        YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);

        this.register("type", {

            value: oAttributes.type,
            validator: Lang.isString,
            writeOnce: true,
            method: function(p_sType) {

                switch(p_sType) {
                
                    case "checkbox":
                    case "radio":

                        if(
                            this._oHiddenField.type == "radio" ||
                            this._oHiddenField.type == "checkbox"
                        ) {
    
                            this.addListener("click", function(p_oEvent) {
    
                                this.set("checked", !(this.get("checked")) );
                            
                            });
    
                        }
                    
                    break;

                    case "submit":

                        this.addListener("click", function(p_oEvent) {

                            if(this._oButton.form) {

                                appendHiddenFieldToForm.call(this);

                                this._oButton.form.submit();
                            
                            }

                        }, this, true);
                    
                    break;

                    case "reset":

                        this.addListener("click", function(p_oEvent) {

                            if(this._oButton.form) {

                                this._oButton.form.reset();
                            
                            }

                        });

                    break;


                }

            }

        });


        this.register("label", {

            value: oAttributes.label,
            validator: Lang.isString,
            method: function(p_sLabel) {

                this._oButton.innerHTML = p_sLabel;                

            }

        });


        this.register("value", {

            value: oAttributes.value,
            validator: Lang.isString,
            method: function(p_oValue) {

                if(this.get("type") != "link" && this._oHiddenField) {
               
                    this._oHiddenField.value = p_oValue;
                
                }

            }

        });


        this.register("id", {

            value: oAttributes.id,
            validator: Lang.isString,
            method: function(p_sId) {

                this.get("element").id = p_sId;

            }

        });


        this.register("name", {

            value: oAttributes.name,
            validator: Lang.isString,
            method: function(p_sName) {

                if(this.get("type") != "link" && this._oHiddenField) {
               
                    this._oHiddenField.name = p_sName;
                
                }

            }

        });

    
        this.register("tabindex", {

            value: oAttributes.tabindex,
            validator: Lang.isNumber,
            method: function(p_nTabIndex) {

                this._oButton.tabIndex = p_nTabIndex;

            }

        });    
    

        this.register("title", {

            value: oAttributes.title,
            validator: Lang.isString,
            method: function(p_sTitle) {

                if(this.get("type") != "link") {
        
                    this._oButton.title = p_sTitle;
           
                }

            }

        });


        this.register("disabled", {

            value: oAttributes.disabled,
            validator: Lang.isBoolean,
            method: function(p_bDisabled) {

                if(this.get("type") != "link") {

                    var oHiddenField = this._oHiddenField;

                    if(p_bDisabled) {
            
                        if(this.hasFocus()) {
                        
                            this.blur();
                        
                        }
        
                        this._oButton.setAttribute("disabled", "disabled");
        
                        if(oHiddenField) {
        
                            oHiddenField.setAttribute("disabled", "disabled");
        
                        }
        
                        this.addClass("disabled");
        
                    }
                    else {
            
                        this._oButton.removeAttribute("disabled");
                        
                        if(oHiddenField) {
                        
                            oHiddenField.removeAttribute("disabled");
        
                        }
        
                        this.removeClass("disabled");
                    
                    }
           
                }

            }

        });


        this.register("accesskey", {

            value: oAttributes.accesskey,
            validator: Lang.isString,
            method: function(p_sAccessKey) {

                this._oButton.accessKey = p_sAccessKey;

            }

        });


        this.register("href", {

            value: oAttributes.href,
            validator: Lang.isString,
            method: function(p_sHref) {

                if(this.get("type") == "link") {
        
                    this._oButton.href = p_sHref;
                
                }

            }

        });


        this.register("target", {

            value: oAttributes.target,
            validator: Lang.isString,
            method: function(p_sTarget) {

                if(this.get("type") == "link") {
        
                    this._oButton.setAttribute("target", p_sTarget);
                
                }

            }

        });


        this.register("checked", {

            value: oAttributes.checked,
            validator: Lang.isBoolean,
            method: function(p_bChecked) {

                var sType = this.get("type"),
                    oHiddenField = this._oHiddenField;

                if(
                    (sType == "radio" || sType == "checkbox") && 
                    (
                        oHiddenField.type == "radio" ||
                        oHiddenField.type == "checkbox"
                    )
                ) {
        
                    if(p_bChecked) {
        
                        oHiddenField.checked = true;
                        this.addClass("active");
                    
                    }
                    else {
        
                        oHiddenField.checked = false;
                        this.removeClass("active");
                    
                    }
                
                }

            }

        });


        this.register("container", {

            value: oAttributes.container

        });


        this.register("srcelement", {

            value: oAttributes.srcelement,
            writeOnce: true

        });


    },
    

    _onFocus: function(p_oEvent) {

        this.addClass("focus");

        m_oActiveButton = this;

        this.fireEvent("focus");

    },
    

    _onBlur: function(p_oEvent) {

        this.removeClass("focus");

        m_oActiveButton = null;

    },


    _onMouseOver: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.addClass("hover");

        }

    },


    _onMouseOut: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.removeClass("hover");


            var sType = this.get("type");

            if(
                sType != "checkbox" && 
                sType != "radio" && 
                this.hasClass("active")
            ) {
    
                Event.addListener(
                            document, 
                            "mouseup", 
                            this._onDocumentMouseOut, 
                            this, 
                            true
                        );

            }

        }
        
    },


    _onDocumentMouseOut: function(p_oEvent) {
    
        this.removeClass("active");

        Event.removeListener(document, "mouseup", this.onDocumentMouseUp);

    },


    _onMouseDown: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.addClass("active");
        
        }
        
    },


    _onMouseUp: function(p_oEvent) {

        if(!this.get("disabled")) {

            this.removeClass("active");
        
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

        return (m_oActiveButton == this);
    
    },
    
    
    destroy: function() {

        var oElement = this.get("element"),
            oParentNode = oElement.parentNode;

        Event.purgeElement(oElement);

        oParentNode.removeChild(oElement);

    }

});

})();