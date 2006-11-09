			<p>Panels can be skinned using only CSS, and a bit of extra markup. In this tutorial, we will create two Panels - one skinned to look like a Windows XP window, and one that looks like the Mac OS X Aqua style. First, let's look at the markup structure that will serve as the framework for our newly skinned Panels. You'll notice that a few additional elements have been added to the header and footer. The classes of these elements - "tl", "tr", "bl" and "bl" - represent each of the corner images that will be applied to the XP skin. The Aqua skin will be built from script only using the same structure, although the rounded corners will only be applied to the top corners. The script and markup for the two skinned Panels are listed below: </p>

			<textarea name="code" class="JScript" cols="60" rows="1">
				YAHOO.example.container.panel2.setHeader("<div class='tl'></div><span>Panel #2 from Script</span><div class='tr'></div>");
				YAHOO.example.container.panel2.setBody("This is a dynamically generated Panel.");
				YAHOO.example.container.panel2.setFooter("<span>End of Panel #2</span>");
			</textarea>

			<textarea name="code" class="HTML" cols="60" rows="1">
				<div id="panel1">
					<div class="hd"><div class="tl"></div><span>Panel #1 from Markup</span><div class="tr"></div></div>
					<div class="bd">This is a Panel that was marked up in the document.</div>
					<div class="ft"><div class="bl"></div><span>End of Panel #1</span><div class="br"></div></div>
				</div>
			</textarea>

			<p>The skinning of these Panels is achieved using CSS definitions. In this tutorial, we will use id selectors in our CSS definitions to specify which Panel should receive each skin. Most of the styles consist of background images that are applied to various pieces of the Panels. The styles are defined below:</p>

			<textarea name="code" class="HTML" cols="60" rows="1">
				/* XP Panel Skin CSS */
				#panel1_c.panel-container.shadow .underlay { background-color:#999; }
				#panel1.panel { border:none; overflow:visible; background:transparent url(../assets/img/xp-brdr-rt.gif) no-repeat top right; }

				#panel1.panel .close { top:5px; right:8px; height:21px; width:21px; }
				#panel1.panel .close.nonsecure { background-image:url(../assets/img/xp-close.gif); } 
				#panel1.panel .close.secure { background-image:url(../assets/img/xp-close.gif); }

				#panel1.panel .hd { padding:0; border:none; background:transparent url(../assets/img/xp-hd.gif); color:#FFF; height:30px; margin-left:8px; margin-right:8px; text-align:left; vertical-align:middle; overflow:visible; }
				#panel1.panel .hd span { line-height:30px; vertical-align:middle; }
				#panel1.panel .hd .tl { width:8px;height:29px; top:1px;left:0; background:transparent url(../assets/img/xp-tl.gif); position:absolute; }
				#panel1.panel .hd .tr { width:8px;height:29px; top:1px;right:0; background:transparent url(../assets/img/xp-tr.gif); position:absolute; }

				#panel1.panel .bd { overflow:hidden; padding:10px; border:none; background:#FFF url(../assets/img/xp-brdr-lt.gif) repeat-y; margin:0 4px 0 0; }

				#panel1.panel .ft { background:transparent url(../assets/img/xp-ft.gif); font-size:11px; height:26px; padding:0px 10px; }
				#panel1.panel .ft span { line-height:22px; vertical-align:middle; }
				#panel1.panel .ft .bl { width:8px;height:26px; bottom:0;left:0; background:transparent url(../assets/img/xp-bl.gif); position:absolute; }
				#panel1.panel .ft .br { width:8px;height:26px; bottom:0;right:0; background:transparent url(../assets/img/xp-br.gif); position:absolute; }
				
				/* Aqua Panel Skin CSS */
				#panel2_c.panel-container.shadow .underlay { background-color:#999; }
				#panel2.panel { border:none; overflow:visible; background-color:transparent; } 

				#panel2.panel .close { top:3px; left:4px; height:18px; width:17px; }
				#panel2.panel .close.nonsecure { background-image:url(../assets/img/aqua-hd-close.gif); }
				#panel2.panel .close.secure { background-image:url(../assets/img/aqua-hd-close.gif); }
				#panel2.panel .close.nonsecure:hover { background-image:url(../assets/img/aqua-hd-close-over.gif); }
				#panel2.panel .close.secure:hover { background-image:url(../assets/img/aqua-hd-close-over.gif); }

				#panel2.panel .hd { padding:0; border:none; background:transparent url(../assets/img/aqua-hd-bg.gif); color:#000; height:22px; margin-left:7px; margin-right:7px; text-align:center; overflow:visible; }
				#panel2.panel .hd span { vertical-align:middle; line-height:22px; }
				#panel2.panel .hd .tl { width:7px; height:22px; top:0; left:0; background:transparent url(../assets/img/aqua-hd-lt.gif); position:absolute; }
				#panel2.panel .hd .tr { width:7px; height:22px; top:0; right:0; background:transparent url(../assets/img/aqua-hd-rt.gif); position:absolute; }

				#panel2.panel .bd { overflow:hidden; padding:4px; border:1px solid #aeaeae; background-color:#FFF; }
				#panel2.panel .ft { font-size:75%; color:#666; padding:2px; overflow:hidden; border:1px solid #aeaeae; border-top:none; background-color:#dfdfdf; }
			</textarea>
