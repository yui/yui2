/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The LogMsg class defines a single log message.
 *
 * @class LogMsg
 * @constructor
 * @param oConfigs {Object} Object literal of configuration params.
 */
YAHOO.widget.LogMsg = function(oConfigs) {
    // Parse configs
    /**
     * Log message.
     *
     * @property msg
     * @type String
     */
    this.msg =
    /**
     * Log timestamp.
     *
     * @property time
     * @type Date
     */
    this.time =

    /**
     * Log category.
     *
     * @property category
     * @type String
     */
    this.category =

    /**
     * Log source. The first word passed in as the source argument.
     *
     * @property source
     * @type String
     */
    this.source =

    /**
     * Log source detail. The remainder of the string passed in as the source argument, not
     * including the first word (if any).
     *
     * @property sourceDetail
     * @type String
     */
    this.sourceDetail = null;

    if (oConfigs && (oConfigs.constructor == Object)) {
        for(var param in oConfigs) {
            this[param] = oConfigs[param];
        }
    }
};
YAHOO.lang.augmentObject(YAHOO.widget.LogMsg, {
    ENTRY_TEMPLATE : (function () {
        var t = document.createElement('pre');
        YAHOO.util.Dom.addClass(t,'yui-log-entry');
        return t;
    })(),

    VERBOSE_TEMPLATE : "<span class='{category}'>{label}</span>{totalTime}ms (+{elapsedTime}) {localTime}:</p><p>{sourceAndDetail}</p><p>{msg}</p>",


    BASIC_TEMPLATE : "<p><span class='{category}'>{label}</span>{totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {msg}</p>"
});
 
/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

YAHOO.widget.LogMsg.prototype = {
    toLogEntry : function (endTime,verbose) {
        var LogMsg = YAHOO.widget.LogMsg,
            info   = {
                category : this.category,

                // Label for color-coded display
                label : this.category.substring(0,4).toUpperCase(),

                localTime : this.time.toLocaleTimeString ?
                            this.time.toLocaleTimeString() :
                            this.time.toString(),

                // Calculate the elapsed time to be from the last item that
                // passed through the filter, not the absolute previous item
                // in the stack
                elapsedTime : this.time.getTime() - YAHOO.widget.Logger.getStartTime(),

                totalTime : this.time.getTime() - endTime,

                sourceAndDetail : this.sourceDetail ?
                                  this.source + " " + this.sourceDetail :
                                  this.source,

                // Escape HTML entities in the log message itself for output
                // to console
                msg : (this.msg || '').replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;")
            };

        var entry = LogMsg.ENTRY_TEMPLATE.cloneNode(true);
        if (verbose) {
            YAHOO.util.Dom.addClass(entry,'yui-log-verbose');
        }

        entry.innerHTML = YAHOO.lang.substitute(verbose ? LogMsg.VERBOSE_TEMPLATE : LogMsg.BASIC_TEMPLATE, info);

        return entry;
    }
};
