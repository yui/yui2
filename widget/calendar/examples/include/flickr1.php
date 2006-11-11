
			<p>In this tutorial, we will bring together many of the concepts covered in previous tutorials, along with some of the other YUI components, to build a fully functional custom Calendar that displays the most interesting photo for each day of the year in a Calendar cell.</p>

			<p>In addition to the dependencies required for Calendar, we will also rely on the <a href="/yui/connection">Connection Manager</a>, <a href="/yui/animation">Animation library</a>, and the <a href="/yui/container">Container collection of controls</a>. The aggregated dependencies look like this:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<script type="text/javascript" src="yui/build/yahoo/yahoo.js"></script>
				<script type="text/javascript" src="yui/build/event/event.js" ></script>
				<script type="text/javascript" src="yui/build/dom/dom.js" ></script>
				<script type="text/javascript" src="yui/build/animation/animation.js" ></script>
				<script type="text/javascript" src="yui/build/connection/connection.js" ></script>

				<script type="text/javascript" src="yui/build/calendar/calendar.js"></script>
				<link type="text/css" rel="stylesheet" href="yui/build/calendar/assets/calendar.css">

				<script type="text/javascript" src="yui/build/container/container.js"></script>
				<link type="text/css" rel="stylesheet" href="yui/build/container/assets/container.css">
			</textarea>

			<p>First, we will include a style block that changes some of the style attributes of the Calendar to make it more convenient for displaying photos:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<style>
					body { margin:5px;background:#444 }
					.mask { z-index:100;background-color:#000 }
					
					.panel-container.shadow .underlay { background-color:#666 }
					.panel .hd { padding:5px;border:none;background-color:#666 }
					.panel .bd { background-color:#000;padding:0 }
					.panel .bd img { margin:5px }
					.yui-calendar td.calcell { text-align:right;vertical-align:top;background-color:#fff;padding:0;width:75px;height:75px;font-size:150%;color:#333 }
					
					.yui-calendar .calheader { border:1px solid #EEE }
					.yui-calendar th.calweekdaycell { text-align:center;font-size:120% }
					.yui-calendar td.calcell.calcellhover { cursor:pointer; background:none; border:1px solid #FF9900; }

					.yui-calendar td.calcell.oom { background-color:#666; }

					.yui-calendar td.calcell div.photo { background-color:transparent;margin:0;position:relative;width:75px;height:75px;}
					.yui-calendar td.calcell div.photo div.hilite { display:none;background-color:yellow;z-index:5;margin:0;top:0;left:0;position:absolute;width:75px;height:75px;}

					.yui-calendar td.calcell.calcellhover div.photo div.hilite { display:block } 
					.yui-calendar td.calcell.selected div.photo div.hilite { display:block;background-color:blue }

					.yui-calendar td.calcell div.photo div.date { font-weight:lighter;z-index:1;color:#eee;position:absolute;top:5%;right:5%; }
					.yui-calendar td.calcell div.photo div.date-shadow { z-index:0;color:#000;position:absolute;top:7%;right:4% }
					.yui-calendar .calheader { font-size:200% }
				</style>
			</textarea>

			<p>Next, we will instantiate a Calendar widget and modify the default cell renderer to use a new one: <em>renderFlickrCell</em>. This function will render the Calendar cells so that each selectable cell contains a special div that will display the most popular image from flickr for that day.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">

				function renderFlickrCell(workingDate, cell) {
					var year = workingDate.getFullYear();
					var month = workingDate.getMonth()+1;
					var day = workingDate.getDate();

					cell.innerHTML = "<div class=\"photo\"><div class=\"hilite\">&nbsp;</div><div class=\"date\">" + workingDate.getDate() + "</div><div class=\"date-shadow\">" + workingDate.getDate() + "</div></div>";
					YAHOO.util.Dom.setStyle(cell.firstChild.firstChild, "opacity", "0.5");
					
					var photo;
					if (photos[year] && photos[year][month] && photos[year][month][day]) {
						photo = photos[year][month][day];
					}

					if (photo) {
						if (cell.firstChild) {
							cell.firstChild.style.background = "url(" + photo.imgS + ")";
						}
					} else {
						getCellPhoto(new Date(workingDate.getTime()), cell.id);
					}

					return YAHOO.widget.Calendar.STOP_RENDER;
				}

			</textarea>

			<p>Each time a cell is rendered, the Connection Manager is used to retrieve the most popular photo from flickr for that day. This is achieved by the call to <em>getCellPhoto</em> from the <em>renderFlickrCell</em> function. When the photo is retrieved, it is automatically wrapped in a JSON callback function, <em>jsonFlickrApi</em>, which is provided by flickr. This function grabs the "photo" object that was retrieved and returns it to the local data array. After the photo data is successfully retrieved, the callback function, <em>setCellPhoto</em> is called, and the photo is set into the special "photo" div in the Calendar date cell.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">

				function getCellPhoto(workingDate, cell) {
					var callback = {
						success : setCellPhoto,
						argument : [workingDate, cell]
					}

					var month = workingDate.getMonth()+1;
					var day = workingDate.getDate();
					var year = workingDate.getFullYear();

					if (month < 10)	{
						month = "0" + month;
					}
					if (day < 10) {
						day = "0" + day;
					}
					
					var url = 'api_key=195ef39538e43108f980c597ce9cc385&date='+year+'-'+month+'-'+day+'&per_page=1&format=json';

					conn[conn.length] = YAHOO.util.Connect.asyncRequest('GET', '/examples/util/xhr.php?' + url, callback);
				}

				function jsonFlickrApi(rsp) { 
					if (rsp.stat == "ok") {
						var photo = rsp.photos.photo[0];
						photo.imgS = "http://static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";
						photo.imgM = "http://static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";
						photo.img = "http://static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";						
						return photo;
					} else {
						return null;
					}
				}

			</textarea>

			<p>The flickr Calendar also has a Panel, defined by YAHOO.widget.Panel, which is called up whenever a cell is clicked. First, the Panel is defined:</p>

			<textarea name="code" class="JScript" cols="60" rows="1">

					YAHOO.example.calendar.panel = new YAHOO.widget.Panel("panel", { visible:false,fixedcenter:true,modal:true,zIndex:101,draggable:false,effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25} });

					YAHOO.example.calendar.panel.setHeader("Photo");
					YAHOO.example.calendar.panel.setBody("");
					YAHOO.example.calendar.panel.render(document.body);
					
			</textarea>

			<p>We also need to wire up the Calendar's <em>selectEvent</em> so that the Panel is updated with the appropriate photo data when a date selection is made. The function that handles the <em>selectEvent</em> checks the loaded photo data, and if it is found, it sets the larger image into the Panel and then makes the Panel visible.</p>

			<textarea name="code" class="JScript" cols="60" rows="1">
					YAHOO.example.calendar.cal1.selectEvent.subscribe(function(type,args,obj) {
														var selected = args[0]
														var selectedDate = selected[0];

														var year = selectedDate[0];
														var month = selectedDate[1];
														var day = selectedDate[2];

														var photo;

														if (photos[year] && photos[year][month] && photos[year][month][day]) {
															photo = photos[year][month][day];

															var recenter = function() {
																YAHOO.example.calendar.panel.cfg.setProperty("width", (this.offsetWidth + 10) + "px");
																YAHOO.example.calendar.panel.render();
																YAHOO.example.calendar.panel.center();
																YAHOO.example.calendar.panel.show();
															}

															YAHOO.example.calendar.panel.setHeader(photo.title);
															YAHOO.example.calendar.panel.setBody("<img src=\"" + photo.img + "\" />");
															
															YAHOO.util.Event.addListener(YAHOO.example.calendar.panel.body.firstChild, "load", recenter);

														}
													});
			</textarea>
