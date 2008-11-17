<input type="button" name="demo_btn" id="demo_btn" value="click"/>
<div id="demo_logger"></div>
<script type="text/javascript">
YAHOO.namespace('example.addons');

YAHOO.example.addons.Logging = function () {
    var logger = null;
    
    return {
        initLogger : function (logNode) {
            if (!logger) {
                logger = YAHOO.util.Dom.get(logNode);
            }
        },

        log : function (message) {
            if (logger) {
                logger.innerHTML += '<p>' + message + '</p>';
            }
        }
    }
}();

YAHOO.example.PageController = function () {
    var app_const = 12345;

    return {
        getConst : function () { return app_const },
        logConst : function () {
            this.initLogger('demo_logger');
            this.log('PageController class constant = ' +
                      this.getConst() +
                      '.  Logged courtesy of augmentation');
        }
    };
}();

YAHOO.lang.augmentObject(
    YAHOO.example.PageController,
    YAHOO.example.addons.Logging);

YAHOO.util.Event.on('demo_btn','click',
                    YAHOO.example.PageController.logConst,
                    YAHOO.example.PageController, true);
</script>
