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

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="nested"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.NestedHeaders = new function() {
        var myColumnDefs = [
            {key:"page", label:"Page", sortable:true, resizeable:true},
            {label:"Statistics", formatter:YAHOO.widget.DataTable.formatNumber, children:[
                {label:"Visits",
                    children: [
                        {key:"visitsmonth", label:"This Month",sortable:true, resizeable:true},
                        {key:"visitsytd", label:"YTD", abbr:"Year to Date",sortable:true, resizeable:true}
                    ]
                },
                {label:"Views",
                    children: [
                        {key:"viewsmonth", label:"This Month",sortable:true, resizeable:true},
                        {key:"viewsytd", label:"YTD", abbr:"Year to Date",sortable:true, resizeable:true}
                    ]

                }
            ]}
        ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        this.myDataSource.responseSchema = {
            fields: ["page","visitsmonth","visitsytd","viewsmonth","viewsytd"]
        };

        this.myDataTable = new YAHOO.widget.DataTable("nested", myColumnDefs, this.myDataSource);
    };
});
</textarea>
