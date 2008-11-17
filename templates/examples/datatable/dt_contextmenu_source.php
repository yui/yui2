<div id="myContainer"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.ContextMenu = function() {
        var myColumnDefs = [
            {key:"SKU", sortable:true},
            {key:"Quantity", sortable:true},
            {key:"Item", sortable:true},
            {key:"Description"}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.inventory);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["SKU","Quantity","Item","Description"]
        };

        var myDataTable = new YAHOO.widget.DataTable("myContainer", myColumnDefs, myDataSource);

        var onContextMenuClick = function(p_sType, p_aArgs, p_myDataTable) {
            var task = p_aArgs[1];
            if(task) {
                // Extract which TR element triggered the context menu
                var elRow = this.contextEventTarget;
                elRow = p_myDataTable.getTrEl(elRow);

                if(elRow) {
                    switch(task.index) {
                        case 0:     // Delete row upon confirmation
                            var oRecord = p_myDataTable.getRecord(elRow);
                            if(confirm("Are you sure you want to delete SKU " +
                                    oRecord.getData("SKU") + " (" +
                                    oRecord.getData("Description") + ")?")) {
                                p_myDataTable.deleteRow(elRow);
                            }
                    }
                }
            }
        };

        var myContextMenu = new YAHOO.widget.ContextMenu("mycontextmenu",
                {trigger:myDataTable.getTbodyEl()});
        myContextMenu.addItem("Delete Item");
        // Render the ContextMenu instance to the parent container of the DataTable
        myContextMenu.render("myContainer");
        myContextMenu.clickEvent.subscribe(onContextMenuClick, myDataTable);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
