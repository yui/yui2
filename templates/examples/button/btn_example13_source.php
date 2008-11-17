<script type="text/javascript">

    YAHOO.util.Event.onContentReady("buttoncontainer", function () {

        // Create a new Button instance

        var oButton = new YAHOO.widget.Button({ 
                                            id: "ok-button", 
                                            label: "OK", 
                                            container: "buttoncontainer" });


        /*
            Begin animating the Button instance's background color once it is 
            appended to its containing element.
        */

        oButton.on("appendTo", function () {

            /*
                Apply a special CSS class to be able to target IE 6 
                specifically in the CSS.
            */

            if (YAHOO.env.ua.ie == 6) {
            
                oButton.addClass("ie6");
            
            }
    

            // Create a new ColorAnim instance

            var oButtonAnim = new YAHOO.util.ColorAnim("ok-button", { backgroundColor: { to: "#b1ddff" } });
    

            /*
                Restart the color animation each time the target color has 
                been applied.
            */ 

            oButtonAnim.onComplete.subscribe(function () {
    
                this.attributes.backgroundColor.to = (this.attributes.backgroundColor.to == "#b1ddff") ? "#016bbd" : "#b1ddff";
            
                this.animate();
            
            });
            
            oButtonAnim.animate();
        
        });
    
    });

</script>

<div id="buttoncontainer"></div>