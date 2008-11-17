<h2 class="first">Using the Carousel Widget While Partially Revealing Previous and Next Items</h2>
<p>
    Here we will use the <a href="http://developer.yahoo.com/yui/">YUI Carousel Control</a>'s <code>revealAmount</code> configuration
    setting to reveal the previous and next items partially.</p>
<p>
    This example has the following dependencies:
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/assets/skins/sam/carousel.css">
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo/yahoo-dom-event.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/carousel-beta-min.js"></script></textarea>

<p>
    This example uses progressive enhancement; the Carousel is built from an existing ordered list.
</p>


<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
  <ol>
    <li>
      <img src="http://farm1.static.flickr.com/32/52955391_e7bed4c41f_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/28/52955478_0a35209bbb_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/26/52955086_df2cdece3d_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/24/52956234_809467624f_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/30/52954770_ef743b4afe_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/33/52953744_1c4a4ffaaf_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/26/52953668_33ea00edac_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/32/52953229_28f32b92a1_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/32/52953161_9e067407b2_m.jpg"
           height="180" width="240">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/32/52953399_047d25504b_m.jpg"
           height="180" width="240"> 
   </li>
  </ol>
</div></textarea>


<p>
    We have only one CSS rule to set the height for the Carousel items.
</p>


<textarea name="code" class="CSS" cols="60" rows="1">
.yui-carousel-element li {
    height: 180px;
}</textarea>


<p>
    Since we have the elements in place, we can invoke the Carousel's
    constructor with the <code>revealAmount</code> configuration to create the widget.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onDOMReady(function (ev) {
  var carousel = new YAHOO.widget.Carousel("container", {
    revealAmount: 25
  });
  carousel.render(); // get ready for rendering the widget
  carousel.show();   // display the widget
}</textarea>


