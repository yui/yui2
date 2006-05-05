/**
 * Copyright (c) 2006, Yahoo! Inc. All rights reserved.
 */
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Class providing the customizable functionality of a plug-and-play DHTML
 * auto complete widget.  Some key features:
 * <ul>
 * <li>Navigate with up/down arrow keys and/or mouse to pick a selection</li>
 * <li>The drop down container can "roll down" or "fly out" via configurable
 * animation</li>
 * <li>UI look-and-feel customizable through CSS, including container
 * attributes, borders, position, fonts, etc</li>
 * </ul>
 *
 * requires YAHOO.util.Event Event utility
 * requires YAHOO.widget.DataSource Data source class
 * see YAHOO.util.Animation Animation utility
 * see JSON JSON library
 *
 * @constructor
 * @param {element | string} inputEl DOM element reference or string ID of the auto complete input field
 * @param {element | string} containerEl DOM element reference or string ID of the auto complete &lt;div&gt;
 *                              container
 * @param {object} oDataSource Instance of YAHOO.widget.DataSource for query/results
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.AutoComplete = function(inputEl,containerEl,oDataSource,oConfigs) {
    if(inputEl && containerEl && oDataSource) {
        // Validate data source
        if (oDataSource.getResults) {
            this.dataSource = oDataSource;
        }
        else {
            //YAHOO.log("Could not instantiate AutoComplete due to an invalid DataSource", "error");
            return;
        }
        // Validate input element
        if(YAHOO.util.Dom.inDocument(inputEl)) {
            if(typeof inputEl == "string") {
                    this._sName = inputEl + YAHOO.widget.AutoComplete._nIndex;
                    this._oTextbox = document.getElementById(inputEl);
            }
            else {
                this._sName = (inputEl.id) ?
                    inputEl.id + YAHOO.widget.AutoComplete._nIndex :
                    "yac_inputEl" + YAHOO.widget.AutoComplete._nIndex;
                this._oTextbox = inputEl;
            }
        }
        else {
            //YAHOO.log("Could not instantiate AutoComplete due to an invalid input element", "error");
            return;
        }

        // Validate container element
        if(YAHOO.util.Dom.inDocument(containerEl)) {
            if(typeof containerEl == "string") {
                    this._oContainer = document.getElementById(containerEl);
            }
            else {
                this._oContainer = containerEl;
            }
        }
        else {
            //YAHOO.log("Could not instantiate AutoComplete due to an invalid container element", "error");
            return;
        }

        // Set any config params passed in to override defaults
        if (typeof oConfigs == "object") {
            for(var sConfig in oConfigs) {
                if (sConfig) {
                    this[sConfig] = oConfigs[sConfig];
                }
            }
        }

        // Initialization sequence
        var oSelf = this;
        var oTextbox = this._oTextbox;
        var oContainer = this._oContainer;

        YAHOO.util.Event.addListener(oTextbox,'keyup',oSelf._onTextboxKeyUp,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'keydown',oSelf._onTextboxKeyDown,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'keypress',oSelf._onTextboxKeyPress,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'focus',oSelf._onTextboxFocus,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'blur',oSelf._onTextboxBlur,oSelf);
        YAHOO.util.Event.addListener(oContainer,'mouseover',oSelf._onContainerMouseover,oSelf);
        YAHOO.util.Event.addListener(oContainer,'mouseout',oSelf._onContainerMouseout,oSelf);
        YAHOO.util.Event.addListener(oContainer,'scroll',oSelf._onContainerScroll,oSelf);
        if(oTextbox.form && this.allowBrowserAutocomplete) {
            YAHOO.util.Event.addListener(oTextbox.form,'submit',oSelf._onFormSubmit,oSelf);
        }

        this.textboxFocusEvent = new YAHOO.util.CustomEvent("textboxFocus", this);
        this.textboxKeyEvent = new YAHOO.util.CustomEvent("textboxKey", this);
        this.dataRequestEvent = new YAHOO.util.CustomEvent("dataRequest", this);
        this.dataReturnEvent = new YAHOO.util.CustomEvent("dataReturn", this);
        this.dataErrorEvent = new YAHOO.util.CustomEvent("dataError", this);
        this.containerExpandEvent = new YAHOO.util.CustomEvent("containerExpand", this);
        this.typeAheadEvent = new YAHOO.util.CustomEvent("typeAhead", this);
        this.itemMouseOverEvent = new YAHOO.util.CustomEvent("itemMouseOver", this);
        this.itemMouseOutEvent = new YAHOO.util.CustomEvent("itemMouseOut", this);
        this.itemArrowToEvent = new YAHOO.util.CustomEvent("itemArrowTo", this);
        this.itemArrowFromEvent = new YAHOO.util.CustomEvent("itemArrowFrom", this);
        this.itemSelectEvent = new YAHOO.util.CustomEvent("itemSelect", this);
        this.selectionEnforceEvent = new YAHOO.util.CustomEvent("selectionEnforce", this);
        this.containerCollapseEvent = new YAHOO.util.CustomEvent("containerCollapse", this);
        this.textboxBlurEvent = new YAHOO.util.CustomEvent("textboxBlur", this);

        // Turn off autocomplete on textbox
        oTextbox.setAttribute("autocomplete","off");

        // Validate and initialize public configs
        this._initProps();
    }
    // Required arguments were not found
    else {
        //YAHOO.log("Could not instantiate AutoComplete due invalid arguments", "error");
    }
};


/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * The data source object that encapsulates the data used for auto completion.
 * This object should be an inherited object from YAHOO.widget.DataSource.
 *
 * @type object
 */
YAHOO.widget.AutoComplete.prototype.dataSource = null;

/**
 * Number of characters that must be entered before querying for results.
 * Default: 1.
 *
 * @type number
 */
YAHOO.widget.AutoComplete.prototype.minQueryLength = 1;

/**
 * Maximum number of results to display in auto complete container. Default: 10.
 *
 * @type number
 */
YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed = 10;

/**
 * Number of seconds to delay before submitting a query request.  If a query
 * request is received before a previous one has completed its delay, the
 * previous request is cancelled and the new request is set to the delay.
 * Default: 0.5.
 *
 * @type number
 */
YAHOO.widget.AutoComplete.prototype.queryDelay = 0.5;

/**
 * Class name of a highlighted item within the auto complete container.
 * Default: "highlight".
 *
 * @type string
 */
YAHOO.widget.AutoComplete.prototype.highlightClassName = "highlight";

/**
 * Query delimiter. A single character separator for multiple delimited
 * selections. Multiple delimiter characteres may be defined as an array of
 * strings. A null value or empty string indicates that query results cannot
 * be delimited. This feature is not recommended if you need forceSelection to
 * be true. Default: null.
 *
 * @type string or array
 */
YAHOO.widget.AutoComplete.prototype.delimChar = null;

/**
 * Whether or not the auto complete input field should be automatically updated
 * with the first query result as the user types, auto-selecting the substring
 * that the user has not typed. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.typeAhead = false;

/**
 * Whether or not to animate the expansion/collapse of the auto complete
 * container in the horizontal direction.  Default: false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.animHoriz = false;

/**
 * Whether or not to animate the expansion/collapse of the auto complete
 * container in the vertical direction.  Default: true.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.animVert = true;

/**
 * Speed of container expand/collapse animation, in seconds. Default: 0.3.
 *
 * @type number
 */
YAHOO.widget.AutoComplete.prototype.animSpeed = 0.3;

/**
 * Whether or not to force the user's selection to match one of the query
 * results. Enabling this feature essentially transforms the auto complete form
 * input field into a &lt;select&gt; field. This feature is not recommended
 * with delimiter character(s) defined. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.forceSelection = false;

/**
 * Whether or not to allow browsers to cache user typed input, which effectively
 * does not set the input attribute autocomplete="off". When users click the
 * back button after form submission, typed input can be prefilled by the
 * browser. Default: true.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete = true;

/***************************************************************************
 * Public methods
 ***************************************************************************/
 /**
 * Public accessor to the unique name of the auto complete instance.
 *
 * @return {string} Unique name of the auto complete instance
 */
YAHOO.widget.AutoComplete.prototype.getName = function() {
    return this._sName;
};

/**
 * Public accessor to the internal array of DOM &lt;li&gt; element IDs that
 * display query results within the auto complete container.
 *
 * @return {array} Array of &lt;li&gt; element IDs within the auto complete
 *                 container
 */
