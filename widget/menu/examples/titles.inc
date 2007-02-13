<?php

    $g_aTitles = array(
    
        "Basic Menu From Markup",
        "Basic Menu From JavaScript",
        "Grouped Menu Items Using Markup",
        "Grouped Menu Items Using JavaScript",
        "Grouped Menu Items With Titles From Markup",
        "Grouped Menu Items With Titles From JavaScript",
        "Multi-tiered Menu From Markup",
        "Multi-tiered Menu From JavaScript",
        "Handling Menu Click Events",
        "Listening For Menu Events",
        "MenuItem Configuration Properties",
        "Setting Menu Configuration Properties At Runtime",
        "Customizing Menu Image Paths",

        "Website Left Nav With Submenus Built From Markup",
        "Website Left Nav With Submenus From JavaScript",
        "Website Top Nav With Submenus Built From Markup",
        "Website Top Nav With Submenus From JavaScript",

        "Website Left Nav Using Animation With Submenus Built From Markup",
        "Website Left Nav Using Animation With Submenus From JavaScript",
        "Website Top Nav Using Animation With Submenus Built From Markup",
        "Website Top Nav Using Animation With Submenus From JavaScript",

        "Context Menu",
        "OS-Style Programs Menu",
        "Application Menubar",
        "Adding A Context Menu To A Table",
        "Adding A Context Menu To A TreeView"

    );


    function writeTitle($p_nIndex) {

        global $g_aTitles;

        echo "Example: " . $g_aTitles[$p_nIndex] . " (YUI Library)";
    
    }

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
