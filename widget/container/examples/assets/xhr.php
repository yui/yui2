<?php 
error_reporting(0);

// Open the Curl session
$session = curl_init("http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&" . $_SERVER['QUERY_STRING']);

// Don't return HTTP headers. 
// Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$results = curl_exec($session);

echo $results;
curl_close($session);

?>