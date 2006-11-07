/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The LogMsg class defines a single log message.
 *
 * @class LogMsg
 * @constructor
 * @param sMsg {String} Log message.
 * @param oConfigs {Object} Optional object literal of configuration params.
 */
 YAHOO.widget.LogMsg = function(sMsg, oConfigs) {
    this.msg = sMsg;
    
    // Parse configs
    if (typeof oConfigs == "object") {
        for(var param in oConfigs) {
            this[param] = oConfigs[param];
        }
    }
 };
 
/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Log message.
 *
 * @property msg
 * @type String
 */
YAHOO.widget.LogMsg.prototype.msg = null;
 
/**
 * Log timestamp.
 *
 * @property time
 * @type Date
 */
YAHOO.widget.LogMsg.prototype.time = null;

/**
 * Log category.
 *
 * @property category
 * @type String
 */
YAHOO.widget.LogMsg.prototype.category = null;

/**
 * Log source. The first word passed in as the source argument.
 *
 * @property source
 * @type String
 */
YAHOO.widget.LogMsg.prototype.source = null;

/**
 * Log source detail. The remainder of the string passed in as the source argument, not
 * including the first word (if any).
 *
 * @property sourceDetail
 * @type String
 */
YAHOO.widget.LogMsg.prototype.sourceDetail = null;

