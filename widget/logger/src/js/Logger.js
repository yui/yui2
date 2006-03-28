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
    this.logEnabled = true;
    this.footerEnabled = true;
    this.firebugEnabled; // undefined at initialization
    this._stack = []; // holds all log msgs
    this._startTime = new Date().getTime(); // static start timestamp
    this._lastTime = this._startTime; // timestamp of last absolute log message
    this._lastFilteredTime = this._startTime; // timestamp of last log message to console
    this._buffer = []; // output buffer
    this._timeout = null; // output buffer timeout
    this._types = ["info","warn","error","time","window"];
    this._filters = ["info","warn","error","time","window"];
};
/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Shows UI to read logs.
 *
 * @param {element} containerEl Container element to hold console UI
 * @param {object} oConfig Object literal of configuration data
 */
YAHOO.widget.Logger.show = function(containerEl, oConfig) {
    var oSelf = this;
    
    // Attach container...
    if(containerEl) {
        if(typeof containerEl == "string") {
            this._containerEl = document.getElementById(containerEl);
        }
        else if(containerEl.tagName) {
            this._containerEl = containerEl;
        }
    }
    // ...or create container from scratch
    if(!this._containerEl) {
        this._containerEl = document.body.appendChild(document.createElement("div"));
        this._containerEl.id = "ylogger";
        this._containerEl.style.position = "absolute";
        this._containerEl.style.top = "1em";
        this._containerEl.style.right = "1em";
        this._containerEl.style.zIndex = "9000";
        this._containerCreated = true;
    }

    // Parse config vars here
    if (typeof oConfig == "object") {
        for(var param in oConfig) {
            this[param] = oConfig[param];
        }
    }
    
    if(this._containerEl) {
        // Create header
        if(!this._hdEl) {
            this._hdEl = this._containerEl.appendChild(document.createElement("div"));
            this._hdEl.id = "ylog_hd";
            this._collapseEl = this._hdEl.appendChild(document.createElement("div"));
            this._collapseEl.id = "ylog_collapse";

            this._collapseBtn = document.createElement("input");
            this._collapseBtn.id = "ylog_collapseBtn";
            this._collapseBtn.type = "button"
            this._collapseBtn.value = "Collapse";
            this._collapseBtn = this._collapseEl.appendChild(this._collapseBtn);
            YAHOO.util.Event.addListener(oSelf._collapseBtn,'click',oSelf._onClickCollapseBtn,oSelf);

            this._title = this._hdEl.appendChild(document.createElement("h4"));
            this._title.innerHTML = "Logger Console";
        }
        // If Drag and Drop utility is available...
        // ...and container was created from scratch...
        // ...then make the header draggable
        if(this._containerCreated && YAHOO.util.DD) {
            var ylog_dd = new YAHOO.util.DD(this._containerEl.id);
            ylog_dd.setHandleElId(this._hdEl.id);
        }
        // Ceate console
        if(!this._consoleEl) {
            this._consoleEl = this._containerEl.appendChild(document.createElement("div"));
            this._consoleEl.id = "ylog_bd";
        }
        // Don't create footer if disabled
        if(!this._ftEl && this.footerEnabled) {
            this._ftEl = this._containerEl.appendChild(document.createElement("div"));
            this._ftEl.id = "ylog_ft";

            this._btnsEl = this._ftEl.appendChild(document.createElement("div"));
            this._btnsEl.id = "ylog_btns";

            this._pauseBtn = document.createElement("input");
            this._pauseBtn.id = "ylog_pauseBtn";
            this._pauseBtn.type = "button";
            this._pauseBtn.value = "Pause";
            this._pauseBtn = this._btnsEl.appendChild(this._pauseBtn);
            YAHOO.util.Event.addListener(oSelf._pauseBtn,'click',oSelf._onClickPauseBtn,oSelf);

            this._resetBtn = document.createElement("input");
            this._resetBtn.id = "ylog_resetBtn";
            this._resetBtn.type = "button";
            this._resetBtn.value = "Reset";
            this._resetBtn = this._btnsEl.appendChild(this._resetBtn);
            YAHOO.util.Event.addListener(oSelf._resetBtn,'click',oSelf._onClickResetBtn,oSelf);

            this._filtersEl = this._ftEl.appendChild(document.createElement("div"));

            /*this._filterBtn = document.createElement("input");
            this._filterBtn.id = "ylog_filterBtn";
            this._filterBtn.type = "button";
            this._filterBtn.value = "Filter All";
            this._filterBtn = this._filtersEl.appendChild(this._filterBtn);
            YAHOO.util.Event.addListener(oSelf._filterBtn,'click',oSelf._onClickFilterAllBtn,oSelf);*/

            var typesLen = this._types.length;
            for(var i=0; i < typesLen; i++) {
                this._createTypeUI(this._types[i]);
            }
        }
    }
    this.setFiltersNone();
};

