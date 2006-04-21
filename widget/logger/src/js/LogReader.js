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
        this._containerEl.className = "ylogger";
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
            this._containerEl.style.width = (this.width) ? this.width : this.DEFAULT_WIDTH;

            // Set defaults if not provided by implementer
            if(!this.left && !this.right && !this.bottom && !this.top) {
                this._containerEl.style.top = this.DEFAULT_TOP;
                this._containerEl.style.right = this.DEFAULT_RIGHT;
            }
            if(!this.fontSize) {
                this._containerEl.style.fontSize = this.DEFAULT_FONTSIZE;
            }
            YAHOO.widget.LogReader._defaultContainerEl = this._containerEl;
        }

        // If implementer has provided, trust and set those
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
            this._hdEl.id = "ylog_hd" + YAHOO.widget.LogReader._index;
            this._hdEl.className = "ylog_hd";

            this._collapseEl = this._hdEl.appendChild(document.createElement("div"));
            this._collapseEl.className = "ylog_btns";

            this._collapseBtn = document.createElement("input");
            this._collapseBtn.type = "button";
            this._collapseBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._collapseBtn.className = "button";
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
            this._consoleEl.style.height = (this.height) ? this.height : this.DEFAULT_HEIGHT;
        }
        // Don't create footer if disabled
        if(!this._ftEl && this.footerEnabled) {
            this._ftEl = this._containerEl.appendChild(document.createElement("div"));
            this._ftEl.className = "ylog_ft";

            this._btnsEl = this._ftEl.appendChild(document.createElement("div"));
            this._btnsEl.className = "ylog_btns";

            this._pauseBtn = document.createElement("input");
            this._pauseBtn.type = "button";
            this._pauseBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._pauseBtn.className = "button";
            this._pauseBtn.value = "Pause";
            this._pauseBtn = this._btnsEl.appendChild(this._pauseBtn);
            YAHOO.util.Event.addListener(oSelf._pauseBtn,'click',oSelf._onClickPauseBtn,oSelf);

            this._clearBtn = document.createElement("input");
            this._clearBtn.type = "button";
            this._clearBtn.style.fontSize = YAHOO.util.Dom.getStyle(this._containerEl,"fontSize");
            this._clearBtn.className = "button";
            this._clearBtn.value = "Clear";
            this._clearBtn = this._btnsEl.appendChild(this._clearBtn);
            YAHOO.util.Event.addListener(oSelf._clearBtn,'click',oSelf._onClickClearBtn,oSelf);

            this._filtersEl = this._ftEl.appendChild(document.createElement("div"));
        }
    }

    // Initialize buffer
    if(!this._buffer) {
        this._buffer = []; // output buffer
    }
    YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog, this);
    this._lastTime = YAHOO.widget.Logger.getStartTime(); // timestamp of last log message to console

    // Initialize filters
    this._filters = [];
    var catsLen = YAHOO.widget.Logger.categories.length;
    if(this._filtersEl) {
        for(var i=0; i < catsLen; i++) {
            this._createFilterCheckbox(YAHOO.widget.Logger.categories[i]);
        }
    }
    YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);

    YAHOO.widget.LogReader._index++;
    this._filterLogs();
};

/***************************************************************************
 * Public constants
 ***************************************************************************/
/**
 * Default CSS width of LogReader container.
 *
 * @type constant
 * @final
 */
YAHOO.widget.LogReader.prototype.DEFAULT_WIDTH = "30em";

/**
 * Default CSS height of LogReader container.
 *
 * @type constant
 * @final
 */
YAHOO.widget.LogReader.prototype.DEFAULT_HEIGHT = "20em";

/**
 * Default CSS top position of LogReader container.
 *
 * @type constant
 * @final
 */
YAHOO.widget.LogReader.prototype.DEFAULT_TOP = "1em";

/**
 * Default CSS right position of LogReader container.
 *
 * @type constant
 * @final
 */
