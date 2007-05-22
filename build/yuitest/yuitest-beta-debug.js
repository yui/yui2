YAHOO.namespace("tool");

//-----------------------------------------------------------------------------
// TestLogger object
//-----------------------------------------------------------------------------

/**
 * Logger sublass
 * @namespace YAHOO.tool
 * @class TestLogger
 */
YAHOO.tool.TestLogger = function (element, config) {
    arguments.callee.superclass.constructor.call(this, element, config);
    this.init();
};

YAHOO.lang.extend(YAHOO.tool.TestLogger, YAHOO.widget.LogReader, {

    footerEnabled : true,
    newestOnTop : false,

    /**
     * Formats message string to HTML for output to console.
     * @private
     * @method formatMsg
     * @param oLogMsg {Object} Log message object.
     * @return {String} HTML-formatted message for output to console.
     */
    formatMsg : function(message /*:Object*/) {
    
        var category /*:String*/ = message.category;        
        var text /*:String*/ = this.html2Text(message.msg);
        
        return "<pre><p><span class=\"" + category + "\">" + category.toUpperCase() + "</span> " + text + "</p></pre>";
    
    },
    
    //-------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------
    
    /*
     * Initializes the logger.
     * @private
     */
    init : function () {
    
        //setup event handlers
        YAHOO.tool.TestRunner.subscribe("pass", this.handlePass, this, true);
        YAHOO.tool.TestRunner.subscribe("fail", this.handleFail, this, true);
        YAHOO.tool.TestRunner.subscribe("ignore", this.handleIgnore, this, true);
        YAHOO.tool.TestRunner.subscribe("testsuitebegin", this.handleTestSuiteBegin, this, true);
        YAHOO.tool.TestRunner.subscribe("testsuitecomplete", this.handleTestSuiteComplete, this, true);
        YAHOO.tool.TestRunner.subscribe("testcasebegin", this.handleTestCaseBegin, this, true);
        YAHOO.tool.TestRunner.subscribe("testcasecomplete", this.handleTestCaseComplete, this, true);
        
        //reset the logger
        YAHOO.widget.Logger.reset();
    },
    
    //-------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------

    /**
     * Handles an error event for the TestRunner object.
     * @param data Information about the event.
     */
    handleFail : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": " + data.error.getMessage(), "fail");
    },

    /**
     * Handles an ignore event for the TestRunner object.
     * @param data Information about the event.
     */
    handleIgnore : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": ignored", "ignore");
    },

    /**
     * Handles an error event for the TestRunner object.
     * @param data Information about the event.
     */
    handlePass : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": passed", "pass");
    },
    
    handleTestSuiteBegin : function (data /*:Object*/) {
        var testSuiteName /*:String*/ = data.testSuite.name || "Unnamed test suite";
        YAHOO.log("Test suite \"" + testSuiteName + "\" started", "info");
    },
    
    handleTestSuiteComplete : function (data /*:Object*/) {
        var testSuiteName /*:String*/ = data.testSuite.name || "Unnamed test suite";
        YAHOO.log("Test suite \"" + testSuiteName + "\" completed", "info");
    },
    
    handleTestCaseBegin : function (data /*:Object*/) {
        var testCaseName /*:String*/ = data.testCase.name || "Unnamed test case";
        YAHOO.log("Test case \"" + testCaseName + "\" started", "info");
    },
    
    handleTestCaseComplete : function (data /*:Object*/) {
        var testCaseName /*:String*/ = data.testCase.name || "Unnamed test case";
        YAHOO.log("Test case \"" + testCaseName + "\" completed. Passed:" + data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total, "info");
    }
    
});
YAHOO.namespace("tool");

/**
 * The YUI test tool
 * @module yuitest
 * @namespace YAHOO.tool
 * @requires yahoo,dom,event,logger
 */


//-----------------------------------------------------------------------------
// TestRunner object
//-----------------------------------------------------------------------------

/**
 * Runs a test suite.
 * @class TestRunner
 * @constructor
 */
