<h2 class="first">Example Data</h2>
<p>In this example, we'll be working with a data array stored in <code>YAHOO.example.data.top40</code>.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.namespace('example.data').top40 = [
    "Walk Like An Egyptian - Bangles",
    "Alone - Heart",
    ...
];
</textarea>

<h2>Start with the content</h2>
<p>All of Paginator's UI Components render inline elements, so you can include them almost anywhere.  We'll create two container elements in our content, a <code>&lt;span&gt;</code>, nested in a paragraph above the list, and a separate <code>&lt;p&gt;</code> below it.</p>

<textarea name="code" class="HTML" rows="1" cols="60">
<div id="demo">
    <h2>1987 US Billboard Top 40!</h2>

    <p>
        Random content with pagination controls embedded inline.
        Suspendisse vestibulum dignissim quam. Integer vel augue.
        Phasellus nulla purus, interdum ac, and here they are.
        <span id="span_container"></span>
        and now back to random content habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas.
    </p>

    <ol id="content" start="1">
        <!-- the paginated content will go here -->
    </ol>

    <p id="p_container"></p>
</div>
</textarea>

<h2>Add code to update the content region</h2>
<p>We'll generate the content by pulling a <code>slice</code> of our data array and wrapping each item in <code>&lt;li&gt;</code> and <code>&lt;p&gt;</code> tags.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

// Place code in the YAHOO.example namespace
var Ex = YAHOO.namespace('example');

Ex.content = YAHOO.util.Dom.get('content');

Ex.handlePagination = function (index,count) {
    // Gather the content for the requested page
    var recs = Ex.data.top40.slice(index, index + count);

    // Update the content UI
    Ex.content.start = index + 1;
    Ex.content.innerHTML = '<li><p>'+recs.join('</p></li><li><p>')+'</p></li>';
};

...
</textarea>

<h2>Add pagination</h2>
<p>Create a Paginator, identifying the two containers <code>span_container</code> and <code>p_container</code>.  For fun, we use a custom <code>template</code> and configure the included UI Components for extra customization.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage : 10,
    totalRecords : Ex.data.top40.length,
    containers : ['span_container','p_container'],

    template : "{PreviousPageLink} {CurrentPageReport} {NextPageLink}",
    previousPageLinkLabel : "&amp;lt;",
    nextPageLinkLabel : "&amp;gt;",
    pageReportTemplate : "{startRecord} - {endRecord} of the Top {totalRecords}"
});
</textarea>

<p>Attach the content handler to the Paginator's <code>changeRequest</code> event and make the appropriate changes in the handler to use the Paginator's passed state data.  <code>render()</code> the Paginator and, in this case, call the content generation code directly to initialize the list.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
Ex.handlePagination = function (state) {
    // Gather the content for the requested page
    var startIndex = state.recordOffset,
        recs = Ex.data.top40.slice(startIndex, startIndex + state.rowsPerPage);

    // Update the content UI
    Ex.content.start = startIndex + 1;
    Ex.content.innerHTML = '<li><p>'+recs.join('</p></li><li><p>')+'</p></li>';

    // Confirm state change with the Paginator
    Ex.paginator.setState(state);
};

...

Ex.paginator.subscribe('changeRequest', Ex.handlePagination);

Ex.paginator.render();

// To populate the list initially, call the handler directly passing
// the Paginator's current state
Ex.handlePagination(Ex.paginator.getState());
</textarea>

<h2>Add style</h2>
<p>For this example, we've given the UI Components some special visual treatment.  Outside of this, there is one CSS override that was necessary for the <code>&lt;span&gt;</code> container.</p>
<p>Though the elements themselves are inline elements, the container is styled as <code>display: block</code> by Sam skin.  To keep the <code>&lt;span&gt;</code> from breaking the normal rendering of the enclosing <code>&lt;p&gt;</code>, we add the following CSS:</p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* override some skin styles */
.yui-skin-sam span.yui-pg-container {
    display: inline;
}
</textarea>

<h2>Full code listing</h2>
<h3>JavaScript</h3>

<textarea name="code" class="JScript" rows="1" cols="60">
YAHOO.util.Event.onDOMReady(function () {

// Place code in the YAHOO.example namespace
var Ex = YAHOO.namespace('example');

Ex.content = YAHOO.util.Dom.get('content');

Ex.handlePagination = function (state) {
    // Gather the content for the requested page
    var startIndex = state.recordOffset,
        recs = Ex.data.top40.slice(startIndex, startIndex + state.rowsPerPage);

    // Update the content UI
    Ex.content.start = startIndex + 1;
    Ex.content.innerHTML = '<li><p>'+recs.join('</p></li><li><p>')+'</p></li>';

    // Confirm state change with the Paginator
    Ex.paginator.setState(state);
};

Ex.paginator = new YAHOO.widget.Paginator({
    rowsPerPage : 10,
    totalRecords : Ex.data.top40.length,
    containers : ['span_container','p_container'],

    template : "{PreviousPageLink} {CurrentPageReport} {NextPageLink}",
    previousPageLinkLabel : "&lt;",
    nextPageLinkLabel : "&gt;",
    pageReportTemplate : "{startRecord} - {endRecord} of the Top {totalRecords}"
});


Ex.paginator.subscribe('changeRequest', Ex.handlePagination);

Ex.paginator.render();

Ex.handlePagination(Ex.paginator.getState());
</textarea>

<h3>CSS</h3>

<textarea name="code" class="JScript" rows="1" cols="60">
/* override some skin styles */
.yui-skin-sam span.yui-pg-container {
    display: inline;
}
.yui-skin-sam .yui-pg-current {
    margin: 0;
}
.yui-skin-sam #demo .yui-pg-container a:link,
.yui-skin-sam #demo .yui-pg-container a:active,
.yui-skin-sam #demo .yui-pg-container a:visited,
.yui-skin-sam #demo .yui-pg-container a:hover,
.yui-skin-sam #demo .yui-pg-container span.yui-pg-previous,
.yui-skin-sam #demo .yui-pg-container span.yui-pg-next {
    background: #fde;
    color: #f3c;
    text-decoration: none;
    border: 3px solid #f9c;
    padding: 0 3px;
    font-size: 130%;
    font-weight: bold;
}
.yui-skin-sam #demo .yui-pg-container span.yui-pg-previous,
.yui-skin-sam #demo .yui-pg-container span.yui-pg-next {
    background: #eee;
    color: #a6a6a6;
    border: 3px double #ccc;
}
.yui-skin-sam #demo .yui-pg-container a:hover {
    background: #f9c;
    color: #fff;
}

/* demo specific styles */
#demo h2 {
    border: none;
    border-bottom: 1ex solid #aaa;
    color: #333;
    font-size: 1.5em;
    line-height: 65%;
    margin-top: 0;
}
#content {
    margin: 0 0 0 4em;
    padding-top: 1em;
}
#content li {
    color: #f6c;
    font: bold italic 200%/.5 Arial, sans-serif;
    padding: 1px 0;
    margin: 0;
}
#content li p {
    color: #555;
    font: normal 50% Arial, sans-serif;
    margin: 0;
    line-height: 2;
}

#p_container {
    text-align: center;
}
</textarea>
