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
    this._sId = "yui-rs" + YAHOO.widget.RecordSet._nCount;
    YAHOO.widget.RecordSet._nCount++;
    this._records = [];
    this._length = 0;

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
     * @event recordsAddEvent
     * @param oArgs.records {YAHOO.widget.Record[]} An array of Record instances.
     * @param oArgs.data {Object[]} Data added.
     */
    this.createEvent("recordsAddEvent");

    /**
     * Fired when a Record is set in the RecordSet.
     *
     * @event recordSetEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.data {Object} Data added.
     */
    this.createEvent("recordSetEvent");

    /**
     * Fired when multiple Records are set in the RecordSet at once.
     *
     * @event recordsSetEvent
     * @param oArgs.records {YAHOO.widget.Record[]} An array of Record instances.
     * @param oArgs.data {Object[]} Data added.
     */
    this.createEvent("recordsSetEvent");

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
     * @event keyUpdateEvent    
     * @deprecated Use recordValueUpdateEvent     
     */
    this.createEvent("keyUpdateEvent");
    /**
     * Fired when a Record value is updated with new data.
     *
     * @event recordValueUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.key {String} The updated key.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     *
     */
    this.createEvent("recordValueUpdateEvent");

    YAHOO.log("RecordSet initialized", "info", this.toString());
};

/**
 * Internal class variable to name multiple Recordset instances.
 *
 * @property RecordSet._nCount
 * @type Number
 * @private
 * @static
 */
YAHOO.widget.RecordSet._nCount = 0;

