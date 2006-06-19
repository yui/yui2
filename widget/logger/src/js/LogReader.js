/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Class providing UI to read messages logged to YAHOO.widget.Logger.
 *
 * requires YAHOO.util.Dom DOM utility
 * requires YAHOO.util.Event Event utility
 * optional YAHOO.util.DragDrop Drag and drop utility
 *
 * @constructor
 * @param {el or ID} containerEl DOM element object or ID of container to wrap reader UI
 * @param {object} oConfig Optional object literal of configuration params
 */
YAHOO.widget.LogReader = function(containerEl, oConfig) {
    var oSelf = this;

    // Parse config vars here
    if (typeof oConfig == "object") {
        for(var param in oConfig) {
            this[param] = oConfig[param];
        }
    }

    // Attach container...
    if(containerEl) {
        if(typeof containerEl == "string") {
            this._containerEl = document.getElementById(containerEl);
        }
        else if(containerEl.tagName) {
            this._containerEl = containerEl;
        }
        this._containerEl.className = "yui-log";
    }
    // ...or create container from scratch
    if(!this._containerEl) {
        if(YAHOO.widget.LogReader._defaultContainerEl) {
            this._containerEl =  YAHOO.widget.LogReader._defaultContainerEl;
        }
        else {
            this._containerEl = document.body.appendChild(document.createElement("div"));
            this._containerEl.id = "yui-log";
            this._containerEl.className = "yui-log";

            YAHOO.widget.LogReader._defaultContainerEl = this._containerEl;
        }

        // If implementer has provided container values, trust and set those
        if(this.width) {
            this._containerEl.style.width = this.width;
        }
        if(this.left) {
            this._containerEl.style.left = this.left;
        }
        if(this.right) {
            this._containerEl.style.right = this.right;
        }
        if(this.bottom) {
            this._containerEl.style.bottom = this.bottom;
        }
        if(this.top) {
            this._containerEl.style.top = this.top;
        }
        if(this.fontSize) {
            this._containerEl.style.fontSize = this.fontSize;
        }
    }

    if(this._containerEl) {
        // Create header
        if(!this._hdEl) {
            this._hdEl = this._containerEl.appendChild(document.createElement("div"));
            this._hdEl.id = "yui-log-hd" + YAHOO.widget.LogReader._index;
            this._hdEl.className = "yui-log-hd";

            this._collapseEl = this._hdEl.appendChild(document.createElement("div"));
            this._collapseEl.className = "yui-log-btns";

            this._collapseBtn = document.createElement("input");
            this._collapseBtn.type = "button";
            this._collapseBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._collapseBtn.className = "yui-log-button";
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
            this._consoleEl.className = "yui-log-bd";
            
            // If implementer has provided console, trust and set those
            if(this.height) {
                this._consoleEl.style.height = this.height;
            }
        }
        // Don't create footer if disabled
        if(!this._ftEl && this.footerEnabled) {
            this._ftEl = this._containerEl.appendChild(document.createElement("div"));
            this._ftEl.className = "yui-log-ft";

            this._btnsEl = this._ftEl.appendChild(document.createElement("div"));
            this._btnsEl.className = "yui-log-btns";

            this._pauseBtn = document.createElement("input");
            this._pauseBtn.type = "button";
            this._pauseBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._pauseBtn.className = "yui-log-button";
            this._pauseBtn.value = "Pause";
            this._pauseBtn = this._btnsEl.appendChild(this._pauseBtn);
            YAHOO.util.Event.addListener(oSelf._pauseBtn,'click',oSelf._onClickPauseBtn,oSelf);

            this._clearBtn = document.createElement("input");
            this._clearBtn.type = "button";
            this._clearBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._clearBtn.className = "yui-log-button";
            this._clearBtn.value = "Clear";
            this._clearBtn = this._btnsEl.appendChild(this._clearBtn);
            YAHOO.util.Event.addListener(oSelf._clearBtn,'click',oSelf._onClickClearBtn,oSelf);

            this._categoryFiltersEl = this._ftEl.appendChild(document.createElement("div"));
            this._categoryFiltersEl.className = "yui-log-categoryfilters";
            this._sourceFiltersEl = this._ftEl.appendChild(document.createElement("div"));
            this._sourceFiltersEl.className = "yui-log-sourcefilters";
        }
    }

    // Initialize buffer
    if(!this._buffer) {
        this._buffer = []; // output buffer
    }
    YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog, this);
    this._lastTime = YAHOO.widget.Logger.getStartTime(); // timestamp of last log message to console

    // Initialize category filters
    this._categoryFilters = [];
    var catsLen = YAHOO.widget.Logger.categories.length;
    if(this._categoryFiltersEl) {
        for(var i=0; i < catsLen; i++) {
            this._createCategoryCheckbox(YAHOO.widget.Logger.categories[i]);
        }
    }
    // Initialize source filters
    this._sourceFilters = [];
    var sourcesLen = YAHOO.widget.Logger.sources.length;
    if(this._sourceFiltersEl) {
        for(var j=0; j < sourcesLen; j++) {
            this._createSourceCheckbox(YAHOO.widget.Logger.sources[j]);
        }
    }
    YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
    YAHOO.widget.Logger.sourceCreateEvent.subscribe(this._onSourceCreate, this);

    YAHOO.widget.LogReader._index++;
    this._filterLogs();
};

