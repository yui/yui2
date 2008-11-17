<h2 class="first">Advanced Uploader Example With Additional POST Variables and Server Data Return</h2>

<p>In this example, we allow the user to select a single image or video, and upload it to the server, while tracking progress on the upload. The user can specify custom values for a couple POST vars sent along with the upload, and also get the response from the server (in this case, a simple echo of POSTed variables). 
	
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
<p>We are also placing a few input fields for the user to specify two custom POST variables that will be sent along with the file upload, as well as a text field to report back on the upload progress, and a text area to display the response received from the server:</p>
<textarea name="code" class="html" cols="60" rows="5">
	<div id="uiElements" style="display:inline;">
			<div id="postVars">
			Set custom values for a couple POST vars:<br/>
			var1: <input type="text" id="var1Value" value="var1 default value" /><br/>
			var2: <input type="text" id="var2Value" value="var2 default value" /><br/><br/>
			</div>
			<div id="uploaderContainer">
				<div id="uploaderOverlay" style="position:absolute; z-index:2"></div>
				<div id="selectFilesLink" style="z-index:1"><a id="selectLink" href="#">Select File</a></div>
			</div>
			<div id="uploadFilesLink"><a id="uploadLink" onClick="upload(); return false;" href="#">Upload File</a></div><br/>
			<div id="selectedFileDisplay">
			Progress: <input type="text" cols="50" id="progressReport" value="" readonly /><br/><br/>
			</div>
			<div id="returnedDataDisplay">
			Data returned by the server:<br/>
			<textarea id="serverData" rows="5" cols="50">&lt;/textarea&gt;
			</div>
	</div>
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

		function handleClick () {
		}
</textarea>

<p>Once the contentReady event has fired, we can configure the uploader. In this case, we call a function that turns on logging (so that everything we do is reflected in the YUI logger, as well as in the Flash trace file), disallow multiple file selection, and define a set of filters on the file extensions that the user can choose.</p>
<textarea name="code" class="js" cols="60" rows="5">
		function handleContentReady () {
			uploader.setAllowLogging(true);
			uploader.setAllowMultipleFiles(false);

			var ff = new Array({description:"Images", extensions:"*.jpg;*.png;*.gif"},
			                   {description:"Videos", extensions:"*.avi;*.mov;*.mpg"});

			uploader.setFileFilters(ff);
		}
</textarea>

<p>The upload function is called when "Upload Files" link is clicked. It checks whether the fileID
variable has been populated, and if so, instructs the upload to send that file to the specified 
location. Note that we are overriding the default value for the variable submission method (default
is "GET", we are making it "POST"). We are also passing an object with two POST variables to
submit along with the upload; in this case, their values come from input fields that were presented
to the user.</p>
<textarea name="code" class="js" cols="60" rows="5">
		function upload() {
		if (fileID != null) {
			uploader.upload(fileID, "http://www.yswfblog.com/upload/upload.php", 
			                "POST", 
			                {var1:document.getElementById("var1Value").value,
							 var2:document.getElementById("var2Value").value});
		}	
		}
</textarea>

<p>The fileID variable that the upload() function checked for needs to be defined and populated.
This happens in the fileSelect event handler, that looks at the list of files passed in the event
(they are indexed by the file id, rather than by numerical index, and so an iterator is necessary).
Since we know the list will contain only one file, we can simply assign that file id to the fileID
variable.</p>
<p>We also update the progress report text field with the information on the selected file</p>
<textarea name="code" class="js" cols="60" rows="5">
		var fileID;

		function onFileSelect(event) {
    		for (var file in event.fileList) {
    		    if(YAHOO.lang.hasOwnProperty(event.fileList, file)) {
    				fileID = event.fileList[file].id;
    			}
    		}

			this.progressReport = document.getElementById("progressReport");
			this.progressReport.value = "Selected " + event.fileList[fileID].name;
		}
</textarea>

<p>Update the progress report when the upload starts:</p>
<textarea name="code" class="js" cols="60" rows="5">
		function onUploadStart(event) {
			this.progressReport.value = "Starting upload...";
		}
</textarea>

<p>Update the progress report on upload progress events:</p>
<textarea name="code" class="js" cols="60" rows="5">
		function onUploadProgress(event) {
			prog = Math.round(100*(event["bytesLoaded"]/event["bytesTotal"]));
			this.progressReport.value = prog + "% uploaded...";
		}
</textarea>

<p>Update the progress report on upload complete event:</p>
<textarea name="code" class="js" cols="60" rows="5">
		function onUploadComplete(event) {
			this.progressReport.value = "Upload complete.";
		}
</textarea>

<p>Update the progress report in case of an upload error:</p>
<textarea name="code" class="js" cols="60" rows="5">
		function onUploadError(event) {
			this.progressReport.value = "Upload error.";
		}
</textarea>

<p>When a response is received from the server, display it in the
provided text area:</p>
<textarea name="code" class="js" cols="60" rows="5">
		function onUploadResponse(event) {
			this.serverData = document.getElementById("serverData");
			this.serverData.value = event.data;
		}
	</script>
</textarea>
