<div id="standard"></div>
<div id="single"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.RowSelection = function() {
        var myColumnDefs = [
            {key:"Date",formatter:YAHOO.widget.DataTable.formatDate, sortable:true},
            {key:"To", sortable:true},
            {key:"From", sortable:true},
            {key:"Subject", sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.emails);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.responseSchema = {
            resultsList: "messages",
            fields: ["Date","To","From","Subject","XID","Date","Attachment"]
        };

        var standardSelectDataTable = new YAHOO.widget.DataTable("standard",
                myColumnDefs, myDataSource, {
                    caption:"Standard Row Selection with Support for Modifier Keys"
                });
                
        // Subscribe to events for row selection
        standardSelectDataTable.subscribe("rowMouseoverEvent", standardSelectDataTable.onEventHighlightRow);
        standardSelectDataTable.subscribe("rowMouseoutEvent", standardSelectDataTable.onEventUnhighlightRow);
        standardSelectDataTable.subscribe("rowClickEvent", standardSelectDataTable.onEventSelectRow);

        // Programmatically select the first row
        standardSelectDataTable.selectRow(standardSelectDataTable.getTrEl(0));
        // Programmatically bring focus to the instance so arrow selection works immediately
        standardSelectDataTable.focus();
        
        var singleSelectDataTable = new YAHOO.widget.DataTable("single",
                myColumnDefs, myDataSource, {
                    caption:"Single-Row Selection with Modifier Keys Disabled",
                    selectionMode:"single"
                });
                
        // Subscribe to events for row selection
        singleSelectDataTable.subscribe("rowMouseoverEvent", singleSelectDataTable.onEventHighlightRow);
        singleSelectDataTable.subscribe("rowMouseoutEvent", singleSelectDataTable.onEventUnhighlightRow);
        singleSelectDataTable.subscribe("rowClickEvent", singleSelectDataTable.onEventSelectRow);
        
        // Programmatically select the first row
        singleSelectDataTable.selectRow(singleSelectDataTable.getTrEl(0));
        
        return {
            oDS: myDataSource,
            oDTStandardSelect: standardSelectDataTable,
            oDTSingleSelect: singleSelectDataTable
        };
    }();
});
</script>
