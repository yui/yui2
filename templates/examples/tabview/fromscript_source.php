
<div id="container"></div>
<script type="text/javascript">
(function() {
    var tabView = new YAHOO.widget.TabView();

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'lorem',
        content: '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.</p>',
        active: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'ipsum',
        content: '<ul><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li><li><a href="#">Lorem ipsum dolor sit amet.</a></li></ul>'

    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'dolor',
        content: '<form action="#"><fieldset><legend>Lorem Ipsum</legend><label for="foo"> <input id="foo" name="foo"></label><input type="submit" value="submit"></fieldset></form>'

    }));
    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

    tabView.appendTo('container');
})();
</script>
