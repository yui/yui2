<div id="json"></div>


<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.XHR_JSON = function() {
        var formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("ClickUrl") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            {key:"Title", label:"Name", sortable:true, formatter:formatUrl},
            {key:"Phone"},
            {key:"City"},
            {key:"Rating.AverageRating", label:"Rating", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.connXhrMode = "queueRequests";
        myDataSource.responseSchema = {
            resultsList: "ResultSet.Result",
            fields: ["Title","Phone","City",{key:"Rating.AverageRating",parser:"number"},"ClickUrl"]
        };

        var myDataTable = new YAHOO.widget.DataTable("json", myColumnDefs,
                myDataSource, {initialRequest:"query=pizza&zip=94089&results=10&output=json"});

        var mySuccessHandler = function() {
            this.set("sortedBy", null);
            this.onDataReturnAppendRows.apply(this,arguments);
        };
        var myFailureHandler = function() {
            this.showTableMessage(YAHOO.widget.DataTable.MSG_ERROR, YAHOO.widget.DataTable.CLASS_ERROR);
            this.onDataReturnAppendRows.apply(this,arguments);
        };
        var callbackObj = {
            success : mySuccessHandler,
            failure : myFailureHandler,
            scope : myDataTable
        };
        
        myDataSource.sendRequest("query=mexican&zip=94089&results=10&output=json",
                callbackObj);

        myDataSource.sendRequest("query=chinese&zip=94089&results=10&output=json",
                callbackObj);
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
