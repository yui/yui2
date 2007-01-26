/**
* The button module enables the creation of rich, graphical buttons that 
* function like traditional HTML form buttons.  With the optional menu module, 
* the button module can be used to create menu buttons and split buttons; 
* widgets that are not available natively in HTML.  In total, the button 
* module supports the following types:
* 
* <dl>
* <dt>button</dt>
* <dd>Basic push button that can execute a user-specified command when 
* pressed.</dd>
* <dt>submit</dt>
* <dd>Submits the parent form when pressed.</dd>
* <dt>reset</dt>
* <dd>Resets the parent form when pressed.</dd>
* <dt>checkbox</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.</dd>
* <dt>radio</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.  Use with 
* the ButtonGroup class to create a set of controls that are mutually 
* exclusive; checking one button in the set will uncheck all others in the 
* group.</dd>
* <dt>menubutton</dt>
* <dd>When pressed will show/hide a menu.</dd>
* <dt>splitbutton</dt>
* <dd>Can execute a user-specified command or display a menu when pressed.</dd>
* </dl>
* @module button
* @requires yahoo, dom, event
* @optional menu
*/


(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.util.Lang,


    // Private member variables

    m_oButtons = {},
    m_oFocusedButton = null;



// Private methods


/**
* @method getFirstElement
* @description Returns an HTML element's first HTML element node.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>} p_oElement Object 
* reference specifying the element to be evaluated.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
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


/**
* @method createInputElement
* @description Creates an <code>&#60;input&#62;</code> element of the 
* specified type.
* @private
* @param {String} p_sType String specifying the type of 
* <code>&#60;input&#62;</code> element to create.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
function createInputElement(p_sType) {

    var oInput;

    if(navigator.userAgent.indexOf("MSIE") != -1) {

        oInput = document.createElement(
                        "<input type=\"" + p_sType + "\" name=\" \">"
                    );

    }
    else {
    
        oInput = document.createElement("input");
        oInput.type = p_sType;

    }


    return oInput;

}


/**
* @method setAttributesFromSrcElement
* @description Gets the values for all the attributes of the source element 
* (either <code>&#60;input&#62;</code> or <code>&#60;a&#62;</code>) that map to
* YAHOO.widget.Button attributes and sets them into a collection that is
* passed to the YAHOO.widget.Button constructor.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>} p_oElement Object reference to the HTML 
* element (either <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) 
* used to create the button.
* @param {Object} p_oAttributes Object reference for the collection of 
* attributes used to configure the button.
*/
function setAttributesFromSrcElement(p_oElement, p_oAttributes) {


    /**
    * @method setAttributeFromDOMAttribute
    * @description Gets the value of the specified DOM attribute and sets it 
    * into the collection of attributes used to configure the button.
    * @private
    * @param {String} p_sAttribute String representing the name of the 
    * attribute to retrieve from the DOM element.
    */
    function setAttributeFromDOMAttribute(p_sAttribute) {

        if( !(p_sAttribute in p_oAttributes) ) {

            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because using "getAttribute," IE will return the innerText of 
                a <BUTTON> for the value attribute rather than the value of 
                the "value" attribute.
            */
    
            var oAttribute = p_oElement.getAttributeNode(p_sAttribute);
    

            if(oAttribute && ("value" in oAttribute)) {

                p_oAttributes[p_sAttribute] = oAttribute.value;

            }

        }
    
    }


    /**
    * @method setFormElementProperties
    * @description Gets the value of the attributes from the form element and 
    * sets them into the collection of attributes used to configure the button.
    * @private
    */
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


/**
* @method initConfig
* @description Initializes the set of attributes that are used to instantiate 
* the button.
* @private
* @param {Object} Object representing the button's set of 
* configuration attributes.
*/
function initConfig(p_oConfig) {

    var oAttributes = p_oConfig.attributes,
        oSrcElement = oAttributes.srcelement,
        sSrcElementTagName = oSrcElement.tagName.toUpperCase();


    if(sSrcElementTagName == this.TAG_NAME) {

        p_oConfig.element = oSrcElement;


        if(!("id" in oAttributes) && p_oConfig.element.id) {
        
            oAttributes.id = p_oConfig.element.id;
        
        }

        var oFirstChild = getFirstElement(p_oConfig.element);

        Dom.addClass(oFirstChild, "first-child");

        if(oFirstChild) {

            var oButton = getFirstElement(oFirstChild);


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
    
    }
    else if(sSrcElementTagName == "INPUT") {

        setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);
    
    }

}



//  Constructor


/**
* The Button class Creates a rich, graphical button.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>|<a href="http://www.w3.org/TR/2000/WD-
* DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>} 
* p_oElement Object reference for the <code>&#60;input&#62;</code>, 
* <code>&#60;a&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button.
* @param {Object} p_oElement Object literal specifying a set of attributes 
* used to configure the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
* @namespace YAHOO.widget
* @class Button
* @constructor
* @extends YAHOO.util.Element
*/
YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) { // Object literal representing the attributes of a button

        YAHOO.widget.Button.superclass.constructor.call(
            this,
            (this._createButtonElement(p_oElement.type)),
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
                    this._createButtonElement(oConfig.attributes.type);
        
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


// Protected properties


/** 
* @property _oButton
* @description Object reference to the button's internal 
* <code>&#60;a&#62;</code> or <code>&#60;button&#62;</code> element.
* @default null
* @protected
* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-48250443">HTMLAnchorElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 34812697">HTMLButtonElement</a>
*/
_oButton: null,


/** 
* @property _oMenu
* @description Object reference to the button's menu.
* @default null
* @protected
* @type YAHOO.widget.Menu
*/
_oMenu: null,


/** 
* @property _oCommand
* @description Object reference to the button's current value for the "command"
* attribute.
* @default null
* @protected
* @type Object
*/
_oCommand: null,


/** 
* @property _bActivationKeyPressed
* @description Boolean indicating if the key(s) that toggle the button's 
* "active" state have been pressed.
* @default false
* @protected
* @type Boolean
*/
_bActivationKeyPressed: false,


/** 
* @property _bActivationButtonPressed
* @description Boolean indicating if the mouse button that toggles the button's
* "active" state has been pressed.
* @default false
* @protected
* @type Boolean
*/
_bActivationButtonPressed: false,


/** 
* @property _bHasKeyEventHandlers
* @description Boolean indicating if the button's "blur", "keydown" and 
* "keyup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_bHasKeyEventHandlers: false,


/** 
* @property _bHasMouseEventHandlers
* @description Boolean indicating if the button's "mouseout" and "mousedown" 
* and "mouseup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_bHasMouseEventHandlers: false,


/** 
* @property _bCheckable
* @description Boolean indicating if the button is of type "radio" or "checbox." 
* @default false
* @protected
* @type Boolean
*/
_bCheckable: false,



// Constants


/**
* @property TAG_NAME
* @description The name of the tag to be used for the button's root element. 
* @default "SPAN"
* @final
* @type String
*/
TAG_NAME: "SPAN",


/**
* @property CHECK_ACTIVATION_KEYS
* @description Array of numbers representing keys that (when pressed) toggle 
* the button's "checked" attribute.
* @default [32]
* @final
* @type Array
*/
CHECK_ACTIVATION_KEYS: [32],


/**
* @property ACTIVATION_KEYS
* @description Array of numbers representing keys that (when presed) toggle 
* the button's "active" state and fire the button's "command" event.
* @default [13, 32]
* @final
* @type Array
*/
ACTIVATION_KEYS: [13, 32],


/**
* @property OPTION_AREA_WIDTH
* @description  
* @default 20
* @final
* @type Number
*/
OPTION_AREA_WIDTH: 20,


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* button's root element.
* @default "yuibutton"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuibutton",


/**
* @property RADIO_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "radio." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
RADIO_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property RADIO_CHECKED_TITLE
* @description String representing the title applied to buttons of type "radio" 
* when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
RADIO_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property CHECKBOX_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "checkbox." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
CHECKBOX_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property CHECKBOX_CHECKED_TITLE
* @description String representing the title applied to buttons of type 
* "checkbox" when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
CHECKBOX_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property MENUBUTTON_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "menubutton." 
* @default "Menu collapsed.  Click to expand."
* @final
* @type String
*/
MENUBUTTON_DEFAULT_TITLE: "Menu collapsed.  Click to expand.",


/**
* @property MENUBUTTON_MENU_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "menubutton" when the button's menu is visible. 
* @default "Menu expanded.  Click or press Esc to collapse."
* @final
* @type String
*/
MENUBUTTON_MENU_VISIBLE_TITLE: 
    "Menu expanded.  Click or press Esc to collapse.",


/**
* @property SPLITBUTTON_DEFAULT_TITLE
* @description  String representing the default title applied to buttons of 
* type "splitebutton." 
* @default "Menu collapsed. Press Ctrl + Shift + M to show the menu."
* @final
* @type String
*/
SPLITBUTTON_DEFAULT_TITLE: 
    "Menu collapsed. Press Ctrl + Shift + M to show the menu.",


/**
* @property SPLITBUTTON_OPTION_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "splitbutton" when the button's menu is visible. 
* @default "Menu expanded. Press Esc to hide the menu."
* @final
* @type String
*/
SPLITBUTTON_OPTION_VISIBLE_TITLE: 
    "Menu expanded. Press Esc to hide the menu.",


/**
* @property SUBMIT_TITLE
* @description String representing the title applied to buttons of 
* type "submit." 
* @default "Click to submit form."
* @final
* @type String
*/
SUBMIT_TITLE: "Click to submit form.",



// Protected attribute setter methods


/**
* @method _setType
* @description Sets the value of the button's "type" attribute.
* @protected
* @param {String} p_sType String indicating the value for the button's 
* "type" attribute.
*/
_setType: function(p_sType) {

    this._bCheckable = (p_sType == "checkbox" || p_sType == "radio");
    
    if(p_sType == "splitbutton") {

        this.on("option", this._onOption, this, true);

    }

},


/**
* @method _setLabel
* @description Sets the value of the button's "label" attribute.
* @protected
* @param {String} p_sLabel String indicating the value for the button's 
* "label" attribute.
*/
_setLabel: function(p_sLabel) {

    this._oButton.innerHTML = p_sLabel;                

},


/**
* @method _setTabIndex
* @description Sets the value of the button's "tabindex" attribute.
* @protected
* @param {Number} p_nTabIndex Number indicating the value for the button's 
* "tabindex" attribute.
*/
_setTabIndex: function(p_nTabIndex) {

    this._oButton.tabIndex = p_nTabIndex;

},


/**
* @method _setTitle
* @description Sets the value of the button's "title" attribute.
* @protected
* @param {String} p_nTabIndex Number indicating the value for the button's 
* "title" attribute.
*/
_setTitle: function(p_sTitle) {

    if(this.get("type") != "link") {

        var sTitle = p_sTitle;

        if(!sTitle) {


            var sType = this.get("type");

            switch(sType) {

                case "radio":

                    sTitle = this.RADIO_DEFAULT_TITLE;

                break;

                case "checkbox":

                    sTitle = this.CHECKBOX_DEFAULT_TITLE;

                break;
                
                case "menubutton":

                    sTitle = this.MENUBUTTON_DEFAULT_TITLE;

                break;

                case "splitbutton":

                    sTitle = this.SPLITBUTTON_DEFAULT_TITLE;

                break;

                case "submit":

                    sTitle = this.SUBMIT_TITLE;

                break;

            }

        }

        this._oButton.title = sTitle;

    }

},


/**
* @method _setDisabled
* @description Sets the value of the button's "disabled" attribute.
* @protected
* @param {Boolean} p_bDisabled Boolean indicating the value for the button's 
* "disabled" attribute.
*/
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


/**
* @method _setAccessKey
* @description Sets the value of the button's "accesskey" attribute.
* @protected
* @param {String} p_sAccessKey String indicating the value for the button's 
* "accesskey" attribute.
*/
_setAccessKey: function(p_sAccessKey) {

    this._oButton.accessKey = p_sAccessKey;

},


/**
* @method _setHref
* @description Sets the value of the button's "href" attribute.
* @protected
* @param {String} p_sHref String indicating the value for the button's 
* "href" attribute.
*/
_setHref: function(p_sHref) {

    if(this.get("type") == "link") {

        this._oButton.href = p_sHref;
    
    }

},


/**
* @method _setTarget
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {String} p_sTarget String indicating the value for the button's 
* "target" attribute.
*/
_setTarget: function(p_sTarget) {

    if(this.get("type") == "link") {

        this._oButton.setAttribute("target", p_sTarget);
    
    }

},


/**
* @method _setChecked
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {Boolean} p_bChecked Boolean indicating the value for the button's 
* "checked" attribute.
*/
_setChecked: function(p_bChecked) {

    if(this._bCheckable) {

        var sType = this.get("type"),
            sTitle;

        if(p_bChecked) {

            this.addClass("checked");
            
            sTitle = (sType == "radio") ? 
                        this.RADIO_CHECKED_TITLE : 
                        this.CHECKBOX_CHECKED_TITLE;
        
        }
        else {

            this.removeClass("checked");

            sTitle = (sType == "radio") ? 
                        this.RADIO_DEFAULT_TITLE : 
                        this.CHECKBOX_DEFAULT_TITLE;
        
        }

        this.set("title", sTitle);

    }

},


/**
* @method _setCommand
* @description Sets the value of the button's "command" attribute.
* @protected
* @param {Object} p_oCommand Object indicating the value for the button's 
* "command" attribute.
*/
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

        this.on("command", p_oCommand.fn, p_oCommand.obj, p_oCommand.scope);

        this._oCommand = p_oCommand;

    }

},


/**
* @method _setMenu
* @description Sets the value of the button's "menu" attribute.
* @protected
* @param {Object} p_oMenu Object indicating the value for the button's 
* "menu" attribute.
*/
_setMenu: function(p_oMenu) {

    var oMenu;

    if(p_oMenu instanceof YAHOO.widget.Menu) {

        oMenu = p_oMenu;

    }
    else if(Lang.isArray(p_oMenu)) {

        oMenu = new YAHOO.widget.Menu(
                                    Dom.generateId(), 
                                    { lazyload: true, itemdata: p_oMenu }
                                );
       
    }
    else if(Lang.isString(p_oMenu) || (p_oMenu && p_oMenu.nodeName)) {

        oMenu = new YAHOO.widget.Menu(p_oMenu, { lazyload: true });
    
    }


    if(oMenu) {

        oMenu.showEvent.subscribe(this._onMenuShow, this, true);
        oMenu.hideEvent.subscribe(this._onMenuHide, this, true);
        oMenu.keyDownEvent.subscribe(this._onMenuKeyDown, this, true);

        var oSrcElement = oMenu.srcElement;

        if(oSrcElement && oSrcElement.tagName.toUpperCase() == "SELECT") {

            oSrcElement.style.display = "none";

            oMenu.renderEvent.subscribe(this._onMenuRender, this, true);

        }


        oMenu.cfg.setProperty("container", this.get("container"));

        this._oMenu = oMenu;

    }
    else {

        this._oMenu.destroy();

        this._oMenu = null;

    }

},



// Protected methods


/**
* @method _createButtonElement
* @description Creates the button's element.
* @protected
* @param {String} p_sType String indicating the type of element to create.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
_createButtonElement: function(p_sType) {

    var sTagName = this.TAG_NAME,
        oElement = document.createElement(sTagName);

    oElement.innerHTML =  
    
        "<" + sTagName + " class=\"first-child\">" + 
        (p_sType == "link" ? "<a></a>" : "<button type=\"button\"></button>") + 
        "</" + sTagName + ">";

    return oElement;

},


/**
* @method _createHiddenField
* @description Creates the button's hidden form field.
* @protected
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
_createHiddenField: function () {

    var oField = 

            createInputElement(
                    (this._bCheckable ? this.get("type") : "hidden")
                );


    oField.id = this.get("id");
    oField.name = this.get("name");
    oField.value = this.get("value");

    if(this._bCheckable) {

        oField.checked = this.get("checked");
        oField.style.display = "none";        
    }

    return oField;   

},


/**
* @method _appendHiddenFieldToForm
* @description Append's the button's hidden form field to its 
* corresponding form.
* @protected
*/
_appendHiddenFieldToForm: function () {

    if(!this.get("disabled")) {

        var oForm = this.getForm(),
            oHiddenField = this._createHiddenField();
    
        if(oForm) {
    
            oForm.appendChild(oHiddenField);
        
        }

    }

},


/**
* @method _isActivationKey
* @description Determines if the specified keycode is one that toggles the 
* button's "active" state.
* @protected
* @param {Number} p_nKeyCode Number representing the keycode to be evaluated.
* @return {Boolean}
*/
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


/**
* @method _isSplitButtonOptionKey
* @description Determines if the specified keycode is one that toggles the 
* display of the split button's menu.
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @return {Boolean}
*/
_isSplitButtonOptionKey: function(p_oEvent) {

    return (
        p_oEvent.ctrlKey && 
        p_oEvent.shiftKey && 
        Event.getCharCode(p_oEvent) == 77
    );

},


/**
* @method _showMenu
* @description Shows the button's menu.
* @protected
*/
_showMenu: function() {

    var oMenu = this._oMenu;

    if(oMenu) {

        YAHOO.widget.MenuManager.hideVisible();

        oMenu.cfg.applyConfig({
                context:[this.get("id"), "tl", "bl"], 
                clicktohide: false,
                constraintoviewport: false,
                visible: true
            });
            
        oMenu.cfg.fireQueue();


        var nViewportHeight = Dom.getViewportHeight(),
            nMenuHeight = oMenu.element.offsetHeight;


        if((oMenu.cfg.getProperty("y") + nMenuHeight) > nViewportHeight) {

            oMenu.align("bl", "tl");

            var nY = oMenu.cfg.getProperty("y"),
                nScrollY = document.documentElement.scrollTop || document.body.scrollTop,
                nMaxHeight = (nMenuHeight - ((nScrollY - nY) + 20));
            
            if(scrollY >= nY) {

                this._originalMaxHeight = oMenu.cfg.getProperty("maxheight");

                oMenu.cfg.setProperty("maxheight", nMaxHeight);
                oMenu.align("bl", "tl");

            }

        }

        oMenu.cfg.setProperty("constraintoviewport", true);

    }            

},


/**
* @method _showMenu
* @description Hides the button's menu.
* @protected
*/
_hideMenu: function() {

    var oMenu = this._oMenu;

    if(oMenu && oMenu.cfg.getProperty("visible")) {

        oMenu.hide();

    }

},


/**
* @method _submitForm
* @description Submits the form to which the button belongs.
* @protected
*/
_submitForm: function() {

    var oForm = this.getForm();

    if(oForm) {

        YAHOO.widget.Button.addHiddenFieldsToForm(oForm);

        this._appendHiddenFieldToForm();
        
        oForm.submit();
    
    }

},


/**
* @method _fireCommandEvent
* @description Fires the button's "command" event.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_fireCommandEvent: function(p_oEvent) {

    if(this.isActive() && this.hasFocus()) {
    
        this.fireEvent("command", p_oEvent);
    
    }

},



// Protected event handlers


/**
* @method _onMouseOver
* @description "mouseover" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOver: function(p_oEvent) {

    if(!this.get("disabled")) {

        if(!this._bHasMouseEventHandlers) {

            this.on("mouseout", this._onMouseOut);
            this.on("mousedown", this._onMouseDown);
            this.on("mouseup", this._onMouseUp);

            this._bHasMouseEventHandlers = true;

        }

        this.addClass("hover");

        if(this._bActivationButtonPressed) {

            this.addClass("active");

        }


        if(this._bOptionPressed) {

            this.addClass("activeoption");
        
        }

    }

},


/**
* @method _onMouseOut
* @description "mouseout" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOut: function(p_oEvent) {

    if(!this.get("disabled")) {

        this.removeClass("hover");

        if(this.get("type") != "menubutton") {

            this.removeClass("active");

        }

        if(this._bActivationButtonPressed || this._bOptionPressed) {

            Event.on(document, "mouseup", this._onDocumentMouseUp, this, true);

        }

    }
    
},


/**
* @method _onDocumentMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onDocumentMouseUp: function(p_oEvent, p_oButton) {

    this._bActivationButtonPressed = false;
    this._bOptionPressed = false;

    var sType = this.get("type");

    if(sType == "menubutton" || sType == "splitbutton") {

        this.removeClass(
                (sType == "menubutton" ? "active" : "activeoption")
            );

        this._hideMenu();

    }

    Event.removeListener(document, "mouseup", this._onDocumentMouseUp);

},


/**
* @method _onMouseDown
* @description "mousedown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseDown: function(p_oEvent) {

    if(!this.get("disabled")) {

        if((p_oEvent.which || p_oEvent.button) == 1) {

            if(this.get("type") == "splitbutton") {
            
                var oElement = this.get("element"),
                    nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);

                if(
                    (
                        oElement.offsetWidth - 
                        this.OPTION_AREA_WIDTH
                    ) < nX
                ) {
                    
                    this.fireEvent("option", p_oEvent);

                }
                else {

                    this.addClass("active");

                    this._bActivationButtonPressed = true;

                }

            }
            else if(this.get("type") == "menubutton") {

                if(this.hasClass("active")) {

                    this._hideMenu();

                    this._bActivationButtonPressed = false;

                }
                else {

                    this._showMenu();

                    this._bActivationButtonPressed = true;
                
                }

            }
            else {
    
                this.addClass("active");

                this._bActivationButtonPressed = true;
            
            }
        
        }

    }
    
},


/**
* @method _onMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseUp: function(p_oEvent) {

    if(!this.get("disabled")) {

        if(this._bCheckable) {

            this.set("checked", !(this.get("checked")));
        
        }


        this._fireCommandEvent(p_oEvent);

        this._bActivationButtonPressed = false;
        

        if(this.get("type") != "menubutton") {

            this.removeClass("active");
        
        }
    
    }
    
},


/**
* @method _onFocus
* @description "focus" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button that
* fired the event.
*/
_onFocus: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        this.addClass("focus");

        if(this._bActivationKeyPressed) {

            this.addClass("active");
       
        }

        m_oFocusedButton = this;


        if(!this._bHasKeyEventHandlers) {

            var oEl = this._oButton;

            Event.on(oEl, "blur", this._onBlur, this, true);
            Event.on(oEl, "keydown", this._onKeyDown, this, true);
            Event.on(oEl, "keyup", this._onKeyUp, this, true);

            this._bHasKeyEventHandlers = true;

        }


        this.fireEvent("focus", p_oEvent);

    }

},


