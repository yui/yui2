<?php

    if($g_sType == "dev") {
?>

        <!-- Namespace source file -->
        <script type="text/javascript" src="../../../build/yahoo/yahoo.js"></script>
        
        <!-- Dependency source files -->
        <script type="text/javascript" src="../../../build/event/event.js"></script>
        <script type="text/javascript" src="../../../build/dom/dom.js"></script>

        <script type="text/javascript" src="../../container/src/js/Config.js"></script>
        <script type="text/javascript" src="../../container/src/js/Module.js"></script>
        <script type="text/javascript" src="../../container/src/js/Overlay.js"></script>
        <script type="text/javascript" src="../../container/src/js/OverlayManager.js"></script>

        <!-- Menu source file -->
        <script type="text/javascript" src="../src/js/menumodule.js"></script>
        <script type="text/javascript" src="../src/js/menumoduleitem.js"></script>
        <script type="text/javascript" src="../src/js/menu.js"></script>
        <script type="text/javascript" src="../src/js/menuitem.js"></script>
        <script type="text/javascript" src="../src/js/menubar.js"></script>
        <script type="text/javascript" src="../src/js/menubaritem.js"></script>
        <script type="text/javascript" src="../src/js/contextmenu.js"></script>
        <script type="text/javascript" src="../src/js/contextmenuitem.js"></script>

        <!-- Logger source file -->
        <script type="text/javascript" src="../../../build/logger/logger.js"></script>

<?php
    }
    else if($g_sType == "debug") {
?>

        <!-- Namespace source file -->
        <script type="text/javascript" src="../../../build/yahoo/yahoo.js"></script>
        
        <!-- Dependency source files -->
        <script type="text/javascript" src="../../../build/event/event-debug.js"></script>
        <script type="text/javascript" src="../../../build/dom/dom.js"></script>
        <script type="text/javascript" src="../../container/src/js/Config.js"></script>
        <script type="text/javascript" src="../../container/src/js/Module.js"></script>
        <script type="text/javascript" src="../../container/src/js/Overlay.js"></script>
        <script type="text/javascript" src="../../container/src/js/OverlayManager.js"></script>

        <!-- Logger source file -->
        <script type="text/javascript" src="../../../build/logger/logger.js"></script>

        <!-- Menu source file -->
        <script type="text/javascript" src="../src/js/menumodule.js"></script>
        <script type="text/javascript" src="../src/js/menumoduleitem.js"></script>
        <script type="text/javascript" src="../src/js/menu.js"></script>
        <script type="text/javascript" src="../src/js/menuitem.js"></script>
        <script type="text/javascript" src="../src/js/menubar.js"></script>
        <script type="text/javascript" src="../src/js/menubaritem.js"></script>
        <script type="text/javascript" src="../src/js/contextmenu.js"></script>
        <script type="text/javascript" src="../src/js/contextmenuitem.js"></script>
        
        <script type="text/javascript">
        
            function createLogger() {

                var oLogReader = new YAHOO.widget.LogReader();
        
            }
            
            YAHOO.util.Event.addListener(window, "load", createLogger);
        
        </script>        
<?php
    }
    else if($g_sType == "build") {
?>

        <!-- Namespace source file -->
        <script type="text/javascript" src="../../build/yahoo/yahoo.js"></script>
        
        <!-- Dependency source files -->
        <script type="text/javascript" src="../../build/event/event.js"></script>
        <script type="text/javascript" src="../../build/dom/dom.js"></script>
<?php
        if($bUseLogger) {
?>    

        <!-- Logger CSS -->
        <script type="text/javascript" src="../../build/logger/logger.js"></script>
<?php
        }
?>

        <script type="text/javascript" src="../../build/container/container_core.js"></script>
        
        <!-- Menu source file -->
        <script type="text/javascript" src="../../build/menu/menu.js"></script>

<?php
    }
?>