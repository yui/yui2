<h2 class='first'>Loading Images Below the Fold</h2>

<p>You can easily have images load immediately if they are above the fold while delaying the load of images below the fold. This saves you from loading any images that the user can't see at page load because they're beyond her browser's viewable area.</p>

<p>All we need is one group, and we set its <code>foldConditional</code> flag to true. Any group with this flag set will, during the page's onload function, examine the page coordinates of all images registered to that group. Any images located above the fold will load immediately. The rest will wait for the group's triggers or time limit.</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var foldGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
foldGroup.registerSrcImage('img1', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg');
foldGroup.registerSrcImage('img2', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
foldGroup.registerSrcImage('img3', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
foldGroup.registerSrcImage('img4', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg');
foldGroup.registerSrcImage('img5', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg');
foldGroup.foldConditional = true;
foldGroup.addTrigger(window, 'resize');
</textarea>

<p>As is customary with a "foldConditional" group, we have defined two triggers for this group. Both of these alter the viewable area of the browser: the <code>scroll</code> and <code>resize</code> events of the window.</p>

<p>How do you know that the images below the fold are, in fact, not loaded immediately? There are several tools available to monitor the HTTP requests of your browser, including Firebug for Firefox and HTTPWatch for IE. With these tools you can monitor precisely when each image on a page is loaded.</p>

