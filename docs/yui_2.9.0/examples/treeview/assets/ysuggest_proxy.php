<?php
/* yadl_spaceid - Skip Stamping */
// Yahoo! Search proxy

// Hard-code hostname and path:
// define ('PATH', 'http://search.yahooapis.com/WebSearchService/V1/relatedSuggestion?appid=YahooDemo&output=json&query=');
define ('PATH', 'http://us.music.yahooapis.com/artist/v1/list/similar/256352?output=json&query=');
// http://us.music.yahooapis.com/artist/v1/list/similar/289282?start=1&count=25


$type = "application/json";
$query = urlencode($_GET["query"]);
$url = PATH.$query;

$yql_base_url = "http://query.yahooapis.com/v1/public/yql";
// $yql_query = "select * from upcoming.events where location='San Francisco' and search_text='dance'"
$yql_query = "select * from music.track.search where keyword='" . $query . "'";
$yql_query_url = $yql_base_url . "?q=" . urlencode($yql_query);
$yql_query_url .= "&format=json";

// Open the Curl session
// $session = curl_init($url);
$session = curl_init($yql_query_url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

header("Content-Type: ".$type);
echo $response;
curl_close($session);
?>