/**
* @method _onBlur
* @description "blur" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onBlur: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        this.removeClass("focus");

        if(this.get("type") != "menubutton") {

            this.removeClass("active");

        }    

        if(this._bActivationKeyPressed) {

            Event.on(document, "keyup", this._onDocumentKeyUp, this, true);

        }


        m_oFocusedButton = null;

        this.fireEvent("blur", p_oEvent);

    }
   
},


/**
* @method _onDocumentKeyUp
* @description "keyup" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onDocumentKeyUp: function(p_oEvent, p_oButton) {

    if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

        this._bActivationKeyPressed = false;
        
        Event.removeListener(document, "keyup", this._onDocumentKeyUp);
    
    }

},


/**
* @method _onKeyDown
* @description "keydown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onKeyDown: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        if(
            this.get("type") == "splitbutton" && 
            this._isSplitButtonOptionKey(p_oEvent)
        ) {

            this.fireEvent("option", p_oEvent);

        }
        else if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

            if(this.get("type") == "menubutton") {

                this._showMenu();

            }
            else {

                this._bActivationKeyPressed = true;
                
                this.addClass("active");
            
            }
        
        }


        var oMenu = this._oMenu;

        if(
            oMenu && oMenu.cfg.getProperty("visible") && 
            Event.getCharCode(p_oEvent) == 27
        ) {
        
            oMenu.hide();
            this.focus();
        
        }

    }

},


/**
* @method _onKeyUp
* @description "keyup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onKeyUp: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        if(this._isActivationKey(Event.getCharCode(p_oEvent))) {


            if(this._bCheckable) {

                this.set("checked", !(this.get("checked")));
            
            }



            this._fireCommandEvent(p_oEvent);

            this._bActivationKeyPressed = false;

            if(this.get("type") != "menubutton") {

                this.removeClass("active");

            }

        }

    }

},


/**
* @method _onCommand
* @description "command" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onCommand: function(p_oEvent) {

    var sType = this.get("type");

    switch(sType) {

        case "submit":

            this._submitForm();
        
        break;

        case "reset":

            var oForm = this.getForm();

            if(oForm) {

                oForm.reset();
            
            }

        break;

        case "splitbutton":

            this._hideMenu();

            var oSrcElement = this.get("srcelement");

            if(oSrcElement && oSrcElement.type == "submit") {

                this._submitForm();
            
            }
        
        break;

    }

},


/**
* @method _onAppendTo
* @description "appendTo" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onAppendTo: function(p_oEvent) {

    var oForm = this.getForm();
    
    if(oForm) {

        Event.on(oForm, "reset", this._onFormReset, this, true);
    
    }

},


/**
* @method _onFormReset
* @description "reset" event handler for the button's form.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onFormReset: function(p_oEvent, p_oButton) {

    if(this._bCheckable) {

        this.resetValue("checked");

    }
    
},


/**
* @method _onDocumentMouseDown
* @description "mousedown" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
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

        this._hideMenu();

        Event.removeListener(
                document, 
                "mousedown", 
                this._onDocumentMouseDown
            );    
    
    }

},


/**
* @method _onOption
* @description "option" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onOption: function(p_oEvent, p_oButton) {

    if(this.hasClass("activeoption")) {

        this._hideMenu();

        this._bOptionPressed = false;

    }
    else {

        this._showMenu();    

        this._bOptionPressed = true;

    }

},


/**
* @method _onMenuShow
* @description "show" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuShow: function(p_sType, p_aArgs, p_oButton) {

    Event.on(document, "mousedown", this._onDocumentMouseDown, this, true);

    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {

        sTitle = this.SPLITBUTTON_OPTION_VISIBLE_TITLE;
        sClass = "activeoption";
    
    }
    else {

        sTitle = this.MENUBUTTON_MENU_VISIBLE_TITLE;        
        sClass = "active";

    }

    this.addClass(sClass);
    this.set("title", sTitle);

},


/**
* @method _onMenuHide
* @description "hide" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuHide: function(p_sType, p_aArgs, p_oButton) {
    
    this._oMenu.cfg.setProperty("maxheight", this._originalMaxHeight);

    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {
    
        sTitle = this.SPLITBUTTON_DEFAULT_TITLE;
        sClass = "activeoption";
    
    }
    else {

        sTitle = this.MENUBUTTON_DEFAULT_TITLE;        
        sClass = "active";
    }


    this.removeClass(sClass);
    this.set("title", sTitle);

},


/**
* @method _onMenuKeyDown
* @description "keydown" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuKeyDown: function(p_sType, p_aArgs, p_oButton) {

    var oEvent = p_aArgs[0];

    if(Event.getCharCode(oEvent) == 27) {

        this.focus();

        if(this.get("type") == "splitbutton") {
        
            this._bOptionPressed = false;
        
        }

    }

},


/**
* @method _onMenuRender
* @description "render" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuRender: function(p_sType, p_aArgs, p_oButton) {

    // subscribe to the command events            

    var aItems = this._oMenu.getItems(),
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

},


/**
* @method _onMenuItemCommand
* @description "command" event handler for the items in the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item 
* that fired the event.
*/
_onMenuItemCommand: function(p_sType, p_aArgs, p_oItem) {

    this._oMenu.srcElement.selectedIndex = p_oItem.index;

    if(this.get("srcelement").type == "submit") {

        this._submitForm();

    }

},



