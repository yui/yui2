<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;?xml version="1.0"?&gt;
&lt;ResultSet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:yahoo:lcl" xsi:schemaLocation="urn:yahoo:lcl http://api.local.yahoo.com/LocalSearchService/V2/LocalSearchResponse.xsd" totalResultsAvailable="665" totalResultsReturned="10" firstResultPosition="1"&gt;
    &lt;ResultSetMapUrl&gt;http://local.yahoo.com/mapview?stx=pizza&amp;csz=Sunnyvale%2C+CA+94089&amp;city=Sunnyvale&amp;state=CA&amp;radius=15&amp;ed=9brhZa131DwigChqKlCo22kM1H_9WgoouCr87Ao-&lt;/ResultSetMapUrl&gt;
    &lt;Result&gt;
        &lt;Title&gt;Pizza Depot&lt;/Title&gt;
        &lt;Address&gt;919 E Duane Ave&lt;/Address&gt;
        &lt;City&gt;Sunnyvale&lt;/City&gt;
        &lt;State&gt;CA&lt;/State&gt;
        &lt;Phone&gt;(408) 245-7760&lt;/Phone&gt;
        &lt;Latitude&gt;37.388537&lt;/Latitude&gt;
        &lt;Longitude&gt;-122.003972&lt;/Longitude&gt;
        &lt;Rating&gt;
            &lt;AverageRating&gt;3.5&lt;/AverageRating&gt;
            &lt;TotalRatings&gt;5&lt;/TotalRatings&gt;
            &lt;TotalReviews&gt;5&lt;/TotalReviews&gt;
            &lt;LastReviewDate&gt;1161495667&lt;/LastReviewDate&gt;
        &lt;/Rating&gt;
        &lt;Distance&gt;0.93&lt;/Distance&gt;
        &lt;Url&gt;http://local.yahoo.com/details?id=21332021&amp;stx=pizza&amp;csz=Sunnyvale+CA&amp;ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--&lt;/Url&gt;
        &lt;ClickUrl&gt;http://local.yahoo.com/details?id=21332021&amp;stx=pizza&amp;csz=Sunnyvale+CA&amp;ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--&lt;/ClickUrl&gt;
        &lt;MapUrl&gt;http://maps.yahoo.com/maps_result?name=Pizza+Depot&amp;desc=4082457760&amp;csz=Sunnyvale+CA&amp;qty=9&amp;cs=9&amp;ed=6tiAL6160Sx1XVIEu1zIWPu6fD8rJDV4.offJLNUTb1Ri2Q.R5oLTYvDCz8YmzivI7Bz0gfrpw--&amp;gid1=21332021&lt;/MapUrl&gt;
        &lt;BusinessUrl&gt;http://pizza-depot.com/&lt;/BusinessUrl&gt;
        &lt;BusinessClickUrl&gt;http://pizza-depot.com/&lt;/BusinessClickUrl&gt;
    &lt;/Result&gt;
    ...
&lt;/ResultSet&gt;
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="localxml"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.Local_XML = function() {
        var myDataSource, myDataTable;
        
        var connectionCallback = {
            success: function(o) {
                var xmlDoc = o.responseXML;

                var myColumnDefs = [
                    {key:"Title", label:"Name", sortable:true, formatter:"link"},
                    {key:"Phone"},
                    {key:"City"},
                    {key:"AverageRating", label:"Rating",formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
                ];

                myDataSource = new YAHOO.util.DataSource(xmlDoc);
                myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
                myDataSource.responseSchema = {
                    resultNode: "Result",
                    fields: ["Title","Phone","City",{key:"AverageRating",parser:"number"},"ClickUrl"]
                };

                myDataTable = new YAHOO.widget.DataTable("localxml", myColumnDefs, myDataSource);

            },
            failure: function(o) {

            }
        };

        var getXML = YAHOO.util.Connect.asyncRequest("GET",
                "<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?query=pizza&zip=94089&results=10",
                connectionCallback);
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</textarea>
