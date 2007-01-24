(function() {

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.util.Lang;


YAHOO.widget.ButtonGroup = function(p_oElement, p_oAttributes) {

    var oElement;

    if(Lang.isString(p_oElement)) {

        oElement = document.getElementById(p_oElement);

        if(!oElement) {
        
            oElement = this._createGroupElement(oElement);

        }

    }
    else {

        var sNodeName = p_oElement.nodeName;

        if(sNodeName && sNodeName == this.TAG_NAME) {

            oElement = p_oElement;

        }

    }


    if(oElement) {

        if(!oElement.id) {

            oElement.id = Dom.generateId();

        }

        YAHOO.widget.ButtonGroup.superclass.constructor.call(
            this,
            oElement,
            p_oAttributes
        );

    }

};


YAHOO.extend(YAHOO.widget.ButtonGroup, YAHOO.util.Element, {

    TAG_NAME: "div",

    CSS_CLASS_NAME: "yuibuttongroup",

    _oButtons: null,

    _aButtons: null,

    _checkedButton: null,
    

    _createGroupElement: function(p_oAttributes) {
    
        var oElement = document.createElement(this.TAG_NAME);

        oElement.className = this.CSS_CLASS_NAME;
    
        return oElement;
    
    },


    _setDisabled: function(p_bDisabled) {

        var nButtons = this.getCount();

        if(nButtons > 0) {

            var i = nButtons - 1;
            
            do {

                this._aButtons[i].set("disabled", p_bDisabled);
            
            }
            while(i--);

        }

    },


    init: function(p_oElement, p_oAttributes) {

        this._aButtons = [];
        this._oButtons = {};

        YAHOO.widget.ButtonGroup.superclass.init.call(
                this, p_oElement, 
                p_oAttributes
            );


        var aButtons = this.getElementsByClassName("yuibutton");


        if(aButtons.length > 0) {

            this.addButtons(aButtons);

        }


        function isRadioButton(p_oElement) {

            return (p_oElement.type == "radio");

        }

        aButtons = 
            Dom.getElementsBy(isRadioButton, "input", this.get("element"));


        if(aButtons.length > 0) {

            this.addButtons(aButtons);

        }

        this.addListener("keydown", this._onKeyDown);

    },


    initAttributes: function(p_oAttributes) {

        var oAttributes = p_oAttributes || {};

        YAHOO.widget.ButtonGroup.superclass.initAttributes.call(
            this, 
            oAttributes
        );

        this.setAttributeConfig("name", {

            value: null,
            validator: Lang.isString

        });

        this.setAttributeConfig("disabled", {

            value: false,
            validator: Lang.isBoolean,
            method: this._setDisabled

        });

        this.setAttributeConfig("value", {

            value: null

        });

    },


    _onKeyDown: function(p_oEvent) {
    
        var oTarget = Event.getTarget(p_oEvent),
            nCharCode = Event.getCharCode(p_oEvent),
            sId = oTarget.parentNode.parentNode.id,
            oButton = this._oButtons[sId],
            nIndex = -1;


        if(nCharCode == 37 || nCharCode == 38) {

            nIndex = (oButton.index === 0) ? 
                        (this._aButtons.length -1) : (oButton.index - 1);
        
        }
        else if(nCharCode == 39 || nCharCode == 40) {

            nIndex = (oButton.index === (this._aButtons.length - 1)) ? 
                        0 : (oButton.index + 1);

        }


        if(nIndex > -1) {

            this.check(nIndex);
            this.getButton(nIndex).focus();
        
        }        
    
    },
    

    _onCheckedChange: function(p_oEvent, p_oButton) {

        var bChecked = p_oEvent.newValue,
            oCheckedButton = this._checkedButton;

        if(bChecked && oCheckedButton != p_oButton) {

            if(oCheckedButton) {

                oCheckedButton.set("checked", false, true);

            }


            this._checkedButton = p_oButton;
            
            this.set("value", p_oButton.get("value"));

        }
        else if(!oCheckedButton.set("checked")) {

            oCheckedButton.set("checked", true, true);
    
        }
       
    },

    addButton: function(p_oButton) {

        var oButton;

        if(
            p_oButton instanceof YAHOO.widget.Button && 
            p_oButton.get("type") == "radio"
        ) {

            oButton = p_oButton;

        }
        else if(!Lang.isString(p_oButton) && !p_oButton.nodeName) {

            p_oButton.type = "radio";

            oButton = new YAHOO.widget.Button(p_oButton);
        
        }
        else {

            oButton = new YAHOO.widget.Button(p_oButton, { type: "radio" });

        }


        if(oButton) {

            var nIndex = this._aButtons.length,
                sButtonName = oButton.get("name"),
                sGroupName = this.get("name");

            oButton.index = nIndex;

            this._aButtons[nIndex] = oButton;
            this._oButtons[oButton.get("id")] = oButton;


            if(sButtonName != sGroupName) {

                oButton.set("name", sGroupName);
            
            }


            if(this.get("disabled")) {

                oButton.set("disabled", true);

            }


            oButton.appendTo(this.get("element"));
            
            oButton.addListener(
                        "checkedChange", 
                        this._onCheckedChange, 
                        oButton, 
                        this
                    );
        
        }

    },

    addButtons: function(p_aButtons) {

        if(Lang.isArray(p_aButtons)) {
        
            var nButtons = p_aButtons.length;
    
            if(nButtons > 0) {

                for(var i=0; i<nButtons; i++) {

                    this.addButton(p_aButtons[i]);
                
                }
            
            }
        
        }

    },

    removeButton: function(p_nIndex) {

        var oButton = this.getButton(p_nIndex);
        
        if(oButton) {

            this._aButtons.splice(p_nIndex, 1);
            delete this._oButtons[oButton.get("id")];

            oButton.removeListener("checkedChange", this._onCheckedChange);
            oButton.destroy();


            var nButtons = this._aButtons.length;
            
            if(nButtons > 0) {
    
                var i = this._aButtons.length - 1;
                
                do {
    
                    this._aButtons[i].index = i;
    
                }
                while(i--);
            
            }

        }

    },

    getButton: function(p_nIndex) {

        if(Lang.isNumber(p_nIndex)) {

            return this._aButtons[p_nIndex];

        }

    },
    
    getButtons: function() {
    
        return this._aButtons;
    
    },

    getCount: function() {
    
        return this._aButtons.length;
    
    },

    focus: function(p_nIndex) {

        var oButton;

        if(Lang.isNumber(p_nIndex)) {

            oButton = this._aButtons[p_nIndex];
            
            if(oButton) {
    
                oButton.focus();
    
            }
        
        }
        else {

            var nButtons = this.getCount();
    
            for(var i=0; i<nButtons; i++) {

                oButton = this._aButtons[i];

                if(!oButton.get("disabled")) {

                    oButton.focus();
                    break;

                }
    
            }

        }

    },

    check: function(p_nIndex) {

        var oButton = this.getButton(p_nIndex);
        
        if(oButton) {

            oButton.set("checked", true);
        
        }

    },
    
    destroy: function() {

        var nButtons = this._aButtons.length,
            oElement = this.get("element"),
            oParentNode = oElement.parentNode;
        
        if(nButtons > 0) {

            var i = this._aButtons.length - 1;
            
            do {

                this._aButtons[i].destroy();

            }
            while(i--);
        
        }

        Event.purgeElement(oElement);

        oParentNode.removeChild(oElement);

    },


    /**
    * @method toString
    * @description Returns a string representing the button.
    * @return {String}
    */
    toString: function() {
    
        return ("ButtonGroup " + this.get("id"));
    
    }

});


})();