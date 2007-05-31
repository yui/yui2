/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The DataSource classes manages sending a request and returning response from a live
 * database. Supported data include local JavaScript arrays and objects and databases
 * accessible via XHR connections. Supported response formats include JavaScript arrays,
 * JSON, XML, and flat-file textual data.
 *  
 * @class DataSource
 * @constructor
 */
YAHOO.widget.DataSource = function() { 
    /* abstract class */
};


/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Error message for null data responses.
 *
 * @property ERROR_DATANULL
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataSource.ERROR_DATANULL = "Response data was null";

/**
 * Error message for data responses with parsing errors.
 *
 * @property ERROR_DATAPARSE
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DataSource.ERROR_DATAPARSE = "Response data could not be parsed";


/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Max size of the local cache.  Set to 0 to turn off caching.  Caching is
 * useful to reduce the number of server connections.  Recommended only for data
 * sources that return comprehensive results for queries or when stale data is
 * not an issue.
 *
 * @property maxCacheEntries
 * @type Number
 * @default 15
 */
YAHOO.widget.DataSource.prototype.maxCacheEntries = 15;

/**
 * Use this to fine-tune the matching algorithm used against JS Array types of
 * DataSource and DataSource caches. If queryMatchContains is true, then the JS
 * Array or cache returns results that "contain" the query string. By default,
 * queryMatchContains is set to false, so that only results that "start with"
 * the query string are returned.
 *
 * @property queryMatchContains
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataSource.prototype.queryMatchContains = false;

/**
 * Enables query subset matching. If caching is on and queryMatchSubset is
 * true, substrings of queries will return matching cached results. For
 * instance, if the first query is for "abc" susequent queries that start with
 * "abc", like "abcd", will be queried against the cache, and not the live data
 * source. Recommended only for DataSources that return comprehensive results
 * for queries with very few characters.
 *
 * @property queryMatchSubset
 * @type Boolean
 * @default false
 *
 */
YAHOO.widget.DataSource.prototype.queryMatchSubset = false;

/**
 * Enables case-sensitivity in the matching algorithm used against JS Array
 * types of DataSources and DataSource caches. If queryMatchCase is true, only
 * case-sensitive matches will return.
 *
 * @property queryMatchCase
 * @type Boolean
 * @default false
 */
YAHOO.widget.DataSource.prototype.queryMatchCase = false;


/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the DataSource instance.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance
 */
YAHOO.widget.DataSource.prototype.toString = function() {
    return "DataSource " + this._sName;
};

/**
 * Retrieves query results, first checking the local cache, then making the
 * query request to the live data source as defined by the function doQuery.
 *
 * @method getResults
 * @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 */
YAHOO.widget.DataSource.prototype.getResults = function(oCallbackFn, sQuery, oParent) {
    
    // First look in cache
    var aResults = this._doQueryCache(oCallbackFn,sQuery,oParent);
    // Not in cache, so get results from server
    if(aResults.length === 0) {
        this.queryEvent.fire(this, oParent, sQuery);
        this.doQuery(oCallbackFn, sQuery, oParent);
    }
};

/**
 * Abstract method implemented by subclasses to make a query to the live data
 * source. Must call the callback function with the response returned from the
 * query. Populates cache (if enabled).
 *
 * @method doQuery
 * @param oCallbackFn {HTMLFunction} Callback function implemented by oParent to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 */
YAHOO.widget.DataSource.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    /* override this */ 
};

/**
 * Flushes cache.
 *
 * @method flushCache
 */
YAHOO.widget.DataSource.prototype.flushCache = function() {
    if(this._aCache) {
        this._aCache = [];
    }
    if(this._aCacheHelper) {
        this._aCacheHelper = [];
    }
    this.cacheFlushEvent.fire(this);
};

/////////////////////////////////////////////////////////////////////////////
//
// Public events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fired when a query is made to the live data source.
 *
 * @event queryEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oParent {Object} The requesting object.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.DataSource.prototype.queryEvent = null;