// Public methods


/**
* @method init
* @description The Button class's initialization method.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>|<a href="http://www.w3.org/TR/2000/WD-
* DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>} 
* p_oElement Object reference for the <code>&#60;input&#62;</code>, 
* <code>&#60;a&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button.
* @param {Object} p_oElement Object literal specifying a set of attributes 
* used to configure the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
*/
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


    Event.on(this._oButton, "focus", this._onFocus, this, true);

    this.on("mouseover", this._onMouseOver);
    this.on("command", this._onCommand);
    this.on("appendTo", this._onAppendTo);

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

        this.fireEvent("beforeAppendTo");

        oSrcElement.parentNode.replaceChild(oElement, oSrcElement);

        this.fireEvent("appendTo");

    }

},


/**
* @method initAttributes
* @description Initializes all of the attributes used to configure the button.
* @param {Object} p_oAttributes Object literal specifying a set of 
* attributes used to configure the button.
*/
initAttributes: function(p_oAttributes) {

    var oAttributes = p_oAttributes || {};

    YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);


    /**
    * @config type
    * @description String specifying the button's type.  Possible values are: 
    * "button," "submit," "reset," "checkbox," "radio," "menubutton," 
    * and "splitbutton."
    * @default "button"
    * @type String
    */
    this.setAttributeConfig("type", {

        value: (oAttributes.type || "button"),
        validator: Lang.isString,
        writeOnce: true,
        method: this._setType

    });


    /**
    * @config label
    * @description String specifying the button's text label or innerHTML.
    * @default null
    * @type String
    */
    this.setAttributeConfig("label", {

        value: oAttributes.label,
        validator: Lang.isString,
        method: this._setLabel

    });


    /**
    * @config value
    * @description Object specifying the value for the button.
    * @default null
    * @type Object
    */
    this.setAttributeConfig("value", {

        value: oAttributes.value

    });


    /**
    * @config name
    * @description String specifying the name for the button.
    * @default null
    * @type String
    */
    this.setAttributeConfig("name", {

        value: oAttributes.name,
        validator: Lang.isString

    });


    /**
    * @config tabindex
    * @description Number specifying the tabindex for the button.
    * @default null
    * @type Number
    */
    this.setAttributeConfig("tabindex", {

        value: oAttributes.tabindex,
        validator: Lang.isNumber,
        method: this._setTabIndex

    });


    /**
    * @config title
    * @description String specifying the title for the button.
    * @default null
    * @type String
    */
    this.configureAttribute("title", {

        value: oAttributes.title,
        validator: Lang.isString,
        method: this._setTitle

    });


    /**
    * @config disabled
    * @description Boolean indicating if the button should be disabled.  
    * (Disabled buttons are dimmed and will not respond to user input 
    * or fire events.)
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("disabled", {

        value: (oAttributes.disabled || false),
        validator: Lang.isBoolean,
        method: this._setDisabled

    });


    /**
    * @config accesskey
    * @description String specifying the accesskey for the button.
    * @type String
    */
    this.setAttributeConfig("accesskey", {

        value: oAttributes.accesskey,
        validator: Lang.isString,
        method: this._setAccessKey

    });


    /**
    * @config href
    * @description String specifying the href for the button.  Applies only to 
    * buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("href", {

        value: oAttributes.href,
        validator: Lang.isString,
        method: this._setHref

    });


    /**
    * @config target
    * @description String specifying the target for the button.  Applies only  
    * to buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("target", {

        value: oAttributes.target,
        validator: Lang.isString,
        method: this._setTarget

    });


    /**
    * @config checked
    * @description Boolean indicating if the button is checked.  Applies only
    * to buttons of type "radio" and "checkbox."
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("checked", {

        value: (oAttributes.checked || false),
        validator: Lang.isBoolean,
        method: this._setChecked

    });


	/**
	* @config container
	* @description HTML element reference or string specifying the id 
	* attribute of the HTML element that the button's markup should be 
	* rendered into.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("container", {

        value: oAttributes.container

    });


	/**
	* @config srcelement
    * @description Object reference to the HTML element (either 
    * <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) used to 
    * create the button.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("srcelement", {

        value: oAttributes.srcelement,
        writeOnce: true

    });


	/**
	* @config command
    * @description Object literal representing the code to be executed in 
    * response the "keyup" or "mouseup" events.  Format: <code> {<br> 
    * <strong>fn:</strong> Function,   &#47;&#47; The handler to call when the 
    * event fires.<br> <strong>obj:</strong> Object, &#47;&#47; An object to 
    * pass back to the handler.<br> <strong>scope:</strong> Object &#47;&#47; 
    * The object to use for the scope of the handler.<br> } </code>
    * @type Object
	* @default null
	*/
    this.setAttributeConfig("command", {

        value: oAttributes.command,
        method: this._setCommand
    
    });


	/**
	* @config menu
    * @description Object reference to the HTML element (either 
    * <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) used to 
    * create the button.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("menu", {

        value: null,
        method: this._setMenu
    
    });

},


/**
* @method focus
* @description Causes the button to receive the focus and fires the button's
* "focus" event.
*/
focus: function() {

    if(!this.get("disabled")) {

        this._oButton.focus();
    
    }

},


