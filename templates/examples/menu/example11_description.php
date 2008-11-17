<h2 class="first">Setting MenuItem configuration properties</h2>
<p>
A MenuItem has a number of <a 
href="http://developer.yahoo.com/yui/menu/#mitemconfigref">configuration 
properties</a> that affect its behavior and visual rendering.  Any of these 
configuration properties can be set when adding an item to its parent Menu 
instance by defining them in an object that is passed to the Menu's 
<code>addItem</code>, <code>insertItem</code>, or <code>addItems</code> 
methods. This example ulitizes the following configuration properties: 
text, selected, disabled, url, and checked.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Instantiate a Menu:  The first argument passed to the 
     constructor is the id of the element in the page 
     representing the Menu; the second is an object literal 
     of configuration properties.
*/

var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true } );


/*
    Add items to the Menu instance by passing an array of object literals 
    (each of which represents a set of YAHOO.widget.MenuItem 
    configuration properties) to the "addItems" method.
*/

oMenu.addItems([

        { text: "Selected MenuItem", selected: true },
        { text: "Disabled MenuItem", disabled: true },
        { text: "MenuItem With A URL", url: "http://www.yahoo.com" },
        { text: "Checked MenuItem", checked: true }

    ]);


/*
    Since this Menu instance is built completely from script, call the 
    "render" method passing in the DOM element that it should be 
    appended to.
*/

oMenu.render("rendertarget");
</textarea>