YAHOO.tool.TestRunner = (function(){

    function TestRunner(){
    
        //inherit from EventProvider
        this.constructor.superclass.constructor.apply(this,arguments);
        
        /**
         * The test objects to run.
         * @type Array
         * @private
         */
        this.items /*:Array*/ = [];
        
        //create events
        this.createEvent("testcasebegin", {scope: this});
        this.createEvent("testcasecomplete", {scope: this});
        this.createEvent("testsuitebegin", {scope: this});
        this.createEvent("testsuitecomplete", {scope: this});
        this.createEvent("pass", {scope: this});
        this.createEvent("fail", {scope: this});
        this.createEvent("ignore", {scope: this});
        this.createEvent("complete", {scope: this});
        
    }
    
    YAHOO.lang.extend(TestRunner, YAHOO.util.EventProvider, {
    
    
        //-------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------
         
        /**
         * Runs a given test case.
         * @private
         * @param {YAHOO.tool.TestCase} testCase The test case to run.
         */
        runTestCase : function (testCase /*YAHOO.tool.TestCase*/) /*:Void*/{
        
            //object to store results
            var results /*:Object*/ = {};
        
            //test case begins
            this.fireEvent("testcasebegin", { testCase: testCase });
        
            //gather the test functions
            var tests /*:Array*/ = [];
            for (var prop in testCase){
                if (prop.indexOf("test") === 0 && typeof testCase[prop] == "function") {
                    tests.push(prop);
                }
            }
            
            //get the "should" test cases
            var shouldFail /*:Object*/ = testCase._should.fail || {};
            var shouldError /*:Object*/ = testCase._should.error || {};
            var shouldIgnore /*:Object*/ = testCase._should.ignore || {};
            
            //test counts
            var failCount /*:int*/ = 0;
            var passCount /*:int*/ = 0;
            var runCount /*:int*/ = 0;
            
            //run each test
            for (var i=0; i < tests.length; i++){
            
                //figure out if the test should be ignored or not
                if (shouldIgnore[tests[i]]){
                    this.fireEvent("ignore", { testCase: testCase, testName: tests[i] });
                    continue;
                }
            
                //variable to hold whether or not the test failed
                var failed /*:Boolean*/ = false;
                var error /*:Error*/ = null;
            
                //run the setup
                testCase.setUp();
                
                //try the test
                try {
                
                    //run the test
                    testCase[tests[i]]();
                    
                    //if it should fail, and it got here, then it's a fail because it didn't
                    if (shouldFail[tests[i]]){
                        error = new YAHOO.util.ShouldFail();
                        failed = true;
                    } else if (shouldError[tests[i]]){
                        error = new YAHOO.util.ShouldError();
                        failed = true;
                    }
                               
                } catch (thrown /*:Error*/){
                    if (thrown instanceof YAHOO.util.AssertionError) {
                        if (!shouldFail[tests[i]]){
                            error = thrown;
                            failed = true;
                        }
                    } else {
                        //first check to see if it should error
                        if (!shouldError[tests[i]]) {                        
                            error = new YAHOO.util.UnexpectedError(thrown);
                            failed = true;
                        } else {
                            //check to see what type of data we have
                            if (YAHOO.lang.isString(shouldError[tests[i]])){
                                
                                //if it's a string, check the error message
                                if (thrown.message != shouldError[tests[i]]){
                                    error = new YAHOO.util.UnexpectedError(thrown);
                                    failed = true;                                    
                                }
                            } else if (YAHOO.lang.isObject(shouldError[tests[i]])){
                            
                                //if it's an object, check the instance and message
                                if (!(thrown instanceof shouldError[tests[i]].constructor) 
                                        || thrown.message != shouldError[tests[i]].message){
                                    error = new YAHOO.util.UnexpectedError(thrown);
                                    failed = true;                                    
                                }
                            
                            }
                        
                        }
                    }
                    
                } finally {
                
                    //fireEvent appropriate event
                    if (failed) {
                        this.fireEvent("fail", { testCase: testCase, testName: tests[i], error: error });
                    } else {
                        this.fireEvent("pass", { testCase: testCase, testName: tests[i] });
                    }            
                }
                
                //run the tear down
                testCase.tearDown();
                
                //update results
                results[tests[i]] = { 
                    result: failed ? "fail" : "pass",
                    message : error ? error.getMessage() : "Test passed"
                };
                
                //update counts
                runCount++;
                failCount += (failed ? 1 : 0);
                passCount += (failed ? 0 : 1);
            }
            
            //add test counts to results
            results.total = runCount;
            results.failed = failCount;
            results.passed = passCount;
            
            //test case is done
            this.fireEvent("testcasecomplete", { testCase: testCase, results: results });
            
            //return results
            return results;
        
        },
        
        /**
         * Runs all the tests in a test suite.
         * @private
         * @param {YAHOO.tool.TestSuite} testSuite The test suite to run.
         */
        runTestSuite : function (testSuite /*:YAHOO.tool.TestSuite*/) {
        
            //object to store results
            var results /*:Object*/ = {};
        
            //fireEvent event for beginning of test suite run
            this.fireEvent("testsuitebegin", { testSuite: testSuite });
        
            //iterate over the test suite items
            for (var i=0; i < testSuite.items.length; i++){
                if (testSuite.items[i] instanceof YAHOO.tool.TestSuite) {
                    results[testSuite.items[i].name] = this.runTestSuite(testSuite.items[i]);
                } else if (testSuite.items[i] instanceof YAHOO.tool.TestCase) {
                    results[testSuite.items[i].name] = this.runTestCase(testSuite.items[i]);
                }
            }
    
            //fireEvent event for completion of test suite run
            this.fireEvent("testsuitecomplete", { testSuite: testSuite, results: results });
            
            //return the results
            return results;
        
        },
        
        //-------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------   
    
        /**
         * Adds a test suite or test case to the list of test objects to run.
         * @param testObject Either a TestCase or a TestSuite that should be run.
         */
        add : function (testObject /*:Object*/) /*:Void*/ {
            this.items.push(testObject);
        },
        
        /**
         * Removes all test objects from the runner.
         */
        clear : function () /*:Void*/ {
            while(this.items.length){
                this.items.pop();
            }
        },
    
        /**
         * Runs the test suite.
         */
        run : function (testObject /*:Object*/) /*:Void*/ { 
            var results = null;
       
            if (testObject instanceof YAHOO.tool.TestSuite) {
                results = this.runTestSuite(testObject);
            } else if (testObject instanceof YAHOO.tool.TestCase) {
                results = this.runTestCase(testObject);
            } else if (arguments.length===0){
                results = {};
                for (var i=0; i < this.items.length; i++){
                    results[this.items[i].name] = this.run(this.items[i]);
                }
            } else {
                throw new TypeError("Expected either YAHOO.util.TestCase or YAHOO.util.TestSuite.");
            }      
            
            this.fireEvent("complete", { results: results });
        }    
    });
    
    return new TestRunner();
    
})();
YAHOO.namespace("tool");


