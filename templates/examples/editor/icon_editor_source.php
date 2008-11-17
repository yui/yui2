<style>
    .yui-skin-sam .yui-toolbar-container .yui-toolbar-inserticon span.yui-toolbar-icon {
        background-image: url( <?php echo $assetsDirectory; ?>suits_default.gif );
        background-position: 1px 0px;
        left: 5px;
    }
    .yui-skin-sam .yui-toolbar-container .yui-button-insertdate-selected span.yui-toolbar-icon {
        background-image: url( <?php echo $assetsDirectory; ?>suits_active.gif );
        background-position: 1px 0px;
        left: 5px;
    }
    #inserticon {
        border:1px solid #808080;
        padding:5px;
        background-color: #F2F2F2;
    }
    #inserticon a {
        display: block;
        float: left;
        border: 1px solid #F2F2F2;
    }
    #inserticon a:hover {
        border: 1px solid #808080;
    }
</style>
<style>
.yui-toolbar-group-insertitem {
    *width: auto;
}
</style>

<form method="post" action="#" id="form1">
<textarea id="editor" name="editor" rows="20" cols="75">
This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>This is some more test text.<br>
</textarea>
</form>

<script>
(function() {
    var myConfig = {
        height: '300px',
        width: '600px',
        animate: true,
        dompath: true,
        focusAtStart: true
    };
    YAHOO.log('Editor created..', 'info', 'example');
    myEditor = new YAHOO.widget.Editor('editor', myConfig);

    YAHOO.util.Event.onAvailable('iconMenu', function() {
        YAHOO.log('onAvailable: (#iconMenu)', 'info', 'example');
        YAHOO.util.Event.on('iconMenu', 'click', function(ev) {
            var tar = YAHOO.util.Event.getTarget(ev);
            if (tar.tagName.toLowerCase() == 'img') {
                var img = tar.getAttribute('src', 2);
                YAHOO.log('Found an icon, fire inserticonClick Event', 'info', 'example');
                var _button = this.toolbar.getButtonByValue('inserticon');
                _button._menu.hide();
                this.toolbar.fireEvent('inserticonClick', { type: 'inserticonClick', icon: img });
            }
            YAHOO.util.Event.stopEvent(ev);
        }, myEditor, true);
    });


    myEditor.on('toolbarLoaded', function() { 
        YAHOO.log('Editor Toolbar Loaded..', 'info', 'example');
       
        var imgConfig = {
            type: 'push', label: 'Insert Icon', value: 'inserticon',
            menu: function() {
                var menu = new YAHOO.widget.Overlay('inserticon', { width: '165px', height: '210px', visible: false });
                var str = '';
                for (var a = 0; a < 9; a++) {
                    for (var i = 1; i < 9; i++) {
                        str += '<a href="#"><img src="<?php echo $assetsDirectory; ?>suit' + i + '.gif" border="0"></a>';
                    }
                }
                menu.setBody('<div id="iconMenu">' + str + '</div>');
                menu.beforeShowEvent.subscribe(function() {
                    menu.cfg.setProperty('context', [myEditor.toolbar.getButtonByValue('inserticon').get('element'), 'tl', 'bl']);
                });            
                menu.render(document.body);
                menu.element.style.visibility = 'hidden';
                return menu;
            }()
        };
        YAHOO.log('Create the (inserticon) Button', 'info', 'example');
        myEditor.toolbar.addButtonToGroup(imgConfig, 'insertitem');

        myEditor.toolbar.on('inserticonClick', function(ev) {
            YAHOO.log('inserticonClick Event Fired: ' + YAHOO.lang.dump(ev), 'info', 'example');
            var icon = '';
            this._focusWindow();
            if (ev.icon) {
                icon = ev.icon;
            }
            this.execCommand('inserthtml', '<img src="' + icon + '" border="0">');
            return false;
        }, myEditor, true);

    });
    myEditor.render();
})();
</script>

