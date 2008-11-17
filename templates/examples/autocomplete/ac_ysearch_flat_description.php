<h2 class="first">Sample Code</h2>

<p>Data:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
...
food and drink   1924
food basic   1075
food carts   1042
...
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
/* custom styles for multiple stacked instances  */
#example1 { z-index:9001; } /* z-index needed on top instances for ie & sf absolute inside relative issue */
#example2 { z-index:9000; } /* z-index needed on top instances for ie & sf absolute inside relative issue */
.autocomplete { padding-bottom:2em;width:40%; }/* set width of widget here*/
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
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
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.QueryMatchSubset = function(){        
    var myDataSource = new YAHOO.util.XHRDataSource("<?php echo $assetsDirectory; ?>php/ysearch_flat.php");
    myDataSource.responseSchema = {
         recordDelim: "\n",
         fieldDelim: "\t"
    };
    myDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_TEXT;
    myDataSource.maxCacheEntries = 60;

    // First AutoComplete
    var myAutoComp1 = new YAHOO.widget.AutoComplete("ysearchinput1","ysearchcontainer1", myDataSource);
    myAutoComp1.queryMatchSubset = true;

    // Second AutoComplete
    var myAutoComp2 = new YAHOO.widget.AutoComplete("ysearchinput2","ysearchcontainer2", myDataSource);
    
    return {
        oDS: myDataSource,
        oAC1: myAutoComp1,
        oAC2: myAutoComp2
    }
}();
</textarea>