/**
 * Fired when a query is made to the local cache.
 *
 * @event cacheQueryEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oParent {Object} The requesting object.
 * @param sQuery {String} The query string.
 */
YAHOO.widget.DataSource.prototype.cacheQueryEvent = null;

/**
 * Fired when data is retrieved from the live data source.
 *
 * @event getResultsEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oParent {Object} The requesting object.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]} Array of result objects.
 */
YAHOO.widget.DataSource.prototype.getResultsEvent = null;
    
/**
 * Fired when data is retrieved from the local cache.
 *
 * @event getCachedResultsEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oParent {Object} The requesting object.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]} Array of result objects.
 */
YAHOO.widget.DataSource.prototype.getCachedResultsEvent = null;

/**
 * Fired when an error is encountered with the live data source.
 *
 * @event dataErrorEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oParent {Object} The requesting object.
 * @param sQuery {String} The query string.
 * @param sMsg {String} Error message string
 */
YAHOO.widget.DataSource.prototype.dataErrorEvent = null;

/**
 * Fired when the local cache is flushed.
 *
 * @event cacheFlushEvent
 * @param oSelf {Object} The DataSource instance
 */
YAHOO.widget.DataSource.prototype.cacheFlushEvent = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple DataSource instances.
 *
 * @property _nIndex
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.DataSource._nIndex = 0;

/**
 * Name of DataSource instance.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.DataSource.prototype._sName = null;

/**
 * Local cache of data result objects indexed chronologically.
 *
 * @property _aCache
 * @type Object[]
 * @private
 */
YAHOO.widget.DataSource.prototype._aCache = null;


/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Initializes DataSource instance.
 *  
 * @method _init
 * @private
 */
