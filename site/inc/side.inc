<?php

$galleryLink = "<h2><a name=\"gallery\"></a>Built Something Cool? Please Share It in the Applications Gallery!</h2>\n<p>We'd love to see what you've come up with!  To share your applications and find other examples of developer creativity, please visit the <a href=\"http://gallery.yahoo.com/\">Yahoo! Applications Gallery</a>. You'll be able to upload, download, rate, and review applications from all over the world, using all sorts of Yahoo! data and services.</p>\n";

if (!isset($docroot)) { $docroot=""; }
if (!isset($section)) { $section = ""; }

$nav[]=array('', '', 'Yahoo! UI Library', '');
$nav[]=array('yui','/yui/','Home', 'The Yahoo! User Interface Library (YUI)');
$nav[]=array('yuiblog','http://yuiblog.com','YUIBlog', 'The Yahoo! User Interface Blog');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/ydn-javascript/','YUI Discussion Forum', 'The Yahoo! Group YDN-JavaScript hosts the YUI community forum');
$nav[]=array('sourceforge','http://sourceforge.net/projects/yui/','YUI on Sourceforge', 'The YUI Library can be downloaded from SourceForge');
$nav[]=array('docs','/yui/docs/','API Documentation', 'Instantly searchable API documentation for the entire YUI library.');
$nav[]=array('examples','/yui/examples/','YUI Examples Gallery', 'Examples of every YUI utility and control in action');
$nav[]=array('community','/yui/community/','Community &amp; Contributions', 'Join other developers using and developing YUI.');
$nav[]=array('poweredby','/yui/poweredby/','Powered by YUI', 'YUI is used by Yahoo! and by hundreds of other sites, including many you know and love.');
$nav[]=array('theater','/yui/theater/','YUI Theater', 'Videos and podcasts from the YUI Team and from the Yahoo! frontend engineering community.');
$nav[]=array('license','/yui/license.html','YUI License', 'YUI is free and open, offered under a BSD license.');
$nav[]=array('yui3','/yui/3/','YUI 3.x Preview', 'Take an early look at the next generation of YUI.');

$nav[]=array('', '', 'YUI Articles', '');
$nav[]=array('faq','/yui/articles/faq/','YUI FAQ', 'Answers to Frequently Asked Questions about the YUI Library');
$nav[]=array('reportingbugs','/yui/articles/reportingbugs/','Bug Reports/Feature Requests', 'Reporting Bugs and Making Feature Requests for YUI Components');
$nav[]=array('customwidgets','http://yuiblog.com/blog/2008/06/24/buildingwidgets','Building Custom Widgets', 'Building your own custom widgets using the YUI infrastructure and tools.');
$nav[]=array('hosting','/yui/articles/hosting/','Configuration and Hosting', 'Configure your YUI implementation; serve YUI source files from Yahoo! -- free, fast, and simple');
$nav[]=array('gbs','/yui/articles/gbs/','Graded Browser Support', 'Yahoo!\'s philosophy of Graded Browser Support');
$nav[]=array('skinning','/yui/articles/skinning/','Skinning YUI', 'Modifying YUI\'s visual "skin" and building skins of your own');
$nav[]=array('security','/security/','Security Best Practices', 'Best practices for working with web services while protecting user privacy');
$nav[]=array('roadmap','/yui/articles/roadmap/','YUI Roadmap', 'Learn about plans for YUI\'s upcoming releases');

