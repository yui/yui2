//-----------------------------------------------------------------------------
// DateAssert object
//-----------------------------------------------------------------------------

/**
 * The DateAssert object provides functions to test JavaScript Date objects
 * for a variety of cases.
 *
 * @namespace YAHOO.util
 * @class DateAssert
 * @static
 */
 
YAHOO.util.DateAssert = {

    /**
     * Asserts that a date's month, day, and year are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    datesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
        if (expected instanceof Date && actual instanceof Date){
            YAHOO.util.Assert.areEqual(expected.getFullYear(), actual.getFullYear(), message || "Years should be equal.");
            YAHOO.util.Assert.areEqual(expected.getMonth(), actual.getMonth(), message || "Months should be equal.");
            YAHOO.util.Assert.areEqual(expected.getDate(), actual.getDate(), message || "Day of month should be equal.");
        } else {
            throw new TypeError("DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
        }
    },

    /**
     * Asserts that a date's hour, minutes, and seconds are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    timesAreEqual : function (expected /*:Date*/, actual /*:Date*/, message /*:String*/){
        if (expected instanceof Date && actual instanceof Date){
            YAHOO.util.Assert.areEqual(expected.getHours(), actual.getHours(), message || "Hours should be equal.");
            YAHOO.util.Assert.areEqual(expected.getMinutes(), actual.getMinutes(), message || "Minutes should be equal.");
            YAHOO.util.Assert.areEqual(expected.getSeconds(), actual.getSeconds(), message || "Seconds should be equal.");
        } else {
            throw new TypeError("DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
        }
    }
    
};