YAHOO.widget.AutoComplete.prototype.getListIds = function() {
    return this._aListIds;
};

/**
 * Sets HTML markup for the auto complete container header. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_hd".
 *
 * @param {string} sHeader HTML markup for container header
 */
YAHOO.widget.AutoComplete.prototype.setHeader = function(sHeader) {
    if(sHeader) {
        this._oHeader.innerHTML = sHeader;
        this._oHeader.style.display = "block";
    }
};

/**
 * Sets HTML markup for the auto complete container footer. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_ft".
 *
 * @param {string} sFooter HTML markup for container footer
 */
YAHOO.widget.AutoComplete.prototype.setFooter = function(sFooter) {
    if(sFooter) {
        this._oFooter.innerHTML = sFooter;
        this._oFooter.style.display = "block";
    }
};

/**
 * Whether or not to use an iFrame to layer over Windows form elements in
 * IE. Set to true only when the auto complete container will be on top of a
 * &lt;select&gt; field in IE and thus exposed to the IE z-index bug (i.e.,
 * 5.5 < IE < 7). Default:false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.useIFrame = false;

/**
 * Overridable method that converts a result item object into HTML markup
 * for display. Return data values are accessible via the oResultItem object,
 * and the key return value will always be oResultItem[0]. Markup will be
 * displayed within &lt;li&gt; element tags in the container.
 *
 * @param {object} oResultItem Result item object representing one query result
 * @param {string} sQuery The current query string
 * @return {string} HTML markup of formatted result data
 */
YAHOO.widget.AutoComplete.prototype.formatResult = function(oResultItem, sQuery) {
    var sResult = oResultItem[0];
    if(sResult) {
        return sResult;
    }
    else {
        return "";
    }
};

/***************************************************************************
 * Events
 ***************************************************************************/
/**
 * Fired when the auto complete text input box receives focus. Subscribers
 * receive the following array:<br>
 *     -  args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.textboxFocusEvent = null;

/**
 * Fired when the auto complete text input box receives key input. Subscribers
 * receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The keycode number
 */
YAHOO.widget.AutoComplete.prototype.textboxKeyEvent = null;

/**
 * Fired when the auto complete instance makes a query to the data source.
 * Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The query string
 */
YAHOO.widget.AutoComplete.prototype.dataRequestEvent = null;

/**
 * Fired when the auto complete instance receives query results from the data
 * source. Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The query string
 *     - args[2] Results array
 */
YAHOO.widget.AutoComplete.prototype.dataReturnEvent = null;

/**
 * Fired when the auto complete instance does not receive query results from the
 * data source due to an error. Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The query string
 */
YAHOO.widget.AutoComplete.prototype.dataErrorEvent = null;

/**
 * Fired when the auto complete container is expanded. Subscribers receive the
 * following array:<br>
 *     - args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.containerExpandEvent = null;

/**
 * Fired when the auto complete textbox has been prefilled by the type-ahead
 * feature. Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The query string
 *     - args[2] The prefill string
 */
YAHOO.widget.AutoComplete.prototype.typeAheadEvent = null;

/**
 * Fired when result item has been moused over. Subscribers receive the following
 * array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The &lt;li&gt element item moused to
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent = null;

/**
 * Fired when result item has been moused out. Subscribers receive the
 * following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The &lt;li&gt; element item moused from
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent = null;

/**
 * Fired when result item has been arrowed to. Subscribers receive the following
 * array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The &lt;li&gt; element item arrowed to
 */
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent = null;

/**
 * Fired when result item has been arrowed away from. Subscribers receive the
 * following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The &lt;li&gt; element item arrowed from
 */
YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent = null;

/**
 * Fired when an item is selected via mouse click, ENTER key, or TAB key.
 * Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The selected &lt;li&gt; element item
 */
YAHOO.widget.AutoComplete.prototype.itemSelectEvent = null;

/**
 * Fired if forceSelection is enabled and the user's input has been cleared
 * because it did not match one of the returned query results. Subscribers
 * receive the following array:<br>
 *     - args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent = null;

/**
 * Fired when the auto complete container is collapsed. Subscribers receive the
 * following array:<br>
 *     - args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.containerCollapseEvent = null;

/**
 * Fired when the auto complete text input box loses focus. Subscribers receive
 * an array of the following array:<br>
 *     - args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.textboxBlurEvent = null;

/***************************************************************************
 * Private member variables
 ***************************************************************************/
/**
 * Internal class variable to index multiple auto complete instances.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete._nIndex = 0;

/**
 * Name of auto complete instance.
 *
 * @type string
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sName = null;

/**
 * Text input box DOM element.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oTextbox = null;

/**
 * Whether or not the textbox is currently in focus. If query results come back
 * but the user has already moved on, do not proceed with auto complete behavior.
 *
 * @type boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bFocused = true;

/**
 * Animation instance for container expand/collapse.
 *
 * @type boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oAnim = null;

/**
 * Container DOM element.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oContainer = null;

/**
 * Whether or not the auto complete container is currently open.
 *
 * @type boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bContainerOpen = false;

/**
 * Whether or not the mouse is currently over the auto complete
 * container. This is necessary in order to prevent clicks on container items
 * from being text input box blur events.
 *
 * @type boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bOverContainer = false;

/**
 * iFrame DOM element. Only used in IE for iframe trick.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oIFrame = null;

/**
 * Content DOM element. Only used in IE for iFrame trick.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oContent = null;

/**
 * Container header DOM element.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oHeader = null;

/**
 * Container footer DOM element.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oFooter = null;

/**
 * Array of &lt;li&gt; elements IDs used to display query results within the
 * auto complete container.
 *
 * @type array
 * @private
 */
YAHOO.widget.AutoComplete.prototype._aListIds = null;

/**
 * Number of &lt;li&gt; elements currently displayed in auto complete container.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDisplayedItems = 0;

/**
 * Current query string
 *
 * @type string
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sCurQuery = null;

/**
 * Past queries this session (for saving delimited queries).
 *
 * @type string
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sSavedQuery = null;

/**
 * Pointer to the currently highlighted &lt;li&gt; element in the container.
 *
 * @type object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oCurItem = null;

/**
 * Whether or not an item has been selected since the container was populated
 * with results. Reset to false by _populateList, and set to true when item is
 * selected.
 *
 * @type boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bItemSelected = false;

/**
 * Key code of the last key pressed in textbox.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nKeyCode = null;

/**
 * Delay timeout ID.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDelayID = -1;

/***************************************************************************
 * Private methods
 ***************************************************************************/
