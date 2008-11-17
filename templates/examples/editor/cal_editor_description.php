<h2 class="first">Setting up the Editor's HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
This is some more test text. <font face="Times New Roman">This is some more test text. 
This is some more <b>test <i>text</i></b></font>.
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
        Event = YAHOO.util.Event,
        cal = null, //Reference to the calendar object we are about to create
        selectedDate = null; //Reference to the current selected date.

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
From inside that function we will set up a new button config object literal with the following properties:
<ul>
    <li>type: (push, menu, split, spin, select, color)</li>
    <li>label: The text string displayed on the button</li>
    <li>value: The value is also called the Command for the button.</li>
    <li>menu: A <code>YAHOO.widget.Overlay</code> instance to be used as a menu.</li>
</ul>
</p>
<p>Now add it to the Toolbar group called "insertitem" like this: <code>myEditor.toolbar.addButtonToGroup(dateConfig, 'insertitem');</code></p>

<textarea name="code" class="JScript">
    //Snipped from above
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);

    //Subscribe to the toolbarLoaded Custom event fired in render
    myEditor.on('toolbarLoaded', function() { 
       
        //Setup the config for the new "Insert Date" button
        var dateConfig = {
            type: 'push', //Using a standard push button
            label: 'Insert Date', //The name/title of the button
            value: 'insertdate', //The "Command" for the button
            menu: function() {
                //Create the Overlay instance we are going to use for the menu
                var menu = new YAHOO.widget.Overlay('insertdate', {
                    width: '210px',
                    height: '220px',
                    xy: [-9000,-9000],
                    visible: false
                });
                //Setting the body to the container that we wish to render the calendar into.
                menu.setBody('<div id="cal1Container"></div>');
                //Set the context to the bottom left corner of the Insert Date button
                menu.beforeShowEvent.subscribe(function() {
                    menu.cfg.setProperty('context', [
                        myEditor.toolbar.getButtonByValue('insertdate').get('element'),
                        'tl',
                        'bl'
                    ]);
                });
                //Show the Overlay and prep the calendar's selected date
                menu.showEvent.subscribe(function() {
                    cal.deselectAll();
                    Dom.removeClass(cal.cells, 'selected');
                    //selectedDate is populated in the onAvailable call later on..
                    if (selectedDate != null) {
                        cal.cfg.setProperty('selected', selectedDate);
                        cal.cfg.setProperty('pagedate', new Date(selectedDate), true);
                        selectedDate = null;
                    }
                    cal.render();
                });
                menu.render(document.body);
                menu.element.style.visibility = 'hidden';                
                //return the Overlay instance here
                return menu;
            }() //This fires the function right now to return the Overlay Instance to the menu property..
        };
        //Add the new button to the Toolbar Group called insertitem.
        myEditor.toolbar.addButtonToGroup(dateConfig, 'insertitem');
    });
    myEditor.render();
})();

</textarea>

<h2>Handling the Button's State on Node Change</h2>

<p>After we have created the new button and added it to the Toolbar, we need to listen for events to trigger our new button.</p>
<p>We can do that by listening to the <code>afterNodeChange</code> CustomEvent.</p>
<p>The <code>before/afterNodeChange</code> events are fired when something interesting happens inside the Editor. Clicks, Key Presses, etc.</p>
<p>From inside the <code>afterNodeChange</code> Event we can get access the the last element (or current element) that was affected. We get access to this element via: <code>obj._getSelectedElement()</code></p>
<p>Now that we have a reference we can use standard DOM manipulation to change the element and the Toolbar.</p>
<p>In this case, we are grabbing the current element and checking to see if it or its parent has a className of date.</p>
<p>If it does, then we are populating the var <code>selectedDate</code> with the <code>innerHTML</code> of the element.</p>
<p>We are also using this opportunity to select the "insertdate" button on the toolbar, so that it becomes active. We are doing this with the following command:<code>this.toolbar.selectButton(this.toolbar.getButtonByValue('insertdate'))</code></p>
<p><code>this.toolbar.getButtonByValue('insertdate')</code> this method will return a Button reference from the toolbar, that we can pass to <code>this.toolbar.selectButton()</code> and cause the button to be selected.</p>
<p>On the next <code>nodeChange</code> Event, our button will be disabled automatically and this handler will re-select it if it is needed.</p>

