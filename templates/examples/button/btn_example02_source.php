<script type="text/javascript">

    YAHOO.example.init = function () {

        // "contentready" event handler for the "linkbuttonsfrommarkup" <div>

        YAHOO.util.Event.onContentReady("linkbuttonsfrommarkup", function() {

            // Create Buttons from existing markup
    
            var oLinkButton1 = new YAHOO.widget.Button("linkbutton1");
            var oLinkButton2 = new YAHOO.widget.Button("linkbutton2");
            var oLinkButton3 = new YAHOO.widget.Button("linkbutton3");  
        
        });


        // Create Buttons without using existing markup

        var oLinkButton4 = new YAHOO.widget.Button({ type: "link", id: "linkbutton4", label: "Yahoo!", href: "http://www.yahoo.com", container: "linkbuttonsfromjavascript" });
        var oLinkButton5 = new YAHOO.widget.Button({ type: "link", id: "linkbutton5", label: "Yahoo!", href: "http://www.yahoo.com", container: "linkbuttonsfromjavascript" });
        var oLinkButton6 = new YAHOO.widget.Button({ type: "link", id: "linkbutton6", label: "Yahoo!", href: "http://www.yahoo.com", container: "linkbuttonsfromjavascript" });

    } ();

</script>

<div id="button-examples">

    <div id="linkbuttonsfrommarkup">
        <h2>From Markup</h2>

        <a id="linkbutton1" href="http://www.yahoo.com">Yahoo!</a>
        <span id="linkbutton2" class="yui-button yui-link-button"><span class="first-child"><a href="http://www.yahoo.com">Yahoo!</a></span></span>
        <span id="linkbutton3" class="yui-button yui-link-button"><em class="first-child"><a href="http://www.yahoo.com">Yahoo!</a></em></span>

    </div>
    
    <div id="linkbuttonsfromjavascript">
        <h2>From JavaScript</h2>
    </div>

</div>