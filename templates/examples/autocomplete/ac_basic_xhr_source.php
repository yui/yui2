<h3>Search our database:</h3>
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>

<script type="text/javascript">
YAHOO.example.BasicRemote = function() {
    // Use an XHRDataSource
    var oDS = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_flat.php");
    // Set the responseType
    oDS.responseType = YAHOO.util.XHRDataSource.TYPE_TEXT;
    // Define the schema of the delimited results
    oDS.responseSchema = {
        recordDelim: "\n",
        fieldDelim: "\t"
    };
    // Enable caching
    oDS.maxCacheEntries = 5;

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</script>
