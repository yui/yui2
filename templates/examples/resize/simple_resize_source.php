<style>
    #resize {
        border: 1px solid black;
        height: 100px;
        width: 200px;
        background-color: #fff;
    }
    #resize div.data {
        overflow: hidden;
        height: 100%;
        width: 100%;
    }
</style>

<div id="resize">
<div class="data">
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
</div>
</div>

<script>

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var resize = new YAHOO.util.Resize('resize');
})();
</script>