YAHOO.widget.DataSource.prototype._init = function() {
    // Validate and initialize public configs
    var maxCacheEntries = this.maxCacheEntries;
    if(!YAHOO.lang.isNumber(maxCacheEntries) || (maxCacheEntries < 0)) {
        maxCacheEntries = 0;
    }
    // Initialize local cache
    if(maxCacheEntries > 0 && !this._aCache) {
        this._aCache = [];
    }
    
    this._sName = "instance" + YAHOO.widget.DataSource._nIndex;
    YAHOO.widget.DataSource._nIndex++;
    
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
 * @method _addCacheElem
 * @param oResult {Object} Data result object, including array of results.
 * @private
 */
YAHOO.widget.DataSource.prototype._addCacheElem = function(oResult) {
    var aCache = this._aCache;
    // Don't add if anything important is missing.
    if(!aCache || !oResult || !oResult.query || !oResult.results) {
        return;
    }
    
    // If the cache is full, make room by removing from index=0
    if(aCache.length >= this.maxCacheEntries) {
        aCache.shift();
    }
        
    // Add to cache, at the end of the array
    aCache.push(oResult);
};

/**
 * Queries the local cache for results. If query has been cached, the callback
 * function is called with the results, and the cached is refreshed so that it
 * is now the newest element.  
 *
 * @method _doQueryCache
 * @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 * @return aResults {Object[]} Array of results from local cache if found, otherwise null.
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
                encodeURIComponent(resultObj.query).toLowerCase():
                encodeURIComponent(resultObj.query);
            
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
                                encodeURIComponent(aRecord[0]).indexOf(sQuery):
                                encodeURIComponent(aRecord[0]).toLowerCase().indexOf(sQuery);
                            
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
 *  
 * @class DS_XHR
 * @extends YAHOO.widget.DataSource
 * @requires connection
 * @constructor
 * @param sScriptURI {String} Absolute or relative URI to script that returns query
 * results as JSON, XML, or delimited flat-file data.
 * @param aSchema {String[]} Data schema definition of results.
 * @param oConfigs {Object} (optional) Object literal of config params.
 */
YAHOO.widget.DS_XHR = function(sScriptURI, aSchema, oConfigs) {
    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    if(!YAHOO.lang.isArray(aSchema) || !YAHOO.lang.isString(sScriptURI)) {
        YAHOO.log("Could not instantiate XHR DataSource due to invalid arguments", "error", this.toString());
        return;
    }

    this.schema = aSchema;
    this.scriptURI = sScriptURI;
    
    this._init();
    YAHOO.log("XHR DataSource initialized","info",this.toString());
};

YAHOO.widget.DS_XHR.prototype = new YAHOO.widget.DataSource();

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * JSON data type.
 *
 * @property TYPE_JSON
 * @type Number
 * @static
 * @final
 */
YAHOO.widget.DS_XHR.TYPE_JSON = 0;

/**
 * XML data type.
 *
 * @property TYPE_XML
 * @type Number
 * @static
 * @final
 */
YAHOO.widget.DS_XHR.TYPE_XML = 1;

/**
 * Flat-file data type.
 *
 * @property TYPE_FLAT
 * @type Number
 * @static
 * @final
 */
YAHOO.widget.DS_XHR.TYPE_FLAT = 2;

/**
 * Error message for XHR failure.
 *
 * @property ERROR_DATAXHR
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DS_XHR.ERROR_DATAXHR = "XHR response failed";

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Alias to YUI Connection Manager. Allows implementers to specify their own
 * subclasses of the YUI Connection Manager utility.
 *
 * @property connMgr
 * @type Object
 * @default YAHOO.util.Connect
 */
YAHOO.widget.DS_XHR.prototype.connMgr = YAHOO.util.Connect;

/**
 * Number of milliseconds the XHR connection will wait for a server response. A
 * a value of zero indicates the XHR connection will wait forever. Any value
 * greater than zero will use the Connection utility's Auto-Abort feature.
 *
 * @property connTimeout
 * @type Number
 * @default 0
 */
YAHOO.widget.DS_XHR.prototype.connTimeout = 0;

/**
 * Absolute or relative URI to script that returns query results. For instance,
 * queries will be sent to &#60;scriptURI&#62;?&#60;scriptQueryParam&#62;=userinput
 *
 * @property scriptURI
 * @type String
 */
YAHOO.widget.DS_XHR.prototype.scriptURI = null;

/**
 * Query string parameter name sent to scriptURI. For instance, queries will be
 * sent to &#60;scriptURI&#62;?&#60;scriptQueryParam&#62;=userinput
 *
 * @property scriptQueryParam
 * @type String
 * @default "query"
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryParam = "query";

/**
 * String of key/value pairs to append to requests made to scriptURI. Define
 * this string when you want to send additional query parameters to your script.
 * When defined, queries will be sent to
 * &#60;scriptURI&#62;?&#60;scriptQueryParam&#62;=userinput&#38;&#60;scriptQueryAppend&#62;
 *
 * @property scriptQueryAppend
 * @type String
 * @default ""
 */
YAHOO.widget.DS_XHR.prototype.scriptQueryAppend = "";

/**
 * XHR response data type. Other types that may be defined are YAHOO.widget.DS_XHR.TYPE_XML
 * and YAHOO.widget.DS_XHR.TYPE_FLAT.
 *
 * @property responseType
 * @type String
 * @default YAHOO.widget.DS_XHR.TYPE_JSON
 */
YAHOO.widget.DS_XHR.prototype.responseType = YAHOO.widget.DS_XHR.TYPE_JSON;

/**
 * String after which to strip results. If the results from the XHR are sent
 * back as HTML, the gzip HTML comment appears at the end of the data and should
 * be ignored.
 *
 * @property responseStripAfter
 * @type String
 * @default "\n&#60;!-"
 */
YAHOO.widget.DS_XHR.prototype.responseStripAfter = "\n<!-";

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Queries the live data source defined by scriptURI for results. Results are
 * passed back to a callback function.
 *  
 * @method doQuery
 * @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 */
YAHOO.widget.DS_XHR.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var isXML = (this.responseType == YAHOO.widget.DS_XHR.TYPE_XML);
    var sUri = this.scriptURI+"?"+this.scriptQueryParam+"="+sQuery;
    if(this.scriptQueryAppend.length > 0) {
        sUri += "&" + this.scriptQueryAppend;
    }
    YAHOO.log("DataSource is querying URL " + sUri, "info", this.toString());
    var oResponse = null;
    
    var oSelf = this;
    /*
     * Sets up ajax request callback
     *
     * @param {object} oReq          HTTPXMLRequest object
     * @private
     */
    var responseSuccess = function(oResp) {
        // Response ID does not match last made request ID.
        if(!oSelf._oConn || (oResp.tId != oSelf._oConn.tId)) {
            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
            YAHOO.log(YAHOO.widget.DataSource.ERROR_DATANULL, "error", this.toString());
            return;
        }
//DEBUG
/*YAHOO.log(oResp.responseXML.getElementsByTagName("Result"),'warn');
for(var foo in oResp) {
    YAHOO.log(foo + ": "+oResp[foo],'warn');
}
YAHOO.log('responseXML.xml: '+oResp.responseXML.xml,'warn');*/
        if(!isXML) {
            oResp = oResp.responseText;
        }
        else { 
            oResp = oResp.responseXML;
        }
        if(oResp === null) {
            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
            YAHOO.log(YAHOO.widget.DataSource.ERROR_DATANULL, "error", oSelf.toString());
            return;
        }

        var aResults = oSelf.parseResponse(sQuery, oResp, oParent);
        var resultObj = {};
        resultObj.query = decodeURIComponent(sQuery);
        resultObj.results = aResults;
        if(aResults === null) {
            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATAPARSE);
            YAHOO.log(YAHOO.widget.DataSource.ERROR_DATAPARSE, "error", oSelf.toString());
            aResults = [];
        }
        else {
            oSelf.getResultsEvent.fire(oSelf, oParent, sQuery, aResults);
            oSelf._addCacheElem(resultObj);
        }
        oCallbackFn(sQuery, aResults, oParent);
    };

    var responseFailure = function(oResp) {
        oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DS_XHR.ERROR_DATAXHR);
        YAHOO.log(YAHOO.widget.DS_XHR.ERROR_DATAXHR + ": " + oResp.statusText, "error", oSelf.toString());
        return;
    };
    
    var oCallback = {
        success:responseSuccess,
        failure:responseFailure
    };
    
    if(YAHOO.lang.isNumber(this.connTimeout) && (this.connTimeout > 0)) {
        oCallback.timeout = this.connTimeout;
    }
    
    if(this._oConn) {
        this.connMgr.abort(this._oConn);
    }
    
    oSelf._oConn = this.connMgr.asyncRequest("GET", sUri, oCallback, null);
};

