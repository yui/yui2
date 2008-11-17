<h2 class="first">Using the Carousel Widget for displaying items with images and text</h2>
<p>
    This example has the following dependencies:
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/assets/skins/sam/carousel.css">
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo/yahoo-dom-event.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/animation/animation-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta-min.js"></script>
<script src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/carousel/carousel-beta-min.js"></script></textarea>

<p>
    This example uses progressive enhancement, creating the control from an ordered list.
</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
  <ol id="carousel">
    <li class="intro">
      <a href="/experts/">
        <img width="202" height="162" border="0"
             alt="Health Expert Advice: Leading experts share advice, tips and personal experiences."
             src="http://l.yimg.com/us.yimg.com/i/us/he/gr/v4/carouselintro.png"/>
      </a>
    </li>
    <li class="item">
      <a title="View Author's Biography" class="authimg"
         href="/experts/skintype/bio/leslie-baumann/">
        <img width="125" height="154" border="0"
             alt="Leslie Baumann, M.D."
             src="http://d.yimg.com/origin1.lifestyles.yahoo.com/ls/he/blogs/carousel/LeslieBaumann_carousel.png"/>
      </a>
      <h3><a href="/experts/skintype/bio/leslie-baumann/">Leslie Baumann, M.D.</a></h3>
      <h4><a href="/experts/skintype/12135/skin-treatments-for-brides-to-be/">
      Skin Treatments for…</a></h4>
      <cite>Posted Thu 5.1.08</cite>
      <p class="all"><a href="/experts/skintype/">View All Posts &raquo;</a></p>
    </li>
    <li class="item">
      <a title="View Author's Biography" class="authimg"
         href="/experts/deepak/bio/deepak-chopra/">
        <img width="125" height="154" border="0"
             alt="Deepak Chopra, M.D."
             src="http://d.yimg.com/origin1.lifestyles.yahoo.com/ls/he/blogs/carousel/DeepakChopra_carousel.png"/>
      </a>
      <h3><a href="/experts/deepak/bio/deepak-chopra/">Deepak Chopra, M.D.</a></h3>
      <h4><a href="/experts/deepak/2689/how-you-think-about-illness-affects-your-recovery/">
      How You Think About Illness…</a></h4>
      <cite>Posted Thu 5.1.08</cite>
      <p class="all"><a href="/experts/deepak/">View All Posts &raquo;</a></p>
    </li>
    <li class="item">
      <a title="View Author's Biography" class="authimg"
         href="/experts/nutrition/bio/christine-mckinney-nutrition/">
        <img width="125" height="154" border="0" class="lz"
          alt="Christine McKinney, M.S., R.D., C.D.E."
          src="http://d.yimg.com/origin1.lifestyles.yahoo.com/ls/he/blogs/carousel/ChristineMcKinney_carousel.png"/>
      </a>
      <h3><a href="/experts/nutrition/bio/christine-mckinney-nutrition/">
      Christine McKinney, M.S., R.D., C.D.E.</a></h3>
      <h4><a href="/experts/nutrition/12067/fat-how-much-is-enough-of-a-good-thing/">
      Fat: How Much Is Enough of a…</a></h4>
      <cite>Posted Thu 5.1.08</cite>
      <p class="all"><a href="/experts/nutrition/">View All Posts &raquo;</a></p>
    </li>

	<snip>...</snip>
    
  </ol>
</div></textarea>

<p>
    Apart from setting the height of the Carousel, we have a few additional CSS rules for this example to position the text and the images within the Carousel items.
</p>


<textarea name="code" class="CSS" cols="60" rows="1">
.yui-carousel-element li {
    height: 158px;
}

#container {
    font-size: 13px;
}

#container a {
    text-decoration: none;
}

#container .intro {
    display: inline;
    float: left;
    margin: 0px 14px 0px 4px;
    width: 202px;
}

#container .item {
    display: inline;
    float: left;
    margin: 0 22px 0 12px;
    overflow: hidden;
    padding-right: 80px;
    width: 106px;
}

#container .item .authimg {
    bottom: 2px;
    margin-left: 61px;
    position: absolute;
    z-index: 1;
}

#container .item h3 {
    line-height: 85%;
    margin-top: 4px;
}

#container .item h3 a {
    font: 77% Arial, sans-serif;
    position: relative;
    text-transform: uppercase;
    z-index: 2;
}

#container .item h3 a:link {
    color:#35a235;
}

#container .item h4 {
    margin-top:5px;
}

#container .item h4 a {
    font: 100% Georgia, Times, serif;
    position: relative;
    z-index:2;
}

#container .item h4 a:link {
    color:#00639b;
}

#container .item cite {
    color: #888;
    display: block;
    font-size: 77%;
    line-height: normal;
    margin-bottom: 30px;
}

#container .item p.all {
    bottom: 25px;
    position: absolute;
    z-index: 2;
}

#container .item p.all a {
    font-weight: bold;
    font-size: 85%;
}</textarea>

<p>
    Since we have the elements in place, we can now invoke the Carousel's
    constructor to create the widget.  We'll pass an additional argument to the
    constructor to set the animation speed.  The <code>animation</code> configuration
    setting is an object that takes the animation speed (to scroll) in seconds and
    the animation effect.
</p>


<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.onDOMReady(function (ev) {
  var carousel = new YAHOO.widget.Carousel("container", {
    animation: { speed: 0.5 }
  });
  carousel.render(); // get ready for rendering the widget
  carousel.show();   // display the widget
}</textarea>

