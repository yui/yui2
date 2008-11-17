<style>
    #resize {
        border: 1px solid black;
        height: 100px;
        width: 200px;
        overflow: hidden;
        background-color: #fff;
    }
</style>

<div id="resize">
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse justo nibh, pharetra at, adipiscing ullamcorper.</p>
</div>

<script>

(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;
    
    var resize = new YAHOO.util.Resize('resize');
})();
</script>
