/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * Static class providing logging capabilities.
 *
 * @constructor
 *
 */
YAHOO.widget.Logger = new function() {
    // TODO: Expose in API doc?
    // Initialize members
    this.loggerEnabled = true;
    this.firebugEnabled; // undefined at initialization
    this.categories = ["info","warn","error","time","window"];
    this._stack = []; // holds all log msgs
    this._startTime = new Date().getTime(); // static start timestamp
    this._lastTime = this._startTime; // timestamp of last logged message
};

/***************************************************************************
 * Events
 ***************************************************************************/
YAHOO.widget.Logger.bufferDumpEvent = new YAHOO.util.CustomEvent("bufferDump");

YAHOO.widget.Logger.categoryCreateEvent = new YAHOO.util.CustomEvent("categoryCreate");

YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent("newLog");

/***************************************************************************
 * Public methods
 ***************************************************************************/
YAHOO.widget.Logger.log = function(sName, sMsg, sCategory) {
    if(this.loggerEnabled) {
        if(!sCategory) {
            sCategory = "info"; // default category
        }
        else if(this._isNewCategory(sCategory)) {
            this._createNewCategory(sCategory);
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

        //TODO: either/or firebug?
        //TODO: does firebug need a buffer?
        if (this.firebugEnabled !== false) {
            this._printToFirebug(logEntry);
        }
    }
};

YAHOO.widget.Logger.reset = function() {
    this._stack = [];
    this._startTime = new Date().getTime();
    this.loggerEnabled = true;
    this.log(null, "Logger reset");
};

YAHOO.widget.Logger.hide = function() {
    this._containerEl.parentNode.removeChild(this._containerEl);
    this._ftEl = null;
    this._consoleEl = null;
    this._hdEl = null;
    this._containerEl = null;
}

YAHOO.widget.Logger.getStack = function() {
    return this._stack;
}

YAHOO.widget.Logger.getStartTime = function() {
    return this._startTime;
}

/***************************************************************************
 * Private members
 ***************************************************************************/

/***************************************************************************
 * Private methods
 ***************************************************************************/
YAHOO.widget.Logger._createNewCategory = function(category) {
    this.categories.push(category);
    this.categoryCreateEvent.fire(category);
};

YAHOO.widget.Logger._isNewCategory = function(category) {
    for(var i=0; i < this.categories.length; i++) {
        if(category == this.categories[i]) {
            return false;
        }
    }
    return true;
};

YAHOO.widget.Logger._printToFirebug = function(entry) {
    //for (var i = 0; i < entries.length; i++) {
        // format message for firebug -- elapsed time is calculated from the absolute
        // previous entry in the stack
        //var entry = entries[i];
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

        this.firebugEnabled = printfire(output);
    //}
};

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
YAHOO.widget.Logger.log(null, "Logger initialized");

