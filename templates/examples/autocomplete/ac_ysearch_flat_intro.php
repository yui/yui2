<p>This example demonstrates AutoComplete's <code>queryMatchSubset</code> property. The first instance of AutoComplete has <code>queryMatchSubset</code> enabled for maximum cache performance such that as you type, the query is searched within previously cached results. For best results, the DataSource should return a complete set of results when a single letter is queried such that subset matching will also return a complete set of results.</p>

<p>The second AutoComplete instance does not enable <code>queryMatchSubset</code>
so each typed letter results in a new request to the server.</p>