/**
* @method blur
* @description Causes the button to lose focus and fires the button's
* "blur" event.
*/
blur: function() {

    if(!this.get("disabled")) {

        this._oButton.blur();

    }

},


/**
* @method hasFocus
* @description Returns a boolean indicating whether or not the button has focus.
* @return {Boolean}
*/
hasFocus: function() {

    return (m_oFocusedButton == this);

},


/**
* @method isActive
* @description Returns a boolean indicating whether or not the button is active.
* @return {Boolean}
*/
isActive: function() {

    return this.hasClass("active");

},


/**
* @method getMenu
* @description Returns a reference to the button's menu.
* @return {YAHOO.widget.Menu}
*/
getMenu: function() {

    return this._oMenu;

},


/**
* @method getForm
* @description Returns a reference to the button's menu.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>}
*/
getForm: function() {

    return this._oButton.form;

},


/**
* @method destroy
* @description Removes the button's element from its parent element and 
* removes all event handlers.
*/
destroy: function() {

    var oElement = this.get("element"),
        oParentNode = oElement.parentNode,
        oMenu = this._oMenu;

    if(oMenu) {

        oMenu.destroy();

    }

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


/**
* @method addHiddenFieldsToForm
* @description Searches the specified form and adds hidden fields for instances 
* of YAHOO.widget.Button that are of type "radio," "checkbox," "menubutton," 
* and "splitbutton."
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>} p_oForm Object reference 
* for the form to search.
*/
YAHOO.widget.Button.addHiddenFieldsToForm = function(p_oForm) {

    var aButtons = Dom.getElementsByClassName("yuibutton", "*", p_oForm),
        nButtons = aButtons.length;


    if(nButtons > 0) {

        var oButton,
            sType,
            oMenu;

        for(var i=0; i<nButtons; i++) {

            oButton = m_oButtons[aButtons[i].id];
            sType = oButton.get("type");
            oMenu = oButton.getMenu();


            if(sType == "radio" || sType == "checkbox") {

                oButton._appendHiddenFieldToForm();
            
            }
            else if(oMenu) {

                var oSrcElement = oMenu.srcElement;
    
                if(
                    !oSrcElement || 
                    (
                        oSrcElement && 
                        oSrcElement.tagName.toUpperCase() != "SELECT"
                    )
                ) {

                    var oField = createInputElement("hidden"),
                        sName = oButton.get("name");

                    if(oButton.get("srcelement")) {

                        sName = sName + "_options";

                    }
                
                    oField.name = sName;
                    oField.value = oMenu.getValue();

                    oButton.getForm().appendChild(oField);

                }                

            }
        
        }

    }

};


/**
* @event focus
* @description Fires when the menu item receives focus.  Passes back a single 
* object representing the original DOM event object passed back by the event 
* utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

/**
* @event blur
* @description Fires when the menu item loses the input focus.  Passes back a 
* single object representing the original DOM event object passed back by the 
* event utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

/**
* @event command
* @command Fires in response to the "keyup" or "mouseup" up event.  Passes back 
* a single object representing the original DOM event object passed back by the 
* event utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

/**
* @event option
* @description Fires when the user invokes the button's option.  Passes back a 
* single object representing the original DOM event object passed back by the 
* event utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

})();