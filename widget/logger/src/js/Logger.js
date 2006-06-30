/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/**
 * Singleton providing core logging functionality. Saves logs written through the
 * global YAHOO.log function or written by LogWriter. Provides access to logs
 * for reading by LogReader. Log messages are automatically output to Firebug,
 * if present.
 *
 * requires YAHOO.util.Event Event utility
 */
YAHOO.widget.Logger = {
    // Initialize members
    loggerEnabled: true,
    _firebugEnabled: true,
    categories: ["info","warn","error","time","window"],
    sources: ["global"],
    _stack: [], // holds all log msgs
    _startTime: new Date().getTime(), // static start timestamp
    _lastTime: null // timestamp of last logged message
};

/***************************************************************************
 * Events
 ***************************************************************************/
/**
 * Fired when a new category has been created. Subscribers receive the following
 * array:<br>
 *     - args[0] The category name
 */
YAHOO.widget.Logger.categoryCreateEvent = new YAHOO.util.CustomEvent("categoryCreate", this, true);

/**
 * Fired when a new source has been named. Subscribers receive the following
 * array:<br>
 *     - args[0] The source name
 */
YAHOO.widget.Logger.sourceCreateEvent = new YAHOO.util.CustomEvent("sourceCreate", this, true);

/**
 * Fired when a new log message has been created. Subscribers receive the
 * following array:<br>
 *     - args[0] The log message
 */
YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent("newLog", this, true);

/**
 * Fired when the Logger has been reset has been created.
 */
YAHOO.widget.Logger.logResetEvent = new YAHOO.util.CustomEvent("logReset", this, true);

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Saves a log message to the stack and fires newLogEvent. If the log message is
 * assigned to an unknown category, creates a new category. If the log message is
 * from an unknown source, creates a new source.  If Firebug is enabled,
 * outputs the log message to Firebug.
 *
 * @param {string} sMsg The log message
 * @param {string} sCategory Category of log message, or null
 * @param {string} sSource Source of LogWriter, or null if global
 */
YAHOO.widget.Logger.log = function(sMsg, sCategory, sSource) {
    if(this.loggerEnabled) {
        if(!sCategory) {
            sCategory = "info"; // default category
        }
        else if(this._isNewCategory(sCategory)) {
            this._createNewCategory(sCategory);
        }
        var sClass = "global"; // default source
        var sDetail = null;
        if(sSource) {
            var spaceIndex = sSource.indexOf(" ");
            if(spaceIndex > 0) {
                sClass = sSource.substring(0,spaceIndex);// substring until first space
                sDetail = sSource.substring(spaceIndex,sSource.length);// the rest of the source
            }
            else {
                sClass = sSource;
            }
            if(this._isNewSource(sClass)) {
                this._createNewSource(sClass);
            }
        }

        var timestamp = new Date();
        var logEntry = {
            time: timestamp,
            category: sCategory,
            source: sClass,
            sourceDetail: sDetail,
            msg: sMsg
        };

        this._stack.push(logEntry);
        this.newLogEvent.fire(logEntry);

        if(this._firebugEnabled) {
            this._printToFirebug(logEntry);
        }
        return true;
    }
    else {
        return false;
    }
};

/**
 * Resets internal stack and startTime, enables Logger, and fires logResetEvent.
 *
 */
YAHOO.widget.Logger.reset = function() {
    this._stack = [];
    this._startTime = new Date().getTime();
    this.loggerEnabled = true;
    this.log(null, "Logger reset");
    this.logResetEvent.fire();
};

/**
 * Public accessor to internal stack of log messages.
 *
 * @return {array} Array of log messages.
 */
YAHOO.widget.Logger.getStack = function() {
    return this._stack;
};

/**
 * Public accessor to internal start time.
 *
 * @return {date} Internal date of when Logger singleton was initialized.
 */
YAHOO.widget.Logger.getStartTime = function() {
    return this._startTime;
};

/**
 * Disables output to the Firebug Firefox extension.
 */
YAHOO.widget.Logger.disableFirebug = function() {
    YAHOO.log("YAHOO.Logger output to Firebug has been disabled.");
    this._firebugEnabled = false;
};

/**
 * Enables output to the Firebug Firefox extension.
 */
YAHOO.widget.Logger.enableFirebug = function() {
    this._firebugEnabled = true;
    YAHOO.log("YAHOO.Logger output to Firebug has been enabled.");
};

/***************************************************************************
 * Private methods
 ***************************************************************************/
/**
 * Creates a new category of log messages and fires categoryCreateEvent.
 *
 * @param {string} category Category name
 * @private
 */
YAHOO.widget.Logger._createNewCategory = function(category) {
    this.categories.push(category);
    this.categoryCreateEvent.fire(category);
};

/**
 * Checks to see if a category has already been created.
 *
 * @param {string} category Category name
 * @return {boolean} Returns true if category is unknown, else returns false
 * @private
 */
YAHOO.widget.Logger._isNewCategory = function(category) {
    for(var i=0; i < this.categories.length; i++) {
        if(category == this.categories[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Creates a new source of log messages and fires sourceCreateEvent.
 *
 * @param {string} source Source name
 * @private
 */
YAHOO.widget.Logger._createNewSource = function(source) {
    this.sources.push(source);
    this.sourceCreateEvent.fire(source);
};

/**
 * Checks to see if a source has already been created.
 *
 * @param {string} source Source name
 * @return {boolean} Returns true if source is unknown, else returns false
 * @private
 */
YAHOO.widget.Logger._isNewSource = function(source) {
    if(source) {
        for(var i=0; i < this.sources.length; i++) {
            if(source == this.sources[i]) {
                return false;
            }
        }
        return true;
    }
};

/**
 * Outputs a log message to Firebug.
 *
 * @param {object} entry Log entry object
 * @private
 */
YAHOO.widget.Logger._printToFirebug = function(entry) {
    if(window.console && console.log) {
        var category = entry.category;
        var label = entry.category.substring(0,4).toUpperCase();

        var time = entry.time;
        if (time.toLocaleTimeString) {
            var localTime  = time.toLocaleTimeString();
        }
        else {
            localTime = time.toString();
        }

        var msecs = time.getTime();
        var elapsedTime = (YAHOO.widget.Logger._lastTime) ?
            (msecs - YAHOO.widget.Logger._lastTime) : 0;
        YAHOO.widget.Logger._lastTime = msecs;

        var output = //Firebug doesn't support HTML "<span class='"+category+"'>"+label+"</span> " +
            localTime + " (" +
            elapsedTime + "ms): " +
            entry.source + ": " +
            entry.msg;

        
        console.log(output);
    }
};

/***************************************************************************
 * Private event handlers
 ***************************************************************************/
/**
 * Handles logging of messages due to window error events.
 *
 * @param {string} msg The error message
 * @param {string} url URL of the error
 * @param {string} line Line number of the error
 * @private
 */
YAHOO.widget.Logger._onWindowError = function(msg,url,line) {
    // Logger is not in scope of this event handler
    try {
        YAHOO.widget.Logger.log(msg+' ('+url+', line '+line+')', "window");
        if(YAHOO.widget.Logger._origOnWindowError) {
            YAHOO.widget.Logger._origOnWindowError();
        }
    }
    catch(e) {
        return false;
    }
};

/**
 * Handle native JavaScript errors
 */
//NB: Not all browsers support the window.onerror event
if(window.onerror) {
    // Save any previously defined handler to call
    YAHOO.widget.Logger._origOnWindowError = window.onerror;
}
window.onerror = YAHOO.widget.Logger._onWindowError;

/**
 * First log
 */
YAHOO.widget.Logger.log("Logger initialized");

