<h2 class="first">Getting Started with the Dialog Control</h2>

<p>The Dialog component is an extension of Panel that is meant to emulate the behavior of an dialog window using a floating, draggable HTML element. Dialog provides an interface for easily gathering information from the user without leaving the underlying page context. The information gathered is collected via a standard HTML form; Dialog supports the submission of form data  through XMLHttpRequest, through a normal form submission, or through a manual script-based response (where the script reads and responds to the form values and the form is never actually submitted to the server).</p>

<p>Instantiating a Dialog is very similar to other controls in the Container collection. In this tutorial, we will create a Dialog from existing markup where the container element's id is "dialog1":</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Instantiate the Dialog
YAHOO.example.container.dialog1 = new YAHOO.widget.Dialog("dialog1", 
			{ width : "300px",
			  fixedcenter : true,
			  visible : false, 
			  constraintoviewport : true,
			  buttons : [ { text:"Submit", handler:handleSubmit, isDefault:true },
						  { text:"Cancel", handler:handleCancel } ]
			 } );
</textarea>

<p>The properties for <em>width</em>, <em>fixedcenter</em>, <em>visible</em>, and <em>constraintoviewport</em> are inherited from Panel. Unique to the Dialog control is the <em>buttons</em> property, which takes an array of object literals representing the buttons that will be rendered in the Dialog's footer. Each one of these button literals has three possible properties: "text" which represents the button text, "handler" which is a reference to the function that will execute when the button is clicked, and "isDefault" which will apply a bold style to the button when set to true.</p>

<p>Next, we must define the <em>handleCancel</em> and <em>handleSubmit</em> handlers for our buttons. In this tutorial, the submit and cancel buttons will call the corresponding functions in the Dialog:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Define various event handlers for Dialog
var handleSubmit = function() {
	this.submit();
};
var handleCancel = function() {
	this.cancel();
};
</textarea>

<p>By default, the Dialog is submitted using the <a href="http://developer.yahoo.com/yui/connection/">Connection Manager</a>. In order to handle the response from the server, we must define callback functions that will execute when the submission has occurred. First, we will define the functions, and then we will set them into our Dialog's <em>callback</em> &mdash; the same callback object that will be passed to Connection Manager's <em>asyncRequest</em> method. For the purposes of this example, the success handler will simply diplay the server response on the page. The failure handler will alert the response status code, if something goes wrong:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var handleSuccess = function(o) {
	var response = o.responseText;
	response = response.split("<!")[0];
	document.getElementById("resp").innerHTML = response;
};

var handleFailure = function(o) {
	alert("Submission failed: " + o.status);
};

YAHOO.example.container.dialog1.callback = { success: handleSuccess,
											 failure: handleFailure };
</textarea>

<p>You can also take advantage of Dialog's built-in validation function so that you can verify that the values entered by the user are valid prior to form submission. In this tutorial, we will verify that the user has entered, at the very least, a first and last name. Using the <em>getData</em> function, we can easily query the values of the form fields. In a valid scenario, the function should return true, otherwise the function should return false, which will prevent the submission:</p>

<textarea name="code" class="JScript" cols="60" rows="1">		
// Validate the entries in the form to require that both first and last name are entered
YAHOO.example.container.dialog1.validate = function() {
	var data = this.getData();
	if (data.firstname == "" || data.lastname == "") {
		alert("Please enter your first and last names.");
		return false;
	} else {
		return true;
	}
};
</textarea>

<p>Finally, we will build the markup for the Dialog. A Dialog contains a form whose fields will be submitted to the server. Note that the URL where the form will be submitted is specified in the "action" attribute of the form.</p>


<textarea name="code" class="HTML" cols="60" rows="1">
<div id="dialog1">
	<div class="hd">Please enter your information</div>
	<div class="bd">
		<form method="POST" action="http://developer.yahoo.com/yui/examples/container/assets/post.php">
			<label for="firstname">First Name:</label><input type="textbox" name="firstname" />
			<label for="lastname">Last Name:</label><input type="textbox" name="lastname" />
			<label for="email">E-mail:</label><input type="textbox" name="email" /> 

			<label for="state[]">State:</label>
			<select multiple name="state[]">
				<option value="California">California</option>
				<option value="New Jersey">New Jersey</option>
				<option value="New York">New York</option>
			</select> 

				<div class="clear"></div>

			<label for="radiobuttons">Radio buttons:</label>
			<input type="radio" name="radiobuttons[]" value="1" checked/> 1
			<input type="radio" name="radiobuttons[]" value="2" /> 2
			
				<div class="clear"></div>

			<label for="check">Single checkbox:</label><input type="checkbox" name="check" value="1" /> 1
			
			<label for="textarea">Text area:</label>&lt;textarea name="textarea"&gt;&lt;/textarea&gt;

				<div class="clear"></div>

			<label for="cbarray">Multi checkbox:</label>
			<input type="checkbox" name="cbarray[]" value="1" /> 1
			<input type="checkbox" name="cbarray[]" value="2" /> 2
		</form>
	</div>
</div>
</textarea>
