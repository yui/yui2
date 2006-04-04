/**
 * @class an instance of a logreader.
 *
 * @constructor
 */
YAHOO.widget.LogReader = function(containerEl, oConfig) {
    var oSelf = this;
        
    // Initialize memebers
    this.logReaderEnabled = true;
    this._lastTime = YAHOO.widget.Logger.getStartTime(); // timestamp of last log message to console
    this._buffer = []; // output buffer
    this._timeout = null; // output buffer timeout
    this._allFilters = [];
    this._currFilters = [];

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
        if(YAHOO.widget.LogReader._defaultContainerEl) {
            this._containerEl =  YAHOO.widget.LogReader._defaultContainerEl;
        }
        else {
            this._containerEl = document.body.appendChild(document.createElement("div"));
            this._containerEl.id = "ylogger";
            this._containerEl.className = "ylogger";
            YAHOO.widget.LogReader._defaultContainerEl = this._containerEl;
        }
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
            this._hdEl.id = "ylog_hd" + YAHOO.widget.LogReader._index;
            this._hdEl.className = "ylog_hd";
            
            this._collapseEl = this._hdEl.appendChild(document.createElement("div"));
            this._collapseEl.className = "ylog_btns";

            this._collapseBtn = document.createElement("input");
            this._collapseBtn.type = "button"
            this._collapseBtn.value = "Collapse";
            this._collapseBtn = this._collapseEl.appendChild(this._collapseBtn);
            YAHOO.util.Event.addListener(oSelf._collapseBtn,'click',oSelf._onClickCollapseBtn,oSelf);

            this._title = this._hdEl.appendChild(document.createElement("h4"));
            this._title.innerHTML = "Logger Console";

            // If Drag and Drop utility is available...
            // ...and this container was created from scratch...
            // ...then make the header draggable
            if(YAHOO.util.DD &&
            (YAHOO.widget.LogReader._defaultContainerEl == this._containerEl)) {
                var ylog_dd = new YAHOO.util.DD(this._containerEl.id);
                ylog_dd.setHandleElId(this._hdEl.id);
                this._hdEl.style.cursor = "move";
            }
        }
        // Ceate console
        if(!this._consoleEl) {
            this._consoleEl = this._containerEl.appendChild(document.createElement("div"));
            this._consoleEl.className = "ylog_bd";
        }
        // Don't create footer if disabled
        if(!this._ftEl && this.footerEnabled) {
            this._ftEl = this._containerEl.appendChild(document.createElement("div"));
            this._ftEl.className = "ylog_ft";

            this._btnsEl = this._ftEl.appendChild(document.createElement("div"));
            this._btnsEl.className = "ylog_btns";

            this._pauseBtn = document.createElement("input");
            this._pauseBtn.type = "button";
            this._pauseBtn.value = "Pause";
            this._pauseBtn = this._btnsEl.appendChild(this._pauseBtn);
            YAHOO.util.Event.addListener(oSelf._pauseBtn,'click',oSelf._onClickPauseBtn,oSelf);

            this._clearBtn = document.createElement("input");
            this._clearBtn.type = "button";
            this._clearBtn.value = "Clear";
            this._clearBtn = this._btnsEl.appendChild(this._clearBtn);
            YAHOO.util.Event.addListener(oSelf._clearBtn,'click',oSelf._onClickClearBtn,oSelf);

            this._filtersEl = this._ftEl.appendChild(document.createElement("div"));

            /*this._filterAllBtn = document.createElement("input");
            this._filterAllBtn.className = "ylog_filterAllBtn";
            this._filterAllBtn.type = "button";
            this._filterAllBtn.value = "Filter All";
            this._filterAllBtn = this._filtersEl.appendChild(this._filterAllBtn);
            YAHOO.util.Event.addListener(oSelf._filterAllBtn,'click',oSelf._onClickFilterAllBtn,oSelf);*/

            var catsLen = YAHOO.widget.Logger.categories.length;
            for(var i=0; i < catsLen; i++) {
                this._createFilterCheckbox(YAHOO.widget.Logger.categories[i]);
            }
        }
    }
    
    //subscribe to Logger's events
    YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
    YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog, this);
    
    this._filterLogsNoCats();
    
    YAHOO.widget.LogReader._index++;
};

/***************************************************************************
 * Public members
 ***************************************************************************/
YAHOO.widget.LogReader.prototype.logReaderEnabled = true;

YAHOO.widget.LogReader.prototype.footerEnabled = true;

/***************************************************************************
 * Public methods
 ***************************************************************************/
YAHOO.widget.LogReader.prototype.pause = function() {
    this._timeout = null;
    this.logReaderEnabled = false;
};

YAHOO.widget.LogReader.prototype.resume = function() {
    this.logReaderEnabled = true;
    this._printBuffer();
};

 /***************************************************************************
 * Private members
 ***************************************************************************/
YAHOO.widget.LogReader._defaultContainerEl = null;

YAHOO.widget.LogReader._index = 0;

YAHOO.widget.LogReader.prototype._allFilters = null;
 
YAHOO.widget.LogReader.prototype._currFilters = null;

YAHOO.widget.LogReader.prototype._buffer = null;

YAHOO.widget.LogReader.prototype._timeout = null;

YAHOO.widget.LogReader.prototype._containerEl = null;

YAHOO.widget.LogReader.prototype._consoleEl = null;

YAHOO.widget.LogReader.prototype._hdEl = null;

YAHOO.widget.LogReader.prototype._ftEl = null;

YAHOO.widget.LogReader.prototype._lastTime = null;


/***************************************************************************
 * Private methods
 ***************************************************************************/
