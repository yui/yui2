<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.Data.arrayAreaCodesStates = [
    ["201", "New Jersey"],
    ["202", "Washington, DC"],
    ["203", "Connecticut"],
    ["204", "Manitoba, Canada"],
    ["205", "Alabama"],
    ["206", "Washington"],
    ["207", "Maine"],
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
YAHOO.example.FnMultipleFields = function(){
    var allData = YAHOO.example.Data.arrayAreaCodesStates;
    
    // Track each interaction if it is against a state or an area code
    var nSearchField;
    
    // Define a custom search function
    var searchAreaCodesAndStates = function(sQuery) {
        var allMatches = [],
            item, i, l;
            
        // 0 for area code, 1 for state
        nSearchField = (YAHOO.lang.isNumber(sQuery*1)) ? 0 : 1;

        for(i=0, l=allData.length; i<l; i++) {
            item = allData[i];
            
            // State must be made case-insensitve and make the state return as index 0
            if(nSearchField) {
                if(item[nSearchField].toLowerCase().indexOf(sQuery.toLowerCase()) === 0) {
                    allMatches[allMatches.length] = [item[1], item[0]];
                }
            }
            // Area codes are simpler
            else {
                if(item[nSearchField].indexOf(sQuery) === 0) {
                    allMatches[allMatches.length] = item;
                }
            }
        }
        
        // States should be sorted alphabetically
        // Define schema on the fly (since the return order changes)
        if(nSearchField) {
            allMatches.sort();
            this.responseSchema = {fields: ["state", "areacode"]};
        }
        else {
            this.responseSchema = {fields: ["areacode", "state"]};
        }
        return allMatches;
    };

    // Use a FunctionDataSource
    var oDS = new YAHOO.util.FunctionDataSource(searchAreaCodesAndStates);

    // Instantiate AutoComplete
    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    oAC.useShadow = true;
    oAC.resultTypeList = false;
    oAC.formatResult = function(oResultData, sQuery, sResultMatch) {
        return (sResultMatch + " (" + ((nSearchField) ? oResultData.areacode : oResultData.state) + ")");
    };
    
    return {
        fnSearch: searchAreaCodesAndStates,
        oDS: oDS,
        oAC: oAC 
    };
}();
</textarea>
