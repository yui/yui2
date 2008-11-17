<div id="autocomplete_examples">
    <p><strong>Note:</strong> The flat-file database accessed here has a limited number of terms; for best results, type one-letter at at time and let the AutoComplete instance return &mdash; if you type a full, highly-specifc phrase (such as your name) you'll probably get no results from the small dataset.</p>
	<h2>First AutoComplete instance enables queryMatchSubset:</h2>
	<div id="example1" class="autocomplete">
		<input id="ysearchinput1" type="text">
		<div id="ysearchcontainer1"></div>
	</div>
	<h2>Second AutoComplete instance does not enable queryMatchSubset:</h2>
	<div id="example2" class="autocomplete">
		<input id="ysearchinput2" type="text">
		<div id="ysearchcontainer2"></div>
	</div>
</div>
	
<script type="text/javascript">
YAHOO.example.QueryMatchSubset = function(){        
    var myDataSource = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_flat.php");
    myDataSource.responseSchema = {
         recordDelim: "\n",
         fieldDelim: "\t"
    };
    myDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_TEXT;
    myDataSource.maxCacheEntries = 60;

    // First AutoComplete
    var myAutoComp1 = new YAHOO.widget.AutoComplete("ysearchinput1","ysearchcontainer1",myDataSource);
    myAutoComp1.queryMatchSubset = true;

    // Second AutoComplete
    var myAutoComp2 = new YAHOO.widget.AutoComplete('ysearchinput2','ysearchcontainer2', myDataSource);
    
    return {
        oDS: myDataSource,
        oAC1: myAutoComp1,
        oAC2: myAutoComp2
    }
}();
</script>
