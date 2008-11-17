<h3>Yahoo! Search:</h3>
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>

<script type="text/javascript">
YAHOO.example.RemoteCustomRequest = function() {
    // Use an XHRDataSource
    var oDS = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_proxy.php");
    // Set the responseType
    oDS.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
    // Define the schema of the JSON results
    oDS.responseSchema = {
        resultsList : "ResultSet.Result",
        fields : ["Title"]
    };

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    // Throttle requests sent
    oAC.queryDelay = .5;
    // The webservice needs additional parameters
    oAC.generateRequest = function(sQuery) {
        return "?output=json&results=100&query=" + sQuery ;
    };
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</script>
