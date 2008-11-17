<h2 class="first">Advanced Uploader Example with Transparent Rendering and Multiple File Upload</h2>

<p>In this example, we allow the user to select multiple images and videos, and upload them to the server, while tracking progress on the upload. The user can also choose how many files to upload simultaneously.
	
Because of security changes in Flash Player 10, the UI for invoking the "Browse" dialog has to be contained within the Flash player. In this example, the Flash player is rendered as a transparent overlay on top of a custom HTML-based UI. The Uploader running in the Flash player dispatches necessary mouse events to the DOM to make visual changes to the overlaid UI.</p>

<p>For starters, let's define the necessary UI styles. We will use regular text links as the UI, and switch their background color when the mouse hovers over them.</p>

<textarea name="code" class="html" cols="60" rows="5">
<style>
#selectFilesLink a, #uploadFilesLink a, #clearFilesLink a {
	color: #0000CC;
	background-color: #FFFFFF;
}

#selectFilesLink a:visited, #uploadFilesLink a:visited, #clearFilesLink a:visited {
	color: #0000CC;
	background-color: #FFFFFF;
}

#uploadFilesLink a:hover, #clearFilesLink a:hover {	
	color: #FFFFFF;
	background-color: #000000;
}
</style>
</textarea>

<p>Next, we'll place the UI elements on the page. Notice that the <code>selectFilesLink</code> div is overlaid by the <code>uploaderOverlay</code> div. <code>uploaderOverlay</code> is where we'll place the transparent Flash UI layer, that will dispatch various mouse events, based on which we will be able to change the appearance of the UI below.</p>

<textarea name="code" class="html" cols="60" rows="5">
<div id="uiElements" style="display:inline;">
		<div id="uploaderContainer">
			<div id="uploaderOverlay" style="position:absolute; z-index:2"></div>
			<div id="selectFilesLink" style="z-index:1"><a id="selectLink" href="#">Select Files</a></div>
		</div>
		<div id="uploadFilesLink"><a id="uploadLink" onClick="upload(); return false;" href="#">Upload Files</a></div>
</div>
</textarea>

<p>We also add a dropdown for setting the number of simultaneous uploads, and a container for the YUI DataTable that will display the list of uploaded files and upload progress.</p>

<textarea name="code" class="html" cols="60" rows="5">
<div id="simUploads"> Number of simultaneous uploads:
	<select id="simulUploads">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
	</select>
</div>

<div id="dataTableContainer"></div>
</textarea>

<p>Once the DOM is ready, we can size our container for the transparent UI to the link below it. The following code accomplishes that:</p>
<textarea name="code" class="js" cols="60" rows="5">
<script type="text/javascript">

YAHOO.util.Event.onDOMReady(function () { 
var uiLayer = YAHOO.util.Dom.getRegion('selectLink');
var overlay = YAHOO.util.Dom.get('uploaderOverlay');
YAHOO.util.Dom.setStyle(overlay, 'width', uiLayer.right-uiLayer.left + "px");
YAHOO.util.Dom.setStyle(overlay, 'height', uiLayer.bottom-uiLayer.top + "px");
});
</textarea>

<p>Now we can instantiate the uploader and place it in the container div.</p>
<textarea name="code" class="js" cols="60" rows="5">
	YAHOO.widget.Uploader.SWFURL = "<?php echo $assetsDirectory;?>uploader.swf";
	var uploader = new YAHOO.widget.Uploader( "uploaderOverlay" );
</textarea>

<p>We add handler functions to the uploader events. Note that methods on the uploader should not be called until the "contentReady" event has fired:</p>
<textarea name="code" class="js" cols="60" rows="5">	
	uploader.addListener('contentReady', handleContentReady);
	uploader.addListener('fileSelect', onFileSelect)
	uploader.addListener('uploadStart', onUploadStart);
	uploader.addListener('uploadProgress', onUploadProgress);
	uploader.addListener('uploadCancel', onUploadCancel);
	uploader.addListener('uploadComplete', onUploadComplete);
	uploader.addListener('uploadCompleteData', onUploadResponse);
	uploader.addListener('uploadError', onUploadError);
    uploader.addListener('rollOver', handleRollOver);
    uploader.addListener('rollOut', handleRollOut);
    uploader.addListener('click', handleClick);
	uploader.addListener('mouseDown', handleMouseDown);
	uploader.addListener('mouseUp', handleMouseUp);
</textarea>

<p>These handlers are called when the mouse rolls over and out of the uploader, respectively. They modify the appearance of the UI layer under the transparent Flash layer to match the behavior of the rest of the UI.</p>
<textarea name="code" class="js" cols="60" rows="5">
	function handleRollOver () {
		YAHOO.util.Dom.setStyle(YAHOO.util.Dom.get('selectLink'), 'color', "#FFFFFF");
		YAHOO.util.Dom.setStyle(YAHOO.util.Dom.get('selectLink'), 'background-color', "#000000");
	}

	function handleRollOut () {
		YAHOO.util.Dom.setStyle(YAHOO.util.Dom.get('selectLink'), 'color', "#0000CC");
		YAHOO.util.Dom.setStyle(YAHOO.util.Dom.get('selectLink'), 'background-color', "#FFFFFF");
	}
