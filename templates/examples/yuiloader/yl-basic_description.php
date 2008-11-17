<h2 class="first">A Simple Use Case: Using YUI Loader to Load the Calendar Control</h2>

<p>This example implements the <a href="http://developer.yahoo.com/yui/yuiloader/">YUI Loader Utility</a> to load the <a href="http://developer.yahoo.com/yui/calendar/">Calendar Control</a>.</p>

<p>The workflow happens in three steps:</p>
<ol>
  <li><strong>Load the YUI Loader script file:</strong></li>
  <li><strong>Create a <code>YAHOO.util.YUILoader</code> instance:</strong> We pass a configuration object to set up our instruction set for Loader, including things like what components to load, whether to load optional components, and what to do once the components are loaded (in this case, once the components are loaded we instantiate a Calendar Control on the page).</li>
</ol>
<p>Here's what that looks like in terms of raw source &mdash; this is the full JavaScript source code for this example: </p>
<textarea name="code" class="JScript" cols="60" rows="1"><script>

    var loader = new YAHOO.util.YUILoader({

        require: ['calendar'], // what components?

        base: '../../build/',//where do they live?

		//filter: "DEBUG", 	//use debug versions (or apply some
							//some other filter?

		//loadOptional: true, //load all optional dependencies?

		//onSuccess is the function that YUI Loader
		//should call when all components are successfully loaded.
        onSuccess: function() {
			//Once the YUI Calendar Control and dependencies are on
			//the page, we'll verify that our target container is 
			//available in the DOM and then instantiate a default
			//calendar into it:
			YAHOO.util.Event.onAvailable("calendar_container", function() {
				var myCal = new YAHOO.widget.Calendar("mycal_id", "calendar_container");
				myCal.render();
			})
         },

        // should a failure occur, the onFailure function will be executed
        onFailure: function(o) {
            alert("error: " + YAHOO.lang.dump(o));
        }

     });

    // Calculate the dependency and insert the required scripts and css resources
    // into the document
    loader.insert();

</script>

<script src="../../build/yuiloader/yuiloader.js"></script></textarea>

<p>This code executes the following steps in order:</p>
<ol>
  <li><strong>YUI Loader loads and consumes the configuration object.</strong> It gets instructions about what components are required, how to configure them, and what code to execute when loading is done.</li>
  <li><strong>YUI Loader checks the dependency tree.</strong> Loader knows that Calendar requires the <a href="http://developer.yahoo.com/yui/yahoo/">Yahoo Global Object</a>, the <a href="http://developer.yahoo.com/yui/dom/">Dom Collection</a>, the <a href="http://developer.yahoo.com/yui/event/">Event Utility</a>, and the Calendar Control file as well as Calendar's CSS file. It knows that it can get Yahoo, Dom and Event in a single file, so it uses a rollup for those and loads that rolled up JavaScript file via a <code>&lt;script&gt;</code> node that it inserts on the page. It waits for that file to load, then loads the Calendar Control's JavaScript file; this must be loaded after Yahoo, Dom and Event are in place. (The CSS file is loaded immediately by inserting a <code>&lt;link&gt;</code> element on the page.) </li>
  <li><strong>YUI Loader executes its <code>onSuccess</code> function.</strong> This is the member of the configuration object in which we specfied our instantiation logic for Calendar. </li>
</ol>
