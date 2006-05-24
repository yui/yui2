/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/**
 * Class providing ability to log messages through YAHOO.widget.Logger from a
 * named source.
 *
 * @constructor
 * @param {string} sName Name of LogWriter instance
 */
YAHOO.widget.LogWriter = function(sName) {
    this._name = sName;
 };

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Logs a message attached to the name of the LogWriter.
 *
 * @param {string} sMsg The log message
 * @param {string} sCategory Category name
 */
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) {
    YAHOO.widget.Logger.log(sMsg, sCategory, this._name);
};

/***************************************************************************
 * Private members
 ***************************************************************************/
/**
 * Name of the log writer instance.
 *
 * @type string
 * @private
 */
YAHOO.widget.LogWriter.prototype._name = null;



