<?php

$g_sBuildType = isset($argv) && $argv[1] == "prod" ? "prod" : "dev";


if($g_sBuildType == "dev") {

    $g_sBasePath = "../../..";
    $sButtonCSSPath = "../src/css";

}
else if($g_sBuildType == "prod") {

    $g_sBasePath = "../..";
    $sButtonCSSPath = "../../build/button/assets";

}

?>
<!-- Reset and Fonts -->
        <link rel="stylesheet" type="text/css" href="<?php echo $g_sBasePath; ?>/build/reset/reset.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $g_sBasePath; ?>/build/fonts/fonts.css">
<?php

        if(is_callable("include_custom_styles")) {

            include_custom_styles();

        }
?> 
        <!-- CSS for Button -->
        <link rel="stylesheet" type="text/css" href="<?php echo $sButtonCSSPath; ?>/button-core.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $sButtonCSSPath; ?>/skins/sam/button-skin.css">
 