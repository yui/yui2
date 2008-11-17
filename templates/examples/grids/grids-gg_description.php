<h2 class="first">Subdividing Regions with Nesting Grids and Special Nesting Grids</h2>

<p><a href="http://developer.yahoo.com/yui/grids/">YUI Grids CSS</a> is the ability to subdivide regions of the page into two or three columns of even (50%-50% or 33%-33%-33%) or uneven size (66%-33%, 25%-75%, etc).</p>

<p>Nested subdivisions of spaces are created by the interplay of "grids" and "units". The "grids" are a parent container that tells its children how to behave. The Standard Nesting Grid's parent container is <code>div.yui-g</code>, where "g" stands for "grid" or "grid holder." Within this holder are two units that take direction from their parent. They look like this: <code>div.yui-u</code>, where "u" stands for units. The units are indentical except that we need to add a class to distinguish the first one from any others.</p>

<h2>Here is the markup for two Standard Nesting Grids nested within a parent Standard Nesting Grid</h2>

<p>This is an important example. First of all, note that all Nesting Grids can be nested within other Nesting Grids. If a Standard Nesting Grid (<code>div.yui-g</code>) creates two children, each of those children can be another Nesting Grid. Making each child of a Standard Grid another Standard Grid, we can easily create a four-column layout.</p>

<p>The second thing to note is that while Nesting Grids usually contain Units, they can also directly contain other Nesting Grids. Remember that the "first" node position still needs to me specified via a class value whether it's a grid or a unit.</p>

<p>The final thing to keep in mind in this example is that while we're showing a Standard inside a Standard, you can mix and match Special Nesting Grids in the same way.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<body>
<div class="yui-g">
	<div class="yui-g first">
		<div class="yui-u first">
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
		</div>
		<div class="yui-u">
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
		</div>
	</div>
	<div class="yui-g">
		<div class="yui-u first">
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
		</div>
		<div class="yui-u">
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
		</div>
	</div>
</div>
</body>
</textarea>

<p>The above markup will create two units within each of two units. The result is four columns of even width.</p>

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

<p>This example showcases the Standard Nesting Grid (<code>div.yui-g</code>) nested within another Standard Nesting Grid.</p>