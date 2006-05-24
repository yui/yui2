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
    names: ["global"],
    _stack: [], // holds all log msgs
    _startTime: new Date().getTime(), // static start timestamp
    _lastTime: this._startTime // timestamp of last logged message
};

/***************************************************************************
 * Events
 ***************************************************************************/
/**
 * Fired when a new category has been created. Subscribers receive the following
 * array:<br>
 *     - args[0] The category name
 */
YAHOO.widget.Logger.categoryCreateEvent = new YAHOO.util.CustomEvent("categoryCreate");

/**
 * Fired when a new name has been created. Subscribers receive the following
 * array:<br>
 *     - args[0] The class name
 */
YAHOO.widget.Logger.nameCreateEvent = new YAHOO.util.CustomEvent("nameCreate");

/**
 * Fired when a new log message has been created. Subscribers receive the
 * following array:<br>
 *     - args[0] The log message
 */
YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent("newLog");

/**
 * Fired when the Logger has been reset has been created.
 */
YAHOO.widget.Logger.logResetEvent = new YAHOO.util.CustomEvent("logReset");

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Saves a log message to the stack and fires newLogEvent. If the log message is
 * assigned to an unknown category, creates a new category. If Firebug is enabled,
 * outputs the log message to Firebug.
 *
 * @param {string} sMsg The log message
 * @param {string} sCategory Category of log message, or null
 * @param {string} sName Name of LogWriter, or null if none
 */
YAHOO.widget.Logger.log = function(sMsg, sCategory, sName) {
    if(this.loggerEnabled) {
        if(!sCategory) {
            sCategory = "info"; // default category
        }
        else if(this._isNewCategory(sCategory)) {
            this._createNewCategory(sCategory);
        }
        if(!sName) {
            sName = "global"; // default namespace
        }
        else if(this._isNewName(sName)) {
            this._createNewName(sName);
        }

        var timestamp = new Date();
        var logEntry = {
            time: timestamp,
            category: sCategory,
            name: sName,
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
}

/**
 * Enables output to the Firebug Firefox extension.
 */
YAHOO.widget.Logger.enableFirebug = function() {
    this._firebugEnabled = true;
    YAHOO.log("YAHOO.Logger output to Firebug has been enabled.");
}

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
 * Creates a new name for log messages and fires nameCreateEvent.
 *
 * @param {string} name Class name
 * @private
 */
YAHOO.widget.Logger._createNewName = function(name) {
    this.names.push(name);
    this.nameCreateEvent.fire(name);
};

/**
 * Checks to see if a name has already been created.
 *
 * @param {string} name Class name
 * @return {boolean} Returns true if name is unknown, else returns false
 * @private
 */
YAHOO.widget.Logger._isNewName = function(name) {
    if(name) {
        for(var i=0; i < this.names.length; i++) {
            if(name == this.names[i]) {
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
    var elapsedTime = msecs - this._lastTime;
    this._lastTime = msecs;
    
    var name = (entry.name) ? entry.name + ": " : "";

    var output = "<span class='"+category+"'>"+label+"</span> " +
        localTime + " (" +
        elapsedTime + "): " +
        name +
        entry.msg;

    this._firebugEnabled = printfire(output);
};

/**
 * Firebug integration method. Outputs log message to Firebug.
 */
function printfire() {
    if(document.createEvent) {
        try {
            printfire.args = arguments;
            var ev = document.createEvent("Events");
            ev.initEvent("printfire", false, true);
            dispatchEvent(ev);
            return true;
        }
        catch(e) {
        }
    }
    return false;
}


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
        YAHOO.widget.Logger.log(null, msg+' ('+url+', line '+line+')', "window");
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

