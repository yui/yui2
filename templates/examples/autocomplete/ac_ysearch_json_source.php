<form action="http://search.yahoo.com/search">
    <div id="ysearch">
		<label>Yahoo! Search: </label>
		<input id="ysearchinput" type="text" name="p">
		<input id="ysearchsubmit" type="submit" value="Submit Query">
		<div id="ysearchcontainer"></div>
    </div>
</form>
	
<script type="text/javascript">
YAHOO.example.Centered = function() {
    var myDataSource = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_proxy.php?output=json&");
    myDataSource.responseSchema = {
        resultsList: "ResultSet.Result",
        fields: ["Title"]
    };

    // Instantiate AutoComplete
    var myAutoComp = new YAHOO.widget.AutoComplete("ysearchinput","ysearchcontainer", myDataSource);
    myAutoComp.queryMatchContains = true;
    myAutoComp.queryQuestionMark = false;
    myAutoComp.useShadow = true;
    
    // Keeps container centered
    myAutoComp.doBeforeExpandContainer = function(oTextbox, oContainer, sQuery, aResults) {
        var pos = YAHOO.util.Dom.getXY(oTextbox);
        pos[1] += YAHOO.util.Dom.get(oTextbox).offsetHeight + 2;
        YAHOO.util.Dom.setXY(oContainer,pos);
        return true;
    };
    
    return {
        oDS: myDataSource,
        oAC: myAutoComp
    };
}();
</script>