/**
 * Updates and validates latest public config properties.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initProps = function() {
    // Correct any invalid values
    var minQueryLength = this.minQueryLength;
    if(isNaN(minQueryLength) || (minQueryLength < 1)) {
        minQueryLength = 1;
    }
    var maxResultsDisplayed = this.maxResultsDisplayed;
    if(isNaN(this.maxResultsDisplayed) || (this.maxResultsDisplayed < 1)) {
        this.maxResultsDisplayed = 10;
    }
    var queryDelay = this.queryDelay;
    if(isNaN(this.queryDelay) || (this.queryDelay < 0)) {
        this.queryDelay = 0.5;
    }
    var aDelimChar = (this.delimChar) ? this.delimChar : null;
    if(aDelimChar) {
        if(typeof aDelimChar == "string") {
            this.delimChar = [aDelimChar];
        }
        else if(aDelimChar.constructor != Array) {
            this.delimChar = null;
        }
    }
    var animSpeed = this.animSpeed;
    if(this.animHoriz || this.animVert) {
        if(isNaN(animSpeed) || (animSpeed < 0)) {
            animSpeed = 0.3;
        }

        if(!this._oAnim && YAHOO.util.Anim) {
            this._oAnim = new YAHOO.util.Anim(this._oContainer, {}, animSpeed);
        }
        else if(this._oAnim) {
            this._oAnim.duration = animSpeed;
        }
    }
    if(this.forceSelection && this.delimChar) {
        //YAHOO.log(oSelf.getName() + " has enabled force selection with delimiter character(s) defined.","warn");
    }
    if (!this._aListIds) {
        this._aListIds = [];
    }

    if(!this._aListIds || (this.maxResultsDisplayed != this._aListIds.length)) {
        this._initContainer();
    }
};

/**
 * Initializes the auto complete container
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainer = function() {
    // Create the max number of <li> elements, but hide them all
    this._aListIds = [];
    var aItemsMarkup = [];
    var sName = this._sName;
    var sPrefix = sName + "item";
    var sHeaderID = sName + "header";
    var sFooterID = sName + "footer";

    for(var i = this.maxResultsDisplayed-1; i >= 0 ; i--) {
        var sItemID = sPrefix + i;
        this._aListIds[i] = sItemID;
        aItemsMarkup.unshift("<li id='" + sItemID + "'></li>\n");
    }

    var sList = "<ul id='" + sName + "list'>" +
        aItemsMarkup.join("") + "</ul>";

    // Need this iFrame trick to make sure the container appears over form
    // elements to workaround IE z-index bug
    var sContent = (this.useIFrame) ?
            ["<div id='",
            sName,
            "content'>",
            "<div id='",
            sHeaderID,
            "' class='ac_hd'></div><div class='ac_bd'>",
            sList,
            "</div><div id='",
            sFooterID,
            "' class='ac_ft'></div>",
            "</div><iframe id='",
            sName,
            "iframe' src='about:blank' frameborder='0' scrolling='no'>",
            "</iframe>"] :

            ["<div id='",
            sHeaderID,
            "' class='ac_hd'></div><div class='ac_bd'>",
            sList,
            "</div><div id='",
            sFooterID,
            "' class='ac_ft'></div>"];

    sContent = sContent.join("");
    this._oContainer.innerHTML = sContent;

    this._oHeader = document.getElementById(sHeaderID);
    this._oFooter = document.getElementById(sFooterID);

    if (this.useIFrame) {
        this._oContent = document.getElementById(sName + "content");
        this._oIFrame = document.getElementById(sName + "iframe");
        this._oContent.style.position = "relative";
        this._oIFrame.style.position = "relative";
        this._oContent.style.zIndex = 9050;
    }

    this._oContainer.style.display = "none";
    this._oHeader.style.display = "none";
    this._oFooter.style.display = "none";

    this._initItems();
};

/**
 * Initializes up to YAHOO.widget.AutoComplete#maxResultsDisplayed &lt;li&gt;
 * elements in the container.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initItems = function() {
    // set properties & events for each item now that they are in the DOM
    for(var i = this.maxResultsDisplayed-1; i >= 0 ; i--) {
        var oItem = document.getElementById(this._aListIds[i]);
        this._initItem(oItem, i);
    }
};

/**
 * Initializes each &lt;li&gt; element in the container .
 *
 * @param {object} oItem The &lt;li&gt; DOM element
 * @param {number} onItemIndex The index of the element
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initItem = function(oItem, nItemIndex) {
    var oSelf = this;
    oItem.style.display = "none";
    oItem._nItemIndex = nItemIndex;
    oItem.mouseover = oItem.mouseout = oItem.onclick = null;
    YAHOO.util.Event.addListener(oItem,'mouseover',oSelf._onItemMouseover,oSelf);
    YAHOO.util.Event.addListener(oItem,'mouseout',oSelf._onItemMouseout,oSelf);
    YAHOO.util.Event.addListener(oItem,'click',oSelf._onItemMouseclick,oSelf);
};

/**
 * Handles &lt;li&gt; element mouseover events in the container.
 *
 * @param {event} v The mouseover event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseover = function(v,oSelf) {
    oSelf._toggleHighlight(this,'mouseover');
    oSelf.itemMouseOverEvent.fire(oSelf, this);
    //YAHOO.log(oSelf.getName() + " moused over " + this.id);

};

/**
 * Handles &lt;li&gt; element mouseout events in the container.
 *
 * @param {event} v The mouseout event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseout = function(v,oSelf) {
    oSelf._toggleHighlight(this,'mouseout');
    oSelf.itemMouseOutEvent.fire(oSelf, this);
    //YAHOO.log(oSelf.getName() + " moused out from " + this.id);
};

/**
 * Handles &lt;li&gt; element click events in the container.
 *
 * @param {event} v The click event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseclick = function(v,oSelf) {
    // In case item has not been moused over
    oSelf._toggleHighlight(this,'mouseover');
    oSelf._selectItem(this);
};

/**
 * Handles container mouseover events.
 *
 * @param {event} v The mouseover event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseover = function(v,oSelf) {
    oSelf._bOverContainer = true;
};

/**
 * Handles container mouseout events.
 *
 * @param {event} v The mouseout event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseout = function(v,oSelf) {
    oSelf._bOverContainer = false;
    // If container is still active
    if(oSelf._oCurItem) {
        oSelf._toggleHighlight(oSelf._oCurItem,'mouseover');
    }
};

/**
 * Handles container scroll events.
 *
 * @param {event} v The scroll event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerScroll = function(v,oSelf) {
    oSelf._oTextbox.focus();
};


/**
 * Handles textbox keydown events of functional keys, mainly for UI behavior.
 *
 * @param {event} v The keydown event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown = function(v,oSelf) {
    var nKeyCode = v.keyCode;

    switch (nKeyCode) {
        case 9: // tab
            if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                if(oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                }
            }
            // select an item or clear out
            if(oSelf._oCurItem) {
                oSelf._selectItem(oSelf._oCurItem);
            }
            else {
                oSelf._clearList();
            }
            break;
        case 13: // enter
            if(oSelf._nKeyCode != nKeyCode) {
                if(oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                }
            }
            if(oSelf._oCurItem) {
                oSelf._selectItem(oSelf._oCurItem);
            }
            else {
                oSelf._clearList();
            }
            break;
        case 27: // esc
            oSelf._clearList();
            return;
        case 39: // right
            oSelf._jumpSelection();
            break;
        case 38: // up
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        case 40: // down
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        default:
            break;
    }
};

/**
 * Handles textbox keypress events, mainly for FF.
 *
 * @param {event} v The keyup event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress = function(v,oSelf) {
    var nKeyCode = v.keyCode;

    // for FF < 1.0
    switch (nKeyCode) {
    case 9: // tab
    case 13: // enter
        if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
            if(oSelf._bContainerOpen) {
                YAHOO.util.Event.stopEvent(v);
            }
        }
        break;
    case 38: // up
    case 40: // down
        YAHOO.util.Event.stopEvent(v);
        break;
    default:
        break;
    }
};

/**
 * Handles textbox keyup events that trigger queries.
 *
 * @param {event} v The keyup event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp = function(v,oSelf) {
    // Check to see if any of the public properties have been updated
    oSelf._initProps();

    var nKeyCode = v.keyCode;
    oSelf._nKeyCode = nKeyCode;
    var sChar = String.fromCharCode(nKeyCode);
    var sText = this.value; //string in textbox

    // Filter out chars that don't trigger queries
    if (oSelf._isIgnoreKey(nKeyCode) || (sText.toLowerCase() == this._sCurQuery)) {
        return;
    }
    else {
        oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
        //YAHOO.log(oSelf.getName() + " received key input " + nKeyCode);
    }

    // Set timeout on the request
    if (oSelf.queryDelay > 0) {
        var nDelayID =
            setTimeout(function(){oSelf._sendQuery(sText);},(oSelf.queryDelay * 1000));

        if (oSelf._nDelayID != -1) {
            clearTimeout(oSelf._nDelayID);
        }

        oSelf._nDelayID = nDelayID;
    }
    else {
        // No delay so send request immediately
        oSelf._sendQuery(sText);
    }
};

/**
 * Whether or not key is functional or should be ignored. Note that the right
 * arrow key is NOT an ignored key since it triggers queries for certain intl
 * charsets.
 *
 * @param {number} nKeycode Code of key pressed
 * @return {boolean} Whether or not to be ignore key
 * @private
 */
YAHOO.widget.AutoComplete.prototype._isIgnoreKey = function(nKeyCode) {
    if(this.typeAhead) { // fewer query triggers when type ahead is on
        if((nKeyCode == 8) || // backspace
        (nKeyCode == 39) || // right
        (nKeyCode == 46)) { // delete
            return true;
        }
    }
    if ((nKeyCode == 9) || (nKeyCode == 13)  || // tab, enter
            (nKeyCode == 16) || (nKeyCode == 17) || // shift, ctl
            (nKeyCode >= 18 && nKeyCode <= 20) || // alt,pause/break,caps lock
            (nKeyCode == 27) || // esc
            (nKeyCode >= 33 && nKeyCode <= 35) || // page up,page down,end
            (nKeyCode >= 36 && nKeyCode <= 38) || // home,left,up
            (nKeyCode == 40) || // down
            (nKeyCode >= 44 && nKeyCode <= 45)) { // print screen,insert
        return true;
    }
    return false;
};

