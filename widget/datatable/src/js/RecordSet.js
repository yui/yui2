/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A RecordSet defines and manages a set of Records.
 *
 * @class RecordSet
 * @param data {Object || Object[]} An object literal or an array of data.
 * @constructor
 */
YAHOO.widget.RecordSet = function(data) {
    // Internal variables
    this._sName = "RecordSet instance" + YAHOO.widget.RecordSet._nCount;
    YAHOO.widget.RecordSet._nCount++;
    this._records = [];
    
    if(data) {
        if(YAHOO.lang.isArray(data)) {
            this.addRecords(data);
        }
        else if(data.constructor == Object) {
            this.addRecord(data);
        }
    }

    /**
     * Fired when a Record is updated with new data.
     *
     * @event recordUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     *
     */
    this.createEvent("recordUpdateEvent");
    
    /**
     * Fired when a Record field is updated with new data.
     *
     * @event fieldUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.field {String} The Record's field name.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     *
     */
    this.createEvent("fieldUpdateEvent");

    YAHOO.log("RecordSet initialized", "info", this.toString());
};

if(YAHOO.util.EventProvider) {
    YAHOO.augment(YAHOO.widget.RecordSet, YAHOO.util.EventProvider);
}
else {
    YAHOO.log("Missing dependency: YAHOO.util.EventProvider","error",this.toString());
}

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Internal class variable to name multiple Recordset instances.
 *
 * @property _nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.RecordSet._nCount = 0;

/**
 * Unique instance name.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.RecordSet.prototype._sName = null;

/**
 * Internal counter of how many Records are in the RecordSet.
 *
 * @property _length
 * @type Number
 * @private
 */
YAHOO.widget.RecordSet.prototype._length = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor to the unique name of the RecordSet instance.
 *
 * @method toString
 * @return {String} Unique name of the RecordSet instance.
 */
YAHOO.widget.RecordSet.prototype.toString = function() {
    return this._sName;
};

/**
 * Returns the number of Records held in the RecordSet.
 *
 * @method getLength
 * @return {Number} Number of records in the RecordSet.
 */
YAHOO.widget.RecordSet.prototype.getLength = function() {
        return this._length;
};

/**
 * Returns Record at given position index.
 *
 * @method getRecord
 * @param index {Number} Record's Recordset position index.
 * @return {YAHOO.widget.Record} Record object.
 */
YAHOO.widget.RecordSet.prototype.getRecord = function(index) {
    if(YAHOO.lang.isNumber(index)) {
        return this._records[index];
    }
    /*else if(YAHOO.lang.isString(identifier)) {
        for(var i=0; i<this._records.length; i++) {
            if(this._records[i].yuiRecordId == identifier) {
                return this._records[i];
            }
        }
    }*/
    return null;

};

/*
 * Returns an array of Records from the RecordSet.
 *
 * @method getRecords
 * @param index {Number} (optional) Recordset position index of which Record to
 * start at.
 * @param range {Number} (optional) Number of Records to get.
 * @return {YAHOO.widget.Record[]} Array of Records starting at given index and
 * length equal to given range. If index is not given, all Records are returned.
 */
YAHOO.widget.RecordSet.prototype.getRecords = function(index, range) {
    if(!YAHOO.lang.isNumber(index)) {
        return this._records;
    }
    if(!YAHOO.lang.isNumber(range)) {
        return this._records.slice(index);
    }
    return this._records.slice(index, index+range);
};

/**
 * Returns position index for the given Record.
 *
 * @method getRecordIndex
 * @param oRecord {YAHOO.widget.Record} Record instance.
 * @return {Number} Record's RecordSet position index.
 */

YAHOO.widget.RecordSet.prototype.getRecordIndex = function(oRecord) {
    for(var i=this._records.length-1; i>-1; i--) {
        if(oRecord.getId() === this._records[i].getId()) {
            return i;
        }
    }
    return null;

};

/*TODO: Removed from API doc
 * Returns the Record(s) with the given value at the given field name.
 *
 * @method getRecordBy
 * @param sField {String} Name of the field to search.
 * @param oValue {Object} to match against.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} Record or array of
 * Records with the given value at the given field name, or null.
 */
