<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.Data.arrayStates = [
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	"Florida",
    ...
];
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#myAutoComplete {
    width:15em; /* set width here or else widget will expand to fit its container */
    padding-bottom:2em;
}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
