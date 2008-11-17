<iframe id="yui-history-iframe" src="<?php echo $assetsDirectory; ?>html/blank.html"></iframe>
<input id="yui-history-field" type="hidden">

<div id="dt-pag-nav"></div>
<div id="serverintegration"></div>

<script type="text/javascript">
(function () {
    var History = YAHOO.util.History,
        myPaginator,  // to hold the Paginator instance
        myDataSource, // to hold the DataSource instance
        myDataTable;  // to hold the DataTable instance

    // function to generate a query string for the DataSource.  Also used
    // as the state indicator for the History Manager
    var generateStateString = function (start,key,dir,rpp) {
        start = start || 0;
        key   = key || 'id';
        dir   = dir || 'asc';
        rpp   = rpp || 10;
        return "results="+rpp+"&startIndex="+start+"&sort="+key+"&dir="+dir;
    };

    // function to extract the key values from the state string
    var parseStateString = function (state) {
        return {
            results    : /\bresults=(\d+)/.test(state)    ? parseInt(RegExp.$1,10) : 10,
            startIndex : /\bstartIndex=(\d+)/.test(state) ? parseInt(RegExp.$1,10) : 0,
            sort       : /\bsort=(\w+)/.test(state)       ? RegExp.$1 : 'id',
            dir        : /\bdir=(\w+)/.test(state)        ? RegExp.$1 : 'asc'
        };
    };

    // function used to intercept pagination requests
    var handlePagination = function (state,datatable) {
        var sortedBy  = datatable.get('sortedBy');

        var newState = generateStateString(
                            state.recordOffset,
                            sortedBy.key,
                            sortedBy.dir.replace('yui-dt-',''),
                            state.rowsPerPage);

        History.navigate("myDataTable",newState);
    };

    // function used to intercept sorting requests
    var handleSorting = function (oColumn) {
        // Which direction
        var sDir = "asc",
            rpp  = this.get('paginator').getRowsPerPage();

        // Already sorted?
        if(oColumn.key === this.get("sortedBy").key) {
            sDir = (this.get("sortedBy").dir.indexOf("asc") !== -1) ?
                    "desc" : "asc";
        }

        var newBookmark = generateStateString(0, oColumn.key, sDir, rpp);

        YAHOO.util.History.navigate("myDataTable", newBookmark);
    };

    var handleHistoryNavigation = function (state) {
        // Use the DataTable's baked in server-side pagination handler
        myDataSource.sendRequest(state,{
                success  : myDataTable.onDataReturnSetRows,
                failure  : myDataTable.onDataReturnSetRows,
                scope    : myDataTable
        });
    };

    var initialState = History.getBookmarkedState('myDataTable') ||
                       generateStateString(0,'id','asc',10);

    History.register('myDataTable',initialState, handleHistoryNavigation);

    History.onReady(function() {
        // Pull the state from the History Manager, or default from the
        // initial state.  Parse the state string into an object literal.
        var initialRequest = History.getCurrentState('myDataTable') ||
                             initialState,
            state          = parseStateString(initialRequest);

        // Create the DataSource
        myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/json_proxy.php?");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.responseSchema = {
            resultsList: "records",
            fields: ["id","name","date","price"],
            metaFields: {
                totalRecords: "totalRecords",
                paginationRecordOffset : "startIndex",
                paginationRowsPerPage : "pageSize",
                sortKey: "sort",
                sortDir: "dir"
            }
        };
        myDataSource.subscribe('responseParseEvent',function (args) {
            var meta = args.response.meta;
            if (meta && meta.sortDir) {
                if (meta.sortDir.indexOf('yui-dt-') !== 0) { 
                    meta.sortDir = 'yui-dt-' + meta.sortDir;
                }
            }
        });

        // Column definitions
        var myColumnDefs = [
            {key:"id", label:"ID", sortable:true},
            {key:"name", label:"Name", sortable:true},
            {key:"date", label:"Date", sortable:true},
            {key:"price", label:"Price", sortable:true}
        ];

        // Create the DataTable configuration and Paginator using the state
        // information we pulled from the History Manager
        myPaginator = new YAHOO.widget.Paginator({
            rowsPerPage : state.results,
            recordOffset : state.startIndex,
            containers : ['dt-pag-nav'],
            template : "{PreviousPageLink} {CurrentPageReport} {NextPageLink} {RowsPerPageDropdown}",
            pageReportTemplate : "Showing items {startIndex} - {endIndex} of {totalRecords}",
            rowsPerPageOptions : [10,25,50,100]
        });

        var myConfig = {
            paginator : myPaginator,
            dynamicData : true,
            paginationEventHandler : handlePagination,
            // generateRequest : generateStateString, // moot
            sortedBy : {
                key : state.sort,
                dir : state.dir
            },
            initialRequest : initialRequest
        };

        // Instantiate DataTable
        myDataTable = new YAHOO.widget.DataTable(
            "serverintegration", // The dom element to contain the DataTable
            myColumnDefs,        // What columns will display
            myDataSource,        // The DataSource for our records
            myConfig             // Other configurations
        );

        // Listen to header link clicks to sort the column
        myDataTable.subscribe('theadCellClickEvent', myDataTable.onEventSortColumn);

        // Override the DataTable's sortColumn method with our intercept handler
        myDataTable.sortColumn = handleSorting;
        
        // Add the example objects to the YAHOO.example namespace for inspection
        YAHOO.example.ServerIntegration = {
            myPaginator  : myPaginator,
            myDataSource : myDataSource,
            myDataTable  : myDataTable
        };
    });

    YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
})();
</script>
