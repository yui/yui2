/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A Recordset defines and manages a set of Records.
 *
 * @class Recordset
 * @param aObjectLiterals {Array} Array of data object literals.
 * @constructor
 */
YAHOO.widget.Recordset = function(aObjectLiterals) {
    // Internal variables
    this._nIndex = YAHOO.widget.Recordset._nCount;
    this._records = [];
    
    if(aObjectLiterals) {
        if(aObjectLiterals.constructor == Array) {
            this.addRecords(aObjectLiterals);
        }
        else {
            YAHOO.log("Could not instantiate Recordset due to an invalid data", "error", this.toString());
            return;
        }
    }
    
    YAHOO.widget.Recordset._nCount++;
    YAHOO.log("Recordset initialized", "info", this.toString());
};

YAHOO.augment(YAHOO.widget.Recordset, YAHOO.util.EventProvider);

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Internal class variable to index multiple data table instances.
 *
 * @property _nCount
 * @type number
 * @private
 * @static
 */
YAHOO.widget.Recordset._nCount = 0;

/**
 * Instance index.
 *
 * @property _nIndex
 * @type number
 * @private
 */
YAHOO.widget.Recordset.prototype._nIndex = null;

/**
 * Internal counter of how many records are in the Recordset
 *
 * @property _length
 * @private
 */
YAHOO.widget.Recordset.prototype._length = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Public accessor to the unique name of the Recordset instance.
 *
 * @method toString
 * @return {string} Unique name of the Recordset instance
 */
YAHOO.widget.Recordset.prototype.toString = function() {
    return "Recordset instance " + this._nIndex;
};

/**
 * Returns the number of non-null records in the sparse Recordset
 *
 * @method getLength
 * @return {Number} Number records in the Recordset
 */
YAHOO.widget.Recordset.prototype.getLength = function() {
        return this._length;
};

/**
 * Replaces entire Recordset with given new records.
 *
 * @method replaceAll
 * @param aNewRecords {Array} New array of records
 */
/*YAHOO.widget.Recordset.prototype.replaceAllRecords = function(aNewObjectLiteral) {
    this._init(aNewObjectLiterals);
};*/

/**
 * Returns record with given name, at the given index, or null.
 *
 * @method getRecord
 * @param identifier {String || Number} Record ID or record index
 * @return {Object} Record object
 */
YAHOO.widget.Recordset.prototype.getRecord = function(identifier) {
    if(identifier) {
        if(identifier.constructor == String) {
            for(var i=0; i<this._records.length; i++) {
                if(this._records[i].id == identifier) {
                    return this._records[i];
                }
            }
            return null;
        }
        else {
            return this._records[identifier];
        }
    }
    return null;
};

/**
 * Returns records from the recordset.
 *
 * @method getRecords
 * @param i {number} Index of which record to start at
 * @param range {number} (optional) Number of records to get
 * @return {Array} Array of records starting at given index and lenth equal to
 * given range. If range is null, entire Recordset array is returned.
 */
YAHOO.widget.Recordset.prototype.getRecords = function(i, range) {
    if(!i) {
        return this._records;
    }
    else if(!range) {
        //TODO: return all records from i until end
    }
    else {
        //TODO: return all records from i to range
    }
};

/**
 * Returns index for the given record.
 *
 * @method getRecordIndex
 * @param oRecord {object} Record object
 * @return {number} index
 */

/*YAHOO.widget.Recordset.prototype.getRecordIndex = function(oRecord) {
    //TODO: return i;
};*/

/**
 * Returns the record(2) with the given value at the given key.
 *
 * @method getRecordBy
 * @param sKey {String} Key to search.
 * @param oValue {Object} to match against.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} Record or array of
 * Records with the given value at the given key, or null.
 */
