<h2 class="first">Setting up the Editor's HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
This is some more test text. <font face="Times New Roman">This is some more test text.
This is some more <b>test <i>text</i></b></font>.
This is some more test text. This is some more test text.
This is some more test text. This is some more test text. This is some more test text.
This is some more test text. 
&lt;/textarea&gt;
&lt;/form&gt;
</textarea>

<h2>Setting up the Editor's Javascript</h2>

<p>Once the <code>textarea</code> is on the page, then initialize the Editor like this:</p>

<textarea name="code" class="JScript">
//The Editor config
var myConfig = {
    height: '300px',
    width: '600px',
    animate: true,
    dompath: true
};

//Now let's load the Editor.
var myEditor = new YAHOO.widget.Editor('editor', myConfig);
</textarea>

<h2>Modifying the Insert Image Button</h2>

<p>To do this, we need start after the toolbar is loaded using the <code>toolbarLoaded</code> event.</p>
<p>Now we use the Editor's <code>_getSelectedElement</code> method to see if we have an image selected or not.</p>
<p>If we have an image selected, we don't do anything. But if we don't have one selected, we need to pop open the new window.</p>
<p><strong>Note</strong>: the return false. This will stop the event from continuing, the Editor will not attempt to add a blank image.</p>

<textarea name="code" class="JScript">
myEditor.on('toolbarLoaded', function() {
    //When the toolbar is loaded, add a listener to the insertimage button
    this.toolbar.on('insertimageClick', function() {
        //Get the selected element
        var _sel = this._getSelectedElement();
        //If the selected element is an image, do the normal thing so they can manipulate the image
        if (_sel && _sel.tagName && (_sel.tagName.toLowerCase() == 'img')) {
            //Do the normal thing here..
        } else {
            //They don't have a selected image, open the image browser window
            win = window.open('<?php echo $assetsDirectory; ?>browser.php', 'IMAGE_BROWSER',
                'left=20,top=20,width=500,height=500,toolbar=0,resizable=0,status=0');
            if (!win) {
                //Catch the popup blocker
                alert('Please disable your popup blocker!!');
            }
            //This is important.. Return false here to not fire the rest of the listeners
            return false;
        }
    }, this, true);
}, myEditor, true);
</textarea>

<h2>Inserting the image into the Editor from the popup window</h2>
<p>From the popup window, we gain access to the Editor using the <code>static</code> method <code>YAHOO.widget.EditorInfo.getEditorById()</code>. 
Calling it from <code>window.opener</code> will give us a usable reference to the Editor in the other browser window.</p>
<p>How you get the image to display and how you allow the end user to select an image is up to your implementation. Here we are simply applying a click listener to the images parent container and getting a reference to the image from the event.</p>
<p>Once we have a reference or a URL to the image we want to insert, we simply call the Editors <code>execCommand</code> for insert image and close the window.</p>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        myEditor = window.opener.YAHOO.widget.EditorInfo.getEditorById('msgpost');
        //Get a reference to the editor on the other page
    
    //Add a listener to the parent of the images
    Event.on('images', 'click', function(ev) {
        var tar = Event.getTarget(ev);
        //Check to see if we clicked on an image
        if (tar && tar.tagName && (tar.tagName.toLowerCase() == 'img')) {
            //Focus the editor's window
            myEditor._focusWindow();
            //Fire the execCommand for insertimage
            myEditor.execCommand('insertimage', tar.getAttribute('src', 2));
            //Close this window
            window.close();
        }
    });
    //Internet Explorer will throw this window to the back, this brings it to the front on load
    Event.on(window, 'load', function() {
        window.focus();
    });    
})();
</textarea>

<h2>Keeping them from editing the URL of the image</h2>
<p>This little piece of code will set the image url field in the Image Property Editor to disabled.</p>
<p>This will prevent the user from changing the images url.</p>
<textarea name="code" class="JScript">
myEditor.on('afterOpenWindow', function() {
    //When the window opens, disable the url of the image so they can't change it
    var url = Dom.get('insertimage_url');
    if (url) {
        url.disabled = true;
    }
}, myEditor, true);
</textarea>


<h2>Full Javascript Source for this window</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        win = null;

    var myEditor = new YAHOO.widget.Editor('msgpost', {
        height: '300px',
        width: '522px',
        dompath: true, //Turns on the bar at the bottom
        animate: true //Animates the opening, closing and moving of Editor windows
    });
    myEditor.on('toolbarLoaded', function() {
        //When the toolbar is loaded, add a listener to the insertimage button
        this.toolbar.on('insertimageClick', function() {
            //Get the selected element
            var _sel = this._getSelectedElement();
            //If the selected element is an image, do the normal thing so they can manipulate the image
            if (_sel && _sel.tagName && (_sel.tagName.toLowerCase() == 'img')) {
                //Do the normal thing here..
            } else {
                //They don't have a selected image, open the image browser window
                win = window.open('<?php echo $assetsDirectory; ?>browser.php', 'IMAGE_BROWSER', 
                    'left=20,top=20,width=500,height=500,toolbar=0,resizable=0,status=0');
                if (!win) {
                    //Catch the popup blocker
                    alert('Please disable your popup blocker!!');
                }
                //This is important.. Return false here to not fire the rest of the listeners
                return false;
            }
        }, this, true);
    }, myEditor, true);
    myEditor.on('afterOpenWindow', function() {
        //When the window opens, disable the url of the image so they can't change it
        var url = Dom.get('insertimage_url');
        if (url) {
            url.disabled = true;
        }
    }, myEditor, true);
    myEditor.render();

})();
</textarea>

<h2>Full Javascript Source for the Image Browser Window</h2>
<textarea name="code" class="JScript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        myEditor = window.opener.YAHOO.widget.EditorInfo.getEditorById('msgpost');
        //Get a reference to the editor on the other page
    
    //Add a listener to the parent of the images
    Event.on('images', 'click', function(ev) {
        var tar = Event.getTarget(ev);
        //Check to see if we clicked on an image
        if (tar && tar.tagName && (tar.tagName.toLowerCase() == 'img')) {
            //Focus the editor's window
            myEditor._focusWindow();
            //Fire the execCommand for insertimage
            myEditor.execCommand('insertimage', tar.getAttribute('src', 2));
            //Close this window
            window.close();
        }
    });
})();
</textarea>

