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
 * requires YAHOO.util.Dom Dom utility
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
            YAHOO.log("Could not instantiate AutoComplete due to an invalid DataSource", "error", this.toString());
            return;
        }
        // Validate input element
        if(YAHOO.util.Dom.inDocument(inputEl)) {
            if(typeof inputEl == "string") {
                    this._sName = "instance" + YAHOO.widget.AutoComplete._nIndex + " " + inputEl;
                    this._oTextbox = document.getElementById(inputEl);
            }
            else {
                this._sName = (inputEl.id) ?
                    "instance" + YAHOO.widget.AutoComplete._nIndex + " " + inputEl.id:
                    "instance" + YAHOO.widget.AutoComplete._nIndex;
                this._oTextbox = inputEl;
            }
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid input element", "error", this.toString());
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
            if(this._oContainer.style.display == "none") {
                YAHOO.log("The container may not display properly if display is set to \"none\" in CSS", "warn", this.toString());
            }
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid container element", "error", this.toString());
            return;
        }

        // Initialization sequence
        this._initContainer();
        this._initProps();
        this._initList();
        this._initContainerHelpers();
        
        var oSelf = this;
        var oTextbox = this._oTextbox;
        // Events are actually for the content module within the container
        var oContent = this._oContainer._oContent;

        // Set any config params passed in to override defaults
        if (typeof oConfigs == "object") {
            for(var sConfig in oConfigs) {
                if (sConfig) {
                    this[sConfig] = oConfigs[sConfig];
                }
            }
        }
        
        YAHOO.widget.AutoComplete._nIndex++;

        // Set up events
        YAHOO.util.Event.addListener(oTextbox,'keyup',oSelf._onTextboxKeyUp,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'keydown',oSelf._onTextboxKeyDown,oSelf);
        // only for FF < 1.0
        //YAHOO.util.Event.addListener(oTextbox,'keypress',oSelf._onTextboxKeyPress,oSelf);

        YAHOO.util.Event.addListener(oTextbox,'focus',oSelf._onTextboxFocus,oSelf);
        YAHOO.util.Event.addListener(oTextbox,'blur',oSelf._onTextboxBlur,oSelf);
        YAHOO.util.Event.addListener(oContent,'mouseover',oSelf._onContainerMouseover,oSelf);
        YAHOO.util.Event.addListener(oContent,'mouseout',oSelf._onContainerMouseout,oSelf);
        YAHOO.util.Event.addListener(oContent,'scroll',oSelf._onContainerScroll,oSelf);
        YAHOO.util.Event.addListener(oContent,'resize',oSelf._onContainerResize,oSelf);
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
        this.unmatchedItemSelectEvent = new YAHOO.util.CustomEvent("unmatchedItemSelect", this);
        this.selectionEnforceEvent = new YAHOO.util.CustomEvent("selectionEnforce", this);
        this.containerCollapseEvent = new YAHOO.util.CustomEvent("containerCollapse", this);
        this.textboxBlurEvent = new YAHOO.util.CustomEvent("textboxBlur", this);

        // Turn off autocomplete on textbox
        oTextbox.setAttribute("autocomplete","off");  
    }
    // Required arguments were not found
    else {
        YAHOO.log("Could not instantiate AutoComplete due invalid arguments", "error", this.toString());
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
 * Class name of a pre-highlighted item within the auto complete container.
 * Default: null.
 *
 * @type string
 */
YAHOO.widget.AutoComplete.prototype.prehighlightClassName = null;

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
 * Whether or not the first item in the auto complete container should be
 * automatically highlighted on expand. Default: true.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.autoHighlight = true;

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
 * container in the horizontal direction. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.animHoriz = false;

/**
 * Whether or not to animate the expansion/collapse of the auto complete
 * container in the vertical direction. Default: true.
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
 * Whether or not to allow browsers to cache user-typed input in the input
 * field. Disabling this feature will prevent the widget from setting the
 * autocomplete="off" on the auto complete input field. When autocomplete="off"
 * and users click the back button after form submission, user-typed input can
 * be prefilled by the browser from its cache. This caching of user input may
 * not be desired for sensitive data, such as credit card numbers, in which
 * case, implementers should consider setting allowBrowserAutocomplete to false.
 * Default: true.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete = true;

/**
 * Whether or not the auto complete container should always be displayed.
 * Enabling this feature prevents the toggling of the container to a collapsed
 * state. Default: false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.alwaysShowContainer = false;

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
 * Configurable iFrame src used when useIFrame = true. Implementations over SSL
 * should set this parameter to an appropriate https location in order to avoid
 * security-related browser errors. Default:"about:blank".
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.iFrameURI = "about:blank";

/**
 * Whether or not the auto complete container should have a shadow. Default:false.
 *
 * @type boolean
 */
YAHOO.widget.AutoComplete.prototype.useShadow = false;

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
 * Public accessor to the unique name of the auto complete instance.
 *
 * @return {string} Unique name of the auto complete instance
 */
YAHOO.widget.AutoComplete.prototype.toString = function() {
    return "AutoComplete " + this._sName;
};

/**
 * Public accessor to the internal array of DOM &lt;li&gt; element IDs that
 * display query results within the auto complete container.
 *
 * @return {array} Array of &lt;li&gt; element IDs within the auto complete
 *                 container 
 */
YAHOO.widget.AutoComplete.prototype.getListIds = function() {
    //TODO: go through getListItems to return ids
    return this._aListItems;
};

/**
 * Sets HTML markup for the auto complete container header. This markup will be 
 * inserted within a &lt;div&gt; tag with a class of "ac_hd".
 *
 * @param {string} sHeader HTML markup for container header
 */
YAHOO.widget.AutoComplete.prototype.setHeader = function(sHeader) {
    if(sHeader) {
        if(this._oContainer._oContent._oHeader) {
            this._oContainer._oContent._oHeader.innerHTML = sHeader;
            this._oContainer._oContent._oHeader.style.display = "block";
        }
    }
    else {
        this._oContainer._oContent._oHeader.innerHTML = "";
        this._oContainer._oContent._oHeader.style.display = "none";
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
        if(this._oContainer._oContent._oFooter) {
            this._oContainer._oContent._oFooter.innerHTML = sFooter;
            this._oContainer._oContent._oFooter.style.display = "block";
        }
    }
    else {
        this._oContainer._oContent._oFooter.innerHTML = "";
        this._oContainer._oContent._oFooter.style.display = "none";
    }
};

/**
 * Sets HTML markup for the auto complete container body. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_bd".
 *
 * @param {string} sHeader HTML markup for container body
 */
YAHOO.widget.AutoComplete.prototype.setBody = function(sBody) {
    if(sBody) {
        if(this._oContainer._oContent._oBody) {
            this._oContainer._oContent._oBody.innerHTML = sBody;
            this._oContainer._oContent._oBody.style.display = "block";
            this._oContainer._oContent.style.display = "block";
        }
    }
    else {
        this._oContainer._oContent._oBody.innerHTML = "";
        this._oContainer._oContent.style.display = "none";
    }
    this._maxResultsDisplayed = 0;
};

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

/**
 * Makes query request to the data source.
 *
 * @param {string} sQuery Query string.
 */
YAHOO.widget.AutoComplete.prototype.sendQuery = function(sQuery) {
    this._sendQuery(sQuery);
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
 * Fired when the auto complete container is expanded. If alwaysShowContainer is
 * enabled, then containerExpandEvent will be fired when the container is
 * populated with results. Subscribers receive the following array:<br>
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
 *     - args[2] The data returned for the item, either as an object, or mapped from the schema into an array
 */
YAHOO.widget.AutoComplete.prototype.itemSelectEvent = null;

/**
 * Fired when an user selection does not match any of the displayed result items.
 * Subscribers receive the following array:<br>
 *     - args[0] The auto complete object instance
 *     - args[1] The user selection
 */
YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent = null;

/**
 * Fired if forceSelection is enabled and the user's input has been cleared
 * because it did not match one of the returned query results. Subscribers
 * receive the following array:<br>
 *     - args[0] The auto complete object instance
 */
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent = null;

/**
 * Fired when the auto complete container is collapsed. If alwaysShowContainer is
 * enabled, then containerCollapseEvent will be fired when the container is
 * cleared of results. Subscribers receive the following array:<br>
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
//YAHOO.widget.AutoComplete.prototype._oIFrame = null;

/**
 * Content DOM element. Only used in IE for iFrame trick.
 *
 * @type object
 * @private
 */
//YAHOO.widget.AutoComplete.prototype._oContent = null;

/**
 * Container header DOM element.
 *
 * @type object
 * @private
 */
//YAHOO.widget.AutoComplete.prototype._oHeader = null;

/**
 * Container footer DOM element.
 *
 * @type object
 * @private
 */
//YAHOO.widget.AutoComplete.prototype._oFooter = null;

/**
 * Array of &lt;li&gt; elements references that contain query results within the
 * auto complete container.
 *
 * @type array
 * @private
 */
YAHOO.widget.AutoComplete.prototype._aListItems = null;

/**
 * Number of &lt;li&gt; elements currently displayed in auto complete container.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDisplayedItems = 0;

/**
 * Internal count of &lt;li&gt; elements displayed and hidden in auto complete container.
 *
 * @type number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._maxResultsDisplayed = 0;

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
    if((this.animHoriz || this.animVert) && YAHOO.util.Anim) {
        if(isNaN(animSpeed) || (animSpeed < 0)) {
            animSpeed = 0.3;
        }
        if(!this._oAnim ) {
            oAnim = new YAHOO.util.Anim(this._oContainer._oContent, {}, this.animSpeed);
            this._oAnim = oAnim;
        }
        else {
            this._oAnim.duration = animSpeed;
        }
    }
    if(this.forceSelection && this.delimChar) {
        YAHOO.log(oSelf.getName() + " has enabled force selection with delimiter character(s) defined.","warn", this.toString());
    }

    if(!this.alwaysShowContainer) {
        //this._oContainer._oContent.style.display = "none";//DEBUG
        //this._toggleContainerHelpers(false);
    }
    else {
        this._bContainerOpen = true;
    }
};

/**
 * Initializes the auto complete container, including iframe shim for IE bug
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainerHelpers = function() {
    // TODO: don't blow things away unless you have to
    //TODO: make sure this destroys everything in memory
    /*if(this._oContainer.hasChildNodes()) {
        for(var i=this._oContainer.childNodes.length-1; i >= 0; i--)
            this._oContainer.removeChild(this._oContainer.childNodes[i]);
    }*/

    if(this.useShadow && !this._oContainer._oShadow) {
        var oShadow = document.createElement("div");
        oShadow.className = "shadow";
        this._oContainer._oShadow = this._oContainer.appendChild(oShadow);
    }
    if(this.useIFrame && !this._oContainer._oIFrame) {
        var oIFrame = document.createElement("iframe");
        // TODO: configurable src
        oIFrame.src = this.iFrameURI;
        oIFrame.frameBorder = 0;
        oIFrame.scrolling = "no";
        oIFrame.style.position = "absolute";
        oIFrame.style.width = "100%";
        oIFrame.style.height = "100%";
        this._oContainer._oIFrame = this._oContainer.appendChild(oIFrame);
    }
};

/**
 * Initializes the auto complete container, including iframe shim for IE bug
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainer = function() {
    // TODO: don't blow things away unless you have to
    //TODO: make sure this destroys everything in memory
    /*if(this._oContainer.hasChildNodes()) {
        for(var i=this._oContainer.childNodes.length-1; i >= 0; i--)
            this._oContainer.removeChild(this._oContainer.childNodes[i]);
    }*/

    if(!this._oContainer._oContent) {
        // The div oContent helps size the iframe and shadow properly
        var oContent = document.createElement("div");
        oContent.className = "content";
        oContent.style.display = "none";
        this._oContainer._oContent = this._oContainer.appendChild(oContent);

        var oHeader = document.createElement("div");
        oHeader.className = "ac_hd";
        oHeader.style.display = "none";//DEBUG
        this._oContainer._oContent._oHeader = this._oContainer._oContent.appendChild(oHeader);

        var oBody = document.createElement("div");
        oBody.className = "ac_bd";
        this._oContainer._oContent._oBody = this._oContainer._oContent.appendChild(oBody);

        var oFooter = document.createElement("div");
        oFooter.className = "ac_ft";
        oFooter.style.display = "none";//DEBUG
        this._oContainer._oContent._oFooter = this._oContainer._oContent.appendChild(oFooter);
    }

    /*this._oContainer._oHeader = //(this.useIFrame) ?
        //this._oContent.appendChild(oHeader):
        this._oContainer.appendChild(oHeader);
    this._oContainer._oBody = //(this.useIFrame) ?
        //this._oContent.appendChild(oBody):
        this._oContainer.appendChild(oBody);
    this._oContainer._oFooter = //(this.useIFrame) ?
        //this._oContent.appendChild(oFooter) :
        this._oContainer.appendChild(oFooter);*/
};

