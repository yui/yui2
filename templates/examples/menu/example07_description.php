<h2 class="first">Creating a Menu with submenus from existing markup</h2>
<p>
The markup for a Menu control follows that of 
<a href="../../docs/YAHOO.widget.Module.html">YAHOO.widget.Module</a>, with its 
body element (<code>&#60;div class="bd"&#62;</code>) containing a list element 
(<code>&#60;ul&#62;</code>).  
</p>
<p>
Each item in a Menu is represented by a list item element 
(<code>&#60;li class="yuimenuitem"&#62;</code>), each of which has a 
label (<code>&#60;a class="yuimenuitemlabel"&#62;</code>) that can 
contain plain text or HTML.
</p>
<p>
In addition to a label, each MenuItem instance can also contain a submenu.  To 
add a submenu via markup, simply nest the Menu markup inside the 
(<code>&#60;li class="yuimenuitem"&#62;</code>) element representing a MenuItem
instance.
</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="productsandservices" class="yuimenu">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="#communication">
                    Communication
                </a>

                <!-- A submenu -->

                <div id="communication" class="yuimenu">
                    <div class="bd">
                        <ul>

                        <!-- Items for the submenu go here -->

                        </ul>
                    </div>
                </div>                    
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="http://shopping.yahoo.com">
                    Shopping
                </a>

                <!-- A submenu -->

                <div id="shopping" class="yuimenu">
                    <div class="bd">                    
                        <ul>

                        <!-- Items for the submenu go here -->

                        </ul>
                    </div>
                </div>                    
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="http://entertainment.yahoo.com">
                    Entertainment
                </a>

                <!-- A submenu -->

                <div id="entertainment" class="yuimenu">
                    <div class="bd">                    
                        <ul>

                        <!-- Items for the submenu go here -->

                        </ul>                    
                    </div>
                </div>                                        
            
            </li>
            <li class="yuimenuitem">
            
                <a class="yuimenuitemlabel" href="#information">
                    Information
                </a>

                <!-- A submenu -->

                <div id="information" class="yuimenu">
                    <div class="bd">                                        
                        <ul>

                        <!-- Items for the submenu go here -->

                        </ul>                    
                    </div>
                </div>                                        
            
            </li>
        </ul>            
    </div>
</div>
</textarea>
<p>
To instantiate a Menu hierarchy based on existing HTML, pass the id of its corresponding root 
HTML element (in this case "productsandservices") to the Menu constructor  
(<code>YAHOO.widget.Menu</code>) then call the <code>render</code> method with no arguments.  
There is no need to instantiate and render submenus; as a convenience all submenus are automatically 
instantiated and rendered with the root Menu.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
    Instantiate the menu and corresponding submenus. The first argument passed 
    to the constructor is the id of the element in the DOM that represents 
    the menu; the second is an object literal representing a set of 
    configuration properties for the menu.
*/ 

var oMenu = new YAHOO.widget.Menu("productsandservices", { fixedcenter: true });


/*
     Call the "render" method with no arguments since the 
     markup for this Menu instance is already exists in the page.
*/

oMenu.render();
</textarea>