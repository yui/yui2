			<p>Tooltip can also be configured to reuse one Tooltip for multiple context elements with "title" attributes. Using only one Tooltip for multiple context elements gives you the ability to increase performance by reducing the number of Tooltip elements created, especially when you have a large number of context elements that need to invoke Tooltips.</p>

			<p>In this tutorial, we will dynamically create 25 links, and then associate a single Tooltip with all of the generated links. This is achieved by setting the <em>context</em> property to an array of element ids:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
					var contextElements = [];

					for (var i=1;i<=25;i++) {
						var a = document.createElement("a");
						a.id = "link" + i;
						a.href = "http://www.yahoo.com";
						a.title = "This is link number " + i;
						a.innerHTML = i + ".  Hover over me to see my Tooltip";

						document.body.appendChild(a);
						document.body.appendChild(document.createElement("br"));
						document.body.appendChild(document.createElement("br"));
					
						contextElements[contextElements.length] = a.id;
					}

					YAHOO.example.container.tt = new YAHOO.widget.Tooltip("tt", { context:contextElements } );
			</textarea>