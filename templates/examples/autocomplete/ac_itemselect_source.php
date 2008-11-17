<h3>Find a company in the accounts database:</h3>
<form id="myForm" action="#">
    <div id="myAutoComplete">
    	<input id="myInput" type="text"><input id="mySubmit" type="submit" value="Submit"> 
    	<div id="myContainer"></div>
    </div>
    <input id="myHidden" type="hidden">
</form>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
YAHOO.example.ItemSelectHandler = function() {
    // Use a LocalDataSource
    var oDS = new YAHOO.util.LocalDataSource(YAHOO.example.Data.accounts);
    oDS.responseSchema = {fields : ["name", "id"]};

    // Instantiate the AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    oAC.resultTypeList = false;
    
    // Define an event handler to populate a hidden form field
    // when an item gets selected
    var myHiddenField = YAHOO.util.Dom.get("myHidden");
    var myHandler = function(sType, aArgs) {
        var myAC = aArgs[0]; // reference back to the AC instance
        var elLI = aArgs[1]; // reference to the selected LI element
        var oData = aArgs[2]; // object literal of selected item's result data
        
        // update hidden form field with the selected item's ID
        myHiddenField.value = oData.id;
    };
    oAC.itemSelectEvent.subscribe(myHandler);
    
    // Rather than submit the form,
    // alert the stored ID instead
    var onFormSubmit = function(e, myForm) {
        YAHOO.util.Event.preventDefault(e);
        alert("Company ID: " + myHiddenField.value);
    };
    YAHOO.util.Event.addListener(YAHOO.util.Dom.get("myForm"), "submit", onFormSubmit);

    return {
        oDS: oDS,
        oAC: oAC
    };
}();
</script>
