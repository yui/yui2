//-----------------------------------------------------------------------------
// ArrayAssert object
//-----------------------------------------------------------------------------

/**
 * The ArrayAssert object provides functions to test JavaScript array objects
 * for a variety of cases.
 *
 * @namespace YAHOO.util
 * @class ArrayAssert
 * @static
 */
 
YAHOO.util.ArrayAssert = {
    /**
     * Asserts that a value is present in an array. This uses the triple equals 
     * sign so no type cohersion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains : function (needle /*:Object*/, haystack /*:Array*/, 
                           message /*:String*/) /*:Void*/ {
        
        var found /*:Boolean*/ = false;
        
        //begin checking values
        for (var i=0; i < haystack.length && !found; i++){
            if (haystack[i] === needle) {
                found = true;
            }
        }
        
        if (!found){
            throw new YAHOO.util.AssertionError(message || "Value not found in array.");
        }
    },
    
    /**
     * Asserts that the given value is contained in an array at the specified index.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method indexOf
     * @static
     */
    indexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
    
        //try to find the value in the array
        for (var i=0; i < haystack.length; i++){
            if (haystack[i] === needle){
                YAHOO.util.Assert.areEqual(index, i, "Value exists at index " + i + " but should be at index " + index + ".");
                return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        YAHOO.util.Assert.fail("Value doesn't exist in array.");        
    },
        
    /**
     * Asserts that the values in an array are equal, and in the same position,
     * as values in another array. This uses the double equals sign
     * so type cohersion may occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEqual
     * @static
     */
    itemsAreEqual : function (expected /*:Array*/, actual /*:Array*/, 
                           message /*:String*/) /*:Void*/ {
        
        //one may be longer than the other, so get the maximum length
        var len /*:int*/ = Math.max(expected.length, actual.length);
        
        //begin checking values
        for (var i=0; i < len; i++){
            YAHOO.util.Assert.areEqual(expected[i], actual[i], message || 
                    "Values in position " + i + " are not equal.");
        }
    },
    
    /**
     * Asserts that an array is empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isEmpty
     * @static
     */
    isEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
        if (actual.length > 0){
            throw new YAHOO.util.AssertionError(message || 
                    "Array should be empty.");
        }
    },    
    
    /**
     * Asserts that an array is not empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty : function (actual /*:Array*/, message /*:String*/) /*:Void*/ {        
        if (actual.length === 0){
            throw new YAHOO.util.AssertionError(message || 
                    "Array should not be empty.");
        }
    },    
    
    /**
     * Asserts that the values in an array are the same, and in the same position,
     * as values in another array. This uses the triple equals sign
     * so no type cohersion will occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreSame
     * @static
     */
    itemsAreSame : function (expected /*:Array*/, actual /*:Array*/, 
                          message /*:String*/) /*:Void*/ {
        
        //one may be longer than the other, so get the maximum length
        var len /*:int*/ = Math.max(expected.length, actual.length);
        
        //begin checking values
        for (var i=0; i < len; i++){
            YAHOO.util.Assert.areSame(expected[i], actual[i], 
                message || "Values in position " + i + " are not the same.");
        }
    },
    
    /**
     * Asserts that the given value is contained in an array at the specified index,
     * starting from the back of the array.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method lastIndexOf
     * @static
     */
    lastIndexOf : function (needle /*:Object*/, haystack /*:Array*/, index /*:int*/, message /*:String*/) /*:Void*/ {
    
        //try to find the value in the array
        for (var i=haystack.length; i >= 0; i--){
            if (haystack[i] === needle){
                YAHOO.util.Assert.areEqual(index, i, "Value exists at index " + i + " but should be at index " + index + ".");
                return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        YAHOO.util.Assert.fail("Value doesn't exist in array.");        
    }
    
};
