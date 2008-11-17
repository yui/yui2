<div id="basic"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Basic = function() {
        var myColumnDefs = [
            {key:"id", sortable:true, resizeable:true},
            {key:"date", formatter:YAHOO.widget.DataTable.formatDate, sortable:true, sortOptions:{defaultDir:YAHOO.widget.DataTable.CLASS_DESC},resizeable:true},
            {key:"quantity", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true, resizeable:true},
            {key:"amount", formatter:YAHOO.widget.DataTable.formatCurrency, sortable:true, resizeable:true},
            {key:"title", sortable:true, resizeable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.bookorders);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["id","date","quantity","amount","title"]
        };

        var myDataTable = new YAHOO.widget.DataTable("basic",
                myColumnDefs, myDataSource, {caption:"DataTable Caption"});
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
