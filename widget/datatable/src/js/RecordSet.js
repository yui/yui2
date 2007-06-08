/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A RecordSet defines and manages a set of Records.
 *
 * @namespace YAHOO.widget
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
     * Fired when a new Record is added to the RecordSet.
     *
     * @event recordAddEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.data {Object} Data added.
     */
    this.createEvent("recordAddEvent");

    /**
     * Fired when multiple Records are added to the RecordSet at once.
     *
     * @event recordAddEvent
     * @param oArgs.records {YAHOO.widget.Record[]} An array of Record instances.
     * @param oArgs.data {Object[]} Data added.
     */
    this.createEvent("recordsAddEvent");

    /**
     * Fired when a Record is updated with new data.
     *
     * @event recordUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     */
    this.createEvent("recordUpdateEvent");
    
    /**
     * Fired when a Record is deleted from the RecordSet.
     *
     * @event recordDeleteEvent
     * @param oArgs.data {Object} A copy of the data held by the Record,
     * or an array of data object literals if multiple Records were deleted at once.
     * @param oArgs.index {Object} Index of the deleted Record.
     */
    this.createEvent("recordDeleteEvent");

    /**
     * Fired when multiple Records are deleted from the RecordSet at once.
     *
     * @event recordsDeleteEvent
     * @param oArgs.data {Object[]} An array of data object literals copied
     * from the Records.
     * @param oArgs.index {Object} Index of the first deleted Record.
     */
    this.createEvent("recordsDeleteEvent");
    
    /**
     * Fired when all Records are deleted from the RecordSet at once.
     *
     * @event resetEvent
     */
    this.createEvent("resetEvent");

    /**
     * Fired when a Record Key is updated with new data.
     *
     * @event keyUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.key {String} The updated key.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     *
     */
    this.createEvent("keyUpdateEvent");

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
 * Internal variable to give unique indexes to Record instances.
 *
 * @property _nCount
 * @type Number
 * @private
 */
YAHOO.widget.RecordSet.prototype._nRecordCount = 0;

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

/**
 * Adds one Record to the RecordSet at the given index. If index is null,
 * then adds the Record to the end of the RecordSet.
 *
 * @method _addRecord
 * @param oData {Object} An object literal of data.
 * @param index {Number} (optional) Position index.
 * @return {YAHOO.widget.Record} A Record instance.
 * @private
 */
YAHOO.widget.RecordSet.prototype._addRecord = function(oData, index) {
    var oRecord = new YAHOO.widget.Record(oData);
    oRecord._nId = this._nRecordCount;
    this._nRecordCount++;
    
    if(YAHOO.lang.isNumber(index) && (index > -1)) {
        this._records.splice(index,0,oRecord);
    }
    else {
        index = this.getLength();
        this._records.push(oRecord);
    }
    this._length++;
    return oRecord;
};

/**
 * Deletes Records from the RecordSet at the given index. If range is null,
 * then only one Record is deleted.
 *
 * @method _deleteRecord
 * @param index {Number} Position index.
 * @param range {Number} (optional) How many Records to delete
 * @private
 */
YAHOO.widget.RecordSet.prototype._deleteRecord = function(index, range) {
    if(!YAHOO.lang.isNumber(range) || (range < 0)) {
        range = 1;
    }
    this._records.splice(index, range);
    this._length = this._length - range;
};

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
 * Returns the Record(s) with the given value at the given key.
 *
 * @method getRecordBy
 * @param sKey {String} Name of the key to search.
 * @param oValue {Object} to match against.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} Record or array of
 * Records with the given value at the given key, or null.
 */
/*YAHOO.widget.RecordSet.prototype.getRecordBy = function(sKey, oValue) {
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
        var oRecord = this._addRecord(oData, index);
        this.fireEvent("recordAddEvent",{record:oRecord,data:oData});
        YAHOO.log("Added Record at index " + index +
                " with data " + YAHOO.lang.dump(oData), "info", this.toString());
        return oRecord;
    }
    else {
        YAHOO.log("Could not add Record with data" +
                YAHOO.lang.dump(oData), "info", this.toString());
        return null;
    }
};

/**
 * Adds multiple Records at once to the RecordSet at the given index with the
 * given data. If index is null, then the new Records are added to the end of
 * the RecordSet.
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
            if(aData[i] && (aData[i].constructor == Object)) {
                var record = this._addRecord(aData[i], index);
                newRecords.push(record);
            }
       }
        this.fireEvent("recordsAddEvent",{records:newRecords,data:aData});
        YAHOO.log("Added " + newRecords.length + " Record(s) at index " + index +
                " with data " + YAHOO.lang.dump(aData), "info", this.toString());
       return newRecords;
    }
    else if(aData && (aData.constructor == Object)) {
        var oRecord = this._addRecord(aData);
        this.fireEvent("recordsAddEvent",{records:[oRecord],data:aData});
        YAHOO.log("Added 1 Record at index " + index +
                " with data " + YAHOO.lang.dump(aData), "info", this.toString());
        return oRecord;
    }
    else {
        YAHOO.log("Could not add Records with data " +
                YAHOO.lang.dump(aData), "info", this.toString());
    }
};

/**
 * Updates given Record with given data.
 *
 * @method updateRecord
 * @param record {YAHOO.widget.Record | Number} A Record instance, or Record's
 * RecordSet position index.
 * @param oData {Object) Object literal of new data.
 * @param {YAHOO.widget.Record} Updated Record, or null.
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
        // Copy data from the Record for the event that gets fired later
        var oldData = {};
        for(var key in oRecord._oData) {
            oldData[key] = oRecord._oData[key];
        }
        oRecord._oData = oData;
        this.fireEvent("recordUpdateEvent",{record:oRecord,newData:oData,oldData:oldData});
        YAHOO.log("Record at index " + this.getRecordIndex(oRecord) +
                " updated with data " + YAHOO.lang.dump(oData), "info", this.toString());
        return oRecord;
    }
    else {
        YAHOO.log("Could not update Record " + record, "error", this.toString());
        return null;
    }
};

/**
 * Updates given Record at given key with given data.
 *
 * @method updateKey
 * @param record {YAHOO.widget.Record | Number} A Record instance, or Record's
 * RecordSet position index.
 * @param sKey {String} Key name.
 * @param oData {Object) New data.
 */
