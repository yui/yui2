/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The DataDriver class enables widgets to make requests to many different types of
 * databases.
 *
 * @class DataDriver
 * @constructor
 */
YAHOO.widget.DataDriver = function() {
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
YAHOO.widget.DataDriver.prototype.makeConnection = function(sRequest, oCallback, oCaller, oDataSource) {
    //TODO: CLEAN UP DEFAULTS TO ENABLE ELEGANT CUSTOMIZATIONS
    var oRawResponse = null;
    if(oDataSource.livedata.constructor == Function) {
        oRawResponse = oDataSource.livedata(sRequest);
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
                // The DataDriver forwards the raw response to the DataParser...
                if(oDataSource.dataparser) {
                    oDataSource.dataparser.parseResponse(sRequest, oResp, oCallback, oCaller);
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
        // The DataDriver forwards the raw response to the DataParser...
        if(oDataSource.dataparser) {
            oDataSource.dataparser.parseResponse(sRequest, oRawResponse, oCallback, oCaller);
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

