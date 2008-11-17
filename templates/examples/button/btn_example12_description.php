<p>
Begin by creating a Button instance of type "menu," wrapping its text label 
in an <code>&#60;em&#62;</code> element.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
<p>
Style the <code>&#60;em&#62;</code> element so that it has a fixed width of 
10em, and prevent the characters from exceeding this width by setting its  
"overflow" property to "hidden."
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#categorybutton button {

    /* 
        Suppress the focus outline since Safari will outline even the 
        text that is clipped by the application of the "overflow" property
        in the follow style rule.
    */

    outline: none;

}

#categorybutton button em {

    font-style: normal;
    display: block;
    text-align: left;
    white-space: nowrap;

    /*  Restrict the width of the label to 10em. */

    width: 10em;

    /* Hide the overflow if the text label exceeds 10em in width. */

    overflow: hidden;

    /* 
        IE and Safari support the ability to add ellipsis when the text 
        label exceeds 10em in width.
    */

    text-overflow: ellipsis;

}
</textarea>
<p>
Finally, add an event handler to the Button instance's menu that will update 
the Button's label when any item in the menu is clicked.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
     Subscribe to the Menu instance's "click" event once the Button
     instance is appended to its specified container.s
*/

oButton.on("appendTo", function () {

    oButton.getMenu().subscribe("click", onMenuClick);

});
</textarea>