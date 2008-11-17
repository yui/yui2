<h3>Enter a state:</h3>
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.example.BasicLocal = function() {
    // Use a LocalDataSource
    var oDS = new YAHOO.util.LocalDataSource(YAHOO.example.Data.arrayStates);
    // Optional to define fields for single-dimensional array
    oDS.responseSchema = {fields : ["state"]};

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    oAC.prehighlightClassName = "yui-ac-prehighlight";
    oAC.useShadow = true;
    
    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</script>
