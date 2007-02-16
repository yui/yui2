
        <!-- Dependency source files -->
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/yahoo-dom-event/yahoo-dom-event.js"></script>
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/element/element-beta.js"></script>
<?php

    if($g_sBuildType == "dev") {
?>

        <!-- Logger source file -->
        <script type="text/javascript" src="../../../build/logger/logger.js"></script>
<?php
    }

    if(is_callable("include_custom_scripts")) {

        include_custom_scripts();

    }
?>

        <!-- Button source file -->
<?php
    if($g_sBuildType == "dev") {
?>
        <script type="text/javascript" src="../src/js/button.js"></script>
        <script type="text/javascript" src="../src/js/buttongroup.js"></script>
<?php
    }
    else if($g_sBuildType == "prod") {
?>
        <script type="text/javascript" src="../../build/button/button-beta.js"></script>
<?php
    }
?>