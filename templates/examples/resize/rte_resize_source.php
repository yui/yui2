<style>
#editor_container .yui-resize-handle-br {
    height: 11px;
    width: 11px;
    background-position: -20px -60px;
    background-color: transparent;
}
</style>

<textarea id="editor">
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh,
pharetra at, adipiscing ullamcorper, rutrum ac, enim. Nullam pretium interdum metus.
Ut in neque. Vivamus ut lorem vitae turpis porttitor tempor. Nam consectetuer est quis lacus.
</textarea>


<script>

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        editor = null,
        resize = null;

    Event.onDOMReady(function() {
        editor = new YAHOO.widget.SimpleEditor('editor', {
            height: '300px',
            width: '522px',
            dompath: true,
            animate: true
        });
        editor.on('editorContentLoaded', function() {
            resize = new YAHOO.util.Resize(editor.get('element_cont').get('element'), {
                handles: ['br'],
                autoRatio: true,
                status: true,
                proxy: true,
                setSize: false //This is where the magic happens
            });
            resize.on('startResize', function() {
                this.hide();
                this.set('disabled', true);
            }, editor, true);
            resize.on('resize', function(args) {
                var h = args.height;
                var th = (this.toolbar.get('element').clientHeight + 2); //It has a 1px border..
                var dh = (this.dompath.clientHeight + 1); //It has a 1px top border..
                var newH = (h - th - dh);
                this.set('width', args.width + 'px');
                this.set('height', newH + 'px');
                this.set('disabled', false);
                this.show();
            }, editor, true);
        });
        editor.render();
    });

})();


</script>
