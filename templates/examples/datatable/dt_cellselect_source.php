<div id="cellblock"></div>
<div id="cellrange"></div>
<div id="singlecell"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.CellSelection = function() {
        var myColumnDefs = [
            {key:"col1", sortable:true},
            {key:"col2", sortable:true},
            {key:"col3", sortable:true},
            {key:"col4", sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["col0","col1","col2","col3","col4"]
        };

        var cellBlockSelectDataTable = new YAHOO.widget.DataTable("cellblock",
                myColumnDefs, myDataSource, {
                    caption:"Cell-Block Selection Mode with Support for Modifier Keys",
                    selectionMode:"cellblock"
                });

        // Subscribe to events for cell selection
        cellBlockSelectDataTable.subscribe("cellMouseoverEvent", cellBlockSelectDataTable.onEventHighlightCell);
        cellBlockSelectDataTable.subscribe("cellMouseoutEvent", cellBlockSelectDataTable.onEventUnhighlightCell);
        cellBlockSelectDataTable.subscribe("cellClickEvent", cellBlockSelectDataTable.onEventSelectCell);
        cellBlockSelectDataTable.subscribe("cellSelectEvent", cellBlockSelectDataTable.clearTextSelection);

        var cellRangeSelectDataTable = new YAHOO.widget.DataTable("cellrange",
                myColumnDefs, myDataSource, {
                    caption:"Example: Cell-Range Selection Mode Support for Modifier Keys",
                    selectionMode:"cellrange"
                });

        // Subscribe to events for cell selection
        cellRangeSelectDataTable.subscribe("cellMouseoverEvent", cellRangeSelectDataTable.onEventHighlightCell);
        cellRangeSelectDataTable.subscribe("cellMouseoutEvent", cellRangeSelectDataTable.onEventUnhighlightCell);
        cellRangeSelectDataTable.subscribe("cellClickEvent", cellRangeSelectDataTable.onEventSelectCell);
        cellRangeSelectDataTable.subscribe("cellSelectEvent", cellRangeSelectDataTable.clearTextSelection);

        var singleCellSelectDataTable = new YAHOO.widget.DataTable("singlecell",
                myColumnDefs, myDataSource, {
                    caption:"Single-Cell Selection Mode with Modifier Keys Disabled",
                    selectionMode:"singlecell"
                });

        // Subscribe to events for cell selection
        singleCellSelectDataTable.subscribe("cellMouseoverEvent", singleCellSelectDataTable.onEventHighlightCell);
        singleCellSelectDataTable.subscribe("cellMouseoutEvent", singleCellSelectDataTable.onEventUnhighlightCell);
        singleCellSelectDataTable.subscribe("cellClickEvent", singleCellSelectDataTable.onEventSelectCell);
        singleCellSelectDataTable.subscribe("cellSelectEvent", singleCellSelectDataTable.clearTextSelection);
        
        return {
            oDS: myDataSource,
            oDTCellBlockSelect: cellBlockSelectDataTable,
            oDTCellRangeSelect: cellRangeSelectDataTable,
            oDTSingleCellSelect: singleCellSelectDataTable
        };
    }();
});
</script>
