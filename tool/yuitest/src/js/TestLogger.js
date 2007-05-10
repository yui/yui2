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
