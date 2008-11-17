<style type="text/css">
    #autocomplete, #autocomplete_zip {
        height: 25px;
    }
    #dt_input, #dt_input_zip {
        position: static;
        width: 300px;
    }
    #dt_input_zip {
        width: 60px;
    }
    #dt_ac_container, #dt_ac_zip_container {
        display: none;
    }
</style>

<div id="autocomplete">
    <label for="dt_input">Search Term: </label><input id="dt_input" type="text" value="pizza">
    <div id="dt_ac_container"></div>
</div>
<div id="autocomplete_zip">
    <label for="dt_input_zip">Zip Code: </label><input id="dt_input_zip" type="text" value="94089">
    <div id="dt_ac_zip_container"></div>
</div>

<div id="json"></div>


<script type="text/javascript">
(function() {
    var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    queryString = '&results=20&output=json',
    zip = null,
    myDataSource = null,
    myDataTable = null;

    var getZip = function(query) {
        query = parseInt(query, 10);
        if (!YAHOO.lang.isNumber(query)) {
            query = zip;
            Dom.get('dt_input_zip').value = zip;
            YAHOO.log('Invalid zip code, must be a number', 'warn', 'example');
        }
        myDataSource.sendRequest('datatable=yes&zip=' + query + '&query=' + Dom.get('dt_input').value + queryString,
            myDataTable.onDataReturnInitializeTable, myDataTable);        
    };
    var getTerms = function(query) {
        myDataSource.sendRequest('datatable=yes&query=' + query + '&zip=' + Dom.get('dt_input_zip').value + queryString,
        myDataTable.onDataReturnInitializeTable, myDataTable);
    };

    Event.onDOMReady(function() {
        zip = Dom.get('dt_input_zip').value;
        
        var oACDS = new YAHOO.util.FunctionDataSource(getTerms);
        oACDS.queryMatchContains = true;
        var oAutoComp = new YAHOO.widget.AutoComplete("dt_input","dt_ac_container", oACDS);
        

        var oACDSZip = new YAHOO.util.FunctionDataSource(getZip);
        oACDSZip.queryMatchContains = true;
        var oAutoCompZip = new YAHOO.widget.AutoComplete("dt_input_zip","dt_ac_zip_container", oACDSZip);
        //Don't query until we have 5 numbers for the zip code
        oAutoCompZip.minQueryLength = 5;

        var formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("ClickUrl") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            { key:"Title",
                label:"Name",
                sortable:true,
                formatter: formatUrl
            },
            { key:"Phone" },
            { key:"City" },
            { key:"Rating.AverageRating",
                label:"Rating",
                formatter:YAHOO.widget.DataTable.formatNumber, 
                sortable:true
            }
        ];

        myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.connXhrMode = "queueRequests";
        myDataSource.responseSchema = {
            resultsList: "ResultSet.Result",
            fields: [
                "Title",
                "Phone",
                "City",
                {
                    key: "Rating.AverageRating",
                    parser:"number"
                },
                "ClickUrl"
            ]
        };

        myDataTable = new YAHOO.widget.DataTable("json", myColumnDefs,
            myDataSource, {initialRequest: 'datatable=yes&query=' + Dom.get('dt_input').value + '&zip=' + Dom.get('dt_input_zip').value + queryString });

    });
})();
</script>
