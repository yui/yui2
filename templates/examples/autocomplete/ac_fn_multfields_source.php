<h3>Enter a state or an area code:</h3>
<div id="myAutoComplete">
	<input id="myInput" type="text">
	<div id="myContainer"></div>
</div>

<script type="text/javascript" src="<?php echo $assetsDirectory; ?>js/data.js"></script>
<script type="text/javascript">
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
</script>
