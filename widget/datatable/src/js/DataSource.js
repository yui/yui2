/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The DataSource class wraps a live database and the DataDriver and DataParser classes
 * needed to interact with it. Examples of live databases include in-memory
 * local data such as a JavaScript array, a JavaScript function, or JSON, or
 * remote data such as data retrieved through an XHR connection.
 *
 * @class DataSource
 * @constructor
 * @param oLiveData {Object} Pointer to live database
 * @param oDataDriver {Object} DataDriver object makes connections to the live database
 * @param oDataParser {Object} DataParser object handles the response
 * @param oConfigs {Object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource = function(oLiveData, oDataDriver, oDataParser, oConfigs) {
    //TODO: provide default driver and parser if none provided
    this.init(oLiveData, oDataDriver, oDataParser, oConfigs);
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
 * Pointer to DataDriver object.
 *
 * @property datadriver
 * @type Object
 */
YAHOO.widget.DataSource.prototype.datadriver = null;

 /**
 * Pointer to DataParser object.
 *
 * @property dataparser
 * @type Object
 */
YAHOO.widget.DataSource.prototype.dataparser = null;

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
 * @param oDataDriver {Object} DataDriver object makes connections to the live database
 * @param oDataParser {Object} DataParser object handles the response
 * @param oConfigs {Object} (optional) Object literal of configuration values
 */
YAHOO.widget.DataSource.prototype.init = function(oLiveData, oDataDriver, oDataParser, oConfigs) {
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

    if(!oDataDriver) {
        YAHOO.log("Could not instantiate DataSource due to invalid DataDriver.","error",this.toString());
        return;
    }
    else {
        this.datadriver = oDataDriver;
    }
    this.dataparser = oDataParser;

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
    
    // Not in cache, so make connection to live database through the DataDriver
    this.requestEvent.fire(this, sRequest, oCallback, oCaller);
    this.datadriver.makeConnection(sRequest, oCallback, oCaller, this);
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

