(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.util.Lang;



/**
* The ButtonGroup class creates a set of buttons that are mutually exclusive; 
* checking one button in the set will uncheck all others in the button group.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object 
* specifying the <code>&#60;div&#62;</code> element of the button group.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
* @namespace YAHOO.widget
* @class ButtonGroup
* @constructor
* @extends YAHOO.util.Element
*/
YAHOO.widget.ButtonGroup = function(p_oElement, p_oAttributes) {

    var oElement;

    if(Lang.isString(p_oElement)) {

        oElement = document.getElementById(p_oElement);

        if(!oElement) {
        
            oElement = this._createGroupElement();

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


// Protected properties


/** 
* @property _oButtons
* @description Collection of buttons in the button group.
* @default null
* @protected
* @type Object
*/
_oButtons: null,


/** 
* @property _aButtons
* @description Array of buttons in the button group.
* @default null
* @protected
* @type Array
*/
_aButtons: null,


/** 
* @property _oCheckedButton
* @description Object reference for the button in the button group that 
* is checked.
* @default null
* @protected
* @type Boolean
*/
_oCheckedButton: null,



// Constants


/**
* @property TAG_NAME
* @description The name of the tag to be used for the button group's element. 
* @default "DIV"
* @final
* @type String
*/
TAG_NAME: "DIV",


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* button group's element.
* @default "yuibuttongroup"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuibuttongroup",



// Protected methods


/**
* @method _createGroupElement
* @description Creates the button group's element.
* @protected
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>}
*/
_createGroupElement: function() {

    var oElement = document.createElement(this.TAG_NAME);

    oElement.className = this.CSS_CLASS_NAME;

    return oElement;

},



// Protected attribute setter methods


/**
* @method _setDisabled
* @description Sets the value of the button groups's "disabled" attribute.
* @protected
* @param {Boolean} p_bDisabled Boolean indicating the value for the button
* group's "disabled" attribute.
*/
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



// Protected event handlers


/**
* @method _onKeyDown
* @description "keydown" event handler for the button group.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
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


/**
* @method _onButtonCheckedChange
* @description "checkedChange" event handler for each button in the 
* button group.
* @protected
* @param {Event} p_oEvent Object representing the event that was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button that 
* fired the event.
*/
_onButtonCheckedChange: function(p_oEvent, p_oButton) {

    var bChecked = p_oEvent.newValue,
        oCheckedButton = this._oCheckedButton;

    if(bChecked && oCheckedButton != p_oButton) {

        if(oCheckedButton) {

            oCheckedButton.set("checked", false, true);

        }


        this._oCheckedButton = p_oButton;
        
        this.set("value", p_oButton.get("value"));

    }
    else if(!oCheckedButton.set("checked")) {

        oCheckedButton.set("checked", true, true);

    }
   
},



// Public methods


/**
* @method init
* @description The ButtonGroup class's initialization method.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object 
* specifying the <code>&#60;div&#62;</code> element of the button group.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
*/
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

    aButtons = Dom.getElementsBy(isRadioButton, "input", this.get("element"));


    if(aButtons.length > 0) {

        this.addButtons(aButtons);

    }

    this.on("keydown", this._onKeyDown);

},


/**
* @method initAttributes
* @description Initializes all of the attributes used to configure the 
* button group.
* @param {Object} p_oAttributes Object literal specifying a set of 
* attributes used to configure the button group.
*/
initAttributes: function(p_oAttributes) {

    var oAttributes = p_oAttributes || {};

    YAHOO.widget.ButtonGroup.superclass.initAttributes.call(
        this, 
        oAttributes
    );


    /**
    * @config name
    * @description String specifying the name for the button group.  This
    * name will be applied to each button in the button group.
    * @default null
    * @type String
    */
    this.setAttributeConfig("name", {

        value: null,
        validator: Lang.isString

    });


    /**
    * @config disabled
    * @description Boolean indicating if the button group should be disabled.  
    * Disabling the button group will disable each button in the button group.  
    * Disabled buttons are dimmed and will not respond to user input 
    * or fire events.
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("disabled", {

        value: false,
        validator: Lang.isBoolean,
        method: this._setDisabled

    });


    /**
    * @config value
    * @description Object specifying the value for the button group.
    * @default null
    * @type Object
    */
    this.setAttributeConfig("value", {

        value: null

    });

},


/**
* @method addButton
* @description Adds the button to the button group.
* @param {YAHOO.widget.Button} p_oButton Object reference for the 
* YAHOO.widget.Button instance to be added to the button group.
* @param {String} p_oButton String specifying the id attribute of the 
* <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button to be added to the button group.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/TR
* /2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-48250443">
* HTMLAnchorElement</a>|<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-
* 20000929/level-one-html.html#ID-33759296">HTMLElement</a>} p_oButton Object 
* reference for the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> 
* element to be used to create the button to be added to the button group.
* @param {Object} p_oButton Object literal specifying a set of attributes used 
* to configure the button to be added to the button group.
* @return {YAHOO.widget.Button} 
*/
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
        
        oButton.on("checkedChange", this._onButtonCheckedChange, oButton, this);

        return oButton;

    }

},


/**
* @method addButtons
* @description Adds the array of buttons to the button group.
* @param {Array} p_aButtons Array of YAHOO.widget.Button instances to be added 
* to the button group.
* @param {Array} p_aButtons Array of strings specifying the id attribute of 
* the <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> elements to 
* be used to create the buttons to be added to the button group.
* @param {Array} p_aButtons Array of object references for the 
* <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code> elements to be 
* used to create the buttons to be added to the button group.
* @param {Array} p_aButtons Array of object literals, each specifying the 
* attributes used to configure each button to be added to the button group.
* @return {Array}
*/
addButtons: function(p_aButtons) {

    if(Lang.isArray(p_aButtons)) {
    
        var nButtons = p_aButtons.length,
            oButton,
            aButtons = [];

        if(nButtons > 0) {

            for(var i=0; i<nButtons; i++) {

                oButton = this.addButton(p_aButtons[i]);
                
                if(oButton) {

                    aButtons[aButtons.length] = oButton

                }
            
            }

            if(aButtons.length > 0) {

                return aButtons;

            }
        
        }

    }

},


/**
* @method removeButton
* @description Removes the button at the specified index from the button group.
* @param {Number} p_nIndex Number specifying the index of the button to be 
* removed from the button group.
*/
removeButton: function(p_nIndex) {

    var oButton = this.getButton(p_nIndex);
    
    if(oButton) {

        this._aButtons.splice(p_nIndex, 1);
        delete this._oButtons[oButton.get("id")];

        oButton.removeListener("checkedChange", this._onButtonCheckedChange);
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


/**
* @method getButton
* @description Returns the button at the specified index.
* @param {Number} p_nIndex The index of the button to retrieve from the 
* button group.
* @return {YAHOO.widget.Button}
*/
getButton: function(p_nIndex) {

    if(Lang.isNumber(p_nIndex)) {

        return this._aButtons[p_nIndex];

    }

},


/**
* @method getButtons
* @description Returns an array of the buttons in the group.
* @return {Array}
*/
getButtons: function() {

    return this._aButtons;

},


/**
* @method getCount
* @description Returns the number of buttons in the button group.
* @return {Number}
*/
getCount: function() {

    return this._aButtons.length;

},


/**
* @method focus
* @description Sets focus to the button at the specified index.
* @param {Number} p_nIndex Number indicating the index of the button to focus. 
*/
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


/**
* @method check
* @description Checks the button at the specified index.
* @param {Number} p_nIndex Number indicating the index of the button to check. 
*/
check: function(p_nIndex) {

    var oButton = this.getButton(p_nIndex);
    
    if(oButton) {

        oButton.set("checked", true);
    
    }

},


/**
* @method destroy
* @description Removes the button group's element from its parent element and 
* removes all event handlers.
*/
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
* @description Returns a string representing the button group.
* @return {String}
*/
toString: function() {

    return ("ButtonGroup " + this.get("id"));

}

});


})();