<?php

    $g_sType = "dev";
    $bUseGrids = (isset($g_bUseGrids) && $g_bUseGrids == true);
    $bUseLogger = (isset($g_bUseLogger) && $g_bUseLogger == true);
    
    if($g_sType == "dev") {
?>
        <!-- Stanard reset and fonts -->
        <link rel="stylesheet" type="text/css" href="../../../build/reset/reset.css">
        <link rel="stylesheet" type="text/css" href="../../../build/fonts/fonts.css">
    
        <!-- CSS for Menu -->
        <link rel="stylesheet" type="text/css" href="../src/css/menu.css">

<?php
        if($bUseGrids) {
?>    

        <!-- Grids -->
        <link rel="stylesheet" type="text/css" href="../../../build/grids/grids.css">
<?php
        }

        if($bUseLogger) {
?>    

        <!-- Logger CSS -->
        <link rel="stylesheet" type="text/css" href="../../../build/logger/assets/logger.css">
<?php
        }

    }
    else if($g_sType == "build") {
?>
        <!-- Stanard reset and fonts -->
        <link rel="stylesheet" type="text/css" href="../../build/reset/reset.css">
        <link rel="stylesheet" type="text/css" href="../../build/fonts/fonts.css">
    
<?php
        if($bUseGrids) {
?>    

        <!-- Grids -->
        <link rel="stylesheet" type="text/css" href="../../build/grids/grids.css">
<?php
        }

        if($bUseLogger) {
?>    

        <!-- Logger CSS -->
        <link rel="stylesheet" type="text/css" href="../../build/logger/assets/logger.css">
<?php
        }
?>


        <!-- CSS for Menu -->
        <link rel="stylesheet" type="text/css" href="../../build/menu/assets/menu.css">
<?php
    }
?>