/**
 * Parses raw response data into an array of result objects. The result data key
 * is always stashed in the [0] element of each result object. 
 *
 * @method parseResponse
 * @param sQuery {String} Query string.
 * @param oResponse {Object} The raw response data to parse.
 * @param oParent {Object} The object instance that has requested data.
 * @returns {Object[]} Array of result objects.
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
        case YAHOO.widget.DS_XHR.TYPE_JSON:
            var jsonList, jsonObjParsed;
            // Check for JSON lib but divert KHTML clients
            var isNotMac = (navigator.userAgent.toLowerCase().indexOf('khtml')== -1);
            if(oResponse.parseJSON && isNotMac) {
                // Use the new JSON utility if available
                jsonObjParsed = oResponse.parseJSON();
                if(!jsonObjParsed) {
                    bError = true;
                }
                else {
                    try {
                        // eval is necessary here since aSchema[0] is of unknown depth
                        jsonList = eval("jsonObjParsed." + aSchema[0]);
                    }
                    catch(e) {
                        bError = true;
                        break;
                   }
                }
            }
            else if(window.JSON && isNotMac) {
                // Use older JSON lib if available
                jsonObjParsed = JSON.parse(oResponse);
                if(!jsonObjParsed) {
                    bError = true;
                    break;
                }
                else {
                    try {
                        // eval is necessary here since aSchema[0] is of unknown depth
                        jsonList = eval("jsonObjParsed." + aSchema[0]);
                    }
                    catch(e) {
                        bError = true;
                        break;
                   }
                }
            }
            else {
                // Parse the JSON response as a string
                try {
                    // Trim leading spaces
                    while (oResponse.substring(0,1) == " ") {
                        oResponse = oResponse.substring(1, oResponse.length);
                    }

                    // Invalid JSON response
                    if(oResponse.indexOf("{") < 0) {
                        bError = true;
                        break;
                    }

                    // Empty (but not invalid) JSON response
                    if(oResponse.indexOf("{}") === 0) {
                        break;
                    }

                    // Turn the string into an object literal...
                    // ...eval is necessary here
                    var jsonObjRaw = eval("(" + oResponse + ")");
                    if(!jsonObjRaw) {
                        bError = true;
                        break;
                    }

                    // Grab the object member that contains an array of all reponses...
                    // ...eval is necessary here since aSchema[0] is of unknown depth
                    jsonList = eval("(jsonObjRaw." + aSchema[0]+")");
                }
                catch(e) {
                    bError = true;
                    break;
               }
            }

            if(!jsonList) {
                bError = true;
                break;
            }

            if(!YAHOO.lang.isArray(jsonList)) {
                jsonList = [jsonList];
            }
            
            // Loop through the array of all responses...
            for(var i = jsonList.length-1; i >= 0 ; i--) {
                var aResultItem = [];
                var jsonResult = jsonList[i];
                // ...and loop through each data field value of each response
                for(var j = aSchema.length-1; j >= 1 ; j--) {
                    // ...and capture data into an array mapped according to the schema...
                    var dataFieldValue = jsonResult[aSchema[j]];
                    if(!dataFieldValue) {
                        dataFieldValue = "";
                    }
                    //YAHOO.log("data: " + i + " value:" +j+" = "+dataFieldValue,"debug",this.toString());
                    aResultItem.unshift(dataFieldValue);
                }
                // If schema isn't well defined, pass along the entire result object
                if(aResultItem.length == 1) {
                    aResultItem.push(jsonResult);
                }
                // Capture the array of data field values in an array of results
                aResults.unshift(aResultItem);
            }
            break;
        case YAHOO.widget.DS_XHR.TYPE_XML:
            // Get the collection of results
            var xmlList = oResponse.getElementsByTagName(aSchema[0]);
            if(!xmlList) {
                bError = true;
                break;
            }
            // Loop through each result
            for(var k = xmlList.length-1; k >= 0 ; k--) {
                var result = xmlList.item(k);
                //YAHOO.log("Result"+k+" is "+result.attributes.item(0).firstChild.nodeValue,"debug",this.toString());
                var aFieldSet = [];
                // Loop through each data field in each result using the schema
                for(var m = aSchema.length-1; m >= 1 ; m--) {
                    //YAHOO.log(aSchema[m]+" is "+result.attributes.getNamedItem(aSchema[m]).firstChild.nodeValue);
                    var sValue = null;
                    // Values may be held in an attribute...
                    var xmlAttr = result.attributes.getNamedItem(aSchema[m]);
                    if(xmlAttr) {
                        sValue = xmlAttr.value;
                        //YAHOO.log("Attr value is "+sValue,"debug",this.toString());
                    }
                    // ...or in a node
                    else{
                        var xmlNode = result.getElementsByTagName(aSchema[m]);
                        if(xmlNode && xmlNode.item(0) && xmlNode.item(0).firstChild) {
                            sValue = xmlNode.item(0).firstChild.nodeValue;
                            //YAHOO.log("Node value is "+sValue,"debug",this.toString());
                        }
                        else {
                            sValue = "";
                            //YAHOO.log("Value not found","debug",this.toString());
                        }
                    }
                    // Capture the schema-mapped data field values into an array
                    aFieldSet.unshift(sValue);
                }
                // Capture each array of values into an array of results
                aResults.unshift(aFieldSet);
            }
            break;
        case YAHOO.widget.DS_XHR.TYPE_FLAT:
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
    sQuery = null;
    oResponse = null;
    oParent = null;
    if(bError) {
        return null;
    }
    else {
        return aResults;
    }
};            

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * XHR connection object.
 *
 * @property _oConn
 * @type Object
 * @private
 */
