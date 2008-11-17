<!-- The Carousel container -->
<div id="container">
    <ol id="carousel">
        <li>
            <img src="http://farm1.static.flickr.com/135/342099636_7b05b7cde5_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/136/342099938_fdef3ca3b5_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/147/342099522_3827eaa929_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/143/342100011_ec4d338c71_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/161/342100080_0fe4f9ccb0_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/153/342100324_82589c0ebe_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/147/342100376_d0336252a7_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/156/342100472_b9bc985fa4_s.jpg">
        </li>
        <li>
            <img src="http://farm1.static.flickr.com/133/342100566_39dae4698f_s.jpg">
        </li>
    </ol>
</div>
<!-- The spotlight container -->
<div id="spotlight"></div>

<style type="text/css">
/* Style the spotlight container */
#spotlight {
	border: 1px solid #ccc;
	height: 180px;
	margin: 10px auto;
	padding: 1px;
	width: 240px;
}

.yui-carousel-element li {
	opacity: 0.6;
}

.yui-carousel-element .yui-carousel-item-selected {
	opacity: 1;
}
</style>
<script>
    (function () {
        var carousel;
                        
        // Get the image link from within its (parent) container.
        function getImage(parent) {
            var el = parent.firstChild;
                    
            while (el) { // walk through till as long as there's an element
                if (el.nodeName.toUpperCase() == "IMG") { // found an image
                    // flickr uses "_s" suffix for small, and "_m" for big
                    // images respectively
                    return el.src.replace(/_s\.jpg$/, "_m.jpg");
                }
                el = el.nextSibling;
            }
            
            return "";
        }
                
        YAHOO.util.Event.onDOMReady(function (ev) {
            var el, item,
                spotlight   = YAHOO.util.Dom.get("spotlight"),
                carousel    = new YAHOO.widget.Carousel("container");
                
            carousel.render(); // get ready for rendering the widget
            carousel.show();   // display the widget
                    
            // display the first selected item in the spotlight
            item = carousel.getElementForItem(carousel.get("selectedItem"));
            if (item) {
                spotlight.innerHTML = "<img src=\"" + getImage(item) + "\">";
            }
                       
            carousel.on("itemSelected", function (index) {
                // item has the reference to the Carousel's item
                item = carousel.getElementForItem(index);

                if (item) {
                    spotlight.innerHTML = "<img src=\""+getImage(item)+"\">";
                }
            });
        });
    })();
</script>
