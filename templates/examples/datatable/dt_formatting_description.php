<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    formatting: {
        items: [
            {field1: "bananas", field2:new Date(2007, 1, 1), field3:111, field4:"23.4", field5:"bob", field6:"http://www.yahoo.com"},
            {field1: undefined, field2:new Date(2006, 1, 1), field3:12.3, field4:"35.12", field5:"ann", field6:"http://www.yahoo.com"},
            {field1: "apples", field2:new Date(2007, 11, 1), field3:1, field4:34.12, field5:"charlie", field6:"http://www.yahoo.com"},
            {field1: "bananas", field2:new Date(2007, 1, 11), field3:1112, field4:"03", field5:"diane", field6:"http://www.yahoo.com"},
            {field1: "cherries", field2:new Date(1999, 1, 11), field3:124, field4:03, field5:"edgar", field6:"http://www.yahoo.com"},
            {field1: "", field2:"January 10, 2005", field3:"12", field4:"34", field5:"francine", field6:"http://www.yahoo.com"},
            {field1: "unknown", field2:"January 1, 2005", field3:"19.1", field4:"234.5", field5:"george", field6:"http://www.yahoo.com"},
            {field1: null, field2:"1/11/05", field3:"10.02", field4:"345.654", field5:"hannah", field6:"http://www.yahoo.com"},
            {field1: "cherries", field2:"1/11/2005", field3:"109", field4:23.456, field5:"igor", field6:"http://www.yahoo.com"},
            {field1: "bananas", field2:"November 1, 2005", field3:"11111", field4:23.0123, field5:"julie", field6:"http://www.yahoo.com"}
        ]
    }
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
.yui-skin-sam .yui-dt td.up {
    background-color: #efe;
}
.yui-skin-sam .yui-dt td.down {
    background-color: #fee;
}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="formatting"></div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.CustomFormatting = new function() {
        // Define a custom formatter for the Column labeled "flag"
        // draws an up icon and adds class "up" to the cell to affect
        // a green background color if value of field3 is greater than 100.
        // Otherwise renders a down icon and assigns class "down", setting
        // the background color to red.
        this.myCustomFormatter = function(elLiner, oRecord, oColumn, oData) {
            if(oRecord.getData("field3") > 100) {
                YAHOO.util.Dom.replaceClass(elLiner.parentNode, "down", "up");
                elCell.innerHTML = '&nbsp;<img src="../../build/datatable/assets/skins/sam/dt-arrow-up.png">';
            }
            else {
                YAHOO.util.Dom.replaceClass(elLiner.parentNode, "up","down");
                elCell.innerHTML = '&nbsp;<img src="../../build/datatable/assets/skins/sam/dt-arrow-dn.png">';
            }
        };
        
        // Add the custom formatter to the shortcuts
        YAHOO.widget.DataTable.Formatter.myCustom = this.myCustomFormatter;

        // Override the built-in formatter
        YAHOO.widget.DataTable.formatEmail = function(elCell, oRecord, oColumn, oData) {
            var user = oData;
            elCell.innerHTML = "<a href=\"mailto:" + user + "@mycompany.com\">" + user + "</a>";
        };
        

        var myColumnDefs = [
            {key:"flag", formatter:"myCustom"}, // use custom shortcut
            {key:"radio", formatter:"radio"}, // use the built-in radio formatter
            {key:"check", formatter:"checkbox"}, // use the built-in checkbox formatter (shortcut)
            {key:"button", label:"Show record data", formatter:YAHOO.widget.DataTable.formatButton}, // use the built-in button formatter
            {key:"field1", formatter:"dropdown", dropdownOptions:["apples","bananas","cherries"],sortable:true},
            {key:"field2", sortable:true, formatter:"date"}, // use the built-in date formatter
            {key:"field3", sortable:true},
            {key:"field4", sortable:true, formatter:"currency"}, // use the built-in currency formatter
            {key:"field5", sortable:true, formatter:YAHOO.widget.DataTable.formatEmail}, // use the overridden email formatter
            {key:"field6", sortable:true, formatter:YAHOO.widget.DataTable.formatLink} // use the built-in link formatter
        ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.multitypes);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        this.myDataSource.responseSchema = {
            resultsList: "items",
            // Use the parse methods to populate the RecordSet with the right data types
            fields: [
                {key:"field1", parser:YAHOO.util.DataSource.parseString}, // point to the string parser
                {key:"field2", parser:"date"}, // point to the date parser
                {key:"field3", parser:"number"}, // point to the number parser
                {key:"field4", parser:"number"}, // point to the number parser
                {key:"field5"}, // this is already string data so no parser needed
                {key:"field6"} // this is already string data so no parser needed
            ]
        };

        this.myDataTable = new YAHOO.widget.DataTable("formatting", myColumnDefs, this.myDataSource);

        var lastSelectedRadioRecord = null;
        this.myDataTable.subscribe("radioClickEvent", function(oArgs){
            if(lastSelectedRadioRecord) {
                lastSelectedRadioRecord.setData("radio",false);
            }
            var elRadio = oArgs.target;
            var oRecord = this.getRecord(elRadio);
            oRecord.setData("radio",true);
            lastSelectedRadioRecord = oRecord;
            var name = oRecord.getData("field5");
        });

        this.myDataTable.subscribe("checkboxClickEvent", function(oArgs){
            var elCheckbox = oArgs.target;
            var oRecord = this.getRecord(elCheckbox);
            oRecord.setData("check",elCheckbox.checked);
        });

        this.myDataTable.subscribe("buttonClickEvent", function(oArgs){
            var oRecord = this.getRecord(oArgs.target);
            alert(YAHOO.lang.dump(oRecord.getData()));
        });

        this.myDataTable.subscribe("dropdownChangeEvent", function(oArgs){
            var elDropdown = oArgs.target;
            var oRecord = this.getRecord(elDropdown);
            oRecord.setData("field1",elDropdown.options[elDropdown.selectedIndex].value);
        });
    };
});
</textarea>
