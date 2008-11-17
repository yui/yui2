<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">YAHOO.example.Data = {
    inventory: [
        {SKU:"23-23874", Quantity:43, Item:"Helmet", Description:"Red baseball helmet. Size: Large."},
        {SKU:"48-38835", Quantity:84, Item:"Football", Description:"Leather football."},
        {SKU:"84-84848", Quantity:31, Item:"Goggles", Description:"Light blue swim goggles"},
        {SKU:"84-84843", Quantity:56, Item:"Badminton Set", Description:"Set of 2 badminton rackets, net, and 3 birdies."},
        {SKU:"84-39321", Quantity:128, Item:"Tennis Balls", Description:"Canister of 3 tennis balls."},
        {SKU:"39-48949", Quantity:55, Item:"Snowboard", Description:""},
        {SKU:"99-28128", Quantity:77, Item:"Cleats", Description:"Soccer cleats. Size: 10."},
        {SKU:"83-48281", Quantity:65, Item:"Volleyball", Description:""},
        {SKU:"89-32811", Quantity:12, Item:"Sweatband", Description:"Blue sweatband. Size: Medium."},
        {SKU:"28-22847", Quantity:43, Item:"Golf Set", Description:"Set of 9 golf clubs and bag."},
        {SKU:"38-38281", Quantity:1, Item:"Basketball Shorts", Description:"Green basketball shorts. Size: Small."},
        {SKU:"82-38333", Quantity:288, Item:"Lip balm", Description:"Lip balm. Flavor: Cherry."},
        {SKU:"21-38485", Quantity:177, Item:"Ping Pong Ball", Description:""},
        {SKU:"83-38285", Quantity:87, Item:"Hockey Puck", Description:"Glow-in-the-dark hockey puck."}
    ]
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="myContainer"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.ContextMenu = function() {
        var myColumnDefs = [
            {key:"SKU", sortable:true},
            {key:"Quantity", sortable:true},
            {key:"Item", sortable:true},
            {key:"Description"}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.inventory);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["SKU","Quantity","Item","Description"]
        };

        var myDataTable = new YAHOO.widget.DataTable("myContainer", myColumnDefs, myDataSource);

        var onContextMenuClick = function(p_sType, p_aArgs, p_myDataTable) {
            var task = p_aArgs[1];
            if(task) {
                // Extract which TR element triggered the context menu
                var elRow = this.contextEventTarget;
                elRow = p_myDataTable.getTrEl(elRow);

                if(elRow) {
                    switch(task.index) {
                        case 0:     // Delete row upon confirmation
                            var oRecord = p_myDataTable.getRecord(elRow);
                            if(confirm("Are you sure you want to delete SKU " +
                                    oRecord.getData("SKU") + " (" +
                                    oRecord.getData("Description") + ")?")) {
                                p_myDataTable.deleteRow(elRow);
                            }
                    }
                }
            }
        };

        var myContextMenu = new YAHOO.widget.ContextMenu("mycontextmenu",
                {trigger:myDataTable.getTbodyEl()});
        myContextMenu.addItem("Delete Item");
        // Render the ContextMenu instance to the parent container of the DataTable
        myContextMenu.render("myContainer");
        myContextMenu.clickEvent.subscribe(onContextMenuClick, myDataTable);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</textarea>
