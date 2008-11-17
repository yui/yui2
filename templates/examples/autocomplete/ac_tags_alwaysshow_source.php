<h3>Assign tags:</h3>
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.example.TagsAlwaysShow = function() {
    // Use a LocalDataSource
    var oDS = new YAHOO.util.LocalDataSource(YAHOO.example.Data.tags);
    // Optional to define fields for single-dimensional array
    oDS.responseSchema = {fields : ["tag"]};

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    oAC.alwaysShowContainer = true;
    oAC.minQueryLength = 0; // Can be 0, which will return all results
    oAC.maxResultsDisplayed = 100; // Show more results, scrolling is enabled via CSS
    oAC.delimChar = [",",";"]; // Enable comma and semi-colon delimiters
    oAC.autoHighlight = false; // Auto-highlighting interferes with adding new tags
    oAC.sendQuery("");
    
    // Populate list to start a new interaction
    oAC.itemSelectEvent.subscribe(function(sType, aArgs) {
        oAC.sendQuery("");
    });
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</script>
