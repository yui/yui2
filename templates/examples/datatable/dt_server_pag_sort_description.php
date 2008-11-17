<h2 class="first">Code for this example</h2>

<p>This example contacts a server side script to get the records appropriate for display in the DataTable according to the requested sort order and page.  Additionally, each change of page or sort order will be added to the <a href="http://developer.yahoo.com/yui/history/">Browser History Manager</a>, allowing bookmarking and the use of the browser's back/forward buttons to navigate through states of the DataTable.</p>

<p>The server-side script delivering the DataTable's records will send the data in the following JSON format:</p>

<textarea name="code" class="HTML" cols="60" rows="1">{"recordsReturned":25,
    "totalRecords":1397,
    "startIndex":0,
    "sort":null,
    "dir":"asc",
    "pageSize":10,
    "records":[
        {"id":"0",
        "name":"xmlqoyzgmykrphvyiz",
        "date":"13-Sep-2002",
        "price":"8370",
        "number":"8056",
        "address":"qdfbc",
        "company":"taufrid",
        "desc":"pppzhfhcdqcvbirw",
        "age":"5512",
        "title":"zticbcd",
        "phone":"hvdkltabshgakjqmfrvxo",
        "email":"eodnqepua",
        "zip":"eodnqepua",
        "country":"pdibxicpqipbsgnxyjumsza"},
        ...
    ]
}
</textarea>

<h2>The markup</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<iframe id="yui-history-iframe" src="<?php echo $assetsDirectory; ?>html/blank.html"></iframe>
<input id="yui-history-field" type="hidden">

<div id="dt-pag-nav"></div>
<div id="serverintegration"></div>
</textarea>

<h2>CSS</h2>
<p>The Browser History Manager markup requires an iframe to support IE6.  This is hidden per the recommendation.</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#yui-history-iframe {
  position:absolute;
  top:0; left:0;
  width:1px; height:1px; /* avoid scrollbars */
  visibility:hidden;
}
</textarea>

<h2>Workflow</h2>
<p>To inject the Browser History Manager into DataTable pagination and sorting, we need to create a few custom functions and insert them into the normal flow of operations.  Here's a diagram of how the code below will operate (note the methods in floating boxes are our custom functions):</p>
<img src="<?php echo("{$assetsDirectory}images/dt_history_flow.png");?>" alt="Flowchart of the DataTable interaction with BHM updating">

<h2>Javascript</h2>

<p>The Browser History Manager remembers &quot;states&quot;.  For this example, we'll use the query string sent to the server script as the state indicator.  First we create a couple functions to generate and parse the query/state string, then set up the <code>onStateChange</code> function for the BHM to use when calls to <code>History.navigate(...)</code> are made.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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

    // function to handle onStateChange events from Browser History Manager
    var handleHistoryNavigation = function (state) {
        // Use one of DataTable's baked in data return methods
        myDataSource.sendRequest(state,{
                success  : myDataTable.onDataReturnSetRows,
                failure  : myDataTable.onDataReturnSetRows,
                scope    : myDataTable
        });
    };

    // Support users visiting the page for the first time or from a
    // saved bookmark.
    var initialState = History.getBookmarkedState('myDataTable') ||
                       generateStateString(0,'id','asc',10);

    // Register a 'myDataTable' module in the BHM, indicating this session's
    // initial state and the callback to handle onStateChange events.
    History.register('myDataTable',initialState, handleHistoryNavigation);
</textarea>

<p>To facilitate the Browser History Manager remembering pagination and sorting states, we'll need to use custom pagination and sorting handlers.  Each will generate a new state and simply call the BHM's <code>navigate</code> method.  The <code>onStateChange</code> handler will take over from there.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
    // function used to intercept pagination requests
    var handlePagination = function (state,datatable) {
        var sortedBy  = datatable.get('sortedBy');

        var newState = generateStateString(
                            state.recordOffset,
                            sortedBy.key,
                            sortedBy.dir.replace('yui-dt-',''), // reduce to 'asc' or 'desc'
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

        var newBookmark = generateStateString(0, oColumn.key, sDir,rpp);

        YAHOO.util.History.navigate("myDataTable", newBookmark);
    };
</textarea>

<p>Finally, we create the DataTable instance and the supporting class instances in the History Manager's <code>onReady</code> handler.  This guarantees that whether users arrive at the page fresh, from a bookmark, or from navigating via the browser's back/forward buttons, the DataTable will display the appropriate state.</p>
<p>Note the DataSource is configured with a number of <code>metaFields</code>, which are processed by the DataTable to automatically update sorting and pagination information.  See the note on <a href="http://developer.yahoo.com/yui/datatable/#magic_meta">magic meta</a> in the DataTable docs for more information.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
        // Expand the sort direction (e.g. 'asc') understood by the server
        // to the proper DataTable sort direction identifier ('yui-dt-asc')
        // after the data is parsed, but before the response is passed
        // to the DataTable
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
</textarea>