/*YAHOO.widget.RecordSet.prototype.getRecordBy = function(sField, oValue) {
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
 * Updates given Record with given data.
 *
 * @method updateRecord
 * @param record {YAHOO.widget.Record | Number} A Record instance, or Record's
 * RecordSet position index.
 * @param oData {Object) Object literal of new data.
 */
YAHOO.widget.RecordSet.prototype.updateRecord = function(record, oData) {
    var oRecord = null;
    if(YAHOO.lang.isNumber(record)) {
        oRecord = this._records[record];
    }
    else if(record instanceof YAHOO.widget.Record) {
        oRecord = record;
    }
    if(oRecord && oData && (oData.constructor == Object)) {
        var oldData = {};
        for(var key in oRecord) {
            oldData[key] = oRecord._oData[key];
        }
        oRecord._oData = oData;
        this.fireEvent("recordUpdateEvent",{record:oRecord,newData:oData,oldData:oldData});
    }
    else {
        YAHOO.log("Could not update Record " + record, "error", this.toString());
    }
};

/**
 * Updates given Record at given field name with given data.
 *
 * @method updateField
 * @param record {YAHOO.widget.Record | Number} A Record instance, or Record's
 * RecordSet position index.
 * @param sField {String} Field name.
 * @param oData {Object) New data.
 */
YAHOO.widget.RecordSet.prototype.updateField = function(record, sField, oData) {
    if(YAHOO.lang.isNumber(record)) {
        record = this._records[record];
    }
    if(record instanceof YAHOO.widget.Record) {
        // TODO: copy by value for non-primitives?
        var oldData = record._oData[sField];
        record._oData[sField] = oData;
        this.fireEvent("fieldUpdateEvent",{record:record,field:sField,newData:oData,oldData:oldData});
    }
    else {
        YAHOO.log("Could not update field due to invalid Record: " + record, "error", this.toString());
    }
};

/**
 * Adds one Record to the RecordSet at the given index. If index is null,
 * then adds the Record to the end of the RecordSet.
 *
 * @method addRecord
 * @param oData {Object} An object literal of data.
 * @param index {Number} (optional) Position index.
 * @return {YAHOO.widget.Record} A Record instance.
 */
YAHOO.widget.RecordSet.prototype.addRecord = function(oData, index) {
    if(oData && (oData.constructor == Object)) {
        var oRecord = new YAHOO.widget.Record(oData);
        if(YAHOO.lang.isNumber(index) && (index > -1)) {
            this._records.splice(index,0,oRecord);
        }
        else {
            this._records.push(oRecord);
        }
        this._length++;
        return oRecord;
    }
    else {
        return null;
    }
};

/**
 * Adds multiple Records to the RecordSet at the given index. If index is null,
 * then adds the Records to the end of the RecordSet.
 *
 * @method addRecords
 * @param aData {Object[]} An array of object literal data.
 * @param index {Number} (optional) Position index.
 * @return {YAHOO.widget.Record[]} An array of Record instances.
 */
YAHOO.widget.RecordSet.prototype.addRecords = function(aData, index) {
    if(YAHOO.lang.isArray(aData)) {
        var newRecords = [];
        // Can't go backwards bc we need to preserve order
        for(var i=0; i<aData.length; i++) {
            var record = this.addRecord(aData[i], index);
            newRecords.push(record);
       }
       return newRecords;
    }
    else {
        return this.addRecord(aData);
    }
};

/*TODO: remove
 * Convenience method to append the given data to the end of the RecordSet.
 *
 * @method append
 * @param data {Object || Object[]} An object literal or array of data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record or array of Records.
 */
/*YAHOO.widget.RecordSet.prototype.append = function(data) {
    if(YAHOO.lang.isArray(data)) {
        var newRecords = [];
        // Cant't go backwards bc we need to preserve order
        for(var i=0; i<data.length; i++) {
            var record = this.addRecord(data[i]);
            newRecords.push(record);
            
       }
       YAHOO.log("RecordSet appended with " + newRecords.length + " Record(s)","info",this.toString());
       return newRecords;
    }
    else if(data && (data.constructor == Object)) {
        YAHOO.log("RecordSet appended with 1 Record","info",this.toString());
        return this.addRecord(data);
    }
    else {
        return null;
    }
    
};*/

