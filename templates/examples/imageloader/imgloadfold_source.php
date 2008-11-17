<style>

.everything .cont { border:1px solid #888; width:100px; margin:25px 50px; }
.everything .right { margin-left:300px; }
#img1Cont, #img5Cont { height:75px; }
#img2Cont { height:67px; }
#img3Cont { height:53px; }
#img4Cont { height:72px; }

</style>


<div class='everything' id='everything'>
	<div class='cont' id='img1Cont'>
		<img id='img1' />
	</div>
	<div class='cont right' id='img2Cont'>
		<img id='img2' />
	</div>
	<div class='cont' id='img3Cont'>
		<img id='img3' />
	</div>
	<div class='cont right' id='img4Cont'>
		<img id='img4' />
	</div>
	<div class='cont' id='img5Cont'>
		<img id='img5' />
	</div>
</div>


<script>

var foldGroup = new YAHOO.util.ImageLoader.group(window, 'scroll');
foldGroup.registerSrcImage('img1', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg');
foldGroup.registerSrcImage('img2', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
foldGroup.registerSrcImage('img3', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
foldGroup.registerSrcImage('img4', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg');
foldGroup.registerSrcImage('img5', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg');
foldGroup.foldConditional = true;
//foldGroup.addTrigger(window, 'resize');
foldGroup.name = 'fold_group';

/*
 * This uncustomary wait before adding the resize trigger is done specifically to cater to IE for this example.
 * In IE and with the Logger enabled, IE fires an immediate resize event while rendering the Logger module, consequently loading all the images in the example.
 * This 200 ms delay allows IE to render the Logger without interference.
 * In your code, you would add the resize trigger in a straightforward fashion, as is documented in the example.
 */
YAHOO.util.Event.addListener(window, 'load', function() { setTimeout("foldGroup.addTrigger(window, 'resize')", 200); });

</script>
