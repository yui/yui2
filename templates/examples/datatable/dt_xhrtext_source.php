<div id="text"></div>
<div id="textWithHeaderData"></div>

<script type="text/javascript">
YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.XHR_Text = function() {
        var formatUrl = function(elCell, oRecord, oColumn, sData) {
            elCell.innerHTML = "<a href='" + oRecord.getData("Url") + "' target='_blank'>" + sData + "</a>";
        };

        var myColumnDefs = [
            {key:"Name", sortable:true, formatter:formatUrl},
            {key:"Phone"},
            {key:"City"},
            {key:"Rating", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}

        ];

        var myDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/text_proxy.txt");
        //myDataSource.responseType = YAHOO.util.DataSource.TYPE_TEXT;
        myDataSource.responseSchema = {
            recordDelim: "\n",
            fieldDelim: "|",
            fields: ["Name","Address","City","Phone",{key:"Rating",parser:"number"},"Url"]
        };

        var myDataTable = new YAHOO.widget.DataTable("text", myColumnDefs,
                myDataSource, {caption:"Example: Textual Data Over XHR"});



        var moreColumnDefs = [
            {key:"Restaurant", sortable:true, formatter:formatUrl},
            {key:"Location"},
            {key:"Town"},
            {key:"Stars", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true}
        ];

        var anotherDataSource = new YAHOO.util.DataSource("<?php echo $assetsDirectory; ?>php/text_with_headers_proxy.txt");
        anotherDataSource.responseType = YAHOO.util.DataSource.TYPE_TEXT;
        anotherDataSource.responseSchema = {
            recordDelim: "\n",
            fieldDelim: "|",
            fields: ["Restaurant","Location","Town","Telephone",{key:"Stars",parser:"number"},"Url"]
        };
        // Upgrade note: As of 2.5.0, the second argument is the full type-converted
        // response from the live data, and not the unconverted raw response
        anotherDataSource.doBeforeCallback = function(oRequest, oFullResponse, oParsedResponse) {
            // Remove the first result (i.e., the headers);
            oParsedResponse.results.shift();
            return oParsedResponse;
        };

        anotherDataTable = new YAHOO.widget.DataTable("textWithHeaderData", moreColumnDefs,
                anotherDataSource, {caption:"Example: First Record Holds Header Data"});
                
        return {
            oDS: myDataSource,
            oDT: myDataTable,
            oDS2: anotherDataSource,
            oDT2: anotherDataTable
        };
    }();
});
</script>