/***************************************************************************
 * Public members
 ***************************************************************************/
/**
 * Whether or not the log reader is enabled to output log messages. Default:
 * true.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.logReaderEnabled = true;

/**
 * Public member to access CSS width of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.width = null;

/**
 * Public member to access CSS height of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.height = null;

/**
 * Public member to access CSS top position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.top = null;

/**
 * Public member to access CSS left position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.left = null;

/**
 * Public member to access CSS right position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.right = null;

/**
 * Public member to access CSS bottom position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.bottom = null;

/**
 * Public member to access CSS font size of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.fontSize = null;

/**
 * Whether or not the footer UI is enabled for the log reader. Default: true.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.footerEnabled = true;

/**
 * Whether or not output is verbose (more readable). Setting to true will make
 * output more compact (less readable). Default: true.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.verboseOutput = true;

/**
 * Whether or not newest message is printed on top. Default: true.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.newestOnTop = true;

/***************************************************************************
 * Public methods
 ***************************************************************************/
/**
 * Pauses output of log messages. While paused, log messages are not lost, but
 * get saved to a buffer and then output upon resume of log reader.
 */
YAHOO.widget.LogReader.prototype.pause = function() {
    this._timeout = null;
    this.logReaderEnabled = false;
};

/**
 * Resumes output of log messages, including outputting any log messages that
 * have been saved to buffer while paused.
 */
YAHOO.widget.LogReader.prototype.resume = function() {
    this.logReaderEnabled = true;
    this._printBuffer();
};

/**
 * Hides UI of log reader. Logging functionality is not disrupted.
 */
YAHOO.widget.LogReader.prototype.hide = function() {
    this._containerEl.style.display = "none";
};

/**
 * Shows UI of log reader. Logging functionality is not disrupted.
 */
YAHOO.widget.LogReader.prototype.show = function() {
    this._containerEl.style.display = "block";
};

/**
 * Updates title to given string.
 *
 * @param {string} sTitle String to display in log reader's title bar.
 */
YAHOO.widget.LogReader.prototype.setTitle = function(sTitle) {
    var regEx = />/g;
    sTitle = sTitle.replace(regEx,"&gt;");
    regEx = /</g;
    sTitle = sTitle.replace(regEx,"&lt;");
    this._title.innerHTML = (sTitle);
};
 /***************************************************************************
 * Private members
 ***************************************************************************/
/**
 * Internal class member to index multiple log reader instances.
 *
 * @type number
 * @private
 */
YAHOO.widget.LogReader._index = 0;

/**
 * A class member shared by all log readers if a container needs to be
 * created during instantiation. Will be null if a container element never needs to
 * be created on the fly, such as when the implementer passes in their own element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader._defaultContainerEl = null;

/**
 * Buffer of log messages for batch output.
 *
 * @type array
 * @private
 */
YAHOO.widget.LogReader.prototype._buffer = null;

/**
 * Date of last output log message.
 *
 * @type date
 * @private
 */
YAHOO.widget.LogReader.prototype._lastTime = null;

/**
 * Batched output timeout ID.
 *
 * @type number
 * @private
 */
YAHOO.widget.LogReader.prototype._timeout = null;

/**
 * Array of filters for log message categories.
 *
 * @type array
 * @private
 */
YAHOO.widget.LogReader.prototype._categoryFilters = null;

/**
 * Array of filters for log message sources.
 *
 * @type array
 * @private
 */
YAHOO.widget.LogReader.prototype._sourceFilters = null;

