<style>
    .yui-skin-sam .yui-toolbar-container .yui-toolbar-insertdate span.yui-toolbar-icon {
        background-image: url( <?php echo $assetsDirectory; ?>calendar_default.gif );
        background-position: 1px 0px;
        left: 5px;
    }
    .yui-skin-sam .yui-toolbar-container .yui-button-insertdate-selected span.yui-toolbar-icon {
        background-image: url( <?php echo $assetsDirectory; ?>calendar_active.gif );
        background-position: 1px 0px;
        left: 5px;
    }
    
    #insertdate {
        background-color: transparent;
    }
</style>
<style>
.yui-toolbar-group-insertitem {
    *width: auto;
}
</style>

<form method="post" action="#" id="form1">
<textarea id="editor" name="editor" rows="20" cols="75">
This is some more test text. <font face="Times New Roman">This is some more test text. This is some more <b>test <i>text</i></b></font>. This is some more test text. This is some more test text. This is some more test text. This is some more test text. This is some more test text. This is some more test text. This is some more test text. 
</textarea>
</form>

<script>

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

</script>

