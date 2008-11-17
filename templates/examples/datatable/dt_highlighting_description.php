<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data.webstats = [
    ["home.html",20,400,44,657],
    ["blog.html",24,377,97,567],
    ["contact.html",32,548,42,543],
    ["about.html",8,465,12,946],
    ["pagenotfound.html",0,0,0,0]
]
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="cell"&gt;&lt;/div&gt;
&lt;div id="row"&gt;&lt;/div&gt;
&lt;div id="column"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Highlighting = new function() {
        var myColumnDefs = [
            {key:"Page"},
            {key:"VisitsThisMonth"},
            {key:"VisitsThisYear"},
            {key:"ViewsThisMonth"},
            {key:"ViewsThisYear"}
        ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        this.myDataSource.responseSchema = {
            fields: ["Page","VisitsThisMonth","VisitsThisYear","ViewsThisMonth","ViewsThisYear"]
        };

        this.cellHighlightDataTable = new YAHOO.widget.DataTable("cell",
                myColumnDefs, this.myDataSource, {
                    caption:"Example: Cell Highlighting"
                });
        // Enable cell highlighting
        this.cellHighlightDataTable.subscribe("cellMouseoverEvent", this.cellHighlightDataTable.onEventHighlightCell);
        this.cellHighlightDataTable.subscribe("cellMouseoutEvent", this.cellHighlightDataTable.onEventUnhighlightCell);

        this.rowHighlightDataTable = new YAHOO.widget.DataTable("row",
                myColumnDefs, this.myDataSource, {
                    caption:"Example: Row Highlighting"
                });
        // Enable row highlighting
        this.rowHighlightDataTable.subscribe("rowMouseoverEvent", this.rowHighlightDataTable.onEventHighlightRow);
        this.rowHighlightDataTable.subscribe("rowMouseoutEvent", this.rowHighlightDataTable.onEventUnhighlightRow);

        this.colHighlightDataTable = new YAHOO.widget.DataTable("column",
                myColumnDefs, this.myDataSource, {
                    caption:"Example: Column Highlighting"
                });
        // Enable Column highlighting
        this.colHighlightDataTable.subscribe("theadCellMouseoverEvent", this.colHighlightDataTable.onEventHighlightColumn);
        this.colHighlightDataTable.subscribe("theadCellMouseoutEvent", this.colHighlightDataTable.onEventUnhighlightColumn);
    };
});
</textarea>
