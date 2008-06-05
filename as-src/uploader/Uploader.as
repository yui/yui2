package

{

	import flash.utils.Dictionary;

	import flash.net.FileReference;

	import flash.net.FileReferenceList;

	import flash.net.URLRequest;

	import flash.net.URLRequestMethod;

	import flash.net.URLVariables;

	import flash.net.FileFilter;

	import flash.events.Event;

	import flash.events.ProgressEvent;

	import flash.events.HTTPStatusEvent;

	import flash.events.IOErrorEvent;

	import flash.events.SecurityErrorEvent;

	import flash.events.DataEvent;

	import flash.external.ExternalInterface;

	import flash.text.TextField;

	import flash.text.TextFieldType;

	import flash.display.Sprite; 



	import com.yahoo.yui.YUIAdapter; 



//	[SWF(backgroundColor=0xffffff)]

	/**

	 * A wrapper for the Astra Uploader components to allow them to be used by the YUI library.

	 * 

	 * @author Allen Rabinovich, Buck DeFore

	 */

	public class Uploader extends YUIAdapter {

	//--------------------------------------

	//  Constructor

	//--------------------------------------

		public function Uploader(debugfield:TextField = null)

		{

			super();

		}



	    //--------------------------------------------------------------------------

	    //

	    //  Variables

	    //

	    //--------------------------------------------------------------------------

		private var fileDataList:Object;

		private var fileRefList:Object;

		private var fileIDList:Dictionary;

		private var fileIDCounter:Number;

		private var filesToUpload:Array; 		// for queue management



		private var singleFile:FileReference;

		private var multipleFiles:FileReferenceList;

		private var output:TextField;



		/**

		 * Determines how many files will be uploaded simultaneously

		 *

		 * @langversion 3.0

		 * @playerversion Flash 9.0.28.0

		 */

		public var simultaneousUploadLimit:Number = 2;

		

		//--------------------------------------

		//  Public Methods

		//--------------------------------------

	    /**

	     *  Triggers a prompt for the user to browse their file system to select

		 *  files to be uploaded.

		 *  

	     *  @param allowMultiple Whether to allow the user to select more than

	     *  one file

	     * 

	     *  @param filterArray An array of filter objects, each with <code>

	     *  description</code>, and <code>extensions</code> properties which

		 *  determine which files the user is allowed to select

	     */

		public function browse(allowMultiple:Boolean = false, filterArray:Array = null):void {

			if(!allowMultiple) {

				t("Browsing for single file...")

				singleFile = new FileReference();

				singleFile.addEventListener(Event.SELECT, singleFileSelected);



				if(filterArray) singleFile.browse(processFileFilterObjects(filterArray));

				else singleFile.browse();

			}

			else {

				t("Browsing for one or more files...")

				multipleFiles = new FileReferenceList();

				multipleFiles.addEventListener(Event.SELECT, multipleFilesSelected);



				if(filterArray) multipleFiles.browse(processFileFilterObjects(filterArray));

				else multipleFiles.browse();

			}

		}



	    /**

	     *  Removes the file from the set to be uploaded

		 *  

	     *  @param fileID The ID of the file to be removed

	     */

		public function removeFile(fileID:String):Object {


			delete fileDataList[fileID];

			delete fileRefList[fileID];



			return fileDataList;

		}



	    /**

	     *  Clears the set of files that had been selected for upload

	     */

		public function clearFileList():Boolean {

	
			filesToUpload = [];

			fileDataList = new Object();

			fileRefList = new Object();

			fileIDList = new Dictionary();

			fileIDCounter = 0;

			return true;

		}



	    /**

	     *  Uploads a file corresponding to a specified ID to a specified path where a script handles writing to the server.

		 *  

	     *  @param fileID The ID of the file to be uploaded

	     *  @param url The path to the serverside script

	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"

	     *  @param vars An object containing data to be sent along with the request

	     *  @param fieldName The field name that precedes the file data in the upload POST operation. The uploadDataFieldName value must be non-null and a non-empty String.

	     */

		public function upload(fileID:String, url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata"):void {

			// null checking in the params is not working correctly

			if(isEmptyString(method)) method = "GET";

			if(isEmptyString(fieldName)) fieldName = "Filedata";



			var request:URLRequest = formURLRequest(url, method, vars);

	

			var fr:FileReference = fileRefList[fileID];

			queueForUpload(fr, request, fieldName);

		}

	    /**

	     *  Uploads all files to a specified path where a script handles writing to the server.

		 *  

	     *  @param fileID The ID of the file to be uploaded

	     *  @param url The path to the serverside script

	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"

	     *  @param vars An object containing data to be sent along with the request

	     *  @param fieldName The field name that precedes the file data in the upload POST operation. The uploadDataFieldName value must be non-null and a non-empty String.

	     */

		public function uploadAll(url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata"):void {

			// null checking in the params is not working correctly

			if(isEmptyString(method)) method = "GET";

			if(isEmptyString(fieldName)) fieldName = "Filedata";



			var request:URLRequest = formURLRequest(url, method, vars);



			for each(var fr:FileReference in fileRefList) {

				queueForUpload(fr, request, fieldName);

			}

		}

	    /**

	     *  Cancels either an upload of the file corresponding to a given fileID, or in the absence of the specified fileID, all active files being uploaded.

		 *  

	     *  @param fileID The ID of the file to be uploaded

	     */

		public function cancel(fileID:String = null):void {

			t("Canceling upload")

			if (fileID == null) { // cancel all files

				for each (var item:FileReference in fileRefList) {

					item.cancel();

				}

			} 

			else { // cancel specified file

				var fr:FileReference = fileRefList[fileID];

				fr.cancel();

			}

		}



		/*

			Events

			-------------------------------

			fileSelect - fires when the user selects one or more files (after browse is called). Passes the array of currently selected files (if prior browse calls were made and clearFileList hasn't been called, all files the user has ever selected will be returned), along with all information available about them (name, size, type, creationDate, modificationDate, creator). 



			uploadStart - fires when a file starts uploading. Passes a file id for identifying the file.

			uploadProgress - fires when a file upload reports progress. Passes the file id, as well as bytesUploaded and bytesTotal for the given file.

			uploadComplete - fires when a file upload is completed successfully and passes the corresponding file id.

			uploadCompleteData - fires when data is received from the server after upload and passes the corresponding file id and the said data.

			uploadError - fires when an error occurs during download. Passes the id of the file that was being uploaded and an error type.
			
			uploadCancel - fires when an upload is cancelled. Passes the id of the file whose upload has been cancelled.

		*/

		private function uploadStart (event:Event) : void {

			t("Started upload for " + fileIDList[event.target]);

			var newEvent:Object = new Object();

			newEvent.id = fileIDList[event.target];

			newEvent.type = "uploadStart"

            super.dispatchEventToJavaScript(newEvent);

		}



		private function uploadProgress (event:ProgressEvent) : void {

			t("Progress for " + fileIDList[event.target] + ": " + event.bytesLoaded.toString() + " / " + event.bytesTotal.toString());

			var newEvent:Object = new Object();

			newEvent.id = fileIDList[event.target];

			newEvent.bytesLoaded = event.bytesLoaded;

			newEvent.bytesTotal = event.bytesTotal;

			newEvent.type = "uploadProgress"

			super.dispatchEventToJavaScript(newEvent);

		}



		private function uploadComplete (event:Event) : void {

			t("Upload complete for " + fileIDList[event.target]);

			var newEvent:Object = new Object();

			newEvent.id = fileIDList[event.target];

			newEvent.type = "uploadComplete"

			super.dispatchEventToJavaScript(newEvent);

			

			// get next off of queue:

			if(filesToUpload.length > 0) processQueue();

		}



		private function uploadCompleteData (event:DataEvent) : void {

			t("Got data back for " + fileIDList[event.target] + ": ");

			t(event.data);

			var newEvent:Object = new Object();

			newEvent.id = fileIDList[event.target];

			newEvent.data = event.data;

			newEvent.type = "uploadCompleteData"

			super.dispatchEventToJavaScript(newEvent);

		}
		
		private function uploadCancel (event:Event) : void {
			
			t("Canceled upload for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "uploadCancel";
			super.dispatchEventToJavaScript(newEvent);
			
		}



		private function uploadError (event:Event) : void {

			// {} instead of new Object()? !

	        var newEvent:Object = new Object();

			if (event is HTTPStatusEvent) {

				var myev:HTTPStatusEvent = event as HTTPStatusEvent;

				newEvent.type = "http";

				newEvent.status = myev.status;

				t("HTTP status error for " + fileIDList[event.target] + ": ");

			}

			else if (event is IOErrorEvent) {

				newEvent.type = "io";

				newEvent.status = event.toString();

				t("IO error for " + fileIDList[event.target] + ": ");

			}

			else if (event is SecurityErrorEvent) {

				newEvent.type = "security";

				newEvent.status = event.toString();

				t("Security error for " + fileIDList[event.target] + ": ");

			}



			newEvent.type = "uploadError";
			newEvent.id = fileIDList[event.target];

			super.dispatchEventToJavaScript(newEvent);



			// get next off of queue:

			if(filesToUpload.length > 0) processQueue();

		}



		// internal event handler

		private function singleFileSelected(event:Event):void {

			addFile(event.target as FileReference);

			processSelection();

		}



		// internal event handler

		private function multipleFilesSelected(event:Event):void {

			var currentFRL:FileReferenceList = multipleFiles;

			for each (var currentFR:FileReference in currentFRL.fileList) {

				addFile(currentFR);

			}

			processSelection();

		}



		//--------------------------------------------------------------------------

		// 

		// Overridden Properties

		//

		//--------------------------------------------------------------------------

	    /**

		 *  @private

		 *  Initializes the component and enables communication with JavaScript

	     *

	     *  @param parent A container that the PopUpManager uses to place the Menu 

	     *  control in. The Menu control may not actually be parented by this object.

	     * 

	     *  @param xmlDataProvider The data provider for the Menu control. 

	     *  @see #dataProvider 

	     *  

	     *  @return An instance of the Menu class. 

	     *

	     *  @see #popUpMenu()

		 *  @see com.yahoo.astra.fl.data.XMLDataProvider

	     */

		override protected function initializeComponent():void {



			super.initializeComponent();



			ExternalInterface.addCallback("browse", browse);

			ExternalInterface.addCallback("removeFile", removeFile);

			ExternalInterface.addCallback("clearFileList", clearFileList);

			ExternalInterface.addCallback("upload", upload);

			ExternalInterface.addCallback("uploadAll", uploadAll);

			ExternalInterface.addCallback("cancel", cancel);



			fileDataList = new Object();

			fileRefList = new Object();

			fileIDList = new Dictionary();

			singleFile = new FileReference();

			multipleFiles = new FileReferenceList();

			fileIDCounter = 0;

			filesToUpload = [];



			output = new TextField();

			output.border = true;

			output.width = 300;

			output.height = 200;

			addChild(output);

		}

	

		//--------------------------------------

		//  Private Methods

		//--------------------------------------

		/**

		 *  @private

		 *  Formats objects containing extensions of files to be filtered into formal FileFilter objects

		 */	

		private function processFileFilterObjects(filtersArray:Array) : Array {


			for (var i:int = 0; i < filtersArray.length; i++) {

				filtersArray[i] = new FileFilter(filtersArray[i].description, filtersArray[i].extensions, filtersArray[i].macType);

			}

			return filtersArray;

		}

		/**

		 *  @private

		 *  Outputs the files selected to an output panel and triggers a 'fileSelect' event.

		 */	

		private function processSelection():void {

			var dstring:String = "";

			dstring += "Files Selected: ";

			for each (var item:Object in fileDataList) {

				dstring += item.name + "; ";

			}

			t(dstring);

			var newEvent:Object = new Object();

			newEvent.fileList = fileDataList;

			newEvent.type = "fileSelect"

			super.dispatchEventToJavaScript(newEvent);

		}

		

		/**

		 *  @private

		 *  Adds a file reference object to the internal queue and assigns listeners to its events

		 */	

		private function addFile(fr:FileReference):void {

			var fileID:String = "file" + fileIDCounter;

			var fileName:String = fr.name;

			var fileCDate:Date = fr.creationDate;

			var fileMDate:Date = fr.modificationDate;

			var fileSize:Number = fr.size;

			fileIDCounter++;



			fileDataList[fileID] = {id: fileID, name: fileName, cDate: fileCDate, mDate: fileMDate, size: fileSize};//, type: fileType, creator: fileCreator};



			fr.addEventListener(Event.OPEN, uploadStart);

            fr.addEventListener(ProgressEvent.PROGRESS, uploadProgress);

			fr.addEventListener(Event.COMPLETE, uploadComplete);

			fr.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);

			fr.addEventListener(HTTPStatusEvent.HTTP_STATUS, uploadError);

	        fr.addEventListener(IOErrorEvent.IO_ERROR, uploadError);

            fr.addEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);

			fr.addEventListener(Event.CANCEL,uploadCancel);


			fileRefList[fileID] = fr;

			fileIDList[fr] = fileID;

		}

		/**

		 *  @private

		 *  Queues a file for upload

		 */	

		private function queueForUpload(fr:FileReference, request:URLRequest, fieldName:String):void {

			filesToUpload.push( {fr:fr, request:request, fieldName:fieldName });

			

			if(filesToUpload.length < simultaneousUploadLimit) processQueue();

		}

		/**

		 *  @private

		 *  Uploads the next file in the upload queue.

		 */	

		private function processQueue():void {

			var objToUpload:Object = filesToUpload.pop();

			var fr:FileReference = objToUpload.fr;

			var request:URLRequest = objToUpload.request;

			var fieldName:String = objToUpload.fieldName;

			

			fr.upload(request,fieldName);

		}

		/**

		 *  @private

		 *  Creates a URLRequest object from a url, and optionally includes an HTTP request method and additional variables to be sent

		 */	

		private function formURLRequest(url:String, method:String = "GET", vars:Object = null):URLRequest {

			var request:URLRequest = new URLRequest();

			request.url = url;

			request.method = method;

			request.data = new URLVariables();

			for (var itemName:String in vars) {

				request.data[itemName] = vars[itemName];

			}

			return request;

		}

		/**

		 *  @private

		 *  Determines whether an object is equivalent to an empty string

		 */	

		private function isEmptyString(toCheck:*):Boolean {

			if(	toCheck == "null" ||

				toCheck == "" ||

				toCheck == null ) {

				return true;

			}

			else {

				return false

			}

		}

		/**

		 *  @private

		 *  Traces text to an output panel

		 */	

		private function t(newText:String):void {

			if(newText) output.text = newText + "\n" + output.text;

		}

	}

}

