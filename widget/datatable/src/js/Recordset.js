/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A generic data model class is a sparsely populated JavaScript array of uniquely
 * identifiable records.
 *
 * @class Recordset
 * @constructor
 */
YAHOO.widget.Recordset = function(aRecords, oColumnset) {
//TODO: account for zero records?
//TODO: internal index?
    this._records = [];
    this.addRecords(aRecords, oColumnset);
};

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Adds records to the end of the Recordset.
 *
 * @method addRecords
 * @param aRecords {Array}
 * @param oColumnset {Object}
 */
YAHOO.widget.Recordset.prototype.addRecords = function(aRecords, oColumnset) {
    //TODO: anything else to validate record?
    for(var i=0; i<aRecords.length; i++) {
        var record = aRecords[i];
        var oRecord = {};
        if(record.constructor == Array) {
            for(var j=0; j<oColumnset.columns.length; j++) {
                oRecord[oColumnset.columns[j].key] = record[j];
            }
        }
        else oRecord = record;
        this.addRecord(oRecord);
   }
};

/**
 * Adds the given record to the Recordset at the given index. If index is null,
 * then adds the record to the end of the Recordset.
 *
 * @method addRecord
 * @param oRecord {Object}
 * @param oColumn {Object}
 * @param i {Number} (optional) Record index
 */
YAHOO.widget.Recordset.prototype.addRecord = function(oRecord, i) {
    //TODO: anything else to validate record?
    if(oRecord) {
        if(i) {
            this._records.splice(i,0,oRecord);
        }
        else {
            this._records.push(oRecord);
        }
    }
    else {
        //could not add invalid record
    }
};

/**
 * Returns the number of non-null records in the sparse Recordset
 *
 * @method getCount
 * @return {Number} Number of non-null records in the sparse Recordset
 */
YAHOO.widget.Recordset.prototype.getCount = function() {
        return this._count;
};

/**
 * Returns the record with the given ID
 *
 * @method getRecordById
 * @param id {String} Record ID.
 * @return {Object} Record with given ID, or null.
 */
YAHOO.widget.Recordset.prototype.getRecordById = function(id) {
    var record = null;
    var length = this._records.length;
    for(var i=length-1; i>0; i--) {
        record = this._records[i];
        if(record && (record.id == id)) {
            return record;
        }
    }
    return null;
};

/**
 * Updates the record at the given index with the given record.
 *
 * @method updateRecord
 * @param i {Number} Record index
 * @param newRecord {Object} Record object to add
 */
YAHOO.widget.Recordset.prototype.updateRecord = function(i, newRecord) {
    this._records[i] = newRecord;
};

/**
 * Removes the record at the given index from the Recordset. If a range is
 * given, starts at the given index and removes all records in the range.
 *
 * @method removeRecord
 * @param i {Number} Record index
 * @param range {Number} (optional) Range of records to remove, or null.
 */
YAHOO.widget.Recordset.prototype.removeRecord = function(i, range) {
    if(isNaN(range)) {
        range = 1;
    }
    this._records.splice(i, range);
    this._count = this._count - range;
};

/**
 * Returns record at the given index, or null.
 *
 * @method getRecord
 * @param i {Number} Record index
 * @return {Object} Record object
 */
YAHOO.widget.Recordset.prototype.getRecord = function(i) {
    return this._records[i];
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

YAHOO.widget.Recordset.prototype.getRecordIndex = function(oRecord) {
    //TODO: return i;
};

/**
 * Removes all records from the recordset.
 *
 * @method reset
 */
YAHOO.widget.Recordset.prototype.reset = function() {
    this._records = [];
    this._count = 0;
};

/**
 * Replaces entire Recordset array with given array of records.
 *
 * @method replace
 * @param aNewRecords {Array} New array of records
 */
YAHOO.widget.Recordset.prototype.replace = function(aNewRecords) {
    this._records = aNewRecords;
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal counter of how many records are in the Recordset
 *
 * @property _count
 * @private
 */
YAHOO.widget.Recordset.prototype._count = 0;

