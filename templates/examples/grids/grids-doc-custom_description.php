<h2 class="first">Setting Page Width with YUI Grids</h2>

<p><a href="http://developer.yahoo.com/yui/grids/">YUI Grids CSS</a> offers three ways to control your page layout. These examples show how to control the page width, one of the three types of control. You can use Grids to just set page width or combine this feature with Grids' Preset Templates and/or Nesting Grids.</p>

<p>YUI Grids sets the page width on a <code>div</code> that wraps the entire page. By setting the <code>id</code> of the <code>div</code> you can choose your page width. Here are the included options:</p>

<ul>
	<li><code>div#doc</code> creates a 750px page width.</li>
	<li><code>div#doc2</code> creates a 950px page width.</li>
	<li><code>div#doc3</code> creates a 100% page width. (Note that the 100% page width also sets 10px of left and right margin so that content had a bit of breathing room between it and the browser chrome.)</li>
	<li><code>div#doc4</code> creates a 974px page width, and is a new addition to Grids in YUI version 2.3.0.</li>
</ul>

<p>In addition to the four pre-defined page widths listed above, we've made it easy to customize the page width too. Divide your desired pixel width by 13; the result is your width in ems for all non-IE browsers. Take the em width you just calculated and multiply it by .9759 to find the width in ems for IE.</p>

<p>This example showcases using <code>div#custom-doc</code> to create a 600px page width.</p>