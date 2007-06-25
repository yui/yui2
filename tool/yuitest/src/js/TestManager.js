YAHOO.namespace("tool");

//-----------------------------------------------------------------------------
// TestManager object
//-----------------------------------------------------------------------------

/**
 * Runs pages containing test suite definitions.
 * @namespace YAHOO.tool
 * @class TestManager
 * @static
 */
YAHOO.tool.TestManager = {

    //-------------------------------------------------------------------------
    // Private Properties
    //-------------------------------------------------------------------------
    
    
    /**
     * The URL of the page currently being executed.
     * @type String
     * @private
     * @property _curPage
     * @static
     */
    _curPage /*:String*/ : null,
    
    /**
     * The frame used to load and run tests.
     * @type Window
     * @private
     * @property _frame
     * @static
     */
    _frame /*:Window*/ : null,
    
    /**
     * The logger used to output results from the various tests.
     * @type YAHOO.tool.TestLogger
     * @private
     * @property _logger
     * @static
     */
    _logger : null,
    
    /**
     * The timeout ID for the next iteration through the tests.
     * @type int
     * @private
     * @property _timeoutId
     * @static
     */
    _timeoutId /*:int*/ : 0,
    
    /**
     * Array of pages to load.
     * @type String[]
     * @private
     * @property _pages
     * @static
     */
    _pages /*:String[]*/ : new Array(),
    
    /**
     * Results for each test page.
     * @type Object
     * @private
     * @property _results
     * @static
     */
    _results /*:Object*/ : new Object(),
    
    //-------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------
    
    /**
     * Handles TestRunner.COMPLETE_EVENT, storing the results and beginning
     * the loop again.
     * @param {Object} data Data about the event.
     * @return {Void}
     * @private
     * @static
     */
    _handleTestRunnerComplete : function (data /*:Object*/) /*:Void*/ {
    
        //save results
        this._results[this.curPage] = data.results;
        
        //process 'em
        this._processResults(this.curPage, data.results);
        
        this._logger.clearTestRunner();
    
        //if there's more to do, set a timeout to begin again
        if (this._pages.length){
            this._timeoutId = setTimeout(function(){
                YAHOO.tool.TestManager._run();
            }, 1000);
        }
    },
    
    /**
     * Processes the results of a test page run, outputting log messages
     * for failed tests.
     * @return {Void}
     * @private
     * @static
     */
    _processResults : function (page /*:String*/, results /*:Object*/) /*:Void*/ {

    },
    
    /**
     * Loads the next test page into the iframe.
     * @return {Void}
     * @static
     * @private
     */
    _run : function () /*:Void*/ {
    
        //set the current page
        this._curPage = this._pages.shift();
        
        //load the frame - destroy history in case there are other iframes that
        //need testing
        this._frame.location.replace(this._curPage);
    
    },
        
    //-------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------
    
    /**
     * Signals that a test page has been loaded. This should be called from
     * within the test page itself to notify the TestManager that it is ready.
     * @return {Void}
     * @static
     */
    load : function () /*:Void*/ {
        if (parent.YAHOO.tool.TestManager !== this){
            parent.YAHOO.tool.TestManager.load();
        } else {
            
            //assign event handling
            var TestRunner = this._frame.YAHOO.tool.TestRunner;
            this._logger.setTestRunner(TestRunner);
            TestRunner.subscribe(TestRunner.COMPLETE_EVENT, this._handleTestRunnerComplete, this, true);
            
            //run it
            TestRunner.run();
        }
    },
    
    /**
     * Sets the pages to be loaded.
     * @param {String[]} pages An array of URLs to load.
     * @return {Void}
     * @static
     */
    setPages : function (pages /*:String[]*/) /*:Void*/ {
        this._pages = pages;
    },
    
    /**
     * Begins the process of running the tests.
     * @return {Void}
     * @static
     */
    start : function () /*:Void*/ {
    
        //create iframe if not already available
        if (!this._frame){
            var frame /*:HTMLElement*/ = document.createElement("iframe");
            frame.style.visibility = "hidden";
            frame.style.position = "absolute";
            document.body.appendChild(frame);
            this._frame = frame.contentWindow || frame.contentDocument.ownerWindow;
        }
        
        //create test logger if not already available
        if (!this._logger){
            this._logger = new YAHOO.tool.TestLogger();
        }
        
        this._run();
    
    },

    /**
     * Stops the execution of tests.
     * @return {Void}
     * @static
     */
    stop : function () /*:Void*/ {
        clearTimeout(this._timeoutId);
    }

};