<textarea name="code" class="JScript">
    //Snipped from above
    myEditor.toolbar.addButtonToGroup(dateConfig, 'insertitem');


    //Listening to the afterNode Change Custom Event
    myEditor.on('afterNodeChange', function() {
        var el = this._getSelectedElement(); //Currently Selected Element
        //Does it or its parent have a class of 'date'
        if (Dom.hasClass(el, 'date') || Dom.hasClass(el.parentNode, 'date')) {
            //Set the button to selected
            this.toolbar.selectButton(this.toolbar.getButtonByValue('insertdate'));
            //Capture the innerHTML of the element and use it in the Menu's show Event.
            if (Dom.hasClass(el.parentNode, 'date')) {
                selectedDate = el.parentNode.innerHTML;
            } else {
                selectedDate = el.innerHTML;
            }
            var _button = this.toolbar.getButtonByValue('insertdate');
            _button._menu.hide();
        }
    }, myEditor, true);

    myEditor.toolbar.on('insertdateClick', function(ev) {
        var calDate = ' <span class="date">' + (ev.calDate.getMonth() + 1)
            + '/' + ev.calDate.getDate()
            + '/' + ev.calDate.getFullYear() + '</span> ';
        this.execCommand('inserthtml', calDate);
        var _button = this.toolbar.getButtonByValue('insertdate');
        _button._menu.hide();
    }, myEditor, true);
   
</textarea>

<h2>Rendering the Calendar and Handle Date Selection</h2>

<p>Now we add this code at the bottom to be activated when the Element <code>cal1Container</code> becomes available in the DOM.</p>
<p>Once that Element is active on the page, we can now build and render our Calendar control.</p>
<p>Notice, that we are subscribing to the Calendar's <code>selectEvent</code> to actually execute the insertdateClick event for the Editor.</p>
<p>From there, we get a button reference and call the menu's hide method to hide the Calendar.</p>
<textarea name="code" class="JScript">
    //Snipped from above
    myEditor.render();

    Event.onAvailable('cal1Container', function() {
        //Create the new Calendar instance
        cal = new YAHOO.widget.Calendar('cal1', 'cal1Container');
        //Setup the selectEvent
        cal.selectEvent.subscribe(function() {
            var calDate = cal.getSelectedDates()[0];
            //This line will fire the event "insertdateClick" that we subscribed to above..
            this.toolbar.fireEvent('insertdateClick', { type: 'insertdateClick', calDate: calDate });
        }, myEditor, true);
        //render the Calendar
        cal.render();
    });
</textarea>

<h2>Styling the Button</h2>

<p>There are 2 important states to style a button in the toolbar.</p>
<p>First is the default state, that can be accessed via this CSS rule: <code>.yui-skin-sam .yui-toolbar-container .yui-toolbar-insertdate span.yui-toolbar-icon</code></p>
<p>Second is the selected state, that can be accessed via this CSS rule: <code>.yui-skin-sam .yui-toolbar-container .yui-button-insertdate-selected span.yui-toolbar-icon</code></p>

<p><code>.yui-toolbar-container</code> is the class applied to the top-most container of the toolbar.</p>
<p><code>.yui-toolbar-icon</code> is an extra <code>SPAN</code> injected into the button for spriting an image.</p>
<p><code>.yui-toolbar-VALUE</code> is a dynamic class added to the button based on the <code>value</code> passed into the buttons config. It is used for specific styling of a button that may appear in several places on the page.</p>

