<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    bookorders: [
        {id:"po-0167", date:new Date(1980, 2, 24), quantity:1, amount:4, title:"A Book About Nothing"},
        {id:"po-0783", date:new Date("January 3, 1983"), quantity:null, amount:12.12345, title:"The Meaning of Life"},
        {id:"po-0297", date:new Date(1978, 11, 12), quantity:12, amount:1.25, title:"This Book Was Meant to Be Read Aloud"},
        {id:"po-1482", date:new Date("March 11, 1985"), quantity:6, amount:3.5, title:"Read Me Twice"}
    ]
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">.yui-skin-sam .yui-dt-liner { white-space:nowrap; } 
/
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="basic"&gt;&lt;/div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Basic = function() {
        var myColumnDefs = [
            {key:"id", sortable:true, resizeable:true},
            {key:"date", formatter:YAHOO.widget.DataTable.formatDate, sortable:true, sortOptions:{defaultDir:YAHOO.widget.DataTable.CLASS_DESC},resizeable:true},
            {key:"quantity", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true, resizeable:true},
            {key:"amount", formatter:YAHOO.widget.DataTable.formatCurrency, sortable:true, resizeable:true},
            {key:"title", sortable:true, resizeable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.bookorders);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["id","date","quantity","amount","title"]
        };

        var myDataTable = new YAHOO.widget.DataTable("basic",
                myColumnDefs, myDataSource, {caption:"DataTable Caption"});
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</textarea>
