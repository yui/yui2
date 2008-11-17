<h2 class="first">Setting MenuItem configuration properties at runtime</h2>
<p>
A MenuItem has a number of <a 
href="http://developer.yahoo.com/yui/menu/#mitemconfigref">configuration 
properties</a> that affect its behavior and visual rendering.  Any of these 
configuration properties can be set at runtime via the 
<code>setProperty</code> method of the item's configuration object 
(accessible via its <code>cfg</code> property.
</p>
<p>
This example ulitizes the following configuration properties: 
text, selected, disabled, helptext, url, emphasis, strongemphasis, and checked.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     "configChange" event handler for each MenuItem instance - used 
     to log info about the configuration property that was changed.
*/

function onMenuItemConfigChange(p_sType, p_aArgs) {

    var sPropertyName = p_aArgs[0][0],
        sPropertyValue = p_aArgs[0][1];

    YAHOO.log(("Index: " + this.index + ", " +
               "Group Index: " + this.groupIndex + ", " +
               "Custom Event Type: " + p_sType + ", " +                  
               "\"" + sPropertyName + "\" Property Set To: \"" 
               + sPropertyValue + "\""), "info", "example12");

}


/*
     Instantiate a Menu:  The first argument passed to the 
     constructor is the id of the element in the page 
     representing the Menu; the second is an object literal 
     of configuration properties.
*/

var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true });


/*
     Subscribe to the Menu instance's "itemAdded" event in order to 
     subscribe to the "configChange" event handler of each MenuItem 
     instance's configuration object.
*/

oMenu.subscribe("itemAdded", function (p_sType, p_aArgs) {

    var oMenuItem = p_aArgs[0];
   
    /*
         Subscribe to the "configChange" event handler of each MenuItem 
         instance's configuration object.
    */

    oMenuItem.cfg.subscribe("configChanged", onMenuItemConfigChange);

});


/*
    Add items to the Menu instance by passing an array of strings 
    (each of which represents the "text" configuration property of a 
    YAHOO.widget.MenuItem instance) to the "addItems" method.
*/

oMenu.addItems([
    
        "Selected MenuItem",
        "Disabled MenuItem",
        "MenuItem With A URL",
        "Checked MenuItem"

    ]);


/*
    Since this Menu instance is built completely from script, call the 
    "render" method passing in the DOM element that it should be 
    appended to.
*/

oMenu.render("rendertarget");


/*
     Set a configuration property of each MenuItem to trigger the firing
     of its configuration object's "configChanged" event.
*/

oMenu.getItem(0).cfg.setProperty("selected", true);
oMenu.getItem(1).cfg.setProperty("disabled", true);
oMenu.getItem(2).cfg.setProperty("url", "http://www.yahoo.com");
oMenu.getItem(3).cfg.setProperty("checked", true);
</textarea>