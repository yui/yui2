/**
 * @class an instance of a logwriter.  Expects to be initalized with a name.
 *
 * @constructor
 */
YAHOO.widget.LogWriter = function(sName) {
    this._name = sName;
 };

/***************************************************************************
 * Public methods
 ***************************************************************************/
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCateogory) {
    YAHOO.widget.Logger.log(this._name, sMsg, sCategory);
};

/***************************************************************************
 * Private members
 ***************************************************************************/
YAHOO.widget.LogWriter.prototype._name = null;



