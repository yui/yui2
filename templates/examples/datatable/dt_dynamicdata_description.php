<h2 class="first">Code for this example</h2>

<p>This example requests fresh data from the DataSource for every change to 
the DataTable's sorting or pagination states.</p>

<p>The server-side script delivering the DataTable's records will send the data
in the following JSON format:</p>

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

<h2>CSS</h2>

<textarea name="code" class="CSS" cols="60" rows="1">
/* No custom CSS. */
</textarea>

<h2>The markup</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
&lt;div id="dynamicdata"&gt;&lt;/div&gt;
</textarea>

<h2>Javascript</h2>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.DynamicData = function() {
    // Column definitions
    var myColumnDefs = [ // sortable:true enables sorting
        {key:"id", label:"ID", sortable:true},
        {key:"name", label:"Name", sortable:true},
        {key:"date", label:"Date", sortable:true, formatter:"date"},
        {key:"price", label:"Price", sortable:true},
        {key:"number", label:"Number", sortable:true}
    ];

    // Custom parser
    var stringToDate = function(sData) {
        var array = sData.split("-");
        return new Date(array[1] + " " + array[0] + ", " + array[2]);
    };
    
    // DataSource instance
    var myDataSource = new YAHOO.util.DataSource("<?php echo("{$assetsDirectory}php/json_proxy.php?")?>");
    myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
    myDataSource.responseSchema = {
        resultsList: "records",
        fields: [
            {key:"id", parser:"number"},
            {key:"name"},
            {key:"date", parser:stringToDate},
            {key:"price",parser:"number"},
            {key:"number",parser:"number"}
        ],
        metaFields: {
            totalRecords: "totalRecords" // Access to value in the server response
        }
    };
    
    // DataTable configuration
    var myConfigs = {
        initialRequest: "sort=id&dir=asc&startIndex=0&results=25", // Initial request for first page of data
        dynamicData: true, // Enables dynamic server-driven data
        sortedBy : {key:"id", dir:YAHOO.widget.DataTable.CLASS_ASC}, // Sets UI initial sort arrow
        paginator: new YAHOO.widget.Paginator({ rowsPerPage:25 }) // Enables pagination 
    };
    
    // DataTable instance
    var myDataTable = new YAHOO.widget.DataTable("dynamicdata", myColumnDefs, myDataSource, myConfigs);
    // Update totalRecords on the fly with value from server
    myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
        oPayload.totalRecords = oResponse.meta.totalRecords;
        return oPayload;
    }
    
    return {
        ds: myDataSource,
        dt: myDataTable
    };
        
}();
</textarea>

