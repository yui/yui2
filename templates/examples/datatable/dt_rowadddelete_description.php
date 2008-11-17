<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">#buttons {margin-bottom: 1em;}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="buttons"&gt;
    &lt;span id="addrow" class="yui-button yui-push-button"&gt;
        &lt;span class="first-child"&gt;
            &lt;button type="button"&gt;Add one row&lt;/button&gt;
        &lt;/span&gt;
    &lt;/span&gt;
    &lt;span id="deleterow" class="yui-button yui-push-button"&gt;
        &lt;span class="first-child"&gt;
            &lt;button type="button"&gt;Delete top row&lt;/button&gt;
        &lt;/span&gt;
    &lt;/span&gt;
    &lt;span id="addrows" class="yui-button yui-push-button"&gt;
        &lt;span class="first-child"&gt;
            &lt;button type="button"&gt;Add 20 rows&lt;/button&gt;
        &lt;/span&gt;
    &lt;/span&gt;
    &lt;span id="deleterows" class="yui-button yui-push-button"&gt;
        &lt;span class="first-child"&gt;
            &lt;button type="button" name="button5"&gt;Delete top 20 rows&lt;/button&gt;
        &lt;/span&gt;
    &lt;/span&gt;
&lt;/div&gt;
&lt;div id="basic"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.DynamicData = new function() {
        var data = {one:"one",two:"two",three:"three"};
        
        var myColumnDefs = [
            {key:"row",resizeable:true,sortable:true},
            {key:"one",resizeable:true},
            {key:"two",resizeable:true},
            {key:"three",resizeable:true}   
        ];

        this.myDataSource = new YAHOO.util.DataSource([]);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        this.myDataSource.responseSchema = {
            fields: ["one","two","three"]
        };
        
        this.myDataTable = new YAHOO.widget.DataTable("basic",
                myColumnDefs, this.myDataSource, {});
                
        var i=1,
            bReverseSorted = false;

        // Track when Column is reverse-sorted, since new data will come in out of order
        var trackReverseSorts = function(oArg) {
            bReverseSorted = (oArg.dir === YAHOO.widget.DataTable.CLASS_DESC);
        };
        this.myDataTable.subscribe("columnSortEvent", trackReverseSorts);

        // Add one row to the bottom
        var btnAddRow = new YAHOO.widget.Button("addrow");
        btnAddRow.on("click", function() {
            // Clear sort when necessary
            if(bReverseSorted) {
                this.myDataTable.set("sortedBy", null);
            }
            
            var record = YAHOO.widget.DataTable._cloneObject(data);
            record.row = i++;
            this.myDataTable.addRow(record);
        },this,true);

        // Add 20 rows to the bottom
        var btnAddRows = new YAHOO.widget.Button("addrows");
        btnAddRows.on("click", function(e) {
            // Clear sort when necessary
            if(bReverseSorted) {
                this.myDataTable.set("sortedBy", null);
            }

            var myArray = [];
            for(var l=i;i<=l+19;i++) {
                var record = YAHOO.widget.DataTable._cloneObject(data);
                record.row = i;
                myArray.push(record);
            }
            this.myDataTable.addRows(myArray); 
        },this,true);
        
        // Delete one row from the top
        var btnDeleteRow = new YAHOO.widget.Button("deleterow");
        btnDeleteRow.on("click", function() {
            if(this.myDataTable.getRecordSet().getLength() > 0) {
                this.myDataTable.deleteRow(0);
            }
        },this,true);
        
        // Delete 20 row from the top
        var btnDeleteRows = new YAHOO.widget.Button("deleterows");
        btnDeleteRows.on("click", function() {
            var length = this.myDataTable.getRecordSet().getLength();
            if(length > 0) {
                var count = (length > 19) ? 20 : length;
                this.myDataTable.deleteRows(0,count);
            }
        },this,true);
    };
});
</textarea>
