<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">{"recordsReturned":25,
    "totalRecords":1397,
    "startIndex":0,
    "sort":null,
    "dir":"asc",
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

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* custom styles for this example */
#dt-pag-nav { margin:1em; } /* custom pagination UI */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="dt-pag-nav"&gt;
    &lt;span id="prevLink"&gt;&lt;&lt;/span&gt; Showing items
    &lt;span id="startIndex"&gt;0&lt;/span&gt; - &lt;span id="endIndex"&gt;24&lt;/span&gt;
    &lt;span id="ofTotal"&gt;&lt;/span&gt; &lt;span id="nextLink"&gt;&gt;&lt;/span&gt;
&lt;/div&gt;
&lt;div id="serverpagination"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.ServerPagination = new function() {
        // Column definitions
        var myColumnDefs = [
            {key:"id", label:"ID"},
            {key:"name", label:"Name"},
            {key:"date", label:"Date"},
            {key:"price", label:"Price"},
            {key:"number", label:"Number"}
        ];

        // DataSource instance
        this.myDataSource = new YAHOO.util.DataSource("assets/php/json_proxy.php?");
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        this.myDataSource.responseSchema = {
            resultsList: "records",
            fields: ["id","name","date","price","number"]
        };

        // DataTable instance
        var oConfigs = {
            initialRequest: "startIndex=0&results=25" // Initial values
        };
        this.myDataTable = new YAHOO.widget.DataTable("serverpagination", myColumnDefs,
                this.myDataSource, oConfigs);

            // Custom code to parse the raw server data for Paginator values and page links
            // Upgrade note: As of 2.5.0, the second argument is the full type-converted
            // response from the live data, and not the unconverted raw response
            this.myDataSource.doBeforeCallback = function(oRequest, oFullResponse, oParsedResponse) {
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
                totalResults: totalRecords
            }
            oDataTable.updatePaginator(newPag);

            // Update the links UI
            YAHOO.util.Dom.get("prevLink").innerHTML = (startIndex === 0) ? "&lt;" :
                    "<a href=\"#previous\" alt=\"Show previous items\">&lt;</a>" ;
            YAHOO.util.Dom.get("nextLink").innerHTML =
                    (endIndex >= totalRecords) ? "&gt;" :
                    "<a href=\"#next\" alt=\"Show next items\">&gt;</a>";
            YAHOO.util.Dom.get("startIndex").innerHTML = startIndex;
            YAHOO.util.Dom.get("endIndex").innerHTML = endIndex;
            YAHOO.util.Dom.get("ofTotal").innerHTML = " of " + totalRecords;

            // Let the DataSource parse the rest of the response
            return oParsedResponse;
        };

        // Hook up custom pagination
        this.getPage = function(nStartRecordIndex, nResults) {
            // If a new value is not passed in
            // use the old value
            if(!YAHOO.lang.isValue(nResults)) {
                nResults = this.myDataTable.get("paginator").totalRecords;
            }
            // Invalid value
            if(!YAHOO.lang.isValue(nStartRecordIndex)) {
                return;
            }
            var newRequest = "startIndex=" + nStartRecordIndex + "&results=" + nResults;
            this.myDataSource.sendRequest(newRequest, this.myDataTable.onDataReturnInitializeTable, this.myDataTable);
        };
        this.getPreviousPage = function(e) {
            YAHOO.util.Event.stopEvent(e);
            // Already at first page
            if(this.myDataTable.get("paginator").startRecordIndex === 0) {
                return;
            }
            var newStartRecordIndex = this.myDataTable.get("paginator").startRecordIndex - this.myDataTable.get("paginator").rowsThisPage;
            this.getPage(newStartRecordIndex);
        };
        this.getNextPage = function(e) {
            YAHOO.util.Event.stopEvent(e);
            // Already at last page
            if(this.myDataTable.get("paginator").startRecordIndex +
                    this.myDataTable.get("paginator").rowsThispage >=
                    this.myDataTable.get("paginator").totalRecords) {
                return;
            }
            var newStartRecordIndex = (this.myDataTable.get("paginator").startRecordIndex + this.myDataTable.get("paginator").rowsThisPage);
            this.getPage(newStartRecordIndex);
        };
        YAHOO.util.Event.addListener(YAHOO.util.Dom.get("prevLink"), "click", this.getPreviousPage, this, true);
        YAHOO.util.Event.addListener(YAHOO.util.Dom.get("nextLink"), "click", this.getNextPage, this, true);
    };
});
</textarea>
