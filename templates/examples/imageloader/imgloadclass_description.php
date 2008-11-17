<h2 class='first'>Using CSS Class Names to Load Images</h2>

<p>Look familiar? These are the same images and triggers as the Basic Features example (with the weather image omitted). The only difference is the manner in which we're loading the images on the back end.</p>

<p>Insead of registering specific image ids/URLs with a group, you can simply tag the group with a CSS class. The group will later use this class name to identify which DOM elements belong to the group. Each group should have one corresponding class. Each class must have a <code>background:none</code> CSS definition at the top of the page, as in this example:</p>

<textarea name='code' class='HTML' cols='60' rows='1'>
.yui-imgload-maingroup,
.yui-imgload-duogroup,
.yui-imgload-scrollgroup
	{ background:none !important; }
</textarea>

<p>Here is the HTML for the images:</p>

<textarea name='code' class='HTML' cols='60' rows='1'>
	<div class='topmain yui-imgload-maingroup' id='topmain' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg");'></div>
	<div class='duo1 yui-imgload-duogroup' id='duo1' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg");'></div>
	<div class='duo2 yui-imgload-duogroup' id='duo2' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg");'></div>
	<div class='scroll'>
		<img id='scrollImg' class='yui-imgload-scrollgroup' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg");' src='http://us.i1.yimg.com/us.yimg.com/i/us/tr/b/1px_trans.gif' width='40' height='40' />
	</div>
</textarea>

<p>A few things to note. First, the images have class names matching those in the style definitions above.</p>

<p>Second, the image URL is set in the <code>background-image</code> of the elements. The <code>background:none</code> defined earlier in the CSS will be removed by the ImageLoader Utility JavaScript when the images are eventually loaded.</p>

<p>Third, since the <code>&lt;img&gt;</code> element displays its images through the <code>background-image</code>, its size won't change when the image is loaded. Therefore the <code>width</code>/<code>height</code> needs to be set in the HTML. And since that gives the image a substantial size, the browsers would show a missing-image icon if the <code>src</code> attribute were not specified. Therefore we need to set one; a transparent one so that the background image will show through.</p>

<p>This brings up an important limitation with this approach: you cannot alter the natural size of the image. Because the image is displayed as a background image, the browser will not resize the image according to the <code>width</code>/<code>height</code> of the <code>&lt;img&gt;</code> element.</p>

<p>Now let's turn to the JavaScript. Since the image URLs are already specified in the HTML, we don't need them in the JS. All each group needs to know is the CSS class name that will identify the images.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var mainGroup = new YAHOO.util.ImageLoader.group('topmain', 'mouseover', 2);
mainGroup.className = 'yui-imgload-maingroup';

var duoGroup = new YAHOO.util.ImageLoader.group('duo1', 'mouseover', 4);
duoGroup.className = 'yui-imgload-duogroup';
duoGroup.addTrigger('duo2', 'click');

var scrollGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
scrollGroup.className = 'yui-imgload-scrollgroup';
</textarea>

<p>Note that you are free to combine this class-name approach with the other. The same group can have some images identified by class name and others by registering ids/URLs.</p>