YAHOO.widget.LogReader.prototype.DEFAULT_RIGHT = "1em";

/**
 * Default CSS font size of LogReader container.
 *
 * @type constant
 * @final
 */
YAHOO.widget.LogReader.prototype.DEFAULT_FONTSIZE = "77%";

/***************************************************************************
 * Public members
 ***************************************************************************/
/**
 * Whether or not the log reader is enabled to output log messages.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.logReaderEnabled = true;

/**
 * CSS width of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.width = null;

/**
 * CSS height of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.height = null;

/**
 * CSS top position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.top = null;

/**
 * CSS left position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.left = null;

/**
 * CSS right position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.right = null;

/**
 * CSS bottom position of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.bottom = null;

/**
 * CSS font size of the log reader container.
 *
 * @type string
 */
YAHOO.widget.LogReader.prototype.fontSize = null;

/**
 * Whether or not the footer UI is enabled for the log reader.
 *
 * @type boolean
 */
YAHOO.widget.LogReader.prototype.footerEnabled = true;

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

 /***************************************************************************
 * Private members
 ***************************************************************************/
/**
 * Internal class variable to index multiple log reader instances.
 *
 * @type number
 * @private
 */
YAHOO.widget.LogReader._index = 0;

/**
 * A container element shared by all log readers if a container needs to be
 * created during instantiation. Will be null a container element never needs to
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
 * Filters that prevent certain categories of log messages from being output.
 *
 * @type array
 * @private
 */
YAHOO.widget.LogReader.prototype._filters = null;

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
 * Log reader filter checkboxes container element.
 *
 * @type HTMLElement
 * @private
 */
YAHOO.widget.LogReader.prototype._filtersEl = null;

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
YAHOO.widget.LogReader.prototype._createFilterCheckbox = function(category) {
    var oSelf = this;
    
    if(this._filtersEl) {
        // Append el at the end so IE 5.5 can set "type" attribute
        var filterChk = document.createElement("input");
        filterChk.className = "ylog_filter" + category;
        filterChk.type = "checkbox";
        filterChk.checked = true;
        filterChk.category = category;
        filterChk = this._filtersEl.appendChild(filterChk);
        YAHOO.util.Event.addListener(filterChk,'click',oSelf._onCheckFilter,oSelf);

        var filterChkLbl = this._filtersEl.appendChild(document.createElement("span"));
        filterChkLbl.className = category;
        filterChkLbl.innerHTML = category;
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
    var entriesLen = aEntries.length;
    var filtersLen = this._filters.length;
    // Iterate through all log entries...
    for(var i=0; i<entriesLen; i++) {
        var entry = aEntries[i];
        var category = entry.category;
        var okToPrint = true;
        // ...and only print the ones that filter through
        for(var j=0; j<filtersLen; j++) {
            if(category == this._filters[j]) {
                okToPrint = false;
                break;
            }
        }
        if(okToPrint) {
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
        }
    }
};

/***************************************************************************
 * Private event handlers
 ***************************************************************************/
/**
 * Handles Logger's categoryCreateEvent.
 *
 * @param {string} type The click event
 * @param {array} args Data passed from event firer
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onCategoryCreate = function(type, args, oSelf) {
    var category = args[0];
    if(oSelf._ftEl) {
        oSelf._createFilterCheckbox(category);
    }
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
 * Handles check events on the filter checkboxes.
 *
 * @param {event} v The click event
 * @param {object} oSelf The log reader instance
 * @private
 */
YAHOO.widget.LogReader.prototype._onCheckFilter = function(v, oSelf) {
    var category = this.category;
    if(this.checked) { // Remove category from filters
        for(var i=0; i<oSelf._filters.length; i++) {
            if(category == oSelf._filters[i]) {
                oSelf._filters.splice(i, 1);
                break;
            }
        }
    }
    else { // Add category to filters
        oSelf._filters.push(category);
    }
    oSelf._filterLogs();
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


