<p>
Skinning the Button widget is done using CSS.  The stylesheet used for other 
Button examples is a minified version of the button-core.css and button-skin.css
files.  When customizing the Button skin, use the raw source files as 
a reference.
</p>
<p>
The button-core.css file includes foundational styling that clears the default 
padding, margins and borders for the <code>&#60;button&#62;</code> element as 
wells as normalizes its display type, whereas the button-skin.css file is used 
to apply colors, background images, etc.  Skinning can be accomplished by 
either overriding the styles defined in the button-skin.css file, or by creating 
an entirely new skin file.  When overriding styles, place them in a separate 
file to simplify integrating with YUI updates.  The follow example illustrates 
how to create a new style for a Button instance from scratch.
</p>
<p>
Begin by creating a new Button instance.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var oButton = new YAHOO.widget.Button({ 
                                    id: "ok-button", 
                                    label: "OK", 
                                    container: "buttoncontainer" });
</textarea>
<p>
Next, add style definitions for borders, background colors, and apply a 
transparent background to the Button's root element.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
.yui-button {

    border-width: 1px 0;
    border-style: solid;
    border-color: #004d89;
    margin: auto .25em;

    /*
        Give the Button instance a transparent background image that 
        provides a glossy, glass-like look.  Since the background image is
        transparent, it can apply the glass effect the Button instance
        regardless of its background color.
    */
    background: url(../button/assets/gloss.png) repeat-x left center;
    
}

.ie6 {

    /* Make background image transparent IE 6 using the AlphaImageLoader. */
    background-image: none;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../button/assets/gloss.png', sizingMethod = 'scale');

}

.yui-button .first-child {

    border-width: 0 1px;
    border-style: solid;
    border-color: #004d89;
    margin: 0 -1px;

    /*
        The following is necessary to get negative margins working in IE.s
    */

    *position: relative;
    *left: -1px;

}

.yui-button button,
.yui-button a {

    padding: 0 10px;
    font-size: 93%;  /* 12px */
    line-height: 2;  /* ~24px */
    *line-height: 1.7; /* For IE */
    min-height: 2em; /* For Gecko */
    *min-height: auto; /* For IE */
    color: #fff;
    border: solid 1px #599acd;

}

.yui-button#ok-button {
    
    background-color: #004d89;

}
</textarea>
<p>
Lastly, utilize the ColorAnim utility to animate the Button instance's 
background color.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>