/**
 * Handles text input box receiving focus.
 *
 * @param {event} v The focus event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxFocus = function (v,oSelf) {
    oSelf._oTextbox.setAttribute("autocomplete","off");
    oSelf._bFocused = true;
    oSelf.textboxFocusEvent.fire(oSelf);
    //YAHOO.log(oSelf.getName() + " textbox focused");
};

/**
 * Handles text input box losing focus.
 *
 * @param {event} v The focus event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxBlur = function (v,oSelf) {
    // Don't treat as a blur if it was a selection via mouse click
    if(!oSelf._bOverContainer || (oSelf._nKeyCode == 9)) {
        // Current query needs to be validated
        if(oSelf.forceSelection && !oSelf._bItemSelected) {
            if(!oSelf._bContainerOpen || (oSelf._bContainerOpen && !oSelf._textMatchesOption())) {
                oSelf._clearSelection();
            }
        }

        if(oSelf._bContainerOpen) {
            oSelf._clearList();
        }
        oSelf._bFocused = false;
        oSelf.textboxBlurEvent.fire(oSelf);
        //YAHOO.log(oSelf.getName() + " textbox blurred");
    }
};

/**
 * Handles form submission event.
 *
 * @param {event} v The submit event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onFormSubmit = function(v,oSelf) {
    oSelf._oTextbox.setAttribute("autocomplete","on");
};

/**
 * Makes query request to the data source.
 *
 * @param {string} sQuery Query string.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sendQuery = function(sQuery) {
    // Delimiter has been enabled
    var aDelimChar = (this.delimChar) ? this.delimChar : null;
    if(aDelimChar) {
        // Loop through all possible delimiters and find the latest one
        // A " " may be a false positive if they are defined as delimiters AND
        // are used to separate delimited queries
        var nDelimIndex = -1;
        for(var i = aDelimChar.length-1; i >= 0; i--) {
            var nNewIndex = sQuery.lastIndexOf(aDelimChar[i]);
            if(nNewIndex > nDelimIndex) {
                nDelimIndex = nNewIndex;
            }
        }
        // If we think the last delimiter is a space (" "), make sure it is NOT
        // a false positive by also checking the char directly before it
        if(aDelimChar[i] == " ") {
            for (var j = aDelimChar.length-1; j >= 0; j--) {
                if(sQuery[nDelimIndex - 1] == aDelimChar[j]) {
                    nDelimIndex--;
                    break;
                }
            }
        }
        // A delimiter has been found so extract the latest query
        if (nDelimIndex > -1) {
            var nQueryStart = nDelimIndex + 1;
            // Trim any white space from the beginning...
            while(sQuery.charAt(nQueryStart) == " ") {
                nQueryStart += 1;
            }
            // ...and save the rest of the string for later
            this._sSavedQuery = sQuery.substring(0,nQueryStart);
            // Here is the query itself
            sQuery = sQuery.substr(nQueryStart);
        }
        else if(sQuery.indexOf(this._sSavedQuery) < 0){
            this._sSavedQuery = null;
        }
    }

    // Don't search queries that are too short
    if (sQuery.length < this.minQueryLength) {
        if (this._nDelayID != -1) {
            clearTimeout(this._nDelayID);
        }
        this._clearList();
        return;
    }

    sQuery = encodeURI(sQuery);
    this._nDelayID = -1;    // Reset timeout ID because request has been made
    this.dataRequestEvent.fire(this, sQuery);
    //YAHOO.log(this.getName() + " requested data for query \"" + sQuery + "\"");
    this.dataSource.getResults(this._populateList, sQuery, this);
};

/**
 * Hides all visuals related to the array of &lt;li&gt; elements in the container.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._clearList = function() {
    this._oContainer.scrollTop = 0;
    var aItems = this._aListIds;

    for(var i = aItems.length-1; i >= 0 ; i--) {
        document.getElementById(aItems[i]).style.display = "none";
    }

    if (this._oCurItem) {
        this._toggleHighlight(this._oCurItem,'mouseout');
    }

    this._oCurItem = null;
    this._nDisplayedItems = 0;
    this._sCurQuery = null;
    this._toggleContainer(false);
};

/**
 * Populates the array of &lt;li&gt; elements in the container with query
 * results. This method is passed to YAHOO.widget.DataSource#getResults as a
 * callback function so results from the datasource are returned to the
 * auto complete instance.
 *
 * @param {string} sQuery The query string
 * @param {object} aResults An array of query result objects from the data source
 * @param {string} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._populateList = function(sQuery, aResults, oSelf) {
    if(aResults === null) {
        oSelf.dataErrorEvent.fire(oSelf, sQuery);
        //YAHOO.log(oSelf.getName() + " data error for query \"" + sQuery + "\"");
    }
    else {
        oSelf.dataReturnEvent.fire(oSelf, sQuery, aResults);
        //YAHOO.log(oSelf.getName() + " received " + aResults.length + " results for query \"" + sQuery + "\"");
    }

    if (!oSelf._bFocused || !aResults) {
        return;
    }

    var isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
    oSelf._oContainer.style.width = (!isOpera) ? null : "";
    oSelf._oContainer.style.height = (!isOpera) ? null : "";

    var sCurQuery = decodeURI(sQuery);
    oSelf._sCurQuery = sCurQuery;
    var aItems = oSelf._aListIds;
    oSelf._bItemSelected = false;

    var nItems = Math.min(aResults.length,oSelf.maxResultsDisplayed);
    oSelf._nDisplayedItems = nItems;
    if (nItems > 0) {
        // Fill items with data
        for(var i = nItems-1; i >= 0 ; i--) {
            var oItemi = document.getElementById(aItems[i]);
            var oResultItemi = aResults[i];
            oItemi.innerHTML = oSelf.formatResult(oResultItemi, sCurQuery);
            oItemi.style.display = "list-item";
            oItemi._sResultKey = oResultItemi[0];
            oItemi._oResultData = oResultItemi;

        }

        // Empty out remaining items if any
        for(var j = aItems.length-1; j >= nItems ; j--) {
            var oItemj = document.getElementById(aItems[j]);
            oItemj.innerHTML = null;
            oItemj.style.display = "none";
            oItemj._sResultKey = null;
            oItemj._oResultData = null;
        }

        // Select first item and show UI
        var oFirstItem = document.getElementById(aItems[0]);
        oSelf._toggleHighlight(oFirstItem,'mouseover');
        oSelf._toggleContainer(true);
        oSelf.itemArrowToEvent.fire(oSelf, oFirstItem);
        //YAHOO.log(oSelf.getName() + " arrowed to item " + oFirstItem.id);
        oSelf._typeAhead(oFirstItem,sQuery);
        oSelf._oCurItem = oFirstItem;
    }
    else {
        oSelf._clearList();
    }
};

/**
 * When YAHOO.widget.AutoComplete#bForceSelection is true and the user attempts
 * leave the text input box without selecting an item from the query results,
 * the user selection is cleared.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._clearSelection = function() {
    var sValue = this._oTextbox.value;
    var sChar = (this.delimChar) ? this.delimChar[0] : null;
    var nIndex = (sChar) ? sValue.lastIndexOf(sChar, sValue.length-2) : -1;
    if(nIndex > -1) {
        this._oTextbox.value = sValue.substring(0,nIndex);
    }
    else {
         this._oTextbox.value = "";
    }
    this._sSavedQuery = this._oTextbox.value;

    // Fire custom event
    this.selectionEnforceEvent.fire(this);
    //YAHOO.log(this.getName() + " cleared an invalid selection");
};

/**
 * Whether or not user-typed value in the text input box matches any of the
 * query results.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._textMatchesOption = function() {
    var foundMatch = false;

    for(var i = this._nDisplayedItems-1; i >= 0 ; i--) {
        var oItem = document.getElementById(this._aListIds[i]);
        var sMatch = oItem._sResultKey.toLowerCase();
        if (sMatch == this._sCurQuery.toLowerCase()) {
            foundMatch = true;
            break;
        }
    }
    return(foundMatch);
};

/**
 * Updates in the text input box with the first query result as the user types,
 * selecting the substring that the user has not typed.
 *
 * @param {object} oItem The &lt;li&gt; element item whose data populates the input field
 * @param {string} sQuery Query string
 * @private
 */
