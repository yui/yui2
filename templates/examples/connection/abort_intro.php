<p>
This example illustrates <a href="http://developer.yahoo.com/yui/connection/">Connection Manager</a>'s built-in transaction timeout functionality.
</p>

<p>Click the "Create Two Transactions" button below.  Two requests will be made to a PHP script that is designed to respond slowly, waiting between 0 and 10 seconds to respond.  If the response takes longer than 1.5 seconds, the request will automatically abort (resulting in a "transaction aborted" message).</p>