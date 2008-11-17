<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.Data.accounts: [
    {name: "ABC Company", id: 57367 },
    {name: "Acme Supply Company", id: 84377},
    {name: "Avery Widgets", id: 73678},
    {name: "AAA International", id: 73675},
    {name: "Atlantic Brothers, Inc", id: 83757},
    {name: "Ace Products", id: 48588},
    {name: "Above Average, Ltd", id: 75968}
];
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myAutoComplete {
    width:15em; /* set width here or else widget will expand to fit its container */
    padding-bottom:2em;
}
#mySubmit {
    position:absolute; left:15em; margin-left:1em; /* place the button next to the input */
}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<form id="myForm" action="#">
    <div id="myAutoComplete">
    	<input id="myInput" type="text"><input id="mySubmit" type="submit" value="Submit"> 
    	<div id="myContainer"></div>
    </div>
    <input id="myHidden" type="hidden">
</form>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
