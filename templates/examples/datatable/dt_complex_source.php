<div id="complex"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.MultipleFeatures = function() {
        // Custom sort handler to sort by state and then by areacode
        // where a and b are Record instances to compare
        var sortStates = function(a, b, desc) {
            // Deal with empty values
            if(!YAHOO.lang.isValue(a)) {
                return (!YAHOO.lang.isValue(b)) ? 0 : 1;
            }
            else if(!YAHOO.lang.isValue(b)) {
                return -1;
            }

            // First compare by state
            var comp = YAHOO.util.Sort.compare;
            var compState = comp(a.getData("state"), b.getData("state"), desc);

            // If states are equal, then compare by areacode
            return (compState !== 0) ? compState : comp(a.getData("areacode"), b.getData("areacode"), desc);
        };

        var myColumnDefs = [
            {key:"areacode",label:"Area Codes",width:100,resizeable:true,sortable:true},
            {key:"state",label:"States",width:250,resizeable:true,sortable:true,
                    sortOptions:{sortFunction:sortStates}},
            {key:"notes",label:"Notes (editable)",editor:"textbox",resizeable:true,sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.areacodes);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["areacode","state"]
        };

        var myConfigs = {
            sortedBy:{key:"areacode",dir:"asc"},
            paginator: new YAHOO.widget.Paginator({
                rowsPerPage: 25,
                template: YAHOO.widget.Paginator.TEMPLATE_ROWS_PER_PAGE,
                rowsPerPageOptions: [10,25,50,100],
                pageLinks: 5
            })
        }

        var myDataTable = new YAHOO.widget.DataTable("complex", myColumnDefs, myDataSource, myConfigs);
        myDataTable.subscribe("rowClickEvent",myDataTable.onEventSelectRow);
        myDataTable.subscribe("cellDblclickEvent",myDataTable.onEventShowCellEditor);
        myDataTable.subscribe("editorBlurEvent", myDataTable.onEventSaveCellEditor);

        // When cell is edited, pulse the color of the row yellow
        var onCellEdit = function(oArgs) {
            var elCell = oArgs.editor.getTdEl();
            var oOldData = oArgs.oldData;
            var oNewData = oArgs.newData;

            // Grab the row el and the 2 colors
            var elRow = this.getTrEl(elCell);
            var origColor = YAHOO.util.Dom.getStyle(elRow.cells[0], "backgroundColor");
            var pulseColor = "#ff0";

            // Create a temp anim instance that nulls out when anim is complete
            var rowColorAnim = new YAHOO.util.ColorAnim(elRow.cells, {
                    backgroundColor:{to:origColor, from:pulseColor}, duration:2});
            var onComplete = function() {
                rowColorAnim = null;
                YAHOO.util.Dom.setStyle(elRow.cells, "backgroundColor", "");
            }
            rowColorAnim.onComplete.subscribe(onComplete);
            rowColorAnim.animate();
        }
        myDataTable.subscribe("editorSaveEvent", onCellEdit);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
