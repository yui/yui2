<html>

<!-- optional skin for border tabs --> 
<link rel='stylesheet' type='text/css' href='http://yui.yahooapis.com/2.2.2/build/tabview/assets/border_tabs.css'> 

<style type='text/css'>
#demo { width:350px; }
#demo .yui-content { padding:20px; } /* pad content container */
#demo img { margin-right:20px; }
#tabone, #tabtwo, #tabthree { height:80px; }
</style>


<div id='demo' class='yui-navset'>
	<ul class='yui-nav'>
		<li class='selected' id='tabOneLabel'><a href='#tabone'><em>Tab One</em></a></li>
		<li id='tabTwoLabel'><a href='#tabtwo'><em>Tab Two</em></a></li>
		<li id='tabThreeLabel'><a href='#tabthree'><em>Tab Three</em></a></li>
	</ul>
	<div class='yui-content'>
		<div id='tabone'>
			<img id='imgOne' src='http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg' />
		</div>
		<div id='tabtwo'>
			<img id='imgTwo' title='"imgTwo"' />
			<img id='imgThree' title='"imgThree"' />
		</div>
		<div id='tabthree'>
			<img id='imgFour' title='"imgFour"' />
			<img id='imgFive' title='"imgFive"' />
		</div>
	</div>
</div>



<script>
var tabView = new YAHOO.widget.TabView('demo');

var tabTwoImageGroup = new YAHOO.util.ImageLoader.group('tabTwoLabel', 'mouseover');
tabTwoImageGroup.registerSrcImage('imgTwo', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg');
tabTwoImageGroup.registerSrcImage('imgThree', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg');
tabTwoImageGroup.addTrigger('tabTwoLabel', 'focus');
tabTwoImageGroup.name = 'tab_two_group';

var tabThreeImageGroup = new YAHOO.util.ImageLoader.group('tabThreeLabel', 'mouseover');
tabThreeImageGroup.registerSrcImage('imgFour', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg');
tabThreeImageGroup.registerSrcImage('imgFive', 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg');
tabThreeImageGroup.addTrigger('tabThreeLabel', 'focus');
tabThreeImageGroup.name = 'tab_three_group';


</script>

</html>
