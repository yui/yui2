YAHOO.widget.ButtonGroup = function(p_sName, p_oProperties) {



    this.applyConfig((p_oProperties || {}));
    
    


};

YAHOO.widget.ButtonGroup.prototype = {

    init: function() {
    
        this.addProperty("count", { 
    
            defaultValue: 0,
            readOnly: true,
            method: _setCount
    
        });
    
    }

};

YAHOO.augment(YAHOO.widget.ButtonGroup, YAHOO.util.PropertyMgr);