YAHOO.widget.DS_XHR.prototype._oConn = null;


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Implementation of YAHOO.widget.DataSource using a native Javascript function as
 * its live data source.
 *  
 * @class DS_JSFunction
 * @constructor
 * @extends YAHOO.widget.DataSource
 * @param oFunction {HTMLFunction} In-memory Javascript function that returns query results as an array of objects.
 * @param oConfigs {Object} (optional) Object literal of config params.
 */
YAHOO.widget.DS_JSFunction = function(oFunction, oConfigs) {
    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    if(!YAHOO.lang.isFunction(oFunction)) {
        YAHOO.log("Could not instantiate JSFunction DataSource due to invalid arguments", "error", this.toString());
        return;
    }
    else {
        this.dataFunction = oFunction;
        this._init();
        YAHOO.log("JS Function DataSource initialized","info",this.toString());
    }
};

YAHOO.widget.DS_JSFunction.prototype = new YAHOO.widget.DataSource();

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * In-memory Javascript function that returns query results.
 *
 * @property dataFunction
 * @type HTMLFunction
 */
YAHOO.widget.DS_JSFunction.prototype.dataFunction = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Queries the live data source defined by function for results. Results are
 * passed back to a callback function.
 *  
 * @method doQuery
 * @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 */
YAHOO.widget.DS_JSFunction.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var oFunction = this.dataFunction;
    var aResults = [];
    
    aResults = oFunction(sQuery);
    if(aResults === null) {
        this.dataErrorEvent.fire(this, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
        YAHOO.log(YAHOO.widget.DataSource.ERROR_DATANULL, "error", this.toString());
        return;
    }
    
    var resultObj = {};
    resultObj.query = decodeURIComponent(sQuery);
    resultObj.results = aResults;
    this._addCacheElem(resultObj);
    
    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
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
 * @class DS_JSArray
 * @constructor
 * @extends YAHOO.widget.DataSource
 * @param aData {String[]} In-memory Javascript array of simple string data.
 * @param oConfigs {Object} (optional) Object literal of config params.
 */
YAHOO.widget.DS_JSArray = function(aData, oConfigs) {
    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    if(!YAHOO.lang.isArray(aData)) {
        YAHOO.log("Could not instantiate JSArray DataSource due to invalid arguments", "error", this.toString());
        return;
    }
    else {
        this.data = aData;
        this._init();
        YAHOO.log("JS Array DataSource initialized","info",this.toString());
    }
};

YAHOO.widget.DS_JSArray.prototype = new YAHOO.widget.DataSource();

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * In-memory Javascript array of strings.
 *
 * @property data
 * @type Array
 */
YAHOO.widget.DS_JSArray.prototype.data = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Queries the live data source defined by data for results. Results are passed
 * back to a callback function.
 *
 * @method doQuery
 * @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
 * @param sQuery {String} Query string.
 * @param oParent {Object} The object instance that has requested data.
 */
YAHOO.widget.DS_JSArray.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    var i;
    var aData = this.data; // the array
    var aResults = []; // container for results
    var bMatchFound = false;
    var bMatchContains = this.queryMatchContains;
    if(sQuery) {
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
    
    this.getResultsEvent.fire(this, oParent, sQuery, aResults);
    oCallbackFn(sQuery, aResults, oParent);
};
