<div id="paginated"></div>

<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function() {
    YAHOO.example.ClientPagination = function() {
        var myColumnDefs = [
            {key:"id", label:"ID"},
            {key:"name", label:"Name"},
            {key:"date", label:"Date"},
            {key:"price", label:"Price"},
            {key:"number", label:"Number"}
        ];

        var myDataSource = new YAHOO.util.DataSource("<?php echo("{$assetsDirectory}php/json_proxy.php?"); ?>");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.responseSchema = {
            resultsList: "records",
            fields: ["id","name","date","price","number"]
        };

        var oConfigs = {
                paginator: new YAHOO.widget.Paginator({
                    rowsPerPage: 15
                }),
                initialRequest: "results=504"
        };
        var myDataTable = new YAHOO.widget.DataTable("paginated", myColumnDefs,
                myDataSource, oConfigs);
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
</body>
</html>
