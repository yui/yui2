<div id="demo">
    <div id="paging"></div>
    <div id="dt"></div>
</div>
<script type="text/javascript">
YAHOO.util.Event.onDOMReady(function () {
    var DataSource = YAHOO.util.DataSource,
        DataTable  = YAHOO.widget.DataTable,
        Paginator  = YAHOO.widget.Paginator;

    var mySource = new DataSource('<?php echo("{$assetsDirectory}php/json_proxy.php?")?>');
    mySource.responseType   = DataSource.TYPE_JSON;
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

    var buildQueryString = function (state,dt) {
        return "startIndex=" + state.pagination.recordOffset +
               "&results=" + state.pagination.rowsPerPage;
    };

    var myPaginator = new Paginator({
        containers         : ['paging'],
        pageLinks          : 5,
        rowsPerPage        : 15,
        rowsPerPageOptions : [15,30,60],
        template           : "<strong>{CurrentPageReport}</strong> {PreviousPageLink} {PageLinks} {NextPageLink} {RowsPerPageDropdown}"
    });

    var myTableConfig = {
        initialRequest         : 'startIndex=0&results=25',
        dynamicData            : true,
        generateRequest        : buildQueryString,
        paginationEventHandler : DataTable.handleDataSourcePagination,
        paginator              : myPaginator
    };

    var myColumnDefs = [
        {key:"id"},
        {key:"date"},
        {key:"price"},
        {key:"age"},
        {key:"desc"}
    ];

    var myTable = new DataTable('dt', myColumnDefs, mySource, myTableConfig);
});
</script>
