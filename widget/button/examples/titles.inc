<?php

    $g_aTitles = array(
    
        "example01.html" => "Push Buttons",
        "example02.html" => "Link Buttons",
        "example03.html" => "Checkbox Buttons",
        "example04.html" => "Radio Buttons",
        "example05.html" => "Submit Buttons",
        "example06.html" => "Reset Buttons",
        "example07.html" => "Menu Buttons",
        "example08.html" => "Split Buttons"

    );

    $g_sFilePath = getenv("PHP_SELF");
    $g_aStrings = explode("/", $g_sFilePath);
    $g_sFileName = $g_aStrings[(count($g_aStrings) - 1)];

    function writeTitle() {

        global $g_aTitles;
        global $g_sFileName;

        echo "Example: " . $g_aTitles[$g_sFileName] . " (YUI Library)";
    
    }

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">