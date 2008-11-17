<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    webstats: [
        ["home.html",20,400,44,657],
        ["blog.html",24,377,97,567],
        ["contact.html",32,548,42,543],
        ["about.html",8,465,12,946],
        ["pagenotfound.html",0,0,0,0]
    ]
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* custom styles for this example */
.yui-skin-sam .yui-dt-body { cursor:pointer; } /* when cells are selectable */
#cellrange, #singlecell { margin-top:2em; }
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="cellblock"&gt;&lt;/div&gt;
&lt;div id="cellrange"&gt;&lt;/div&gt;
&lt;div id="singlecell"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.CellSelection = new function() {
        var myColumnDefs = [
            {key:"col1", sortable:true},
            {key:"col2", sortable:true},
            {key:"col3", sortable:true},
            {key:"col4", sortable:true}
        ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        this.myDataSource.responseSchema = {
            fields: ["col0","col1","col2","col3","col4"]
        };

        this.cellBlockSelectDataTable = new YAHOO.widget.DataTable("cellblock",
                myColumnDefs, this.myDataSource, {
                    caption:"Cell-Block Selection Mode with Support for Modifier Keys",
                    selectionMode:"cellblock"
                });

        // Subscribe to events for cell selection
        this.cellBlockSelectDataTable.subscribe("cellMouseoverEvent", this.cellBlockSelectDataTable.onEventHighlightCell);
        this.cellBlockSelectDataTable.subscribe("cellMouseoutEvent", this.cellBlockSelectDataTable.onEventUnhighlightCell);
        this.cellBlockSelectDataTable.subscribe("cellClickEvent", this.cellBlockSelectDataTable.onEventSelectCell);
        this.cellBlockSelectDataTable.subscribe("cellSelectEvent", this.cellBlockSelectDataTable.clearTextSelection);

        this.cellRangeSelectDataTable = new YAHOO.widget.DataTable("cellrange",
                myColumnDefs, this.myDataSource, {
                    caption:"Example: Cell-Range Selection Mode Support for Modifier Keys",
                    selectionMode:"cellrange"
                });

        // Subscribe to events for cell selection
        this.cellRangeSelectDataTable.subscribe("cellMouseoverEvent", this.cellRangeSelectDataTable.onEventHighlightCell);
        this.cellRangeSelectDataTable.subscribe("cellMouseoutEvent", this.cellRangeSelectDataTable.onEventUnhighlightCell);
        this.cellRangeSelectDataTable.subscribe("cellClickEvent", this.cellRangeSelectDataTable.onEventSelectCell);
        this.cellRangeSelectDataTable.subscribe("cellSelectEvent", this.cellRangeSelectDataTable.clearTextSelection);

        this.singleCellSelectDataTable = new YAHOO.widget.DataTable("singlecell",
                myColumnDefs, this.myDataSource, {
                    caption:"Single-Cell Selection Mode with Modifier Keys Disabled",
                    selectionMode:"singlecell"
                });

        // Subscribe to events for cell selection
        this.singleCellSelectDataTable.subscribe("cellMouseoverEvent", this.singleCellSelectDataTable.onEventHighlightCell);
        this.singleCellSelectDataTable.subscribe("cellMouseoutEvent", this.singleCellSelectDataTable.onEventUnhighlightCell);
        this.singleCellSelectDataTable.subscribe("cellClickEvent", this.singleCellSelectDataTable.onEventSelectCell);
        this.singleCellSelectDataTable.subscribe("cellSelectEvent", this.singleCellSelectDataTable.clearTextSelection);
    };
});
</textarea>
