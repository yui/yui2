<h2 class="first">Making the Carousel Widget to dynamically load images on the fly</h2>
<p>
    Here we will use the <a href="http://developer.yahoo.com/yui/carousel/">YUI Carousel Control</a>'s <code>loadItems</code> event to dynamically
    load the images on the fly.</p>
<p>
    This example has the following dependencies:
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/assets/skins/sam/carousel.css">
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo/yahoo-dom-event.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/connection/connection-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/carousel-beta-min.js"></script></textarea>

<p>
    Initially we use <a href="http://developer.yahoo.com/yui/connection/">YUI Connection Manager</a> to load the initial set of items as
    soon as part of the DOM is visible.</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
  <ol id="carousel"></ol>
</div>
<!-- The spotlight container -->
<div id="spotlight"></div></textarea>

<p>
    We have a few simple CSS rules to set the dimensions for the Carousel items.
</p>

<textarea name="code" class="CSS" cols="60" rows="1">
.yui-carousel-element li {
    height: 75px;
    width: 75px;
}</textarea>

<p>
    We'll use Connection Manager to load a set of items into the
    Carousel as early as possible.
</p>


<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onAvailable("bd", function (args) {
  YAHOO.util.Connect.asyncRequest("GET", "php/getimages.php", {
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
});</textarea>

<p>
    Let us invoke the Carousel's constructor.    The YUI Carousel Control's
    constructor is passed with the total number of items so that it triggers
    the <code>loadItems</code> event if the items are not available.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onDOMReady(function (ev) {
    var i;
    
    myLogReader = new YAHOO.widget.LogReader();
    carousel    = new YAHOO.widget.Carousel("container", { numItems: 17 });
    carousel.render();
    carousel.show();
                
    if (items.length > 0) {
        for (i = 0; i < curpos; i++) {
            carousel.addItem(getImageTag(items[i]));
        }
        items = [];
    }
});</textarea>


<p>
    The YUI Carousel Control exposes a <code>loadItems</code> custom event that is fired
    when the Carousel needs more items to be loaded.  This becomes very handy
    for us since we can subscribe to it and add more items in to the Carousel
    widget when required.
</p>

<p>
    In our case, the server program returns an array (JSON) of images.  This is
    parsed in the Ajax callback and then the Carousel's <code>addItem()</code> is called for
    every image.
</p>


<textarea name="code" class="JScript" cols="60" rows="1">function getImageTag(img) {
    return "<img src=\"" + img + "\" height=\"75\" width=\"75\">";
}

function getImages() {
    YAHOO.util.Connect.asyncRequest("GET", "php/getimages.php?pos=" + curpos,
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
            },

            failure: function (o) {
                alert("Ajax request failed!");
            }
        });
}

carousel.on("beforeScroll", function (o) {
    var i, j,
        last  = o.last,
        num   = carousel.get("numVisible");

    if (!carousel.getItem(last+num)) {
        // more items available?
        getImages();
    }

    return true; // so that the event is not aborted
});</textarea>
