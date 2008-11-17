<h2 class="first">Example Data</h2>
<p>In this example, we'll be working with a data array stored in <code>YAHOO.example.data.inventory</code>.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.namespace('example.data').inventory = [
    {SKU:"23-23874", Quantity:43, Item:"Helmet", Description:"Red baseball helmet. Size: Large."},
    {SKU:"48-38835", Quantity:84, Item:"Football", Description:"Leather football."},
    ...
];
</textarea>

<h2>Start with the content</h2>
<p>We'll start with two empty divs:</p>

<textarea name="code" class="HTML" rows="1" cols="60">
<div id="demo">
    <div id="report"></div>
    <div id="tbl"></div>
</div>
</textarea>

<p>To populate <code>div#tbl</code> we write some application code to generate a table with a tfoot.  The table will be wrapped in an object with an API including a <code>showPage(pageNumber)</code> method.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

var Ex = YAHOO.namespace('example'),
    d  = document;

// API for generating the table
Ex.table = {
    table   : null,
    columns : ['Item','Quantity','Description'],
    pageSize: 5,
    data    : null,
    tbody   : null,
    tfoot   : null,

    load : function (data) { ... },
    render : function (container) { ... },
    showPage : function (page) { ... }
};

...
</textarea>

<h2>Add Pagination</h2>
<p>Create a Paginator and a method to subscribe to its <code>changeRequest</code> event.  Note the configured container is a generated <code>&lt;div&gt;</code> and is not yet on the page.  We'll append this to the <code>&lt;tfoot&gt;</code> when it is available.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
Ex.handlePagination = function (state) {
    // Update the content via API call
    Ex.table.showPage(state.page);

    // Confirm page change with Paginator
    Ex.paginator.setState(state);
};

// Create a Paginator and configure the UI Components included
// in the template and the CurrentPageReport we'll render manually
Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage  : Ex.table.pageSize,
    totalRecords : Ex.data.inventory.length,
    containers   : d.createElement('div'),

    template              : "{PreviousPageLink}{NextPageLink}",
    pageReportTemplate    : "Page {currentPage} of {totalPages}",
    previousPageLinkLabel : "previous",
    nextPageLinkLabel     : "next"
});

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);
</textarea>

<h2>Subscribe to create the CurrentPageReport</h2>
<p>To synchronize the rendering of all UI Components, we subscribe to the Paginator's <code>render</code> event with a callback to add a CurrentPageReport into <code>div#report</code>.</p>
<p>UI Components' <code>render</code> methods take a string seed usually used by Paginator to guarantee uniqueness of generated IDs when rendering into multiple containers.  When rendering them manually, you'll need to provide your own seed.  If you render more than one of the same type of UI Component, respective <code>render</code> calls must be passed different seeds.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
Ex.paginator.subscribe('render', function () {
    var pageReport, pageReportNode, report;

    report = YAHOO.util.Dom.get('report');

    // Instantiate the UI Component
    pageReport = new YAHOO.widget.Paginator.ui.CurrentPageReport(Ex.paginator);

    // render the UI Component, passing an arbitrary ID seed (the ID of the
    // destination container by convention)
    pageReportNode = pageReport.render('report');

    // Append the generated node into the container
    report.appendChild(pageReportNode);
});
</textarea>

<h2>Render everything</h2>
<p>Render the table and the Paginator.  The CurrentPageReport will be rendered in response to the Paginator's emitted <code>render</code> event.</p>
<p>The Paginator was configured to use a <code>&lt;div&gt;</code> created off the page DOM, so the <code>template</code> controls are not visible until the <code>&lt;div&gt;</code> is then added to the table's <code>&lt;tfoot&gt;</code>.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
// Render the UI
Ex.table.load(Ex.data.inventory).render('tbl');

// Render the Paginator controls into the off DOM div passed as a container
// just to illustrate that it is possible to do so.
Ex.paginator.render();

// Add the Paginator's configured container to the table's tfoot.
Ex.DOM.add(Ex.table.tfoot.rows[0].cells[0],Ex.paginator.getContainerNodes()[0]);
</textarea>

<h2>Full Code Listing</h2>

<h3>JavaScript</h3>
<p>Some convenience methods were created to aid in the DOM structure assembly.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

var Ex = YAHOO.namespace('example'),
    d  = document;

/* Convenience functions for building the DOM structure */
Ex.DOM = {
    create : function (el,innerHTML) {
        el = el && el.nodeName ? el : d.createElement(el);

        if (el && innerHTML !== undefined) {
            el.innerHTML = innerHTML;
        }

        return el;
    },
    add : function (par, child, innerHTML) {
        par = par && YAHOO.util.Dom.get(par);
        if (par && par.appendChild) {
            child = Ex.DOM.create(child,innerHTML);
            if (child) {
                par.appendChild(child);
            }
        }

        return child;
    }
};