YAHOO.widget.AutoComplete.prototype._typeAhead = function(oItem, sQuery) {
    var oTextbox = this._oTextbox;
    var sValue = this._oTextbox.value; // any saved queries plus what user has typed

    // Don't update with type-ahead if turned off
    if (!this.typeAhead) {
        return;
    }

    // Don't update with type-ahead if text selection is not supported
    if(!oTextbox.setSelectionRange && !oTextbox.createTextRange) {
        return;
    }

    // Select the portion of text that the user has not typed
    var nStart = sValue.length;
    this._updateValue(oItem);
    var nEnd = oTextbox.value.length;
    this._selectText(oTextbox,nStart,nEnd);
    var sPrefill = oTextbox.value.substr(nStart,nEnd);
    this.typeAheadEvent.fire(this,sQuery,sPrefill);
    //YAHOO.log(this.getName() + " prefilled \"" + sPrefill + "\" for query " + sQuery + "\"");
};

/**
 * Selects text in a text input box.
 *
 * @param {object} oTextbox Text input box element in which to select text
 * @param {number} nStart Starting index of text string to select
 * @param {number} nEnd Ending index of text selection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectText = function(oTextbox, nStart, nEnd) {
    if (oTextbox.setSelectionRange) { // For Mozilla
        oTextbox.setSelectionRange(nStart,nEnd);
    }
    else if (oTextbox.createTextRange) { // For IE
        var oTextRange = oTextbox.createTextRange();
        oTextRange.moveStart("character", nStart);
        oTextRange.moveEnd("character", nEnd-oTextbox.value.length);
        oTextRange.select();
    }
    else {
        oTextbox.select();
    }
};

/**
 * Animates expansion or collapse of the container.
 *
 * @param {boolean} bShow True if container should be expanded, false if
 *                        container should be collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainer = function(bShow) {
    var oContainer = this._oContainer;
    // Don't animate if it's already closed && !bShow
    if (!bShow && !this._bContainerOpen) {
        oContainer.style.display = "none";
        return;
    }

    var oContent = this._oContent;
    var oIFrame = this._oIFrame;
    // Make the iframe used in the ie trick the same dimension as the content
    if (bShow && oContent && oIFrame) {
        var sDisplay = oContainer.style.display;
        oContainer.style.display = "block";
        oIFrame.style.width = oContent.offsetWidth+"px";
        oIFrame.style.height = oContent.offsetHeight+"px";
        oIFrame.style.marginTop = "-"+oContent.offsetHeight+"px";
        oContainer.style.display = sDisplay;
    }

    // If animation is enabled...
    var oAnim = this._oAnim;
    if (oAnim && oAnim.getEl() && (this.animHoriz || this.animVert)) {
        if(oAnim.isAnimated()) {
            oAnim.stop();
        }

        // Clone container to grab current size offscreen
        var oClone = oContainer.cloneNode(true);
        oContainer.parentNode.appendChild(oClone);
        oClone.style.top = "-9000px";
        oClone.style.display = "block";

        // Current size of the container is the EXPANDED size
        var wExp = oClone.offsetWidth;
        var hExp = oClone.offsetHeight;

        // Calculate COLLAPSED sizes based on horiz and vert anim
        var wColl = (this.animHoriz) ? 0 : wExp;
        var hColl = (this.animVert) ? 0 : hExp;

        // Set animation sizes
        oAnim.attributes = (bShow) ?
            {width: { to: wExp }, height: { to: hExp }} :
            {width: { to: wColl}, height: { to: hColl }};

        // If opening anew, set to a collapsed size...
        if(bShow && !this._bContainerOpen) {
            oContainer.style.width = wColl+"px";
            oContainer.style.height = hColl+"px";
        }
        // Else, set it to its last known size.
        else {
            oContainer.style.width = wExp+"px";
            oContainer.style.height = hExp+"px";
        }

        oContainer.parentNode.removeChild(oClone);
        oClone = null;

    	var oSelf = this;
    	var onAnimComplete = function() {
            // Finish the collapse
    		if(!bShow) {
                oContainer.style.display = "none";
    		}
    		oAnim.onComplete.unsubscribeAll();

            // Call event on expand/collapse (overridden by client)
            if(bShow) {
                oSelf.containerExpandEvent.fire(oSelf);
                //YAHOO.log(oSelf.getName() + " container expanded");
            }
            else {
                oSelf.containerCollapseEvent.fire(oSelf);
                //YAHOO.log(oSelf.getName() + " container collapsed");
            }
     	};

        // Display container and animate it
        oContainer.style.display = "block";
        oAnim.onComplete.subscribe(onAnimComplete);
        oAnim.animate();
        this._bContainerOpen = bShow;
    }
    // Else don't animate, just show or hide
    else {
        this._bContainerOpen = bShow;
        oContainer.style.display = (bShow) ? "block" : "none";

        // Call event on expand/collapse (overriden by client)
        if(bShow) {
            this.containerExpandEvent.fire(this);
            //YAHOO.log(this.getName() + " container expanded");
        }
        else {
            this.containerCollapseEvent.fire(this);
            //YAHOO.log(this.getName() + " container collapsed");
        }
    }
};

/**
 * Toggles the highlight on or off for an item in the container, and also cleans
 * up highlighting of any previous item.
 *
 * @param {object} oNewItem New The &lt;li&gt; element item to receive highlight
 *                              behavior
 * @param {string} sType "mouseover" will toggle highlight on, and "mouseout"
 *                       will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleHighlight = function(oNewItem, sType) {
    oNewItem.className = oNewItem.className.replace(this.highlightClassName,"");

    if(this._oCurItem) {
        this._oCurItem.className =
            this._oCurItem.className.replace(this.highlightClassName,"");
    }

    if(sType == 'mouseover') {
        oNewItem.className += " " + this.highlightClassName;
        this._oCurItem = oNewItem;
    }
};

/**
 * Updates the text input box value with selected query result. If a delimiter
 * has been defined, then the value gets appended with the delimiter.
 *
 * @param {object} oItem The &lt;li&gt; element item with which to update the value
 * @private
 */
YAHOO.widget.AutoComplete.prototype._updateValue = function(oItem) {
    var oTextbox = this._oTextbox;
    var sDelimChar = (this.delimChar) ? this.delimChar[0] : null;
    var sSavedQuery = this._sSavedQuery;
    var sResultKey = oItem._sResultKey;
    oTextbox.focus();

    // First clear text field
    oTextbox.value = "";
    // Grab data to put into text field
    if(sDelimChar) {
        if(sSavedQuery) {
            oTextbox.value = sSavedQuery;
        }
        oTextbox.value += sResultKey + sDelimChar;
        if(sDelimChar != " ") {
            oTextbox.value += " ";
        }
    }
    else { oTextbox.value = sResultKey; }

    // scroll to bottom of textarea if necessary
    if(oTextbox.type == "textarea") {
        oTextbox.scrollTop = oTextbox.scrollHeight;
    }
    // move cursor to end
    var end = oTextbox.value.length;
    this._selectText(oTextbox,end,end);

    this._oCurItem = oItem;
};