/**
 * Log reader container element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._containerEl = null;

/**
 * Log reader header element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._hdEl = null;

/**
 * Log reader collapse element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._collapseEl = null;

/**
 * Log reader collapse button element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._collapseBtn = null;

/**
 * Log reader title header element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._title = null;

/**
 * Log reader console element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._consoleEl = null;

/**
 * Log reader footer element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._ftEl = null;

/**
 * Log reader buttons container element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._btnsEl = null;

/**
 * Container element for log reader category filter checkboxes.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._categoryFiltersEl = null;

/**
 * Container element for log reader source filter checkboxes.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._sourceFiltersEl = null;

/**
 * Log reader pause button element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._pauseBtn = null;

/**
 * lear button element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._clearBtn = null;
/***************************************************************************
 * Private methods
 ***************************************************************************/
/**
 * Creates the UI for a category filter in the log reader footer element.
 *
 * @param {string} category Category name
 * @private
 */
YAHOO.widget.LogReader.prototype._createCategoryCheckbox = function(category) {
    var oSelf = this;
    
    if(this._ftEl) {
        var parentEl = this._categoryFiltersEl;
        var filters = this._categoryFilters;

        var filterEl = parentEl.appendChild(document.createElement("span"));
        filterEl.className = "yui-log-filtergrp";
            // Append el at the end so IE 5.5 can set "type" attribute
            // and THEN set checked property
            var categoryChk = document.createElement("input");
            categoryChk.id = "yui-log-filter-" + category + YAHOO.widget.LogReader._index;
            categoryChk.className = "yui-log-filter-" + category;
            categoryChk.type = "checkbox";
            categoryChk.category = category;
            categoryChk = filterEl.appendChild(categoryChk);
            categoryChk.checked = true;

            // Add this checked filter to the internal array of filters
            filters.push(category);
            // Subscribe to the click event
            YAHOO.util.Event.addListener(categoryChk,'click',oSelf._onCheckCategory,oSelf);

            // Create and class the text label
            var categoryChkLbl = filterEl.appendChild(document.createElement("label"));
            categoryChkLbl.htmlFor = categoryChk.id;
            categoryChkLbl.className = category;
            categoryChkLbl.innerHTML = category;
    }
};

YAHOO.widget.LogReader.prototype._createSourceCheckbox = function(source) {
    var oSelf = this;

    if(this._ftEl) {
        var parentEl = this._sourceFiltersEl;
        var filters = this._sourceFilters;

        var filterEl = parentEl.appendChild(document.createElement("span"));
        filterEl.className = "yui-log-filtergrp";

        // Append el at the end so IE 5.5 can set "type" attribute
        // and THEN set checked property
        var sourceChk = document.createElement("input");
        sourceChk.id = "yui-log-filter" + source + YAHOO.widget.LogReader._index;
        sourceChk.className = "yui-log-filter" + source;
        sourceChk.type = "checkbox";
        sourceChk.source = source;
        sourceChk = filterEl.appendChild(sourceChk);
        sourceChk.checked = true;

        // Add this checked filter to the internal array of filters
        filters.push(source);
        // Subscribe to the click event
        YAHOO.util.Event.addListener(sourceChk,'click',oSelf._onCheckSource,oSelf);

        // Create and class the text label
        var sourceChkLbl = filterEl.appendChild(document.createElement("label"));
        sourceChkLbl.htmlFor = sourceChk.id;
        sourceChkLbl.className = source;
        sourceChkLbl.innerHTML = source;
    }
};

/**
 * Reprints all log messages in the stack through filters.
 *
 * @private
 */
YAHOO.widget.LogReader.prototype._filterLogs = function() {
    // Reprint stack with new filters
    if (this._consoleEl !== null) {
        this._clearConsole();
        this._printToConsole(YAHOO.widget.Logger.getStack());
    }
};

/**
 * Clears all outputted log messages from the console and resets the time of the
 * last output log message.
 *
 * @private
 */
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

/**
 * Sends buffer of log messages to output and clears buffer.
 *
 * @private
 */
YAHOO.widget.LogReader.prototype._printBuffer = function() {
    this._timeout = null;

    if (this._consoleEl !== null) {
        var entries = [];
        for (var i=0; i<this._buffer.length; i++) {
            entries[i] = this._buffer[i];
        }
        this._buffer = [];
        this._printToConsole(entries);
        if(!this.newestOnTop) {
            this._consoleEl.scrollTop = this._consoleEl.scrollHeight;
        }
    }
};

/**
 * Cycles through an array of log messages, and outputs each one to the console
 * if its category has not been filtered out.
 *
 * @param {array} aEntries
 * @private
 */
