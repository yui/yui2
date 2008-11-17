<?php
/*DataTable Module:*/
$modules["datatable"] = array(
							"name" => "DataTable Control",
							"type" => "widget",
							"description" => "<p>The DataTable Control provides a simple yet powerful API to display screen-reader accessible tabular data on a web page. Notable features include sortable columns, pagination, scrolling, row selection, resizeable columns, and inline editing.</p>", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);

/*DataTable Examples*/
$examples["dt_basic"] = array(
	name => "Basic Example",
	modules => array("datatable", "datasource"),
	description => "A demonstration of the DataTable's basic feature set.",
	sequence => array(0, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop", "datatable"),
	highlightSyntax => true
);

$examples["dt_enhanced"] = array(
	name => "Progressive Enhancement",
	modules => array("datatable", "datasource"),
	description => "A progressively enhanced DataTable based on existing markup.",
	sequence => array(1, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datatable"),
	highlightSyntax => true
);

$examples["dt_formatting"] = array(
	name => "Custom Cell Formatting",
	modules => array("datatable", "datasource"),
	description => "Custom formatting for DataTable cells.",
	sequence => array(2, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "require",
	requires => array("fonts","yuiloader"),/*all other dependencies loaded via Loader.*/
	highlightSyntax => true
);

$examples["dt_row_coloring"] = array(
	name => "Conditional row coloring",
	modules => array("datatable", "datasource"),
	description => "Coloring DataTable rows using custom column formatters.",
	sequence => array(3, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datatable"),
	highlightSyntax => true
);

$examples["dt_nestedheaders"] = array(
	name => "Nested Headers",
	modules => array("datatable", "datasource"),
	description => "Nested column headers.",
	sequence => array(4, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop", "datatable"),
	highlightSyntax => true
);

$examples["dt_xhrjson"] = array(
	name => "JSON Data Over XHR",
	modules => array("datatable", "datasource"),
	description => "The display of tabular JSON data retrieved via XHR.",
	sequence => array(5, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "json", "datatable"),
	highlightSyntax => true
);

$examples["dt_xhrpostxml"] = array(
	name => "XML Data Over XHR With POST",
	modules => array("datatable", "datasource"),
	description => "The display of XML data retrieved via an XHR POST request.",
	sequence => array(6, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "datatable"),
	highlightSyntax => true
);

$examples["dt_xhrtext"] = array(
	name => "Textual Data Over XHR",
	modules => array("datatable", "datasource"),
	description => "The display of textual data retrieved over XHR",
	sequence => array(7, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "datatable"),
	highlightSyntax => true
);

$examples["dt_xhrlocalxml"] = array(
	name => "Local XML Data",
	modules => array("datatable", "datasource"),
	description => "The display of XML data placed locally within the page by Connection Manager.",
	sequence => array(8, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "datatable"),
	highlightSyntax => true
);

$examples["dt_rowadddelete"] = array(
	name => "Adding and Deleting Rows",
	modules => array("datatable", "datasource"),
	description => "Adding and deleting rows with dynamic data.",
	sequence => array(9, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button", "dragdrop", "datatable"),
	highlightSyntax => true
);

$examples["dt_clientpagination"] = array(
	name => "Client-side Pagination",
	modules => array("datatable", "datasource", "paginator"),
	description => "The use of client-side pagination to break up a dataset into manageable, page-sized chunks.",
	sequence => array(10, 50, 5),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "json", "paginator", "datatable"),
	highlightSyntax => true
);

$examples["dt_clientsorting"] = array(
	name => "Client-side Sorting",
	modules => array("datatable", "datasource"),
	description => "Client-side Column sort using a custom function.",
	sequence => array(11, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datatable"),
	highlightSyntax => true
);

$examples["dt_dynamicdata"] = array(
	name => "Server-side Pagination and Sorting for Dynamic Data",
	modules => array("datatable", "datasource", "paginator"),
	description => "Server-side pagination and sorting for dynamic data.",
	sequence => array(12, 50, 6),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection", "json", "paginator", "datatable"),
	highlightSyntax => true
);

/*$examples["dt_server_pag_sort"] = array(
	name => "Server-side Pagination and Sorting, with Browser History Manager",
	modules => array("datatable", "datasource"),
	description => "Integration of server-side pagination and sorting, integrated with the Browser History Manager.",
	sequence => array(14, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datasource", "connection", "json", "history", "paginator", "datatable"),
	highlightSyntax => true
);*/

$examples["dt_fixedscroll"] = array(
	name => "XY-scrolling, Y-scrolling, and X-scrolling",
	modules => array("datatable", "datasource"),
	description => "Scrolling along x, y, or xy axes.",
	sequence => array(15, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button","datatable"),
	highlightSyntax => true
);

$examples["dt_rowselect"] = array(
	name => "Row Selection",
	modules => array("datatable", "datasource"),
	description => "Row selection models.",
	sequence => array(16, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datatable"),
	highlightSyntax => true
);

$examples["dt_cellselect"] = array(
	name => "Cell Selection",
	modules => array("datatable", "datasource"),
	description => "Cell selection models.",
	sequence => array(17, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("datatable"),
	highlightSyntax => true
);

$examples["dt_cellediting"] = array(
	name => "Inline Cell Editing",
	modules => array("datatable", "datasource", "calendar"),
	description => "Implementing inline cell editing.",
	sequence => array(18, 50, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("calendar", "datatable"),
	highlightSyntax => true
);

$examples["dt_contextmenu"] = array(
	name => "Context Menu Integration",
	modules => array("datatable", "datasource", "menu"),
	description => "Integration of DataTable with the the <a href='http://developer.yahoo.com/yui/menu'>Menu Control</a>'s ContextMenu feature.",
	sequence => array(19, 50, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("menu", "datatable"),
	highlightSyntax => true
);

$examples["dt_colshowhide"] = array(
	name => "Showing, Hiding, and Reordering Columns.",
	modules => array("datatable", "datasource", "container", "button"),
	description => "Showing, hiding, and reordering Columns.",
	sequence => array(20, 50, 50, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "require",
	requires => array("fonts","yuiloader"),/*Dependencies are all loaded via YUI Loader.*/
	highlightSyntax => true
);

$examples["dt_highlighting"] = array(
	name => "Highlighting Cells, Rows, or Columns",
	modules => array("datatable", "datasource"),
	description => "Enable highlighting on cells, rows, or columns",
	sequence => array(21, 50, 50, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("button", "container", "datatable"),
	highlightSyntax => true
);

$examples["dt_complex"] = array(
	name => "Complex Example of Multiple Features",
	modules => array("datatable", "datasource", "paginator"),
	description => "Several features combined into one DataTable.",
	sequence => array(22, 50, 7),
	logger => array("datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("dragdrop","animation","paginator","datatable"),
	highlightSyntax => true
);

$examples["dt_autocomplete"] = array(
	name => "Datatable with Autocomplete",
	modules => array("datatable", "datasource", 'autocomplete'),
	description => "Use an AutoComplete Control to filter Datatable results.",
	sequence => array(23, 50, 65),
	logger => array('autocomplete', "datasource", "datatable"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array('connection', 'json', 'autocomplete', "datatable"),
	highlightSyntax => true
);
$examples["dt_skinning"] = array(
	name => "Skinning Model",
	modules => array("datatable", "datasource"),
	description => "An explanation of DataTable's skinning model.",
	sequence => array(24, 50),
	logger => array("datasource", "datatable"),
	loggerInclude => "suppress",
	newWindow => "suppress",
	requires => array("dragdrop", "datatable"),
	highlightSyntax => true
);

?>