/**
 * Selects a result item from the container
 *
 * @param {object} oItem The selected &lt;li&gt; element item
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectItem = function(oItem) {
    this._bItemSelected = true;
    this._updateValue(oItem);
    this.itemSelectEvent.fire(this, oItem);
    //YAHOO.log(this.getName() + " selected item " + oItem.id);
    this._clearList();
};

/**
 * For values updated by type-ahead, the right arrow key jumps to the end
 * of the textbox, otherwise the container is closed.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._jumpSelection = function() {
    if(!this.typeAhead) {
        return;
    }
    else {
        this._clearList();
    }
};

/**
 * Triggered by up and down arrow keys, changes the current highlighted
 * &lt;li&gt; element item. Scrolls container if necessary.
 *
 * @param {number} nKeyCode Code of key pressed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._moveSelection = function(nKeyCode) {
    if(this._bContainerOpen) {
        // determine current item's id number
        var oCurItem = this._oCurItem;
        var nCurItemIndex = -1;

        if (oCurItem) {
            nCurItemIndex = oCurItem._nItemIndex;
        }

        var nNewItemIndex = (nKeyCode == 40) ?
                (nCurItemIndex + 1) : (nCurItemIndex - 1);

        // out of bounds
        if (nNewItemIndex < -2 || nNewItemIndex >= this._nDisplayedItems) {
            return;
        }

        if (oCurItem) {
            // Unhighlight current item
            this._toggleHighlight(oCurItem, 'mouseout');
            this.itemArrowFromEvent.fire(this, oCurItem);
            //YAHOO.log(this.getName() + " arrowed from " + oCurItem.id);

        }
        if (nNewItemIndex == -1) {
           // go back to query (remove type-ahead string)
            if(this.delimChar && this._sSavedQuery) {
                if (!this._textMatchesOption()) {
                    this._oTextbox.value = this._sSavedQuery;
                }
                else {
                    this._oTextbox.value = this._sSavedQuery + this._sCurQuery;
                }
            }
            else {
                this._oTextbox.value = this._sCurQuery;
            }
            this._oCurItem = null;
            return;
        }
        if (nNewItemIndex == -2) {
            // close container
            this._clearList();
            return;
        }

        var oNewItem = document.getElementById(this._sName + "item" + nNewItemIndex);

        // Scroll the container if necessary
        if((YAHOO.util.Dom.getStyle(this._oContainer,"overflow") == "auto") &&
        (nNewItemIndex > -1) && (nNewItemIndex < this._nDisplayedItems)) {
            // User is keying down
            if(nKeyCode == 40) {
                // Bottom of selected item is below scroll area...
                if((oNewItem.offsetTop+oNewItem.offsetHeight) > (this._oContainer.scrollTop + this._oContainer.offsetHeight)) {
                    // Set bottom of scroll area to bottom of selected item
                    this._oContainer.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - this._oContainer.offsetHeight;
                }
                // Bottom of selected item is above scroll area...
                else if((oNewItem.offsetTop+oNewItem.offsetHeight) < this._oContainer.scrollTop) {
                    // Set top of selected item to top of scroll area
                    this._oContainer.scrollTop = oNewItem.offsetTop;

                }
            }
            // User is keying up
            else {
                // Top of selected item is above scroll area
                if(oNewItem.offsetTop < this._oContainer.scrollTop) {
                    // Set top of scroll area to top of selected item
                    this._oContainer.scrollTop = oNewItem.offsetTop;
                }
                // Top of selected item is below scroll area
                else if(oNewItem.offsetTop > (this._oContainer.scrollTop + this._oContainer.offsetHeight)) {
                    // Set bottom of selected item to bottom of scroll area
                    this._oContainer.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - this._oContainer.offsetHeight;
                }
            }
        }

        this._toggleHighlight(oNewItem, 'mouseover');
        this.itemArrowToEvent.fire(this, oNewItem);
        //YAHOO.log(this.getName() + " arrowed to " + oNewItem.id);
        if(this.typeAhead) {
            this._updateValue(oNewItem);
        }
    }
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Class providing encapsulation of a data source.
 *
 * @constructor
 *
 */
YAHOO.widget.DataSource = function() {
    /* abstract class */
};


/***************************************************************************
 * Public constants
 ***************************************************************************/
/**
 * Error message for null data responses.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DataSource.prototype.ERROR_DATANULL = "Response data was null";

/**
 * Error message for data responses with parsing errors.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DataSource.prototype.ERROR_DATAPARSE = "Response data could not be parsed";


/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * Max size of the local cache.  Set to 0 to turn off caching.  Caching is
 * useful to reduce the number of server connections.  Recommended only for data
 * sources that return comprehensive results for queries or when stale data is
 * not an issue. Default: 15.
 *
 * @type number
 */
YAHOO.widget.DataSource.prototype.maxCacheEntries = 15;

/**
 * Use this to equate cache matching with the type of matching done by your live
 * data source. If caching is on and queryMatchContains is true, the cache
 * returns results that "contain" the query string. By default,
 * queryMatchContains is set to false, meaning the cache only returns results
 * that "start with" the query string. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchContains = false;

/**
 * Data source query subset matching. If caching is on and queryMatchSubset is
 * true, substrings of queries will return matching cached results. For
 * instance, if the first query is for "abc" susequent queries that start with
 * "abc", like "abcd", will be queried against the cache, and not the live data
 * source. Recommended only for data sources that return comprehensive results
 * for queries with very few characters. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchSubset = false;

/**
 * Data source query case-sensitivity matching. If caching is on and
 * queryMatchCase is true, queries will only return results for case-sensitive
 * matches. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.DataSource.prototype.queryMatchCase = false;


/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Retrieves query results, first checking the local cache, then making the
 * query request to the live data source as defined by the function doQuery.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DataSource.prototype.getResults = function(oCallbackFn, sQuery, oParent) {

    // First look in cache
    var aResults = this._doQueryCache(oCallbackFn,sQuery,oParent);

    // Not in cache, so get results from server
    if(aResults.length === 0) {
        this.queryEvent.fire(this, oParent, sQuery);
        //YAHOO.log("Data source for " + oParent.getName() + " made source query for '" + sQuery + "'.");
        this.doQuery(oCallbackFn, sQuery, oParent);
    }
};

/**
 * Abstract method implemented by subclasses to make a query to the live data
 * source. Must call the callback function with the response returned from the
 * query. Populates cache (if enabled).
 *
 * @param {object} oCallbackFn Callback function implemented by oParent to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DataSource.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    /* override this */
};

/**
 * Flushes cache.
 */
YAHOO.widget.DataSource.prototype.flushCache = function() {
    if(this._aCache) {
        this._aCache = [];
    }
    if(this._aCacheHelper) {
        this._aCacheHelper = [];
    }
    this.cacheFlushEvent.fire(this);
    //YAHOO.log("Cache flushed");
};

/***************************************************************************
 * Events
 ***************************************************************************/
/**
 * Fired when a query is made to the live data source. Subscribers receive the
 * following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 */
YAHOO.widget.DataSource.prototype.queryEvent = null;

/**
 * Fired when a query is made to the local cache. Subscribers receive the
 * following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 */
YAHOO.widget.DataSource.prototype.cacheQueryEvent = null;

/**
 * Fired when data is retrieved from the live data source. Subscribers receive
 * the following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Array of result objects
 */
YAHOO.widget.DataSource.prototype.getResultsEvent = null;

/**
 * Fired when data is retrieved from the local cache. Subscribers receive the
 * following array :<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Array of result objects
 */
YAHOO.widget.DataSource.prototype.getCachedResultsEvent = null;

/**
 * Fired when an error is encountered with the live data source. Subscribers
 * receive the following array:<br>
 *     - args[0] The data source instance
 *     - args[1] The requesting object
 *     - args[2] The query string
 *     - args[3] Error message string
 */
YAHOO.widget.DataSource.prototype.dataErrorEvent = null;

/**
 * Fired when the local cache is flushed. Subscribers receive the following
 * array :<br>
 *     - args[0] The data source instance
 */
YAHOO.widget.DataSource.prototype.cacheFlushEvent = null;

/***************************************************************************
 * Private member variables
 ***************************************************************************/
/**
 * Local cache of data result objects indexed chronologically.
 *
 * @type array
 * @private
 */
YAHOO.widget.DataSource.prototype._aCache = null;


/***************************************************************************
 * Private methods
 ***************************************************************************/
/**
 * Initializes data source instance.
 *
 * @private
 */
YAHOO.widget.DataSource.prototype._init = function() {
    // Validate and initialize public configs
    var maxCacheEntries = this.maxCacheEntries;
    if(isNaN(maxCacheEntries) || (maxCacheEntries < 0)) {
        maxCacheEntries = 0;
    }
    // Initialize local cache
    if(maxCacheEntries > 0 && !this._aCache) {
        this._aCache = [];
    }

    this.queryEvent = new YAHOO.util.CustomEvent("query", this);
    this.cacheQueryEvent = new YAHOO.util.CustomEvent("cacheQuery", this);
    this.getResultsEvent = new YAHOO.util.CustomEvent("getResults", this);
    this.getCachedResultsEvent = new YAHOO.util.CustomEvent("getCachedResults", this);
    this.dataErrorEvent = new YAHOO.util.CustomEvent("dataError", this);
    this.cacheFlushEvent = new YAHOO.util.CustomEvent("cacheFlush", this);
};

