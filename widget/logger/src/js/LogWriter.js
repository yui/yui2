/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/**
 * Class providing ability to log messages through YAHOO.widget.Logger from a
 * named source.
 *
 * @constructor
 * @param {string} sSource Source of LogWriter instance
 */
YAHOO.widget.LogWriter = function(sSource) {
    this._source = sSource;
 };

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Logs a message attached to the source of the LogWriter.
 *
 * @param {string} sMsg The log message
 * @param {string} sCategory Category name
 */
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) {
    YAHOO.widget.Logger.log(sMsg, sCategory, this._source);
};

/***************************************************************************
 * Private members
 ***************************************************************************/
/**
 * Source of the log writer instance.
 *
 * @type string
 * @private
 */
YAHOO.widget.LogWriter.prototype._source = null;