$nav[]=array('', '', 'YUI Components', '');
$nav[]=array('animation','/yui/animation/','Animation', 'The YUI Animation Utility');
$nav[]=array('autocomplete','/yui/autocomplete/','AutoComplete', 'The YUI AutoComplete Control');
$nav[]=array('history','/yui/history/','Browser History Manager', 'The YUI Browser History Manager');
$nav[]=array('button','/yui/button/','Button', 'The YUI Button Control');
$nav[]=array('calendar','/yui/calendar/','Calendar', 'The YUI Calendar Control');
$nav[]=array('carousel','/yui/carousel/','Carousel', 'The YUI Carousel Control');
$nav[]=array('charts','/yui/charts/','Charts (experimental)', 'The YUI Charts Control');
$nav[]=array('colorpicker','/yui/colorpicker/','Color Picker', 'The YUI Color Picker Control');
$nav[]=array('connection','/yui/connection/','Connection Manager', 'The YUI Connection Manager (AJAX)');
$nav[]=array('cookie','/yui/cookie/','Cookie', 'The YUI Cookie Utility');
$nav[]=array('container','/yui/container/','Container', 'The YUI Container Family (Module, Overlay, Tooltip, Panel, Dialog, SimpleDialog)');
$nav[]=array('datasource','/yui/datasource/','DataSource', 'The YUI DataSource Utility');
$nav[]=array('datatable','/yui/datatable/','DataTable', 'The YUI DataTable Control');
$nav[]=array('dom','/yui/dom/','Dom', 'The YUI Dom Collection');
$nav[]=array('dragdrop','/yui/dragdrop/','Drag &amp; Drop', 'The YUI Drag &amp; Drop Utility');
$nav[]=array('element','/yui/element/','Element', 'The YUI Element Utility');
$nav[]=array('event','/yui/event/','Event', 'The YUI Event Utility');
$nav[]=array('get','/yui/get/','Get', 'The YUI Get Utility');
$nav[]=array('imagecropper','/yui/imagecropper/','ImageCropper', 'The YUI ImageCropper Control');
$nav[]=array('imageloader','/yui/imageloader/','ImageLoader', 'The YUI ImageLoader Utility');
$nav[]=array('json','/yui/json/','JSON', 'The YUI JSON Utility');
$nav[]=array('layout','/yui/layout/','Layout Manager', 'The YUI Layout Manger');
$nav[]=array('logger','/yui/logger/','Logger', 'The YUI Logger Control');
$nav[]=array('menu','/yui/menu/','Menu', 'The YUI Menu Control');
$nav[]=array('paginator','/yui/paginator/','Paginator', 'The YUI Paginator');
$nav[]=array('profiler','/yui/profiler/','Profiler', 'The YUI Profiler');
$nav[]=array('profilerviewer','/yui/profilerviewer/','ProfilerViewer', 'The YUI ProfierViewer Control');
$nav[]=array('resize','/yui/resize/','Resize', 'The YUI Resize Utility');
$nav[]=array('editor','/yui/editor/','Rich Text Editor', 'The YUI Rich Text Editor');
$nav[]=array('selector','/yui/selector/','Selector', 'The YUI Selector Utility');
$nav[]=array('slider','/yui/slider/','Slider', 'The YUI Slider Control');
$nav[]=array('tabview','/yui/tabview/','TabView', 'The YUI TabView Control');
$nav[]=array('treeview','/yui/treeview/','TreeView', 'The YUI TreeView Control');
$nav[]=array('uploader','/yui/uploader/','Uploader (experimental)', 'The YUI Uploader Control');
$nav[]=array('yahoo','/yui/yahoo/','Yahoo Global Object', 'The YUI YAHOO Global Object');
$nav[]=array('yuiloader','/yui/yuiloader/','YUI Loader', 'The YUI Loader Utility');
$nav[]=array('yuitest','/yui/yuitest/','YUI Test', 'The YUI Test Utility');
$nav[]=array('reset','/yui/reset/','Reset CSS', 'YUI Reset CSS');
$nav[]=array('base','/yui/base/','Base CSS', 'YUI Base CSS');
$nav[]=array('fonts','/yui/fonts/','Fonts CSS', 'YUI Fonts CSS');
$nav[]=array('grids','/yui/grids/','Grids CSS', 'YUI Grids CSS');

$nav[]=array('', '', 'YUI Tools', '');
$nav[]=array('compressor','/yui/compressor/','YUI Compressor', 'YUI Compressor for CSS and JavaScript');
$nav[]=array('yuidoc','/yui/yuidoc/','YUI Doc', 'YUI Documentation Engine for JavaScript-based projects');

