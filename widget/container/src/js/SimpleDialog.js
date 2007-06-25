(function () {

    /**
    * SimpleDialog is a simple implementation of Dialog that can be used to 
    * submit a single value. Forms can be processed in 3 ways -- via an 
    * asynchronous Connection utility call, a simple form POST or GET, 
    * or manually.
    * @namespace YAHOO.widget
    * @class SimpleDialog
    * @extends YAHOO.widget.Dialog
    * @constructor
    * @param {String} el The element ID representing the SimpleDialog 
    * <em>OR</em>
    * @param {HTMLElement} el The element representing the SimpleDialog
    * @param {Object} userConfig The configuration object literal containing 
    * the configuration that should be set for this SimpleDialog. See 
    * configuration documentation for more details.
    */
    YAHOO.widget.SimpleDialog = function (el, userConfig) {
    
        YAHOO.widget.SimpleDialog.superclass.constructor.call(this, 
            el, userConfig);
    
    };

    var Dom = YAHOO.util.Dom,
        SimpleDialog = YAHOO.widget.SimpleDialog,
    
        /**
        * Constant representing the SimpleDialog's configuration properties
        * @property DEFAULT_CONFIG
        * @private
        * @final
        * @type Object
        */
        DEFAULT_CONFIG = {
        
            "ICON": { 
                key: "icon", 
                value: "none", 
                suppressEvent: true  
            },
        
            "TEXT": { 
                key: "text", 
                value: "", 
                suppressEvent: true, 
                supercedes: ["icon"] 
            }
        
        };

    /**
    * Constant for the standard network icon for a blocking action
    * @property SimpleDialog.ICON_BLOCK
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_BLOCK = "blckicon";
    
    /**
    * Constant for the standard network icon for alarm
    * @property SimpleDialog.ICON_ALARM
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_ALARM = "alrticon";
    
    /**
    * Constant for the standard network icon for help
    * @property SimpleDialog.ICON_HELP
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_HELP  = "hlpicon";
    
    /**
    * Constant for the standard network icon for info
    * @property SimpleDialog.ICON_INFO
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_INFO  = "infoicon";
    
    /**
    * Constant for the standard network icon for warn
    * @property SimpleDialog.ICON_WARN
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_WARN  = "warnicon";
    
    /**
    * Constant for the standard network icon for a tip
    * @property SimpleDialog.ICON_TIP
    * @static
    * @final
    * @type String
    */
    SimpleDialog.ICON_TIP   = "tipicon";
    
    SimpleDialog.ICON_CSS_CLASSNAME = "yui-icon";
    
    /**
    * Constant representing the default CSS class used for a SimpleDialog
    * @property SimpleDialog.CSS_SIMPLEDIALOG
    * @static
    * @final
    * @type String
    */
    SimpleDialog.CSS_SIMPLEDIALOG = "yui-simple-dialog";

    
    YAHOO.extend(SimpleDialog, YAHOO.widget.Dialog, {
    
        /**
        * Initializes the class's configurable properties which can be changed 
        * using the SimpleDialog's Config object (cfg).
        * @method initDefaultConfig
        */
        initDefaultConfig: function () {
        
            SimpleDialog.superclass.initDefaultConfig.call(this);
        
            // Add dialog config properties //
        
            /**
            * Sets the informational icon for the SimpleDialog
            * @config icon
            * @type String
            * @default "none"
            */
            this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, {
                handler: this.configIcon,
                value: DEFAULT_CONFIG.ICON.value,
                suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent
            });
        
            /**
            * Sets the text for the SimpleDialog
            * @config text
            * @type String
            * @default ""
            */
            this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, { 
                handler: this.configText, 
                value: DEFAULT_CONFIG.TEXT.value, 
                suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent, 
                supercedes: DEFAULT_CONFIG.TEXT.supercedes 
            });
        
        },
        
        
        /**
        * The SimpleDialog initialization method, which is executed for 
        * SimpleDialog and all of its subclasses. This method is automatically 
        * called by the constructor, and  sets up all DOM references for 
        * pre-existing markup, and creates required markup if it is not 
        * already present.
        * @method init
        * @param {String} el The element ID representing the SimpleDialog 
        * <em>OR</em>
        * @param {HTMLElement} el The element representing the SimpleDialog
        * @param {Object} userConfig The configuration object literal 
        * containing the configuration that should be set for this 
        * SimpleDialog. See configuration documentation for more details.
        */
        init: function (el, userConfig) {

            /*
                Note that we don't pass the user config in here yet because we 
                only want it executed once, at the lowest subclass level
            */

            SimpleDialog.superclass.init.call(this, el/*, userConfig*/);
        
            this.beforeInitEvent.fire(SimpleDialog);
        
            Dom.addClass(this.element, SimpleDialog.CSS_SIMPLEDIALOG);
        
            this.cfg.queueProperty("postmethod", "manual");
        
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true);
            }
        
            this.beforeRenderEvent.subscribe(function () {
                if (! this.body) {
                    this.setBody("");
                }
            }, this, true);
        
            this.initEvent.fire(SimpleDialog);
        
        },
        
        /**
        * Prepares the SimpleDialog's internal FORM object, creating one if one 
        * is not currently present, and adding the value hidden field.
        * @method registerForm
        */
        registerForm: function () {

            SimpleDialog.superclass.registerForm.call(this);

            this.form.innerHTML += "<input type=\"hidden\" name=\"" + 
                this.id + "\" value=\"\"/>";

        },
        
        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //
        
        /**
        * Fired when the "icon" property is set.
        * @method configIcon
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configIcon: function (type,args,obj) {
        
            var sIcon = args[0],
                oBody = this.body,
                sCSSClass = SimpleDialog.ICON_CSS_CLASSNAME,
                oIcon,
                oIconParent;
        
            if (sIcon && sIcon != "none") {

                oIcon = Dom.getElementsByClassName(sCSSClass, "*" , oBody);

                if (oIcon) {

                    oIconParent = oIcon.parentNode;
                    
                    if (oIconParent) {
                    
                        oIconParent.removeChild(oIcon);
                        
                        oIcon = null;
                    
                    }

                }


                if (sIcon.indexOf(".") == -1) {

                    oIcon = document.createElement("span");
                    oIcon.className = (sCSSClass + " " + sIcon);
                    oIcon.innerHTML = "&#160;";

                } else {

                    oIcon = document.createElement("img");
                    oIcon.src = (this.imageRoot + sIcon);
                    oIcon.className = sCSSClass;

                }
                

                if (oIcon) {
                
                    oBody.appendChild(oIcon);
                
                }

            }

        },
        
        /**
        * Fired when the "text" property is set.
        * @method configText
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For configuration 
        * handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj The scope object. For configuration handlers, 
        * this will usually equal the owner.
        */
        configText: function (type,args,obj) {
            var text = args[0];
            if (text) {
                this.setBody(text);
                this.cfg.refireEvent("icon");
            }
        },
        
        // END BUILT-IN PROPERTY EVENT HANDLERS //
        
        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String} The string representation of the SimpleDialog
        */
        toString: function () {
            return "SimpleDialog " + this.id;
        }
    
    });

}());