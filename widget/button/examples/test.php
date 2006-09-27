<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>YUI Button Examples</title>

        <link rel="stylesheet" type="text/css" href="http://us.js2.yimg.com/us.js.yimg.com/lib/common/css/reset_2.0.5.css">
        <link rel="stylesheet" type="text/css" href="http://us.js2.yimg.com/us.js.yimg.com/lib/common/css/fonts_2.0.5.css">
        <link rel="stylesheet" type="text/css" href="../src/css/button.css">
        <link rel="stylesheet" type="text/css" href="http://competitor.corp.yahoo.com/presentation/2.x/build/menu/assets/menu.css">

        <style type="text/css">
        
            h1 {
            
                margin:.5em;
                font-size:136%;
            
            }

            fieldset {
            
                border:solid 1px #000;
                margin:.5em;
                padding:.5em;
            
            }
        
            #postdata {
            
                border:solid 1px #000;
                margin:.5em;
                padding:.5em;
                background-color:#ccc;

            }
        
        </style>

        <!-- Namespace source file -->
        <script type="text/javascript" src="../../../build/yahoo/yahoo.js"></script>
    
        <!-- Dependency source files -->
        <script type="text/javascript" src="../../../build/event/event.js"></script>
        <script type="text/javascript" src="../../../build/logger/logger.js"></script>

        <script type="text/javascript" src="../../../build/dom/dom.js"></script>
        <script type="text/javascript" src="../../../build/container/container_core-min.js"></script>

        <script type="text/javascript" src="../../menu/src/js/menumodule.js"></script>
        <script type="text/javascript" src="../../menu/src/js/menumoduleitem.js"></script>

        <script type="text/javascript" src="../../menu/src/js/menu.js"></script>
        <script type="text/javascript" src="../../menu/src/js/menuitem.js"></script>

        <script type="text/javascript" src="../src/js/button.js"></script>

        <script type="text/javascript">        
        
            function onWindowLoad() {

                var oPushButton1 = new YAHOO.widget.Button("Push Me!");
                oPushButton1.render("pushbuttonsfromjavascript");

                var oPushButton2 = new YAHOO.widget.Button("pushbutton1");
                oPushButton2.render();
                

                var oNavButton1 = new YAHOO.widget.Button( { type: "link", text:"Yahoo!", URL: "http://www.yahoo.com" });
                oNavButton1.render("navbuttonsfromjavascript");

                var oNavButton2 = new YAHOO.widget.Button("yahoo");
                oNavButton2.render();


                var oSubmitButton1 = new YAHOO.widget.Button( { id:"submitbuttonfield1", text: "Submit Form" } );
                oSubmitButton1.render();
                
                var oSubmitButton2 = new YAHOO.widget.Button( { type:"submit", text:"Submit Form", name:"submitbuttonfield2", value:"submitbuttonfield2value" } );
                oSubmitButton2.render("submitbuttonsfromjavascript");


                var oRadio1 = new YAHOO.widget.Button( { type:"radio", text:"Radio 1", name:"radiofield1", value:"radio1value" } );
                oRadio1.render("radiobuttonsfromjavascript");
                
                var oRadio2 = new YAHOO.widget.Button( { type:"radio", text:"Radio 2", name:"radiofield1", value:"radio2value" } );
                oRadio2.render("radiobuttonsfromjavascript");

                var oRadio3 = new YAHOO.widget.Button( { type:"radio", text:"Radio 3", name:"radiofield1", value:"radio3value" } );
                oRadio3.render("radiobuttonsfromjavascript");
                
                var oRadio4 = new YAHOO.widget.Button( { type:"radio", text:"Radio 4", name:"radiofield1", value:"radio4value" } );
                oRadio4.render("radiobuttonsfromjavascript");


                var oRadio1 = new YAHOO.widget.Button("radio1");
                oRadio1.render();

                var oRadio2 = new YAHOO.widget.Button("radio2");
                oRadio2.render();
                
                var oRadio3 = new YAHOO.widget.Button("radio3");
                oRadio3.render();
                
                var oRadio4 = new YAHOO.widget.Button("radio4");
                oRadio4.render();   


                var oCheck1 = new YAHOO.widget.Button( {  type:"checkbox", text:"Check 1", name:"checkboxfield2", value:"Check 1" } );
                oCheck1.render("checkboxbuttonsfromjavascript");
                
                var oCheck2 = new YAHOO.widget.Button( { type:"checkbox", text:"Check 2", name:"checkboxfield2", value:"Check 2" } );
                oCheck2.render("checkboxbuttonsfromjavascript");

                var oCheck3 = new YAHOO.widget.Button( { type:"checkbox", text:"Check 3", name:"checkboxfield2", value:"Check 3" } );
                oCheck3.render("checkboxbuttonsfromjavascript");
                
                var oCheck4 = new YAHOO.widget.Button( { type:"checkbox", text:"Check 4", name:"checkboxfield2", value:"Check 4" } );
                oCheck4.render("checkboxbuttonsfromjavascript");


                var oCheck1 = new YAHOO.widget.Button("check1");
                oCheck1.render();

                var oCheck2 = new YAHOO.widget.Button("check2");
                oCheck2.render();

                var oCheck3 = new YAHOO.widget.Button("check3");
                oCheck3.render();

                var oCheck4 = new YAHOO.widget.Button("check4");
                oCheck4.render();


                var oStateExample1 = new YAHOO.widget.Button("stateexample1");
                oStateExample1.render();

                var oStateExample2 = new YAHOO.widget.Button("stateexample2");
                oStateExample2.render();

                var oStateExample3 = new YAHOO.widget.Button("stateexample3");
                oStateExample3.render();

                var oStateExample4 = new YAHOO.widget.Button("stateexample4");
                oStateExample4.render();


                var oSplitButton1 = new YAHOO.widget.Button({ id:"splitbutton1", type: "splitbutton", menu: "splitbutton1select" });
                oSplitButton1.render();

                var oSplitButton2 = new YAHOO.widget.Button({ id:"splitbutton2", type: "splitbutton", menu: "splitbutton2select" });
                oSplitButton2.render();
                

                var oSplitButton3Menu = new YAHOO.widget.Menu("splitbutton3menu");

                oSplitButton3Menu.addItem("one");
                oSplitButton3Menu.addItem("two");
                oSplitButton3Menu.addItem("three");
                
                oSplitButton3Menu.render("splitbuttonsfromjavascript");

                var oSplitButton3 = new YAHOO.widget.Button({ text: "Split Button 3", type: "splitbutton", menu: oSplitButton3Menu });
                oSplitButton3.render("splitbuttonsfromjavascript");


                var oMenuButton1 = new YAHOO.widget.Button({ id:"menubutton1", type: "menubutton", menu: "menubutton4select" });
                oMenuButton1.render();

                var oMenuButton2 = new YAHOO.widget.Button({ id:"menubutton2", type: "menubutton", menu: "menubutton5select" });
                oMenuButton2.render();



                var oMenuButton3Menu = new YAHOO.widget.Menu("menubutton3menu");

                oMenuButton3Menu.addItem("one");
                oMenuButton3Menu.addItem("two");
                oMenuButton3Menu.addItem("three");
                
                oMenuButton3Menu.render("splitbuttonsfromjavascript");

                var oMenuButton3 = new YAHOO.widget.Button({ text: "Menu Button 3", type: "menubutton", menu: oMenuButton3Menu });
                oMenuButton3.render("menubuttonsfromjavascript");

            }

            YAHOO.util.Event.addListener(window, "load", onWindowLoad);

        </script>        

    </head>
    <body>

        <h1>YUI Button Examples</h1>

