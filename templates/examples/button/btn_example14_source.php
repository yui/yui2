<script type="text/javascript">

    (function() {

        var Event = YAHOO.util.Event;

    
        Event.onContentReady("example", function () {

            var Dom = YAHOO.util.Dom,
                oSlider;


            /*
                Create a <div> element to house a Button instance and its 
                corresponding <label> element.
            */

            var oDIV = document.createElement("div")

            oDIV.id = "opacitycontrols";
            oDIV.innerHTML = "<label for=\"opacitybutton-button\">Opacity:</label>";

            Dom.get("example").appendChild(oDIV);


            /*
                Create a Menu instance whose body element will house a 
                Slider instance.
            */

            var oOpacityMenu = new YAHOO.widget.Menu("opacitymenu", { width: "220px" });


            /*
                Create a new Button instance, wrapping the label in an 
                <em> element.  The <em> element will be used to give the 
                Button instance a fixed width to prevent it from growing
                and shrinking as the text label is updated.
            */

            var oButton = new YAHOO.widget.Button({ 
                                                type: "menu", 
                                                id: "opacitybutton", 
                                                label: "<em id=\"opacitybutton-currentopacity\">100%</em>", 
                                                menu: oOpacityMenu,  
                                                container: "opacitycontrols" });


            /*
                Maintain a reference to the <em> element inside the label
                so that its text can easily be updated in response to the firing
                of the Slider instance's "change" event.
            */

            var oCurrentOpacity;


			oButton.on("appendTo", function () {
			
                // Add Slider markup to the Menu instance's body element

                oOpacityMenu.setBody("<div id=\"slider-bg\" tabindex=\"1\" title=\"Slider\"><div id=\"slider-thumb\"><img src=\"../button/assets/thumb-n.gif\"></div></div>");


                /*
                     Render the Menu instance into the element specified as the 
                     Button instance's container
                */

                oOpacityMenu.render(this.get("container"));			
			
				oCurrentOpacity = Dom.get("opacitybutton-currentopacity");
			
			});
            

            /*
                Give the Button instance's <button> element an id so that 
                clicking its corresponding <label> element will result in the 
                Button instance receiving focus.
            */

            var oHTMLButton = oButton.get("element").getElementsByTagName("button")[0];
            
            oHTMLButton.id = "opacitybutton-button";



            /*
                Add a "beforeShow" event handler to the Menu instance that 
                will instantiate the Slider.
            */

			var onMenuBeforeShow = function () {

                // Instantiate the Slider

                oSlider = YAHOO.widget.Slider.getHorizSlider("slider-bg", "slider-thumb", 0, 200, 1);
                

                // Set the initial value of the Slider instance

                oSlider.setValue(200, true);
        

                // Maintain a reference to the Slider instance's root element

                var oSliderEl = Dom.get("slider-bg");

        
                // Subscribe to the Slider instance's "change" event
        
                oSlider.subscribe("change", function() {
        
                    /*
                        Divide the pixel offset in half to get a value between 
                        0 and 100 - used to convey the current opacity via the
                        Button instance's label. 
                    */
                    
                    var nValue = (Math.round(oSlider.getValue() * .5)),

                        /*
                             Divide by 100 in order to set provide a compatible
                             value for the CSS "opacity" property. 
                        */

                        nOpacity = (nValue * .01);
        

                    /*
                         Update the title attribute of the Slider instance's 
                         root element.  This helps assistive technology to 
                         communicate the state change.
                    */

                    oSliderEl.title = "slider value = " + nOpacity;
                    



                    // Set the opacity of the photo

                    Dom.setStyle("photo", "opacity", nOpacity);




                    // Update the text label of the Button instance

                    oCurrentOpacity.innerHTML = (nValue + "%");
        
                });


                var focusSlider = function () {

                    if ((YAHOO.env.ua.ie || YAHOO.env.ua.gecko) && oSliderEl) {
    
                        window.setTimeout(function () {                    

                            oSliderEl.focus();
                        
                        }, 0);
                    
                    }                    
                
                };


				focusSlider();


                // Focus the Slider instance each time it is made visible

                oOpacityMenu.subscribe("show", focusSlider);
                

                // Unsubscribe from the "beforeShow" event, since we only need to initialize the 
                // Slider once.
                
            	oOpacityMenu.unsubscribe("beforeShow", onMenuBeforeShow);
            
            };


            oOpacityMenu.subscribe("beforeShow", onMenuBeforeShow);

        });
        
    })();

</script>

<div id="example"><a href="http://www.flickr.com/photos/toddlr/477993821/" title="Photo Sharing"><img id="photo" src="http://farm1.static.flickr.com/198/477993821_0079194851.jpg" width="500" height="375" alt="Ella - A Shih Tzu + Maltese Mix Puppy"></a></div>
