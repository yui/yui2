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

    _aButtons: [],

    _activeButton: null,
    

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

        YAHOO.widget.ButtonGroup.superclass.init.call(
                this, p_oElement, 
                p_oAttributes
            );


        var aButtons = this.getElementsByClassName("yuibutton", "span");


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

    },


    initAttributes: function(p_oAttributes) {

        var oAttributes = p_oAttributes || {};

        YAHOO.widget.ButtonGroup.superclass.initAttributes.call(
            this, 
            oAttributes
        );

        this.register("name", {

            value: null,
            validator: Lang.isString

        });

        this.register("disabled", {

            value: false,
            validator: Lang.isBoolean,
            method: this._setDisabled

        });

        this.register("value", {

            value: null

        });

    },

    _onCheckedChange: function(p_oArgs, p_oButton) {

        var oActiveButton = this._activeButton;

        if(p_oArgs.newValue && oActiveButton != p_oButton) {

            this.fireEvent("beforeActiveButtonChange", p_oButton);

            if(oActiveButton) {

                oActiveButton.set("checked", false, true);

            }


            this._activeButton = p_oButton;
            
            this.set("value", p_oButton.get("value"));

            this.fireEvent("activeButtonChange", p_oButton);

        }
        else if(!oActiveButton.set("checked")) {

            oActiveButton.set("checked", true, true);
    
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

            this._aButtons[this._aButtons.length] = oButton;

            var sButtonName = oButton.get("name"),
                sGroupName = this.get("name");


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

            oButton.destroy();      

            this._aButtons.splice(p_nIndex, 1);

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

        var oElement = this.get("element"),
            oParentNode = oElement.parentNode;

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