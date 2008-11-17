<h2 class='first'>Basic Features of the ImageLoader Utility</h2>

<p>The ImageLoader Utility allows you to define the conditions under which images are loaded into the page. This example demonstrates attaching some simple triggers to images to establish this load control.</p>

<p>The HTML used for the image needs little to no modification. Simply make sure the image elements have <code>id</code> attributes, eliminate the <code>src</code> attribute from <code>&lt;img&gt;</code> elements, and optionally declare <code>&lt;img&gt;</code> elements as having hidden visibility.</p>

<textarea name='code' class='HTML' cols='60' rows='1'>
<div class='everything' id='everything'>
	<div class='topmain' id='topmain'></div>
	<div class='duo1' id='duo1'></div>
	<div class='duo2' id='duo2'></div>
	<div class='png' id='pngimg'></div>
	<div class='scroll'>
		<img id='scrollImg' style='visibility:hidden;' />
	</div>
</div>
</textarea>

<p>In JavaScript, create one ImageLoader group for each set of images and register each image with the group. Let's step through the groups one by one.</p>

<p>Starting with the architectural image at the top. We set a <code>mouseover</code> of the image itself as a trigger, and a 2-second time limit.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var mainGroup = new YAHOO.util.ImageLoader.group('topmain', 'mouseover', 2);
mainGroup.registerBgImage('topmain', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg');
</textarea>

<p>The second group has two images, and also two triggers. As triggers, we have a <code>mouseover</code> of the left image and a <code>click</code> on the right image.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var duoGroup = new YAHOO.util.ImageLoader.group('duo1', 'mouseover', 4);
duoGroup.registerBgImage('duo1', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
duoGroup.registerBgImage('duo2', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
duoGroup.addTrigger('duo2', 'click');
</textarea>

<p>The third group has no trigger; the only thing that will load the image is its time limit of 5 seconds.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var pngGroup = new YAHOO.util.ImageLoader.group(null, null, 5);
pngGroup.registerPngBgImage('pngimg', 'http://us.i1.yimg.com/us.yimg.com/i/us/nws/weather/gr/47s.png');
</textarea>

<p>In the last group, we have an image loaded by the window's <code>scroll</code> event. Since this is an <code>&lt;img&gt;</code> element, we omit the <code>src</code> attribute. Also, we'll set the visibility to hidden to avoid a broken image icon. (Our other option is to use a transparent image as the source, but the tradeoff is the load burden of this additional image.) Because we've hidden the image, we need to make sure it gets changed to visible via the <code>setVisible</code> flag. This group has no time limit, so the only thing that will load the image is its <code>scroll</code> trigger.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var scrollGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
var scrollImg = scrollGroup.registerSrcImage('scrollImg', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg');
scrollImg.setVisible = true;
</textarea>