YAHOO.widget.RecordSet.prototype = {

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private member variables
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Unique String identifier assigned at instantiation.
     *
     * @property _sId
     * @type String
     * @private
     */
    _sId : null,

    /**
     * Internal counter of how many Records are in the RecordSet.
     *
     * @property _length
     * @type Number
     * @private
     */
    _length : null,

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
    _addRecord : function(oData, index) {
        var oRecord = new YAHOO.widget.Record(oData);
        
        if(YAHOO.lang.isNumber(index) && (index > -1)) {
            this._records.splice(index,0,oRecord);
        }
        else {
            index = this.getLength();
            this._records[index] = oRecord;
        }
        this._length++;
        return oRecord;
    },

    /**
     * Sets/replaces one Record to the RecordSet at the given index.  Existing
     * Records with higher indexes are not shifted.  If no index specified, the
     * Record is added to the end of the RecordSet.
     *
     * @method _setRecord
     * @param oData {Object} An object literal of data.
     * @param index {Number} (optional) Position index.
     * @return {YAHOO.widget.Record} A Record instance.
     * @private
     */
    _setRecord : function(oData, index) {
        var oRecord = new YAHOO.widget.Record(oData);
        
        if(YAHOO.lang.isNumber(index) && (index > -1)) {
            this._records[index] = oRecord;
            if((index+1) > this.getLength()) {
                this._length = index+1;
            }
        }
        else {
            this._records[this.getLength()] = oRecord;
            this._length++;
        }
        return oRecord;
    },

    /**
     * Deletes Records from the RecordSet at the given index. If range is null,
     * then only one Record is deleted.
     *
     * @method _deleteRecord
     * @param index {Number} Position index.
     * @param range {Number} (optional) How many Records to delete
     * @private
     */
    _deleteRecord : function(index, range) {
        if(!YAHOO.lang.isNumber(range) || (range < 0)) {
            range = 1;
        }
        this._records.splice(index, range);
        this._length = this._length - range;
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Public methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Returns unique name of the RecordSet instance.
     *
     * @method getId
     * @return {String} Unique name of the RecordSet instance.
     */
    getId : function() {
        return this._sId;
    },

    /**
     * Public accessor to the unique name of the RecordSet instance.
     *
     * @method toString
     * @return {String} Unique name of the RecordSet instance.
     */
    toString : function() {
        return "RecordSet instance " + this._sId;
    },

    /**
     * Returns the number of Records held in the RecordSet.
     *
     * @method getLength
     * @return {Number} Number of records in the RecordSet.
     */
    getLength : function() {
            return this._length;
    },

    /**
     * Returns Record by ID or RecordSet position index.
     *
     * @method getRecord
     * @param record {YAHOO.widget.Record | Number | String} Record instance,
     * RecordSet position index, or Record ID.
     * @return {YAHOO.widget.Record} Record object.
     */
    getRecord : function(record) {
        var i;
        if(record instanceof YAHOO.widget.Record) {
            for(i=0; i<this._records.length; i++) {
                if(this._records[i] && (this._records[i]._sId === record._sId)) {
                    return record;
                }
            }
        }
        else if(YAHOO.lang.isNumber(record)) {
            if((record > -1) && (record < this.getLength())) {
                return this._records[record];
            }
        }
        else if(YAHOO.lang.isString(record)) {
            for(i=0; i<this._records.length; i++) {
                if(this._records[i] && (this._records[i]._sId === record)) {
                    return this._records[i];
                }
            }
        }
        // Not a valid Record for this RecordSet
        return null;

    },

    /**
     * Returns an array of Records from the RecordSet.
     *
     * @method getRecords
     * @param index {Number} (optional) Recordset position index of which Record to
     * start at.
     * @param range {Number} (optional) Number of Records to get.
     * @return {YAHOO.widget.Record[]} Array of Records starting at given index and
     * length equal to given range. If index is not given, all Records are returned.
     */
    getRecords : function(index, range) {
        if(!YAHOO.lang.isNumber(index)) {
            return this._records;
        }
        if(!YAHOO.lang.isNumber(range)) {
            return this._records.slice(index);
        }
        return this._records.slice(index, index+range);
    },

    /**
     * Returns a boolean indicating whether Records exist in the RecordSet at the
     * specified index range.  Returns true if and only if a Record exists at each
     * index in the range.
     * @method hasRecords
     * @param index
     * @param range
     * @return {Boolean} true if all indices are populated in the RecordSet
     */
    hasRecords : function (index, range) {
        var recs = this.getRecords(index,range);
        for (var i = 0; i < range; ++i) {
            if (typeof recs[i] === 'undefined') {
                return false;
            }
        }
        return true;
    },

    /**
     * Returns current position index for the given Record.
     *
     * @method getRecordIndex
     * @param oRecord {YAHOO.widget.Record} Record instance.
     * @return {Number} Record's RecordSet position index.
     */

    getRecordIndex : function(oRecord) {
        if(oRecord) {
            for(var i=this._records.length-1; i>-1; i--) {
                if(this._records[i] && oRecord.getId() === this._records[i].getId()) {
                    return i;
                }
            }
        }
        return null;

    },

    /**
     * Adds one Record to the RecordSet at the given index. If index is null,
     * then adds the Record to the end of the RecordSet.
     *
     * @method addRecord
     * @param oData {Object} An object literal of data.
     * @param index {Number} (optional) Position index.
     * @return {YAHOO.widget.Record} A Record instance.
     */
    addRecord : function(oData, index) {
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
    },

    /**
     * Adds multiple Records at once to the RecordSet at the given index with the
     * given object literal data. If index is null, then the new Records are
     * added to the end of the RecordSet.
     *
     * @method addRecords
     * @param aData {Object[]} An object literal data or an array of data object literals.
     * @param index {Number} (optional) Position index.
     * @return {YAHOO.widget.Record[]} An array of Record instances.
     */
    addRecords : function(aData, index) {
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
    },

    /**
     * Sets or replaces one Record to the RecordSet at the given index. Unlike
     * addRecord, an existing Record at that index is not shifted to preserve it.
     * If no index is specified, it adds the Record to the end of the RecordSet.
     *
     * @method setRecord
     * @param oData {Object} An object literal of data.
     * @param index {Number} (optional) Position index.
     * @return {YAHOO.widget.Record} A Record instance.
     */
    setRecord : function(oData, index) {
        if(oData && (oData.constructor == Object)) {
            var oRecord = this._setRecord(oData, index);
            this.fireEvent("recordSetEvent",{record:oRecord,data:oData});
            YAHOO.log("Set Record at index " + index +
                    " with data " + YAHOO.lang.dump(oData), "info", this.toString());
            return oRecord;
        }
        else {
            YAHOO.log("Could not set Record with data" +
                    YAHOO.lang.dump(oData), "info", this.toString());
            return null;
        }
    },

    /**
     * Sets or replaces multiple Records at once to the RecordSet with the given
     * data, starting at the given index. If index is not specified, then the new
     * Records are added to the end of the RecordSet.
     *
     * @method setRecords
     * @param aData {Object[]} An array of object literal data.
     * @param index {Number} (optional) Position index.
     * @return {YAHOO.widget.Record[]} An array of Record instances.
     */
    setRecords : function(aData, index) {
        if(YAHOO.lang.isArray(aData)) {
            var newRecords = [];
            // Can't go backwards bc we need to preserve order
            var i = 0;
            for(; i<aData.length; i++) {
                if(aData[i] && (aData[i].constructor == Object)) {
                    var record = this._setRecord(aData[i], index + i);
                    newRecords.push(record);
                }
           }
            this.fireEvent("recordsSet",{records:newRecords,data:aData});
            YAHOO.log("Set " + newRecords.length + " Record(s) at index " + index +
                    " through " + (index + i - 1) + " with data " + YAHOO.lang.dump(aData), "info", this.toString());
           return newRecords;
        }
        else if(aData && (aData.constructor == Object)) {
            var oRecord = this._setRecord(aData);
            this.fireEvent("recordsSetEvent",{records:[oRecord],data:aData});
            YAHOO.log("Set 1 Record at index " + index +
                    " with data " + YAHOO.lang.dump(aData), "info", this.toString());
            return oRecord;
        }
        else {
            YAHOO.log("Could not set Records with data " +
                    YAHOO.lang.dump(aData), "info", this.toString());
        }
    },

    /**
     * Updates given Record with given data.
     *
     * @method updateRecord
     * @param record {YAHOO.widget.Record | Number | String} A Record instance,
     * a RecordSet position index, or a Record ID.
     * @param oData {Object} Object literal of new data.
     * @return {YAHOO.widget.Record} Updated Record, or null.
     */
    updateRecord : function(record, oData) {
        var oRecord = this.getRecord(record);
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
    },

    /**
     * @method updateKey
     * @deprecated Use updateRecordValue
     */
    updateKey : function(record, sKey, oData) {
        this.updateRecordValue(record, sKey, oData);
    },
    /**
     * Sets given Record at given key to given data.
     *
     * @method updateRecordValue
     * @param record {YAHOO.widget.Record | Number | String} A Record instance,
     * a RecordSet position index, or a Record ID.
     * @param sKey {String} Key name.
     * @param oData {Object} New data.
     */
    updateRecordValue : function(record, sKey, oData) {
        var oRecord = this.getRecord(record);
        if(oRecord) {
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
            this.fireEvent("recordValueUpdateEvent",{record:oRecord,key:sKey,newData:oData,oldData:oldData});
            YAHOO.log("Key \"" + sKey +
                    "\" for Record at index " + this.getRecordIndex(oRecord) +
                    " updated to \"" + YAHOO.lang.dump(oData) + "\"", "info", this.toString());
        }
        else {
            YAHOO.log("Could not update key " + sKey + " for Record " + record, "error", this.toString());
        }
    },

    /**
     * Replaces all Records in RecordSet with new object literal data.
     *
     * @method replaceRecords
     * @param data {Object || Object[]} An object literal of data or an array of
     * data object literals.
     * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record instance or
     * an array of Records.
     */
    replaceRecords : function(data) {
        this.reset();
        return this.addRecords(data);
    },

    /**
     * Sorts all Records by given function. Records keep their unique IDs but will
     * have new RecordSet position indexes.
     *
     * @method sortRecords
     * @param fnSort {Function} Reference to a sort function.
     * @param desc {Boolean} True if sort direction is descending, false if sort
     * direction is ascending.
     * @return {YAHOO.widget.Record[]} Sorted array of Records.
     */
    sortRecords : function(fnSort, desc) {
        return this._records.sort(function(a, b) {return fnSort(a, b, desc);});
    },

    /**
     * Reverses all Records, so ["one", "two", "three"] becomes ["three", "two", "one"].
     *
     * @method reverseRecords
     * @return {YAHOO.widget.Record[]} Reverse-sorted array of Records.
     */
    reverseRecords : function() {
        return this._records.reverse();
    },

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
    deleteRecord : function(index) {
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
    },

    /**
     * Removes the Record at the given position index from the RecordSet. If a range
     * is also provided, removes that many Records, starting from the index. Length
     * of RecordSet is correspondingly shortened.
     *
     * @method deleteRecords
     * @param index {Number} Record's RecordSet position index.
     * @param range {Number} (optional) How many Records to delete.
     */
    deleteRecords : function(index, range) {
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
    },

    /**
     * Deletes all Records from the RecordSet.
     *
     * @method reset
     */
    reset : function() {
        this._records = [];
        this._length = 0;
        this.fireEvent("resetEvent");
        YAHOO.log("All Records deleted from RecordSet", "info", this.toString());
    }
};

YAHOO.augment(YAHOO.widget.RecordSet, YAHOO.util.EventProvider);

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
    this._sId = "yui-rec" + YAHOO.widget.Record._nCount;
    YAHOO.widget.Record._nCount++;
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
 * Internal class variable to give unique IDs to Record instances.
 *
 * @property Record._nCount
 * @type Number
 * @private
 */
YAHOO.widget.Record._nCount = 0;

YAHOO.widget.Record.prototype = {
    /**
     * Immutable unique ID assigned at instantiation. Remains constant while a
     * Record's position index can change from sorting.
     *
     * @property _sId
     * @type String
     * @private
     */
    _sId : null,

    /**
     * Holds data for the Record in an object literal.
     *
     * @property _oData
     * @type Object
     * @private
     */
    _oData : null,

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
     * Returns unique ID assigned at instantiation.
     *
     * @method getId
     * @return String
     */
    getId : function() {
        return this._sId;
    },

    /**
     * Returns data for the Record for a key if given, or the entire object
     * literal otherwise.
     *
     * @method getData
     * @param sKey {String} (Optional) The key to retrieve a single data value.
     * @return Object
     */
    getData : function(sKey) {
        if(YAHOO.lang.isString(sKey)) {
            return this._oData[sKey];
        }
        else {
            return this._oData;
        }
    },

    /**
     * Sets given data at the given key. Use the RecordSet method setValue to trigger
     * events. 
     *
     * @method setData
     * @param sKey {String} The key of the new value.
     * @param oData {MIXED} The new value.
     */
    setData : function(sKey, oData) {
        this._oData[sKey] = oData;
    }
};
