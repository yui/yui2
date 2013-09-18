/**********
 * QuickEdit extension to YUI 2 DataTable
 * Author: lindalj@yahoo-inc.com / John Lindal
 * @submodule QuickEdit
 * @class YAHOO.widget.QuickEditDataTable
 ***********/
(function(){

    var lang = YAHOO.lang,
        Dom = YAHOO.util.Dom;

    /**
     * <p>The QuickEditDataTable class extends the DataTable class to
     * provide QuickEdit mode.  (It could just as easily extend
     * ScrollingDataTable.)  QuickEdit mode allows the user to edit all the
     * values that are visible in the table, controlled by the column
     * configuration.  Each editable cell contains an input field.  If the
     * user decides to save the changes, then you can extract the changes
     * by calling <code>getQuickEditChanges()</code>.</p>
     * 
     * <p>For a column to be editable in QuickEdit mode, the column
     * configuration must include <code>quickEdit</code>.  The contents of
     * this object define the column's behavior in QuickEdit mode.</p>
     * 
     * <p>If a column should not be editable, but needs to be formatted
     * differently in QuickEdit mode, then you must define qeFormatter in
     * the column configuration. This is simply a normal cell formatter
     * function that will be used in QuickEdit mode.  The static functions
     * <code>readonly*QuickEditFormatter</code> provide examples.</p>
     * 
     * <p>The following configuration can be provided as part of
     * quickEdit:</p>
     * 
     * <dl>
     * 
     * <dt>copyDown</dt><dd>If true, the top cell in the column will have a
     * button to copy the value down to the rest of the rows.</dd>
     * 
     * <dt>formatter</dt><dd>The cell formatter which will render an
     * appropriate form field: &lt;input type="text"&gt;, &lt;textarea&gt;,
     * or &lt;select&gt;.</dd>
     * 
     * <dt>validation</dt><dd>Validation configuration for every field in
     * the column.</dd>
     * 
     * </dl>
     * 
     * <p>The following configuration can be provided as part of
     * quickEdit.validation:</p>
     * 
     * <dl>
     * 
     * <dt>css</dt><dd>CSS classes encoding basic validation rules.  Note
     * that this will only work if you uncomment the call to
     * <code>validateFromCSSData()</code> inside
     * <code>_validateQuickEditElements()</code>.</dd>
     * 
     * <dt>fn</dt><dd>A function that will be called with the DataTable as
     * its scope and the cell's form element as the argument. Return true
     * if the value is valid. Otherwise, call
     * this.displayQuickEditMessage(...) to display an error and return
     * false.</dd>
     * 
     * <dt>msg</dt><dd>A map of types to messages that will be displayed
     * when a basic or regex validation rule fails. Currently, the only
     * valid type is regex.  If you copy the implementation of
     * validateFromCSSData(), from FormManager in the YUI 3 Gallery, then
     * you will be able to specify more types:  required, min_length,
     * max_length, integer, and decimal.</dd>
     * 
     * <dt>regex</dt><dd>Regular expression that the value must satisfy in
     * order to be considered valid.</dd>
     * 
     * </dl>
     * 
     * <p>Custom QuickEdit Formatters</p>
     * 
     * <p>To write a custom cell formatter for QuickEdit mode, you must
     * structure the function as follows:</p>
     * 
     * <pre>
     * function myQuickEditFormatter(el, oRecord, oColumn, oData) {
     * &nbsp;&nbsp;var markup =
     * &nbsp;&nbsp;&nbsp;&nbsp;'&lt;input type="text" class="{yiv} yui-quick-edit yui-quick-edit-key:{key}"/&gt;' +
     * &nbsp;&nbsp;&nbsp;&nbsp;YAHOO.widget.QuickEditDataTable.MARKUP_QE_ERROR_DISPLAY;
     * 
     * &nbsp;&nbsp;&nbsp;&nbsp;el.innerHTML = lang.substitute(markup, {
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: oColumn.key,
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yiv: oColumn.quickEdit.validation ? (oColumn.quickEdit.validation.css || '') : ''
     * &nbsp;&nbsp;&nbsp;&nbsp;});
     * 
     * &nbsp;&nbsp;&nbsp;&nbsp;el.firstChild.value = extractMyEditableValue(oData);
     * 
     * &nbsp;&nbsp;&nbsp;&nbsp;YAHOO.widget.QuickEditDataTable.copyDownFormatter.apply(this, arguments);
     * };
     * </pre>
     * 
     * <p>You can use textarea or select instead of input, but you can only
     * create a single field.</p>
     * 
     * <p><code>extractMyEditableValue</code> does not have to be a separate
     * function nor must it be limited to using only oData. The work should
     * normally be done inline in the formatter function, but the name of
     * the sample function makes the point clear.</p>
     * 
     * @module QuickEdit
     * @namespace YAHOO.widget
     * @class QuickEditDataTable
     * @extends YAHOO.widget.DataTable
     * @constructor
     * @param elContainer {HTMLElement} Container element for the TABLE.
     * @param aColumnDefs {Object[]} Array of object literal Column definitions.
     * @param oDataSource {YAHOO.util.DataSource} DataSource instance.
     * @param oConfigs {object} (optional) Object literal of configuration values.
     */
    YAHOO.widget.QuickEditDataTable = function(elContainer,aColumnDefs,oDataSource,oConfigs)
    {
        YAHOO.widget.QuickEditDataTable.superclass.constructor.call(this, elContainer,aColumnDefs,oDataSource,oConfigs); 

        this.hasQEMessages = false;

    };

    var QEDT = YAHOO.widget.QuickEditDataTable,
        quick_edit_re             = /yui-quick-edit-key:([^\s]+)/,
        qe_row_status_even_prefix = 'yui-quick-edit-even-has',
        qe_row_status_odd_prefix  = 'yui-quick-edit-odd-has',
        qe_row_status_pattern     = '(?:^|\\s)(?:yui-quick-edit-(even|odd)-has([a-z]+))(?= |$)',
        qe_row_status_re          = new RegExp(qe_row_status_pattern),
        qe_cell_status_prefix     = 'yui-quick-edit-has',
        qe_cell_status_pattern    = '(?:^|\\s)(?:' + qe_cell_status_prefix + '([a-z]+))(?= |$)',
        qe_cell_status_re         = new RegExp(qe_cell_status_pattern);

    QEDT.status_order =
    [
        'error',
        'warn',
        'success',
        'info'
    ];

    getStatusPrecedence = function(
        /* string */    status)
    {
        for (var i=0; i<QEDT.status_order.length; i++)
        {
            if (status == QEDT.status_order[i])
            {
                return i;
            }
        }

        return QEDT.status_order.length;
    };

    statusTakesPrecendence = function(
        /* string */    orig_status,
        /* string */    new_status)
    {
        return (!orig_status || getStatusPrecedence(new_status) < getStatusPrecedence(orig_status));
    };

    YAHOO.lang.extend( 
        YAHOO.widget.QuickEditDataTable,
        YAHOO.widget.DataTable, 
    {
        /**
         * Switch to QuickEdit mode.  Columns that have quickEdit defined will
         * be editable.
         *
         * @method startQuickEdit
         */
        startQuickEdit : function() {

            this.fireEvent('clearErrorNotification');

            if (YAHOO.lang.isFunction(this.collapseAllRows)) {
                this.collapseAllRows();
            }

            var cols        = this.getColumnSet().keys;
            this.qeSaveSort = [];
            this.qeSaveEdit = {};
            this.qeSaveFmt  = {};
            var sortable    = false;
            for (var i=0; i<cols.length; i++) {
                var col  = cols[i];
                sortable = sortable || col.sortable;
                this.qeSaveSort.push(col.sortable);
                col.sortable = false;

                this.qeSaveEdit[ col.key ] = col.editor;
                col.editor                 = null;

                if (!col.hidden && (col.quickEdit || col.qeFormatter)) {
                    var fn;
                    if (col.quickEdit && lang.isFunction(col.quickEdit.formatter)) {
                        fn = col.quickEdit.formatter;
                    }
                    else if (lang.isFunction(col.qeFormatter)) {
                        fn = col.qeFormatter;
                    }
                    else {
                        fn = QEDT.textQuickEditFormatter;
                    }

                    if (fn) {
                        var fmt                 = this._wrapQuickEditFormatter(fn, col.formatter);
                        this.qeSaveFmt[col.key] = col.formatter;
                        col.formatter           = fmt;
                    }
                }
            }

            Dom.addClass(this.getContainerEl(), 'yui-dt-quick-edit');
            this.subscribe('tbodyKeyEvent', this._moveQuickEditFocus, null, this);

            var pg = this.get('paginator');
            if (pg) {
                var c = pg.get('containers');
                if (!(c instanceof Array)) {
                    c = [c];
                }
                for (var i=0; i<c.length; i++) {
                    Dom.setStyle(c[i], 'display', 'none');
                }
            }

            if (sortable) {
                this._initTheadEl();
            }
            this.render();
        },

        _wrapQuickEditFormatter : function(editFmt, origFmt) {

            return function(el, oRecord, oColumn, oData) {
                if (oRecord) {
                    editFmt.apply(this, arguments);
                }
                else {
                    origFmt.apply(this, arguments);
                }
            };
        },

        /**
         * Switch out of QuickEdit mode.  THIS DISCARDS ALL DATA!  If you
         * want to save the data, call getQuickEditChanges() BEFORE calling
         * this function.
         *
         * @method cancelQuickEdit
         */
        cancelQuickEdit : function() {

            this.fireEvent('clearErrorNotification');

            var cols     = this.getColumnSet().keys;
            var sortable = false;
            for (var i=0; i<cols.length; i++) {
                var col      = cols[i];
                col.sortable = this.qeSaveSort[i];
                sortable     = sortable || col.sortable;
                col.editor   = this.qeSaveEdit[ col.key ];
            }
            delete this.qeSaveSort;
            delete this.qeSaveEdit;

            for (var key in this.qeSaveFmt) {
                if (lang.hasOwnProperty(this.qeSaveFmt, key)) {
                    var col       = this.getColumn(key);
                    col.formatter = this.qeSaveFmt[key];
                }
            }
            delete this.qeSaveFmt;

            Dom.removeClass(this.getContainerEl(), 'yui-dt-quick-edit');
            this.unsubscribe('tbodyKeyEvent', this._moveQuickEditFocus);

            var pg = this.get('paginator');
            if (pg) {
                var c = pg.get('containers');
                if (!(c instanceof Array)) {
                    c = [c];
                }
                for (var i=0; i<c.length; i++) {
                    Dom.setStyle(c[i], 'display', 'block');
                }
            }

            if (sortable) {
                this._initTheadEl();
            }
            this.render();
        },

        /**
         * Return the changed values.  For each row, an object is created
         * with only the changed values.  The object keys are the column keys.
         *
         * @method getQuickEditChanges
         * @return {mixed} array if all validation passed, false otherwise
         */
        getQuickEditChanges : function() {

            if (!this.validateQuickEdit()) {
                return false;
            }

            var changes = [];

            var tr = this.getFirstTrEl();
            while (tr) {
                var rec  = this.getRecord(tr);
                var list = Dom.getElementsByClassName(quick_edit_re, null, tr);

                var change = {};
                changes.push(change);

                for (var i=0; i<list.length; i++) {
                    var m    = quick_edit_re.exec(list[i].className);
                    var key  = m[1];
                    var col  = this.getColumn(key);
                    var prev = rec.getData(key);

                    var val = list[i].value;
                    if (col.parser) {
                        val = col.parser.call(this, val);
                    }

                    if (col.quickEditChanged ? col.quickEditChanged(prev, val) :
                            val !== (prev ? prev.toString() : '')) {
                        change[key] = val;
                    }
                }

                tr = this.getNextTrEl(tr);
            }

            return changes;
        },

        /**
         * Copy value from first cell to all other cells in the column.
         *
         * @method _quickEditCopyDown
         * @param e {Event} triggering event
         * @param cell {Element} cell from which to copy
         * @private
         */
        _quickEditCopyDown : function(
            /* event */     e,
            /* element */   cell) {

            var list = Dom.getElementsByClassName(quick_edit_re, null, cell);
            if (!list || !list.length) {
                return;
            }

            var value = list[0].value;
            while (1) {
                cell = this.getBelowTdEl(cell);
                if (!cell) {
                    break;
                }

                list = Dom.getElementsByClassName(quick_edit_re, null, cell);
                if (list && list.length) {
                    list[0].value = value;
                }
            }
        },

        /**
         * Validate the QuickEdit data.
         *
         * @method validateQuickEdit
         * @return {boolean} true if all validation checks pass
         */
        validateQuickEdit : function() {

            this.clearQuickEditMessages();
            var status = true;

            var e1 = this.getTbodyEl().getElementsByTagName('input');
            var e2 = this.getTbodyEl().getElementsByTagName('textarea');
            var e3 = this.getTbodyEl().getElementsByTagName('select');

            status = this._validateQuickEditElements(e1) && status;	// status last to guarantee call
            status = this._validateQuickEditElements(e2) && status;
            status = this._validateQuickEditElements(e3) && status;

            if (!status) {
                this.fireEvent('notifyErrors');
            }

            return status;
        },

        /**
         * Validate the given form fields.
         *
         * @method _validateQuickEditElements
         * @param e {Array} Array of form fields.
         * @return {boolean} true if all validation checks pass
         * @private
         */
        _validateQuickEditElements : function(
            /* array */ e) {

            var status = true;
            for (var i=0; i<e.length; i++) {
                var col = this.getColumn(e[i]);
                if (!col.quickEdit) {
                    continue;
                }
                var msg_list = col.quickEdit.validation ? col.quickEdit.validation.msg : null;
/*
                // see yui3-gallery:gallery-formmgr for an example of validateFromCSSData()

                var info = validateFromCSSData(e[i], msg_list);
                if (info.error) {
                    this.displayQuickEditMessage(e[i], info.error, 'error');
                    status = false;
                }
                if (!info.keepGoing) {
                    continue;
                }
*/
                if (col.quickEdit.validation
                        && col.quickEdit.validation.regex instanceof RegExp
                        && !col.quickEdit.validation.regex.test(e[i].value)) {
                    this.displayQuickEditMessage(e[i], msg_list ? msg_list.regex : null, 'error');
                    status = false;
                    continue;
                }

                if (col.quickEdit.validation
                        && lang.isFunction(col.quickEdit.validation.fn)
                        && !col.quickEdit.validation.fn.call(this, e[i])) {
                    status = false;
                    continue;
                }
            }

            return status;
        },

        /**
         * Clear all validation messages in QuickEdit mode.
         *
         * @method clearQuickEditMessages
         */
        clearQuickEditMessages : function() {

            this.hasQEMessages = false;

            this.fireEvent('clearErrorNotification');

            var list = Dom.getElementsByClassName(qe_row_status_re, null, this.getTbodyEl());
            Dom.removeClass(list, qe_row_status_re);

            list = Dom.getElementsByClassName(qe_cell_status_re, null, this.getTbodyEl());
            Dom.removeClass(list, qe_cell_status_re);

            for (var i=0; i<list.length; i++) {
                var m = Dom.getElementsByClassName(QEDT.CLASS_QE_ERROR_TEXT, null, list[i]);
                if (m && m.length > 0) {
                    m[0].innerHTML = '';
                }
            }
        },

        /**
         * Display a message for a QuickEdit field.  If an existing message with
         * a higher precedence is already visible, it will not be replaced.
         *
         * @method displayQuickEditMessage
         * @param e {Element} form field
         * @param msg {String} message to display
         * @param type {String} message type: error, warn, success, info
         * @param scroll {boolean} If false, does not scroll, even if this is the first message to display.
         */
        displayQuickEditMessage : function(
            /* element */   e,
            /* string */    msg,
            /* string */    type,
            /* boolean */   scroll) {

            if (lang.isUndefined(scroll)) {
                scroll = true;
            }

            var row = this.getTrEl(e);
            if (statusTakesPrecendence(this._getQuickEditElementStatus(row, qe_row_status_re), type)) {
                if (!this.hasQEMessages && scroll) {
                    this.getFirstTdEl(row).scrollIntoView();
                }

                if (Dom.hasClass(row, 'yui-dt-even')) {
                    Dom.replaceClass(row, qe_row_status_re, qe_row_status_even_prefix + type);
                }
                else {
                    Dom.replaceClass(row, qe_row_status_re, qe_row_status_odd_prefix + type);
                }
                this.hasQEMessages = true;
            }

            var cell = this.getTdEl(e);
            if (statusTakesPrecendence(this._getQuickEditElementStatus(cell, qe_cell_status_re), type)) {
                if (msg) {
                    var m = Dom.getElementsByClassName(QEDT.CLASS_QE_ERROR_TEXT, null, cell);
                    if (m && m.length > 0) {
                        m[0].innerHTML = msg;
                    }
                }

                Dom.replaceClass(cell, qe_cell_status_re, qe_cell_status_prefix + type);
                this.hasQEMessages = true;
            }
        },

        /**
         * Return the status of the field.
         *
         * @method _getQuickEditElementStatus
         * @param e {Element} form field
         * @param r {RegExp} regex to match against className
         * @private
         */
        _getQuickEditElementStatus : function(
            /* string/object */ e,
            /* regex */         r) {

            var m = e.className.match(r);
            return ((m && m.length) ? m[1] : false);
        },

        /**
         * Shift the focus up/down within a column.
         *
         * @method _moveQuickEditFocus
         * @private
         */
        _moveQuickEditFocus : function(data) {
            var e   = data.event;
            var key = YAHOO.util.Event.getCharCode(e);
            if (e.ctrlKey && (key == 38 || key == 40)) {    // Ctrl-up/down
                var target = YAHOO.util.Event.getTarget(e);
                var cell   = (key == 38 ? this.getAboveTdEl(target) : this.getBelowTdEl(target));
                if (cell) {
                    var input = Dom.getElementsByClassName(quick_edit_re, null, cell)[0];
                    if (input) {
                        input.focus();
                        input.select();
                        YAHOO.util.Event.stopEvent(e);
                    }
                }
            }
        }
    });

    YAHOO.lang.augmentObject(YAHOO.widget.QuickEditDataTable,
    {
        CLASS_QE_ERROR_TEXT     : 'yui-quick-edit-message-text',
        MARKUP_QE_ERROR_DISPLAY : '<div class="yui-quick-edit-message-text"></div>',

        /**
         * Called with exactly the same arguments as any other cell
         * formatter, this function displays an input field.
         *
         * @method textQuickEditFormatter
         * @static
         */
        textQuickEditFormatter : function(el, oRecord, oColumn, oData)
        {
            var markup =
                '<input type="text" class="{yiv} yui-quick-edit yui-quick-edit-key:{key}"/>' +
                QEDT.MARKUP_QE_ERROR_DISPLAY;

            el.innerHTML = lang.substitute(markup,
            {
                key: oColumn.key,
                yiv: oColumn.quickEdit.validation ? (oColumn.quickEdit.validation.css || '') : ''
            });

            el.firstChild.value = oData;

            QEDT.copyDownFormatter.apply(this, arguments);
        },

        /**
         * Called with exactly the same arguments as any other cell
         * formatter, this function displays a textarea field.
         *
         * @method textareaQuickEditFormatter
         * @static
         */
        textareaQuickEditFormatter : function(el, oRecord, oColumn, oData) {

            var markup =
                '<textarea class="{yiv} yui-quick-edit yui-quick-edit-key:{key}"/>' +
                QEDT.MARKUP_QE_ERROR_DISPLAY;

            el.innerHTML = lang.substitute(markup,
            {
                key: oColumn.key,
                yiv: oColumn.quickEdit.validation ? (oColumn.quickEdit.validation.css || '') : ''
            });

            el.firstChild.value = oData;

            QEDT.copyDownFormatter.apply(this, arguments);
        },

        /**
         * Called with exactly the same arguments as any other cell
         * formatter, this function displays an email address without the
         * anchor tag.  Use this as the column's qeFormatter if the column
         * should not be editable in QuickEdit mode.
         *
         * @method readonlyLinkQuickEditFormatter
         * @static
         */
        readonlyEmailQuickEditFormatter : function(el, oRecord, oColumn, oData)
        {
            el.innerHTML = (oData ? oData : '');
        },

        /**
         * Called with exactly the same arguments as any other cell
         * formatter, this function displays a link without the anchor tag.
         * Use this as the column's qeFormatter if the column should not be
         * editable in QuickEdit mode.
         *
         * @method readonlyLinkQuickEditFormatter
         * @static
         */
         readonlyLinkQuickEditFormatter : function(el, oRecord, oColumn, oData)
         {
            el.innerHTML = oData;
        },

        /**
         * Called with exactly the same arguments as a normal cell
         * formatter, this function inserts a "Copy down" button if the
         * cell is in the first row of the DataTable.  Call this at the end
         * of your QuickEdit formatter.
         *
         * @method copyDownFormatter
         * @static
         */
        copyDownFormatter : function(el, oRecord, oColumn, oData)
        {
            if (oColumn.quickEdit.copyDown &&
                this.getRecordSet().getRecordIndex(oRecord) ==
                    this.getState().pagination.recordOffset)
            {
                var button       = document.createElement('button');
                button.title     = 'Copy down';
                button.innerHTML = '&darr;'

                var msg = Dom.getElementsByClassName(QEDT.CLASS_QE_ERROR_TEXT, null, el)[0];
                el.insertBefore(button, msg);

                YAHOO.util.Event.on(button, 'click', this._quickEditCopyDown, el, this);
            }
        }
    });

})();
