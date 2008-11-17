<h2 class='first'>Using ImageLoader with TabView</h2>

<p>By nature, tabbed modules conceal some page content. If any of the non-default tabs contain images, then they are prime candidates for use with the ImageLoader Utility.</p>

<p>After we've created the TabView HTML and JavaScript object, we set up one ImageLoader group per tab. The first tab needs no delayed image loading because its image is immediately visible. Here is how we set up the second tab:</p>

<textarea name='code' class='JScript' cols='60' rows='1'>
var tabTwoImageGroup = new YAHOO.util.ImageLoader.group('tabTwoLabel', 'mouseover');
tabTwoImageGroup.registerSrcImage('imgTwo', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
tabTwoImageGroup.registerSrcImage('imgThree', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
tabTwoImageGroup.addTrigger('tabTwoLabel', 'focus');
</textarea>

<p>The third tab is set up exactly the same as the second, with <code>mouseover</code> and <code>focus</code> triggers.</p>

<h2 class='first'>Explanation of the Triggers</h2>

<p>Why do we use a <code>mouseover</code> of the tab label as the trigger? Well, it's the click of the tab label that will expose that tab's images to the user. But we don't want to wait until the images are exposed. We want to do better than that; we want to be as anticipatory as possible. We know that the user must mouse over the tab label before she can click it. And conversely, if the user mouses over the tab label, that's a good indication she is about to click it. These conditions make the label <code>mouseover</code> a fitting trigger.</p>

<p>What about the second trigger we add, the <code>focus</code> event? The reason for this is because there is another way the user can click the tab label and expose the images. Using TabView, we've made the labels <code>&lt;a&gt;</code> elements. Consequently the user could, using her keyboard, <code>tab</code> through the page and click <code>enter</code> on the tab label. This renders our <code>mouseover</code> trigger insufficient because it never fires. Thus we add the <code>focus</code> event trigger, which will fire as soon as the user <code>tabs</code> to the label.</p>

<p>We've omitted a time limit for this group because it's feasible that the user will never be interested in this tab and thus never expose the images. Depending on your use case, you may find a time limit appropriate.</p>