/* Table generation/maintenance API */
Ex.table = {
    table   : null,
    columns : ['Item','Quantity','Description'],
    pageSize: 5,
    data    : null,
    tbody   : [],
    tfoot   : null,

    load : function (data) {
        if (YAHOO.lang.isArray(data)) {
            this.data = data;
            this.tbody = [];
        }
        return this;
    },
    render : function (container) {
        if (!this.table) {
            container = (container && YAHOO.util.Dom.get(container)) || d.body;

            var thead, tbody, row, cell, i, len;

            this.table = Ex.DOM.create('table');
            thead = Ex.DOM.add(this.table,'thead');
            row   = Ex.DOM.add(thead,'tr');

            for (i=0,len=this.columns.length; i<len; ++i) {
                Ex.DOM.add(row,'th',this.columns[i]);
            }

            this.tfoot = Ex.DOM.add(this.table,'tfoot');
            cell = Ex.DOM.add(Ex.DOM.add(this.tfoot,'tr'),'td');
            cell.colSpan = this.columns.length;

            if (this.data) {
                this.showPage(1);
            } else {
                row  = Ex.DOM.create('tr');
                cell = Ex.DOM.add(row,'td','No Data');
                cell.colSpan = this.columns.length;

                Ex.DOM.add(Ex.DOM.add(this.table,'tbody'),row);
            }

            container.innerHTML = '';
            Ex.DOM.add(container,this.table);
        }
        return this;
    },
    showPage : function (page) {
        var cur, tbody, row, i, j, len, limit;

        if (this.table) {
            cur = this.table.getElementsByTagName('tbody')[0];

            if (YAHOO.lang.isNumber(page)) {
                tbody = this.tbody[page];
                if (!cur || cur !== tbody) {
                    if (!tbody) {
                        tbody = this.tbody[page] = Ex.DOM.create('tbody');

                        i = (page - 1) * this.pageSize;
                        limit  = Math.min(Ex.data.inventory.length,
                                          i + this.pageSize);
                        for (; i < limit; ++i) {
                            row = Ex.DOM.add(tbody,'tr');
                            for (j=0,len=this.columns.length; j<len; ++j) {
                                Ex.DOM.add(row,'td',
                                    this.data[i][this.columns[j]]);
                            }
                        }
                    }

                    if (cur) {
                        this.table.replaceChild(tbody,cur);
                    } else {
                        Ex.DOM.add(this.table,tbody);
                    }
                }
            }
        }
        return this;
    }
};
    
Ex.handlePagination = function (state) {
    Ex.table.showPage(state.page);

    Ex.paginator.setState(state);
};

Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage  : Ex.table.pageSize,
    totalRecords : Ex.data.inventory.length,
    containers   : d.createElement('div'),

    template              : "{PreviousPageLink}{NextPageLink}",
    pageReportTemplate    : "Page {currentPage} of {totalPages}",
    previousPageLinkLabel : "previous",
    nextPageLinkLabel     : "next"
});

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);
Ex.paginator.subscribe('render', function () {
    var pageReport, pageReportNode, report;

    report = YAHOO.util.Dom.get('report');

    // Instantiate the UI Component
    pageReport = new YAHOO.widget.Paginator.ui.CurrentPageReport(Ex.paginator);

    // render the UI Component, passing an arbitrary string (the ID of the
    // destination container by convention)
    pageReportNode = pageReport.render('report');

    // Append the generated node into the container
    report.appendChild(pageReportNode);
});


// Render the UI
Ex.table.load(Ex.data.inventory).render('tbl');

// Render the Paginator controls into the off DOM div passed as a container
// just to illustrate that it is possible to do so.
Ex.paginator.render();

// Add the Paginator's configured container to the table's tfoot.
Ex.DOM.add(Ex.table.tfoot.rows[0].cells[0],Ex.paginator.getContainerNodes()[0]);

});
</textarea>

<h3>CSS</h3>
<p>Custom positioning and style were added to the UI Components used.  You'll see the Sam skin overrides as the rules with selectors beginning with <code>.yui-skin-sam</code>.</p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* Sam skin rule overrides */
.yui-skin-sam .yui-pg-container { margin: 0; }
.yui-skin-sam .yui-pg-current   { margin-right: 15px; }

.yui-skin-sam .yui-pg-previous {
    float: left;
    padding: 3px 5px;
}
.yui-skin-sam .yui-pg-next {
    float: right;
    padding: 3px 5px;
}
.yui-skin-sam span.yui-pg-next,
.yui-skin-sam span.yui-pg-previous {
    display: none;
}

/* content specific styles */
#tbl,
#report,
#paging {
    width: 400px;
    margin: 0 auto;
}
#report {
    color: #fff;
    background: #ccc;
    font-size: 200%;
    margin-bottom: 1em;
    text-align: right;
}
#demo table {
    border-collapse: collapse;
    color: #333;
    width: 100%;
}
#demo th {
    border-bottom: 4px solid #999;
    color: #444;
    font: normal 125%/100% Trebuchet MS, Arial, sans-serif;
    padding: 0 6px;
}
#demo tbody {
    background: #fff;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
}
#demo tbody td {
    border-bottom: 1px solid #eee;
    padding: 5px;
}
#demo tfoot td {
    overflow: hidden;
}
</textarea>
