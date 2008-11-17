<div id="demo">
    <div id="report"></div>
    <div id="tbl"></div>
</div>
<script type="text/javascript" src="<?php echo($assetsDirectory); ?>inventory.js"></script>
<script type="text/javascript">
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
</script>
