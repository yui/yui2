/**
 * @class an instance of a logreader.
 *
 * @constructor
 */
YAHOO.widget.LogReader = function(containerEl, oConfig) {
    var oSelf = this;
        
    // Initialize memebers
    this._filters = YAHOO.widget.Logger.categories;
    this._lastFilteredTime = YAHOO.widget.Logger.getStartTime(); // timestamp of last log message to console
    this._buffer = []; // output buffer
    this._timeout = null; // output buffer timeout
    this.logReaderEnabled = true;

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

            var catsLen = YAHOO.widget.Logger.categories.length;
            for(var i=0; i < catsLen; i++) {
                this._createFilterCheckbox(YAHOO.widget.Logger.categories[i]);
            }
        }
    }
    
    //subscribe to Logger's events
    YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
    YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog, this);
    
    this._setFiltersNone();

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
    YAHOO.widget.Logger.log(null, "LogReader paused");
    this._timeout = null;
    this.logReaderEnabled = false;
};

YAHOO.widget.LogReader.prototype.resume = function() {
    this.logReaderEnabled = true;
    YAHOO.widget.Logger.log(null, "LogReader resumed");
};

YAHOO.widget.LogReader.prototype.reset = function() {
    this._timeout = null;
    this._buffer = [];

    if (this._consoleEl != null) {
        this._clearConsole();
    }
    YAHOO.widget.Logger.reset();

    this._lastFilteredTime = YAHOO.widget.Logger.getStartTime();

};

 /***************************************************************************
 * Private members
 ***************************************************************************/
YAHOO.widget.LogReader.prototype._filters = null;

YAHOO.widget.LogReader.prototype._buffer = null;

YAHOO.widget.LogReader.prototype._timeout = null;

YAHOO.widget.LogReader.prototype._consoleEl = null;

YAHOO.widget.LogReader.prototype._hdEl = null;

YAHOO.widget.LogReader.prototype._ftEl = null;

YAHOO.widget.LogReader.prototype._lastFilteredTime = null;


/***************************************************************************
 * Private methods
 ***************************************************************************/
YAHOO.widget.LogReader.prototype._createFilterCheckbox = function(type) {
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

YAHOO.widget.LogReader.prototype._setFilters = function() {
    // Iterate through all filter checkboxes
    // since some may have been dynamically added and
    // track which filters to enable
    if(this._containerEl && this._consoleEl && this._ftEl) {
        this._filters = [];
        var catsLen = YAHOO.widget.Logger.categories.length;
        for(var i=0; i<catsLen; i++) {
            var filterChk = document.getElementById("ylog_filter"+YAHOO.widget.Logger.categories[i]);
            if(filterChk.checked) {
                this._filters.push(YAHOO.widget.Logger.categories[i]);
            }
        }
    }

    // Reprint stack with new filters
    if (this._consoleEl != null) {
        this._clearConsole();
        this._printToConsole(YAHOO.widget.Logger.getStack());
    }
};

YAHOO.widget.LogReader.prototype._setFiltersAll = function() {
    this._filters = [];
    if (this._consoleEl != null) {
        this._clearConsole();
    }
};

YAHOO.widget.LogReader.prototype._setFiltersNone = function() {
    this._filters = YAHOO.widget.Logger.categories;
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
    this._lastFilteredTime = YAHOO.widget.Logger.getStartTime();

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
    var filterLen = this._filters.length;
    // Iterate through all log entries...
    for(var i=0; i<entriesLen; i++) {
        var entry = aEntries[i];
        var category = entry.category;
        // ...and only print the ones that filter through
        for(var j=0; j<filterLen; j++) {
            if(category == this._filters[j]) {

                // formatting to console
                // calculate the elapsed time to be from the last item that passed through the filter,
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
                var elapsedTime = msecs - this._lastFilteredTime;
                this._lastFilteredTime = msecs;

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
    oSelf._filters.push(category);

    // Add a new filter checkbox to UI
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

YAHOO.widget.LogReader.prototype._onClickResetBtn = function(v, oSelf) {
    oSelf.reset();
};

YAHOO.widget.LogReader.prototype._onClickFilterAllBtn = function(v, oSelf) {
    var btn = oSelf._filterBtn;
    // Filter all
    if(btn.value == "Filters Off") {
        oSelf._setFiltersNone();
        // Check all checkboxes in UI
        if(oSelf._ftEl) {
            var catsLen = YAHOO.widget.Logger.categories.length;
            for(var i=0; i<catsLen; i++) {
                var filterChk = document.getElementById("ylog_filter"+YAHOO.widget.Logger.categories[i]);
                filterChk.checked = true;
            }
        }
        btn.value = "Filter All";
    }
    // Filter none
    else {
        this._setFiltersAll();
        // Uncheck all checkboxes in UI
        if(oSelf._ftEl) {
            var catsLen = oSelf.categories.length;
            for(var i=0; i<catsLen; i++) {
                var filterChk = document.getElementById("ylog_filter"+YAHOO.widget.Logger.categories[i]);
                filterChk.checked = false;
            }
        }
        btn.value = "Filters Off";
    }
};

YAHOO.widget.LogReader.prototype._onCheckFilter = function(v, oSelf) {
    oSelf._setFilters();
};

YAHOO.widget.LogReader.prototype._onNewLog = function(type, args, oSelf) {
    var logEntry = args[0];
    oSelf._buffer.push(logEntry);

    if (oSelf.logReaderEnabled == true && oSelf._timeout == null) {
        oSelf._timeout = setTimeout(function(){oSelf._printBuffer()}, 100);
    }
}


