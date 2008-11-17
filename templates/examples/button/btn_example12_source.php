<script type="text/javascript">

    YAHOO.example.init = function () {
    
        // Click event handler for the Button instance

        function onMenuClick(p_sType, p_aArgs) {
        
            // The MenuItem instance that was clicked
            
            var oMenuItem = p_aArgs[1];
            
            if (oMenuItem) {

                /*
                     Set the Button's "label" attribute to the value of the 
                     "text" configuration property of the MenuItem that was 
                     the target of the "click" event.
                */
            
                oButton.set("label", ("<em>" + oMenuItem.cfg.getProperty("text") + "</em>"));

            }
        
        }
        
        
        /*
             Create an array of name and value pairs that serve as the data 
             source for the Button instance's menu.
        */
        
        var aCategories = [
        
            { text: "Category 1", value: "one" },
            { text: "Category 2", value: "two" },
            { text: "Category 3", value: "three" },
            { text: "A Really, Really Long Category 4", value: "four" }
        
        ];
        

        /*
             Create a Button instance, wrapping the text label in an <EM>
             tag that will be given a fixed width of 10em.
        */

        var oButton = new YAHOO.widget.Button({ 
                                        type: "menu", 
                                        id:"categorybutton", 
                                        label: "<em>Select a Category</em>", 
                                        menu: aCategories, 
                                        container: "buttoncontainer" }); 

        /*
             Subscribe to the Menu instance's "click" event once the Button
             instance is appended to its specified container.s
        */

        oButton.on("appendTo", function () {
    
            oButton.getMenu().subscribe("click", onMenuClick);
        
        });

    } ();

</script>

<div id="buttoncontainer"></div>