YAHOO.widget.Logger.log = function(sName, sMsg, type) {
    //TODO: Fire a custom event so that anyone can subscribe
    if(this.logEnabled) {
        if(!type) {
            type = "info"; // default type
        }
        else if(this._isNewType(type)) {
            this._createNewType(type);
        }

        var timestamp = new Date();
        var logEntry = {
            time: timestamp,
            type: type,
            name: sName,
            msg: sMsg
            //msg: name + dateStr +
            //    " (" + totalSeconds + ") " +
            //    timeStamp + "ms:\n" +
            //    sMsg
        };
        //var output = this._formatMessage(logEntry);
        //logEntry.output = output;

        this._buffer.push(logEntry);
        this._stack.push(logEntry);

        if (this._timeout == null) {
            this._timeout = setTimeout(function(){YAHOO.widget.Logger._printBuffer()}, 100);
        }
    }
};

YAHOO.widget.Logger.pause = function() {
    YAHOO.widget.Logger.log(null, "Logger paused");
    this.logEnabled = false;
};

YAHOO.widget.Logger.resume = function() {
    this.logEnabled = true;
    YAHOO.widget.Logger.log(null, "Logger resumed");
};

YAHOO.widget.Logger.setFilters = function() {
    // Iterate through all filter checkboxes
    // since some may have been dynamically added and
    // track which filters to enable
    if(this._containerEl && this._consoleEl && this._ftEl) {
        this._filters = [];
        var typesLen = this._types.length;
        for(var i=0; i<typesLen; i++) {
            var filterChk = document.getElementById("ylog_filter"+this._types[i]);
            if(filterChk.checked) {
                this._filters.push(this._types[i]);
            }
        }
    }
    
    // Reprint stack with new filters
    if (this._consoleEl != null) {
        this._clearConsole();
        this._printToConsole(this._stack);
    }
};

YAHOO.widget.Logger.setFiltersAll = function() {
    this._filters = [];
    if (this._consoleEl != null) {
        this._clearConsole();
    }
};

YAHOO.widget.Logger.setFiltersNone = function() {
    this._filters = this._types;
    if (this._consoleEl != null) {
        this._clearConsole();
        this._printToConsole(this._stack);
    }
};

YAHOO.widget.Logger.reset = function() {
    this._timeout = null;
    this._lastTime = new Date().getTime();
    this._lastConsoleTime = new Date().getTime();
    this._startTime = new Date().getTime();
    this._stack = [];
    this._buffer = [];
    this.logEnabled = true;

    if (this._consoleEl != null) {
        this._clearConsole();
    }

    this.log(null, "Logger reset");
};

YAHOO.widget.Logger.hide = function() {
    this._containerEl.parentNode.removeChild(this._containerEl);
    this._ftEl = null;
    this._consoleEl = null;
    this._hdEl = null;
    this._containerEl = null;
}

/***************************************************************************
 * Private methods
 ***************************************************************************/
YAHOO.widget.Logger._clearConsole = function() {
    // Clear the buffer of any pending messages
    this._timeout = null;
    this._buffer = [];
    
    // Reset the rolling timer
    this._lastFilteredTime = this._startTime;
    this._lastTime = this._startTime;
    
    var consoleEl = this._consoleEl;
    while(consoleEl.hasChildNodes()) {
        consoleEl.removeChild(consoleEl.firstChild);
    }
};

YAHOO.widget.Logger._createNewType = function(type) {
    this._types.push(type);
    this._filters.push(type);
    
    // Add a new filter checkbox to UI
    if(this._containerEl && this._consoleEl && this._ftEl) {
        this._createTypeUI(type);
    }
};

YAHOO.widget.Logger._createTypeUI = function(type) {
    var oSelf = this;

    // Append el at the end so IE 5.5 can set "type" attribute
    var typeChk = document.createElement("input");
    typeChk.id = "ylog_filter" + type;
    typeChk.type = "checkbox";
    typeChk.checked = true;
    typeChk = this._filtersEl.appendChild(typeChk);
    YAHOO.util.Event.addListener(typeChk,'click',oSelf._onCheckFilter,oSelf);

    var typeLbl = this._filtersEl.appendChild(document.createElement("span"));
    typeLbl.className = type;
    typeLbl.innerHTML = type;
}

YAHOO.widget.Logger._isNewType = function(type) {
    for(var i=0; i < this._types.length; i++) {
        if(type == this._types[i]) {
            return false;
        }
    }
    return true;
};