$nav[]=array('', '', 'Yahoo! Developer Network', '');
$nav[]=array('home','/','Home', 'What\'s hot?');
$nav[]=array('about','/about/','About Us', 'Who we are and what we do.');
$nav[]=array('blog','/blog/','Developer Network Blog', 'What we\'ve done lately.');
$nav[]=array('ydnfaq','/faq/','YDN FAQ', 'With answers!');
$nav[]=array('community','/community/','Support Communities', 'Where to go for help.');
$nav[]=array('gallery','http://gallery.yahoo.com/','Working Examples', 'gallery.yahoo.com');
/*
$nav[]=array('', '', 'Developer Central', '');
$nav[]=array('auth','/auth/','Browser Based Auth', 'Authentication, with a browser.');
$nav[]=array('ypatterns','/ypatterns/','Design Pattern Library', 'Sweet, tasty pattens!');
$nav[]=array('javascript','/javascript/','JavaScript Developer Center', 'Client-side magic.');
$nav[]=array('flash','/flash/','Flash Developer Center', 'Using Adobe Flash with Yahoo! Web Services and APIs');
$nav[]=array('dotnet','/dotnet/','.NET Developer Center', 'Integrated development from Microsoft.');
$nav[]=array('php','/php/','PHP Developer Center', 'Workhorse server language.');
$nav[]=array('python','/python/','Python Developer Center', 'Snakes on a page!');
$nav[]=array('ruby','/ruby/','Ruby Developer Center', 'How to get the news.');
$nav[]=array('download','/download/','Search SDK', 'Examples for Search');
$nav[]=array('security','/security/','Security Best Practices', '');
$nav[]=array('util','/util/','Utility Web Services', 'Handy tools!');

$nav[]=array('', '', 'Work With Us', '');
#$nav[]=array('auth','/auth/','Access Yahoo! User Data', 'Hooking Up');
$nav[]=array('appid','http://api.search.yahoo.com/webservices/register_application', 'Get an Application ID', 'You\'ll need this.');
# $nav[]=array('register','/register/', 'Make a Special Request', 'Need something out of the ordinary?');
$nav[]=array('usage','/usagePolicy/','Usage Policy', 'What you can do.');
$nav[]=array('terms','/terms/','Terms of Use', 'How you can do it.');

$nav[]=array('', '', 'Learn About ....', '');
$nav[]=array('answers','/answers/','Answers', 'Your pipeline to the great global brain.');
$nav[]=array('delicious','http://del.icio.us/help/api/','del.icio.us', 'Everybody\'s bookmarks.');
$nav[]=array('finance','/finance/','Finance', 'The color of money.');
$nav[]=array('flickr','/flickr/','Flickr&trade;', 'Share your snapshots.');
$nav[]=array('hotjobs','/hotjobs/','HotJobs', 'The perfect job is out there.');
$nav[]=array('local','/local/','Local', 'Find it in your neighborhood.');
$nav[]=array('maps','/maps/','Maps', 'Where ARE we, anyway?');
$nav[]=array('stores','/stores/','Merchant Solutions', 'Cha-ching!');
$nav[]=array('messenger','/messenger/','Messenger', 'Chat, webcam, and more.');
$nav[]=array('music','/music/','Music', 'This is HUGE.');
$nav[]=array('photos','/photos/','Photos', '');
$nav[]=array('rss','/rss/','RSS Feeds', 'How to get the news.');
$nav[]=array('search','/search/','Search', 'Find it fast!');
$nav[]=array('searchMktng','http://searchmarketing.yahoo.com/af/yws.php','Search Marketing', 'Monetize your site.');
$nav[]=array('shopping','/shopping/','Shopping', 'Find it and buy it!');
$nav[]=array('traffic','/traffic/','Traffic', 'Where\'s the backup?');
$nav[]=array('travel','/travel/','Travel', 'How to get there.');
$nav[]=array('upcoming','http://upcoming.org/services/api/','Upcoming.org', 'Who\'s doing what?');
$nav[]=array('weather','/weather/','Weather', 'Baby, it\'s cold outside....');
$nav[]=array('webjay','http://webjay.org/api/help','Webjay', 'Spinning the hits.');
$nav[]=array('widgets','http://pa.yahoo.com/*http://us.rd.yahoo.com/evt=37757/*http://widgets.yahoo.com/workshop/','Widgets', 'Cute little shiny toys!');
*/

?>

<div class="yui-b" id="tocWrapper">
<!-- TABLE OF CONTENTS -->
<div id="toc">
<ul>
<?php
for ($i=0; $i<count($nav); $i++)
{
	$sect = $nav[$i][0];
	$link = $nav[$i][1];
	$text = $nav[$i][2];

	$alt = $nav[$i][3];
	echo "<li class=\"";
	if ($sect && ($sect == $section)) {
		echo "selected ";
	}
	else
	{
		if ($sect) {
			echo "item";
		} else {
			echo "sect";
			if($i==0) {
				echo " first";
			}
		}
	}
	echo "\">";
	if ($link)
	{
		echo "<a title=\"$alt\" href=\"";
		if (substr($link, 0, 7) != 'http://') {
			echo "$docroot";
		}
		echo $link;
		echo "\">";
	}
	echo $text;
	if ($link) {
		if($sect=="theater") {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/vidcam12_1.gif'>";
		}
		if($sect=="groups") {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/post12_1.gif'>";
		}
		$aBeta = array("selector", "profilerviewer", "imagecropper", "element", "carousel");
		if(in_array($sect, $aBeta)) {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/not/beta_1.gif'>";
		}
		echo "</a>";
	}
	echo "</li>";
}
?>
</ul>
</div>
</div>
