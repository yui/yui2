<h2 class="first">Using the Preset Templates in YUI Grids for common two-column layouts</h2>

<p><a href="http://developer.yahoo.com/yui/grids/">YUI Grids CSS</a> offers three ways to control your page layout. Preset Templates are two-column layouts of common dimensions; they have one narrow column with a fixed width and second column that takes up the remainder of the space offered by the overall page width. You can use these Preset Templates by themselves, or combine them with Grids' page width control and/or Nesting Grids.</p>

<p>Use any of Grids' six available Preset Templates by following these three simple steps. First, define two content blocks (.yui-b) in your markup document.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<body>
	<div>
		<div class="yui-b">One of the blocks. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
		<div class="yui-b">The other block. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
	</div>
</body>
</textarea>

<p>The second step is to choose one of the two blocks, or columns, to be the wider "main" column. Indicate your choice by wrapping that <code>div.yui-b</code> node in a <code>div#yui-main</code> node. Don't worry about source-order because your main block can come first or second in the source without impacting the final visual layout.</p>


<textarea name="code" class="HTML" cols="60" rows="1">
<body>
	<div>
		<div id="yui-main">
			<div class="yui-b">One of the blocks. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
		</div>
		<div class="yui-b">The other block. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
	</div>
</body>
</textarea>

<p>The final step is to decide which Preset Template you wish to use, and to apply the corresponding class to a containing <code>div</code>. In this case I've chosen the <code>.yui-t4</code> class, which makes the narrow non-main column 180px and on the right side.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<body>
	<div class="yui-t4">
		<div id="yui-main">
			<div class="yui-b">One of the blocks. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
		</div>
		<div class="yui-b">The other block. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
	</div>
</body>
</textarea>

<p>Here's a list of the available Preset Template classes:</p>

<ul>
	<li><code>div.yui-t1</code> creates a narrow column on the left with 160px width.</li>
	<li><code>div.yui-t2</code> creates a narrow column on the left with 180px width.</li>
	<li><code>div.yui-t3</code> creates a narrow column on the left with 300px width.</li>
	<li><code>div.yui-t4</code> creates a narrow column on the right with 180px width.</li>
	<li><code>div.yui-t5</code> creates a narrow column on the right with 240px width.</li>
	<li><code>div.yui-t6</code> creates a narrow column on the right with 300px width.</li>
</ul>

<p>Open this example in a new window to see the <code>div.yui-t4</code> which is a right-aligned narrow column of 180px.</p>