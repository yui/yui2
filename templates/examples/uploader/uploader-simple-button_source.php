<style type="text/css">
	.uploadButton a, .clearButton a {
		display:block;
		width:100px;
		height:40px;
		text-decoration: none;
		margin-left:5px;
	}
	
	.uploadButton a {
		background: url("<?php echo $assetsDirectory;?>uploadFileButton.png") 0 0 no-repeat;
	}
	
	.clearButton a {
		background: url("<?php echo $assetsDirectory;?>clearListButton.png") 0 0 no-repeat;
	}
	
    .uploadButton a:visited, .clearButton a:visited {
		background-position: 0 0;
	}
	
    .uploadButton a:hover, .clearButton a:hover {	
		background-position: 0 -40px;
	}
	
    .uploadButton a:active, .clearButton a:active {
		background-position: 0 -80px;
	}
</style>

<div>
	<div id="fileProgress" style="border: black 1px solid; width:300px; height:40px;float:left">
		<div id="fileName" style="text-align:center; margin:5px; font-size:15px; width:290px; height:25px; overflow:hidden"></div>
		<div id="progressBar" style="width:300px;height:5px;background-color:#CCCCCC"></div>
	</div>
<div id="uploaderUI" style="width:100px;height:40px;margin-left:5px;float:left"></div>
<div class="uploadButton" style="float:left"><a class="rolloverButton" href="#" onClick="upload(); return false;"></a></div>
<div class="clearButton" style="float:left"><a class="rolloverButton" href="#" onClick="handleClearFiles(); return false;"></a></div>
</div>


<script type="text/javascript">
    
    // Instantiate the uploader and write it to its placeholder div.
	
	YAHOO.widget.Uploader.SWFURL = "<?php echo $assetsDirectory;?>uploader.swf";
	
	var uploader = new YAHOO.widget.Uploader( "uploaderUI", "<?php echo $assetsDirectory;?>selectFileButton.png" );
	
	// Add event listeners to various events on the uploader.
	// Methods on the uploader should only be called once the 
	// contentReady event has fired.
	
	uploader.addListener('contentReady', handleContentReady);
	uploader.addListener('fileSelect',onFileSelect)
	uploader.addListener('uploadStart',onUploadStart);
	uploader.addListener('uploadProgress',onUploadProgress);
	uploader.addListener('uploadCancel',onUploadCancel);
	uploader.addListener('uploadComplete',onUploadComplete);
	uploader.addListener('uploadCompleteData',onUploadResponse);
	uploader.addListener('uploadError', onUploadError);
    	
    // Variable for holding the selected file ID.
	var fileID;
	
	function handleClearFiles() {
	uploader.clearFileList();
	uploader.enable();
	fileID = null;
	}
		
	// When contentReady event is fired, you can call methods on the uploader.
	function handleContentReady () {
	    // Allows the uploader to send log messages to trace, as well as to YAHOO.log
		uploader.setAllowLogging(true);
		
		// Restrict selection to a single file (that's what it is by default,
		// just demonstrating how).
		uploader.setAllowMultipleFiles(false);
		
		// New set of file filters.
		var ff = new Array({description:"Images", extensions:"*.jpg;*.png;*.gif"},
		                   {description:"Videos", extensions:"*.avi;*.mov;*.mpg"});
		                   
		// Apply new set of file filters to the uploader.
		uploader.setFileFilters(ff);
	}

	// Initiate the file upload. Since there's only one file, 
	// we can use either upload() or uploadAll() call. fileList 
	// needs to have been populated by the user.
	function upload() {
	if (fileID != null) {
		uploader.upload(fileID, "http://www.yswfblog.com/upload/upload_simple.php");
		fileID = null;
	}
	}
	
	// Fired when the user selects files in the "Browse" dialog
	// and clicks "Ok".
	function onFileSelect(event) {
		for (var item in event.fileList) {
		    if(YAHOO.lang.hasOwnProperty(event.fileList, item)) {
				YAHOO.log(event.fileList[item].id);
				fileID = event.fileList[item].id;
			}
		}
		uploader.disable();
		
		var filename = document.getElementById("fileName");
		filename.innerHTML = event.fileList[fileID].name;
		
		var progressbar = document.getElementById("progressBar");
		progressbar.innerHTML = "";
	}

    // Do something on each file's upload start.
	function onUploadStart(event) {
	
	}
	
	// Do something on each file's upload progress event.
	function onUploadProgress(event) {
		prog = Math.round(300*(event["bytesLoaded"]/event["bytesTotal"]));
	  	progbar = "<div style=\"background-color: #f00; height: 5px; width: " + prog + "px\"/>";

		var progressbar = document.getElementById("progressBar");
		progressbar.innerHTML = progbar;
	}
	
	// Do something when each file's upload is complete.
	function onUploadComplete(event) {
		uploader.clearFileList();
		uploader.enable();
		
		progbar = "<div style=\"background-color: #f00; height: 5px; width: 300px\"/>";
		var progressbar = document.getElementById("progressBar");
		progressbar.innerHTML = progbar;
	}
	
	// Do something if a file upload throws an error.
	// (When uploadAll() is used, the Uploader will
	// attempt to continue uploading.
	function onUploadError(event) {

	}
	
	// Do something if an upload is cancelled.
	function onUploadCancel(event) {

	}
	
	// Do something when data is received back from the server.
	function onUploadResponse(event) {
		YAHOO.log("Server response received.");
	}

</script>
