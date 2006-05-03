<?php

header("Content-Type:text/xml");

$url = 'http://xml.weather.yahoo.com/forecastrss?'.getenv('QUERY_STRING');

function getResource($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
}

$feed = getResource($url);
echo $feed;
?>
