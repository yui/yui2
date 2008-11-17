<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">{"recordsReturned":504,
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

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">
#paginated {
    text-align: center;
}
#paginated table {
    margin-left:auto; margin-right:auto;
}
#paginated, #paginated .yui-dt-loading {
    text-align: center; background-color: transparent;
}
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="paginated"></div>
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.ClientPagination = function() {
        var myColumnDefs = [
            {key:"id", label:"ID"},
            {key:"name", label:"Name"},
            {key:"date", label:"Date"},
            {key:"price", label:"Price"},
            {key:"number", label:"Number"}
        ];

        var myDataSource = new YAHOO.util.DataSource("<?php echo("{$assetsDirectory}php/json_proxy.php?"); ?>");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.responseSchema = {
            resultsList: "records",
            fields: ["id","name","date","price","number"]
        };

        var oConfigs = {
                paginator: new YAHOO.widget.Paginator({
                    rowsPerPage: 15
                }),
                initialRequest: "results=504"
        };
        var myDataTable = new YAHOO.widget.DataTable("paginated", myColumnDefs,
                myDataSource, oConfigs);
                
        return {
            oDS: myDataSource,
            oDT: myDataTable
        };
    }();
});
</textarea>
