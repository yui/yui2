<div class="ttGroup" id="ttGroupA">
	<div class="grphd">Group A: Single Tooltip, text set using title</div>
	<div class="grpbd" id="containerA"></div>
</div>
<div class="ttGroup" id="ttGroupB">
	<div class="grphd">Group B: Single Tootip, text set using events</div>
	<div class="grpbd" id="containerB"></div>
</div>

<script type="text/javascript">
	YAHOO.namespace("example.container");

	YAHOO.example.container.init = function() {

		// CREATE LINKS FOR EXAMPLE

		function createLink(i, container, title) {
			var a = document.createElement("a");
			a.href = "http://www.yahoo.com/";
			a.innerHTML = i + ".  Hover over me to see my Tooltip";

			if (title) {
			    a.title = title;
			}

			container.appendChild(a);
			container.appendChild(document.createElement("br"));
			container.appendChild(document.createElement("br"));
			return a;
		}

		function createTitledLinks() {
			var ids = [];
			var container = YAHOO.util.Dom.get("containerA");
			for (var i = 1; i <= 5; i++) {
				// NOTE: We're setting up titles for these links
				var a = createLink(i, container, "Tooltip for link A" + i + ", set through title");
				a.id = "A" + i;
				ids.push(a.id);
			}
			return ids;
		}

		function createUntitledLinks() {
			var ids = [];
			var container = YAHOO.util.Dom.get("containerB");
			for (var i = 1; i <= 5; i++) {

				// NOTE: We're not setting up titles for these links
				var a = createLink(i, container, null);
				a.id = "B" + i;
				ids.push(a.id);

				// Change standard text for the 3rd link, to reflect
				// that we'll disable the tooltip for it.
				if ( i == 3 ) {
					a.innerHTML = i + ". Tooltip display prevented";
				} 
			}
			return ids;
		}

		var groupAIds = createTitledLinks();
		var groupBIds = createUntitledLinks();

		// TOOLTIP CODE

		// For links in group A which all have titles, this is all we need.
		// The tooltip text for each context element will be set from the title attribute

		var ttA = new YAHOO.widget.Tooltip("ttA", { 
			context:groupAIds
		});

		// For links in group B, we'll set the tooltip text dynamically, 
		// right before the tooltip is triggered, using the id of the triggering context.
		// We'll also prevent the tooltip from being displayed for link B3.

		var ttB = new YAHOO.widget.Tooltip("ttB", { 
			context:groupBIds
		});

		// Stop the tooltip from being displayed for link B3.
		ttB.contextMouseOverEvent.subscribe(
			function(type, args) {
				var context = args[0];
				if (context && context.id == "B3") {
					return false;
				} else {
					return true;
				}	
			}
		);

		// Set the text for the tooltip just before we display it.
		ttB.contextTriggerEvent.subscribe(
			function(type, args) {
				var context = args[0];
				this.cfg.setProperty("text", "Tooltip for " + context.id + ", set using contextTriggerEvent");
			}
		);
	};

	YAHOO.util.Event.addListener(window, "load", YAHOO.example.container.init);
</script>
