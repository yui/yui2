<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    addresses: [
        {name:"John A. Smith", address:"1236 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan B. Jones", address:"3271 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob C. Uncle", address:"9996 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"},
        {name:"John D. Smith", address:"1623 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan E. Jones", address:"3217 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob F. Uncle", address:"9899 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"},
        {name:"John G. Smith", address:"1723 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan H. Jones", address:"3241 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob I. Uncle", address:"9909 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"},
        {name:"John J. Smith", address:"1623 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan K. Jones", address:"3721 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob L. Uncle", address:"9989 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"},
        {name:"John M. Smith", address:"1293 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan N. Jones", address:"3621 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob O. Uncle", address:"9959 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"},
        {name:"John P. Smith", address:"6123 Some Street", city:"San Francisco", state:"CA", amount:5, active:"yes", colors:["red"], last_login:"4/19/2007"},
        {name:"Joan Q. Jones", address:"3281 Another Ave", city:"New York", state:"NY", amount:3, active:"no", colors:["red","blue"], last_login:"2/15/2006"},
        {name:"Bob R. Uncle", address:"9989 Random Road", city:"Los Angeles", state:"CA", amount:0, active:"maybe", colors:["green"], last_login:"1/23/2004"}
    ]
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
/* custom styles for this example */
.yui-skin-sam .yui-dt-col-address pre { font-family:arial;font-size:100%; } /* Use PRE in first col to preserve linebreaks*/
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="cellediting"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.InlineCellEditing = function() {
        // Custom formatter for "address" column to preserve line breaks
        var formatAddress = function(elCell, oRecord, oColumn, oData) {
            elCell.innerHTML = "<pre class=\"address\">" + oData + "</pre>";
        };

        var myColumnDefs = [
            {key:"uneditable"},
            {key:"address", formatter:formatAddress, editor: new YAHOO.widget.TextareaCellEditor()},
            {key:"city", editor: new YAHOO.widget.TextboxCellEditor({disableBtns:true})},
            {key:"state", editor: new YAHOO.widget.DropdownCellEditor({dropdownOptions:YAHOO.example.Data.stateAbbrs,disableBtns:true})},
            {key:"amount", editor: new YAHOO.widget.TextboxCellEditor({validator:YAHOO.widget.DataTable.validateNumber})},
            {key:"active", editor: new YAHOO.widget.RadioCellEditor({radioOptions:["yes","no","maybe"],disableBtns:true})},
            {key:"colors", editor: new YAHOO.widget.CheckboxCellEditor({checkboxOptions:["red","yellow","blue"]})},
            {key:"last_login", formatter:YAHOO.widget.DataTable.formatDate, editor: new YAHOO.widget.DateCellEditor()}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.addresses);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["address","city","state","amount","active","colors",{key:"last_login",parser:"date"}]
        };

        var myDataTable = new YAHOO.widget.DataTable("cellediting", myColumnDefs, myDataSource, {});

        // Set up editing flow
        var highlightEditableCell = function(oArgs) {
            var elCell = oArgs.target;
            if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
                this.highlightCell(elCell);
            }
        };
        myDataTable.subscribe("cellMouseoverEvent", highlightEditableCell);
        myDataTable.subscribe("cellMouseoutEvent", myDataTable.onEventUnhighlightCell);
        myDataTable.subscribe("cellClickEvent", myDataTable.onEventShowCellEditor);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</textarea>