/**
 * Adds a result object to the local cache, evicting the oldest element if the
 * cache is full. Newer items will have higher indexes, the oldest item will have
 * index of 0.
 *
 * @param {object} resultObj  Object literal of data results, including internal
 *                            properties and an array of result objects
 * @private
 */
YAHOO.widget.DataSource.prototype._addCacheElem = function(resultObj) {
    var aCache = this._aCache;
    // Don't add if anything important is missing.
    if(!aCache || !resultObj || !resultObj.query || !resultObj.results) {
        return;
    }

    // If the cache is full, make room by removing from index=0
    if(aCache.length >= this.maxCacheEntries) {
        aCache.shift();
    }

    // Add to cache, at the end of the array
    aCache.push(resultObj);
};

/**
 * Queries the local cache for results. If query has been cached, the callback
 * function is called with the results, and the cached is refreshed so that it
 * is now the newest element.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 * @return {array} aResults Result object from local cache if found, otherwise
 *                          null
 * @private
 */
YAHOO.widget.DataSource.prototype._doQueryCache = function(oCallbackFn, sQuery, oParent) {
    var aResults = [];
    var bMatchFound = false;
    var aCache = this._aCache;
    var nCacheLength = (aCache) ? aCache.length : 0;
    var bMatchContains = this.queryMatchContains;

    // If cache is enabled...
    if((this.maxCacheEntries > 0) && aCache && (nCacheLength > 0)) {
        this.cacheQueryEvent.fire(this, oParent, sQuery);
        //YAHOO.log("Data source for " + oParent.getName() + " made cache query for '" + sQuery + "'.");
        // If case is unimportant, normalize query now instead of in loops
        if(!this.queryMatchCase) {
            var sOrigQuery = sQuery;
            sQuery = sQuery.toLowerCase();
        }

        // Loop through each cached element's query property...
        for(var i = nCacheLength-1; i >= 0; i--) {
            var resultObj = aCache[i];
            var aAllResultItems = resultObj.results;
            // If case is unimportant, normalize match key for comparison
            var matchKey = (!this.queryMatchCase) ?
                encodeURI(resultObj.query.toLowerCase()):
                encodeURI(resultObj.query);

            // If a cached match key exactly matches the query...
            if(matchKey == sQuery) {
                    // Stash all result objects into aResult[] and stop looping through the cache.
                    bMatchFound = true;
                    aResults = aAllResultItems;

                    // The matching cache element was not the most recent,
                    // so now we need to refresh the cache.
                    if(i != nCacheLength-1) {
                        // Remove element from its original location
                        aCache.splice(i,1);
                        // Add element as newest
                        this._addCacheElem(resultObj);
                    }
                    break;
            }
            // Else if this query is not an exact match and subset matching is enabled...
            else if(this.queryMatchSubset) {
                // Loop through substrings of each cached element's query property...
                for(var j = sQuery.length-1; j >= 0 ; j--) {
                    var subQuery = sQuery.substr(0,j);

                    // If a substring of a cached sQuery exactly matches the query...
                    if(matchKey == subQuery) {
                        bMatchFound = true;

                        // Go through each cached result object to match against the query...
                        for(var k = aAllResultItems.length-1; k >= 0; k--) {
                            var aRecord = aAllResultItems[k];
                            var sKeyIndex = (this.queryMatchCase) ?
                                encodeURI(aRecord[0]).indexOf(sQuery):
                                encodeURI(aRecord[0]).toLowerCase().indexOf(sQuery);

                            // A STARTSWITH match is when the query is found at the beginning of the key string...
                            if((!bMatchContains && (sKeyIndex === 0)) ||
                            // A CONTAINS match is when the query is found anywhere within the key string...
                            (bMatchContains && (sKeyIndex > -1))) {
                                // Stash a match into aResults[].
                                aResults.unshift(aRecord);
                            }
                        }

                        // Add the subset match result set object as the newest element to cache,
                        // and stop looping through the cache.
                        resultObj = {};
                        resultObj.query = sQuery;
                        resultObj.results = aResults;
                        this._addCacheElem(resultObj);
                        break;
                    }
                }
                if(bMatchFound) {
                    break;
                }
            }
        }

        // If there was a match, send along the results.
        if(bMatchFound) {
            this.getCachedResultsEvent.fire(this, oParent, sOrigQuery, aResults);
            //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from cache.");
            oCallbackFn(sOrigQuery, aResults, oParent);
        }
    }
    return aResults;
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using XML HTTP requests that return
 * query results.
 * requires YAHOO.util.Connect XMLHTTPRequest library
 * extends YAHOO.widget.DataSource
 *
 * @constructor
 * @param {string} sScriptURI Absolute or relative URI to script that returns
 *                            query results as JSON, XML, or delimited flat data
 * @param {array} aSchema Data schema definition of results
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_XHR = function(sScriptURI, aSchema, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    if(!aSchema || (aSchema.constructor != Array)) {
        //log this.ERROR_INIT
    }
    else {
        this.schema = aSchema;
    }
    this.scriptURI = sScriptURI;
    this._init();
};

YAHOO.widget.DS_XHR.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public constants
 ***************************************************************************/
/**
 * JSON data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_JSON = 0;

/**
 * XML data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_XML = 1;

/**
 * Flat file data type
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.TYPE_FLAT = 2;

/**
 * Error message for XHR failure.
 *
 * @type constant
 * @final
 */
YAHOO.widget.DS_XHR.prototype.ERROR_DATAXHR = "XHR response failed";

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * Absolute or relative URI to script that returns query results. For instance,
 * queries will be sent to
 *   <scriptURI>?<scriptQueryParam>=userinput
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptURI = null;

/**
 * Query string parameter name sent to scriptURI. For instance, queries will be
 * sent to
 *   <scriptURI>?<scriptQueryParam>=userinput
 * Default: "query".
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryParam = "query";

/**
 * String of key/value pairs to append to requests made to scriptURI. Define
 * this string when you want to send additional query parameters to your script.
 * When defined, queries will be sent to
 *   <scriptURI>?<scriptQueryParam>=userinput&<scriptQueryAppend>
 * Default: "".
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryAppend = "";

/**
 * XHR response data type. Other types that may be defined are TYPE_XML and
 * TYPE_FLAT. Default: TYPE_JSON.
 *
 * @type type
 */
YAHOO.widget.DS_XHR.prototype.responseType = YAHOO.widget.DS_XHR.prototype.TYPE_JSON;

/**
 * String after which to strip results. If the results from the XHR are sent
 * back as HTML, the gzip HTML comment appears at the end of the data and should
 * be ignored.  Default: "\n&lt;!--"
 *
 * @type string
 */
YAHOO.widget.DS_XHR.prototype.responseStripAfter = "\n<!--";

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by scriptURI for results. Results are
 * passed back to a callback function.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_XHR.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var isXML = (this.responseType == this.TYPE_XML);
    var sUri = this.scriptURI+"?"+this.scriptQueryParam+"="+sQuery;
    if(this.scriptQueryAppend.length > 0) {
        sUri += "&" + this.scriptQueryAppend;
    }
    //YAHOO.log("Data source query URL is " + sUri);
    var oResponse = null;

    var oSelf = this;
    /**
     * Sets up ajax request callback
     *
     * @param {object} oReq          HTTPXMLRequest object
     * @private
     */
    var responseSuccess = function(oResp) {
        if(!isXML) {
            oResp = oResp.responseText;
        }
        else {
            oResp = oResp.responseXML;
        }
        if(oResp === null) {
            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, oSelf.ERROR_DATANULL);
            //YAHOO.log("Data source for " + oParent.getName() +
            //    " experienced a data error for query \"" + sQuery +
            //    "\": " + oSelf.ERROR_DATANULL, "error");
            oCallbackFn(sQuery, null, oParent);
            return;
        }

        var resultObj = {};
        resultObj.query = decodeURI(sQuery);
        resultObj.results = oSelf.parseResponse(sQuery, oResp, oParent);
        oSelf._addCacheElem(resultObj);
        oCallbackFn(sQuery, resultObj.results, oParent);
    };

    var responseFailure = function(oResp) {
        oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, oSelf.ERROR_DATAXHR);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + oSelf.ERROR_DATAXHR, "error");
        oCallbackFn(sQuery, null, oParent);
        return;
    };

    var oCallback = {
        success:responseSuccess,
        failure:responseFailure
    };

    YAHOO.util.Connect.asyncRequest("GET", sUri, oCallback, null);
};

