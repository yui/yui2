 /**
 * The AutoComplete control provides the front-end logic for text-entry suggestion and
 * completion functionality.
 *
 * @module autocomplete
 * @requires yahoo, dom, event, datasource
 * @optional animation
 * @namespace YAHOO.widget
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
 * @param elInput {HTMLElement} DOM element reference of an input field.
 * @param elInput {String} String ID of an input field.
 * @param elContainer {HTMLElement} DOM element reference of an existing DIV.
 * @param elContainer {String} String ID of an existing DIV.
 * @param oDataSource {YAHOO.widget.DataSource} DataSource instance.
 * @param oConfigs {Object} (optional) Object literal of configuration params.
 */
YAHOO.widget.AutoComplete = function(elInput,elContainer,oDataSource,oConfigs) {
    if(elInput && elContainer && oDataSource) {
        // Validate DataSource
        if(oDataSource instanceof YAHOO.util.DataSourceBase) {
            this.dataSource = oDataSource;
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid DataSource", "error", this.toString());
            return;
        }

        // Schema backwards compatibility
        // First assume key data is held in position 0 of results array
        this.key = 0;
        var schema = oDataSource.responseSchema;
        // An old school schema has been defined in the deprecated DataSource constructor
        if(oDataSource._aSchema) {
            var aDeprecatedSchema = oDataSource._aSchema;
            if(YAHOO.lang.isArray(aDeprecatedSchema)) {
                if(oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_JSON) {
                    schema.resultsList = aDeprecatedSchema[0];
                    schema.fields = (aDeprecatedSchema.length < 3) ? null : aDeprecatedSchema.slice(1);
                    this.key = aDeprecatedSchema[1];
                }
                else if(oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_XML) {
                    schema.resultNode = aDeprecatedSchema[0];
                    schema.fields = aDeprecatedSchema.slice(1);
                    this.key = aDeprecatedSchema[1];
                }                
                else if(oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_TEXT) {
                    schema.recordDelim = aDeprecatedSchema[0];
                    schema.fieldDelim = aDeprecatedSchema[1];
                }                
                oDataSource.responseSchema = schema;
            }
        }

        // Validate input element
        if(YAHOO.util.Dom.inDocument(elInput)) {
            if(YAHOO.lang.isString(elInput)) {
                    this._sName = "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput;
                    this._elTextbox = document.getElementById(elInput);
            }
            else {
                this._sName = (elInput.id) ?
                    "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput.id:
                    "instance" + YAHOO.widget.AutoComplete._nIndex;
                this._elTextbox = elInput;
            }
            YAHOO.util.Dom.addClass(this._elTextbox, "yui-ac-input");
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid input element", "error", this.toString());
            return;
        }

        // Validate container element
        if(YAHOO.util.Dom.inDocument(elContainer)) {
            if(YAHOO.lang.isString(elContainer)) {
                    this._elContainer = document.getElementById(elContainer);
            }
            else {
                this._elContainer = elContainer;
            }
            if(this._elContainer.style.display == "none") {
                YAHOO.log("The container may not display properly if display is set to \"none\" in CSS", "warn", this.toString());
            }
            
            // For skinning
            var elParent = this._elContainer.parentNode;
            var elTag = elParent.tagName.toLowerCase();
            if(elTag == "div") {
                YAHOO.util.Dom.addClass(elParent, "yui-ac");
            }
            else {
                YAHOO.log("Could not find the wrapper element for skinning", "warn", this.toString());
            }
        }
        else {
            YAHOO.log("Could not instantiate AutoComplete due to an invalid container element", "error", this.toString());
            return;
        }

        // Set any config params passed in to override defaults
        if(oConfigs && (oConfigs.constructor == Object)) {
            for(var sConfig in oConfigs) {
                if(sConfig) {
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
        var elTextbox = this._elTextbox;
        // Events are actually for the content module within the container
        var elContent = this._elContent;

        // Dom events
        YAHOO.util.Event.addListener(elTextbox,"keyup",oSelf._onTextboxKeyUp,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"keydown",oSelf._onTextboxKeyDown,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"focus",oSelf._onTextboxFocus,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"blur",oSelf._onTextboxBlur,oSelf);
        YAHOO.util.Event.addListener(elContent,"mouseover",oSelf._onContainerMouseover,oSelf);
        YAHOO.util.Event.addListener(elContent,"mouseout",oSelf._onContainerMouseout,oSelf);
        YAHOO.util.Event.addListener(elContent,"scroll",oSelf._onContainerScroll,oSelf);
        YAHOO.util.Event.addListener(elContent,"resize",oSelf._onContainerResize,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"keypress",oSelf._onTextboxKeyPress,oSelf);
        YAHOO.util.Event.addListener(window,"unload",oSelf._onWindowUnload,oSelf);

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
        elTextbox.setAttribute("autocomplete","off");
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
 * @type YAHOO.widget.DataSource
 */
YAHOO.widget.AutoComplete.prototype.dataSource = null;

/**
 * Number of characters that must be entered before querying for results. A negative value
 * effectively turns off the widget. A value of 0 allows queries of null or empty string
 * values.
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
 * @default 0.2
 */
YAHOO.widget.AutoComplete.prototype.queryDelay = 0.2;

/**
 * Class name of a highlighted item within results container.
 *
 * @property highlightClassName
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
 * @type String | String[]
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
 * Returns true if widget instance is currently focused.
 *
 * @method isFocused
 * @return {Boolean} Returns true if widget instance is currently focused.
 */
YAHOO.widget.AutoComplete.prototype.isFocused = function() {
    return this._bFocused;
};

 /**
 * Returns true if container is in an expanded state, false otherwise.
 *
 * @method isContainerOpen
 * @return {Boolean} Returns true if container is in an expanded state, false otherwise.
 */
YAHOO.widget.AutoComplete.prototype.isContainerOpen = function() {
    return this._bContainerOpen;
};

/**
 * Public accessor to the internal array of DOM &lt;li&gt; elements that
 * display query results within the results container.
 *
 * @method getListItems
 * @return {HTMLElement[]} Array of &lt;li&gt; elements within the results container.
 */
YAHOO.widget.AutoComplete.prototype.getListItems = function() {
    return this._aListItems;
};

/**
 * Public accessor to the data held in an &lt;li&gt; element of the
 * results container.
 *
 * @method getListItemData
 * @return {Object | Object[]} Object or array of result data or null
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
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-hd".
 *
 * @method setHeader
 * @param sHeader {String} HTML markup for results container header.
 */
YAHOO.widget.AutoComplete.prototype.setHeader = function(sHeader) {
    if(this._elHeader) {
        var elHeader = this._elHeader;
        if(sHeader) {
            elHeader.innerHTML = sHeader;
            elHeader.style.display = "block";
        }
        else {
            elHeader.innerHTML = "";
            elHeader.style.display = "none";
        }
    }
};

/**
 * Sets HTML markup for the results container footer. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-ft".
 *
 * @method setFooter
 * @param sFooter {String} HTML markup for results container footer.
 */
YAHOO.widget.AutoComplete.prototype.setFooter = function(sFooter) {
    if(this._elFooter) {
        var elFooter = this._elFooter;
        if(sFooter) {
                elFooter.innerHTML = sFooter;
                elFooter.style.display = "block";
        }
        else {
            elFooter.innerHTML = "";
            elFooter.style.display = "none";
        }
    }
};

/**
 * Sets HTML markup for the results container body. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-bd".
 *
 * @method setBody
 * @param sBody {String} HTML markup for results container body.
 */
YAHOO.widget.AutoComplete.prototype.setBody = function(sBody) {
    if(this._elBody) {
        var elBody = this._elBody;
        if(sBody) {
                elBody.innerHTML = sBody;
                elBody.style.display = "block";
                elBody.style.display = "block";
        }
        else {
            elBody.innerHTML = "";
            elBody.style.display = "none";
        }
        this._maxResultsDisplayed = 0;
    }
};

/**
 * Overridable method that converts a result item object into HTML markup
 * for display. Return data values are accessible via the oResultItem object,
 * and the key return value will always be oResultItem[0]. Markup will be
 * displayed within &lt;li&gt; element tags in the container.
 *
 * @method formatResult
 * @param aResultItem {Array} Result item representing one query result. Data is held in an array.
 * @param sQuery {String} The current query string.
 * @return {String} HTML markup of formatted result data.
 * @deprecated 
 */
/*YAHOO.widget.AutoComplete.prototype.formatResult = function(aResultItem, sQuery) {
    var sResult = aResultItem[0];
    if(sResult) {
        return sResult;
    }
    else {
        return "";
    }
};*/

/**
 * Overridable method that converts a result item object into HTML markup
 * for display. Return data values are accessible via the oResultItem object,
 * and the key value will by default be determined by the first value defined 
 * in the DataSource's responseSchema fields array. Markup will be
 * displayed within &lt;li&gt; element tags in the container.
 *
 * @method formatResultNEW
 * @param oResultItem {Object} Result item representing one query result. Data is held in an object.
 * @param sQuery {String} The current query string.
 * @return {String} HTML markup of formatted result data.
 */
YAHOO.widget.AutoComplete.prototype.formatResultNEW = function(oResultItem, sQuery) {
    //TODO: RENAME
    var sResult = "";
    // Backward compatibility - result is an array
    if(YAHOO.lang.isArray(oResultItem)) {
        sResult = oResultItem[0];
        if(sResult) {
            return sResult;
        }
    } // result is an object
    else if(this.dataSource.responseSchema.fields) {
        sResult = oResultItem[this.dataSource.responseSchema.fields[0]];
        if(sResult) {
            return sResult;
        }
    }
    
    return sResult;
};

/**
 * Overridable method called before container is loaded with result data.
 *
 * @method doBeforeLoadData
 * @param sQuery {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 * @return {Boolean} Return true to continue loading data, false to cancel.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeLoadData = function(sQuery, oResponse, oPayload) {
    return true;
};

/**
 * Overridable method called before container expands allows implementers to access data
 * and DOM elements.
 *
 * @method doBeforeExpandContainer
 * @param elTextbox {HTMLElement} The text input box.
 * @param elContainer {HTMLElement} The container element.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]}  An array of query results.
 * @return {Boolean} Return true to continue expanding container, false to cancel the expand.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeExpandContainer = function(elTextbox, elContainer, sQuery, aResults) {
    return true;
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

/**
 * Overridable method gives implementers access to the query before it gets sent.
 *
 * @method doBeforeSendQuery
 * @param sQuery {String} Query string.
 * @return {String} Query string.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeSendQuery = function(sQuery) {
    return sQuery;
};

/**
 * Nulls out the entire AutoComplete instance and related objects, removes attached
 * event listeners, and clears out DOM elements inside the container. After
 * calling this method, the instance reference should be expliclitly nulled by
 * implementer, as in myDataTable = null. Use with caution!
 *
 * @method destroy
 */
YAHOO.widget.AutoComplete.prototype.destroy = function() {
    var instanceName = this.toString();
    var elInput = this._elTextbox;
    var elContainer = this._elContainer;

    // Unhook custom events
    this.textboxFocusEvent.unsubscribeAll();
    this.textboxKeyEvent.unsubscribeAll();
    this.dataRequestEvent.unsubscribeAll();
    this.dataReturnEvent.unsubscribeAll();
    this.dataErrorEvent.unsubscribeAll();
    this.containerExpandEvent.unsubscribeAll();
    this.typeAheadEvent.unsubscribeAll();
    this.itemMouseOverEvent.unsubscribeAll();
    this.itemMouseOutEvent.unsubscribeAll();
    this.itemArrowToEvent.unsubscribeAll();
    this.itemArrowFromEvent.unsubscribeAll();
    this.itemSelectEvent.unsubscribeAll();
    this.unmatchedItemSelectEvent.unsubscribeAll();
    this.selectionEnforceEvent.unsubscribeAll();
    this.containerCollapseEvent.unsubscribeAll();
    this.textboxBlurEvent.unsubscribeAll();

    // Unhook DOM events
    YAHOO.util.Event.purgeElement(elInput, true);
    YAHOO.util.Event.purgeElement(elContainer, true);

    // Remove DOM elements
    elContainer.innerHTML = "";

    // Null out objects
    for(var key in this) {
        if(YAHOO.lang.hasOwnProperty(this, key)) {
            this[key] = null;
        }
    }

    YAHOO.log("AutoComplete instance destroyed: " + instanceName);
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxFocusEvent = null;

/**
 * Fired when the input field receives key input.
 *
 * @event textboxKeyEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param nKeycode {Number} The keycode number.
 */
YAHOO.widget.AutoComplete.prototype.textboxKeyEvent = null;

/**
 * Fired when the AutoComplete instance makes a query to the DataSource.
 * 
 * @event dataRequestEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.AutoComplete.prototype.dataRequestEvent = null;

/**
 * Fired when the AutoComplete instance receives query results from the data
 * source.
 *
 * @event dataReturnEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]} Results array.
 */
YAHOO.widget.AutoComplete.prototype.dataReturnEvent = null;

/**
 * Fired when the AutoComplete instance does not receive query results from the
 * DataSource due to an error.
 *
 * @event dataErrorEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.AutoComplete.prototype.dataErrorEvent = null;

/**
 * Fired when the results container is expanded.
 *
 * @event containerExpandEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerExpandEvent = null;

/**
 * Fired when the input field has been prefilled by the type-ahead
 * feature. 
 *
 * @event typeAheadEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param sPrefill {String} The prefill string.
 */
YAHOO.widget.AutoComplete.prototype.typeAheadEvent = null;

/**
 * Fired when result item has been moused over.
 *
 * @event itemMouseOverEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt element item moused to.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent = null;

/**
 * Fired when result item has been moused out.
 *
 * @event itemMouseOutEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item moused from.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent = null;

/**
 * Fired when result item has been arrowed to. 
 *
 * @event itemArrowToEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed to.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent = null;

/**
 * Fired when result item has been arrowed away from.
 *
 * @event itemArrowFromEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed from.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent = null;

/**
 * Fired when an item is selected via mouse click, ENTER key, or TAB key.
 *
 * @event itemSelectEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The selected &lt;li&gt; element item.
 * @param oData {Object} The data returned for the item, either as an object,
 * or mapped from the schema into an array.
 */
YAHOO.widget.AutoComplete.prototype.itemSelectEvent = null;

/**
 * Fired when a user selection does not match any of the displayed result items.
 *
 * @event unmatchedItemSelectEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent = null;

/**
 * Fired if forceSelection is enabled and the user's input has been cleared
 * because it did not match one of the returned query results.
 *
 * @event selectionEnforceEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent = null;

/**
 * Fired when the results container is collapsed.
 *
 * @event containerCollapseEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerCollapseEvent = null;

/**
 * Fired when the input field loses focus.
 *
 * @event textboxBlurEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
 * @property _elTextbox
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elTextbox = null;

/**
 * Container DOM element.
 *
 * @property _elContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elContainer = null;

/**
 * Reference to content element within container element.
 *
 * @property _elContent
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elContent = null;

/**
 * Reference to header element within content element.
 *
 * @property _elHeader
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elHeader = null;

/**
 * Reference to body element within content element.
 *
 * @property _elBody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elBody = null;

/**
 * Reference to footer element within content element.
 *
 * @property _elFooter
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elFooter = null;

/**
 * Reference to shadow element within container element.
 *
 * @property _elShadow
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elShadow = null;

/**
 * Reference to iframe element within container element.
 *
 * @property _elIFrame
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elIFrame = null;

/**
 * Whether or not the input field is currently in focus. If query results come back
 * but the user has already moved on, do not proceed with auto complete behavior.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bFocused = false;

/**
 * Animation instance for container expand/collapse.
 *
 * @property _oAnim
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oAnim = null;

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
 * @type HTMLElement[]
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
    if(!YAHOO.lang.isNumber(minQueryLength)) {
        this.minQueryLength = 1;
    }
    var maxResultsDisplayed = this.maxResultsDisplayed;
    if(!YAHOO.lang.isNumber(maxResultsDisplayed) || (maxResultsDisplayed < 1)) {
        this.maxResultsDisplayed = 10;
    }
    var queryDelay = this.queryDelay;
    if(!YAHOO.lang.isNumber(queryDelay) || (queryDelay < 0)) {
        this.queryDelay = 0.2;
    }
    var delimChar = this.delimChar;
    if(YAHOO.lang.isString(delimChar) && (delimChar.length > 0)) {
        this.delimChar = [delimChar];
    }
    else if(!YAHOO.lang.isArray(delimChar)) {
        this.delimChar = null;
    }
    var animSpeed = this.animSpeed;
    if((this.animHoriz || this.animVert) && YAHOO.util.Anim) {
        if(!YAHOO.lang.isNumber(animSpeed) || (animSpeed < 0)) {
            this.animSpeed = 0.3;
        }
        if(!this._oAnim ) {
            this._oAnim = new YAHOO.util.Anim(this._elContent, {}, this.animSpeed);
        }
        else {
            this._oAnim.duration = this.animSpeed;
        }
    }
    if(this.forceSelection && delimChar) {
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
    if(this.useShadow && !this._elShadow) {
        var elShadow = document.createElement("div");
        elShadow.className = "yui-ac-shadow";
        this._elShadow = this._elContainer.appendChild(elShadow);
    }
    if(this.useIFrame && !this._elIFrame) {
        var elIFrame = document.createElement("iframe");
        elIFrame.src = this._iFrameSrc;
        elIFrame.frameBorder = 0;
        elIFrame.scrolling = "no";
        elIFrame.style.position = "absolute";
        elIFrame.style.width = "100%";
        elIFrame.style.height = "100%";
        elIFrame.tabIndex = -1;
        this._elIFrame = this._elContainer.appendChild(elIFrame);
    }
};

/**
 * Initializes the results container once at object creation
 *
 * @method _initContainer
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainer = function() {
    YAHOO.util.Dom.addClass(this._elContainer, "yui-ac-container");
    
    if(!this._elContent) {
        // The elContent div helps size the iframe and shadow properly
        var elContent = document.createElement("div");
        elContent.className = "yui-ac-content";
        elContent.style.display = "none";
        this._elContent = this._elContainer.appendChild(elContent);

        var elHeader = document.createElement("div");
        elHeader.className = "yui-ac-hd";
        elHeader.style.display = "none";
        this._elHeader = this._elContent.appendChild(elHeader);

        var elBody = document.createElement("div");
        elBody.className = "yui-ac-bd";
        this._elBody = this._elContent.appendChild(elBody);

        var elFooter = document.createElement("div");
        elFooter.className = "yui-ac-ft";
        elFooter.style.display = "none";
        this._elFooter = this._elContent.appendChild(elFooter);
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
    while(this._elBody.hasChildNodes()) {
        var oldListItems = this.getListItems();
        if(oldListItems) {
            for(var oldi = oldListItems.length-1; oldi >= 0; oldi--) {
                oldListItems[oldi] = null;
            }
        }
        this._elBody.innerHTML = "";
    }

    var oList = document.createElement("ul");
    oList = this._elBody.appendChild(oList);
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
    var currValue = this._elTextbox.value;
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
    if((nKeyCode == 9) || (nKeyCode == 13)  || // tab, enter
            (nKeyCode == 16) || (nKeyCode == 17) || // shift, ctl
            (nKeyCode >= 18 && nKeyCode <= 20) || // alt,pause/break,caps lock
            (nKeyCode == 27) || // esc
            (nKeyCode >= 33 && nKeyCode <= 35) || // page up,page down,end
            /*(nKeyCode >= 36 && nKeyCode <= 38) || // home,left,up
            (nKeyCode == 40) || // down*/
            (nKeyCode >= 36 && nKeyCode <= 40) || // home,left,up, right, down
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
    // Widget has been effectively turned off
    if(this.minQueryLength == -1) {
        this._toggleContainer(false);
        YAHOO.log("Property minQueryLength is set to -1", "info", this.toString());
        return;
    }
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
        if(nDelimIndex > -1) {
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
    if((sQuery && (sQuery.length < this.minQueryLength)) || (!sQuery && this.minQueryLength > 0)) {
        if(this._nDelayID != -1) {
            clearTimeout(this._nDelayID);
        }
        this._toggleContainer(false);
        YAHOO.log("Query \"" + sQuery + "\" is too short", "info", this.toString());
        return;
    }

    sQuery = encodeURIComponent(sQuery);
    this._nDelayID = -1;    // Reset timeout ID because request has been made
    sQuery = this.doBeforeSendQuery(sQuery);
    this.dataRequestEvent.fire(this, sQuery);
    YAHOO.log("Sending query \"" + sQuery + "\"", "info", this.toString());
    
    // Support for array of strings:
    // Convert array of strings to array of arrays of strings
    if((this.dataSource.dataType === YAHOO.util.DataSourceBase.TYPE_JSARRAY) ||
    // Convert array of strings embedded within JSON to array of arrays of strings
    ((this.dataSource.dataType === YAHOO.util.DataSourceBase.TYPE_JSON) && !this.dataSource.responseSchema.fields)) {
        this.dataSource.doBeforeCallback = this.filterResults;
    }
    
    this.dataSource.sendRequest(this.generateRequest(sQuery), {
            success : this._populateList,
            failure : this._populateList,
            scope   : this,
            argument: {
                query: sQuery
            }
    });
};

//TODO: NEW
YAHOO.widget.AutoComplete.prototype.generateRequest = function(sQuery) {
    var dataType = this.dataSource.dataType;
    // Backward compatibility
    if(dataType === YAHOO.util.DataSourceBase.TYPE_XHR) {
        // Default XHR get requests look like "{scriptURI}?{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
        if(!this.dataSource.connMethodPost) {
            sQuery = "?" + (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
                (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");        
        }
        // Default XHR post bodies are sent to the {scriptURI} like "{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
        else {
            sQuery = (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
                (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");
        }
    }
    // Default remote script requests look like "{scriptURI}&{scriptCallbackParam}={callbackString}&{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
    else if(dataType === YAHOO.util.DataSourceBase.TYPE_SCRIPTNODE) {
        sQuery = "&" + (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
            (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");    
    }
    return sQuery;
};

//TODO: NEW
YAHOO.widget.AutoComplete.prototype.filterResults = function(sQuery, oFullResponse, oParsedResponse) {
    var i;
    var aData = oParsedResponse.results; // the array
    var aResults = []; // container for results
    var bMatchFound = false;
    var bMatchContains = this.queryMatchContains;
    if(sQuery && sQuery !== "") {
        if(!this.queryMatchCase) {
            sQuery = sQuery.toLowerCase();
        }

        // Loop through each element of the array...
        // which can be a string or an array of strings
        for(i = aData.length-1; i >= 0; i--) {
            var aDataset = [];

            if(YAHOO.lang.isString(aData[i])) {
                aDataset[0] = aData[i];
            }
            else if(YAHOO.lang.isArray(aData[i])) {
                aDataset = aData[i];
            }

            if(YAHOO.lang.isString(aDataset[0])) {
                var sKeyIndex = (this.queryMatchCase) ?
                encodeURIComponent(aDataset[0]).indexOf(sQuery):
                encodeURIComponent(aDataset[0]).toLowerCase().indexOf(sQuery);

                // A STARTSWITH match is when the query is found at the beginning of the key string...
                if((!bMatchContains && (sKeyIndex === 0)) ||
                // A CONTAINS match is when the query is found anywhere within the key string...
                (bMatchContains && (sKeyIndex > -1))) {
                    // Stash a match into aResults[].
                    aResults.unshift(aDataset);
                }
            }
        }
    }
    else {
        for(i = aData.length-1; i >= 0; i--) {
            if(YAHOO.lang.isString(aData[i])) {
                aResults.unshift([aData[i]]);
            }
            else if(YAHOO.lang.isArray(aData[i])) {
                aResults.unshift(aData[i]);
            }
        }
    }
    
    oParsedResponse.results = aResults;
    return oParsedResponse;
};

/**
 * Populates the array of &lt;li&gt; elements in the container with query
 * results. This is the callback function method passed to YAHOO.util.DataSourceBase#sendRequest
 * so results from the DataSource are returned to the AutoComplete instance.
 *
 * @method _populateList
 * @param sQuery {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 * @private
 */
YAHOO.widget.AutoComplete.prototype._populateList = function(sQuery, oResponse, oPayload) {
    sQuery = oPayload.query || sQuery;
    
    this.dataReturnEvent.fire(this, sQuery, oResponse.results);
    
    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sQuery, oResponse, oPayload);

    // Data ok and instance is still focused (i.e., user hasn't already moved on)
    if(ok && this._bFocused && oResponse && !oResponse.error && YAHOO.lang.isArray(oResponse.results)) {

        //POPULATE LIST HERE
        var isOpera = (YAHOO.env.ua.opera);
        var contentStyle = this._elContent.style;
        contentStyle.width = (!isOpera) ? null : "";
        contentStyle.height = (!isOpera) ? null : "";
    
        var sCurQuery = decodeURIComponent(sQuery);
        this._sCurQuery = sCurQuery;
        this._bItemSelected = false;
    
        if(this._maxResultsDisplayed != this.maxResultsDisplayed) {
            this._initList();
        }
    
        var aResults = oResponse.results;
        var nItems = Math.min(aResults.length,this.maxResultsDisplayed);
        this._nDisplayedItems = nItems;
        if(nItems > 0) {
            this._initContainerHelpers();
            var aItems = this._aListItems;
            
            // Fill items with data
            for(var i = nItems-1; i >= 0; i--) {
                var oItemi = aItems[i];
                var oResultItemi = aResults[i];
                
                // Backward compatibility
                var key = this.key;
                // The deprecated formatResult overridable method has been defined by implementer...
                if(this.formatResult) {
                    // ...And the results are held in hash not an array and need to be converted back to an array
                    if(key !== 0) {
                        var aResultItemi = [];
                        aResultItemi[0] = oResultItemi[key];
                        // Add field data to the array
                        var fields = this.dataSource.responseSchema.fields;
                        if(YAHOO.lang.isArray(fields)) {
                            for(var k=1, l=fields.length; k<l; k++) {
                                aResultItemi[aResultItemi.length] = oResultItemi[fields[k]];
                            }
                        }
                        // Null fields defined, so pass along entire data object
                        else {
                            aResultItemi[1] = oResultItemi;
                        }
                        // Call the old method with the newly created array
                        oItemi.innerHTML = this.formatResult(aResultItemi, sCurQuery);
                    }
                    // ...And the results are already held in an array
                    else {
                        // Call the old method with the array
                        oItemi.innerHTML = this.formatResult(oResultItemi, sCurQuery);
                    }
                }
                // OK to call the new method with the hash
                else {
                    oItemi.innerHTML = this.formatResultNEW(oResultItemi, sCurQuery);
                }
                
                oItemi.style.display = "list-item";
                oItemi._sResultKey = oResultItemi[key];
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
    
            // Expand the container
            ok = this.doBeforeExpandContainer(this._elTextbox, this._elContainer, sQuery, aResults);
            this._toggleContainer(ok);
            
            if(this.autoHighlight) {
                // Go to the first item
                var oFirstItem = aItems[0];
                this._toggleHighlight(oFirstItem,"to");
                this.itemArrowToEvent.fire(this, oFirstItem);
                YAHOO.log("Arrowed to first item", "info", this.toString());
                this._typeAhead(oFirstItem,sQuery);
            }
            else {
                this._oCurItem = null;
            }
        }
        else {
            this._toggleContainer(false);
        }
        
        // TODO: document that this got moved to the top of the method
        //oSelf.dataReturnEvent.fire(oSelf, sQuery, aResults);
        YAHOO.log("Container populated with list items", "info", this.toString());




        return;

    }
    
    // Error
    if(ok && oResponse.error) {
        this.dataErrorEvent.fire(this, sQuery);
    }
    
    YAHOO.log("Could not populate list", "info", this.toString());    
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
    var sValue = this._elTextbox.value;
    var sChar = (this.delimChar) ? this.delimChar[0] : null;
    var nIndex = (sChar) ? sValue.lastIndexOf(sChar, sValue.length-2) : -1;
    if(nIndex > -1) {
        this._elTextbox.value = sValue.substring(0,nIndex);
    }
    else {
         this._elTextbox.value = "";
    }
    this._sSavedQuery = this._elTextbox.value;

    // Fire custom event
    this.selectionEnforceEvent.fire(this);
    YAHOO.log("Selection enforced", "info", this.toString());
};

/**
 * Whether or not user-typed value in the text input box matches any of the
 * query results.
 *
 * @method _textMatchesOption
 * @return {HTMLElement} Matching list item element if user-input text matches
 * a result, null otherwise.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._textMatchesOption = function() {
    var foundMatch = null;

    for(var i = this._nDisplayedItems-1; i >= 0 ; i--) {
        var oItem = this._aListItems[i];
        var sMatch = oItem._sResultKey.toLowerCase();
        if(sMatch == this._sCurQuery.toLowerCase()) {
            foundMatch = oItem;
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
    // Don't typeAhead if turned off or is backspace
    if(!this.typeAhead || (this._nKeyCode == 8)) {
        return;
    }

    var elTextbox = this._elTextbox;
    // Only if text selection is supported
    if(elTextbox.setSelectionRange && elTextbox.createTextRange) {
        // Select the portion of text that the user has not typed
        var nStart = elTextbox.value.length; // any saved queries plus what user has typed
        this._updateValue(oItem);
        var nEnd = elTextbox.alue.length;
        this._selectText(elTextbox,nStart,nEnd);
        var sPrefill = elTextbox.value.substr(nStart,nEnd);
        this.typeAheadEvent.fire(this,sQuery,sPrefill);
        YAHOO.log("Typeahead occured with prefill string \"" + sPrefill + "\"", "info", this.toString());
    }
};

/**
 * Selects text in the input field.
 *
 * @method _selectText
 * @param elTextbox {HTMLElement} Text input box element in which to select text.
 * @param nStart {Number} Starting index of text string to select.
 * @param nEnd {Number} Ending index of text selection.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectText = function(elTextbox, nStart, nEnd) {
    if(elTextbox.setSelectionRange) { // For Mozilla
        elTextbox.setSelectionRange(nStart,nEnd);
    }
    else if(elTextbox.createTextRange) { // For IE
        var oTextRange = elTextbox.createTextRange();
        oTextRange.moveStart("character", nStart);
        oTextRange.moveEnd("character", nEnd-elTextbox.value.length);
        oTextRange.select();
    }
    else {
        elTextbox.select();
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
    var width = this._elContent.offsetWidth + "px";
    var height = this._elContent.offsetHeight + "px";

    if(this.useIFrame && this._elIFrame) {
        bFireEvent = true;
        if(bShow) {
            this._elIFrame.style.width = width;
            this._elIFrame.style.height = height;
        }
        else {
            this._elIFrame.style.width = 0;
            this._elIFrame.style.height = 0;
        }
    }
    if(this.useShadow && this._elShadow) {
        bFireEvent = true;
        if(bShow) {
            this._elShadow.style.width = width;
            this._elShadow.style.height = height;
        }
        else {
           this._elShadow.style.width = 0;
            this._elShadow.style.height = 0;
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
    var elContainer = this._elContainer;

    // Implementer has container always open so don't mess with it
    if(this.alwaysShowContainer && this._bContainerOpen) {
        return;
    }
    
    // Clear contents of container
    if(!bShow) {
        this._elContent.scrollTop = 0;
        var aItems = this._aListItems;

        if(aItems && (aItems.length > 0)) {
            for(var i = aItems.length-1; i >= 0 ; i--) {
                aItems[i].style.display = "none";
            }
        }

        if(this._oCurItem) {
            this._toggleHighlight(this._oCurItem,"from");
        }

        this._oCurItem = null;
        this._nDisplayedItems = 0;
        this._sCurQuery = null;
    }

    // Container is already closed
    if(!bShow && !this._bContainerOpen) {
        this._elContent.style.display = "none";
        return;
    }

    // If animation is enabled...
    var oAnim = this._oAnim;
    if(oAnim && oAnim.getEl() && (this.animHoriz || this.animVert)) {
        // If helpers need to be collapsed, do it right away...
        // but if helpers need to be expanded, wait until after the container expands
        if(!bShow) {
            this._toggleContainerHelpers(bShow);
        }

        if(oAnim.isAnimated()) {
            oAnim.stop();
        }

        // Clone container to grab current size offscreen
        var oClone = this._elContent.cloneNode(true);
        elContainer.appendChild(oClone);
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
            this._elContent.style.width = wColl+"px";
            this._elContent.style.height = hColl+"px";
        }
        // Else, set it to its last known size.
        else {
            this._elContent.style.width = wExp+"px";
            this._elContent.style.height = hExp+"px";
        }

        elContainer.removeChild(oClone);
        oClone = null;

    	var oSelf = this;
    	var onAnimComplete = function() {
            // Finish the collapse
    		oAnim.onComplete.unsubscribeAll();

            if(bShow) {
                oSelf.containerExpandEvent.fire(oSelf);
                YAHOO.log("Container expanded", "info", oSelf.toString());
            }
            else {
                oSelf._elContent.style.display = "none";
                oSelf.containerCollapseEvent.fire(oSelf);
                YAHOO.log("Container collapsed", "info", oSelf.toString());
            }
            oSelf._toggleContainerHelpers(bShow);
     	};

        // Display container and animate it
        this._elContent.style.display = "block";
        oAnim.onComplete.subscribe(onAnimComplete);
        oAnim.animate();
        this._bContainerOpen = bShow;
    }
    // Else don't animate, just show or hide
    else {
        if(bShow) {
            this._elContent.style.display = "block";
            this.containerExpandEvent.fire(this);
            YAHOO.log("Container expanded", "info", this.toString());
        }
        else {
            this._elContent.style.display = "none";
            this.containerCollapseEvent.fire(this);
            YAHOO.log("Container collapsed", "info", this.toString());
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
    var elTextbox = this._elTextbox;
    var sDelimChar = (this.delimChar) ? (this.delimChar[0] || this.delimChar) : null;
    var sSavedQuery = this._sSavedQuery;
    var sResultKey = oItem._sResultKey;
    elTextbox.focus();

    // First clear text field
    elTextbox.value = "";
    // Grab data to put into text field
    if(sDelimChar) {
        if(sSavedQuery) {
            elTextbox.value = sSavedQuery;
        }
        elTextbox.value += sResultKey + sDelimChar;
        if(sDelimChar != " ") {
            elTextbox.value += " ";
        }
    }
    else { elTextbox.value = sResultKey; }

    // scroll to bottom of textarea if necessary
    if(elTextbox.type == "textarea") {
        elTextbox.scrollTop = elTextbox.scrollHeight;
    }

    // move cursor to end
    var end = elTextbox.value.length;
    this._selectText(elTextbox,end,end);

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
    YAHOO.log("Item selected: " + YAHOO.lang.dump(oItem._oResultData), "info", this.toString());
    this._toggleContainer(false);
};

/**
 * If an item is highlighted in the container, the right arrow key jumps to the
 * end of the textbox and selects the highlighted item, otherwise the container
 * is closed.
 *
 * @method _jumpSelection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._jumpSelection = function() {
    if(this._oCurItem) {
        this._selectItem(this._oCurItem);
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

        if(oCurItem) {
            nCurItemIndex = oCurItem._nItemIndex;
        }

        var nNewItemIndex = (nKeyCode == 40) ?
                (nCurItemIndex + 1) : (nCurItemIndex - 1);

        // Out of bounds
        if(nNewItemIndex < -2 || nNewItemIndex >= this._nDisplayedItems) {
            return;
        }

        if(oCurItem) {
            // Unhighlight current item
            this._toggleHighlight(oCurItem, "from");
            this.itemArrowFromEvent.fire(this, oCurItem);
            YAHOO.log("Item arrowed from", "info", this.toString());
        }
        if(nNewItemIndex == -1) {
           // Go back to query (remove type-ahead string)
            if(this.delimChar && this._sSavedQuery) {
                if(!this._textMatchesOption()) {
                    this._elTextbox.value = this._sSavedQuery;
                }
                else {
                    this._elTextbox.value = this._sSavedQuery + this._sCurQuery;
                }
            }
            else {
                this._elTextbox.value = this._sCurQuery;
            }
            this._oCurItem = null;
            return;
        }
        if(nNewItemIndex == -2) {
            // Close container
            this._toggleContainer(false);
            return;
        }

        var oNewItem = this._aListItems[nNewItemIndex];

        // Scroll the container if necessary
        var elContent = this._elContent;
        var scrollOn = ((YAHOO.util.Dom.getStyle(elContent,"overflow") == "auto") ||
            (YAHOO.util.Dom.getStyle(elContent,"overflowY") == "auto"));
        if(scrollOn && (nNewItemIndex > -1) &&
        (nNewItemIndex < this._nDisplayedItems)) {
            // User is keying down
            if(nKeyCode == 40) {
                // Bottom of selected item is below scroll area...
                if((oNewItem.offsetTop+oNewItem.offsetHeight) > (elContent.scrollTop + elContent.offsetHeight)) {
                    // Set bottom of scroll area to bottom of selected item
                    elContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - elContent.offsetHeight;
                }
                // Bottom of selected item is above scroll area...
                else if((oNewItem.offsetTop+oNewItem.offsetHeight) < elContent.scrollTop) {
                    // Set top of selected item to top of scroll area
                    elContent.scrollTop = oNewItem.offsetTop;

                }
            }
            // User is keying up
            else {
                // Top of selected item is above scroll area
                if(oNewItem.offsetTop < elContent.scrollTop) {
                    // Set top of scroll area to top of selected item
                    this._elContent.scrollTop = oNewItem.offsetTop;
                }
                // Top of selected item is below scroll area
                else if(oNewItem.offsetTop > (elContent.scrollTop + elContent.offsetHeight)) {
                    // Set bottom of selected item to bottom of scroll area
                    this._elContent.scrollTop = (oNewItem.offsetTop+oNewItem.offsetHeight) - elContent.offsetHeight;
                }
            }
        }

        this._toggleHighlight(oNewItem, "to");
        this.itemArrowToEvent.fire(this, oNewItem);
        YAHOO.log("Item arrowed to", "info", this.toString());
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
    YAHOO.log("Item moused over", "info", oSelf.toString());
};

/**
 * Handles &lt;li&gt; element mouseout events in the container.
 *
 * @method _onItemMouseout
 * @param v {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
    YAHOO.log("Item moused out", "info", oSelf.toString());
};

/**
 * Handles &lt;li&gt; element click events in the container.
 *
 * @method _onItemMouseclick
 * @param v {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerScroll = function(v,oSelf) {
    oSelf._elTextbox.focus();
};

/**
 * Handles container resize events.
 *
 * @method _onContainerResize
 * @param v {HTMLEvent} The resize event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown = function(v,oSelf) {
    var nKeyCode = v.keyCode;

    switch (nKeyCode) {
        case 9: // tab
            if((navigator.userAgent.toLowerCase().indexOf("mac") == -1)) {
                // select an item or clear out
                if(oSelf._oCurItem) {
                    if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._oCurItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
            }
            break;
        case 13: // enter
            if((navigator.userAgent.toLowerCase().indexOf("mac") == -1)) {
                if(oSelf._oCurItem) {
                    if(oSelf._nKeyCode != nKeyCode) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._oCurItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
            }
            break;
        case 27: // esc
            oSelf._toggleContainer(false);
            return;
        case 39: // right
            oSelf._jumpSelection();
            break;
        case 38: // up
            if(oSelf._bContainerOpen) {
                YAHOO.util.Event.stopEvent(v);
                oSelf._moveSelection(nKeyCode);
            }
            break;
        case 40: // down
            if(oSelf._bContainerOpen) {
                YAHOO.util.Event.stopEvent(v);
                oSelf._moveSelection(nKeyCode);
            }
            break;
        default:
            oSelf._oCurItem = null;
            oSelf._bItemSelected = false;
            YAHOO.util.Dom.removeClass(oSelf._oCurItem,  oSelf.highlightClassName);
    
            oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
            YAHOO.log("Textbox keyed", "info", oSelf.toString());
            break;
    }
};

/**
 * Handles textbox keypress events.
 * @method _onTextboxKeyPress
 * @param v {HTMLEvent} The keypress event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress = function(v,oSelf) {
    var nKeyCode = v.keyCode;

        //Expose only to Mac browsers, where stopEvent is ineffective on keydown events (bug 790337)
        if((navigator.userAgent.toLowerCase().indexOf("mac") != -1)) {
            switch (nKeyCode) {
            case 9: // tab
                // select an item or clear out
                if(oSelf._oCurItem) {
                    if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._oCurItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
                break;
            case 13: // enter
                if(oSelf._oCurItem) {
                    if(oSelf._nKeyCode != nKeyCode) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._oCurItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
                break;
            default:
                break;
            }
        }

        //TODO: (?) limit only to non-IE, non-Mac-FF for Korean IME support (bug 811948)
        // Korean IME detected
        else if(nKeyCode == 229) {
            oSelf._queryInterval = setInterval(function() { oSelf._onIMEDetected(oSelf); },500);
        }
};

/**
 * Handles textbox keyup events to trigger queries.
 *
 * @method _onTextboxKeyUp
 * @param v {HTMLEvent} The keyup event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp = function(v,oSelf) {
    // Check to see if any of the public properties have been updated
    oSelf._initProps();

    var nKeyCode = v.keyCode;

    oSelf._nKeyCode = nKeyCode;
    var sText = this.value; //string in textbox

    // Filter out chars that don't trigger queries
    if(oSelf._isIgnoreKey(nKeyCode) || (sText.toLowerCase() == oSelf._sCurQuery)) {
        return;
    }

    // Set timeout on the request
    if(oSelf.queryDelay > 0) {
        var nDelayID =
            setTimeout(function(){oSelf._sendQuery(sText);},(oSelf.queryDelay * 1000));

        if(oSelf._nDelayID != -1) {
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
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxFocus = function (v,oSelf) {
    // Start of a new interaction
    if(!oSelf._bFocused) {
        oSelf._elTextbox.setAttribute("autocomplete","off");
        oSelf._bFocused = true;
        oSelf.textboxFocusEvent.fire(oSelf);
        YAHOO.log("Textbox focused", "info", oSelf.toString());
    }
};

/**
 * Handles text input box losing focus.
 *
 * @method _onTextboxBlur
 * @param v {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxBlur = function (v,oSelf) {
    // Don't treat as a blur if it was a selection via mouse click
    if(!oSelf._bOverContainer || (oSelf._nKeyCode == 9)) {
        // Current query needs to be validated as a selection
        if(!oSelf._bItemSelected) {
            var oMatch = oSelf._textMatchesOption();
            // Container is closed or current query doesn't match any result
            if(!oSelf._bContainerOpen || (oSelf._bContainerOpen && (oMatch === null))) {
                // Force selection is enabled so clear the current query
                if(oSelf.forceSelection) {
                    oSelf._clearSelection();
                }
                // Treat current query as a valid selection
                else {
                    oSelf.unmatchedItemSelectEvent.fire(oSelf);
                    YAHOO.log("Unmatched item selected", "info", oSelf.toString());
                }
            }
            // Container is open and current query matches a result
            else {
                // Force a selection when textbox is blurred with a match
                if(oSelf.forceSelection) {
                    oSelf._selectItem(oMatch);
                }
            }
        }

        if(oSelf._bContainerOpen) {
            oSelf._toggleContainer(false);
        }
        oSelf._cancelIntervalDetection(oSelf);
        oSelf._bFocused = false;
        oSelf.textboxBlurEvent.fire(oSelf);
        YAHOO.log("Textbox blurred", "info", oSelf.toString());
    }
};

/**
 * Handles window unload event.
 *
 * @method _onWindowUnload
 * @param v {HTMLEvent} The unload event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onWindowUnload = function(v,oSelf) {
    if(oSelf && oSelf._elTextbox && oSelf.allowBrowserAutocomplete) {
        oSelf._elTextbox.setAttribute("autocomplete","on");
    }
};