<h2>The Style Rules to Create the Calendar Button in this Example</h2>
<textarea name="code" class="CSS">
.yui-skin-sam .yui-toolbar-container .yui-toolbar-insertdate span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>calendar_default.gif );
    background-position: 1px 0px;
}
.yui-skin-sam .yui-toolbar-container .yui-button-insertdate-selected span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>calendar_active.gif );
    background-position: 1px 0px;
}
</textarea>

<h2>Full Example Javascript Source</h2>

<textarea class="JScript" name="code">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        cal = null,
        selectedDate = null;

        var myConfig = {
            height: '300px',
            width: '600px',
            animate: true,
            dompath: true,
            focusAtStart: true
        };

    YAHOO.log('Creating Editor', 'info', 'example');
    var myEditor = new YAHOO.widget.Editor('editor', myConfig);

    myEditor.on('toolbarLoaded', function() { 
        YAHOO.log('Editor Toolbar loaded', 'info', 'example');
       
        var dateConfig = {
            type: 'push', label: 'Insert Date', value: 'insertdate',
            menu: function() {
                var menu = new YAHOO.widget.Overlay('insertdate', {
                    width: '210px',
                    height: '220px',
                    xy: [-9000,-9000],
                    visible: false
                });
                menu.setBody('<div id="cal1Container"></div>');
                menu.beforeShowEvent.subscribe(function() {
                    menu.cfg.setProperty('context', [
                        myEditor.toolbar.getButtonByValue('insertdate').get('element'),
                        'tl', 'bl'
                        ]);
                });
                menu.showEvent.subscribe(function() {
                    cal.deselectAll();
                    Dom.removeClass(cal.cells, 'selected');
                    if (selectedDate != null) {
                        cal.cfg.setProperty('selected', selectedDate);
                        cal.cfg.setProperty('pagedate', new Date(selectedDate), true);
                        selectedDate = null;
                    }
                    cal.render();
                });
                menu.render(document.body);
                menu.element.style.visibility = 'hidden';                
                return menu;
            }()
        };

        YAHOO.log('Adding new button (insertdate) to toolbar', 'info', 'example');
        myEditor.toolbar.addButtonToGroup(dateConfig, 'insertitem');

        myEditor.on('afterNodeChange', function() {
            var el = this._getSelectedElement();
            if (Dom.hasClass(el, 'date') || Dom.hasClass(el.parentNode, 'date')) {
                YAHOO.log('We found an element with the class of (date) select button', 'info', 'example');
                this.toolbar.selectButton(this.toolbar.getButtonByValue('insertdate'));
                if (Dom.hasClass(el.parentNode, 'date')) {
                    selectedDate = el.parentNode.innerHTML;
                } else {
                    selectedDate = el.innerHTML;
                }
            }
            var _button = this.toolbar.getButtonByValue('insertdate');
            _button._menu.hide();
        }, myEditor, true);

        myEditor.toolbar.on('insertdateClick', function(ev) {
            YAHOO.log('insertdateClick: ' + YAHOO.lang.dump(ev), 'info', 'example');
            var calDate = ' <span class="date">' + (ev.calDate.getMonth() + 1)
                + '/' + ev.calDate.getDate()
                + '/' + ev.calDate.getFullYear() + '</span>&nbsp;';
            this.execCommand('inserthtml', calDate);
            var _button = this.toolbar.getButtonByValue('insertdate');
            _button._menu.hide();
        }, myEditor, true);
    });
    myEditor.render();

    Event.onAvailable('cal1Container', function() {
        YAHOO.log('Found (#cal1Container) - render the calendar', 'info', 'example');
        cal = new YAHOO.widget.Calendar('cal1', 'cal1Container');
        cal.selectEvent.subscribe(function() {
            var calDate = cal.getSelectedDates()[0];
            YAHOO.log('Calendar selectEvent: (' + calDate + ')', 'info', 'example');
            this.toolbar.fireEvent('insertdateClick', { type: 'insertdateClick', calDate: calDate });
        }, myEditor, true);
        cal.render();
    });

})();

</textarea>
