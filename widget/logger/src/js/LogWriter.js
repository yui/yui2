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
    if(!sSource) {
        YAHOO.log("Could not instantiate LogWriter due to invalid source.", "error", "LogWriter");
        return;
    }
    this._source = sSource;
 };

/***************************************************************************
 * Public methods
 ***************************************************************************/
 /**
 * Public accessor to the unique name of the LogWriter instance.
 *
 * @return {string} Unique name of the LogWriter instance
 */
YAHOO.widget.LogWriter.prototype.toString = function() {
    return "LogWriter " + this._sSource;
};

/**
 * Logs a message attached to the source of the LogWriter.
 *
 * @param {string} sMsg The log message
 * @param {string} sCategory Category name
 */
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) {
    YAHOO.widget.Logger.log(sMsg, sCategory, this._source);
};

/**
 * Public accessor to get the source name.
 *
 * @return {string} The LogWriter source
 */
YAHOO.widget.LogWriter.prototype.getSource = function() {
    return this._sSource;
};

/**
 * Public accessor to set the source name.
 *
 * @param {string} sSource Source of LogWriter instance
 */
YAHOO.widget.LogWriter.prototype.setSource = function(sSource) {
    if(!sSource) {
        YAHOO.log("Could not set source due to invalid source.", "error", this.toString());
        return;
    }
    else {
        this._sSource = sSource;
    }
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



