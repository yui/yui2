<div id="container">
	<h2 class="first" id="tabview-title">Browser News</h2>
</div>
<script type="text/javascript">
(function() {

	var Dom = YAHOO.util.Dom,
		UA = YAHOO.env.ua,

		oTitle,
		oTabViewEl,
		oLog,
		sInstructionalText;

    var oTabView = new YAHOO.widget.TabView();
    
    oTabView.addTab( new YAHOO.widget.Tab({
        label: 'Opera',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=opera+browser',
        cacheData: true,
        active: true
    }));

    oTabView.addTab( new YAHOO.widget.Tab({
        label: 'Firefox',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=firefox+browser',
        cacheData: true
    }));

    oTabView.addTab( new YAHOO.widget.Tab({
        label: 'Explorer',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=microsoft+explorer+browser',
        cacheData: true
    }));

    oTabView.addTab( new YAHOO.widget.Tab({
        label: 'Safari',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=apple+safari+browser',
        cacheData: true
    }));

    oTabView.appendTo('container');
    

	//	Make use of some additional ARIA Roles and States to further enhance the TabView if the 
	//	browser supports ARIA.
	
	if ((UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8)) {

		//	Use the "labelledby" attribute provided by the ARIA plugin for TabView to label the 
		//	TabView with the <h2>, and append some instructional text to the <H2> that tells users 
		//	of screen readers how to use TabView.  This text will be read when the first Tab is 
		//	focused.  Since this text is specifically for users of screen readers, it will be 
		//	hidden off screen via CSS.

		oTitle = Dom.get("tabview-title");

		sInstructionalText = oTitle.innerHTML;

		oTitle.innerHTML = (sInstructionalText + "<em>Press the space bar or enter key to load the content of each tab.</em>");

		oTabView.set("labelledby", "tabview-title");


		//	Since the content of each Tab is loaded via XHR, append a Live Region to the TabView's 
		//	root element that will be used to message users about the status of each Tab's content.  

		oTabViewEl = oTabView.get("element");
		oLog = oTabViewEl.ownerDocument.createElement("div");

		oLog.setAttribute("role", "log");
		oLog.setAttribute("aria-live", "polite");

		oTabViewEl.appendChild(oLog);


		//	"activeTabChange" event handler used to notify the screen reader that 
		//	the content of the Tab is loading by updaing the content of the Live Region.

		oTabView.on("activeTabChange", function (event) {

			var oTabEl = this.get("activeTab").get("element"),
				sTabLabel = oTabEl.textContent || oTabEl.innerText,
				oCurrentMessage = Dom.getFirstChild(oLog),
				oMessage = oLog.ownerDocument.createElement("p");

			oMessage.innerHTML = "Please wait.  Content loading for " + sTabLabel + " property page.";

			if (oCurrentMessage) {
				oLog.replaceChild(oMessage, oCurrentMessage);
			}
			else {
				oLog.appendChild(oMessage);						
			}

		});	
	

		//	"dataLoadedChange" event handler used to notify the screen reader that 
		//	the content of the Tab has finished loading by updating the content of the Live Region.
		
		var onDataLoadedChange = function (event) {

			var oTabEl = this.get("element"),
				sTabLabel = oTabEl.textContent || oTabEl.innerText,
				oCurrentMessage = Dom.getFirstChild(oLog),
				oMessage = oLog.ownerDocument.createElement("p");

			oMessage.innerHTML = "Content loaded for " + sTabLabel + " property page.";

			if (oCurrentMessage) {
				oLog.replaceChild(oMessage, oCurrentMessage);
			}
			else {
				oLog.appendChild(oMessage);						
			}
		
		};
	
		oTabView.getTab(0).on("dataLoadedChange", onDataLoadedChange);
		oTabView.getTab(1).on("dataLoadedChange", onDataLoadedChange);
		oTabView.getTab(2).on("dataLoadedChange", onDataLoadedChange);
		oTabView.getTab(3).on("dataLoadedChange", onDataLoadedChange);

	}
    
})();
</script>