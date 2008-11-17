<style>

.everything { position:relative; height:420px; }
.everything div { border:1px solid #888; }
.topmain { position:absolute; top:10px; left:120px; height:75px; width:100px; }
.duo1 { position:absolute; top:130px; left:20px; height:67px; width:100px; }
.duo2 { position:absolute; top:130px; left:220px; height:53px; width:100px; }
.png { position:absolute; top:240px; left:140px; height:34px; width:61px; }
.scroll { position:absolute; top:320px; left:120px; height:72px; width:100px; }

</style>


<div class='everything' id='everything'>
	<div class='topmain' id='topmain' title='group 1; mouse over image; 2 sec limit'></div>
	<div class='duo1' id='duo1' title='group 2; mouse over left image, or click on right image; 4 sec limit'></div>
	<div class='duo2' id='duo2' title='group 2; mouse over left image, or click on right image; 4 sec limit'></div>
	<div class='png' id='pngimg' title='group 3; no trigger; 5 sec limit'></div>
	<div class='scroll' title='group 4; scroll; no time limit'>
		<img id='scrollImg' style='visibility:hidden;' />
	</div>
</div>


<script>

var mainGroup = new YAHOO.util.ImageLoader.group('topmain', 'mouseover', 2);
mainGroup.registerBgImage('topmain', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg');
mainGroup.name = 'group 1';

var duoGroup = new YAHOO.util.ImageLoader.group('duo1', 'mouseover', 4);
duoGroup.registerBgImage('duo1', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
duoGroup.registerBgImage('duo2', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
duoGroup.addTrigger('duo2', 'click');
duoGroup.name = 'group 2';

var pngGroup = new YAHOO.util.ImageLoader.group(null, null, 5);
pngGroup.registerPngBgImage('pngimg', 'http://us.i1.yimg.com/us.yimg.com/i/us/nws/weather/gr/47s.png');
pngGroup.name = 'group 3';

var scrollGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
var scrollImg = scrollGroup.registerSrcImage('scrollImg', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg');
scrollImg.setVisible = true;
scrollGroup.name = 'group 4';

</script>