<?php
    if(isset($_POST) && count($_POST) > 0) {
?>
        <div id="postdata">
            <h2>Post Data</h2>
            <pre>
<?php    
print_r($_POST);        
?>
            </pre>
        </div>
<?php    
    }
?>

        <form id="test" name="s" method="post" action="test.php">

            <fieldset id="splitbuttons">
                <legend>Split Buttons</legend>

                <fieldset id="splitbuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <input type="submit" id="splitbutton1" name="splitbutton1" value="Split Button 1">
                    <select id="splitbutton1select" name="splitbutton1select">
                        <option value="0">One</option>
                        <option value="1">Two</option>
                        <option value="2">Three</option>                
                    </select>

                    <input type="button" id="splitbutton2" name="splitbutton2" value="Split Button 2">
                    <select id="splitbutton2select" name="splitbutton2select">
                        <option value="0">One</option>
                        <option value="1">Two</option>
                        <option value="2">Three</option>                
                    </select>

                </fieldset>

                <fieldset id="splitbuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>            

            <fieldset id="menubuttons">
                <legend>Menu Buttons</legend>

                <fieldset id="menubuttonsfrommarkup">
                    <legend>From Markup</legend>
                    
                    <input type="submit" id="menubutton1" name="menubutton1" value="Menu Button 1">
                    <select id="menubutton4select" name="menubutton4select">
                        <option value="0">One</option>
                        <option value="1">Two</option>
                        <option value="2">Three</option>                
                    </select>


                    <input type="button" id="menubutton2" name="menubutton2" value="Menu Button 2">
                    <select id="menubutton5select" name="menubutton5select">
                        <option value="0">One</option>
                        <option value="1">Two</option>
                        <option value="2">Three</option>                
                    </select>

                </fieldset>

                <fieldset id="menubuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>

            <fieldset id="buttonstates">
                <legend>Button States</legend>

                <label>Active:</label> <span id="stateexample1" class="yuibutton active"><span><button type="button" name="stateexample1">Active Example</button></span></span>
                <label>Hover:</label> <span id="stateexample2" class="yuibutton hover"><span><button type="button" name="stateexample2">Hover Example</button></span></span>
                <label>Focus:</label> <span id="stateexample3" class="yuibutton focus"><span><button type="button" name="stateexample3">Focus Example</button></span></span>
                <label>Disabled:</label> <span id="stateexample4" class="yuibutton disabled"><span><button type="button" name="stateexample4">Disabled Example</button></span></span>

            </fieldset>

            <fieldset id="pushbuttons">
                <legend>Push Buttons</legend>

                <fieldset id="pushbuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <input type="button" id="pushbutton1" name="pushbutton1" value="Push Me!">

                </fieldset>
                
                <fieldset id="pushbuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>

            <fieldset id="navbuttons">
                <legend>Navigational Buttons</legend>

                <fieldset id="navbuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <a id="yahoo" href="http://www.yahoo.com">Yahoo!</a>

                </fieldset>
                
                <fieldset id="navbuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>              

            </fieldset>

            <fieldset id="submitbuttons">
                <legend>Submit Buttons</legend>

                <fieldset id="submitbuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <input id="submitbuttonfield1" type="submit" name="submitbuttonfield1" value="submitbuttonfield1value">

                </fieldset>

                <fieldset id="submitbuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>

            <fieldset id="radiobuttons">
                <legend>Radio Buttons</legend>

                <fieldset id="radiobuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <input id="radio1" type="radio" name="radiofield2" value="Radio 1">
                    <input id="radio2" type="radio" name="radiofield2" value="Radio 2">
                    <input id="radio3" type="radio" name="radiofield2" value="Radio 3">
                    <input id="radio4" type="radio" name="radiofield2" value="Radio 4">

                </fieldset>

                <fieldset id="radiobuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>

            <fieldset id="checkboxbuttons">
                <legend>Checkbox Buttons</legend>

                <fieldset id="checkboxbuttonsfrommarkup">
                    <legend>From Markup</legend>

                    <input id="check1" type="checkbox" name="checkboxfield1" value="Check 1">
                    <input id="check2" type="checkbox" name="checkboxfield1" value="Check 2">
                    <input id="check3" type="checkbox" name="checkboxfield1" value="Check 3">
                    <input id="check4" type="checkbox" name="checkboxfield1" value="Check 4">

                </fieldset>

                <fieldset id="checkboxbuttonsfromjavascript">
                    <legend>From JavaScript</legend>
                </fieldset>

            </fieldset>

        </form>
        
    </body>
</html>