YAHOO.widget.RecordSet.prototype.updateKey = function(record, sKey, oData) {
    var oRecord;
    
    if(YAHOO.lang.isNumber(record)) {
        oRecord = this._records[record];
    }
    if(record instanceof YAHOO.widget.Record) {
        oRecord = record;

        var oldData = null;
        var keyValue = oRecord._oData[sKey];
        // Copy data from the Record for the event that gets fired later
        if(keyValue && keyValue.constructor == Object) {
            oldData = {};
            for(var key in keyValue) {
                oldData[key] = keyValue[key];
            }
        }
        // Copy by value
        else {
            oldData = keyValue;
        }

        oRecord._oData[sKey] = oData;
        this.fireEvent("keyUpdateEvent",{record:oRecord,key:sKey,newData:oData,oldData:oldData});
        YAHOO.log("Key \"" + sKey +
                "\" for Record at index " + this.getRecordIndex(oRecord) +
                " updated to \"" + YAHOO.lang.dump(oData) + "\"", "info", this.toString());
    }
    else {
        YAHOO.log("Could not update key " + sKey + " for Record " + record, "error", this.toString());
    }
};

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
    this.reset();
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
 * @return {Object} A copy of the data held by the deleted Record.
 */
YAHOO.widget.RecordSet.prototype.deleteRecord = function(index) {
    if(YAHOO.lang.isNumber(index) && (index > -1) && (index < this.getLength())) {
        // Copy data from the Record for the event that gets fired later
        var oRecordData = this.getRecord(index).getData();
        var oData = {};
        for(var key in oRecordData) {
            oData[key] = oRecordData[key];
        }
        
        this._deleteRecord(index);
        this.fireEvent("recordDeleteEvent",{data:oData,index:index});
        YAHOO.log("Record deleted at index " + index +
                " and containing data " + YAHOO.lang.dump(oData), "info", this.toString());
        return oData;
    }
    else {
        YAHOO.log("Could not delete Record at index " + index, "error", this.toString());
        return null;
    }
};

/**
 * Removes the Record at the given position index from the RecordSet. If a range
 * is also provided, removes that many Records, starting from the index. Length
 * of RecordSet is correspondingly shortened.
 *
 * @method deleteRecords
 * @param index {Number} Record's RecordSet position index.
 * @param range {Number} (optional) How many Records to delete.
 */
YAHOO.widget.RecordSet.prototype.deleteRecords = function(index, range) {
    if(!YAHOO.lang.isNumber(range)) {
        range = 1;
    }
    if(YAHOO.lang.isNumber(index) && (index > -1) && (index < this.getLength())) {
        var recordsToDelete = this.getRecords(index, range);
        // Copy data from each Record for the event that gets fired later
        var deletedData = [];
        for(var i=0; i<recordsToDelete.length; i++) {
            var oData = {};
            for(var key in recordsToDelete[i]) {
                oData[key] = recordsToDelete[i][key];
            }
            deletedData.push(oData);
        }
        this._deleteRecord(index, range);

        this.fireEvent("recordsDeleteEvent",{data:deletedData,index:index});
        YAHOO.log(range + "Record(s) deleted at index " + index +
                " and containing data " + YAHOO.lang.dump(deletedData), "info", this.toString());

    }
    else {
        YAHOO.log("Could not delete Records at index " + index, "error", this.toString());
    }
};

/**
 * Deletes all Records from the RecordSet.
 *
 * @method reset
 */
YAHOO.widget.RecordSet.prototype.reset = function() {
    this._records = [];
    this._length = 0;
    this.fireEvent("resetEvent");
    YAHOO.log("All Records deleted from RecordSet", "info", this.toString());
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Record class defines a DataTable record.
 *
 * @namespace YAHOO.widget
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
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Unique number assigned at instantiation, indicates original order within
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
 * Returns unique number assigned at instantiation, indicates original order
 * within RecordSet.
 *
 * @method getId
 * @return Number
 */
YAHOO.widget.Record.prototype.getId = function() {
    return this._nId;
};

/**
 * Returns data for the Record for a key if given, or the entire object
 * literal otherwise.
 *
 * @method getData
 * @param sKey {String} (Optional) The key to retrieve a single data value.
 * @return Object
 */
YAHOO.widget.Record.prototype.getData = function(sKey) {
    if(YAHOO.lang.isString(sKey)) {
        return this._oData[sKey];
    }
    else {
        return this._oData;
    }
};

