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
    width:20em; /* set width here or else widget will expand to fit its container */
    padding-bottom:20em; /* allow enough real estate for the container */
}
.yui-skin-sam .yui-ac-content { /* set scrolling */
    max-height:18em;overflow:auto;overflow-x:hidden; /* set scrolling */
    _height:18em; /* ie6 */
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
</textarea>
