<div id="cell"></div>
<div id="row"></div>
<div id="column"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Highlighting = function() {
        var myColumnDefs = [
            {key:"Page"},
            {key:"VisitsThisMonth"},
            {key:"VisitsThisYear"},
            {key:"ViewsThisMonth"},
            {key:"ViewsThisYear"}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["Page","VisitsThisMonth","VisitsThisYear","ViewsThisMonth","ViewsThisYear"]
        };

        var cellHighlightDataTable = new YAHOO.widget.DataTable("cell",
                myColumnDefs, myDataSource, {
                    caption:"Example: Cell Highlighting"
                });
        // Enable cell highlighting
        cellHighlightDataTable.subscribe("cellMouseoverEvent", cellHighlightDataTable.onEventHighlightCell);
        cellHighlightDataTable.subscribe("cellMouseoutEvent", cellHighlightDataTable.onEventUnhighlightCell);

        var rowHighlightDataTable = new YAHOO.widget.DataTable("row",
                myColumnDefs, myDataSource, {
                    caption:"Example: Row Highlighting"
                });
        // Enable row highlighting
        rowHighlightDataTable.subscribe("rowMouseoverEvent", rowHighlightDataTable.onEventHighlightRow);
        rowHighlightDataTable.subscribe("rowMouseoutEvent", rowHighlightDataTable.onEventUnhighlightRow);

        var colHighlightDataTable = new YAHOO.widget.DataTable("column",
                myColumnDefs, myDataSource, {
                    caption:"Example: Column Highlighting"
                });
        // Enable Column highlighting
        colHighlightDataTable.subscribe("theadCellMouseoverEvent", colHighlightDataTable.onEventHighlightColumn);
        colHighlightDataTable.subscribe("theadCellMouseoutEvent", colHighlightDataTable.onEventUnhighlightColumn);
        
        return {
            oDS: myDataSource,
            oDTCellHighlight: cellHighlightDataTable,
            oDTRowHighlight: rowHighlightDataTable,
            oDTColHighlight: colHighlightDataTable
        };
    }();
});
</script>