YAHOO.widget.Logger._printBuffer = function() {
    this._timeout = null;
    var entries = [];
    for (var i=0; i<this._buffer.length; i++) {
        entries[i] = this._buffer[i];
    }
    this._buffer = [];
    
    //TODO: either/or firebug?
    if (this.firebugEnabled !== false) {
        this._printToFirebug(entries);
    }

    if (this._consoleEl != null) {
        this._printToConsole(entries);
    }
};

YAHOO.widget.Logger._printToConsole = function(entries) {
    var entriesLen = entries.length;
    var filterLen = this._filters.length;
    // Iterate through all log entries...
    for(var i=0; i<entriesLen; i++) {
        var entry = entries[i];
        var type = entry.type;
        // ...and only print the ones that filter through
        for(var j=0; j<filterLen; j++) {
            if(type == this._filters[j]) {
            
                // formatting to console
                // calculate the elapsed time to be from the last item that passed through the filter,
                // not the absolute previous item in the stack
                var label = type.substring(0,4).toUpperCase();

                var time = entry.time;
                if (time.toLocaleTimeString) {
                    var localTime  = time.toLocaleTimeString();
                }
                else {
                    localTime = time.toString();
                }

                var msecs = time.getTime();
                var elapsedTime = msecs - this._lastFilteredTime;
                this._lastFilteredTime = msecs;

                var name = (entry.name) ? entry.name + ": " : "";

                var output =  "<span class='"+type+"'>"+label+"</span> " +
                    localTime + " (" +
                    elapsedTime + "): " +
                    name +
                    entry.msg;

                var oNewElement = this._consoleEl.insertBefore(document.createElement("p"),this._consoleEl.firstChild);
                oNewElement.innerHTML = output;
                break;
            }
        }
    }
};

YAHOO.widget.Logger._printToFirebug = function(entries) {
    for (var i = 0; i < entries.length; i++) {
        // format message for firebug -- elapsed time is calculated from the absolute
        // previous entry in the stack
        var entry = entries[i];
        var type = entry.type;
        var label = entry.type.substring(0,4).toUpperCase();

        var time = entry.time;
        if (time.toLocaleTimeString) {
            var localTime  = time.toLocaleTimeString();
        }
        else {
            localTime = time.toString();
        }

        var msecs = time.getTime();//alert(msecs +' and '+this._lastTime+' and '+(msecs - this._lastTime));
        var elapsedTime = msecs - this._lastTime;
        this._lastTime = msecs;
        
        var name = (entry.name) ? entry.name + ": " : "";

        var output = "<span class='"+type+"'>"+label+"</span> " +
            localTime + " (" +
            elapsedTime + "): " +
            name +
            entry.msg;

        this.firebugEnabled = printfire(output);
    }
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
YAHOO.widget.Logger._onClickCollapseBtn = function(v, oSelf) {
    var btn = oSelf._collapseBtn;
    if(btn.value == "Expand") {
        oSelf._consoleEl.style.display = "block";
        if(oSelf._ftEl) {
            oSelf._ftEl.style.display = "block";
        }
        btn.value = "Collapse";
    }
    else {
        oSelf._consoleEl.style.display = "none";
        if(oSelf._ftEl) {
            oSelf._ftEl.style.display = "none";
        }
        btn.value = "Expand";
    }
};

YAHOO.widget.Logger._onClickPauseBtn = function(v, oSelf) {
    var btn = oSelf._pauseBtn;
    if(btn.value == "Resume") {
        oSelf.resume();
        btn.value = "Pause";
    }
    else {
        oSelf.pause();
        btn.value = "Resume";
    }
};

YAHOO.widget.Logger._onClickResetBtn = function(v, oSelf) {
    oSelf.reset();
};

YAHOO.widget.Logger._onClickFilterAllBtn = function(v, oSelf) {
    var btn = oSelf._filterBtn;
    // Filter all
    if(btn.value == "Filters Off") {
        YAHOO.widget.Logger.setFiltersNone();
        // Check all checkboxes in UI
        if(oSelf._ftEl) {
            var typesLen = oSelf._types.length;
            for(var i=0; i<typesLen; i++) {
                var filterChk = document.getElementById("ylog_filter"+oSelf._types[i]);
                filterChk.checked = true;
            }
        }
        btn.value = "Filter All";
    }
    // Filter none
    else {
        YAHOO.widget.Logger.setFiltersAll();
        // Uncheck all checkboxes in UI
        if(oSelf._ftEl) {
            var typesLen = oSelf._types.length;
            for(var i=0; i<typesLen; i++) {
                var filterChk = document.getElementById("ylog_filter"+oSelf._types[i]);
                filterChk.checked = false;
            }
        }
        btn.value = "Filters Off";
    }
};

YAHOO.widget.Logger._onCheckFilter = function(v, oSelf) {
    oSelf.setFilters();
};

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

