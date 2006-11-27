(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;
var Lang = YAHOO.util.Lang;


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

    var me = this;


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


    function setImageAttributes() {

        if(
            Lang.isUndefined(p_oAttributes["imagesrc"]) &&
            Lang.isUndefined(p_oAttributes["imagealt"])
        ) {
        
            var aImg = p_oElement.getElementsByTagName("img");
            

            if(aImg.length == 1) {
    
                var oImg = aImg[0];
    
                me._oImage = oImg;
    
                p_oAttributes["imagesrc"] = oImg.src;
                p_oAttributes["imagealt"] = oImg.alt;
                            
            }
        
        }
    
    }


    function setFormElementProperties() {

        setAttributeFromDOMAttribute("type");

        if(Lang.isUndefined(p_oAttributes["disabled"])) {

            p_oAttributes["disabled"] = p_oElement.disabled;

        }

        setAttributeFromDOMAttribute("name");
        setAttributeFromDOMAttribute("value");
        setAttributeFromDOMAttribute("title");

    }


    var sSrcElementTagName = p_oElement.tagName.toUpperCase();


    if(Lang.isUndefined(p_oAttributes["text"])) {

        // Set the "text" property
    
        var sText = "";
    
    
        if(sSrcElementTagName == "INPUT") {
    
            sText = p_oElement.value;       
        
        }
        else {
    
            if(p_oElement.innerText) {
    
                sText = p_oElement.innerText;
    
            }
            else {
    
                var oRange = p_oElement.ownerDocument.createRange();
                oRange.selectNodeContents(p_oElement);
    
                sText = oRange.toString();
            
            }
    
        }
    
    
        if(sText && sText.length > 0) {
            
            p_oAttributes["text"] = sText;
            
        } 

    }


    setAttributeFromDOMAttribute("tabindex");
    setAttributeFromDOMAttribute("accesskey");


    switch(sSrcElementTagName) {
    
        case "A":
        
            p_oAttributes.type = "link";

            setAttributeFromDOMAttribute("href");
            setAttributeFromDOMAttribute("target");

            setImageAttributes();

        break;

        case "INPUT":

            setFormElementProperties();

            if(Lang.isUndefined(p_oAttributes["checked"])) {
    
                p_oAttributes["checked"] = p_oElement.checked;
    
            }

        break;

        case "BUTTON":

            setImageAttributes();

            setFormElementProperties();
            
            p_oElement.removeAttribute("name");
            p_oElement.removeAttribute("value");

            p_oElement.setAttribute("type", "button");

            var aChildNodes = p_oElement.childNodes;
            var i = aChildNodes.length - 1;

            do {
            
                if(aChildNodes[i].nodeType == 3) {
                
                    me._oText = aChildNodes[i];
                    break;
                
                }
            
            }
            while(i--);

        break;
    
    }

}


YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    var oElement;
    var oSrcElement;
    var oAttributes;


    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) { // Object literal representing the attributes of a button

        oAttributes = p_oElement;
        oSrcElement = oAttributes.element;

    }
    else {  // Element and optional set of attributes for a button

        oSrcElement = p_oElement;
        oAttributes = p_oAttributes || {};
    
    }


    if(oSrcElement) {


        if(Lang.isString(oSrcElement)) {

            oSrcElement = document.getElementById(oSrcElement);

        }


        oAttributes["srcelement"] = oSrcElement;


        switch(oSrcElement.tagName.toUpperCase()) {
        
            case "SPAN":

                oElement = oSrcElement;


                if(Lang.isUndefined(oAttributes["id"]) && oElement.id) {
                
                    oAttributes["id"] = oElement.id;
                
                }


                var oSpan = getFirstElement(oElement);


                if(oSpan) {


                    var oButton = getFirstElement(oSpan);


                    if(oButton) {


                        switch(oButton.tagName.toUpperCase()) {

                            case "INPUT":

                                this._oHiddenField = oButton;


                                if(Dom.inDocument(oButton)) {

                                    oButton.parentNode.removeChild(oButton);

                                }


                                setAttributesFromSrcElement.call(this, oButton, oAttributes);

                            break;

                            case "A":
                            case "BUTTON":

                                this._oButton = oButton;

                                setAttributesFromSrcElement.call(this, oButton, oAttributes);
                            
                            break;
                        
                        }
                    
                    }

                }
            
            break;

            case "INPUT":
            
                this._oHiddenField = oSrcElement;


                if(Dom.inDocument(oSrcElement)) {

                    oSrcElement.parentNode.removeChild(oSrcElement);

                }

                setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);

            break;

            case "BUTTON":
            case "A":

                this._oButton = oSrcElement;

                setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);

            break;
        
        }

    }


    if(!oElement) {

        oElement = this._createButtonElement();

    }


    YAHOO.widget.Button.superclass.constructor.call(
        this,
        oElement,
        oAttributes
    );

};

