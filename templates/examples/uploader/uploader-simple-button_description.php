<h2 class="first">Simple Uploader Example with Button UI</h2>

<p>In this example, we allow the user to select a single image or video file and upload it to the server. We will render the Uploader UI as a sprite-skinned button, and display the name of the file as well as upload progress. </p>

<p>Because of security changes in Flash Player 10, the UI for invoking the "Browse" dialog must be contained inside the Flash player. The Uploader provides two ways of accomplishing that: it can take a button skin sprite (a single image containing multiple states of a button), and render as a button, or it can render as a transparent overlay on top of any UI you want to implement. In this example, we'll render the Uploader UI as a button. To create additional HTML rollover buttons that match the look of the Uploader button, we'll define the following styles:
	
<textarea name="code" class="html" cols="60" rows="5"><html>
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
</textarea>

<p> Notice that the styles are using two image files, <code>uploadFileButton.png</code> and <code>clearListButton.png</code> for rollovers. The directory contains another file, <code>selectFileButton.png</code>, which we will use to skin the Uploader UI. The sprite images look as follows:</p>
	<div style="width:100%">
<img src="<?php echo $assetsDirectory;?>selectFileButton.png">
<img src="<?php echo $assetsDirectory;?>uploadFileButton.png">
<img src="<?php echo $assetsDirectory;?>clearListButton.png">
</div>
<p>Note that while for your own rollover buttons you can modify the location of the button states within the sprite, the Uploader requires that the button skin sprite had the states in the following order, stacked vertically: <strong>buttonUp</strong> state, <strong>buttonHover</strong> state, <strong>buttonDown</strong> state and <strong>buttonDisabled</strong> state.</p>
<p>Next, let's create the UI. First, we'll define the space for the file name and progress bar displays:</p>
<textarea name="code" class="html" cols="60" rows="5">    
	<div>
		<div id="fileProgress" style="border: black 1px solid; width:300px; height:40px;float:left">
			<div id="fileName" style="text-align:center; margin:5px; font-size:15px; width:290px; height:25px; overflow:hidden">
			</div>
			<div id="progressBar" style="width:300px;height:5px;background-color:#CCCCCC">
			</div>
		</div>
</textarea>
<p>Next, we'll define three buttons. The first button will be rendered by the Uploader, so we'll put down the placeholder div of the right size. The other two buttons will be HTML-rendered, and we'll assign functions to be called when they are clicked:</p>
<textarea name="code" class="html" cols="60" rows="5">    
	<div id="uploaderUI" style="width:100px;height:40px;margin-left:5px;float:left"></div>
	<div class="uploadButton" style="float:left">
		<a class="rolloverButton" href="#" onClick="upload(); return false;"></a>
	</div>
	<div class="clearButton" style="float:left">
		<a class="rolloverButton" href="#" onClick="handleClearFiles(); return false;"></a>
	</div>
	</div>
</textarea>

<p>Next, we instantiate the Uploader, and write it to the placeholder div. Note that we are passing the URL of the button skin sprite as the second argument to the Uploader constructor. If you don't pass this optional second argument, the uploader will be render transparent.</p>
<textarea name="code" class="html" cols="60" rows="5">
<script type="text/javascript">
    
    // Instantiate the uploader and write it to its placeholder div.
	
	YAHOO.widget.Uploader.SWFURL = "<?php echo $assetsDirectory;?>uploader.swf";
	
	var uploader = new YAHOO.widget.Uploader( "uploaderUI", "<?php echo $assetsDirectory;?>selectFileButton.png" );
</textarea>

<p>Next, we add event listeners to various events called by the uploader. Note specifically the &quot;contentReady&quot; event: until that event fires, the uploader methods are not available.
We wont need to respond to all events, so we will leave some of these event handlers empty, just as placeholders.
</p>

<textarea name="code" class="js" cols="60" rows="5">
	uploader.addListener('contentReady', handleContentReady);
	uploader.addListener('fileSelect',onFileSelect)
	uploader.addListener('uploadStart',onUploadStart);
	uploader.addListener('uploadProgress',onUploadProgress);
	uploader.addListener('uploadCancel',onUploadCancel);
	uploader.addListener('uploadComplete',onUploadComplete);
	uploader.addListener('uploadCompleteData',onUploadResponse);
	uploader.addListener('uploadError', onUploadError);
</textarea>
		
<p>Now, let us define the event handlers themselves. First, we will create the <code>contentReady</code> handler. In it, we will enable the logging output in the uploader (the log messages will be output both to the YUI Logger, and the Flash trace output), disallow multiple file selection (it is disallowed by default, so we are being redundant), and set file filters to filter user selection.
</p>

<textarea name="code" class="js" cols="60" rows="5">
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
</textarea>

<p>When a file is selected, we record the id of the selected file, and disable the uploader UI. Next, we display the name of the file and reset the progress bar.
</p>

<textarea name="code" class="js" cols="60" rows="5">
var fileID;
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
</textarea>

<p>The upload function is called when the "Upload File" button is clicked. Since we only have a single file to upload, we do not need to manage the queue, and can just make a single upload() call, passing the file id and the URL where to send the upload. The other two parameters to the upload() call are the name of the method to send accompanying variables ("GET" or "POST", and "GET" is default), and an object containing variables themselves.
</p>

<textarea name="code" class="js" cols="60" rows="5">
	function upload() {
	if (fileID != null) {
		uploader.upload(fileID, "http://www.yswfblog.com/upload/upload_simple.php");
		fileID = null;
	}
	}
</textarea>

<p>This function, called when the user presses the "Clear List" button, clears the upload queue and reenables the uploader UI.
</p>

<textarea name="code" class="js" cols="60" rows="5">
	function handleClearFiles() {
	uploader.clearFileList();
	uploader.enable();
	fileID = null;
	}
</textarea>
	
<p>This function handles uploadProgress events, and draws a progress bar of correct size.
</p>

<textarea name="code" class="js" cols="60" rows="5">
	function onUploadProgress(event) {
		prog = Math.round(300*(event["bytesLoaded"]/event["bytesTotal"]));
	  	progbar = "<div style=\"background-color: #f00; height: 5px; width: " + prog + "px\"/>";

		var progressbar = document.getElementById("progressBar");
		progressbar.innerHTML = progbar;
	}
</textarea>


<p>This function handles the uploadComplete event, draws a full progress bar, and reenables the uploader UI.
</p>

<textarea name="code" class="js" cols="60" rows="5">
	function onUploadComplete(event) {
		uploader.clearFileList();
		uploader.enable();
		
		progbar = "<div style=\"background-color: #f00; height: 5px; width: 300px\"/>";
		var progressbar = document.getElementById("progressBar");
		progressbar.innerHTML = progbar;
	}
</textarea>


<p>The rest of the event handlers are left as placeholders.
</p>

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

