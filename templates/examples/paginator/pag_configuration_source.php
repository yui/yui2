<div id="demo">
    <div id="pag"></div>
    <div id="tbl"></div>
</div>

<script type="text/javascript" src="<?php echo("${assetsDirectory}areacodes.js") ?>"></script>
<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function () {

var Ex = YAHOO.namespace('example');

// Sort our data by state, then area code
Ex.data.areacodes.sort(function (a,b) {
    return YAHOO.util.Sort.compare(a.state,b.state) ||
           YAHOO.util.Sort.compare(a.areacode,b.areacode);
});

// Custom function we'll use for the page links
Ex.buildPageLabel = function (recs) {
    var data  = Ex.data.areacodes,
        start = recs[0],
        end   = recs[1];

    // Nested function to find the smallest substring
    // to indicate how two strings differ
    var diffNames = function (a,b) {
        var aa = a.state.toLowerCase(),
            bb = b.state.toLowerCase();

        for (var i = 0, len = aa.length; i < len; ++i) {
            if (aa.charAt(i) !== bb.charAt(i)) {
                return a.state.substr(0,i+1);
            }
        }

        return a.state + ' ('+a.areacode+')';
    };

    // Build label as "A - C" or "Abc - Def"
    var label = '';
    if (!start) {
        label = data[0].state.substr(0,2) + ' - ';
    } else {
        label = diffNames(data[start], data[start-1]) + ' - ';
    }

    if (data[end+1]) {
        label += diffNames(data[end], data[end+1]);
    } else {
        label += diffNames(data[end], data[start]);
    }

    return label;
};


// Paginator configurations
Ex.config = {
    // REQUIRED
    rowsPerPage : 20,

    // REQUIRED, but DataTable will default if not provided
    containers  : 'pag',

    // If not provided, there is no last page or total pages.
    // DataTable will set this in the DataSource callback, so this is
    // redundant.
    totalRecords : Ex.data.areacodes.length,

    // page to activate at load
    initialPage : 3,

    // Class the element(s) that will contain the controls
    containerClass : 'yui-pg-container', // default

    // Define the innerHTML of the container(s) using placeholders
    // to identify where the controls will be located
    template :
        '<h3>Now showing:</h3>' +
        '<p>{CurrentPageReport}</p>' +
        '<p class="pg-nav">' +
            '{FirstPageLink} {PreviousPageLink} ' +
            '{NextPageLink} {LastPageLink}' +
        '</p>' +
        '<label>Page size: {RowsPerPageDropdown}</label>' +
        '<h3>Directory</h3>' +
        '{PageLinks}',

    // If there is less data than would display on one page, pagination
    // controls can be omitted by setting this to false.
    alwaysVisible : true, // default

    // Override setPage (et al) to immediately update internal values
    // and update the pagination controls in response to user actions.
    // Default is false; requests are delegated through the changeRequest
    // event subscriber.
    updateOnChange : false, // default

    // Options for FirstPageLink component
    firstPageLinkLabel : "&lt;&lt;",
    firstPageLinkClass : "yui-pg-first", // default

    // Options for LastPageLink component
    lastPageLinkLabel : "&gt;&gt;",
    lastPageLinkClass : "yui-pg-last", // default

    // Options for PreviousPageLink component
    previousPageLinkLabel : "&lt; previous",
    previousPageLinkClass : "yui-pg-previous", // default

    // Options for NextPageLink component
    nextPageLinkLabel : "next &gt;", // default
    nextPageLinkClass : "yui-pg-next", // default

    // Options for PageLinks component
    pageLinksContainerClass : 'yui-pg-pages',        // default
    pageLinkClass           : 'yui-pg-page',         // default
    currentPageClass        : 'yui-pg-current-page', // default

    // Display a maximum of X page links.  Use
    // YAHOO.widget.Paginator.VALUE_UNLIMITED to show all page links
    pageLinks               : YAHOO.widget.Paginator.VALUE_UNLIMITED,

    // Create custom page link labels
    pageLabelBuilder        : function (page,paginator) {
        return Ex.buildPageLabel(paginator.getPageRecords(page));
    },

    // Options for RowsPerPageDropdown component
    rowsPerPageDropdownClass : "yui-pg-rpp-options", // default
    rowsPerPageOptions       : [
        { value : 20, text : "small" },
        { value : 40, text : "medium" },
        { value : 100, text : "large" }
    ],

    // Options for CurrentPageReport component
    pageReportClass : 'yui-pg-current', // default

    // Provide a key:value map for use by the pageReportTemplate.
    // Unlikely this will need to be customized; see API docs for the
    // template keys made available by the default value generator
    pageReportValueGenerator : function (paginator) {
        var recs  = paginator.getPageRecords();

        return {
            start     : Ex.data.areacodes[recs[0]].state,
            end       : Ex.data.areacodes[recs[1]].state
        };
    },

    // How to render the notification of the Paginator's current state
    pageReportTemplate : '{start} - {end}'
};

// Create the Paginator for our DataTable to use
Ex.paginator = new YAHOO.widget.Paginator(Ex.config);


// Normal DataTable configuration
Ex.tableCols = [ {key:"state",    label:"State", minWidth: 150},
                 {key:"areacode", label:"Code",  width: 30}];

Ex.dataSource = new YAHOO.util.DataSource(Ex.data.areacodes, {
    responseType   : YAHOO.util.DataSource.TYPE_JSARRAY,
    responseSchema : {
        fields : ["state","areacode"]
    }
});

// Pass the Paginator in the DataTable config
Ex.tableConfig = {
    paginator : Ex.paginator,
    caption   : 'Area Codes by State'
};

Ex.dataTable = new YAHOO.widget.DataTable('tbl',
    Ex.tableCols, Ex.dataSource, Ex.tableConfig);

});
</script>
