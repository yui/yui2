<h2 class="first">Creating a Menu from existing markup</h2>
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
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="basicmenu" class="yuimenu">
    <div class="bd">
        <ul class="first-of-type">
            <li class="yuimenuitem">
                <a class="yuimenuitemlabel" href="http://mail.yahoo.com">
                    Yahoo! Mail
                </a>
            </li>
            <li class="yuimenuitem">
                <a class="yuimenuitemlabel" href="http://addressbook.yahoo.com">
                    Yahoo! Address Book
                </a>
            </li>
            <li class="yuimenuitem">
                <a class="yuimenuitemlabel" href="http://calendar.yahoo.com">
                    Yahoo! Calendar
                </a>
            </li>
            <li class="yuimenuitem">
                <a class="yuimenuitemlabel" href="http://notepad.yahoo.com">
                    Yahoo! Notepad
                </a>
            </li>
        </ul>            
    </div>
</div>
</textarea>
<p>
To instantiate a Menu based on existing HTML, pass the id of its corresponding 
HTML element (in this case "basicmenu") to the Menu constructor  
(<code>YAHOO.widget.Menu</code>) then call the <code>render</code> method with 
no arguments.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
/*
     Instantiate a Menu:  The first argument passed to the 
     constructor is the id of the element in the page 
     representing the Menu; the second is an object literal 
     of configuration properties.
*/

var oMenu = new YAHOO.widget.Menu("basicmenu", { fixedcenter: true });


/*
     Call the "render" method with no arguments since the 
     markup for this Menu instance is already exists in the page.
*/

oMenu.render();
</textarea>