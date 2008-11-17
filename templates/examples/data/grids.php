<?php

/*YUI Grids CSS:*/
$modules["grids"] = array(
							"name" => "Grids CSS",
							"type" => "css",
							"description" => "<p>The foundational YUI Grids CSS makes it easy to create page layouts with wireframes completely driven by CSS. Grids has three components that you can use individually or in any combination. The first part lets you set the overall page width. The second part, Preset Templates, lets you define the primary and secondary block of content (without regard to source order) and choose one of several common fixed widths for the secondary block. The third part, Nesting Grids, provides the ability to nest subdivided regions of one to four columns within any part of the page. The examples below highlight each of these capabilities.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => "css.pdf"
						);	


$examples["grids-doc"] = array(
  name => "Page Width = 750px",
  modules => array("grids"),
  description => "Use Grids' preset page width of 750px.",
  sequence => array(2),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-doc2"] = array(
  name => "Page Width = 950px",
  modules => array("grids"),
  description => "Use Grids' preset page width of 950px.",
  sequence => array(3),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-doc3"] = array(
  name => "Page Width = 100%",
  modules => array("grids"),
  description => "Use Grids' preset page width of 100%.",
  sequence => array(5),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-doc4"] = array(
  name => "Page Width = 974px",
  modules => array("grids"),
  description => "Use Grids' preset page width of 974px.",
  sequence => array(4),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-doc-custom"] = array(
  name => "Custom Page Width",
  modules => array("grids"),
  description => "Specify an arbitrary page width.",
  sequence => array(6),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-t1"] = array(
  name => "Preset Template 1, 160px left",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 160px narrow column on the left side.",
  sequence => array(7),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);

$examples["grids-t2"] = array(
  name => "Preset Template 2, 180px left",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 180px narrow column on the left side.",
  sequence => array(8),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-t3"] = array(
  name => "Preset Template 3, 300px left",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 300px narrow column on the left side.",
  sequence => array(9),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-t4"] = array(
  name => "Preset Template 4, 180px right",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 180px narrow column on the right side.",
  sequence => array(10),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-t5"] = array(
  name => "Preset Template 5, 240px right",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 240px narrow column on the right side.",
  sequence => array(11),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-t6"] = array(
  name => "Preset Template 6, 300px right",
  modules => array("grids"),
  description => "Use Grids' preset templates to put a 300px narrow column on the right side.",
  sequence => array(12),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-g"] = array(
  name => "Standard Nesting Grid (1/2 - 1/2)",
  modules => array("grids"),
  description => "The buiding block of nested grids is the Standard Nesting Grid which creates to evenly-wide child columns. Learn how in this example.",
  sequence => array(13),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-gb"] = array(
  name => "Special Nesting Grid \"B\" (1/3, 1/3, 1/3)",
  modules => array("grids"),
  description => "What you need an odd number of columns, or unevenly divided space, use Special Nesting Grids instead of Standard Nesting Grids.",
  sequence => array(15),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-gc"] = array(
  name => "Special Nesting Grid \"C\" (2/3, 1/3)",
  modules => array("grids"),
  description => "Create two uneven columns with this Special Nesting Grid.",
  sequence => array(16),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-gd"] = array(
  name => "Special Nesting Grid \"D\" (1/3, 2/3)",
  modules => array("grids"),
  description => "Create two uneven columns with this Special Nesting Grid.",
  sequence => array(17),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-ge"] = array(
  name => "Special Nesting Grid \"E\" (3/4, 1/4)",
  modules => array("grids"),
  description => "Create two uneven columns with this Special Nesting Grid.",
  sequence => array(18),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-gf"] = array(
  name => "Special Nesting Grid \"F\" (1/4, 3/4)",
  modules => array("grids"),
  description => "Create two uneven columns with this Special Nesting Grid.",
  sequence => array(19),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


$examples["grids-gg"] = array(
  name => "Nested Standard Nesting Grids (1/4 - 1/4 - 1/4 - 1/4)",
  modules => array("grids"),
  description => "Create more than 2 (or 3) columns by nesting grids. This example shows a four-column even-width layout achieved by nesting Standard Nesting Grids inside of Standard Nesting Grids.",
  sequence => array(20),
  loggerInclude => "suppress", 
  newWindow => "require",
  requires => array("reset", "fonts", "grids"),
  highlightSyntax => true
);


?>