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

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="json"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.XHR_JSON = new function() {
        this.formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("ClickUrl") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            {key:"Title", label:"Name", sortable:true, formatter:this.formatUrl},
            {key:"Phone"},
            {key:"City"},
            {key:"Rating.AverageRating", label:"Rating", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
        ];

        this.myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?");
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        this.myDataSource.connXhrMode = "queueRequests";
        this.myDataSource.responseSchema = {
            resultsList: "ResultSet.Result",
            fields: ["Title","Phone","City",{key:"Rating.AverageRating",parser:"number"},"ClickUrl"]
        };

        this.myDataTable = new YAHOO.widget.DataTable("json", myColumnDefs,
                this.myDataSource, {initialRequest:"query=pizza&zip=94089&results=10&output=json"});

        var myCallback = function() {
            this.set("sortedBy", null);
            this.onDataReturnAppendRows.apply(this,arguments);
        };
        var callback1 = {
            success : myCallback,
            failure : myCallback,
            scope : this.myDataTable
        };
        this.myDataSource.sendRequest("query=mexican&zip=94089&results=10&output=json",
                callback1);

        var callback2 = {
            success : myCallback,
            failure : myCallback,
            scope : this.myDataTable
        };
        this.myDataSource.sendRequest("query=chinese&zip=94089&results=10&output=json",
                callback2);
    };
});
</textarea>
