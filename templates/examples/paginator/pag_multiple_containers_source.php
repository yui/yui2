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
<script type="text/javascript" src="<?php echo($assetsDirectory); ?>top40.js"></script>
<script type="text/javascript">
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
});
</script>
