<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    emails: {
        account:"jenny@yahoo.com",
        currStorage: 10,
        maxStorage: 200,
        messages: [
            {XID: "9897",Date:new Date(1981, 2, 24),To:"Joe",From:"Jenny",Unread:false,Subject:"Check out my new pictures"},
            {XID: "7899",Date:new Date(1980, 1, 11),To:"Jane",From:"Jenny",Unread:false,Subject:"Let's have lunch"},
            {XID: "6789",Date:new Date(1978, 11, 12),To:"Ann",From:"Jenny",Unread:false,Subject:"Here's the info you requested"},
            {XID: "4996",Date:new Date(1974, 1, 11),To:"Bob",From:"Jenny",Unread:true,Subject:"RE: Let's have lunch"},
            {XID: "4544",Date:new Date(1974, 1, 10),To:"Charlie",From:"Jenny",Unread:false,Subject:"Birthday party Saturday"}
        ]
    }
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* custom styles for this example */
.yui-skin-sam .yui-dt-body { cursor:pointer; } /* when rows are selectable */
#single { margin-top:2em; }
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="standard"&gt;&lt;/div&gt;
&lt;div id="single"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.RowSelection = new function() {
        var myColumnDefs = [
            {key:"Date",formatter:YAHOO.widget.DataTable.formatDate, sortable:true},
            {key:"To", sortable:true},
            {key:"From", sortable:true},
            {key:"Subject", sortable:true}
        ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.emails);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        this.myDataSource.responseSchema = {
            resultsList: "messages",
            fields: ["Date","To","From","Subject","XID","Date","Attachment"]
        };

        this.standardSelectDataTable = new YAHOO.widget.DataTable("standard",
                myColumnDefs, this.myDataSource, {
                    caption:"Standard Row Selection with Support for Modifier Keys"
                });
                
        // Subscribe to events for row selection
        this.standardSelectDataTable.subscribe("rowMouseoverEvent", this.standardSelectDataTable.onEventHighlightRow);
        this.standardSelectDataTable.subscribe("rowMouseoutEvent", this.standardSelectDataTable.onEventUnhighlightRow);
        this.standardSelectDataTable.subscribe("rowClickEvent", this.standardSelectDataTable.onEventSelectRow);

        // Programmatically select the first row
        this.standardSelectDataTable.selectRow(this.standardSelectDataTable.getTrEl(0));
        // Programmatically bring focus to the instance so arrow selection works immediately
        this.standardSelectDataTable.focus();
        
        this.singleSelectDataTable = new YAHOO.widget.DataTable("single",
                myColumnDefs, this.myDataSource, {
                    caption:"Single-Row Selection with Modifier Keys Disabled",
                    selectionMode:"single"
                });
                
        // Subscribe to events for row selection
        this.singleSelectDataTable.subscribe("rowMouseoverEvent", this.singleSelectDataTable.onEventHighlightRow);
        this.singleSelectDataTable.subscribe("rowMouseoutEvent", this.singleSelectDataTable.onEventUnhighlightRow);
        this.singleSelectDataTable.subscribe("rowClickEvent", this.singleSelectDataTable.onEventSelectRow);
        
        // Programmatically select the first row
        this.singleSelectDataTable.selectRow(this.singleSelectDataTable.getTrEl(0));
    };
});
</textarea>
