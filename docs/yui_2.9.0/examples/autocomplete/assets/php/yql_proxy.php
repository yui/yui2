<?php

/* yadl_spaceid - Skip Stamping */

// Yahoo! proxy

// Hard-code hostname and path:
define ('PATH', 'http://query.yahooapis.com/v1/public/yql');

$type = "application/json";

// Get all query params
$query = PATH . "?q=";
$q = str_replace('&quot;', '"', $_GET['q']);
$url = $query . urlencode(stripslashes($q));

if($_GET['format'] == "xml") {
        $type = "text/xml";
}

// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

header("Content-Type: ".$type);
echo $response;
curl_close($session);

?>
