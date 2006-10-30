<?php

$g_sBuildType = "dev";

if($g_sBuildType == "dev") {

    $g_sBasePath = "../../..";
    $sMenuCSSPath = "../src/css";

}
else if($g_sBuildType == "prod") {

    $g_sBasePath = "../..";
    $sMenuCSSPath = "../../build/menu/assets";

}

?>
    <!-- Standard reset and fonts -->
        <link rel="stylesheet" type="text/css" href="<?php echo $g_sBasePath; ?>/build/reset/reset.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $g_sBasePath; ?>/build/fonts/fonts.css">

<?php
        if(is_callable("include_custom_styles")) {

            include_custom_styles();

        }
?> 

        <!-- CSS for Menu -->
        <link rel="stylesheet" type="text/css" href="<?php echo $sMenuCSSPath; ?>/menu.css">
 
