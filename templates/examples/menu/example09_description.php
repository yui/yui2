<h2 class="first">Adding "click" event handlers to items in a Menu</h2>
<p>
The "onclick" configuration property provides an easy way define a "click" 
event listener for individual items when building menus from script.
The "onclick" configuration property accepts an object literal representing 
the code to be executed when the MenuItem instance is clicked.  The format for 
the object literal is:
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
{
    fn: Function (Required),    // The handler to call when the event fires.
    obj: Object (Optional), // An object to pass back to the handler.
    scope: Object (Optional)    // The object to use for the scope of the handler. (By default the scope is the YAHOO.widget.MenuItem instance)
}
</textarea>
<p>
The handler that is called when the "click" event fires recieves two 
arguments: a string representing the name of the event, and an array 
of arguments sent when the event was fired.  The first item in the 
arguments array is the actual DOM event representing the click.  If a 
value was specified for the "obj" property of the object literal defined 
for the "onclick" configuration property, it will be passed back as the 
third argument to the function specified as the "click" event handler.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     "click" event handler for each MenuItem instance - used to log 
     info about the MenuItem that was clicked.
*/

function onMenuItemClick(p_sType, p_aArgs, p_oValue) {

    YAHOO.log(("index: " + this.index + 
               ", text: " + this.cfg.getProperty("text") + 
               ", value: " + p_oValue), "info", "example9");

}


/*
     Instantiate a Menu:  The first argument passed to the 
     constructor is the id of the element in the page 
     representing the Menu; the second is an object literal 
     of configuration properties.
*/

var oMenu = new YAHOO.widget.Menu("mymenu", { fixedcenter: true });


/*
    Add items to the Menu instance by passing an array of object literals 
    (each of which represents a set of YAHOO.widget.MenuItem 
    configuration properties) to the "addItems" method.
*/

oMenu.addItems([

    //  Register a "click" event handler for the first item.

    { text: "Item One", onclick: { fn: onMenuItemClick } },


    /*
         Register a "click" event handler for the second item, 
         passing a string arguemnt ("foo") to the event handler.
    */
    { text: "Item Two", onclick: { fn: onMenuItemClick, obj: "foo" } },


    /*
         Register a "click" event handler for the third item and
         passing and array as an argument to the event handler.
    */
    { text: "Item Three", onclick: { fn: onMenuItemClick, obj: ["foo", "bar"] } }

]);


/*
    Since this Menu instance is built completely from script, call the 
    "render" method passing in the DOM element that it should be 
    appended to.
*/

oMenu.render("rendertarget");
</textarea>