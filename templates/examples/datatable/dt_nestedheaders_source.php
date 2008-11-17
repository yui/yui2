<div id="nested"></div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.NestedHeaders = function() {
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

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.webstats);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["page","visitsmonth","visitsytd","viewsmonth","viewsytd"]
        };

        var myDataTable = new YAHOO.widget.DataTable("nested", myColumnDefs, myDataSource);
        
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</script>