/**
 * Creates up to YAHOO.widget.AutoComplete#maxResultsDisplayed &lt;li&gt;
 * elements in a container list.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initList = function() {
    this._aListItems = [];
    while(this._oContainer._oContent._oBody.hasChildNodes()) {
        this._oContainer._oContent._oBody.removeChild(this._oContainer._oContent._oBody.firstChild);
    }

    var oList = document.createElement("ul");
    oList = this._oContainer._oContent._oBody.appendChild(oList);
    for(var i=0; i<this.maxResultsDisplayed; i++) {
        var oItem = document.createElement("li");
        oItem = oList.appendChild(oItem);
        oItem.innerHTML = "result";
        //TODO:oItem.toString = function() {return "foobar";};
        this._aListItems[i] = oItem;
        this._initListItem(oItem, i);
    }
    this._maxResultsDisplayed = this.maxResultsDisplayed;
};

/**
 * Initializes each &lt;li&gt; element in the container list.
 *
 * @param {object} oItem The &lt;li&gt; DOM element
 * @param {number} onItemIndex The index of the element
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initListItem = function(oItem, nItemIndex) {
    var oSelf = this;
    oItem.style.display = "none";//DEBUG
    oItem._nItemIndex = nItemIndex;
    oItem.toString = function () {
        return oSelf.getName() + "LI" + nItemIndex;
    };
    
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
    if(oSelf.prehighlightClassName) {
        oSelf._togglePrehighlight(this,'mouseover');
    }
    else {
        oSelf._toggleHighlight(this,'to');
    }
    
    oSelf.itemMouseOverEvent.fire(oSelf, this);
};

/**
 * Handles &lt;li&gt; element mouseout events in the container.
 *
 * @param {event} v The mouseout event
 * @param {object} oSelf The auto complete instance 
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseout = function(v,oSelf) {
    if(oSelf.prehighlightClassName) {
        oSelf._togglePrehighlight(this,'mouseout');
    }
    else {
        oSelf._toggleHighlight(this,'from');
    }

    oSelf.itemMouseOutEvent.fire(oSelf, this);
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
    oSelf._toggleHighlight(this,'to');
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
        oSelf._toggleHighlight(oSelf._oCurItem,'to');
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
 * Handles container resize events.
 *
 * @param {event} v The scroll event
 * @param {object} oSelf The auto complete instance
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerResize = function(v,oSelf) {//TODO('container resized');
    oSelf._toggleContainerHelpers(oSelf._bContainerOpen);
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
/*YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress = function(v,oSelf) {
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
};*/

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
    if (oSelf._isIgnoreKey(nKeyCode) || (sText.toLowerCase() == oSelf._sCurQuery)) {
        return;
    }
    else {
        oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
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
        if(!oSelf._bItemSelected) {
            if(!oSelf._bContainerOpen || (oSelf._bContainerOpen && !oSelf._textMatchesOption())) {
                if(oSelf.forceSelection) {
                    oSelf._clearSelection();
                }
                else {
                    oSelf.unmatchedItemSelectEvent.fire(oSelf, oSelf._sCurQuery);
                }
            }
        }
            
        if(oSelf._bContainerOpen) {
            oSelf._clearList();
        }
        oSelf._bFocused = false;
        oSelf.textboxBlurEvent.fire(oSelf);
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
    
    sQuery = encodeURIComponent(sQuery);
    this._nDelayID = -1;    // Reset timeout ID because request has been made
    this.dataRequestEvent.fire(this, sQuery);
    this.dataSource.getResults(this._populateList, sQuery, this);
};

