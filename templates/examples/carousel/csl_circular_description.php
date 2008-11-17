<h2 class="first">Making the Carousel Widget to display items in a loop</h2>
<p>
    Here we will use the <a href="http://developer.yahoo.com/yui/carousel/">YUI Carousel Control</a>'s <code>isCircular</code> configuration
    setting to make the Carousel into a loop.</p>
<p>
    This example has the following dependencies:
</p>


<textarea name="code" class="HTML" cols="60" rows="1"><link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion; ?>/build/carousel/assets/skins/sam/carousel.css">
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo/yahoo-dom-event.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/carousel-beta-min.js"></script></textarea>

<p>
    This example uses progressive enhancement to build the Carousel
    from an ordered list of elements.
</p>


<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
  <ol>
    <li>
      <img src="http://farm1.static.flickr.com/69/213130158_0d1aa23576_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/72/213128367_74b0a657c3_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/98/213129707_1f40c509fa_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/59/213129191_b958880a96_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/92/214077367_77ae970965_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/81/214076446_18fe6a6c91_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/93/214075781_0604edb894_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/40/214075243_ea66c4cb31_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/67/214074120_33933bf232_d.jpg"
           height="375" width="500">
    </li>
    <li>
      <img src="http://farm1.static.flickr.com/79/214073568_f16d1ffce7_d.jpg"
           height="375" width="500">
    </li>
  </ol>
</div></textarea>

<p>
    We'll have only one CSS rule to set the height for the Carousel items.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
.yui-carousel-element li {
    height: 375px;
}
</textarea>
<p>
    Since we have the elements in place, we can invoke the Carousel's
    constructor with the <code>isCircular</code> configuration to create the widget.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onDOMReady(function (ev) {
  var carousel = new YAHOO.widget.Carousel("container", {
    isCircular: true, numVisible: 1
  });
  carousel.render(); // get ready for rendering the widget
  carousel.show();   // display the widget
}</textarea>

