<h2 class="first">Start with your content</h2>
<p>In this example we'll work with content that is already on the page in its entirety.  This is not a requirement.  The story has been divided up into a series of <code>&lt;div&gt;</code>s, each containing a &quot;page&quot; worth of the overall content.</p>

<textarea name="code" class="HTML" rows="1" cols="60">
<div id="content">
    <div>
        <p>Little Jim was, for the ...</p>
        <p>Jim dropped the tongue of ...</p>
    </div>
    <div>
        <p>He went on to the lawn...</p>
        (and so on)
</textarea>

<p>Some CSS is added to identify the individual page divs, and hide all but the current page.</p>

<textarea name="code" class="CSS" rows="1" cols="60">
#content div { /* hide all pages */
    display: none;
}
#demo .page1 div.page1,
#demo .page2 div.page2,
#demo .page3 div.page3,
#demo .page4 div.page4,
#demo .page5 div.page5 { /* display the current page */
    display: block;
}
</textarea>

<p>A container is added above the content for the pagination controls.</p>
<textarea name="code" class="HTML" rows="1" cols="60">
<div id="paging"></div>
<div id="content" class="page1">
    <div class="page1">
        <p>Little Jim was, for the ...</p>
        <p>Jim dropped the tongue of ...</p>
    </div>
    <div class="page2">
        <p>He went on to the lawn...</p>
        (and so on)
</textarea>

<p>This allows us to set a class on <code>div#content</code> and the higher specificity of the CSS selector will override the broadly applied <code>display: none</code>.</p>

<h2>Add pagination support</h2>
<p>In your JavaScript, create method to handle page change requests.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

// Set up the application under the YAHOO.example namespace
var Ex = YAHOO.namespace('example');

Ex.content = YAHOO.util.Dom.get('content');

Ex.handlePagination = function (page) {
    // Show the appropriate content for the requested page
    Ex.content.className = 'page' + page;
};

...
</textarea>

<h2>Create a Paginator</h2>
<p>Now create a Paginator instance to handle the UI and state management.</p>
<textarea name="code" class="JScript" rows="1" cols="60">
Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage : 1, // one div per page
    totalRecords : Ex.content.getElementsByTagName('div').length,
    containers : 'paging' // controls will be rendered into this element
});
</textarea>

<p>Attach the Paginator instance to the method responsible for updating the content by subscribing to its <code>changeRequest</code> event.</p>

<textarea name="code" class="JScript" rows="1" cols="60">

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);

</textarea>

<p>Paginator will pass its <code>changeRequest</code> subscribers a proposed state object, so we'll need to update the <code>handlePagination</code> method accordingly.  Also, Paginator UI interaction only <em>requests</em> a page change, so we need to confirm the change by updating the Paginator's state.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
Ex.handlePagination = function (state) {
    // Show the appropriate content for the requested page
    Ex.content.className = 'page' + state.page;
    
    // Update the Paginator's state, confirming change
    Ex.paginator.setState(state);
};
</textarea>

<h2>Render the Paginator</h2>
<p>The last step is to <code>render()</code> the Paginator instance.</p>

<textarea name="code" class="JScript" rows="1" cols="60">

Ex.paginator.render();

</textarea>

<h2>Full code listing</h2>
<h3>CSS</h3>

<textarea name="code" class="CSS" rows="1" cols="60">
#content {
    background: #fff;
    border: 1px solid #ccc;
    color: #000;
    font-family: Times New Roman, serif;
    padding: 1em 2em;
}

/* hide all pages */
#content div {
    display: none;
}

/* display the current page */
#demo .page1 div.page1,
#demo .page2 div.page2,
#demo .page3 div.page3,
#demo .page4 div.page4,
#demo .page5 div.page5 {
    display: block;
}
</textarea>

<h3>HTML</h3>
<p>Text content clipped for brevity.</p>
<textarea name="code" class="HTML" rows="1" cols="60">
<div id="demo">
    <h2 class="first">The Monster</h2>
    <p>By Stephen Crane</p>

    <div id="paging"></div>

    <div id="content" class="page1">
        <div class="page1">
            <p>Little Jim was...</p>
            <p>Jim dropped the...</p>
        </div>
        <div class="page2">
            <p>He went on to...</p>
            <p>The doctor was...</p>
            <p>The doctor paused...</p>
        </div>
        <div class="page3">
            <p>The doctor stared...</p>
            <p>“Pa!” repeated the...</p>
            <p>“What?” said the...</p>
            <p>After a period of...</p>
        </div>
        <div class="page4">
            <p>It seemed that the...</p>
            <p>The doctor mused...</p>
            <p>Together they...</p>
            <p>“Where?” said...</p>
            <p>Jimmie kicked at...</p>
        </div>
        <div class="page5">
            <p>The doctor was...</p>
            <p>The father reflected...</p>
            <p>The child answered...</p>
        </div>
    </div>
</div>
</textarea>

<h3>JavaScript</h3>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

// Set up the application under the YAHOO.example namespace
var Ex = YAHOO.namespace('example');

Ex.content    = YAHOO.util.Dom.get('content');

Ex.handlePagination = function (state) {
    // Show the appropriate content for the requested page
    Ex.content.className = 'page' + state.page;
    
    // Update the Paginator's state, confirming change
    Ex.paginator.setState(state);
};

// Create the Paginator widget and subscribe to its changeRequest event
Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage : 1,
    totalRecords : Ex.content.getElementsByTagName('div').length,
    containers : 'paging'
});

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);

// Render the Paginator into the configured container(s)
Ex.paginator.render();

});
</textarea>
