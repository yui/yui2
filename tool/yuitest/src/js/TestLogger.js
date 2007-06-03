YAHOO.namespace("tool");

//-----------------------------------------------------------------------------
// TestLogger object
//-----------------------------------------------------------------------------

/**
 * Displays test execution progress and results, providing filters based on
 * different key events.
 * @namespace YAHOO.tool
 * @class TestLogger
 * @constructor
 * @param {HTMLElement} element (Optional) The element to create the logger in.
 * @param {Object} config (Optional) Configuration options for the logger.
 */
YAHOO.tool.TestLogger = function (element, config) {
    YAHOO.tool.TestLogger.superclass.constructor.call(this, element, config);
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
    
        //setup event _handlers
        YAHOO.tool.TestRunner.subscribe("pass", this._handlePass, this, true);
        YAHOO.tool.TestRunner.subscribe("fail", this._handleFail, this, true);
        YAHOO.tool.TestRunner.subscribe("ignore", this._handleIgnore, this, true);
        YAHOO.tool.TestRunner.subscribe("begin", this._handleBegin, this, true);
        YAHOO.tool.TestRunner.subscribe("complete", this._handleComplete, this, true);
        YAHOO.tool.TestRunner.subscribe("testsuitebegin", this._handleTestSuiteBegin, this, true);
        YAHOO.tool.TestRunner.subscribe("testsuitecomplete", this._handleTestSuiteComplete, this, true);
        YAHOO.tool.TestRunner.subscribe("testcasebegin", this._handleTestCaseBegin, this, true);
        YAHOO.tool.TestRunner.subscribe("testcasecomplete", this._handleTestCaseComplete, this, true);
        
        //reset the logger
        YAHOO.widget.Logger.reset();
    },
    
    
    _calculateTotals : function (results /*:Object*/) /*:Object*/ {
    
        var totals /*:Object*/ = { passed: 0, failed: 0, total: 0 };
        
        if (YAHOO.lang.isNumber(results.passed)){
            totals.passed += results.passed;
            totals.failed += results.failed;
            totals.total += results.total;          
        } else {
            for (var prop in results){
                var subtotal /*:Object*/ = this._calculateTotals(results[prop]);
                totals.passed += subtotal.passed;
                totals.failed += subtotal.failed;
                totals.total += subtotal.total;                
            }
        }
        
        return totals;
    
    },
    
    //-------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------

    _handleBegin : function (data /*:Object*/) {
        YAHOO.log("Testing began at " + (new Date()).toString(), "info", "TestRunner");
    },
    
    _handleComplete : function (data /*:Object*/) {
        
        //calculate totals
        var results /*:Object*/ = this._calculateTotals(data.results);
    
        YAHOO.log("Testing completed at " + (new Date()).toString() + ".\nPassed:" + results.passed + " Failed:" + results.failed + " Total:" + results.total, "info", "TestRunner");
    },

    /**
     * Handles an error event for the TestRunner object.
     * @param data Information about the event.
     */
    _handleFail : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": " + data.error.getMessage(), "fail", "TestRunner");
    },

    /**
     * Handles an ignore event for the TestRunner object.
     * @param data Information about the event.
     */
    _handleIgnore : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": ignored", "ignore", "TestRunner");
    },

    /**
     * Handles an error event for the TestRunner object.
     * @param data Information about the event.
     */
    _handlePass : function (data /*:Object*/) {
        YAHOO.log(data.testName + ": passed", "pass", "TestRunner");
    },
    
    _handleTestSuiteBegin : function (data /*:Object*/) {
        var testSuiteName /*:String*/ = data.testSuite.name || "Unnamed test suite";
        YAHOO.log("Test suite \"" + testSuiteName + "\" started", "info", "TestRunner");
    },
    
    _handleTestSuiteComplete : function (data /*:Object*/) {
        var testSuiteName /*:String*/ = data.testSuite.name || "Unnamed test suite";
        YAHOO.log("Test suite \"" + testSuiteName + "\" completed", "info", "TestRunner");
    },
    
    _handleTestCaseBegin : function (data /*:Object*/) {
        var testCaseName /*:String*/ = data.testCase.name || "Unnamed test case";
        YAHOO.log("Test case \"" + testCaseName + "\" started", "info", "TestRunner");
    },
    
    _handleTestCaseComplete : function (data /*:Object*/) {
        var testCaseName /*:String*/ = data.testCase.name || "Unnamed test case";
        YAHOO.log("Test case \"" + testCaseName + "\" completed.\nPassed:" + data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total, "info", "TestRunner");
    }
    
});
