
<div id="container"><h2 class="first">Browser News</h2></div>
<script type="text/javascript">
(function() {
    var tabView = new YAHOO.widget.TabView();
    
    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Opera',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=opera+browser',
        cacheData: true,
        active: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Firefox',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=firefox+browser',
        cacheData: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Explorer',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=microsoft+explorer+browser',
        cacheData: true
    }));

    tabView.addTab( new YAHOO.widget.Tab({
        label: 'Safari',
        dataSrc: '<?php echo $assetsDirectory; ?>news.php?query=apple+safari+browser',
        cacheData: true
    }));

    YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

    tabView.appendTo('container');
})();
</script>