YAHOO.widget.LogReader.prototype._createFilterCheckbox = function(category) {
    var oSelf = this;
    
    if(this._filtersEl) {
        // Append el at the end so IE 5.5 can set "type" attribute
        var filterChk = document.createElement("input");
        filterChk.className = "ylog_filter" + category;
        filterChk.type = "checkbox";
        filterChk.checked = true;
        filterChk = this._filtersEl.appendChild(filterChk);
        YAHOO.util.Event.addListener(filterChk,'click',oSelf._onCheckFilter,oSelf);

        var filterChkLbl = this._filtersEl.appendChild(document.createElement("span"));
        filterChkLbl.className = category;
        filterChkLbl.innerHTML = category;

        this._allFilters.push({"category":category,"el":filterChk});
        this._currFilters.push({"category":category,"el":filterChk});
    }
}

YAHOO.widget.LogReader.prototype._filterLogs = function() {
    // Iterate through all filters since
    // some may have been dynamically added and
    // print logs that make it through
    if(this._containerEl && this._consoleEl && this._ftEl) {
        this._currFilters = [];
        var filtersLen = this._allFilters.length;
        for(var i=0; i<filtersLen; i++) {
            //for(var x in this._allFilters[i]) {
                //alert(x + ' is '+this._allFilters[i][x]);
            //}
            if(this._allFilters[i].el.checked) {
                this._currFilters.push({"category":this._allFilters[i].category,"el":this._allFilters[i].el});
            }
        }
    }

    // Reprint stack with new filters
    if (this._consoleEl != null) {
        this._clearConsole();
        this._printToConsole(YAHOO.widget.Logger.getStack());
    }
};

YAHOO.widget.LogReader.prototype._filterLogsAllCats = function() {
    this._currFilters = [];
    if (this._consoleEl != null) {
        this._clearConsole();
    }
};

YAHOO.widget.LogReader.prototype._filterLogsNoCats = function() {
    this._currFilters = this._allFilters;
    if (this._consoleEl != null) {
        this._clearConsole();
        this._printToConsole(YAHOO.widget.Logger.getStack());
    }
};

YAHOO.widget.LogReader.prototype._clearConsole = function() {
    // Clear the buffer of any pending messages
    this._timeout = null;
    this._buffer = [];

    // Reset the rolling timer
    this._lastTime = YAHOO.widget.Logger.getStartTime();

    var consoleEl = this._consoleEl;
    while(consoleEl.hasChildNodes()) {
        consoleEl.removeChild(consoleEl.firstChild);
    }
};

YAHOO.widget.LogReader.prototype._printBuffer = function() {
    this._timeout = null;
    var entries = [];
    for (var i=0; i<this._buffer.length; i++) {
        entries[i] = this._buffer[i];
    }
    this._buffer = [];

    if (this._consoleEl != null) {
        this._printToConsole(entries);
    }
};


YAHOO.widget.LogReader.prototype._printToConsole = function(aEntries) {
    var entriesLen = aEntries.length;
    var filterLen = this._currFilters.length;
    // Iterate through all log entries...
    for(var i=0; i<entriesLen; i++) {
        var entry = aEntries[i];
        var category = entry.category;
        // ...and only print the ones that filter through
        for(var j=0; j<filterLen; j++) {
            if(category == this._currFilters[j].category) {
                // To format for console, calculate the elapsed time
                // to be from the last item that passed through the filter,
                // not the absolute previous item in the stack
                var label = category.substring(0,4).toUpperCase();

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

                var output =  "<span class='"+category+"'>"+label+"</span> " +
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

/***************************************************************************
 * Private event handlers
 ***************************************************************************/
YAHOO.widget.LogReader.prototype._onCategoryCreate = function(type, args, oSelf) {
    var category = args[0];
    if(oSelf._containerEl && oSelf._consoleEl && oSelf._ftEl) {
        oSelf._createFilterCheckbox(category);
    }
}

YAHOO.widget.LogReader.prototype._onClickCollapseBtn = function(v, oSelf) {
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

YAHOO.widget.LogReader.prototype._onClickPauseBtn = function(v, oSelf) {
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

YAHOO.widget.LogReader.prototype._onClickClearBtn = function(v, oSelf) {
    oSelf._clearConsole();
};

YAHOO.widget.LogReader.prototype._onClickFilterAllBtn = function(v, oSelf) {
    var btn = oSelf._filterBtn;
    // Filter all
    if(btn.value == "Filters Off") {
        oSelf._filterLogsNoCats();
        // Check all checkboxes in UI
        if(oSelf._ftEl) {
            var filtersLen = this._allFilters.length;
            for(var i=0; i<filtersLen; i++) {
                var filterChk = this._allFilters[i].el;
                filterChk.checked = true;
            }
            this._currFilters = this._allFilters;
        }
        btn.value = "Filter All";
    }
    // Filter none
    else {
        this._filterLogsAllCats();
        // Uncheck all checkboxes in UI
        if(oSelf._ftEl) {
            var filtersLen = this._allFilters.length;
            for(var i=0; i<filtersLen; i++) {
                var filterChk = this._allFilters[i].el;
                filterChk.checked = false;
            }
            this._currFilters = [];
        }
        btn.value = "Filters Off";
    }
};

YAHOO.widget.LogReader.prototype._onCheckFilter = function(v, oSelf) {
    oSelf._filterLogs();
};

YAHOO.widget.LogReader.prototype._onNewLog = function(type, args, oSelf) {
    var logEntry = args[0];
    oSelf._buffer.push(logEntry);

    if (oSelf.logReaderEnabled == true && oSelf._timeout == null) {
        oSelf._timeout = setTimeout(function(){oSelf._printBuffer()}, 100);
    }
}


