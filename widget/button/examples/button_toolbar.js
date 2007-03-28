                var aButtons = [];

                function registerButton(p_oButton) {

                    aButtons[aButtons.length] = p_oButton;

                }

                function onDisabledToggleClick(p_oEvent) {

                    if(aButtons && aButtons.length > 0) {

                        var bDisable = false;
                        
                        if(this.value == "Disable All") {
                        
                            bDisable = true;

                            this.value = "Enable All";                        

                        }
                        else {
                        
                            this.value = "Disable All";
                        
                        }


                        var i = aButtons.length - 1;
                        
                        do {

                            aButtons[i].set("disabled", bDisable);

                        }
                        while(i--);
                    
                    }

                }

                function onDestoryAllClick(p_oEvent) {

                    if(aButtons && aButtons.length > 0) {

                        var i = aButtons.length - 1;
                        
                        do {

                            aButtons[i].destroy();

                        }
                        while(i--);
                        
                        aButtons = null;
                    
                    }
                
                }

                function createButtonTestToolBar(p_oAppendTo) {

                    var oToolbar = document.createElement("div");
                    oToolbar.id = "buttontesttoolbar";

                    var sHTML = "";

                    if(p_oAppendTo.tagName.toUpperCase() == "FORM") {

                        sHTML += "<input type=\"reset\" name=\"resetbutton\" value=\"Reset Form\">";
                        sHTML += "<input type=\"submit\" name=\"submitbutton\" value=\"Submit Form\">";

                    }

                    sHTML += "<input type=\"button\" id=\"disabledtoggle\" name=\"disable\" value=\"Disable All\">";
                    sHTML += "<input type=\"button\" id=\"destroyall\" name=\"disable\" value=\"Destroy All\">";

                    p_oAppendTo.appendChild(oToolbar);

                    oToolbar.innerHTML = sHTML;

                    YAHOO.util.Event.on("disabledtoggle", "click", onDisabledToggleClick);
                    YAHOO.util.Event.on("destroyall", "click", onDestoryAllClick);

                }
                

                function onExampleReady() {

                    createButtonTestToolBar(this);
                
                }
                
                YAHOO.util.Event.onContentReady("example", onExampleReady);