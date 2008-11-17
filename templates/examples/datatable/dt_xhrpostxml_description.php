<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;?xml version="1.0"?&gt;
&lt;ResultSet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:yahoo:lcl" xsi:schemaLocation="urn:yahoo:lcl http://api.local.yahoo.com/LocalSearchService/V2/LocalSearchResponse.xsd" totalResultsAvailable="501" totalResultsReturned="10" firstResultPosition="1"&gt;
&lt;ResultSetMapUrl&gt;http://maps.yahoo.com/broadband/?q1=Sunnyvale%2C+CA+94089&amp;tt=pizza&amp;tp=1&lt;/ResultSetMapUrl&gt;
    &lt;Result&gt;
        &lt;Title&gt;Giovannis Pizzeria&lt;/Title&gt;
        &lt;Address&gt;1127 N Lawrence Expy&lt;/Address&gt;
        &lt;City&gt;Sunnyvale&lt;/City&gt;
        &lt;State&gt;CA&lt;/State&gt;
        &lt;Phone&gt;(408) 734-4221&lt;/Phone&gt;
        &lt;Latitude&gt;37.396953&lt;/Latitude&gt;
        &lt;Longitude&gt;-121.995986&lt;/Longitude&gt;
        &lt;Rating&gt;
            &lt;AverageRating&gt;4&lt;/AverageRating&gt;
            &lt;TotalRatings&gt;51&lt;/TotalRatings&gt;
            &lt;TotalReviews&gt;33&lt;/TotalReviews&gt;
            &lt;LastReviewDate&gt;1191207644&lt;/LastReviewDate&gt;
        &lt;/Rating&gt;
        &lt;Distance&gt;0.62&lt;/Distance&gt;
        &lt;Url&gt;http://local.yahoo.com/details?id=21341983&amp;stx=pizza&amp;csz=Sunnyvale+CA&amp;ed=kYc.Ba160SxZddWADEWWMRsGo0KgZ6X22_QAgTZxq3OdfrVCfCdLU9mvvJeybt8XpDhMC58HjElJAiWi&lt;/Url&gt;
        &lt;ClickUrl&gt;http://local.yahoo.com/details?id=21341983&amp;stx=pizza&amp;csz=Sunnyvale+CA&amp;ed=kYc.Ba160SxZddWADEWWMRsGo0KgZ6X22_QAgTZxq3OdfrVCfCdLU9mvvJeybt8XpDhMC58HjElJAiWi&lt;/ClickUrl&gt;
        &lt;MapUrl&gt;http://maps.yahoo.com/maps_result?name=Giovannis+Pizzeria&amp;desc=4087344221&amp;csz=Sunnyvale+CA&amp;qty=9&amp;cs=9&amp;ed=kYc.Ba160SxZddWADEWWMRsGo0KgZ6X22_QAgTZxq3OdfrVCfCdLU9mvvJeybt8XpDhMC58HjElJAiWi&amp;gid1=21341983&lt;/MapUrl&gt;
        &lt;BusinessUrl&gt;&lt;/BusinessUrl&gt;
        &lt;BusinessClickUrl&gt;&lt;/BusinessClickUrl&gt;
    &lt;/Result&gt;
    ...
&lt;/ResultSet&gt;
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="xml"&gt;&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.XHR_XML = new function() {
        this.formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("ClickUrl") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            {key:"Title", label:"Name", sortable:true, formatter:this.formatUrl},
            {key:"Phone"},
            {key:"City"},
            {key:"AverageRating", label:"Rating",formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
        ];

        this.myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/ylocal_proxy.php?");
        this.myDataSource.connMethodPost = true;
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
        this.myDataSource.responseSchema = {
            resultNode: "Result",
            fields: ["Title","Phone","City",{key:"AverageRating",parser:"number"},"ClickUrl"]
        };

        this.myDataTable = new YAHOO.widget.DataTable("xml", myColumnDefs,
                this.myDataSource, {initialRequest:"query=pizza&zip=94089&results=10"});
    };
});
</textarea>
