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
    
        //shortcut variables
        var TestRunner /*:Object*/ = YAHOO.tool.TestRunner;
    
        //setup event _handlers
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.BEGIN_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.COMPLETE_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_SUITE_BEGIN_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_SUITE_COMPLETE_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_CASE_BEGIN_EVENT, this._handleTestRunnerEvent, this, true);
        YAHOO.tool.TestRunner.subscribe(TestRunner.TEST_CASE_COMPLETE_EVENT, this._handleTestRunnerEvent, this, true);
        
        //hide useless sources
        this.hideSource("global");
        this.hideSource("LogReader");
        
        //hide useless message categories
        this.hideCategory("warn");
        this.hideCategory("window");
        this.hideCategory("time");
        
        //reset the logger
        this.clearConsole();
    },
    
    //-------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------
    
    /**
     * Handles all TestRunner events, outputting appropriate data into the console.
     * @param {Object} data The event data object.
     * @return {Void}
     * @private
     */
    _handleTestRunnerEvent : function (data /*:Object*/) /*:Void*/ {
    
        //shortcut variables
        var TestRunner /*:Object*/ = YAHOO.tool.TestRunner;
    
        //data variables
        var message /*:String*/ = "";
        var messageType /*:String*/ = "";
        
        switch(data.type){
            case TestRunner.BEGIN_EVENT:
                message = "Testing began at " + (new Date()).toString() + ".";
                messageType = "info";
                break;
                
            case TestRunner.COMPLETE_EVENT:
                message = "Testing completed at " + (new Date()).toString() + ".\nPassed:" 
                    + data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total;
                messageType = "info";
                break;
                
            case TestRunner.TEST_FAIL_EVENT:
                message = data.testName + ": " + data.error.getMessage();
                messageType = "fail";
                break;
                
            case TestRunner.TEST_IGNORE_EVENT:
                message = data.testName + ": ignored.";
                messageType = "ignore";
                break;
                
            case TestRunner.TEST_PASS_EVENT:
                message = data.testName + ": passed.";
                messageType = "pass";
                break;
                
            case TestRunner.TEST_SUITE_BEGIN_EVENT:
                message = "Test suite \"" + data.testSuite.name + "\" started.";
                messageType = "info";
                break;
                
            case TestRunner.TEST_SUITE_COMPLETE_EVENT:
                message = "Test suite \"" + data.testSuite.name + "\" completed.\nPassed:" 
                    + data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total
                messageType = "info";
                break;
                
            case TestRunner.TEST_CASE_BEGIN_EVENT:
                message = "Test suite \"" + data.testCase.name + "\" started.";
                messageType = "info";
                break;
                
            case TestRunner.TEST_CASE_COMPLETE_EVENT:
                message = "Test suite \"" + data.testCase.name + "\" completed.\nPassed:" 
                    + data.results.passed + " Failed:" + data.results.failed + " Total:" + data.results.total
                messageType = "info";
                break;
            default:
                message = "Unexpected event " + data.type;
                message = "info";
        }
    
        YAHOO.log(message, messageType, "TestRunner");    
    }
    
});