YAHOO.widget.LogReader.prototype._printToConsole = function(aEntries) {
//TODO: much optimization here
//if verboseOutput, set fixed widths for time output
    var entriesLen = aEntries.length;
    var sourceFiltersLen = this._sourceFilters.length;
    var categoryFiltersLen = this._categoryFilters.length;
    // Iterate through all log entries to print the ones that filter through
    for(var i=0; i<entriesLen; i++) {
        var entry = aEntries[i];
        var category = entry.category;
        var source = entry.source;
        var sourceDetail = entry.sourceDetail;
        var okToPrint = false;
        var okToFilterCats = false;

        for(var j=0; j<sourceFiltersLen; j++) {
            if(source == this._sourceFilters[j]) {
                okToFilterCats = true;
                break;
            }
        }
        if(okToFilterCats) {
            for(var k=0; k<categoryFiltersLen; k++) {
                if(category == this._categoryFilters[k]) {
                    okToPrint = true;
                    break;
                }
            }
        }
        if(okToPrint) {
            // To format for console, calculate the elapsed time
            // to be from the last item that passed through the filter,
            // not the absolute previous item in the stack
            var label = entry.category.substring(0,4).toUpperCase();

            var time = entry.time;
            if (time.toLocaleTimeString) {
                var localTime  = time.toLocaleTimeString();
            }
            else {
                localTime = time.toString();
            }

            var msecs = time.getTime();
            var startTime = YAHOO.widget.Logger.getStartTime();
            var totalTime = msecs - startTime;
            var elapsedTime = msecs - this._lastTime;
            this._lastTime = msecs;
            
            var verboseOutput = (this.verboseOutput) ? "<br>" : "";
            var sourceAndDetail = (sourceDetail) ? source + " " + sourceDetail :
                source;

            var output =  "<span class='"+category+"'>"+label+"</span> " +
                totalTime + "ms (+" +
                elapsedTime + ") " + localTime + ": " +
                sourceAndDetail + ": " +
                verboseOutput +
                entry.msg;

            var oNewElement = (this.newestOnTop) ?
                this._consoleEl.insertBefore(document.createElement("p"),this._consoleEl.firstChild):
                this._consoleEl.appendChild(document.createElement("p"));
            oNewElement.innerHTML = output;
        }
    }
};

/***************************************************************************
 * Private event handlers
 ***************************************************************************/
/**
 * Handles Logger's categoryCreateEvent.
 *
 * @param {string} type The event
 * @param {array} args Data passed from event firer
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onCategoryCreate = function(type, args, oSelf) {
    var category = args[0];
    if(oSelf._ftEl) {
        oSelf._createCategoryCheckbox(category);
    }
};

/**
 * Handles Logger's sourceCreateEvent.
 *
 * @param {string} type The event
 * @param {array} args Data passed from event firer
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onSourceCreate = function(type, args, oSelf) {
    var source = args[0];
    if(oSelf._ftEl) {
        oSelf._createSourceCheckbox(source);
    }
};

/**
 * Handles check events on the category filter checkboxes.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onCheckCategory = function(v, oSelf) {
    var newFilter = this.category;
    var filtersArray = oSelf._categoryFilters;

    if(!this.checked) { // Remove category from filters
        for(var i=0; i<filtersArray.length; i++) {
            if(newFilter == filtersArray[i]) {
                filtersArray.splice(i, 1);
                break;
            }
        }
    }
    else { // Add category to filters
        filtersArray.push(newFilter);
    }
    oSelf._filterLogs();
};

/**
 * Handles check events on the category filter checkboxes.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onCheckSource = function(v, oSelf) {
    var newFilter = this.source;
    var filtersArray = oSelf._sourceFilters;
    
    if(!this.checked) { // Remove category from filters
        for(var i=0; i<filtersArray.length; i++) {
            if(newFilter == filtersArray[i]) {
                filtersArray.splice(i, 1);
                break;
            }
        }
    }
    else { // Add category to filters
        filtersArray.push(newFilter);
    }
    oSelf._filterLogs();
};

/**
 * Handles click events on the collapse button.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
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

/**
 * Handles click events on the pause button.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
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

/**
 * Handles click events on the clear button.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onClickClearBtn = function(v, oSelf) {
    oSelf._clearConsole();
};

/**
 * Handles Logger's onNewEvent.
 *
 * @param {string} type The click event
 * @param {array} args Data passed from event firer
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onNewLog = function(type, args, oSelf) {
    var logEntry = args[0];
    oSelf._buffer.push(logEntry);

    if (oSelf.logReaderEnabled === true && oSelf._timeout === null) {
        oSelf._timeout = setTimeout(function(){oSelf._printBuffer();}, 100);
    }
};