//-----------------------------------------------------------------------------
// TestSuite object
//-----------------------------------------------------------------------------

/**
 * A test suite that can contain a collection of TestCase and TestSuite objects.
 * @param {String} name The name of the test fixture.
 * @namespace YAHOO.tool
 * @class TestSuite
 * @constructor
 */
YAHOO.tool.TestSuite = function (name /*:String*/) {

    /**
     * The name of the test suite.
     */
    this.name /*:String*/ = name || YAHOO.util.Dom.generateId(null, "testSuite");

    /**
     * Array of test suites and
     * @private
     */
    this.items /*:Array*/ = [];

};

YAHOO.tool.TestSuite.prototype = {
    
    /**
     * Adds a test suite or test case to the test suite.
     * @param {YAHOO.tool.TestSuite||YAHOO.tool.TestCase} testObject The test suite or test case to add.
     */
    add : function (testObject /*:YAHOO.tool.TestSuite*/) /*:Void*/ {
        if (testObject instanceof YAHOO.tool.TestSuite || testObject instanceof YAHOO.tool.TestCase) {
            this.items.push(testObject);
        }
    }
    
};
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
YAHOO.namespace("util");

//-----------------------------------------------------------------------------
// Assert object
//-----------------------------------------------------------------------------

/**
 * The Assert object provides functions to test JavaScript values against
 * known and expected results. Whenever a comparison (assertion) fails,
 * an error is thrown.
 *
 * @namespace YAHOO.util
 * @class Assert
 * @static
 */