/*YAHOO.widget.Recordset.prototype.getRecordBy = function(sKey, oValue) {
     TODO: redo to match new algorithm
    var record = null;
    var length = this._records.length;
    for(var i=length-1; i>0; i--) {
        record = this._records[i];
        if(record && (record.extid == extId)) {
            return record;
        }
    }
    return null;

};*/

/**
 * Adds the given data to the Recordset at the given index as a Record. If index
 * is null, then adds the Record to the end of the Recordset.
 *
 * @method addRecord
 * @param oRecord {YAHOO.widget.Record} A Record.
 * @param i {Number} (optional) Record index.
 * @return {YAHOO.widget.Record} Record instance.
 */
YAHOO.widget.Recordset.prototype.addRecord = function(oObjectLiteral, i) {
    var oRecord = new YAHOO.widget.Record(oObjectLiteral);
    if(i) {
        this._records.splice(i,0,oRecord);
    }
    else {
        this._records.push(oRecord);
    }
    this._length++;
    return oRecord;
};

/**
 * Adds the given data to the Recordset at the given index as a Record. If index
 * is null, then adds Records to the end of the Recordset.
 *
 * @method addRecords
 * @param aRecords {Object[]} Array of data.
 * @return {YAHOO.widget.Record[]} Array of Records.
 */
YAHOO.widget.Recordset.prototype.addRecords = function(aObjectLiterals, i) {
    var newRecords = [];
    for(var i=aObjectLiterals.length-1; i>-1; i--) {
        newRecords.push(this.addRecord(aObjectLiterals[i], i));
   }
   return newRecords;
};

/**
 * Sorts Recordset by given function.
 *
 * @method sort
 * @param fnSort {Function} Reference to a sort function.
 * @return {Array} Sorted array of Records
 */
YAHOO.widget.Recordset.prototype.sort = function(fnSort) {
    return this._records.sort(fnSort);
};


/**
 * Replaces the record at the given index with the given record.
 *
 * @method updateRecord
 * @param i {Number} Record index
 * @param newRecord {Object} Record object to add
 */
/*YAHOO.widget.Recordset.prototype.replaceRecord = function(i, oRecord) {
    if(oRecord.constructor == YAHOO.widget.Record) {
        this._records[i] = oRecord;
    }
    else {
        YAHOO.log("Could not update Recordset at index " + i + " due to an invalid Record", "error", this.toString());
        return;
    }
};*/

/**
 * Removes the record at the given index from the Recordset. If a range is
 * given, starts at the given index and removes all records in the range.
 *
 * @method deleteRecord
 * @param i {Number} Record index
 * @param range {Number} (optional) Range of records to remove, or null.
 */
YAHOO.widget.Recordset.prototype.deleteRecord = function(i, range) {
    if(isNaN(range)) {
        range = 1;
    }
    this._records.splice(i, range);
    this._length = this._length - range;
};

/**
 * Removes all records from the recordset.
 *
 * @method reset
 */
/*YAHOO.widget.Recordset.prototype.reset = function(newObjectLiterals) {
    if(newObjectLiterals) {
        this._records = aNewRecords
        this._length = aNewRe
    }
    else {
        this._records = [];
        this._length = 0;
    }
};*/


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Record class defines a DataTable record.
 *
 * @class Record
 * @constructor
 * @param oConfigs {Object} (optional) Object literal of key/value pairs.
 */
YAHOO.widget.Record = function(oLiteral) {
    if(typeof oLiteral == "object") {
        for(var sKey in oLiteral) {
            if(sKey) {
                this[sKey] = oLiteral[sKey];
            }
        }
    }
    this.id = "yui-dtrec"+YAHOO.widget.Record._nCount;
    YAHOO.widget.Record._nCount++;
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple data table instances.
 *
 * @property _nCount
 * @type number
 * @private
 * @static
 */
YAHOO.widget.Record._nCount = 0;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Unique name assigned at instantation, indicates original order.
 *
 * @property id
 * @type string
 */
YAHOO.widget.Record.prototype.id = null;
