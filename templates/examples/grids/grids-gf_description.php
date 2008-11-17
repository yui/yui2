<h2 class="first">Subdividing Regions with Nesting Grids and Special Nesting Grids</h2>

<p><a href="http://developer.yahoo.com/yui/grids/">YUI Grids CSS</a> offers three ways to control your page layout. Perhaps the most interesting and powerful aspect of YUI Grids is the ability to subdivide regions of the page into two or three columns of even (50%-50% or 33%-33%-33%) or uneven size (66%-33%, 25%-75%, etc).</p>

<p>Nested subdivisions of spaces are created by the interplay of "grids" and "units". The "grids" are a parent container that tells its children how to behave. The Standard Nesting Grid's parent container is <code>div.yui-g</code>, where "g" stands for "grid" or "grid holder." Within this holder are two units that take direction from their parent. They look like this: <code>div.yui-u</code>, where "u" stands for units. The units are indentical except that we need to add a class to distinguish the first one from any others.</p>

<h2>Here is the markup for a Standard Nesting Grid.</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<body>
<div class="yui-gf">
	<div class="yui-u first">
		<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
	</div>
	<div class="yui-u">
		<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
	</div>
</div>
</body>
</textarea>

<p>The above markup will create two units. The first takes up 1/4 of the available space; the second takes up 3/4 of the available space offered by their parent (minus a gutter between them).</p>

<h2>Available Nesting Grids</h2>

<p>We refer to these Nesting Grids as either Standard (meaning their two children split space evenly) or Special (meaning they share space unevenly, for example 66% and 33%, or that there are three children instead of two, for example 33%, 33%, 33%).</p>

<ul>
	<li><code>div.yui-g</code> - Standard Nesting Grid - tells two children to each take up half the available space.</li>
	<li><code>div.yui-gb</code> - Special Nesting Grid B - tells three children to each take up a third of the available space.</li>
	<li><code>div.yui-gc</code> - Special Nesting Grid C - tells the first of two children to take up 66% of the available space.</li>
	<li><code>div.yui-gd</code> - Special Nesting Grid D - tells the first of two children to take up 33% of the available space.</li>
	<li><code>div.yui-ge</code> - Special Nesting Grid E - tells the first of two children to take up 75% of the available space.</li>
	<li><code>div.yui-gf</code> - Special Nesting Grid F - tells the first of two children to take up 25% of the available space.</li>
</ul>

<p>This example showcases the Special Nesting Grid F (<code>div.yui-gf</code>).</p>