<h2 class="first">Sample Code</h2>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* custom styles for this example */
#statesautocomplete {width:20em;}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="statesautocomplete"&gt;
    &lt;input id="statesinput"&gt;
    &lt;div id="statescontainer"&gt;&lt;/div&gt;
&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
&lt;script type="text/javascript" src="./logger.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="./autocomplete-debug.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript"
YAHOO.example.LogAutoComplete = new function() {
    // Instantiate LogReader
    this.oLogReader = new YAHOO.widget.LogReader();

    // Instantiate DataSource
    this.oACDS = new YAHOO.util.FunctionDataSource(getStates);

    // Instantiate AutoComplete
    this.oAutoComp = new YAHOO.widget.AutoComplete('statesinput','statescontainer', this.oACDS);
};
&lt;/script&gt;
</textarea>
