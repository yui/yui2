YAHOO.namespace("yui");

//This metadata maps module names used internally to the module
//type and to the formal module name used in referencing the 
//module in documentation.
YAHOO.yui.moduleMeta =  {
	"animation": {name: "Animation Utility", type: "utility"},
	"autocomplete": {name: "AutoComplete Control", type: "widget"},
	"base":{name: "Base CSS Package", type: "css"},
	"button":{name: "Button Control", type: "widget"},
	"calendar":{name:"Calendar Control", type: "widget"},
	"carousel":{name:"Carousel Control", type: "widget"},
	"charts":{name:"Charts Control", type: "widget"},
	"colorpicker":{name:"Color Picker Control", type: "widget"},
	"connection":{name:"Connection Manager", type: "utility"},
	"container":{name:"Container Family", type: "widget"},
	"containercore":{name:"Container Core (Module, Overlay)", type: "widget"},
	"cookie":{name:"Cookie Utility", type: "utility"},
	"datasource":{name:"DataSource Utility", type: "utility"},
	"datastore":{name:"DataStore Utility", type: "utility"},
	"datatable":{name:"DataTable Control", type: "widget"},
	"dom":{name:"Dom Collection", type: "core"},
	"dragdrop":{name:"Drag &amp; Drop Utility", type: "utility"},
	"editor":{name:"Rich Text Editor", type: "widget"},
	"element":{name:"Element Utility", type: "utility"},
	"event":{name:"Event Utility", type: "core"},
	"fonts":{name:"Fonts CSS Package", type: "css"},
	"get":{name:"Get Utility", type: "utility"},
	"grids":{name:"Grids CSS Package", type: "css"},
	"history":{name:"Browser History Manager", type: "utility"},
	"imagecropper":{name:"ImageCropper Control", type: "widget"},
	"imageloader":{name:"ImageLoader Utility", type: "utility"},
	"json":{name:"JSON Utility", type: "utility"},
	"layout":{name:"Layout Manager", type: "widget"},
	"logger":{name:"Logger Control", type: "tool"},
	"menu":{name:"Menu Control", type: "widget"},
	"paginator":{name:"Paginator", type: "utility"},
	"profiler":{name:"Profiler", type: "tool"},
	"profilerviewer":{name:"ProfilerViewer Control", type: "tool"},
	"reset":{name:"Reset CSS Package", type: "css"},
	"resize":{name:"Resize Utility", type: "utility"},
	"selector":{name:"Selector Utility", type: "utility"},
	"simpleeditor":{name:"Simple Editor", type: "widget"},
	"slider":{name:"Slider Control", type: "widget"},
	"tabview":{name:"TabView Control", type: "widget"},
	"treeview":{name:"TreeView Control", type: "widget"},
	"uploader":{name:"Uploader", type: "widget"},
	"yahoo":{name:"Yahoo Global Object", type: "core"},
	"yuiloader":{name:"YUI Loader Utility", type: "utility"},
	"yuitest":{name:"YUI Test Utility", type: "tool"},
	"reset-fonts":{name:"reset-fonts.css", type: "rollup"},
	"reset-fonts-grids":{name:"reset-fonts-grids.css", type: "rollup"},
	"utilities":{name:"utilities.js", type: "rollup"},
	"yahoo-dom-event":{name:"yahoo-dom-event.js", type: "rollup"},
	"yuiloader-dom-event":{name:"yuiloader-dom-event.js", type: "rollup"}
};

//Metadata about the various categories of YUI resources:
YAHOO.yui.moduleTypes = {
	"css": {name: "CSS Packages"},
	"core": {name: "JavaScript Core"},
	"utilities": {name: "JavaScript Utilities"},
	"widgets": {name: "UI Widgets (JavaScript and CSS)"},
	"tools": {name: "Developer Tools"},
	"rollup": {name: "Aggregate (Rollup) Files"}
};