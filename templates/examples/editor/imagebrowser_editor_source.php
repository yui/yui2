<style type="text/css" media="screen">
    #msgpost_container span.yui-toolbar-insertimage, #msgpost_container span.yui-toolbar-insertimage span.first-child {
        border-color: blue;
    }
</style>

<textarea id="msgpost">This is a test</textarea>

<script type="text/javascript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        win = null;

    var myEditor = new YAHOO.widget.Editor('msgpost', {
        height: '300px',
        width: '600px',
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
                win = window.open('<?php echo $assetsDirectory; ?>browser.php', 'IMAGE_BROWSER', 'left=20,top=20,width=500,height=500,toolbar=0,resizable=0,status=0');
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
</script>