/**
 * Parses raw response data into an array of result objects. The result data key
 * is always stashed in the [0] element of each result object.
 *
 * @param {string} sQuery Query string
 * @param {object} oResponse The raw response data to parse
 * @param {object} oParent The object instance that has requested data
 * @returns {array} Array of result objects
 */
YAHOO.widget.DS_XHR.prototype.parseResponse = function(sQuery, oResponse, oParent) {
    var aSchema = this.schema;
    var aResults = [];
    var bError = false;

    // Strip out comment at the end of results
    var nEnd = ((this.responseStripAfter !== "") && (oResponse.indexOf)) ?
        oResponse.indexOf(this.responseStripAfter) : -1;
    if(nEnd != -1) {
        oResponse = oResponse.substring(0,nEnd);
    }

    switch (this.responseType) {
        case this.TYPE_JSON:
            if(window.JSON) {
                var jsonObjParsed = JSON.parse(oResponse);
                if(!jsonObjParsed) {
                    bError = true;
                    break;
                }
                else {
                    // eval is necessary here since aSchema[0] is of unknown depth
                    var jsonListParsed = eval("jsonObjParsed." + aSchema[0]);
                    for(var i = jsonListParsed.length-1; i >= 0 ; i--) {
                        // eval is necessary here since aSchema[1] is of unknown depth
                        jsonListParsed[i][0] = eval("jsonListParsed[i]." + aSchema[1]);
                        aResults[i] = jsonListParsed[i];
                    }
                    break;
                }
            }
            else {
                try {
                    // trim leading spaces
                    while (oResponse.substring(0,1) == " ") {
                        oResponse = oResponse.substring(1, oResponse.length);
                    }

                    // zero response
                    if((oResponse.indexOf("{}") === 0) ||
                        (oResponse.indexOf("{") < 0)) {
                        break;
                    }

                    // eval is necessary here
                    var jsonObjRaw = eval('(' + oResponse + ')');

                    // eval is necessary here since aSchema[0] is of unknown depth
                    var jsonListRaw = eval("jsonObjRaw." + aSchema[0]);

                    for(var j = jsonListRaw.length-1; j >= 0 ; j--) {
                        // eval is probably not necessary here
                        //jsonListRaw[j][0] = eval("jsonListRaw[j]." + aSchema[1]);
                        jsonListRaw[j][0] = jsonListRaw[j][aSchema[1]];
                        aResults[j] = jsonListRaw[j];
                    }
                    break;
                }
                catch(e) {
                    bError = true;
                    break;
               }
            }
            break;
        case this.TYPE_XML:
           var xmlList = oResponse.getElementsByTagName(aSchema[0]);
             for(var k = xmlList.length-1; k >= 0 ; k--) {
                var result = xmlList.item(k);//doLog(k+' is '+result.attributes.item(0).firstChild.nodeValue);
                var aFieldSet = [];
                for(var m = aSchema.length-1; m >= 1 ; m--) {//doLog(aSchema[m]+' is '+result.attributes.getNamedItem(aSchema[m]).firstChild.nodeValue);
                    var sValue = null;
                    // Capture each data value into an array
                    // Data may be held in an attribute...
                    var xmlAttr = result.attributes.getNamedItem(aSchema[m]);
                    if(xmlAttr) {
                        sValue = xmlAttr.value;//doLog('attr'+sValue);
                    }
                    // Or in a node...
                    else {
                        var xmlNode = result.getElementsByTagName(aSchema[m]);
                        if(xmlNode) {
                            sValue = xmlNode.item(0).firstChild.nodeValue;// doLog('node'+sValue);
                        }
                    }
                    aFieldSet.unshift(sValue);
                }
                aResults.unshift(aFieldSet);
            }
            break;
        case this.TYPE_FLAT:
            if(oResponse.length > 0) {
                // Delete the last line delimiter at the end of the data if it exists
                var newLength = oResponse.length-aSchema[0].length;
                if(oResponse.substr(newLength) == aSchema[0]) {
                    oResponse = oResponse.substr(0, newLength);
                }
                var aRecords = oResponse.split(aSchema[0]);
                for(var n = aRecords.length-1; n >= 0; n--) {
                    aResults[n] = aRecords[n].split(aSchema[1]);
                }
            }
            break;
        default:
            break;
    }
    if(bError) {
        this.dataErrorEvent.fire(this, oParent, sQuery, this.ERROR_DATAPARSE);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + this.ERROR_DATAPARSE, "error");
        return null;
    }
    else {
        this.getResultsEvent.fire(this, oParent, sQuery, aResults);
        //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
        return aResults;
    }
};


/***************************************************************************
 * Private member variables
 ***************************************************************************/
/**
 * XHR connection object.
 *
 * @type object
 * @private
 */
YAHOO.widget.DS_XHR.prototype._oConn = null;


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using a native Javascript struct as
 * its live data source.
 *
 * @constructor
 * extends YAHOO.widget.DataSource
 *
 * @param {string} oFunction In-memory Javascript function that returns query
 *                           results as an array of objects
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_JSFunction = function(oFunction, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    this.dataFunction = oFunction;
    this._init();
};

YAHOO.widget.DS_JSFunction.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * In-memory Javascript function that returns query results.
 *
 * @type function
 */
YAHOO.widget.DS_JSFunction.prototype.dataFunction = null;


/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by function for results. Results are
 * passed back to a callback function.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_JSFunction.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var oFunction = this.dataFunction;
    var aResults = [];

    aResults = oFunction(sQuery);
    if(aResults === null) {
        this.dataErrorEvent.fire(this, oParent, sQuery, this.ERROR_DATANULL);
        //YAHOO.log("Data source for " + oParent.getName() +
        //        " experienced a data error for query \"" + sQuery +
        //        "\": " + oSelf.ERROR_DATANULL, "error");
        oCallbackFn(sQuery, null, oParent);
        return;
    }

    var resultObj = {};
    resultObj.query = decodeURI(sQuery);
    resultObj.results = aResults;
    this._addCacheElem(resultObj);

    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
    //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
    oCallbackFn(sQuery, aResults, oParent);
    return;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using a native Javascript array as
 * its live data source.
 *
 * @constructor
 * extends YAHOO.widget.DataSource
 *
 * @param {string} aData In-memory Javascript array of simple string data
 * @param {object} oConfigs Optional object literal of config params
 */
YAHOO.widget.DS_JSArray = function(aData, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    this.data = aData;
    this._init();
};

YAHOO.widget.DS_JSArray.prototype = new YAHOO.widget.DataSource();

/***************************************************************************
 * Public member variables
 ***************************************************************************/
/**
 * In-memory Javascript array of strings.
 *
 * @type array
 */
YAHOO.widget.DS_JSArray.prototype.data = null;

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Queries the live data source defined by data for results. Results are passed
 * back to a callback function.
 *
 * @param {object} oCallbackFn Callback function defined by oParent object to
 *                             which to return results
 * @param {string} sQuery Query string
 * @param {object} oParent The object instance that has requested data
 */
YAHOO.widget.DS_JSArray.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var aData = this.data;
    var aResults = [];
    var bMatchFound = false;
    var bMatchContains = this.queryMatchContains;
    if(!this.queryMatchCase) {
        sQuery = sQuery.toLowerCase();
    }

    // Loop through each element of the array...
    for(var i = aData.length-1; i >= 0; i--) {
        var aDataset = [];
        if(typeof aData[i] == "string") {
            aDataset[0] = aData[i];
        }
        else {
            aDataset = aData[i];
        }

        var sKeyIndex = (this.queryMatchCase) ?
            encodeURI(aDataset[0]).indexOf(sQuery):
            encodeURI(aDataset[0]).toLowerCase().indexOf(sQuery);

        // A STARTSWITH match is when the query is found at the beginning of the key string...
        if((!bMatchContains && (sKeyIndex === 0)) ||
        // A CONTAINS match is when the query is found anywhere within the key string...
        (bMatchContains && (sKeyIndex > -1))) {
            // Stash a match into aResults[].
            aResults.unshift(aDataset);
        }
    }

    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
    //YAHOO.log("Data source for " + oParent.getName() + " got " + aResults.length + " results from source.");
    oCallbackFn(sQuery, aResults, oParent);
};
