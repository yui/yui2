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
 * Runs test suites and test cases, providing events to allowing for the
 * interpretation of test results.
 * @namespace YAHOO.tool
 * @class TestRunner
 * @static
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
        
        /**
         * Fires when a test case is opened but before the first 
         * test is executed.
         * @event testcasebegin
         */
        this.createEvent("testcasebegin", {scope: this});
        
        /**
         * Fires when all tests in a test case have been executed.
         * @event testcasecomplete
         */        
        this.createEvent("testcasecomplete", {scope: this});
        
        /**
         * Fires when a test suite is opened but before the first 
         * test is executed.
         * @event testsuitebegin
         */
        this.createEvent("testsuitebegin", {scope: this});
        
        /**
         * Fires when all test cases in a test suite have been
         * completed.
         * @event testsuitecomplete
         */
        this.createEvent("testsuitecomplete", {scope: this});
        
        /**
         * Fires when a test has passed.
         * @event pass
         */
        this.createEvent("pass", {scope: this});
        
        /**
         * Fires when a test has failed.
         * @event fail
         */
        this.createEvent("fail", {scope: this});
        
        /**
         * Fires when a test has been ignored.
         * @event ignore
         */
        this.createEvent("ignore", {scope: this});
        
        /**
         * Fires when all test suites and test cases have been completed.
         * @event complete
         */        
        this.createEvent("complete", {scope: this});
        
        /**
         * Fires when the run() method is called.
         * @event begin
         */        
        this.createEvent("begin", {scope: this});        
    }
    
    YAHOO.lang.extend(TestRunner, YAHOO.util.EventProvider, {
    
    
        //-------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------
         
        /**
         * Runs a given test case.
         * @param {YAHOO.tool.TestCase} testCase The test case to run.
         * @return {Object} Results of the execution with properties passed, failed, and total.
         * @method _runTestCase
         * @private
         * @static
         */
        _runTestCase : function (testCase /*YAHOO.tool.TestCase*/) /*:Void*/{
        
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
                                if (!(thrown instanceof shouldError[tests[i]].constructor) || 
                                        thrown.message != shouldError[tests[i]].message){
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
         * @param {YAHOO.tool.TestSuite} testSuite The test suite to run.
         * @return {Object} Results of the execution with properties passed, failed, and total.
         * @method _runTestSuite
         * @private
         * @static
         */
        _runTestSuite : function (testSuite /*:YAHOO.tool.TestSuite*/) {
        
            //object to store results
            var results /*:Object*/ = {};
        
            //fireEvent event for beginning of test suite run
            this.fireEvent("testsuitebegin", { testSuite: testSuite });
        
            //iterate over the test suite items
            for (var i=0; i < testSuite.items.length; i++){
                if (testSuite.items[i] instanceof YAHOO.tool.TestSuite) {
                    results[testSuite.items[i].name] = this._runTestSuite(testSuite.items[i]);
                } else if (testSuite.items[i] instanceof YAHOO.tool.TestCase) {
                    results[testSuite.items[i].name] = this._runTestCase(testSuite.items[i]);
                }
            }
    
            //fireEvent event for completion of test suite run
            this.fireEvent("testsuitecomplete", { testSuite: testSuite, results: results });
            
            //return the results
            return results;
        
        },
        
        /**
         * Runs a test case or test suite, returning the results.
         * @param {YAHOO.tool.TestCase|YAHOO.tool.TestSuite} testObject The test case or test suite to run.
         * @return {Object} Results of the execution with properties passed, failed, and total.
         * @private
         * @method _run
         * @static
         */
        _run : function (testObject /*:YAHOO.tool.TestCase|YAHOO.tool.TestSuite*/) /*:Void*/ {
            if (YAHOO.lang.isObject(testObject)){
                if (testObject instanceof YAHOO.tool.TestSuite) {
                    return this._runTestSuite(testObject);
                } else if (testObject instanceof YAHOO.tool.TestCase) {
                    return this._runTestCase(testObject);
                } else {
                    throw new TypeError("_run(): Expected either YAHOO.tool.TestCase or YAHOO.tool.TestSuite.");
                }    
            }        
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
            
            this.fireEvent("begin");
       
            //an object passed in overrides everything else
            if (YAHOO.lang.isObject(testObject)){
                results = this._run(testObject);  
            } else {
                results = {};
                for (var i=0; i < this.items.length; i++){
                    results[this.items[i].name] = this._run(this.items[i]);
                }            
            }
            
            this.fireEvent("complete", { results: results });
        }    
    });
    
    return new TestRunner();
    
})();
