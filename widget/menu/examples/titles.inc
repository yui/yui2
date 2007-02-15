<?php

    $g_aTitles = array(
    
        "example01.html" => "Basic Menu From Markup",
        "example02.html" => "Basic Menu From JavaScript",
        "example03.html" => "Grouped Menu Items Using Markup",
        "example04.html" => "Grouped Menu Items Using JavaScript",
        "example05.html" => "Grouped Menu Items With Titles From Markup",
        "example06.html" => "Grouped Menu Items With Titles From JavaScript",
        "example07.html" => "Multi-tiered Menu From Markup",
        "example08.html" => "Multi-tiered Menu From JavaScript",
        "example09.html" => "Handling Menu Click Events",
        "example10.html" => "Listening For Menu Events",
        "example11.html" => "MenuItem Configuration Properties",
        "example12.html" => "Setting Menu Configuration Properties At Runtime",

        "leftnavfrommarkup.html" => "Website Left Nav With Submenus Built From Markup",
        "leftnavfromjs.html" => "Website Left Nav With Submenus From JavaScript",
        "topnavfrommarkup.html" => "Website Top Nav With Submenus Built From Markup",
        "topnavfromjs.html" => "Website Top Nav With Submenus From JavaScript",

        "leftnavfrommarkupwithanim.html" => "Website Left Nav Using Animation With Submenus Built From Markup",
        "leftnavfromjswithanim.html" => "Website Left Nav Using Animation With Submenus From JavaScript",
        "topnavfrommarkupwithanim.html" => "Website Top Nav Using Animation With Submenus Built From Markup",
        "topnavfromjswithanim.html" => "Website Top Nav Using Animation With Submenus From JavaScript",

        "contextmenu.html" => "Context Menu",
        "tablecontextmenu.html" => "Adding A Context Menu To A Table",
        "treeviewcontextmenu.html" => "Adding A Context Menu To A TreeView",
        "programsmenu.html" => "OS-Style Programs Menu",
        "applicationmenubar.html" => "Application Menubar"

    );


    function writeTitle() {

        global $g_aTitles;

        $sFilePath = getenv("PHP_SELF");
        $aStrings = explode("/", $sFilePath);
        $sIndex = $aStrings[(count($aStrings) - 1)];

        echo "Example: " . $g_aTitles[$sIndex] . " (YUI Library)";
    
    }

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">