/**
 * @class an instance of a logwriter.  Expects to be initalized with a name.
 *
 * @constructor
 */
YAHOO.widget.Logwriter = function(sName) {
    this._name = sName;
 };
 
YAHOO.widget.Logwriter.prototype._name = null;

YAHOO.widget.Logwriter.prototype.log = function(sMsg, sType) {
    YAHOO.widget.Logger.log(this._name, sMsg, sType);
}



