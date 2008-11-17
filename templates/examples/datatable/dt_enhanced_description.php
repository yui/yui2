<h2 class="first">Sample Code for this Example</h2>

<p>Data:</p>

<textarea name="code" class="HTML" cols="60" rows="1">/* Data is derived from the HTML TABLE element. */
</textarea>

<p>CSS:</p>

<textarea name="code" class="CSS" cols="60" rows="1">/* No custom CSS. */
</textarea>

<p>Markup:</p>

<textarea name="code" class="HTML" cols="60" rows="1">&lt;div id="markup"&gt;
    &lt;table id="accounts"&gt;
        &lt;thead&gt;
            &lt;tr&gt;
                &lt;th&gt;Due Date&lt;/th&gt;
                &lt;th&gt;Account Number&lt;/th&gt;
                &lt;th&gt;Quantity&lt;/th&gt;
                &lt;th&gt;Amount Due&lt;/th&gt;
            &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
            &lt;tr&gt;
                &lt;td&gt;1/23/1999&lt;/td&gt;
                &lt;td&gt;29e8548592d8c82&lt;/td&gt;
                &lt;td&gt;12&lt;/td&gt;
                &lt;td&gt;$150.00&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;5/19/1999&lt;/td&gt;
                &lt;td&gt;83849&lt;/td&gt;
                &lt;td&gt;8&lt;/td&gt;
                &lt;td&gt;$60.00&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;8/9/1999&lt;/td&gt;
                &lt;td&gt;11348&lt;/td&gt;
                &lt;td&gt;1&lt;/td&gt;
                &lt;td&gt;$34.99&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;1/23/2000&lt;/td&gt;
                &lt;td&gt;29e8548592d8c82&lt;/td&gt;
                &lt;td&gt;10&lt;/td&gt;
                &lt;td&gt;$1.00&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;4/28/2000&lt;/td&gt;
                &lt;td&gt;37892857482836437378273&lt;/td&gt;
                &lt;td&gt;123&lt;/td&gt;
                &lt;td&gt;$33.32&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;1/23/2001&lt;/td&gt;
                &lt;td&gt;83849&lt;/td&gt;
                &lt;td&gt;5&lt;/td&gt;
                &lt;td&gt;$15.00&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;9/30/2001&lt;/td&gt;
                &lt;td&gt;224747&lt;/td&gt;
                &lt;td&gt;14&lt;/td&gt;
                &lt;td&gt;$56.78&lt;/td&gt;
            &lt;/tr&gt;
        &lt;/tbody&gt;
    &lt;/table&gt;
&lt;/div&gt;
</textarea>

<p>JavaScript:</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener(window, "load", function() {
    YAHOO.example.EnhanceFromMarkup = new function() {
        var myColumnDefs = [
            {key:"due",label:"Due Date",formatter:YAHOO.widget.DataTable.formatDate,sortable:true},
            {key:"account",label:"Account Number", sortable:true},
            {key:"quantity",label:"Quantity",formatter:YAHOO.widget.DataTable.formatNumber,sortable:true},
            {key:"amount",label:"Amount Due",formatter:YAHOO.widget.DataTable.formatCurrency,sortable:true}
        ];

        this.parseNumberFromCurrency = function(sString) {
            // Remove dollar sign and make it a float
            return parseFloat(sString.substring(1));
        };

        this.myDataSource = new YAHOO.util.DataSource(YAHOO.util.Dom.get("accounts"));
        this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;
        this.myDataSource.responseSchema = {
            fields: [{key:"due", parser:"date"},
                    {key:"account"},
                    {key:"quantity", parser:"number"},
                    {key:"amount", parser:this.parseNumberFromCurrency} // point to a custom parser
            ]
        };

        this.myDataTable = new YAHOO.widget.DataTable("markup", myColumnDefs, this.myDataSource,
                {caption:"Example: Progressively Enhanced Table from Markup",
                sortedBy:{key:"due",dir:"desc"}}
        );
    };
});
</textarea>
