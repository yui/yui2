//v2 migrated to YUILoader
/*This script allows the README text file for this component
  to be loaded in a YUI Panel (via XHR) and viewed in context
  rather than being viewed as a naked txt file without site
  chrome. This functionality loads 1 second after page load to
  avoid impacting page performance.  Only YUI Loader is required;
  all other dependencies can be bootstrapped. */
YAHOO.namespace("yui.ReadMe");

YAHOO.yui.ReadMe.init = function() {

	// Instantiate and configure Loader:
	var loader = new YAHOO.util.YUILoader({
		// Identify the components you want to load.  Loader will automatically identify
		// any additional dependencies required for the specified components.
		require: ["event", "dom", "animation", "connection", "container"],
		combine: true,
		// Configure loader to pull in optional dependencies.  For example, animation
		// is an optional dependency for slider.
		loadOptional: false,
		// The function to call when all script/css resources have been loaded
		onSuccess: function() {
			//this is your callback function; you can use
			//this space to call all of your instantiation
			//logic for the components you just loaded.
			var getComponent = function() {
				var aP = location.href.split("/");
				console.log(aP[4]);
				return aP[4];
			};

			var 	$d = YAHOO.util.Dom,
					$e = YAHOO.util.Event,
					$c = YAHOO.util.Connect,
					$w = YAHOO.widget,
					oComponents = YAHOO.yui.moduleMeta,
					readmePanel = false,
					componentName = getComponent(),
					loadingMessage = '<p class="loading-content">loading release notes for ' + oComponents[componentName] + '</p>';
					counter = 0;

			var launchReadme = function(e) {
				$e.preventDefault(e);
				if(readmePanel) {
					readmePanel.show();
				} else {
					try {
						readmePanel = new $w.Panel("readmePanel", {
							"width":"850px",
							"close":true,
							"constraintoviewport":true,
							"draggable":true,
							"modal":true,
							"visible":false,
							"x":0
						});
						readmePanel.setHeader("Release Notes for YUI's " + oComponents[componentName].name);
						readmePanel.setBody(loadingMessage);
						readmePanel.setFooter("[<a href='/yui/releasenotes/README." + componentName + "'>direct link to release notes</a>]");
						readmePanel.render(document.body);
						readmePanel.beforeShowEvent.subscribe(function(){
							$d.setStyle("readmePanel","display","block");
							readmePanel.body.style.maxHeight = Math.floor($d.getViewportHeight()*.77) + "px";
							if(readmePanel.browser=="ie") {
								readmePanel.body.style.height = Math.floor($d.getViewportHeight()*.77) + "px";
							};
							readmePanel.center();
							//if this is the first time we're rendering it, it
							//will have no content and so will center too low
							//in the screen; move it up on the first show and
							//let the centering take care of the centering on the
							//x axis.
							if(counter++ == 0) {
								readmePanel.cfg.setProperty("y",30);
								readmePanel.render();
							}
						});
						readmePanel.hideEvent.subscribe(function(){$d.setStyle("readmePanel","display","none");});
						readmePanel.renderEvent.subscribe(function(){readmePanel.sizeMask();});

						readmePanel.show();

						$c.asyncRequest("GET", "/yui/releasenotes/README." + componentName, {
							success:processReleaseNotes,
							failure:processFailedXHR,
							argument: {
								"readmePanel":readmePanel,
								"componentName":componentName
							}
						});

						var escapePanel = function() {
							if(readmePanel) {
								readmePanel.hide();
							}
						}
						var kl = new YAHOO.util.KeyListener(document,
							{keys: [27]},
							{fn:escapePanel});
						kl.enable();
					} catch(e) {
						location.href="/yui/releasenotes/README." + componentName;
					}
			}

			}
			$e.on("releasenotes", "click", launchReadme);

			var processReleaseNotes = function(o) {
				rt = o.responseText;
				rt = rt.replace(/</g, "&lt;");
				rt = rt.replace(/>/g, "&gt;");
				o.argument.readmePanel.setBody("<pre id='relNotesText'>" + rt + "</pre>");
				o.argument.readmePanel.render();
			}

			var processFailedXHR = function(o) {
				location.href="/yui/releasenotes/README." + o.argument.componentName;
			}

		}
	});

	//insert the dependencies for the readme panel and initialize:
	loader.insert();

}

YAHOO.util.Event.on(window, "load", function() {
	setTimeout(YAHOO.yui.ReadMe.init, 1100);
});