YAHOO.util.Assert = {

    //-------------------------------------------------------------------------
    // Generic Assertion Methods
    //-------------------------------------------------------------------------
    
    /** 
     * Forces an assertion error to occur.
     * @param {String} message (Optional) The message to display with the failure.
     * @method fail
     * @static
     */
    fail : function (message /*:String*/) /*:Void*/ {
        throw new YAHOO.util.AssertionError(message || "Test force-failed.");
    },       
    
    //-------------------------------------------------------------------------
    // Equality Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    areEqual : function (expected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (expected != actual) {
            throw new YAHOO.util.ComparisonFailure(message || "Values should be equal.", expected, actual);
        }
    },
    
    /**
     * Asserts that a value is not equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotEqual
     * @static
     */
    areNotEqual : function (unexpected /*:Object*/, actual /*:Object*/, 
                         message /*:String*/) /*:Void*/ {
        if (unexpected == actual) {
            throw new YAHOO.util.UnexpectedValue(message || "Values should not be equal.", unexpected);
        }
    },
    
    /**
     * Asserts that a value is not the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotSame
     * @static
     */
    areNotSame : function (unexpected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (unexpected === actual) {
            throw new YAHOO.util.UnexpectedValue(message || "Values should not be the same.", unexpected);
        }
    },

    /**
     * Asserts that a value is the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areSame
     * @static
     */
    areSame : function (expected /*:Object*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (expected !== actual) {
            throw new YAHOO.util.ComparisonFailure(message || "Values should be the same.", expected, actual);
        }
    },    
    
    //-------------------------------------------------------------------------
    // Boolean Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is false. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFalse
     * @static
     */
    isFalse : function (actual /*:Boolean*/, message /*:String*/) {
        if (false !== actual) {
            throw new YAHOO.util.ComparisonFailure(message || "Value should be false.", false, actual);
        }
    },
    
    /**
     * Asserts that a value is true. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTrue
     * @static
     */
    isTrue : function (actual /*:Boolean*/, message /*:String*/) /*:Void*/ {
        if (true !== actual) {
            throw new YAHOO.util.ComparisonFailure(message || "Value should be true.", true, actual);
        }

    },
    
    //-------------------------------------------------------------------------
    // Special Value Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is not a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNaN
     * @static
     */
    isNaN : function (actual /*:Object*/, message /*:String*/) /*:Void*/{
        if (!isNaN(actual)){
            throw new YAHOO.util.ComparisonFailure(message || "Value should be NaN.", NaN, actual);
        }    
    },
    
    /**
     * Asserts that a value is not the special NaN value.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNaN
     * @static
     */
    isNotNaN : function (actual /*:Object*/, message /*:String*/) /*:Void*/{
        if (isNaN(actual)){
            throw new YAHOO.util.UnexpectedValue(message || "Values should not be NaN.", NaN);
        }    
    },
    
    /**
     * Asserts that a value is not null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNull
     * @static
     */
    isNotNull : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (YAHOO.lang.isNull(actual)) {
            throw new YAHOO.util.UnexpectedValue(message || "Values should not be null.", null);
        }
    },

    /**
     * Asserts that a value is not undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotUndefined
     * @static
     */
    isNotUndefined : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (YAHOO.lang.isUndefined(actual)) {
            throw new YAHOO.util.UnexpectedValue(message || "Value should not be undefined.", undefined);
        }
    },

    /**
     * Asserts that a value is null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNull
     * @static
     */
    isNull : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isNull(actual)) {
            throw new YAHOO.util.ComparisonFailure(message || "Value should be null.", null, actual);
        }
    },
        
    /**
     * Asserts that a value is undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isUndefined
     * @static
     */
    isUndefined : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isUndefined(actual)) {
            throw new YAHOO.util.ComparisonFailure(message || "Value should be undefined.", undefined, actual);
        }
    },    
    
    //--------------------------------------------------------------------------
    // Instance Assertion Methods
    //--------------------------------------------------------------------------    
   
    /**
     * Asserts that a value is an array.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isArray
     * @static
     */
    isArray : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isArray(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be an array.", actual);
        }    
    },
   
    /**
     * Asserts that a value is a Boolean.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isBoolean
     * @static
     */
    isBoolean : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isBoolean(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be a Boolean.", actual);
        }    
    },
   
    /**
     * Asserts that a value is a function.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFunction
     * @static
     */
    isFunction : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isFunction(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be a function.", actual);
        }    
    },
   
    /**
     * Asserts that a value is an instance of a particular object. This may return
     * incorrect results when comparing objects from one frame to constructors in
     * another frame. For best results, don't use in a cross-frame manner.
     * @param {Function} expected The function that the object should be an instance of.
     * @param {Object} actual The object to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isInstanceOf
     * @static
     */
    isInstanceOf : function (expected /*:Function*/, actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!(actual instanceof expected)){
            throw new YAHOO.util.ComparisonFailure(message || "Value isn't an instance of expected type.", expected, actual);
        }
    },
    
    /**
     * Asserts that a value is a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNumber
     * @static
     */
    isNumber : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isNumber(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be a number.", actual);
        }    
    },    
    
    /**
     * Asserts that a value is an object.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isObject
     * @static
     */
    isObject : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isObject(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be an object.", actual);
        }
    },
    
    /**
     * Asserts that a value is a string.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isString
     * @static
     */
    isString : function (actual /*:Object*/, message /*:String*/) /*:Void*/ {
        if (!YAHOO.lang.isString(actual)){
            throw new YAHOO.util.UnexpectedValue("Value should be a string.", actual);
        }
    },
    
    /**
     * Asserts that a value is of a particular type. 
     * @param {String} expectedType The expected type of the variable.
     * @param {Object} actualValue The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTypeOf
     * @static
     */
    isTypeOf : function (expectedType /*:String*/, actualValue /*:Object*/, message /*:String*/) /*:Void*/{
        if (typeof actualValue != expectedType){
            throw new YAHOO.util.ComparisonFailure(message || "Value should be of type " + expected + ".", expected, typeof actual);
        }
    }
};