</textarea>

<p>These are placeholders for the rest of the mouse event handlers: mouseDown, mouseUp, and click.</p>
<textarea name="code" class="js" cols="60" rows="5">
	function handleMouseDown () {		
	}
	
	function handleMouseUp () {
	}
	
	function handleClick () {
	}
</textarea>
	
<p>When contentReady event fires, we can configure the uploader to our needs. Here, we allow transmission of log messages (sent both to YUI Logger and to Flash trace), allow the user to select multiple files, and specify file extension filters to include in the 'Browse' dialog.</p>
<textarea name="code" class="js" cols="60" rows="5">
	function handleContentReady () {
	    // Allows the uploader to send log messages to trace, as well as to YAHOO.log
		uploader.setAllowLogging(true);
		
		// Allows multiple file selection in "Browse" dialog.
		uploader.setAllowMultipleFiles(true);
		
		// New set of file filters.
		var ff = new Array({description:"Images", extensions:"*.jpg;*.png;*.gif"},
		                   {description:"Videos", extensions:"*.avi;*.mov;*.mpg"});
		                   
		// Apply new set of file filters to the uploader.
		uploader.setFileFilters(ff);
	}
</textarea>

<p>This function is called when files are selected and fileSelect event is fired. It uses a helper function, defined below, to render a DataTable displaying a list of files, their sizes, and space to display the upload progress.</p>
<textarea name="code" class="js" cols="60" rows="5">
var fileList;

function onFileSelect(event) {
	fileList = event.fileList;
	createDataTable(fileList);
}
</textarea>


<p>This function renders the data table based on the data provided in the file list. </p>
<textarea name="code" class="js" cols="60" rows="5">
function createDataTable(entries) {
  rowCounter = 0;
  this.fileIdHash = {};
  this.dataArr = [];
  for(var i in entries) {
     var entry = entries[i];
	 entry["progress"] = "<div style='height:5px;width:100px;background-color:#CCC;'></div>";
     dataArr.unshift(entry);
  }

  for (var j = 0; j < dataArr.length; j++) {
    this.fileIdHash[dataArr[j].id] = j;
  }

    var myColumnDefs = [
        {key:"name", label: "File Name", sortable:false},
     	{key:"size", label: "Size", sortable:false},
     	{key:"progress", label: "Upload progress", sortable:false}
    ];

  this.myDataSource = new YAHOO.util.DataSource(dataArr);
  this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
  this.myDataSource.responseSchema = {
      fields: ["id","name","created","modified","type", "size", "progress"]
  };

  this.singleSelectDataTable = new YAHOO.widget.DataTable("dataTableContainer",
           myColumnDefs, this.myDataSource, {
               caption:"Files To Upload",
               selectionMode:"single"
           });
}
</textarea>

<p>In this function, we actually initiate the upload. We set the number of files to upload simultaneously, using the value from the dropdown UI, and use the automatic queue management by calling uploadAll(). </p>
<textarea name="code" class="js" cols="60" rows="5">
	function upload() {
	if (fileList != null) {
		uploader.setSimUploadLimit(parseInt(document.getElementById("simulUploads").value));
		uploader.uploadAll("http://www.yswfblog.com/upload/upload_simple.php");
	}	
	}
</textarea>

<p>As uploadProgress events are fired, we render a progress bar in the corresponding row of the DataTable. </p>
<textarea name="code" class="js" cols="60" rows="5">
	function onUploadProgress(event) {
		rowNum = fileIdHash[event["id"]];
		prog = Math.round(100*(event["bytesLoaded"]/event["bytesTotal"]));
		progbar = "<div style='height:5px;width:100px;background-color:#CCC;'><div style='height:5px;background-color:#F00;width:" + prog + "px;'></div></div>";
		singleSelectDataTable.updateRow(rowNum, {name: dataArr[rowNum]["name"], size: dataArr[rowNum]["size"], progress: progbar});	
	}
</textarea>

<p>When an upload completes, we fully render the corresponding progress bar. </p>
<textarea name="code" class="js" cols="60" rows="5">
	function onUploadComplete(event) {
		rowNum = fileIdHash[event["id"]];
		prog = Math.round(100*(event["bytesLoaded"]/event["bytesTotal"]));
		progbar = "<div style='height:5px;width:100px;background-color:#CCC;'><div style='height:5px;background-color:#F00;width:100px;'></div></div>";
		singleSelectDataTable.updateRow(rowNum, {name: dataArr[rowNum]["name"], size: dataArr[rowNum]["size"], progress: progbar});
	}
</textarea>


<p>These are placeholders for handlers of various other events dispatched by the uploader.</p>
<textarea name="code" class="js" cols="60" rows="5">
	function onUploadStart(event) {	
	}

	function onUploadError(event) {
	}
	
	function onUploadCancel(event) {
	}
	
	function onUploadResponse(event) {
	}
</script>
</textarea>


