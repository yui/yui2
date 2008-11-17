<div id="buttons">
    <span id="addrow" class="yui-button yui-push-button">
        <span class="first-child">
            <button type="button">Add one row</button>
        </span>
    </span>
    <span id="deleterow" class="yui-button yui-push-button">
        <span class="first-child">
            <button type="button">Delete top row</button>
        </span>
    </span>
    <span id="addrows" class="yui-button yui-push-button">
        <span class="first-child">
            <button type="button">Add 20 rows</button>
        </span>
    </span>
    <span id="deleterows" class="yui-button yui-push-button">
        <span class="first-child">
            <button type="button" name="button5">Delete top 20 rows</button>
        </span>
    </span>
</div>
<div id="basic"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.DynamicData = function() {
        var data = {one:"one",two:"two",three:"three"};
        
        var myColumnDefs = [
            {key:"row",resizeable:true,sortable:true},
            {key:"one",resizeable:true},
            {key:"two",resizeable:true},
            {key:"three",resizeable:true}   
        ];

        var myDataSource = new YAHOO.util.DataSource([]);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["one","two","three"]
        };
        
        var myDataTable = new YAHOO.widget.DataTable("basic",
                myColumnDefs, myDataSource, {});
                
        var i=1,
            bReverseSorted = false;

        // Track when Column is reverse-sorted, since new data will come in out of order
        var trackReverseSorts = function(oArg) {
            bReverseSorted = (oArg.dir === YAHOO.widget.DataTable.CLASS_DESC);
        };
        myDataTable.subscribe("columnSortEvent", trackReverseSorts);

        // Add one row to the bottom
        var btnAddRow = new YAHOO.widget.Button("addrow");
        btnAddRow.on("click", function() {
            // Clear sort when necessary
            if(bReverseSorted) {
                myDataTable.set("sortedBy", null);
            }
            
            var record = YAHOO.widget.DataTable._cloneObject(data);
            record.row = i++;
            myDataTable.addRow(record);
        },this,true);

        // Add 20 rows to the bottom
        var btnAddRows = new YAHOO.widget.Button("addrows");
        btnAddRows.on("click", function(e) {
            // Clear sort when necessary
            if(bReverseSorted) {
                myDataTable.set("sortedBy", null);
            }

            var myArray = [];
            for(var l=i;i<=l+19;i++) {
                var record = YAHOO.widget.DataTable._cloneObject(data);
                record.row = i;
                myArray.push(record);
            }
            myDataTable.addRows(myArray); 
        },this,true);
        
        // Delete one row from the top
        var btnDeleteRow = new YAHOO.widget.Button("deleterow");
        btnDeleteRow.on("click", function() {
            if(myDataTable.getRecordSet().getLength() > 0) {
                myDataTable.deleteRow(0);
            }
        },this,true);
        
        // Delete 20 row from the top
        var btnDeleteRows = new YAHOO.widget.Button("deleterows");
        btnDeleteRows.on("click", function() {
            var length = myDataTable.getRecordSet().getLength();
            if(length > 0) {
                var count = (length > 19) ? 20 : length;
                myDataTable.deleteRows(0,count);
            }
        },this,true);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
