<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<style type="text/css">
/* custom styles for this example */
#dt-pag-nav { margin-bottom:1em; } /* custom pagination UI */
</style>

</head>

<body class="yui-skin-sam">
<h1>Server-side Pagination</h1>
<div id="dt-pag-nav">
    <span id="prevLink">&lt;</span> Showing items
    <span id="startIndex">0</span> - <span id="endIndex">24</span>
    <span id="ofTotal"></span> <span id="nextLink">&gt;</span>
</div>
<div id="serverpagination"></div>

<script type="text/javascript" src="../../build/yuiloader/yuiloader.js"></script>
<script type="text/javascript">
var loader = new YAHOO.util.YUILoader();
loader.insert({
    require: ["fonts", "connection", "json", "datatable"],
    base: '../../build/',
    onSuccess: function() {
        YAHOO.example.ServerPagination = function() {
            // Column definitions
            var myColumnDefs = [
                {key:"id", label:"ID"},
                {key:"name", label:"Name"},
                {key:"date", label:"Date"},
                {key:"price", label:"Price"},
                {key:"number", label:"Number"}
            ];

            // DataSource instance
            var myDataSource = new YAHOO.util.DataSource("assets/php/json_proxy.php?");
            myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            myDataSource.responseSchema = {
                resultsList: "records",
                fields: ["id","name","date","price"]
            };

            // DataTable instance
            var oConfigs = {
                initialRequest: "startIndex=0&results=25" // Initial values
            };
            var myDataTable = new YAHOO.widget.DataTable("serverpagination", myColumnDefs,
                    myDataSource, oConfigs);

            // Custom code to parse the raw server data for Paginator values and page links
            // Upgrade note: As of 2.5.0, the second argument is the full type-converted
            // response from the live data, and not the unconverted raw response
            myDataSource.doBeforeCallback = function(oRequest, oFullResponse, oParsedResponse) {
                var oSelf = YAHOO.example.ServerPagination;
                var oDataTable = oSelf.myDataTable;

                // Get Paginator values
                var recordsReturned = oFullResponse.recordsReturned; // How many records this page
                var startIndex = oFullResponse.startIndex; // Start record index this page
                var endIndex = startIndex + recordsReturned -1; // End record index this page
                var totalRecords = oFullResponse.totalRecords; // Total records all pages

                // Update the DataTable Paginator with new values
                var newPag = {
                    recordsReturned: recordsReturned,
                    startRecordIndex: startIndex,
                    endIndex: endIndex,
                    totalRecords: totalRecords
                }
                oDataTable.updatePaginator(newPag);

                // Update the links UI
                YAHOO.util.Dom.get("prevLink").innerHTML = (startIndex === 0) ? "&lt;" :
                        "<a href=\"#previous\" alt=\"Show previous items\">&lt;</a>" ;
                YAHOO.util.Dom.get("nextLink").innerHTML =
                        (endIndex + 1 >= totalRecords) ? "&gt;" :
                        "<a href=\"#next\" alt=\"Show next items\">&gt;</a>";
                YAHOO.util.Dom.get("startIndex").innerHTML = startIndex;
                YAHOO.util.Dom.get("endIndex").innerHTML = endIndex;
                YAHOO.util.Dom.get("ofTotal").innerHTML = " of " + totalRecords;

                // Let the DataSource parse the rest of the response
                return oParsedResponse;
            };

            // Hook up custom pagination
            var getPage = function(nStartRecordIndex, nResults) {
                // If a new value is not passed in
                // use the old value
                if(!YAHOO.lang.isValue(nResults)) {
                    nResults = myDataTable.get("paginator").totalRecords;
                }
                // Invalid value
                if(!YAHOO.lang.isValue(nStartRecordIndex)) {
                    return;
                }
                // Send request
                var newRequest = "startIndex=" + nStartRecordIndex + "&results=" + nResults;
                var callback = {
                    success : myDataTable.onDataReturnInitializeTable,
                    failure : myDataTable.onDataReturnInitializeTable,
                    scope : myDataTable
                };
                myDataSource.sendRequest(newRequest, callback);
            };
            var getPreviousPage = function(e) {
                YAHOO.util.Event.stopEvent(e);
                // Already at first page
                if(myDataTable.get("paginator").startRecordIndex === 0) {
                    return;
                }
                var newStartRecordIndex = myDataTable.get("paginator").startRecordIndex - myDataTable.get("paginator").rowsThisPage;
                getPage(newStartRecordIndex);
            };
            var getNextPage = function(e) {
                YAHOO.util.Event.stopEvent(e);
                // Already at last page
                if(myDataTable.get("paginator").startRecordIndex +
                        myDataTable.get("paginator").rowsThisPage >=
                        myDataTable.get("paginator").totalRecords) {
                    return;
                }
                var newStartRecordIndex = (myDataTable.get("paginator").startRecordIndex + myDataTable.get("paginator").rowsThisPage);
                getPage(newStartRecordIndex);
            };
            YAHOO.util.Event.addListener(YAHOO.util.Dom.get("prevLink"), "click", getPreviousPage, this, true);
            YAHOO.util.Event.addListener(YAHOO.util.Dom.get("nextLink"), "click", getNextPage, this, true);
            
            return {
                oDS: myDataSource,
                oDT: myDataTable
            };
        }();
    }
});
</script>
</body>
</html>
