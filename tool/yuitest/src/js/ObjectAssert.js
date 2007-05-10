YAHOO.namespace("util");


//-----------------------------------------------------------------------------
// ObjectAssert object
//-----------------------------------------------------------------------------

/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 *
 * @namespace YAHOO.util
 * @class ObjectAssert
 * @static
 */
YAHOO.util.ObjectAssert = {

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} key The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsKey
     * @static
     */
    containsKey : function (key /*:String*/, object /*:Array*/, 
                           message /*:String*/) /*:Void*/ {
        if (YAHOO.lang.isUndefined(object[key])){
            throw new YAHOO.util.AssertionError(message || 
                    "Property " + key + " not found in object.");
        }
    },
        
    /**
     * Asserts that all keys in the object exist in another object.
     * @param {Object} expected An object with the expected keys.
     * @param {Object} actual An object with the actual keys.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method keysAreEqual
     * @static
     */
    keysAreEqual : function (expected /*:Object*/, actual /*:Object*/, 
                           message /*:String*/) /*:Void*/ {
        
        //get all properties in the object
        var keys /*:Array*/ = [];        
        for (var key in expected){
            keys.push(key);
        }
        
        //see if the keys are in the expected object
        for (var i=0; i < keys.length; i++){
            YAHOO.util.Assert.isNotUndefined(actual[keys[i]], message || 
                    "Key '" + key + "' expected.");
        }

    }
};
