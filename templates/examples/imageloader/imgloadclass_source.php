<style>

.everything { position:relative; height:420px; }
.everything div { border:1px solid #888; }
.topmain { position:absolute; top:10px; left:120px; height:75px; width:100px; }
.duo1 { position:absolute; top:130px; left:20px; height:67px; width:100px; }
.duo2 { position:absolute; top:130px; left:220px; height:53px; width:100px; }
.scroll { position:absolute; top:320px; left:120px; height:72px; width:100px; }

.yui-imgload-maingroup,
.yui-imgload-duogroup,
.yui-imgload-scrollgroup
	{ background:none !important; }

</style>


<div class='everything' id='everything'>
	<div class='topmain yui-imgload-maingroup' id='topmain' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg");' title='group 1; mouseover image; 2 sec limit'></div>
	<div class='duo1 yui-imgload-duogroup' id='duo1' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg");' title='group 2; mouseover left image, or click on right image; 4 sec limit'></div>
	<div class='duo2 yui-imgload-duogroup' id='duo2' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg");' title='group 2; mouseover left image, or click on right image; 4 sec limit'></div>
	<div class='scroll' title='group 3; scroll; no time limit'>
		<img id='scrollImg' class='yui-imgload-scrollgroup' style='background-image:url("http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg");' src='http://us.i1.yimg.com/us.yimg.com/i/us/tr/b/1px_trans.gif' width='100' height='72' />
	</div>
</div>


<script>

var mainGroup = new YAHOO.util.ImageLoader.group('topmain', 'mouseover', 2);
mainGroup.className = 'yui-imgload-maingroup';
mainGroup.name = 'group 1';

var duoGroup = new YAHOO.util.ImageLoader.group('duo1', 'mouseover', 4);
duoGroup.className = 'yui-imgload-duogroup';
duoGroup.addTrigger('duo2', 'click');
duoGroup.name = 'group 2';

var scrollGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
scrollGroup.className = 'yui-imgload-scrollgroup';
scrollGroup.name = 'group 3';

</script>
