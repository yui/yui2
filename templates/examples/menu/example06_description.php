<h2 class="first">Creating a Menu from JavaScript with items organized into groups with titles</h2>
<p>
To create a Menu with no pre-existing markup on the page, call the Menu 
constructor (<code>YAHOO.widget.Menu</code>) passing the id of the Menu 
element to be created as the first argument.
</p>
<p>
Add items to a Menu instance via the <code>addItem</code>, 
<code>insertItem</code>, or <code>addItems</code> methods.
</p>
<p>
Items can be organized into groups by creating a multi-dimensional array
of YAHOO.widget.MenuItem configuration properties and passing it to the 
<code>addItems</code> method.  Add a title to each group via the 
<code>setItemGroupTitle</code> method.
</p>
<p>
Finally, it is necessary to call the <code>render</code> method passing 
the id of, or reference to the element the Menu should be appended to.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Instantiate a Menu:  The first argument passed to the 
     constructor is the id of the element in the page 
     representing the Menu; the second is an object literal 
     of configuration properties.
*/

var oMenu = new YAHOO.widget.Menu("menuwithgroups", { fixedcenter: true });


/*
    Add items to the Menu instance by passing an array of object literals 
    (each of which represents a set of YAHOO.widget.MenuItem 
    configuration properties) to the "addItems" method.
*/

oMenu.addItems([

    [
        { text: "Yahoo! Mail", url: "http://mail.yahoo.com" },
        { text: "Yahoo! Address Book", url: "http://addressbook.yahoo.com" },
        { text: "Yahoo! Calendar", url: "http://calendar.yahoo.com" },
        { text: "Yahoo! Notepad", url: "http://notepad.yahoo.com" }
    ],

    [

        { text: "Yahoo! Local", url: "http://local.yahoo.com" },
        { text: "Yahoo! Maps", url: "http://maps.yahoo.com" },
        { text: "Yahoo! Travel", url: "http://travel.yahoo.com" },
        { text: "Yahoo! Shopping", url: "http://shopping.yahoo.com" } 
    
    ],

    [

        { text: "Yahoo! Messenger", url: "http://messenger.yahoo.com" },
        { text: "Yahoo! 360", url: "http://360.yahoo.com" },
        { text: "Yahoo! Groups", url: "http://groups.yahoo.com" },
        { text: "Flickr Photo Sharing", url: "http://www.flickr.com" }
    
    ]

]);


// Add the title for each group of menu items

oMenu.setItemGroupTitle("Yahoo! PIM", 0);
oMenu.setItemGroupTitle("Yahoo! Search", 1);
oMenu.setItemGroupTitle("Yahoo! Communications", 2);


/*
    Since this Menu instance is built completely from script, call the 
    "render" method passing in the DOM element that it should be 
    appended to.
*/

oMenu.render("rendertarget");
</textarea>