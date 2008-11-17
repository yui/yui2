<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data.multitypes = {
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
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="xyscrolling"&gt;&lt;/div&gt;

&lt;div id="yscrolling"&gt;&lt;/div&gt;

&lt;div id="xscrolling"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Scrolling = new function() {
        var myColumnDefs = [
                {key:"field1"},
                {key:"field2", formatter:"date"},
                {key:"field3"},
                {key:"field4"},
                {key:"field5"},
                {key:"field6", width:150}
            ];
            
        var myColumnDefsY = [
                {key:"field1"},
                {key:"field2", formatter:"date"},
                {key:"field3"},
                {key:"field4"},
                {key:"field5"},
                {key:"field6"}
            ];

        var myColumnDefsX = [
                {key:"field1", width:300},
                {key:"field2", formatter:"date", width:300},
                {key:"field3", width:300},
                {key:"field4", width:300},
                {key:"field5", width:300},
                {key:"field6", width:300}
            ];

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.multitypes);
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        this.myDataSource.responseSchema = {
            resultsList: "items",
            fields: [
                {key:"field1"},
                {key:"field2", formatter:"date"},
                {key:"field3"},
                {key:"field4"},
                {key:"field5"},
                {key:"field6"}
            ]
        };

        // Set "scrollable:true" and set width and height string values
        this.myDataTableXY = new YAHOO.widget.DataTable("xyscrolling", myColumnDefs,
                this.myDataSource, {scrollable:true, width:"30em", height:"10em"});

        // Set "scrollable:true" and set only height string value
        this.myDataTableY = new YAHOO.widget.DataTable("yscrolling", myColumnDefsY,
                this.myDataSource, {scrollable:true, height:"10em"});

        // Set "scrollable:true" and set only width string value
        this.myDataTableX = new YAHOO.widget.DataTable("xscrolling", myColumnDefsX,
                this.myDataSource, {scrollable:true, width:"30em"});
    };
});
</textarea>
