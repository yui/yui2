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
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) {
    YAHOO.widget.Logger.log(this._name, sMsg, sCategory);
};

/***************************************************************************
 * Private members
 ***************************************************************************/
YAHOO.widget.LogWriter.prototype._name = null;



