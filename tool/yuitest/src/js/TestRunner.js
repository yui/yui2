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
                        if (!shouldError[tests[i]]) {
                            error = new YAHOO.util.UnexpectedError(thrown);
                            failed = true;
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
