/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * DataSource class description. Local in-memory data such as a JavaScript
 * array, a JavaScript function, or (coming soon) JSON.
 *
 * @class DataSource
 * @constructor
 * @param oLiveData {Object} Pointer to live data
 * @param oConfigs {object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource = function(oLiveData, oConfigs) {
    this.init(oLiveData, oConfigs);
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
 * Pointer to live data.
 *
 * @property oLiveData
 * @type Object
 */
YAHOO.widget.DataSource.prototype.oLiveData = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the data source instance.
 *
 * @method toString
 * @return {String} Unique name of the data source instance
 */
YAHOO.widget.DataSource.prototype.toString = function() {
    return "DataSource " + this._sName;
};

 /**
 * Initializes the DataSource instance.
 *
 * @method init
 * @param oLiveData {Object} Pointer to live data
 * @param oConfigs {object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource.prototype.init = function(oLiveData, oConfigs) {
    // Set any config params passed in to override defaults
    if (typeof oConfigs == "object") {
        for(var sConfig in oConfigs) {
            if (sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }

    if(!oLiveData) {
        YAHOO.log("Could not instantiate DataSource due to invalid live data.","error",this.toString());
        return;
    }
    else {
        this.oLiveData = oLiveData;
    }

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
 * @method getResponse
 * @param sRequest {String} Request string
 * @return {Object} Response object
 */
YAHOO.widget.DataSource.prototype.getResponse = function(sRequest) {
    // First look in cache
    var oResponse = this.getCachedResponse(sRequest);
    
    // Not in cache, so get results from server
    if(!oResponse) {
        this.requestEvent.fire(this, sRequest);
        oResponse = this.getLiveResponse(sRequest);
    }
    return oResponse;
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
    switch (this.oLiveData.constructor) {
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
    var aData = this.oLiveData;

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
    return this.oLiveData(sRequest);
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple data source instances.
 *
 * @property _nIndex
 * @type Number
 * @private
 */
YAHOO.widget.DataSource._nIndex = 0;

/**
 * Name of data source instance.
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
        var sUri = this.oLiveData+"?"+sRequest;
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
