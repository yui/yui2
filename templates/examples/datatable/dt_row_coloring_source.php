<div class="demo">
    <div id="tbl"></div>
</div>

<script type="text/javascript" src="<?php echo($assetsDirectory); ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function () {

// Create a shortcut
var Dom = YAHOO.util.Dom;

// Contain our code under the YAHOO.example namespace
var Ex = YAHOO.example;

// Create the DataSource
Ex.dataSource = new YAHOO.util.DataSource(Ex.Data.inventory);
Ex.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
Ex.dataSource.responseSchema = {
    fields : ['SKU','Quantity','Item','Description']
};

// Define a custom row formatter function
var myRowFormatter = function(elTr, oRecord) {
    if (oRecord.getData('Quantity') < 40) {
        Dom.addClass(elTr, 'mark');
    }
    return true;
}; 

// Instantiate the DataTable.
Ex.dataTable = new YAHOO.widget.DataTable('tbl',
                [ {key:'SKU',sortable: true},
                  {key:'Item',sortable: true},
                  {key:'Quantity',sortable: true},
                  {key:'Description',sortable: true}
                ],
                Ex.dataSource,
                {formatRow: myRowFormatter}); // Enable the row formatter
});
</script>
