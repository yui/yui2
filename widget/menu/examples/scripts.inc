        <!-- Namespace source file -->
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/yahoo/yahoo.js"></script>

        <!-- Dependency source files -->
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/event/event.js"></script>
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/dom/dom.js"></script>

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

    $bUseContainerCore = (isset($g_bUseContainerCore) && $g_bUseContainerCore == false) ? false : true;


    if($g_sBuildType == "dev") {
?>

        <script type="text/javascript" src="../../container/src/js/Config.js"></script>
        <script type="text/javascript" src="../../container/src/js/Module.js"></script>
        <script type="text/javascript" src="../../container/src/js/Overlay.js"></script>
        <script type="text/javascript" src="../../container/src/js/OverlayManager.js"></script>

<?php

        if(!$bUseContainerCore) {
?>        
        <script type="text/javascript" src="../../container/src/js/Panel.js"></script>
        <script type="text/javascript" src="../../container/src/js/Dialog.js"></script>
        <script type="text/javascript" src="../../container/src/js/ContainerEffect.js"></script>
        <script type="text/javascript" src="../../container/src/js/SimpleDialog.js"></script>
        <script type="text/javascript" src="../../container/src/js/KeyListener.js"></script>
<?php
        }

    }
    else if($g_sBuildType == "prod") {
?>

        <!-- Container source file -->
<?php
        if($bUseContainerCore) {
?>
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/container/container_core.js"></script>
<?php        
        }
        else {
?>
        <script type="text/javascript" src="<?php echo $g_sBasePath; ?>/build/container/container.js"></script>
<?php        
        }

    }
?>

        <!-- Menu source file -->
<?php
    if($g_sBuildType == "dev") {
?>
        <script type="text/javascript" src="../src/js/menumanager.js"></script>
        <script type="text/javascript" src="../src/js/menu.js"></script>
        <script type="text/javascript" src="../src/js/menuitem.js"></script>
        <script type="text/javascript" src="../src/js/menubar.js"></script>
        <script type="text/javascript" src="../src/js/menubaritem.js"></script>
        <script type="text/javascript" src="../src/js/contextmenu.js"></script>
        <script type="text/javascript" src="../src/js/contextmenuitem.js"></script>
<?php
    }
    else if($g_sBuildType == "prod") {
?>
        <script type="text/javascript" src="../../build/menu/menu.js"></script>
<?php
    }
?>