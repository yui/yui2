<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">{"ResultSet":{
    "totalResultsAvailable":665,
    "totalResultsReturned":10,
    "firstResultPosition":1,
    "ResultSetMapUrl":"http:\/\/local.yahoo.com\/mapview?stx=pizza&csz=Sunnyvale%2C+CA+94089&city=Sunnyvale&state=CA&radius=15&ed=9brhZa131DwigChqKlCo22kM1H_9WgoouCr87Ao-",
    "Result":[{
        "Title":"Pizza Depot",
        "Address":"919 E Duane Ave",
        "City":"Sunnyvale",
        "State":"CA",
        "Phone":"(408) 245-7760",
        "Latitude":"37.388537",
        "Longitude":"-122.003972",
        "Rating":{
            "AverageRating":"3.5",
            "TotalRatings":"5",
            "TotalReviews":"5",
            "LastReviewDate":"1161495667"},
        "Distance":"0.93",
        "Url":"http:\/\/local.yahoo.com\/details?id=21332021&stx=pizza&csz=Sunnyvale+CA&ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--",
        "ClickUrl":"http:\/\/local.yahoo.com\/details?id=21332021&stx=pizza&csz=Sunnyvale+CA&ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--",
        "MapUrl":"http:\/\/maps.yahoo.com\/maps_result?name=Pizza+Depot&desc=4082457760&csz=Sunnyvale+CA&qty=9&cs=9&ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--&gid1=21332021",
        "BusinessUrl":"http:\/\/pizza-depot.com\/",
        "BusinessClickUrl":"http:\/\/pizza-depot.com\/"},

        ...
    ]}
}
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
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
/* This hides the autocomplete drop downs */
#dt_ac_container, #dt_ac_zip_container {
    display: none;
}

</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="autocomplete">
    <label for="dt_input">Search Term: </label><input id="dt_input" type="text" value="pizza">
    <div id="dt_ac_container"></div>
</div>
<div id="autocomplete_zip">
    <label for="dt_input_zip">Zip Code: </label><input id="dt_input_zip" type="text" value="94089">
    <div id="dt_ac_zip_container"></div>
</div>
<div id="json"></div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
