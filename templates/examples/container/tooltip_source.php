<style>
	#ctx { background:orange;width:200px;height:200px; }
</style>

<p id="ctx">Hover over me to see a Tooltip!</p>

<p><a id="link" href="http://www.yahoo.com/" title="Do You Yahoo?">Hover over me to see a Tooltip!</a></p>

<script type="text/javascript">
	YAHOO.namespace("example.container");
	YAHOO.example.container.tt1 = new YAHOO.widget.Tooltip("tt1", { context:"ctx", text:"My text was set using the 'text' configuration property" });
	YAHOO.example.container.tt1.beforeShowEvent.subscribe(function(){YAHOO.log("Tooltip one is appearing.","info","example");});
	YAHOO.example.container.tt2 = new YAHOO.widget.Tooltip("tt2", { context:"link" });
</script>
