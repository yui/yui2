YAHOO.namespace("tool");

/**
 * An object capable of sending test results to a server.
 * @param {String} url The URL to submit the results to.
 * @param {Function} format (Optiona) A function that outputs the results in a specific format.
 *      Default is YAHOO.tool.TestFormat.XML.
 * @constructor
 * @namespace YAHOO.tool
 * @class TestReporter
 */
YAHOO.tool.TestReporter = function(url /*:String*/, format /*:Function*/) {

    /**
     * The URL to submit the data to.
     * @type String
     * @property url
     */
    this.url /*:String*/ = url;

    /**
     * The formatting function to call when submitting the data.
     * @type Function
     * @property format
     */
    this.format /*:Function*/ = format || YAHOO.tool.TestFormat.XML;

    /**
     * Extra fields to submit with the request.
     * @type Object
     * @property _fields
     * @private
     */
    this._fields /*:Object*/ = new Object();
    
    /**
     * The form element used to submit the results.
     * @type HTMLFormElement
     * @property _form
     * @private
     */
    this._form /*:HTMLElement*/ = null;


    this._iframe /*:HTMLElement*/ = null;
};

YAHOO.tool.TestReporter.prototype = {

    //restore missing constructor
    constructor: YAHOO.tool.TestReporter,

    /**
     * Adds a field to the form that submits the results.
     * @param {String} name The name of the field.
     * @param {Variant} value The value of the field.
     * @return {Void}
     * @method addField
     */
    addField : function (name /*:String*/, value /*:Variant*/) /*:Void*/{
        this._fields[name] = value;    
    },
    
    /**
     * Removes all previous defined fields.
     * @return {Void}
     * @method addField
     */
    clearFields : function() /*:Void*/{
        this._fields = new Object();
    },

    /**
     * Sends the report to the server.
     * @param {Object} results The results object created by TestRunner.
     * @return {Void}
     * @method report
     */
    report : function(results /*:Object*/) /*:Void*/{
    
        //if the form hasn't been created yet, create it
        if (!this._form){
            this._form = document.createElement("form");
            this._form.method = "post";
            this._form.style.visibility = "hidden";
            this._form.style.position = "absolute";
            this._form.style.top = 0;
            document.body.appendChild(this._form);
        }

        //set the form's action
        this._form.action = this.url;
    
        //remove any existing fields
        while(this._form.hasChildNodes()){
            this._form.removeChild(this._form.lastChild);
        }
        
        //create results field
        var resultsInput /*:HTMLElement*/ = document.createElement("input");
        resultsInput.type = "hidden";
        resultsInput.name = "results";
        resultsInput.value = this.format(results);
        this._form.appendChild(resultsInput);
        
        //add fields to the form
        for (var prop in this._fields){
            if (YAHOO.lang.hasOwnProperty(this._fields, prop) && typeof this._fields[prop] != "function"){
                var input /*:HTMLElement*/ = document.createElement("input");
                input.type = "hidden";
                input.name = prop;
                input.value = this._fields[prop];
                this._form.appendChild(input);
            }
        }
        
        this._form.submit();
    
    }

};
