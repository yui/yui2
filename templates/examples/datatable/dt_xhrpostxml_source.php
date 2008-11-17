<div id="xml"></div>

<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.XHR_XML = function() {
        var formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("ClickUrl") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            {key:"Title", label:"Name", sortable:true, formatter:formatUrl},
            {key:"Phone"},
            {key:"City"},
            {key:"AverageRating", label:"Rating",formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?");
        myDataSource.connMethodPost = true;
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
        myDataSource.responseSchema = {
            resultNode: "Result",
            fields: ["Title","Phone","City",{key:"AverageRating",parser:"number"},"ClickUrl"]
        };

        var myDataTable = new YAHOO.widget.DataTable("xml", myColumnDefs,
                myDataSource, {initialRequest:"query=pizza&zip=94089&results=10"});

        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
