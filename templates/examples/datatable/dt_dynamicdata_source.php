<div id="dynamicdata"></div>

<script type="text/javascript">
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
</script>