//-----------------------------------------------------------------------------
// Assertion errors
//-----------------------------------------------------------------------------

/**
 * AssertionError is thrown whenever an assertion fails. It provides methods
 * to more easily get at error information and also provides a base class
 * from which more specific assertion errors can be derived.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YAHOO.util
 * @class AssertionError
 * @extends Error
 * @constructor
 */ 
YAHOO.util.AssertionError = function (message /*:String*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, message);
    
    /*
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    this.message /*:String*/ = message;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "AssertionError";
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.AssertionError, Error, {

    /**
     * Returns a fully formatted error for an assertion failure. This should
     * be overridden by all subclasses to provide specific information.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () /*:String*/ {
        return this.message;
    },
    
    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () /*:String*/ {
        return this.name + ": " + this.getMessage();
    },
    
    /**
     * Returns a primitive value version of the error. Same as toString().
     * @method valueOf
     * @return {String} A primitive value version of the error.
     */
    valueOf : function () /*:String*/ {
        return this.toString();
    }

});

/**
 * ComparisonFailure is subclass of AssertionError that is thrown whenever
 * a comparison between two values fails. It provides mechanisms to retrieve
 * both the expected and actual value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} expected The expected value.
 * @param {Object} actual The actual value that caused the assertion to fail.
 * @namespace YAHOO.util
 * @extends YAHOO.util.AssertionError
 * @class ComparisonFailure
 * @constructor
 */ 
YAHOO.util.ComparisonFailure = function (message /*:String*/, expected /*:Object*/, actual /*:Object*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, message);
    
    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    this.expected /*:Object*/ = expected;
    
    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    this.actual /*:Object*/ = actual;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "ComparisonFailure";
    
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.ComparisonFailure, YAHOO.util.AssertionError, {

    /**
     * Returns a fully formatted error for an assertion failure. This message
     * provides information about the expected and actual values.
     * @method toString
     * @return {String} A string describing the error.
     */
    getMessage : function () /*:String*/ {
        return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
            "\nActual:" + this.actual + " (" + (typeof this.actual) + ")";
    }

});

/**
 * UnexpectedValue is subclass of AssertionError that is thrown whenever
 * a value was unexpected in its scope. This typically means that a test
 * was performed to determine that a value was *not* equal to a certain
 * value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} unexpected The unexpected value.
 * @namespace YAHOO.util
 * @extends YAHOO.util.AssertionError
 * @class UnexpectedValue
 * @constructor
 */ 
YAHOO.util.UnexpectedValue = function (message /*:String*/, unexpected /*:Object*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, message);
    
    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    this.unexpected /*:Object*/ = unexpected;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "UnexpectedValue";
    
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.UnexpectedValue, YAHOO.util.AssertionError, {

    /**
     * Returns a fully formatted error for an assertion failure. The message
     * contains information about the unexpected value that was encountered.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () /*:String*/ {
        return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
    }

});

/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YAHOO.util
 * @extends YAHOO.util.AssertionError
 * @class ShouldFail
 * @constructor
 */  
YAHOO.util.ShouldFail = function (message /*:String*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, message || "This test should fail but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "ShouldFail";
    
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.ShouldFail, YAHOO.util.AssertionError);

/**
 * ShouldError is subclass of AssertionError that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YAHOO.util
 * @extends YAHOO.util.AssertionError
 * @class ShouldError
 * @constructor
 */  
YAHOO.util.ShouldError = function (message /*:String*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, message || "This test should have thrown an error but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "ShouldError";
    
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.ShouldError, YAHOO.util.AssertionError);

/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be 
 *                      thrown.
 * @namespace YAHOO.util
 * @extends YAHOO.util.AssertionError
 * @class UnexpectedError
 * @constructor
 */  
YAHOO.util.UnexpectedError = function (cause /*:Object*/){

    //call superclass
    arguments.callee.superclass.constructor.call(this, "Unexpected error: " + cause.message);
    
    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    this.cause /*:Error*/ = cause;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name /*:String*/ = "UnexpectedError";
    
};

//inherit methods
YAHOO.lang.extend(YAHOO.util.UnexpectedError, YAHOO.util.AssertionError);
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
    }
};
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
YAHOO.namespace("util");

/**
 * The UserAction object provides functions that simulate events occurring in
 * the browser. Since these are simulated events, they do not behave exactly
 * as regular, user-initiated events do, but can be used to test simple
 * user interactions safely.
 *
 * @namespace YAHOO.util
 * @class UserAction
 * @static
 */
