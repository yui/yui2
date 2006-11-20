/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The DataSource class wraps a live database and the Driver and Parser classes
 * needed to interact with it. Examples of live databases include in-memory
 * local data such as a JavaScript array, a JavaScript function, or JSON, or
 * remote data such as data retrieved through an XHR connection.
 *
 * @class DataSource
 * @constructor
 * @param oLiveData {Object} Pointer to live database
 * @param oDriver {Object} Driver object makes connections to the live database
 * @param oParser {Object} Parser object handles the response
 * @param oConfigs {Object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource = function(oLiveData, oDriver, oParser, oConfigs) {
    this.init(oLiveData, oDriver, oParser, oConfigs);
};

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Error message for invalid data responses.
 *
 * @property ERROR_DATAINVALID
 * @type String
 * @final
 */
YAHOO.widget.DataSource.ERROR_DATAINVALID = "Response was invalid";

/**
 * Error message for null data responses.
 *
 * @property ERROR_DATANULL
 * @type String
 * @final
 */
YAHOO.widget.DataSource.ERROR_DATANULL = "Response was null";

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
 * @default 0
 */
YAHOO.widget.DataSource.prototype.maxCacheEntries = 0;

 /**
 * Pointer to live database.
 *
 * @property liveData
 * @type Object
 */
YAHOO.widget.DataSource.prototype.livedata = null;

 /**
 * Pointer to Driver object.
 *
 * @property driver
 * @type Object
 */
YAHOO.widget.DataSource.prototype.driver = null;

 /**
 * Pointer to Parser object.
 *
 * @property parser
 * @type Object
 */
YAHOO.widget.DataSource.prototype.parser = null;

 /**
 * Default request if one is not provided at runtime.
 *
 * @property defaultRequest
 * @type String
 * @default ""
 */
YAHOO.widget.DataSource.prototype.defaultRequest = "";
/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the DataSource instance.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance.
 */
YAHOO.widget.DataSource.prototype.toString = function() {
    return "DataSource " + this._sName;
};

 /**
 * Initializes the DataSource instance.
 *
 * @method init
 * @param oLiveData {Object} Pointer to live database
 * @param oDriver {Object} Driver object makes connections to the live database
 * @param oParser {Object} Parser object handles the response
 * @param oConfigs {Object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource.prototype.init = function(oLiveData, oDriver, oParser, oConfigs) {
    // Set any config params passed in to override defaults
    if(typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            if (sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }

    if(!oLiveData) {
        YAHOO.log("Could not instantiate DataSource due to invalid live database.","error",this.toString());
        return;
    }
    else {
        this.livedata = oLiveData;
    }

    if(!oDriver) {
        YAHOO.log("Could not instantiate DataSource due to invalid driver.","error",this.toString());
        return;
    }
    else {
        this.driver = oDriver;
    }
    this.parser = oParser;

    // Validate and initialize public configs
    var maxCacheEntries = this.maxCacheEntries;
    if(isNaN(maxCacheEntries) || (maxCacheEntries < 0)) {
        maxCacheEntries = 0;
    }

    // Initialize local cache
    if(maxCacheEntries > 0 && !this._aCache) {
        this._aCache = [];
    }

    this._sName = "instance" + YAHOO.widget.DataSource._nIndex;
    YAHOO.widget.DataSource._nIndex++;

    // Create custom events
    this.requestEvent = new YAHOO.util.CustomEvent("request", this);
    this.cacheRequestEvent = new YAHOO.util.CustomEvent("cacheRequest", this);
    this.getResponseEvent = new YAHOO.util.CustomEvent("getResponse", this);
    this.getCachedResponseEvent = new YAHOO.util.CustomEvent("getCachedResponse", this);
    this.dataErrorEvent = new YAHOO.util.CustomEvent("dataError", this);
    this.dataNullEvent = new YAHOO.util.CustomEvent("dataNull", this);
    this.cacheFlushEvent = new YAHOO.util.CustomEvent("cacheFlush", this);
};

 /**
 * First looks for cached response, then sends request to live data and returns
 * response.
 *
 * @method sendRequest
 * @param sRequest {String} Request string
 * @param oCallback {Function} Handler function to receive the response
 * @param oCaller {Object} The Calling object that is making the request
 */
YAHOO.widget.DataSource.prototype.sendRequest = function(sRequest, oCallback, oCaller) {
    // First look in cache
    var oCachedResponse = this.getCachedResponse(sRequest);
    if(oCachedResponse) {
        oCallback(sRequest, oCachedResponse, oCaller);
        return;
    }
    
    // Not in cache, so make connection to live database through the driver
    this.requestEvent.fire(this, sRequest, oCallback, oCaller);
    this.driver.makeConnection(sRequest, oCallback, oCaller, this);
};

 /**
 * Overridable method passes request to cache and returns cached response if any,
 * refreshing the hit in the cache as the newest item. Returns null if there is
 * no cache hit.
 *
 * @method getCachedResponse
 * @param sRequest {String} Request string.
 * @return {Object} Cached response object or null.
 */
YAHOO.widget.DataSource.prototype.getCachedResponse = function(sRequest) {
    var aCache = this._aCache;
    var nCacheLength = (aCache) ? aCache.length : 0;
    var oResponse = null;

    // If cache is enabled...
    if((this.maxCacheEntries > 0) && aCache && (nCacheLength > 0)) {
        this.cacheRequestEvent.fire(this, sRequest);

        // Loop through each cached element
        for(var i = nCacheLength-1; i >= 0; i--) {
            var oCacheElem = aCache[i];

            // Defer cache hit logic to a public overridable method
            if(this.isCacheHit(sRequest,oCacheElem.request)) {
                // The cache returned a hit!
                // Remove element from its original location
                aCache.splice(i,1);
                // Add as newest
                this.addToCache(sRequest, oResponse);
                this.getCachedResponseEvent.fire(this, sRequest, oResponse);
                break;
            }
        }
    }
    return oResponse;
};

 /**
 * Default overridable method matches given request to given cached request.
 * Returns true if is a hit, returns false otherwise.  Implementers should
 * override this method to customize the cache-matching algorithm.
 *
 * @method isCacheHit
 * @param sRequest {String} Request string.
 * @param sCachedRequest {String} Cached request string.
 * @return {Boolean} True if given request matches cached request, false otherwise.
 */
YAHOO.widget.DataSource.prototype.isCacheHit = function(sRequest, sCachedRequest) {
    return (sRequest === sCachedRequest);
};

 /**
 * Adds a new item to the cache. If cache is full, evicts the stalest item
 * before adding the new item.
 *
 * @method addToCache
 * @param sRequest {String} Request string.
 * @param oResponse {Object} Response object to cache.
 */
YAHOO.widget.DataSource.prototype.addToCache = function(sRequest, oResponse) {
    //TODO: check for duplicate entries
    var aCache = this._aCache;
    // Don't add if anything important is missing.
    if(!aCache || !sRequest || !oResponse) {
        return;
    }

    // If the cache is full, make room by removing stalest element (index=0)
    while(aCache.length >= this.maxCacheEntries) {
        aCache.shift();
    }

    // Add to cache in the newest position, at the end of the array
    var oCacheElem = {request:sRequest,response:oResponse};
    aCache.push(oCacheElem);
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
    this.cacheFlushEvent.fire(this);
};

 /**
 * Default overridable method passes request to live data and returns the
 * response. If the cache is enabled, any non-null response will get cached.
 * Implementers can override this method for fully customized response algorithms.
 *
 * @method getLiveResponse
 * @param sRequest {String} Request string.
 * @return {Object} Response object from live data.
 */
YAHOO.widget.DataSource.prototype.getLiveResponse = function(sRequest) {
    var oResponse = null;
    switch (this.livedata.constructor) {
        // Live data a JavaScript array
        case Array:
            oResponse = this.getArrayResponse(sRequest);
            break;
        // Live data is a JavaScript function
        case Function:
            oResponse = this.getFunctionResponse(sRequest);
            break;
        // Live data is JSON
        //TODO: case Object:
        //TODO:     return this.getJsonResponse(sRequest);
        // Unknown
        default:
            YAHOO.log("Request could not be handled due to unknown live data type.", "error", this.toString());
            break;
    }

    if(oResponse === null) {
        var sMsg = YAHOO.widget.DataSource.ERROR_DATANULL;
        this.dataNullEvent.fire(this, sRequest, sMsg);
        YAHOO.log(sMsg, "warn", this.toString());
        return null;
    }
    else {
        this.addToCache(sRequest, oResponse);
        this.getResponseEvent.fire(this, sRequest, oResponse);
        return oResponse;
    }
};

 /**
 * Default overridable method matches given request to elements in the live
 * data array. Returns an array of hits. If the request is empty or null,
 * the entire live array will be returned. Implementers should
 * override this method to customize the algorithm.
 *
 * @method getArrayResponse
 * @param sRequest {String} Request string.
 * @return {Object} Response object.
 */
YAHOO.widget.DataSource.prototype.getArrayResponse = function(sRequest) {
    var aData = this.livedata;

    // TODO: make this feature configurable
    if(!sRequest || (sRequest == "")) {
        return aData;
    }

    var oResponse = [];
    for(var i=0; i<aData.length; i++) {
        var oDatum = aData[i];
        if(this.isArrayHit(sRequest, oDatum)) {
            oResponse.unshift(oDatum);
        }
    }
    return oResponse;
};

 /**
 * Default overridable method matches given request to given array element.
 * Returns true if is a hit, returns false otherwise.  Implementers should
 * override this method to customize the array-matching algorithm.
 *
 * @method isArrayHit
 * @param sRequest {String} Request string.
 * @param oDatum {Object} Array element.
 * @return {Boolean} True if given request matches array element, false otherwise.
 */
YAHOO.widget.DataSource.prototype.isArrayHit = function(sRequest, oDatum) {
    if(oDatum.constructor == String) {
        //TODO: case sensitivity
        return (this.isCaseSensitive) ? (sRequest === oDatum) : (sRequest.toLowerCase() === oDatum.toLowerCase);
    }
    else {
        YAHOO.log("Implementer should override isArrayHit() method for more complex arrays","warn",this.toString());
        return false;
    }
    //TODO: support arrays of arrays
    //TODO: support arrays of objects
};

 /**
 * Default overridable method passes given request to the live data function and
 * returns the response. Implementers should override this method to customize
 * the algorithm.
 *
 * @method getFunctionResponse
 * @param sRequest {String} Request string.
 * @return {Object} Response object.
 */
YAHOO.widget.DataSource.prototype.getFunctionResponse = function(sRequest) {
    return this.livedata(sRequest);
};

/////////////////////////////////////////////////////////////////////////////
//
// Public events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fired when a request is made to the live data source.
 *
 * @event requestEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oCaller {Object} The calling object.
 * @param sRequest {String} The request string.
 */
YAHOO.widget.DataSource.prototype.requestEvent = null;

/**
 * Fired when a request is made to the local cache.
 *
 * @event cacheRequestEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oCaller {Object} The requesting object.
 * @param sRequest {String} The request string.
 */
YAHOO.widget.DataSource.prototype.cacheRequestEvent = null;

/**
 * Fired when response is received from the live data source.
 *
 * @event getResponseEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oCaller {Object} The calling object.
 * @param sRequest {String} The request string.
 * @param oRawResponse {Object} Raw (unparsed) response.
 */
YAHOO.widget.DataSource.prototype.getResponseEvent = null;

/**
 * Fired when data is retrieved from the local cache.
 *
 * @event getCachedResponseEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oCaller {Object} The calling object.
 * @param sRequest {String} The request string.
 * @param oCachedResponse {Object} Cached response (may or may not be parsed).
 */
YAHOO.widget.DataSource.prototype.getCachedResponseEvent = null;

/**
 * Fired when an error is encountered with the live data source.
 *
 * @event dataErrorEvent
 * @param oSelf {Object} The DataSource instance.
 * @param oCaller {Object} The calling object.
 * @param sRequest {String} The request string.
 * @param sMsg {String} Error message string.
 */
YAHOO.widget.DataSource.prototype.dataErrorEvent = null;

/**
 * Fired when the local cache is flushed.
 *
 * @event cacheFlushEvent
 * @param oSelf {Object} The DataSource instance.
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
 * @type array
 * @private
 */
YAHOO.widget.DataSource.prototype._aCache = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * XHR DataSource class description. Remote data accessed asynchronously over
 * XHR using the YUI Connection Manager utility.
 *
 * @class XHRDataSource
 * @constructor
 * @param oLiveData {Object} String URI pointer to live data.
 * @param oConfigs {Object} (optional) Object literal of configuration values
 */
YAHOO.widget.XHRDataSource = function(oLiveData, oConfigs) {
    this.init(oLiveData,oConfigs);
};

YAHOO.extend(YAHOO.widget.XHRDataSource, YAHOO.widget.DataSource);

 /**
 * First looks for cached response, then sends asynchronous request to live
 * data. Returns response to the given oHandler function defined in the oCaller.
 *
 * @method getResponse
 * @param sRequest {String} Request string.
 * @param oHandler {Function} Function handler that will receive the
 * asynchronous response.
 * @param oCaller {Object} Parent class where the oHandler function is defined.
 * @return {Object} Response object.
 */
YAHOO.widget.XHRDataSource.prototype.getResponse = function(sRequest, oHandler, oCaller) {
    // First look in cache
    var oResponse = this.getCachedResponse(sRequest);

    // Not in cache, so get results from server
    if(!oResponse) {
        var sUri = this.livedata+"?"+sRequest;
        var oSelf = this;

        /**
         * Sets up ajax request callback
         *
         * @param oReq {object} HTTPXMLRequest object
         * @private
         */
        var responseSuccess = function(oResp) {
            // Response ID does not match last made request ID.
            if(!oSelf._oConn || (oResp.tId != oSelf._oConn.tId)) {
                oSelf.dataErrorEvent.fire(oSelf, sRequest, YAHOO.widget.DataSource.ERROR_DATAINVALID);
                YAHOO.log(YAHOO.widget.DataSource.ERROR_DATAINVALID, "error", oSelf.toString());
                return null;
            }
            // TODO: is a null response possible?
            if(oResp === null) {
                oSelf.dataErrorEvent.fire(oSelf, oCaller, sQuery, oSelf.ERROR_DATANULL);
                YAHOO.log(YAHOO.widget.DataSource.ERROR_DATANULL, "error", oSelf.toString());
                return null;
            }

            oHandler(sRequest,oResp,oCaller);
        };

        var responseFailure = function(oResp) {
            oSelf.dataErrorEvent.fire(oSelf, oCaller, sQuery, oSelf.ERROR_DATAXHR);
            YAHOO.log(oSelf.ERROR_DATAXHR + ": " + oResp.statusText, "error", oSelf.toString());
            return null;
        };

        var oCallback = {
            success:responseSuccess,
            failure:responseFailure,
            scope: oCaller
        };

        //TODO: connTimeout config
        if(!isNaN(this.connTimeout) && this.connTimeout > 0) {
            oCallback.timeout = this.connTimeout;
        }

        //TODO: oConn config
        if(this._oConn) {
            YAHOO.util.Connect.abort(this._oConn);
        }

        this.requestEvent.fire(this, sRequest);
        this._oConn = YAHOO.util.Connect.asyncRequest("GET", sUri, oCallback, null);
    }
    else {
        oHandler(sRequest,oResponse,oCaller);
    }
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The Driver class enables widgets to make requests to many different types of
 * databases.
 *
 * @class Driver
 * @constructor
 */
YAHOO.widget.Driver = function() {
};

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Makes a connection to a live database in order to senda request and receive
 * a response.
 *
 * @method makeConnection
 * @param sRequest {String} Request string
 * @param oCallback {Function} Handler function to receive the response
 * @param oCaller {Object} The calling object that is making the request
 * @param oDataSource {Object} The DataSource object
 */
YAHOO.widget.Driver.prototype.makeConnection = function(sRequest, oCallback, oCaller, oDataSource) {
    //TODO: CLEAN UP DEFAULTS TO ENABLE ELEGANT CUSTOMIZATIONS
    var oRawResponse = null;
    if(oDataSource.livedata.constructor == Function) {
        oRawResponse = oDataSource.livedata.getResponse(sRequest);
    }
    else if(oDataSource.livedata.constructor == Array) {
        if(sRequest && (sRequest.length > 0)) {
            //TODO: some default algorithm here
        }
        else {
            oRawResponse = oDataSource.livedata;
        }
    }
    else if (oDataSource.livedata.constructor == String) {
        var sUri = oDataSource.livedata+"?"+sRequest;
        var oSelf = this;

        /**
         * Sets up ajax request callback
         *
         * @param oReq {object} HTTPXMLRequest object
         * @private
         */
        var responseSuccess = function(oResp) {
            // Response ID does not match last made request ID.
            if(!oSelf._oConn || (oResp.tId != oSelf._oConn.tId)) {
                //TODO: oSelf.dataErrorEvent.fire(oSelf, sRequest, YAHOO.widget.DataSource.ERROR_DATAINVALID);
                //TODO: YAHOO.log(YAHOO.widget.DataSource.ERROR_DATAINVALID, "error", oSelf.toString());
                return null;
            }
            // TODO: is a null response possible?
            if(oResp === null) {
                //TODO: oSelf.dataErrorEvent.fire(oSelf, oCaller, sQuery, oSelf.ERROR_DATANULL);
                //TODO: YAHOO.log(YAHOO.widget.DataSource.ERROR_DATANULL, "error", oSelf.toString());
                return null;
            }

            if(oResp) {
                // The driver forwards the raw response to the parser...
                if(oDataSource.parser) {
                    oDataSource.parser.parseResponse(sRequest, oResp, oCallback, oCaller);
                }
                // ...or else sends the raw response directly back to the caller
                else {
                    // Cache the response first
                    oDataSource.addToCache(sRequest, oResp);
                    oCallback(sRequest, oResp, oCaller);
                }
            }
        };

        var responseFailure = function(oResp) {
            //TODO: oSelf.dataErrorEvent.fire(oSelf, oCaller, sQuery, oSelf.ERROR_DATAXHR);
            //TODO: YAHOO.log(oSelf.ERROR_DATAXHR + ": " + oResp.statusText, "error", oSelf.toString());
            return null;
        };

        var oConnCallback = {
            success:responseSuccess,
            failure:responseFailure,
            scope: oCaller
        };

        //TODO: connTimeout config
        if(!isNaN(this.connTimeout) && this.connTimeout > 0) {
            oCallback.timeout = this.connTimeout;
        }

        //TODO: oConn config
        if(this._oConn) {
            YAHOO.util.Connect.abort(this._oConn);
        }

        //TODO: this.makeConnectionEvent.fire(this, sRequest, oCallback, oCaller);
        this._oConn = YAHOO.util.Connect.asyncRequest("GET", sUri, oConnCallback, null);
    }
    
    if(oRawResponse) {
        // The driver forwards the raw response to the parser...
        if(oDataSource.parser) {
            oDataSource.parser.parseResponse(sRequest, oRawResponse, oCallback, oCaller);
        }
        // ...or else sends the raw response directly back to the caller
        else {
            // Cache the response first
            oDataSource.addToCache(sRequest, oRawResponse);
            oCallback(sRequest, oRawResponse, oCaller);
        }
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property _memberName
 * @type Type
 * @private
 */
//YAHOO.widget.ClassName.prototype._memberName = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property _methodName
 * @param oParam {Type} Description
 * @private
 */
//YAHOO.widget.ClassName._methodName = null;

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The Parser class enables widgets to consume responses in many types of data
 * formats.
 *
 * @class Parser
 * @constructor
 */
YAHOO.widget.Parser = function() {
};

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property CONSTANT
 * @type Type
 * @final
 */
//YAHOO.widget.ClassName.CONSTANT = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property propName
 * @type Type
 * @default null
 */
//YAHOO.widget.ClassName.prototype.propName = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Makes a connection to a live database in order to senda request and receive
 * a response.
 *
 * @method parserResponse
 * @param sRequest {String} Request string
 * @param oRawResponse {Object} The raw response from the live database
 * @param oCallback {Function} Handler function to receive the response
 * @param oCaller {Object} The calling object that is making the request
 */
YAHOO.widget.Parser.prototype.parseResponse = function(sRequest, oRawResponse, oCallback, oCaller) {
    //TODO: NEED DEFAULT AND CUSTOM IMPLEMENTATIONS
    //TODO: THIS IS PSEUDOCODE
    var oParsedResponse = oRawResponse.doStuff();
    
    // Cache the response before sending it back to the widget
    oDataSource.addToCache(oRequest, oParsedResponse);
    
    // The parser sends back the parsed response back to the caller
    oCallback(sRequest, oParsedResponse, oCaller);
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property _memberName
 * @type Type
 * @private
 */
//YAHOO.widget.ClassName.prototype._memberName = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Description.
 *
 * @property _methodName
 * @param oParam {Type} Description
 * @private
 */
//YAHOO.widget.ClassName._methodName = null;
