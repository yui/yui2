<h2 class="first">Using the Carousel Control to Spotlight the Selected Item</h2>
<p>
    Here we will use the <a href="http://developer.yahoo.com/yui/carousel/">YUI Carousel Control</a>'s <code>itemSelected</code> event to display
    the selected image.</p>
<p>
    This example has the following dependencies:
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/assets/skins/sam/carousel.css">
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo/yahoo-dom-event.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/carousel-beta-min.js"></script></textarea>

<p>
    This example uses progressive enhancement; the Carousel is created
    from an ordered list.
</p>


<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
  <ol>
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
</div></textarea>

<p>
    We will add a container element where we can display the spotlight image.
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="spotlight"></div></textarea>

<p>
    We'll have only one CSS rule to set the height for the Carousel items.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
.yui-carousel-element li {
    height: 75px;
    width: 75px;
}</textarea>

<p>
    Since we have the elements in place, we can invoke the Carousel's
    constructor to create the widget.  The Carousel's <code>selectedItem</code> property
    returns the index of the currently selected item.  So, using that property
    and the <code>getElementForItem()</code> API, we can display the image of the selected item when the
    Carousel is rendered.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onDOMReady(function (ev) {
  var carousel = new YAHOO.widget.Carousel("container");
  carousel.render(); // get ready for rendering the widget
  carousel.show();   // display the widget
  // display the first selected item in the spotlight
  spotlight.innerHTML = "&lt;img src=\"" +
    getImage(carousel.getElementForItem(carousel.get("selectedItem"))) + "\"&gt;";
}</textarea>
</textarea>
<p>
    Now, we can subscribe to the <code>selectedItem</code> event that the Carousel exposes.
    This event is triggered whenever an item is selected and it returns the
    index of the selected item.  With the index of the item, we can use the
    Carousel's <code>getElementForItem()</code> API to get the reference to the Carousel's item (an <code>li</code> element in
    our case).
</p>

<textarea name="code" class="JScript" cols="60" rows="1">carousel.on("itemSelected", function (index) {
  // item has the reference to the Carousel's item
  var item = carousel.getElementForItem(index);
});</textarea>


<p>
    Once the reference to the Carousel's item is obtained, it is
    straightforward to implement a function that extracts the image within it.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">// Get the image link from within its (parent) container.
function getImage(parent) {
  var el = parent.firstChild;
  
  while (el) {  // walk through till as long as there's an element
    if (el.nodeName.toUpperCase() == "IMG") { // found an image
      // flickr uses "_s" suffix for small, and "_m" for big images respectively
      return el.src.replace(/_s\.jpg$/, "_m.jpg");
    }
    el = el.nextSibling;
  }
  
  return "";</textarea>

