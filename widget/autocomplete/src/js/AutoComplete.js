 /**
 * The AutoComplete control provides the front-end logic for text-entry suggestion and
 * completion functionality.
 *
 * @module autocomplete
 * @requires yahoo, dom, event, datasource
 * @optional animation, json
 * @title AutoComplete Widget
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The AutoComplete class provides the customizable functionality of a plug-and-play DHTML
 * auto completion widget.  Some key features:
 * <ul>
 * <li>Navigate with up/down arrow keys and/or mouse to pick a selection</li>
 * <li>The drop down container can "roll down" or "fly out" via configurable
 * animation</li>
 * <li>UI look-and-feel customizable through CSS, including container
 * attributes, borders, position, fonts, etc</li>
 * </ul>
 *
 * @class AutoComplete
 * @constructor
 * @param elInput {HTMLElement} DOM element reference or string ID of an input field
 * @param elContainer {HTMLElement} DOM element reference or string ID of an existing DIV
 * @param oDataSource {Object} Instance of YAHOO.widget.DataSource for query/results
 * @param oConfigs {Object} Optional object literal of configuration params
 */
YAHOO.widget.AutoComplete = function(elInput,elContainer,oDataSource,oConfigs) {
    if(elInput && elContainer && oDataSource) {
        // Validate DataSource
        if (oDataSource && (oDataSource instanceof YAHOO.widget.DataSource)) {
            this.dataSource = oDataSource;
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid DataSource", "error", this.toString());
            return;
        }

        // Validate input element
        if(YAHOO.util.Dom.inDocument(elInput)) {
            if(typeof elInput == "string") {
                    this._sName = "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput;
                    this._oTextbox = document.getElementById(elInput);
            }
            else {
                this._sName = (elInput.id) ?
                    "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput.id:
                    "instance" + YAHOO.widget.AutoComplete._nIndex;
                this._oTextbox = elInput;
            }
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid input element", "error", this.toString());
            return;
        }

        // Validate container element
        if(YAHOO.util.Dom.inDocument(elContainer)) {
            if(typeof elContainer == "string") {
                    this._oContainer = document.getElementById(elContainer);
            }
            else {
                this._oContainer = elContainer;
            }
            if(this._oContainer.style.display == "none") {
                YAHOO.log("The container may not display properly if display is set to \"none\" in CSS", "warn", this.toString());
            }
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid container element", "error", this.toString());
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
        this._initContainer();
        this._initProps();
        this._initList();
        this._initContainerHelpers();

        // Set up events
        var oSelf = this;
        var oTextbox = this._oTextbox;
        // Events are actually for the content module within the container
        var oContent = this._oContainer._oContent;

        // Dom events
        YAHOO.util.Event.addListener(oTextbox,"keyup",oSelf._onTextboxKeyUp,oSelf);
        YAHOO.util.Event.addListener(oTextbox,"keydown",oSelf._onTextboxKeyDown,oSelf);
        YAHOO.util.Event.addListener(oTextbox,"focus",oSelf._onTextboxFocus,oSelf);
        YAHOO.util.Event.addListener(oTextbox,"blur",oSelf._onTextboxBlur,oSelf);
        YAHOO.util.Event.addListener(oContent,"mouseover",oSelf._onContainerMouseover,oSelf);
        YAHOO.util.Event.addListener(oContent,"mouseout",oSelf._onContainerMouseout,oSelf);
        YAHOO.util.Event.addListener(oContent,"scroll",oSelf._onContainerScroll,oSelf);
        YAHOO.util.Event.addListener(oContent,"resize",oSelf._onContainerResize,oSelf);
        if(oTextbox.form) {
            YAHOO.util.Event.addListener(oTextbox.form,"submit",oSelf._onFormSubmit,oSelf);
        }
        YAHOO.util.Event.addListener(oTextbox,"keypress",oSelf._onTextboxKeyPress,oSelf);

        // Custom events
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
        
        // Finish up
        oTextbox.setAttribute("autocomplete","off");
        YAHOO.widget.AutoComplete._nIndex++;
        YAHOO.log("AutoComplete initialized","info",this.toString());
    }
    // Required arguments were not found
    else {
        YAHOO.log("Could not instantiate AutoComplete due invalid arguments", "error", this.toString());
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * The DataSource object that encapsulates the data used for auto completion.
 * This object should be an inherited object from YAHOO.widget.DataSource.
 *
 * @property dataSource
 * @type Object
 */
YAHOO.widget.AutoComplete.prototype.dataSource = null;

/**
 * Number of characters that must be entered before querying for results.
 *
 * @property minQueryLength
 * @type Number
 * @default 1
 */
YAHOO.widget.AutoComplete.prototype.minQueryLength = 1;

/**
 * Maximum number of results to display in results container.
 *
 * @property maxResultsDisplayed
 * @type Number
 * @default 10
 */
YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed = 10;

/**
 * Number of seconds to delay before submitting a query request.  If a query
 * request is received before a previous one has completed its delay, the
 * previous request is cancelled and the new request is set to the delay.
 *
 * @property queryDelay
 * @type Number
 * @default 0.5
 */
YAHOO.widget.AutoComplete.prototype.queryDelay = 0.5;

/**
 * Class name of a highlighted item within results container.
 *
 * @property highlighClassName
 * @type String
 * @default "yui-ac-highlight"
 */
YAHOO.widget.AutoComplete.prototype.highlightClassName = "yui-ac-highlight";

/**
 * Class name of a pre-highlighted item within results container.
 *
 * @property prehighlightClassName
 * @type String
 */
YAHOO.widget.AutoComplete.prototype.prehighlightClassName = null;

/**
 * Query delimiter. A single character separator for multiple delimited
 * selections. Multiple delimiter characteres may be defined as an array of
 * strings. A null value or empty string indicates that query results cannot
 * be delimited. This feature is not recommended if you need forceSelection to
 * be true.
 *
 * @property delimChar
 * @type String | Array
 */
YAHOO.widget.AutoComplete.prototype.delimChar = null;

/**
 * Whether or not the first item in results container should be automatically highlighted
 * on expand.
 *
 * @property autoHighlight
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.autoHighlight = true;

/**
 * Whether or not the input field should be automatically updated
 * with the first query result as the user types, auto-selecting the substring
 * that the user has not typed.
 *
 * @property typeAhead
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.typeAhead = false;

/**
 * Whether or not to animate the expansion/collapse of the results container in the
 * horizontal direction.
 *
 * @property animHoriz
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.animHoriz = false;

/**
 * Whether or not to animate the expansion/collapse of the results container in the
 * vertical direction.
 *
 * @property animVert
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.animVert = true;

/**
 * Speed of container expand/collapse animation, in seconds..
 *
 * @property animSpeed
 * @type Number
 * @default 0.3
 */
YAHOO.widget.AutoComplete.prototype.animSpeed = 0.3;

/**
 * Whether or not to force the user's selection to match one of the query
 * results. Enabling this feature essentially transforms the input field into a
 * &lt;select&gt; field. This feature is not recommended with delimiter character(s)
 * defined.
 *
 * @property forceSelection
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.forceSelection = false;

/**
 * Whether or not to allow browsers to cache user-typed input in the input
 * field. Disabling this feature will prevent the widget from setting the
 * autocomplete="off" on the input field. When autocomplete="off"
 * and users click the back button after form submission, user-typed input can
 * be prefilled by the browser from its cache. This caching of user input may
 * not be desired for sensitive data, such as credit card numbers, in which
 * case, implementers should consider setting allowBrowserAutocomplete to false.
 *
 * @property allowBrowserAutocomplete
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete = true;

/**
 * Whether or not the results container should always be displayed.
 * Enabling this feature displays the container when the widget is instantiated
 * and prevents the toggling of the container to a collapsed state.
 *
 * @property alwaysShowContainer
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.alwaysShowContainer = false;

/**
 * Whether or not to use an iFrame to layer over Windows form elements in
 * IE. Set to true only when the results container will be on top of a
 * &lt;select&gt; field in IE and thus exposed to the IE z-index bug (i.e.,
 * 5.5 < IE < 7).
 *
 * @property useIFrame
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.useIFrame = false;

/**
 * Whether or not the results container should have a shadow.
 *
 * @property useShadow
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.useShadow = false;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the AutoComplete instance.
 *
 * @method toString
 * @return {String} Unique name of the AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.toString = function() {
    return "AutoComplete " + this._sName;
};

/**
 * Public accessor to the internal array of DOM &lt;li&gt; elements that
 * display query results within the results container.
 *
 * @method getListItems
 * @return {Array} Array of &lt;li&gt; elements within the results container.
 */
YAHOO.widget.AutoComplete.prototype.getListItems = function() {
    return this._aListItems;
};

/**
 * Public accessor to the data held in an &lt;li&gt; element of the
 * results container.
 *
 * @method getListItemData
 * @return {Object | Array} Object or array of result data or null
 */
YAHOO.widget.AutoComplete.prototype.getListItemData = function(oListItem) {
    if(oListItem._oResultData) {
        return oListItem._oResultData;
    }
    else {
        return false;
    }
};

/**
 * Sets HTML markup for the results container header. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_hd".
 *
 * @method setHeader
 * @param sHeader {String} HTML markup for results container header.
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
 * Sets HTML markup for the results container footer. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_ft".
 *
 * @method setFooter
 * @param sFooter {String} HTML markup for results container footer.
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
 * Sets HTML markup for the results container body. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "ac_bd".
 *
 * @method setBody
 * @param sHeader {String} HTML markup for results container body.
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
 * @method formatResult
 * @param oResultItem {Object} Result item representing one query result. Data is held in an array.
 * @param sQuery {String} The current query string.
 * @return {String} HTML markup of formatted result data.
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
 * Makes query request to the DataSource.
 *
 * @method sendQuery
 * @param sQuery {String} Query string.
 */
YAHOO.widget.AutoComplete.prototype.sendQuery = function(sQuery) {
    this._sendQuery(sQuery);
};

/////////////////////////////////////////////////////////////////////////////
//
// Public events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fired when the input field receives focus.
 *
 * @event textboxFocusEvent
 * @param oSelf {Object} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxFocusEvent = null;

/**
 * Fired when the input field receives key input.
 *
 * @event textboxKeyEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param nKeycode {Number} The keycode number.
 */
YAHOO.widget.AutoComplete.prototype.textboxKeyEvent = null;

/**
 * Fired when the AutoComplete instance makes a query to the DataSource.
 * 
 * @event dataRequestEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.AutoComplete.prototype.dataRequestEvent = null;

/**
 * Fired when the AutoComplete instance receives query results from the data
 * source.
 *
 * @event dataReturnEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param aResults {Array} Results array.
 */
YAHOO.widget.AutoComplete.prototype.dataReturnEvent = null;

/**
 * Fired when the AutoComplete instance does not receive query results from the
 * DataSource due to an error.
 *
 * @event dataErrorEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.AutoComplete.prototype.dataErrorEvent = null;

/**
 * Fired when the results container is expanded.
 *
 * @event containerExpandEvent
 * @param oSelf {Object} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerExpandEvent = null;

/**
 * Fired when the input field has been prefilled by the type-ahead
 * feature. 
 *
 * @event typeAheadEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param sPrefill {String} The prefill string.
 */
YAHOO.widget.AutoComplete.prototype.typeAheadEvent = null;

/**
 * Fired when result item has been moused over.
 *
 * @event itemMouseOverEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt element item moused to.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent = null;

/**
 * Fired when result item has been moused out.
 *
 * @event itemMouseOutEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item moused from.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent = null;

/**
 * Fired when result item has been arrowed to. 
 *
 * @event itemArrowToEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed to.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent = null;

/**
 * Fired when result item has been arrowed away from.
 *
 * @event itemArrowFromEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed from.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent = null;

/**
 * Fired when an item is selected via mouse click, ENTER key, or TAB key.
 *
 * @event itemSelectEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param elItem {HTMLElement} The selected &lt;li&gt; element item.
 * @param oData {Object} The data returned for the item, either as an object,
 * or mapped from the schema into an array.
 */
YAHOO.widget.AutoComplete.prototype.itemSelectEvent = null;

/**
 * Fired when a user selection does not match any of the displayed result items.
 * Note that this event may not behave as expected when delimiter characters
 * have been defined. 
 *
 * @event unmatchedItemSelectEvent
 * @param oSelf {Object} The AutoComplete instance.
 * @param sQuery {String} The user-typed query string.
 */
YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent = null;

/**
 * Fired if forceSelection is enabled and the user's input has been cleared
 * because it did not match one of the returned query results.
 *
 * @event selectionEnforceEvent
 * @param oSelf {Object} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent = null;

/**
 * Fired when the results container is collapsed.
 *
 * @event containerCollapseEvent
 * @param oSelf {Object} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerCollapseEvent = null;

/**
 * Fired when the input field loses focus.
 *
 * @event textboxBlurEvent
 * @param oSelf {Object} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxBlurEvent = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple AutoComplete instances.
 *
 * @property _nIndex
 * @type Number
 * @default 0
 * @private
 */
YAHOO.widget.AutoComplete._nIndex = 0;

/**
 * Name of AutoComplete instance.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sName = null;

/**
 * Text input field DOM element.
 *
 * @property _oTextbox
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oTextbox = null;

/**
 * Whether or not the input field is currently in focus. If query results come back
 * but the user has already moved on, do not proceed with auto complete behavior.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bFocused = true;

/**
 * Animation instance for container expand/collapse.
 *
 * @property _oAnim
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oAnim = null;

/**
 * Container DOM element.
 *
 * @property _oContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oContainer = null;

/**
 * Whether or not the results container is currently open.
 *
 * @property _bContainerOpen
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bContainerOpen = false;

/**
 * Whether or not the mouse is currently over the results
 * container. This is necessary in order to prevent clicks on container items
 * from being text input field blur events.
 *
 * @property _bOverContainer
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bOverContainer = false;

/**
 * Array of &lt;li&gt; elements references that contain query results within the
 * results container.
 *
 * @property _aListItems
 * @type Array
 * @private
 */
YAHOO.widget.AutoComplete.prototype._aListItems = null;

/**
 * Number of &lt;li&gt; elements currently displayed in results container.
 *
 * @property _nDisplayedItems
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDisplayedItems = 0;

/**
 * Internal count of &lt;li&gt; elements displayed and hidden in results container.
 *
 * @property _maxResultsDisplayed
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._maxResultsDisplayed = 0;

/**
 * Current query string
 *
 * @property _sCurQuery
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sCurQuery = null;

/**
 * Past queries this session (for saving delimited queries).
 *
 * @property _sSavedQuery
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sSavedQuery = null;

/**
 * Pointer to the currently highlighted &lt;li&gt; element in the container.
 *
 * @property _oCurItem
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oCurItem = null;

/**
 * Whether or not an item has been selected since the container was populated
 * with results. Reset to false by _populateList, and set to true when item is
 * selected.
 *
 * @property _bItemSelected
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bItemSelected = false;

/**
 * Key code of the last key pressed in textbox.
 *
 * @property _nKeyCode
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nKeyCode = null;

/**
 * Delay timeout ID.
 *
 * @property _nDelayID
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDelayID = -1;

/**
 * Src to iFrame used when useIFrame = true. Supports implementations over SSL
 * as well.
 *
 * @property _iFrameSrc
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._iFrameSrc = "javascript:false;";

/**
 * For users typing via certain IMEs, queries must be triggered by intervals,
 * since key events yet supported across all browsers for all IMEs.
 *
 * @property _queryInterval
 * @type Object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._queryInterval = null;

/**
 * Internal tracker to last known textbox value, used to determine whether or not
 * to trigger a query via interval for certain IME users.
 *
 * @event _sLastTextboxValue
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sLastTextboxValue = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Updates and validates latest public config properties.
 *
 * @method __initProps
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
        YAHOO.log("The forceSelection feature has been enabled with delimChar defined.","warn", this.toString());
    }
};

/**
 * Initializes the results container helpers if they are enabled and do
 * not exist
 *
 * @method _initContainerHelpers
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainerHelpers = function() {
    if(this.useShadow && !this._oContainer._oShadow) {
        var oShadow = document.createElement("div");
        oShadow.className = "yui-ac-shadow";
        this._oContainer._oShadow = this._oContainer.appendChild(oShadow);
    }
    if(this.useIFrame && !this._oContainer._oIFrame) {
        var oIFrame = document.createElement("iframe");
        oIFrame.src = this._iFrameSrc;
        oIFrame.frameBorder = 0;
        oIFrame.scrolling = "no";
        oIFrame.style.position = "absolute";
        oIFrame.style.width = "100%";
        oIFrame.style.height = "100%";
        oIFrame.tabIndex = -1;
        this._oContainer._oIFrame = this._oContainer.appendChild(oIFrame);
    }
};

/**
 * Initializes the results container once at object creation
 *
 * @method _initContainer
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainer = function() {
    if(!this._oContainer._oContent) {
        // The oContent div helps size the iframe and shadow properly
        var oContent = document.createElement("div");
        oContent.className = "yui-ac-content";
        oContent.style.display = "none";
        this._oContainer._oContent = this._oContainer.appendChild(oContent);

        var oHeader = document.createElement("div");
        oHeader.className = "yui-ac-hd";
        oHeader.style.display = "none";
        this._oContainer._oContent._oHeader = this._oContainer._oContent.appendChild(oHeader);

        var oBody = document.createElement("div");
        oBody.className = "yui-ac-bd";
        this._oContainer._oContent._oBody = this._oContainer._oContent.appendChild(oBody);

        var oFooter = document.createElement("div");
        oFooter.className = "yui-ac-ft";
        oFooter.style.display = "none";
        this._oContainer._oContent._oFooter = this._oContainer._oContent.appendChild(oFooter);
    }
    else {
        YAHOO.log("Could not initialize the container","warn",this.toString());
    }
};

/**
 * Clears out contents of container body and creates up to
 * YAHOO.widget.AutoComplete#maxResultsDisplayed &lt;li&gt; elements in an
 * &lt;ul&gt; element.
 *
 * @method _initList
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initList = function() {
    this._aListItems = [];
    while(this._oContainer._oContent._oBody.hasChildNodes()) {
        var oldListItems = this.getListItems();
        if(oldListItems) {
            for(var oldi = oldListItems.length-1; oldi >= 0; i--) {
                oldListItems[oldi] = null;
            }
        }
        this._oContainer._oContent._oBody.innerHTML = "";
    }

    var oList = document.createElement("ul");
    oList = this._oContainer._oContent._oBody.appendChild(oList);
    for(var i=0; i<this.maxResultsDisplayed; i++) {
        var oItem = document.createElement("li");
        oItem = oList.appendChild(oItem);
        this._aListItems[i] = oItem;
        this._initListItem(oItem, i);
    }
    this._maxResultsDisplayed = this.maxResultsDisplayed;
};

/**
 * Initializes each &lt;li&gt; element in the container list.
 *
 * @method _initListItem
 * @param oItem {HTMLElement} The &lt;li&gt; DOM element.
 * @param nItemIndex {Number} The index of the element.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initListItem = function(oItem, nItemIndex) {
    var oSelf = this;
    oItem.style.display = "none";
    oItem._nItemIndex = nItemIndex;

    oItem.mouseover = oItem.mouseout = oItem.onclick = null;
    YAHOO.util.Event.addListener(oItem,"mouseover",oSelf._onItemMouseover,oSelf);
    YAHOO.util.Event.addListener(oItem,"mouseout",oSelf._onItemMouseout,oSelf);
    YAHOO.util.Event.addListener(oItem,"click",oSelf._onItemMouseclick,oSelf);
};

/**
 * Enables interval detection for  Korean IME support.
 *
 * @method _onIMEDetected
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onIMEDetected = function(oSelf) {
    oSelf._enableIntervalDetection();
};

/**
 * Enables query triggers based on text input detection by intervals (rather
 * than by key events).
 *
 * @method _enableIntervalDetection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._enableIntervalDetection = function() {
    var currValue = this._oTextbox.value;
    var lastValue = this._sLastTextboxValue;
    if(currValue != lastValue) {
        this._sLastTextboxValue = currValue;
        this._sendQuery(currValue);
    }
};


/**
 * Cancels text input detection by intervals.
 *
 * @method _cancelIntervalDetection
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._cancelIntervalDetection = function(oSelf) {
    if(oSelf._queryInterval) {
        clearInterval(oSelf._queryInterval);
    }
};


/**
 * Whether or not key is functional or should be ignored. Note that the right
 * arrow key is NOT an ignored key since it triggers queries for certain intl
 * charsets.
 *
 * @method _isIgnoreKey
 * @param nKeycode {Number} Code of key pressed.
 * @return {Boolean} True if key should be ignored, false otherwise.
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
 * Makes query request to the DataSource.
 *
 * @method _sendQuery
 * @param sQuery {String} Query string.
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
    if (sQuery && (sQuery.length < this.minQueryLength)) {
        if (this._nDelayID != -1) {
            clearTimeout(this._nDelayID);
        }
        this._toggleContainer(false);
        return;
    }

    sQuery = encodeURIComponent(sQuery);
    this._nDelayID = -1;    // Reset timeout ID because request has been made
    this.dataRequestEvent.fire(this, sQuery);
    this.dataSource.getResults(this._populateList, sQuery, this);
};

/**
 * Populates the array of &lt;li&gt; elements in the container with query
 * results. This method is passed to YAHOO.widget.DataSource#getResults as a
 * callback function so results from the DataSource instance are returned to the
 * AutoComplete instance.
 *
 * @method _populateList
 * @param sQuery {String} The query string.
 * @param aResults {Array} An array of query result objects from the DataSource.
 * @param oSelf {Object} The AutoComplete instance.
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
    var contentStyle = oSelf._oContainer._oContent.style;
    contentStyle.width = (!isOpera) ? null : "";
    contentStyle.height = (!isOpera) ? null : "";

    var sCurQuery = decodeURIComponent(sQuery);
    oSelf._sCurQuery = sCurQuery;
    oSelf._bItemSelected = false;

    if(oSelf._maxResultsDisplayed != oSelf.maxResultsDisplayed) {
        oSelf._initList();
    }

    var nItems = Math.min(aResults.length,oSelf.maxResultsDisplayed);
    oSelf._nDisplayedItems = nItems;
    if (nItems > 0) {
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
            oItemj.style.display = "none";
            oItemj._sResultKey = null;
            oItemj._oResultData = null;
        }

        if(oSelf.autoHighlight) {
            // Go to the first item
            var oFirstItem = aItems[0];
            oSelf._toggleHighlight(oFirstItem,"to");
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
        oSelf._toggleContainer(false);
    }
    oSelf.dataReturnEvent.fire(oSelf, sQuery, aResults);
};

/**
 * When forceSelection is true and the user attempts
 * leave the text input box without selecting an item from the query results,
 * the user selection is cleared.
 *
 * @method _clearSelection
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
 * @method _textMatchesOption
 * @return {Boolean} True if user-input text matches a result, false otherwise.
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
 * @method _typeAhead
 * @param oItem {HTMLElement} The &lt;li&gt; element item whose data populates the input field.
 * @param sQuery {String} Query string.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._typeAhead = function(oItem, sQuery) {
    // Don't update if turned off
    if (!this.typeAhead) {
        return;
    }

    var oTextbox = this._oTextbox;
    var sValue = this._oTextbox.value; // any saved queries plus what user has typed

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
 * Selects text in the input field.
 *
 * @method _selectText
 * @param oTextbox {HTMLElement} Text input box element in which to select text.
 * @param nStart {Number} Starting index of text string to select.
 * @param nEnd {Number} Ending index of text selection.
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
 * Syncs results container with its helpers.
 *
 * @method _toggleContainerHelpers
 * @param bShow {Boolean} True if container is expanded, false if collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers = function(bShow) {
    var bFireEvent = false;
    var width = this._oContainer._oContent.offsetWidth + "px";
    var height = this._oContainer._oContent.offsetHeight + "px";

    if(this.useIFrame && this._oContainer._oIFrame) {
        bFireEvent = true;
        if(bShow) {
            this._oContainer._oIFrame.style.width = width;
            this._oContainer._oIFrame.style.height = height;
        }
        else {
            this._oContainer._oIFrame.style.width = 0;
            this._oContainer._oIFrame.style.height = 0;
        }
    }
    if(this.useShadow && this._oContainer._oShadow) {
        bFireEvent = true;
        if(bShow) {
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
 * @method _toggleContainer
 * @param bShow {Boolean} True if container should be expanded, false if container should be collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainer = function(bShow) {
    var oContainer = this._oContainer

    // Implementer has container always open so don't mess with it
    if(this.alwaysShowContainer && this._bContainerOpen) {
        return;
    }
    
    // Clear contents of container
    if(!bShow) {
        this._oContainer._oContent.scrollTop = 0;
        var aItems = this._aListItems;

        if(aItems && (aItems.length > 0)) {
            for(var i = aItems.length-1; i >= 0 ; i--) {
                aItems[i].style.display = "none";
            }
        }

        if (this._oCurItem) {
            this._toggleHighlight(this._oCurItem,"from");
        }

        this._oCurItem = null;
        this._nDisplayedItems = 0;
        this._sCurQuery = null;
    }

    // Container is already closed
    if (!bShow && !this._bContainerOpen) {
        oContainer._oContent.style.display = "none";
        return;
    }

    // If animation is enabled...
    var oAnim = this._oAnim;
    if (oAnim && oAnim.getEl() && (this.animHoriz || this.animVert)) {
        // If helpers need to be collapsed, do it right away...
        // but if helpers need to be expanded, wait until after the container expands
        if(!bShow) {
            this._toggleContainerHelpers(bShow);
        }

        if(oAnim.isAnimated()) {
            oAnim.stop();
        }

        // Clone container to grab current size offscreen
        var oClone = oContainer._oContent.cloneNode(true);
        oContainer.appendChild(oClone);
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
                oSelf.containerExpandEvent.fire(oSelf);
            }
            else {
                oContainer._oContent.style.display = "none";
                oSelf.containerCollapseEvent.fire(oSelf);
            }
            oSelf._toggleContainerHelpers(bShow);
     	};

        // Display container and animate it
        oContainer._oContent.style.display = "block";
        oAnim.onComplete.subscribe(onAnimComplete);
        oAnim.animate();
        this._bContainerOpen = bShow;
    }
    // Else don't animate, just show or hide
    else {
        if(bShow) {
            oContainer._oContent.style.display = "block";
            this.containerExpandEvent.fire(this);
        }
        else {
            oContainer._oContent.style.display = "none";
            this.containerCollapseEvent.fire(this);
        }
        this._toggleContainerHelpers(bShow);
        this._bContainerOpen = bShow;
   }

};

/**
 * Toggles the highlight on or off for an item in the container, and also cleans
 * up highlighting of any previous item.
 *
 * @method _toggleHighlight
 * @param oNewItem {HTMLElement} The &lt;li&gt; element item to receive highlight behavior.
 * @param sType {String} Type "mouseover" will toggle highlight on, and "mouseout" will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleHighlight = function(oNewItem, sType) {
    var sHighlight = this.highlightClassName;
    if(this._oCurItem) {
        // Remove highlight from old item
        YAHOO.util.Dom.removeClass(this._oCurItem, sHighlight);
    }

    if((sType == "to") && sHighlight) {
        // Apply highlight to new item
        YAHOO.util.Dom.addClass(oNewItem, sHighlight);
        this._oCurItem = oNewItem;
    }
};

/**
 * Toggles the pre-highlight on or off for an item in the container.
 *
 * @method _togglePrehighlight
 * @param oNewItem {HTMLElement} The &lt;li&gt; element item to receive highlight behavior.
 * @param sType {String} Type "mouseover" will toggle highlight on, and "mouseout" will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._togglePrehighlight = function(oNewItem, sType) {
    if(oNewItem == this._oCurItem) {
        return;
    }

    var sPrehighlight = this.prehighlightClassName;
    if((sType == "mouseover") && sPrehighlight) {
        // Apply prehighlight to new item
        YAHOO.util.Dom.addClass(oNewItem, sPrehighlight);
    }
    else {
        // Remove prehighlight from old item
        YAHOO.util.Dom.removeClass(oNewItem, sPrehighlight);
    }
};

/**
 * Updates the text input box value with selected query result. If a delimiter
 * has been defined, then the value gets appended with the delimiter.
 *
 * @method _updateValue
 * @param oItem {HTMLElement} The &lt;li&gt; element item with which to update the value.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._updateValue = function(oItem) {
    var oTextbox = this._oTextbox;
    var sDelimChar = (this.delimChar) ? (this.delimChar[0] || this.delimChar) : null;
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
 * @method _selectItem
 * @param oItem {HTMLElement} The selected &lt;li&gt; element item.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectItem = function(oItem) {
    this._bItemSelected = true;
    this._updateValue(oItem);
    this._cancelIntervalDetection(this);
    this.itemSelectEvent.fire(this, oItem, oItem._oResultData);
    this._toggleContainer(false);
};

/**
 * For values updated by type-ahead, the right arrow key jumps to the end
 * of the textbox, otherwise the container is closed.
 *
 * @method _jumpSelection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._jumpSelection = function() {
    if(!this.typeAhead) {
        return;
    }
    else {
        this._toggleContainer(false);
    }
};

/**
 * Triggered by up and down arrow keys, changes the current highlighted
 * &lt;li&gt; element item. Scrolls container if necessary.
 *
 * @method _moveSelection
 * @param nKeyCode {Number} Code of key pressed.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._moveSelection = function(nKeyCode) {
    if(this._bContainerOpen) {
        // Determine current item's id number
        var oCurItem = this._oCurItem;
        var nCurItemIndex = -1;

        if (oCurItem) {
            nCurItemIndex = oCurItem._nItemIndex;
        }

        var nNewItemIndex = (nKeyCode == 40) ?
                (nCurItemIndex + 1) : (nCurItemIndex - 1);

        // Out of bounds
        if (nNewItemIndex < -2 || nNewItemIndex >= this._nDisplayedItems) {
            return;
        }

        if (oCurItem) {
            // Unhighlight current item
            this._toggleHighlight(oCurItem, "from");
            this.itemArrowFromEvent.fire(this, oCurItem);
        }
        if (nNewItemIndex == -1) {
           // Go back to query (remove type-ahead string)
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
            // Close container
            this._toggleContainer(false);
            return;
        }

        var oNewItem = this._aListItems[nNewItemIndex];

        // Scroll the container if necessary
        var oContent = this._oContainer._oContent;
        var scrollOn = ((YAHOO.util.Dom.getStyle(oContent,"overflow") == "auto") ||
            (YAHOO.util.Dom.getStyle(oContent,"overflowY") == "auto"));
        if(scrollOn && (nNewItemIndex > -1) &&
        (nNewItemIndex < this._nDisplayedItems)) {
            // User is keying down
            if(nKeyCode == 40) {
                // Bottom of selected item is below scroll area...
                if((oNewItem.offsetTop+oNewItem.offsetHeight) > (oContent.scrollTop + oContent.offsetHeight)) {
                    // Set bottom of scroll area to bottom of selected item
                    oContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - oContent.offsetHeight;
                }
                // Bottom of selected item is above scroll area...
                else if((oNewItem.offsetTop+oNewItem.offsetHeight) < oContent.scrollTop) {
                    // Set top of selected item to top of scroll area
                    oContent.scrollTop = oNewItem.offsetTop;

                }
            }
            // User is keying up
            else {
                // Top of selected item is above scroll area
                if(oNewItem.offsetTop < oContent.scrollTop) {
                    // Set top of scroll area to top of selected item
                    this._oContainer._oContent.scrollTop = oNewItem.offsetTop;
                }
                // Top of selected item is below scroll area
                else if(oNewItem.offsetTop > (oContent.scrollTop + oContent.offsetHeight)) {
                    // Set bottom of selected item to bottom of scroll area
                    this._oContainer._oContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - oContent.offsetHeight;
                }
            }
        }

        this._toggleHighlight(oNewItem, "to");
        this.itemArrowToEvent.fire(this, oNewItem);
        if(this.typeAhead) {
            this._updateValue(oNewItem);
        }
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private event handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles &lt;li&gt; element mouseover events in the container.
 *
 * @method _onItemMouseover
 * @param v {HTMLEvent} The mouseover event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseover = function(v,oSelf) {
    if(oSelf.prehighlightClassName) {
        oSelf._togglePrehighlight(this,"mouseover");
    }
    else {
        oSelf._toggleHighlight(this,"to");
    }

    oSelf.itemMouseOverEvent.fire(oSelf, this);
};

/**
 * Handles &lt;li&gt; element mouseout events in the container.
 *
 * @method _onItemMouseout
 * @param v {HTMLEvent} The mouseout event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseout = function(v,oSelf) {
    if(oSelf.prehighlightClassName) {
        oSelf._togglePrehighlight(this,"mouseout");
    }
    else {
        oSelf._toggleHighlight(this,"from");
    }

    oSelf.itemMouseOutEvent.fire(oSelf, this);
};

/**
 * Handles &lt;li&gt; element click events in the container.
 *
 * @method _onItemMouseclick
 * @param v {HTMLEvent} The click event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onItemMouseclick = function(v,oSelf) {
    // In case item has not been moused over
    oSelf._toggleHighlight(this,"to");
    oSelf._selectItem(this);
};

/**
 * Handles container mouseover events.
 *
 * @method _onContainerMouseover
 * @param v {HTMLEvent} The mouseover event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseover = function(v,oSelf) {
    oSelf._bOverContainer = true;
};

/**
 * Handles container mouseout events.
 *
 * @method _onContainerMouseout
 * @param v {HTMLEvent} The mouseout event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseout = function(v,oSelf) {
    oSelf._bOverContainer = false;
    // If container is still active
    if(oSelf._oCurItem) {
        oSelf._toggleHighlight(oSelf._oCurItem,"to");
    }
};

/**
 * Handles container scroll events.
 *
 * @method _onContainerScroll
 * @param v {HTMLEvent} The scroll event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerScroll = function(v,oSelf) {
    oSelf._oTextbox.focus();
};

/**
 * Handles container resize events.
 *
 * @method _onContainerResize
 * @param v {HTMLEvent} The resize event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerResize = function(v,oSelf) {
    oSelf._toggleContainerHelpers(oSelf._bContainerOpen);
};


/**
 * Handles textbox keydown events of functional keys, mainly for UI behavior.
 *
 * @method _onTextboxKeyDown
 * @param v {HTMLEvent} The keydown event.
 * @param oSelf {object} The AutoComplete instance.
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
                oSelf._toggleContainer(false);
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
                oSelf._toggleContainer(false);
            }
            break;
        case 27: // esc
            oSelf._toggleContainer(false);
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
 * Handles textbox keypress events.
 * @method _onTextboxKeyPress
 * @param v {HTMLEvent} The keypress event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress = function(v,oSelf) {
    var nKeyCode = v.keyCode;

        //Expose only to Mac browsers, where stopEvent is ineffective on keydown events (bug 790337)
        var isMac = (navigator.userAgent.toLowerCase().indexOf("mac") != -1);
        if(isMac) {
            switch (nKeyCode) {
            case 9: // tab
                if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                    if(oSelf._bContainerOpen) {
                        YAHOO.util.Event.stopEvent(v);
                    }
                }
                break;
            case 13: // enter
                    if(oSelf._nKeyCode != nKeyCode) {
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
        }

        //TODO: (?) limit only to non-IE, non-Mac-FF for Korean IME support (bug 811948)
        switch (nKeyCode) {
            case 229: // Korean IME detected
                oSelf._queryInterval = setInterval(function() { oSelf._onIMEDetected(oSelf) },500);
                break;
        }
};

/**
 * Handles textbox keyup events that trigger queries.
 *
 * @method _onTextboxKeyUp
 * @param v {HTMLEvent} The keyup event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp = function(v,oSelf) {
    // Check to see if any of the public properties have been updated
    oSelf._initProps();

    var nKeyCode = v.keyCode;
    oSelf._nKeyCode = nKeyCode;
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
 * Handles text input box receiving focus.
 *
 * @method _onTextboxFocus
 * @param v {HTMLEvent} The focus event.
 * @param oSelf {Object} The AutoComplete instance.
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
 * @method _onTextboxBlur
 * @param v {HTMLEvent} The focus event.
 * @param oSelf {Object} The AutoComplete instance.
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
            oSelf._toggleContainer(false);
        }
        oSelf._cancelIntervalDetection(oSelf);
        oSelf._bFocused = false;
        oSelf.textboxBlurEvent.fire(oSelf);
    }
};

/**
 * Handles form submission event.
 *
 * @method _onFormSubmit
 * @param v {HTMLEvent} The submit event.
 * @param oSelf {Object} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onFormSubmit = function(v,oSelf) {
    if(oSelf.allowBrowserAutocomplete) {
        oSelf._oTextbox.setAttribute("autocomplete","on");
    }
    else {
        oSelf._oTextbox.setAttribute("autocomplete","off");
    }
};
