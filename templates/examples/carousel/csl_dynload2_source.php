<!-- The Carousel container -->
<div id="container">
    <ol id="carousel"></ol>
</div>
<!-- The spotlight container -->
<div id="spotlight"></div>
<script>
    var carousel, curpos, items = [];

    function getImageTag(img) {
        return "<img src=\"" + img + "\" height=\"75\" width=\"75\">";
    }

    function getImages() {
        var carousel = this;
                
        YAHOO.util.Connect.asyncRequest("GET", "<?php echo $assetsDirectory; ?>php/getimages.php?pos="+curpos,
                {
                    success: function (o) {
                        var i = curpos,
                            j = 0,
                            r = eval('(' + o.responseText + ')');
                            
                        curpos += r.length;

                        while (i < curpos) {
                            if (r[j]) {
                                carousel.addItem(getImageTag(r[j]));
                            } else {
                                break;
                            }
                            i++;
                            j++;
                        }

                        carousel.set("selectedItem", carousel.get("firstVisible"));
                    },

                    failure: function (o) {
                        alert("Ajax request failed!");
                    }
        });
    }
                
    // Get the image link from within its (parent) container.
    function getLargeImage(parent) {
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
        var i, spotlight;
       
        carousel = new YAHOO.widget.Carousel("container", {
                numItems: 17
        });
        YAHOO.util.Connect.asyncRequest("GET", "<?php echo $assetsDirectory; ?>php/getimages.php", {
                success: function (o) {
                    var i, r = eval('(' + o.responseText + ')');
                    
                    curpos = r.length;

                    for (i = 0; i < curpos; i++) {
                        items.push(r[i]);
                    }

                    // check if the Carousel widget is available
                    if (typeof carousel != "undefined") {
                        for (i = 0; i < curpos; i++) {
                            // if so, shove the elements into it
                            carousel.addItem(getImageTag(items[i]));
                        }
                        carousel.set("selectedItem", 0);
                        items = [];
                    }
                },

                failure: function (o) {
                    alert("Ajax request failed!");
                }
        });
        spotlight   = YAHOO.util.Dom.get("spotlight"),
            
        carousel.render();
        carousel.show();
                
        carousel.on("loadItems", function (o) {
            // more items available?
            getImages.call(this);
        });
                
        carousel.on("itemSelected", function (index) {
            // item has the reference to the Carousel's item
            var el, item = carousel.getElementForItem(index);

            if (item) {
                spotlight.innerHTML = "<img src=\""+getLargeImage(item)+"\">";
            }
        });
    });

</script>
