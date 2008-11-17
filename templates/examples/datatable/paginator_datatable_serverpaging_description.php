<h2 class="first">Markup for this Example</h2>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">
    <div id="paging"></div>
    <div id="dt"></div>
</div>
</textarea>

<h2>Data</h2>
<p>The DataSource will deliver JSON data in the following format:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
{
    "recordsReturned":25,
    "totalRecords":1397,
    "startIndex":0,
    "sort":null,
    "dir":"asc",
    "records":[
        {"id":"0",
        "name":"xmlqoyzgmykrphvyiz",
        "date":"13-Sep-2002",
        "price":"8370",
        "number":"8056",
        "address":"qdfbc",
        "company":"taufrid",
        "desc":"pppzhfhcdqcvbirw",
        "age":"5512",
        "title":"zticbcd",
        "phone":"hvdkltabshgakjqmfrvxo",
        "email":"eodnqepua",
        "zip":"eodnqepua",
        "country":"pdibxicpqipbsgnxyjumsza"},
        ...
    ]
}
</textarea>

<h2>JavaScript</h2>

<h3>Set up the DataSource</h3>
<ul>
    <li><code>responseSchema.resultsList</code> is set to the location in the JSON response of the key holding the list of records for the current page.</li>
    <li><code>responseSchema.metaFields</code> is used to identify the location of the key in the parsed JSON response containing the <code>totalRecords</code> for the Paginator.</li>
    <li>A custom function is created to translate JavaScript paging requests into something useful to the server.</li>
</ul>

<textarea name="code" class="JScript" cols="60" rows="1">
// Set up the DataSource
var mySource = new YAHOO.util.DataSource('<?php echo("{$assetsDirectory}php/json_proxy.php?")?>');
mySource.responseType   = YAHOO.util.DataSource.TYPE_JSON;
mySource.responseSchema = {
        resultsList : 'records',
        fields      : [
            'id','name','date','price','number','address','company',
            'desc','age','title','phone','email','zip','country'],
        metaFields : {
            totalRecords: 'totalRecords' // The totalRecords meta field is
                                          // a "magic" meta, and will be passed
                                          // to the Paginator.
        }
};

// A custom function to translate the js paging request into a query
// string sent to the XHR DataSource
var buildQueryString = function (state,dt) {
    return "startIndex=" + state.pagination.recordOffset +
           "&results=" + state.pagination.rowsPerPage;
};
</textarea>

<h3>Create a Paginator</h3>
<p>For this example, we use a single container rather than allow DataTable to assign its default pagination containers.  A custom layout for the pagination controls is used, set in the <code>template</code> attribute.</p>
<p><strong>Note:</strong> the <code>rowsPerPage</code> configuration is required for all Paginator instances.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Set up the Paginator instance.  
var myPaginator = new YAHOO.widget.Paginator({
    containers         : ['paging'],
    pageLinks          : 5,
    rowsPerPage        : 15,
    rowsPerPageOptions : [15,30,60],
    template           : "<strong>{CurrentPageReport}</strong> {PreviousPageLink} {PageLinks} {NextPageLink} {RowsPerPageDropdown}"
});
</textarea>

<h3>Hooking everything together in the DataTable config</h3>
<p>Here's the interesting part.</p>
<ul>
    <li><code>initialRequest</code> needs to target data that will populate <strong>at least</strong> the data on the page specified in the Paginator's <code>initialPage</code> configuration (1 by default).</li>
    <li><code>dynamicData</code> is set to true to inform the DataTable that its RecordSet contains only a subset of data from the source.</li>
    <li><code>generateRequest</code> is set to our custom function.</li>
    <li><code>paginator</code> is assigned the Paginator instance.</li>
    <li><code>paginationEventHandler</code> is set to DataTable's default DataSource relay, <code>handleDataSourcePagination</code>.  If more intricate DataSource interaction is needed, assign a custom function.</li>
</ul>

<textarea name="code" class="JScript" cols="60" rows="1">
var myTableConfig = {
    initialRequest         : 'startIndex=0&results=25',
    dynamicData            : true,
    generateRequest        : buildQueryString,
    paginator              : myPaginator,
    paginationEventHandler : DataTable.handleDataSourcePagination
};
</textarea>

<h3>Voila, Server side paginated DataTable!</h3>
<p>Finally, instantiate the DataTable with the DataSource and configuration.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// The columns to show in this table.
var myColumnDefs = [
    {key:"id"},
    {key:"date"},
    {key:"price"},
    {key:"age"},
    {key:"desc"}
];

var myTable = new YAHOO.widget.DataTable('dt',
                    myColumnDefs, mySource, myTableConfig);
</textarea>
