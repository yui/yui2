<div id="localxml"></div>

<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Local_XML = function() {
        var myDataSource, myDataTable;
        
        var connectionCallback = {
            success: function(o) {
                var xmlDoc = o.responseXML;

                var myColumnDefs = [
                    {key:"Title", label:"Name", sortable:true, formatter:"link"},
                    {key:"Phone"},
                    {key:"City"},
                    {key:"AverageRating", label:"Rating",formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
                ];

                myDataSource = new YAHOO.util.DataSource(xmlDoc);
                myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
                myDataSource.responseSchema = {
                    resultNode: "Result",
                    fields: ["Title","Phone","City",{key:"AverageRating",parser:"number"},"ClickUrl"]
                };

                myDataTable = new YAHOO.widget.DataTable("localxml", myColumnDefs, myDataSource);

            },
            failure: function(o) {

            }
        };

        var getXML = YAHOO.util.Connect.asyncRequest("GET",
                "<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?query=pizza&zip=94089&results=10",
                connectionCallback);
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
