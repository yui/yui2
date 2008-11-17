<h2 class="first">Setting up the Editor's HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
<font face="Times New Roman">This is some more test text. This is some more <b>test <i>text</i></b></font>.
This is some more test text. This is some more test text. This is some more test text.
This is some more test text. This is some more test text. This is some more test text.
This is some more test text. 
&lt;/textarea&gt;
&lt;/form&gt;
</textarea>

<h2>Setting up the Editor's Javascript</h2>

<p>Once the <code>textarea</code> is on the page, then initialize the Editor like this:</p>

<textarea name="code" class="JScript">
(function() {
    //Setup some private variables
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

        //The Editor config
        var myConfig = {
            height: '300px',
            width: '600px',
            animate: true,
            dompath: true,
            focusAtStart: true
        };

    //Now let's load the Editor..
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);

})();
</textarea>

<h2>Creating the Toolbar Button and Menu</h2>

<p>Now we can create a button and add it to the Editor's Toolbar. First we subscribe to the Editor's <code>toolbarLoaded</code> Custom Event.
From inside that function we will setup a new button config object literal with the following properties:
<ul>
    <li>type: (push, menu, split, spin, select, color)</li>
    <li>label: The text string displayed on the button</li>
    <li>value: The value is also called the Command for the button.</li>
    <li>menu: A <code>YAHOO.widget.Overlay</code> instance to be used as a menu.</li>
</ul>
</p>
<p>Now add it to the Toolbar group called "insertitem" like this: <code>myEditor.toolbar.addButtonToGroup(imgConfig, 'insertitem');</code></p>

<textarea name="code" class="JScript">
    //Snipped from above
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);

    //Subscribe to the toolbarLoaded Custom event fired in render
    myEditor.on('toolbarLoaded', function() { 

        //Setup the config for the new "Insert Icon" button
        var imgConfig = {
            type: 'push', //Using a standard push button
            label: 'Insert Icon', //The name/title of the button
            value: 'inserticon', //The "Command" for the button            
            menu: function() {
                //Create the Overlay instance we are going to use for the menu            
                var menu = new YAHOO.widget.Overlay('inserticon', {
                    width: '165px',
                    height: '210px',
                    visible: false
                });
                var str = '';
                for (var a = 0; a &lt; 9; a++) {
                    for (var i = 1; i &lt; 9; i++) {
                        str += '<img src="<?php echo $assetsDirectory; ?>suit' + i + '.gif">';
                    }
                }
                //Setting the body of the container to our list of images.
                menu.setBody('<div id="iconMenu">' + str + '</div>');
                menu.beforeShowEvent.subscribe(function() {
                    //Set the context to the bottom left corner of the Insert Icon button  
                    menu.cfg.setProperty('context', [
                        myEditor.toolbar.getButtonByValue('inserticon').get('element'),
                        'tl',
                        'bl'
                    ]);
                });            
                menu.render(document.body);
                menu.element.style.visibility = 'hidden';
                //return the Overlay instance here                
                return menu;
            }() //This fires the function right now to return the Overlay Instance to the menu property..            
        };
        //Add the new button to the Toolbar Group called insertitem.        
        myEditor.toolbar.addButtonToGroup(imgConfig, 'insertitem');

        myEditor.toolbar.on('inserticonClick', function(ev) {
            var icon = '';
            this._focusWindow();
            if (ev.icon) {
                icon = ev.icon;
            }
            this.execCommand('inserthtml', '<img src="' + icon + '" border="0">');
        }, myEditor, true);
        
    });
    myEditor.render();
})();
</textarea>

<h2>Styling the Button</h2>

<p>There are 2 important states to style a button in the toolbar.</p>
<p>First is the default state, that can be accessed via this CSS rule: <code>.yui-toolbar-container .yui-toolbar-inserticon span.yui-toolbar-icon</code></p>
<p>Second is the selected state, that can be accessed via this CSS rule: <code>.yui-toolbar-container .yui-button-inserticon-selected span.yui-toolbar-icon</code></p>

<p><code>.yui-toolbar-container</code> is the class applied to the top-most container of the toolbar.</p>
<p><code>.yui-toolbar-icon</code> is an extra <code>SPAN</code> injected into the button for spriting an image.</p>
<p><code>.yui-toolbar-VALUE</code> is a dynamic class added to the button based on the <code>value</code> passed into the buttons config. It is used for specific styling of a button that may appear in several places on the page.</p>

<h2>The Style Rules to Create the Icon Button in This Example</h2>
<textarea name="code" class="CSS">
.yui-skin-sam .yui-toolbar-container .yui-toolbar-inserticon span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>suits_default.gif );
    background-position: 1px 0px;
}
.yui-skin-sam .yui-toolbar-container .yui-button-insertdate-selected span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>suits_active.gif );
    background-position: 1px 0px;
}
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea class="JScript" name="code">
(function() {
    var myConfig = {
        height: '300px',
        width: '600px',
        animate: true,
        dompath: true,
        focusAtStart: true
    };

    myEditor = new YAHOO.widget.Editor('editor', myConfig);

    YAHOO.util.Event.onAvailable('iconMenu', function() {
        YAHOO.util.Event.on('iconMenu', 'click', function(ev) {
            var tar = YAHOO.util.Event.getTarget(ev);
            if (tar.tagName.toLowerCase() == 'img') {
                var img = tar.getAttribute('src', 2);
                var _button = this.toolbar.getButtonByValue('inserticon');
                _button._menu.hide();
                this.toolbar.fireEvent('inserticonClick', { type: 'inserticonClick', icon: img });
            }
            YAHOO.util.Event.stopEvent(ev);
        }, myEditor, true);
    });


    myEditor.on('toolbarLoaded', function() { 
       
        var imgConfig = {
            type: 'push', label: 'Insert Icon', value: 'inserticon',
            menu: function() {
                var menu = new YAHOO.widget.Overlay('inserticon', {
                    width: '165px',
                    height: '210px',
                    visible: false
                });
                var str = '';
                for (var a = 0; a &lt; 9; a++) {
                    for (var i = 1; i &lt; 9; i++) {
                        str += '<a href="#"><img src="<?php echo $assetsDirectory; ?>suit' + i + '.gif" border="0"></a>';
                    }
                }
                menu.setBody('<div id="iconMenu">' + str + '</div>');
                menu.beforeShowEvent.subscribe(function() {
                    menu.cfg.setProperty('context', [
                        myEditor.toolbar.getButtonByValue('inserticon').get('element'),
                        'tl', 'bl'
                    ]);
                });            
                menu.render(document.body);
                menu.element.style.visibility = 'hidden';
                return menu;
            }()
        };
        myEditor.toolbar.addButtonToGroup(imgConfig, 'insertitem');

        myEditor.toolbar.on('inserticonClick', function(ev) {
            var icon = '';
            this._focusWindow();
            if (ev.icon) {
                icon = ev.icon;
            }
            this.execCommand('inserthtml', '<img src="' + icon + '" border="0">');
        }, myEditor, true);

    });
    myEditor.render();
})();
</textarea>