/**
 * Hides all visuals related to the array of &lt;li&gt; elements in the container.
 *
 * @private
 */
YAHOO.widget.AutoComplete.prototype._clearList = function() {
    this._oContainer._oContent.scrollTop = 0;
    var aItems = this._aListItems;
    
    if(aItems && (aItems.length > 0)) {
        for(var i = aItems.length-1; i >= 0 ; i--) {
            aItems[i].style.display = "none";//DEBUG
        }
    }

    if (this._oCurItem) {
        this._toggleHighlight(this._oCurItem,'from');
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
    }
    if (!oSelf._bFocused || !aResults) {
        return;
    }
    
    var isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
    oSelf._oContainer._oContent.style.width = (!isOpera) ? null : "";
    oSelf._oContainer._oContent.style.height = (!isOpera) ? null : "";

    var sCurQuery = decodeURIComponent(sQuery);
    oSelf._sCurQuery = sCurQuery;
    oSelf._bItemSelected = false;
    
    if(oSelf._maxResultsDisplayed != oSelf.maxResultsDisplayed) {
        oSelf._initList();
    }
    
    var nItems = Math.min(aResults.length,oSelf.maxResultsDisplayed);
    oSelf._nDisplayedItems = nItems;
    if (nItems > 0) {
        //TODO: Figure out what I can do once, and what may need to be re-init'd
        //oSelf._initContainer();
        oSelf._initContainerHelpers();
        var aItems = oSelf._aListItems;
        
        // Fill items with data
        for(var i = nItems-1; i >= 0; i--) {
            var oItemi = aItems[i];
            var oResultItemi = aResults[i];
            oItemi.innerHTML = oSelf.formatResult(oResultItemi, sCurQuery);
            oItemi.style.display = "list-item";
            oItemi._sResultKey = oResultItemi[0];
            oItemi._oResultData = oResultItemi;
            
        }
        
        // Empty out remaining items if any
        for(var j = aItems.length-1; j >= nItems ; j--) {
            var oItemj = aItems[j];
            oItemj.innerHTML = null;
            oItemj.style.display = "none";//DEBUG
            oItemj._sResultKey = null;
            oItemj._oResultData = null;
        }
        
        if(oSelf.autoHighlight) {
            // Go to the first item
            var oFirstItem = aItems[0];
            oSelf._oCurItem = oFirstItem;
            oSelf._toggleHighlight(oFirstItem,'to');
            oSelf.itemArrowToEvent.fire(oSelf, oFirstItem);
            oSelf._typeAhead(oFirstItem,sQuery);
        }
        else {
            oSelf._oCurItem = null;
        }

        // Expand the container
        oSelf._toggleContainer(true);
    }
    else {
        oSelf._clearList();
    }
    oSelf.dataReturnEvent.fire(oSelf, sQuery, aResults);
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
        var oItem = this._aListItems[i];
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
 * Syncs auto complete container with its helpers: iFrame shim and shadow.
 *
 * @param {boolean} bShow True if container is expanded, false if collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers = function(bShow) {
//TODO: is width necessary?
    var width = this._oContainer._oContent.offsetWidth + "px";
    var height = this._oContainer._oContent.offsetHeight + "px";

    if(this.useIFrame && this._oContainer._oIFrame) {
        if(this.alwaysShowContainer || bShow) {
            this._oContainer._oIFrame.style.width = width;
            this._oContainer._oIFrame.style.height = height;

        }
        else {
            this._oContainer._oIFrame.style.width = 0;
            this._oContainer._oIFrame.style.height = 0;
        }
    }
    if(this.useShadow && this._oContainer._oShadow) {
        if(this.alwaysShowContainer || bShow) {
            this._oContainer._oShadow.style.width = width;
            this._oContainer._oShadow.style.height = height;
        }
        else {
           this._oContainer._oShadow.style.width = 0;
            this._oContainer._oShadow.style.height = 0;
        }
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
    if(this.alwaysShowContainer) {
        this._bContainerOpen = bShow;
        
        // Fire these events to give implementers a hook into the container
        // being populated and being emptied
        if(bShow) {
            this.containerExpandEvent.fire(this);
        }
        else {
            this.containerCollapseEvent.fire(this);
        }
        return;
    }
    
    var oContainer = this._oContainer;
    // Don't animate if it's already closed && !bShow
    if (!bShow && !this._bContainerOpen) {
        oContainer._oContent.style.display = "none";//DEBUG
        return;
    }
    
    // If animation is enabled...
    var oAnim = this._oAnim;
    if (oAnim && oAnim.getEl() && (this.animHoriz || this.animVert)) {
    
        // If iFrame needs to be collapsed, do it right away...
        // but if iFrame needs to be expanded, wait until after the container expands
        if(!bShow) this._toggleContainerHelpers(bShow);
        
        if(oAnim.isAnimated()) {
            oAnim.stop();
        }
        
        // Clone container to grab current size offscreen
        var oClone = oContainer._oContent.cloneNode(true);
        oContainer.appendChild(oClone);
        oClone.style.top = "-9000px";
        oClone.style.display = "block";//DEBUG
        
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
            oContainer._oContent.style.width = wColl+"px";
            oContainer._oContent.style.height = hColl+"px";
        }
        // Else, set it to its last known size.
        else {
            oContainer._oContent.style.width = wExp+"px";
            oContainer._oContent.style.height = hExp+"px";
        }
        
        oContainer.removeChild(oClone);
        oClone = null;

    	var oSelf = this;
    	var onAnimComplete = function() {
            // Finish the collapse
    		oAnim.onComplete.unsubscribeAll();

            if(bShow) {
                // Expand the iFrame after container is done.
                oSelf._toggleContainerHelpers(bShow);
                oSelf.containerExpandEvent.fire(oSelf);
            }
            else {
                oContainer._oContent.style.display = "none";//DEBUG
                oSelf.containerCollapseEvent.fire(oSelf);
            }
     	};

        // Display container and animate it
        oContainer._oContent.style.display = "block";//DEBUG
        oAnim.onComplete.subscribe(onAnimComplete);
        oAnim.animate();
        this._bContainerOpen = bShow;
    }
    // Else don't animate, just show or hide
    else {
        this._bContainerOpen = bShow;
        oContainer._oContent.style.display = (bShow) ? "block" : "none";//DEBUG
        this._toggleContainerHelpers(bShow);
        if(bShow) {
            this.containerExpandEvent.fire(this);
        }
        else {
            this.containerCollapseEvent.fire(this);
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
    if(this._oCurItem) {
        // Remove highlight from old item
        YAHOO.util.Dom.removeClass(this._oCurItem, this.highlightClassName);
    }
    
    if(sType == 'to') {
        // Apply highlight to new item
        YAHOO.util.Dom.replaceClass(oNewItem, this.prehighlightClassName, this.highlightClassName)
        this._oCurItem = oNewItem;
    }
};

/**
 * Toggles the pre-highlight on or off for an item in the container.
 *
 * @param {object} oNewItem New The &lt;li&gt; element item to receive highlight
 *                              behavior
 * @param {string} sType "mouseover" will toggle highlight on, and "mouseout"
 *                       will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._togglePrehighlight = function(oNewItem, sType) {
    if(oNewItem == this._oCurItem) {
        return;
    }

    if(sType == 'mouseover') {
        // Apply prehighlight to new item
        YAHOO.util.Dom.addClass(oNewItem, this.prehighlightClassName);
    }
    else {
        // Remove prehighlight from old item
        YAHOO.util.Dom.removeClass(oNewItem, this.prehighlightClassName);
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
    this.itemSelectEvent.fire(this, oItem, oItem._oResultData);
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
            this._toggleHighlight(oCurItem, 'from');
            this.itemArrowFromEvent.fire(this, oCurItem);
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

        var oNewItem = this._aListItems[nNewItemIndex];

        // Scroll the container if necessary
        if((YAHOO.util.Dom.getStyle(this._oContainer._oContent,"overflow") == "auto") &&
        (nNewItemIndex > -1) && (nNewItemIndex < this._nDisplayedItems)) {
            // User is keying down
            if(nKeyCode == 40) {
                // Bottom of selected item is below scroll area...
                if((oNewItem.offsetTop+oNewItem.offsetHeight) > (this._oContainer._oContent.scrollTop + this._oContainer._oContent.offsetHeight)) {
                    // Set bottom of scroll area to bottom of selected item
                    this._oContainer._oContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - this._oContainer._oContent.offsetHeight;
                }
                // Bottom of selected item is above scroll area...
                else if((oNewItem.offsetTop+oNewItem.offsetHeight) < this._oContainer._oContent.scrollTop) {
                    // Set top of selected item to top of scroll area
                    this._oContainer._oContent.scrollTop = oNewItem.offsetTop;

                }
            }
            // User is keying up
            else {
                // Top of selected item is above scroll area
                if(oNewItem.offsetTop < this._oContainer._oContent.scrollTop) {
                    // Set top of scroll area to top of selected item
                    this._oContainer._oContent.scrollTop = oNewItem.offsetTop;
                }
                // Top of selected item is below scroll area
                else if(oNewItem.offsetTop > (this._oContainer._oContent.scrollTop + this._oContainer._oContent.offsetHeight)) {
                    // Set bottom of selected item to bottom of scroll area
                    this._oContainer._oContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - this._oContainer._oContent.offsetHeight;
                }
            }
        }

        this._toggleHighlight(oNewItem, 'to');
        this.itemArrowToEvent.fire(this, oNewItem);
        if(this.typeAhead) {
            this._updateValue(oNewItem);
        }
    }
};