/**TODO: remove
 * Convenience method to insert the given data into the beginning of the RecordSet.
 *
 * @method insert
 * @param data {Object || Object[]} An object literal or array of data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record or array of Records.
 */
/*YAHOO.widget.RecordSet.prototype.insert = function(data) {
    if(YAHOO.lang.isArray(data)) {
        var newRecords = [];
        // Can't go backwards bc we need to preserve order
        for(var i=data.length-1; i>-1; i--) {
            var record = this.addRecord(data[i], 0);
            newRecords.push(record);
       }
       return newRecords;
    }
    else if(data && (data.constructor == Object)) {
        return this.addRecord(data, 0);
    }
    else {
        return null;
    }
};*/

/**
 * Replaces all Records in RecordSet with new data.
 *
 * @method replaceRecords
 * @param data {Object || Object[]} An object literal of data or an array of
 * object literal data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record instance or
 * an array of Records.
 */
YAHOO.widget.RecordSet.prototype.replaceRecords = function(data) {
    this.deleteAllRecords();
    return this.addRecords(data);
};

/**
 * Sorts all Records by given function.
 *
 * @method sortRecords
 * @param fnSort {Function} Reference to a sort function.
 * @return {YAHOO.widget.Record[]} Sorted array of Records.
 */
YAHOO.widget.RecordSet.prototype.sortRecords = function(fnSort) {
    return this._records.sort(fnSort);
};


/**
 * Removes the Record at the given position index from the RecordSet. If a range
 * is also provided, removes that many Records, starting from the index. Length
 * of RecordSet is correspondingly shortened.
 *
 * @method deleteRecord
 * @param index {Number} Record's RecordSet position index.
 * @param range {Number} (optional) How many Records to delete.
 */
YAHOO.widget.RecordSet.prototype.deleteRecord = function(index, range) {
    if(!YAHOO.lang.isNumber(range)) {
        range = 1;
    }
    if(YAHOO.lang.isNumber(index) && (index > -1)) {
        this._records.splice(index, range);
        this._length = this._length - range;
    }
    else {
        YAHOO.log("Could not delete Record due to invalid index");
    }
};

/**
 * Deletes all Records from the RecordSet.
 *
 * @method deleteAllRecords
 */
YAHOO.widget.RecordSet.prototype.deleteAllRecords = function() {
    this._records = [];
    this._length = 0;
};


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
    this._oData = {};
    if(oLiteral && (oLiteral.constructor == Object)) {
        for(var sKey in oLiteral) {
            this._oData[sKey] = oLiteral[sKey];
        }
        this._nId = YAHOO.widget.Record._nCount;
        YAHOO.widget.Record._nCount++;
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Internal class variable to give unique indexes to Record instances.
 *
 * @property _nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.Record._nCount = 0;

/**
 * Unique number assigned at instantation, indicates original order within
 * RecordSet.
 *
 * @property _nId
 * @type Number
 * @private
 */
YAHOO.widget.Record.prototype._nId = null;

/**
 * Holds data for the Record in an object literal.
 *
 * @property _oData
 * @type Object
 * @private
 */
YAHOO.widget.Record.prototype._oData = null;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Returns unique number assigned at instantation, indicates original order
 * within RecordSet.
 *
 * @method getId
 * @return Number
 */
YAHOO.widget.Record.prototype.getId = function() {
    return this._nId;
};

/**
 * Returns data for the Record for a field if given, or the entire object
 * literal otherwise.
 *
 * @method getData
 * @param sField {String} (Optional) The field name to retrive a single data value.
 * @return Object
 */
YAHOO.widget.Record.prototype.getData = function(sField) {
    if(YAHOO.lang.isString(sField)) {
        return this._oData[sField];
    }
    else {
        return this._oData;
    }
};