YAHOO.extend(YAHOO.widget.Button, YAHOO.util.Element, {

    initAttributes: function(p_oAttributes) {

        var oAttributes = p_oAttributes || {};


        YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);


        this.register("type", {

            value: oAttributes.type,
            validator: Lang.isString,
            writeOnce: true

        });


        this.register("text", {

            value: oAttributes.text,
            validator: Lang.isString,
            method: function(p_sText) {

                this._oText.nodeValue = p_sText;                

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
            method: function(value) {

                if(this.get("type") != "link") {
        
                    if(value) {
            
                        if(this.hasFocus()) {
                        
                            this.blur();
                        
                        }
        
                        this._oButton.setAttribute("disabled", "disabled");
        
                        if(this._oHiddenField) {
        
                            this._oHiddenField.setAttribute("disabled", "disabled");
        
                        }
        
                        Dom.addClass(this.get("element"), "disabled");
        
                    }
                    else {
            
                        this._oButton.removeAttribute("disabled");
                        
                        if(this._oHiddenField) {
                        
                            this._oHiddenField.removeAttribute("disabled");
        
                        }
        
                        Dom.removeClass(this.get("element"), "disabled");
                    
                    }
           
                }

            }

        });


        this.register("imagesrc", {

            value: oAttributes.imagesrc,
            validator: Lang.isString,
            method: function(p_sImageSrc) {

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

            }

        });


        this.register("imagealt", {

            value: oAttributes.imagealt,
            validator: Lang.isString,
            method: function(p_sImageAlt) {

                var oImage = this._oImage;
                
                if(oImage) {
        
                    oImage.alt = p_sImageAlt;
                
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


        this.register("textalign", {

            value: oAttributes.textalign,
            validator: Lang.isString,
            method: function(p_sTextAlign) {

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

            }

        });


        this.register("checked", {

            value: oAttributes.checked,
            validator: Lang.isBoolean,
            method: function(p_bChecked) {

                var sType = this.get("type");

                if((sType == "radio" || sType == "checkbox") && this._oHiddenField) {
        
                    if(p_bChecked) {
        
                        this._oHiddenField.checked = true;
                        Dom.addClass(this._oElement, "active");
                    
                    }
                    else {
        
                        this._oHiddenField.checked = false;
                        Dom.removeClass(this._oElement, "active");
                    
                    }
                
                }

            }

        });


        this.register("menu", {

            value: oAttributes.menu,
            method: function(p_oObject) {

                var oElement;
        
                if(p_oObject instanceof YAHOO.widget.Menu) {
        
                    this._oMenu = p_oObject;
        
                }
                else if(this._isArray(p_oObject)) {
                
                    this._oMenuDataSrc = p_oObject;
                
                }
                else if(this._isString(p_oObject)) {
                
                    oElement = document.getElementById(p_oObject);
        
                }
                else if(p_oObject.tagName) {
        
                    oElement = p_oObject;     
                
                }
        
        
        
                if(this._oMenu || oElement) {
        
                    if(oElement) {
        
                        this._oMenuDataSrc = oElement;
            
                        if(oElement.tagName.toUpperCase() == "SELECT") {
                
                            oElement.style.display = "none";
        
                            this._oSelectElement = oElement;
                        
                        }
                    
                    }
            
                    YAHOO.util.Dom.addClass(this._oElement, ("yui" + this._sType));
        
                }

            }

        });



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

    _createButtonElement: function() {

        if(!this._oButton) {

            var sTagName = (this.get("type") == "link") ? "a" : "button";
            var oButton = document.createElement(sTagName);
    
            if(sTagName == "button") {
    
                oButton.setAttribute("type", "button");
            
            }

            this._oButton = oButton;

        }


        if(!this._oText) {

            var oText = document.createTextNode("");
    
            this._oButton.appendChild(oText);

            this._oText = oText;
        
        }


        var oOuterSpan = document.createElement("span");
        var oInnerSpan = document.createElement("span");

        oInnerSpan.appendChild(this._oButton);
        oOuterSpan.appendChild(oInnerSpan);

        return oOuterSpan;
        
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



            if(this._oMenuDataSrc && !this._oMenu) {

                var sTagName = this._oMenuDataSrc.tagName;

                if(sTagName && sTagName.toUpperCase() == "SELECT") {

                    this._oMenu = new YAHOO.widget.Menu(this._oMenuDataSrc);
                    this._oMenu.render(this._oElement.parentNode);

                }
                else if(this._isArray(this._oMenuDataSrc)) {

                    this._oMenu = new YAHOO.widget.Menu(YAHOO.util.Dom.generateId());

                    var aItems = this._oMenuDataSrc;
                    var nItems = aItems.length;
                    
                    for(var i=0; i<nItems; i++) { 

                        this._oMenu.addItem(aItems[i]);
                    
                    }
                    
                    this._oMenu.render(this._oElement.parentNode);
                
                }
            
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



    focus: function() {

        if(!this.get("disabled")) {

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

        if(!this.get("disabled")) {

            Dom.removeClass(this.get("element"), "focus");
    

            if(this.get("type") == "splitbutton") {

                YAHOO.util.Dom.removeClass(this.get("element"), "activemenu");

            }

            if(this.get("type") == "menubutton") {

                YAHOO.util.Dom.removeClass(this.get("element"), "active");

            }


            this._oButton.blur();

//             this._bHasFocus = false;
// 
//             if(YAHOO.widget.Button._activeButton == this) {
//             
//                 YAHOO.widget.Button._activeButton = null;
//             
//             }
// 
//             var oMenu = this.getMenu();
//             
//             if(oMenu) {
//             
//                 oMenu.hide();
//             
//             }
// 
//             this.blurEvent.fire();

        }

    },


    hasFocus: function() {

        return this._bHasFocus;
    
    },
    
    render: function() {

        document.body.appendChild(this.get("element"));
    
    }

});

})();