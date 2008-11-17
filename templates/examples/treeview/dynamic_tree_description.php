<h2 class="first">Using TreeView with Connection Manager to Dynamically Load Data</h2>

<p>Dynamic loading of a <a href="http://developer.yahoo.com/yui/treeview/">TreeView Control</a>'s
child nodes allows you to optmize
performance by only loading data for and creating the nodes that will
be visible when the tree is rendered. Nodes that are not expanded when
the TreeView's <code>draw</code> method is invoked are left childless in the initial
state. When such a node is expanded (either by user action or by
script), a dynamic loader function is called. That function has three
important roles:</p>
                <ol>
                  <li><strong>Check for child nodes:</strong>
The dynamic loader function will check for child nodes by evaluating
in-page data (for example, data held in a JavaScript array or object)
or by retrieving data about the expanding node from the server via
XMLHttpRequest. In the example on this page, We'll use the <a href="http://developer.yahoo.com/yui/connection/">YUI Connection Manager</a> component to check for data from a web service.</li>
                  <li><strong>Add child nodes, if present:</strong>
If it determines that child node's are present for the expanding node,
the dynamic loader must add those child nodes to the TreeView instance.
Because these nodes are only added when needed, the overall complexity
of the initial TreeView (in JavaScript and in the DOM) is reduced and
its render time is much faster.</li>
                  <li><strong>Invoke the expanding node's callback method:</strong>
Once the dynamic loader method determines whether the expanding node
has children (and adds any children that may be present), it must
notify the expanding node's object that dynamic loading is complete. It
does this via a callback function which is passed into the dynamic loader
as an argument.</li>
              </ol>

<p>Here's how the code on this page manages those three steps.  First, we markup the page with a target element into which the TreeView's DOM structure will be injected:</p>

<textarea name="code" class="JScript" cols="60" rows="1"><div id="treeDiv1"></div></textarea>

<p>Next, we build a function that creates our initial TreeView:</p>

<textarea name="code" class="JScript" cols="60" rows="1">function buildTree() {
   //create a new tree:
   tree = new YAHOO.widget.TreeView("treeDiv1");
   
   //turn dynamic loading on for entire tree:
   tree.setDynamicLoad(loadNodeData, currentIconMode);
   
   //get root node for tree:
   var root = tree.getRoot();
   
   //add child nodes for tree; our top level nodes are
   //all the states in India:
   var aStates = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka"];
   
   for (var i=0, j=aStates.length; i<j; i++) {
        var tempNode = new YAHOO.widget.TextNode(aStates[i], root, false);
   }

   // Use the isLeaf property to force the leaf node presentation for a given node.
   // This disables dynamic loading for the node.
   var tempNode = new YAHOO.widget.TextNode('This is a leaf node', root, false);
   tempNode.isLeaf = true;

   //render tree with these toplevel nodes; all descendants of these nodes
   //will be generated as needed by the dynamic loader.
   tree.draw();
}</textarea>        

<p>We have turned on dynamic loading (in line 6 above) at the TreeView level rather than on a specific node, so every expanding node now will invoke our dynamic load handler (<code>loadNodeData</code>).  That means that before the node expands, the node object will be passed to <code>loadNodeData</code> along with a callback function and the expansion won't take place until we fire that callback.  That gives us a chance to load child nodes before the expand action occurs.</p>

<p>We'll use Connection Manager to get external data.  Here's our <code>loadNodeData</code> function, with comments describing what happens at each step.</p>

<textarea name="code" class="JScript" cols="60" rows="1">function loadNodeData(node, fnLoadComplete)  {
    
    //We'll create child nodes based on what we get back when we
    //use Connection Manager to pass the text label of the 
    //expanding node to the Yahoo!
    //Search "related suggestions" API.  Here, we're at the 
    //first part of the request -- we'll make the request to the
    //server.  In our Connection Manager success handler, we'll build our new children
    //and then return fnLoadComplete back to the tree.
    
    //Get the node's label and urlencode it; this is the word/s
    //on which we'll search for related words:
    var nodeLabel = encodeURI(node.label);
    
    //prepare URL for XHR request:
    var sUrl = "<?php echo $assetsDirectory; ?>ysuggest_proxy.php?query=" + nodeLabel;
    
    //prepare our callback object
    var callback = {
    
        //if our XHR call is successful, we want to make use
        //of the returned data and create child nodes.
        success: function(oResponse) {
            YAHOO.log("XHR transaction was successful.", "info", "example");
            console.log(oResponse.responseText);
            var oResults = eval("(" + oResponse.responseText + ")");
            if((oResults.ResultSet.Result) && (oResults.ResultSet.Result.length)) {
                //Result is an array if more than one result, string otherwise
                if(YAHOO.lang.isArray(oResults.ResultSet.Result)) {
                    for (var i=0, j=oResults.ResultSet.Result.length; i<j; i++) {
                        var tempNode = new YAHOO.widget.TextNode(oResults.ResultSet.Result[i], node, false);
                    }
                } else {
                    //there is only one result; comes as string:
                    var tempNode = new YAHOO.widget.TextNode(oResults.ResultSet.Result, node, false)
                }
            }
                                
            //When we're done creating child nodes, we execute the node's
            //loadComplete callback method which comes in via the argument
            //in the response object (we could also access it at node.loadComplete,
            //if necessary):
            oResponse.argument.fnLoadComplete();
        },
        
        //if our XHR call is not successful, we want to
        //fire the TreeView callback and let the Tree
        //proceed with its business.
        failure: function(oResponse) {
            YAHOO.log("Failed to process XHR transaction.", "info", "example");
            oResponse.argument.fnLoadComplete();
        },
        
        //our handlers for the XHR response will need the same
        //argument information we got to loadNodeData, so
        //we'll pass those along:
        argument: {
            "node": node,
            "fnLoadComplete": fnLoadComplete
        },
        
        //timeout -- if more than 7 seconds go by, we'll abort
        //the transaction and assume there are no children:
        timeout: 7000
    };
    
    //With our callback object ready, it's now time to 
    //make our XHR call using Connection Manager's
    //asyncRequest method:
    YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
}</textarea>

<p>In the codeblock above, we set up our XHR call using Connection Manager and provide the functions that should handle the data that comes back. Here are a few important items to note:</p>
<ol>
    <li><strong>We pass the node and our TreeView callback into our <code>success</code> and <code>failure</code> handlers in the <code>argument</code> member of the Connection Manager <code>callback</code> ojbect.</strong> That allows us to access those important pieces once we get data back from the XHR transaction.
    <li><strong>This process is asynchronous.</strong> <code>loadNodeData</code> completes and returns after it fires off the request via <code>YAHOO.util.Connect.asyncRequest</code>. At a later time, Connection Manager fires either the <code>success</code> or <code>failure</code> function we passed in</li>
  <li><strong>We fire our <code>fnLoadComplete</code> function from both <code>success</code> and <code>failure</code> handlers.</strong> Whether the request succeeds or not, we want TreeView to stop waiting for it at some point. So, if  Connection Manager fires our <code>failure</code> handler, we'll treat that the same way we treat a node that has no children &mdash; we fire <code>fnLoadComplete</code> and move on.</li>
</ol>
