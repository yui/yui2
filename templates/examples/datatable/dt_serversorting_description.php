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

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="serversorting"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.ServerSorting = new function() {
        // Column definitions
        var myColumnDefs = [
            {key:"id", label:"ID", sortable:true},
            {key:"name", label:"Name", sortable:true},
            {key:"date", label:"Date", sortable:true},
            {key:"price", label:"Price", sortable:true},
            {key:"number", label:"Number", sortable:true}
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
            initialRequest: "sort=id&dir=asc&results=100", // Server parameters for initial request
            sortedBy: {key:"id", dir:YAHOO.widget.DataTable.CLASS_ASC}, // Set up initial column headers UI
            renderLoopSize: 25 // Bump up to account for large number of rows to display
        };
        this.myDataTable = new YAHOO.widget.DataTable("serversorting", myColumnDefs,
                this.myDataSource, oConfigs);

        // Override function for custom server-side sorting
        this.myDataTable.sortColumn = function(oColumn) {
            // Default ascending
            var sDir = "asc"
            
            // If already sorted, sort in opposite direction
            if(oColumn.key === this.get("sortedBy").key) {
                sDir = (this.get("sortedBy").dir === YAHOO.widget.DataTable.CLASS_ASC) ?
                        "desc" : "asc";
            }

            // Pass in sort values to server request
            var newRequest = "sort=" + oColumn.key + "&dir=" + sDir + "&results=100&startIndex=0";
            
            // Create callback for data request
            var oCallback = {
                success: this.onDataReturnInitializeTable,
                failure: this.onDataReturnInitializeTable,
                scope: this,
                argument: {
                    // Pass in sort values so UI can be updated in callback function
                    sorting: {
                        key: oColumn.key,
                        dir: (sDir === "asc") ? YAHOO.widget.DataTable.CLASS_ASC : YAHOO.widget.DataTable.CLASS_DESC
                    }
                }
            }
            
            // Send the request
            this.getDataSource().sendRequest(newRequest, oCallback);
        };
    };
});
</textarea>
