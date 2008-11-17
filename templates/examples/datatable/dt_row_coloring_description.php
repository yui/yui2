<h2 class="first">CSS</h2>

<p>We apply custom CSS for a simpler looking table so the marked rows can really stand out.</p>
<textarea name="code" class="CSS" cols="60" rows="1">
/* Remove row striping, column borders, and sort highlighting */
.yui-skin-sam tr.yui-dt-odd,
.yui-skin-sam tr.yui-dt-odd td.yui-dt-asc,
.yui-skin-sam tr.yui-dt-odd td.yui-dt-desc,
.yui-skin-sam tr.yui-dt-even td.yui-dt-asc,
.yui-skin-sam tr.yui-dt-even td.yui-dt-desc {
    background-color: #fff;
}
.yui-skin-sam .yui-dt tbody td {
    border-bottom: 1px solid #ddd;
}
.yui-skin-sam .yui-dt thead th {
    border-bottom: 1px solid #7f7f7f;
}
.yui-skin-sam .yui-dt tr.yui-dt-last td,
.yui-skin-sam .yui-dt th,
.yui-skin-sam .yui-dt td {
    border: none;
}

/* Class for marked rows */
.yui-skin-sam .yui-dt tr.mark,
.yui-skin-sam .yui-dt tr.mark td.yui-dt-asc,
.yui-skin-sam .yui-dt tr.mark td.yui-dt-desc,
.yui-skin-sam .yui-dt tr.mark td.yui-dt-asc,
.yui-skin-sam .yui-dt tr.mark td.yui-dt-desc {
    background-color: #a33;
    color: #fff;
}
</textarea>

<h2>Markup:</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="tbl"></div>
</textarea>

<h2>JavaScript:</h2>

<p>A custom row formatter is used to examine for Records where Quantity is less than 40 and apply a CSS class to the TR element to turn it a different color.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
