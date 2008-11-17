<h2 class="first">XY Scrolling</h2>
<div id="xyscrolling"></div>

<h2>Y Scrolling</h2>
<div id="yscrolling"></div>

<h2>X Scrolling</h2>
<div id="xscrolling"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Scrolling = function() {
        var myColumnDefs = [
                {key:"field1", width:50},
                {key:"field2", width:100, formatter:"date"},
                {key:"field3", width:50},
                {key:"field4", width:50},
                {key:"field5", width:50},
                {key:"field6", width:150}
            ];
            
        var myColumnDefsY = [
                {key:"field1", width:50},
                {key:"field2", width:100, formatter:"date"},
                {key:"field3", width:50},
                {key:"field4", width:50},
                {key:"field5", width:50},
                {key:"field6", width:150}
            ];

        var myColumnDefsX = [
                {key:"field1", width:50},
                {key:"field2", width:100, formatter:"date"},
                {key:"field3", width:50},
                {key:"field4", width:50},
                {key:"field5", width:50},
                {key:"field6", width:150}
            ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.multitypes);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.responseSchema = {
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
        var myDataTableXY = new YAHOO.widget.DataTable("xyscrolling", myColumnDefs,
                myDataSource, {scrollable:true, width:"30em", height:"10em"});

        // Set "scrollable:true" and set only height string value
        var myDataTableY = new YAHOO.widget.DataTable("yscrolling", myColumnDefsY,
                myDataSource, {scrollable:true, height:"10em"});

        // Set "scrollable:true" and set only width string value
        var myDataTableX = new YAHOO.widget.DataTable("xscrolling", myColumnDefsX,
                myDataSource, {scrollable:true, width:"30em"});
                
        return {
            oDS: myDataSource,
            oDTXY: myDataTableXY,
            oDTY: myDataTableY,
            oDTX: myDataTableX
        };
    }();
});
</script>
