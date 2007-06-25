YAHOO.namespace("tool");

//-----------------------------------------------------------------------------
// TestCase object
//-----------------------------------------------------------------------------

/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @class TestCase
 * @namespace YAHOO.tool
 * @constructor
 */
YAHOO.tool.TestCase = function (template /*:Object*/) {
    
    /**
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    this._should /*:Object*/ = {};
    
    //copy over all properties from the template to this object
    for (var prop in template) {
        this[prop] = template[prop];
    }    
    
    //check for a valid name
    if (!YAHOO.lang.isString(this.name)){
        /**
         * Name for the test case.
         */
        this.name /*:String*/ = YAHOO.util.Dom.generateId(null, "testCase");
    }

};

YAHOO.tool.TestCase.prototype = {  

    //-------------------------------------------------------------------------
    // Test Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run before each test is executed.
     */
    setUp : function () /*:Void*/ {
    },
    
    /**
     * Function to run after each test is executed.
     */
    tearDown: function () /*:Void*/ {    
    }
};