YAHOO.util.UserAction = {

    //--------------------------------------------------------------------------
    // Generic event methods
    //--------------------------------------------------------------------------

    /**
     * Simulates a key event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks. Note: keydown causes Safari 2.x to
     * crash.
     * @method simulateKeyEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: keyup, keydown, and keypress.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 3 specifies that all key events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 3 specifies that all
     *      key events can be cancelled. The default 
     *      is true.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} keyCode (Optional) The code for the key that is in use. 
     *      The default is 0.
     * @param {int} charCode (Optional) The Unicode code for the character
     *      associated with the key being used. The default is 0.
     */
    simulateKeyEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                 bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                 view /*:Window*/,
                                 ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                 shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                 keyCode /*:int*/,        charCode /*:int*/) /*:Void*/                             
    {
        //check target
        target = YAHOO.util.Dom.get(target);        
        if (!target){
            throw new Error("simulateKeyEvent(): Invalid target.");
        }
        
        //check event type
        if (YAHOO.lang.isString(type)){
            type = type.toLowerCase();
            switch(type){
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                case "textevent": //DOM Level 3
                    type = "keypress";
                default:
                    throw new Error("simulateKeyEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateKeyEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (!YAHOO.lang.isBoolean(bubbles)){
            bubbles = true; //all key events bubble
        }
        if (!YAHOO.lang.isBoolean(cancelable)){
            cancelable = true; //all key events can be cancelled
        }
        if (!YAHOO.lang.isObject(view)){
            view = window; //view is typically window
        }
        if (!YAHOO.lang.isBoolean(ctrlKey)){
            ctrlKey = false;
        }
        if (!YAHOO.lang.isBoolean(altKey)){
            altKey = false;
        }
        if (!YAHOO.lang.isBoolean(shiftKey)){
            shiftKey = false;
        }
        if (!YAHOO.lang.isBoolean(metaKey)){
            metaKey = false;
        }
        if (!YAHOO.lang.isNumber(keyCode)){
            keyCode = 0;
        }
        if (!YAHOO.lang.isNumber(charCode)){
            charCode = 0; 
        }
        
        //check for DOM-compliant browsers first
        if (YAHOO.lang.isFunction(document.createEvent)){
        
            //try to create a mouse event
            var event /*:MouseEvent*/ = null;
            
            try {
                
                //try to create key event
                event = document.createEvent("KeyEvents");
                
                /*
                 * Interesting problem: Firefox implemented a non-standard
                 * version of initKeyEvent() based on DOM Level 2 specs.
                 * Key event was removed from DOM Level 2 and re-introduced
                 * in DOM Level 3 with a different interface. Firefox is the
                 * only browser with any implementation of Key Events, so for
                 * now, assume it's Firefox if the above line doesn't error.
                 */
                //TODO: Decipher between Firefox's implementation and a correct one.
                event.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                    altKey, shiftKey, metaKey, keyCode, charCode);       
                
            } catch (ex /*:Error*/){

                /*
                 * If it got here, that means key events aren't officially supported. 
                 * Safari/WebKit is a real problem now. WebKit 522 won't let you
                 * set keyCode, charCode, or other properties if you use a
                 * UIEvent, so we first must try to create a generic event. The
                 * fun part is that this will throw an error on Safari 2.x. The
                 * end result is that we need another try...catch statement just to
                 * deal with this mess.
                 */
                try {

                    //try to create generic event - will fail in Safari 2.x
                    event = document.createEvent("Events");

                } catch (uierror /*:Error*/){

                    //the above failed, so create a UIEvent for Safari 2.x
                    event = document.createEvent("UIEvents");

                } finally {

                    event.initEvent(type, bubbles, cancelable);
    
                    //initialize
                    event.view = view;
                    event.altKey = altKey;
                    event.ctrlKey = ctrlKey;
                    event.shiftKey = shiftKey;
                    event.metaKey = metaKey;
                    event.keyCode = keyCode;
                    event.charCode = charCode;
          
                }          
             
            }
            
            //fire the event
            target.dispatchEvent(event);

        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
        
            //create an IE event object
            var event = document.createEventObject();
            
            //assign available properties
            event.bubbles = bubbles;
            event.cancelable = cancelable;
            event.view = view;
            event.ctrlKey = ctrlKey;
            event.altKey = altKey;
            event.shiftKey = shiftKey;
            event.metaKey = metaKey;
            
            /*
             * IE doesn't support charCode explicitly. CharCode should
             * take precedence over any keyCode value for accurate
             * representation.
             */
            event.keyCode = (charCode > 0) ? charCode : keyCode;
            
            //fire the event
            target.fireEvent("on" + type, event);  
                    
        } else {
            throw new Error("simulateKeyEvent(): No event simulation framework present.");
        }
    },

    /**
     * Simulates a mouse event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateMouseEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default 
     *      is true for all events except mousemove, for which the default 
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     * @param {int} screenX (Optional) The x-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} screenY (Optional) The y-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} clientX (Optional) The x-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {int} clientY (Optional) The y-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} button (Optional) The button being pressed while the event
     *      is executing. The value should be 0 for the primary mouse button
     *      (typically the left button), 1 for the terciary mouse button
     *      (typically the middle button), and 2 for the secondary mouse button
     *      (typically the right button). The default is 0.
     * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
     *      this is the element that the mouse has moved to. For mouseover
     *      events, this is the element that the mouse has moved from. This
     *      argument is ignored for all other events. The default is null.
     */
    simulateMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                   view /*:Window*/,        detail /*:int*/, 
                                   screenX /*:int*/,        screenY /*:int*/, 
                                   clientX /*:int*/,        clientY /*:int*/,       
                                   ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                   shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                   button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
    {
        
        //check target
        target = YAHOO.util.Dom.get(target);        
        if (!target){
            throw new Error("simulateMouseEvent(): Invalid target.");
        }
        
        //check event type
        if (YAHOO.lang.isString(type)){
            type = type.toLowerCase();
            switch(type){
                case "mouseover":
                case "mouseout":
                case "mousedown":
                case "mouseup":
                case "click":
                case "dblclick":
                case "mousemove":
                    break;
                default:
                    throw new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateMouseEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (!YAHOO.lang.isBoolean(bubbles)){
            bubbles = true; //all mouse events bubble
        }
        if (!YAHOO.lang.isBoolean(cancelable)){
            cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
        }
        if (!YAHOO.lang.isObject(view)){
            view = window; //view is typically window
        }
        if (!YAHOO.lang.isNumber(detail)){
            detail = 1;  //number of mouse clicks must be at least one
        }
        if (!YAHOO.lang.isNumber(screenX)){
            screenX = 0; 
        }
        if (!YAHOO.lang.isNumber(screenY)){
            screenY = 0; 
        }
        if (!YAHOO.lang.isNumber(clientX)){
            clientX = 0; 
        }
        if (!YAHOO.lang.isNumber(clientY)){
            clientY = 0; 
        }
        if (!YAHOO.lang.isBoolean(ctrlKey)){
            ctrlKey = false;
        }
        if (!YAHOO.lang.isBoolean(altKey)){
            altKey = false;
        }
        if (!YAHOO.lang.isBoolean(shiftKey)){
            shiftKey = false;
        }
        if (!YAHOO.lang.isBoolean(metaKey)){
            metaKey = false;
        }
        if (!YAHOO.lang.isNumber(button)){
            button = 0; 
        }
        
        //check for DOM-compliant browsers first
        if (YAHOO.lang.isFunction(document.createEvent)){
        
            //try to create a mouse event
            var event /*:MouseEvent*/ = document.createEvent("MouseEvents");
            
            //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (event.initMouseEvent){
                event.initMouseEvent(type, bubbles, cancelable, view, detail,
                                     screenX, screenY, clientX, clientY, 
                                     ctrlKey, altKey, shiftKey, metaKey, 
                                     button, relatedTarget);
            } else { //Safari
            
                //the closest thing available in Safari 2.x is UIEvents
                event = document.createEvent("UIEvents");
                event.initEvent(type, bubbles, cancelable);
                event.view = view;
                event.detail = detail;
                event.screenX = screenX;
                event.screenY = screenY;
                event.clientX = clientX;
                event.clientY = clientY;
                event.ctrlKey = ctrlKey;
                event.altKey = altKey;
                event.metaKey = metaKey;
                event.shiftKey = shiftKey;
                event.button = button;
                event.relatedTarget = relatedTarget;
            }
            
            /*
             * Check to see if relatedTarget has been assigned. Firefox
             * versions less than 2.0 don't allow it to be assigned via
             * initMouseEvent() and the property is readonly after event
             * creation, so in order to keep YAHOO.util.getRelatedTarget()
             * working, assign to the IE proprietary toElement property
             * for mouseout event and fromElement property for mouseover
             * event.
             */
            if (relatedTarget && !event.relatedTarget){
                if (type == "mouseout"){
                    event.toElement = relatedTarget;
                } else if (type == "mouseover"){
                    event.fromElement = relatedTarget;
                }
            }
            
            //fire the event
            target.dispatchEvent(event);

        } else if (YAHOO.lang.isObject(document.createEventObject)){ //IE
        
            //create an IE event object
            var event = document.createEventObject();
            
            //assign available properties
            event.bubbles = bubbles;
            event.cancelable = cancelable;
            event.view = view;
            event.detail = detail;
            event.screenX = screenX;
            event.screenY = screenY;
            event.clientX = clientX;
            event.clientY = clientY;
            event.ctrlKey = ctrlKey;
            event.altKey = altKey;
            event.metaKey = metaKey;
            event.shiftKey = shiftKey;

            //fix button property for IE's wacky implementation
            switch(button){
                case 0:
                    event.button = 1;
                    break;
                case 1:
                    event.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    event.button = 0;                    
            }    

            /*
             * Have to use relatedTarget because IE won't allow assignment
             * to toElement or fromElement on generic events. This keeps
             * YAHOO.util.Event.getRelatedTarget() functional.
             */
            event.relatedTarget = relatedTarget;
            
            //fire the event
            target.fireEvent("on" + type, event);
                    
        } else {
            throw new Error("simulateMouseEvent(): No event simulation framework present.");
        }
    },
   
    //--------------------------------------------------------------------------
    // Mouse events
    //--------------------------------------------------------------------------

    /**
     * Simulates a mouse event on a particular element.
     * @param {HTMLElement} target The element to click on.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseEvent
     * @static
     */
    fireMouseEvent : function (target /*:HTMLElement*/, type /*:String*/, 
                           options /*:Object*/) /*:Void*/
    {
        options = options || {};
        this.simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail, options.screenX,        
            options.screenY, options.clientX, options.clientY, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, options.button,         
            options.relatedTarget);        
    },

    /**
     * Simulates a click on a particular element.
     * @param {HTMLElement} target The element to click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method click
     * @static     
     */
    click : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "click", options);
    },
    
    /**
     * Simulates a double click on a particular element.
     * @param {HTMLElement} target The element to double click on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method dblclick
     * @static
     */
    dblclick : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireMouseEvent( target, "dblclick", options);
    },
    
    /**
     * Simulates a mousedown on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousedown
     * @static
     */
    mousedown : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mousedown", options);
    },
    
    /**
     * Simulates a mousemove on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mousemove
     * @static
     */
    mousemove : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mousemove", options);
    },
    
    /**
     * Simulates a mouseout event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved to.
     * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
     * toElement is assigned in its place. IE doesn't allow toElement to be
     * be assigned, so relatedTarget is assigned in its place. Both of these
     * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
     * in both browsers.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseout
     * @static
     */
    mouseout : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mouseout", options);
    },
    
    /**
     * Simulates a mouseover event on a particular element. Use "relatedTarget"
     * on the options object to specify where the mouse moved from.
     * Quirks: Firefox less than 2.0 doesn't set relatedTarget properly, so
     * fromElement is assigned in its place. IE doesn't allow fromElement to be
     * be assigned, so relatedTarget is assigned in its place. Both of these
     * concessions allow YAHOO.util.Event.getRelatedTarget() to work correctly
     * in both browsers.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseover
     * @static
     */
    mouseover : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mouseover", options);
    },
    
    /**
     * Simulates a mouseup on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method mouseup
     * @static
     */
    mouseup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireMouseEvent(target, "mouseup", options);
    },
    
    //--------------------------------------------------------------------------
    // Key events
    //--------------------------------------------------------------------------

    /**
     * Fires an event that normally would be fired by the keyboard (keyup,
     * keydown, keypress). Make sure to specify either keyCode or charCode as
     * an option.
     * @private
     * @param {String} type The type of event ("keyup", "keydown" or "keypress").
     * @param {HTMLElement} target The target of the event.
     * @param {Object} options Options for the event. Either keyCode or charCode
     *                         are required.
     * @method fireKeyEvent
     * @static
     */     
    fireKeyEvent : function (type /*:String*/, target /*:HTMLElement*/,
                             options /*:Object*/) /*:Void*/ 
    {
        options = options || {};
        this.simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, 
            options.keyCode, options.charCode);    
    },
    
    /**
     * Simulates a keydown event on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keydown
     * @static
     */
    keydown : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireKeyEvent("keydown", target, options);
    },
    
    /**
     * Simulates a keypress on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keypress
     * @static
     */
    keypress : function (target /*:HTMLElement*/, options /*:Object*/) /*:Void*/ {
        this.fireKeyEvent("keypress", target, options);
    },
    
    /**
     * Simulates a keyup event on a particular element.
     * @param {HTMLElement} target The element to act on.
     * @param {Object} options Additional event options (use DOM standard names).
     * @method keyup
     * @static
     */
    keyup : function (target /*:HTMLElement*/, options /*Object*/) /*:Void*/ {
        this.fireKeyEvent("keyup", target, options);
    }
    

};
YAHOO.register("yuitest", YAHOO.tool.TestRunner, {version: "@VERSION@", build: "@BUILD@"});
