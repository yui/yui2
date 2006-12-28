/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

 /**
 * The DataParser class enables widgets to consume responses in many types of data
 * formats.
 *
 * @class DataParser
 * @constructor
 */
YAHOO.widget.DataParser = function() {
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
 * @method parseResponse
 * @param sRequest {String} Request string
 * @param oRawResponse {Object} The raw response from the live database
 * @param oCallback {Function} Handler function to receive the response
 * @param oCaller {Object} The calling object that is making the request
 */
YAHOO.widget.DataParser.prototype.parseResponse = function(sRequest, oRawResponse, oCallback, oCaller) {
    //TODO: NEED DEFAULT AND CUSTOM IMPLEMENTATIONS
    //TODO: THIS IS PSEUDOCODE
    var oParsedResponse = oRawResponse.doStuff();

    // Cache the response before sending it back to the widget
    oDataSource.addToCache(oRequest, oParsedResponse);

    // The DataParser sends back the parsed response back to the caller
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
