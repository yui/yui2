(function () {

var lang   = YAHOO.lang,
    util   = YAHOO.util,
    widget = YAHOO.widget,
    ua     = YAHOO.env.ua,
    
    Dom    = util.Dom,
    Ev     = util.Event,
    
    DT     = widget.DataTable;
    
/**
 * The BaseCellEditor class provides base functionality common to all inline cell
 * editors for a DataTable widget.
 *
 * @namespace YAHOO.widget
 * @class CellEditor
 * @uses YAHOO.util.EventProvider 
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.BaseCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-ceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    
    // Validate DataTable
    if(oDataTable instanceof YAHOO.widget.DataTable) {
        this.dataTable = oDataTable;
    }
    else {
        YAHOO.log("Could not create CellEditor due to invalid DataTable","error",this.toString());
        return;
    }
    
    // Validate cell
    elCell = oDataTable.getTdEl(elCell);
    if(elCell) {
        this.cell = elCell;
        
        // Validate Column
        var oColumn = oDataTable.getColumn(elCell);
        if(oColumn && oColumn.editor) {
            this.column = oColumn;
        }
        else {
            YAHOO.log("Could not create CellEditor due to invalid Column","error",this.toString());
            return;
        }

        // Validate Record
        var oRecord = oDataTable.getRecord(elCell);
        if(oRecord) {
            this.record = oRecord;
        }
        else {
            YAHOO.log("Could not create CellEditor due to invalid Record","error",this.toString());
            return;
        }
       
        // Object literal defines CellEditor configs
        if(oConfigs && YAHOO.lang.isObject(oConfigs)) {
            for(var sConfig in oConfigs) {
                if(sConfig) {
                    this[sConfig] = oConfigs[sConfig];
                }
            }
        }

        // Draw UI
        this.render();
    }
    else {
        YAHOO.log("Could not create CellEditor due to invalid cell", "error", this.toString());
    }
};

var BCE = widget.BaseCellEditor;

/////////////////////////////////////////////////////////////////////////////
//
// Static members
//
/////////////////////////////////////////////////////////////////////////////
lang.augmentObject(BCE, {

/**
 * Global instance counter.
 *
 * @property CellEditor._nCount
 * @type Number
 * @static
 * @default 0
 */
_nCount : 0,

/**
 * Class applied to CellEditor container.
 *
 * @property CellEditor.CLASS_CELLEDITOR
 * @type String
 * @static
 * @default "yui-ceditor"
 */
CLASS_CELLEDITOR : "yui-ceditor"

});

BCE.prototype = {
/////////////////////////////////////////////////////////////////////////////
//
// Private members
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Unique id assigned to instance "yui-ceditorN", useful prefix for generating unique
 * DOM ID strings and log messages.
 *
 * @property _sId
 * @type String
 * @private
 */
_sId : null,
















/////////////////////////////////////////////////////////////////////////////
//
// Public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * DataTable instance.
 *
 * @property dataTable
 * @type YAHOO.widget.DataTable
 */
dataTable : null,

/**
 * TD element.
 *
 * @property cell
 * @type HTMLElement
 * @default null
 */
cell : null,

/**
 * Editor type.
 *
 * @property type
 * @type String
 * @private
 */
type : null,

/**
 * Column instance.
 *
 * @property column
 * @type YAHOO.widget.Column
 * @default null
 */
column : null,

/**
 * Record instance.
 *
 * @property record
 * @type YAHOO.widget.Record
 * @default null
 */
record : null,

/**
 * Container for inline editor.
 *
 * @property container
 * @type HTMLElement
 */
container : null,

/**
 * Original value.
 *
 * @property value
 * @type MIXED
 */
value : null,

/**
 * Default value for the cell.
 *
 * @property defaultValue
 * @type MIXED
 * @default null
 */
defaultValue : null,

/**
 * Validator for input data.
 *
 * @property validator
 * @type HTMLFunction
 * @default null
 */
validator : null,

/**
 * True if currently active.
 *
 * @property isActive
 * @type Boolean
 */
isActive : false,

/**
 * True is Ok/Cancel buttons should not be displayed in the CellEditor.
 *
 * @property disableBtns
 * @type Boolean
 * @default false
 */
disableBtns : false,









/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////
/**
 * CellEditor instance name, for logging.
 *
 * @method toString
 * @return {String} Unique name of the CellEditor instance.
 */

toString : function() {
    return "CellEditor instance " + this._sId;
},

/**
 * CellEditor unique ID.
 *
 * @method getId
 * @return {String} Unique ID of the CellEditor instance.
 */

getId : function() {
    return this._sId;
},

/**
 * Nulls out the entire CellEditor instance and related objects, removes attached
 * event listeners, and clears out DOM elements inside the container, removes
 * container from the DOM.
 *
 * @method destroy
 */
destroy : function() {
    var elContainer = this.container;
    Ev.purgeElement(elContainer, true);
    elContainer.parentNode.removeChild(elContainer);
},

/**
 * Renders DOM elements and attaches event listeners.
 *
 * @method save
 */
render : function() {
    // Attach Cell Editor container element as first child of body
    var elContainer = document.createElement("div");
    elContainer.style.display = "none";
    elContainer.tabIndex = 0;
    elContainer.className = DT.CLASS_EDITOR;
    document.body.insertBefore(elContainer, document.body.firstChild);
    this.container = elContainer;
    
    // Handle ESC key
    Ev.addListener(elContainer, "keydown", function(e, oSelf) {
        // ESC hides Cell Editor
        if((e.keyCode == 27)) {
            oSelf.cancel();
            ///oSelf.focusTbodyEl();
        }
        else {
            ///oSelf.fireEvent("editorKeydownEvent", {editor:oSelf._oCellEditor, event:e});
        }
    }, this);
    
    this.renderForm();

    // Show Save/Cancel buttons
    if(!this.disableBtns) {
        this.renderBtns();
    }
},

/**
 * Renders Save/Cancel buttons.
 *
 * @method renderBtns
 */
renderBtns : function() {
    // Buttons
    var elBtnsDiv = this.container.appendChild(document.createElement("div"));
    elBtnsDiv.className = DT.CLASS_BUTTON;

    // Save button
    var elSaveBtn = elBtnsDiv.appendChild(document.createElement("button"));
    elSaveBtn.className = DT.CLASS_DEFAULT;
    elSaveBtn.innerHTML = "OK"; // TODO: Configurable
    Ev.addListener(elSaveBtn, "click", function(oArgs) {
        this.save();
    }, this, true);

    // Cancel button
    var elCancelBtn = elBtnsDiv.appendChild(document.createElement("button"));
    elCancelBtn.innerHTML = "Cancel"; //TODO: Configurable
    Ev.addListener(elCancelBtn, "click", function(oArgs) {
        this.cancel();
    }, this, true);
},

/**
 * Set CellEditor to reference a new cell.
 *
 * @method update
 */
setCell : function(elCell) {
    // Validate cell
    elCell = this.dataTable.getTdEl(elCell);
    if(elCell) {
        this.cell = elCell;
        this.record = this.dataTable.getRecord(elCell);
        this.value = this.record.getData(this.column.getKey()) || this.defaultValue;
    }
},

/**
 * Moves container into position for display.
 *
 * @method move
 */
move : function() {
    // Move Editor
    var elContainer = this.container,
        elCell = this.cell,
        x = Dom.getX(elCell),
        y = Dom.getY(elCell);

    //TODO: remove scrolling logic
    // SF doesn't get xy for cells in scrolling table
    // when tbody display is set to block
    if(isNaN(x) || isNaN(y)) {
        var elTbody = this.dataTable.getTbodyEl();
        x = elCell.offsetLeft + // cell pos relative to table
                Dom.getX(elTbody.parentNode) - // plus table pos relative to document
                elTbody.scrollLeft; // minus tbody scroll
        y = elCell.offsetTop + // cell pos relative to table
                Dom.getY(elTbody.parentNode) - // plus table pos relative to document
                elTbody.scrollTop + // minus tbody scroll
                this.dataTable.getTheadEl().offsetHeight; // account for fixed THEAD cells
    }

    elContainer.style.left = x + "px";
    elContainer.style.top = y + "px";
},

/**
 * Overridable abstract method to customize Cell Editor UI.
 *
 * @method doBeforeShowCellEditor
 * @param oCellEditor {YAHOO.widget.CellEditor} CellEditor instance.
 * @return {Boolean} Return true to continue showing CellEditor.
 */
doBeforeShow : function(oCellEditor) {
    return true;
},

/**
 * Displays CellEditor UI in the correct position.
 *
 * @method save
 */
show : function() {
    this.resetForm();
    var ok = this.doBeforeShow(this);
    if(ok) {
        this.isActive = true;
        this.container.style.display = "";
        this.focus();
        ///this.fireEvent("editorShowEvent", {editor:oCellEditor});
        YAHOO.log("CellEditor shown", "info", this.toString());
    }   
},

/**
 * Saves value of CellEditor and hides UI.
 *
 * @method save
 */
save : function() {
    // Get new value
    var newValue = this.getInputValue();
    
    // Validate new value
    if(this.validator) {
        newValue = this.validator.call(this.dataTable, newValue, this.value, this);
        if(newValue === null ) {
            this.resetForm();
            this.fireEvent("editorRevertEvent",
                    {editor:this._oCellEditor, oldData:this.value, newData:newValue});
            YAHOO.log("Could not save Cell Editor input due to invalid data " +
                    lang.dump(newValue), "warn", this.toString());
            return;
        }
    }
    
    // Update new value
    this.dataTable.updateCell(this.record, this.column, newValue);
    
    // Hide CellEditor
    this.container.style.display = "none";
    this.isActive = false;
    this.dataTable._oCellEditor =  null;
    
    this.fireEvent("editorSaveEvent",
            {editor:this._oCellEditor, oldData:this.value, newData:newValue});
    YAHOO.log("Cell Editor input saved", "info", this.toString());
},

/**
 * Cancels CellEditor input and hides UI.
 *
 * @method cancel
 */
cancel : function() {
    if(this.isActive) {
        this.container.style.display = "none";
        this.isActive = false;
        this.dataTable._oCellEditor =  null;
        //TODO: preserve values for the event?
        ///this.fireEvent("editorCancelEvent", {editor:this._oCellEditor});
        YAHOO.log("CellEditor canceled", "info", this.toString());
    }
    else {
        YAHOO.log("CellEditor not active to cancel", "warn", this.toString());
    }
},

/**
 * Renders form elements.
 *
 * @method renderForm
 */
renderForm : function() {
    // To be implemented by subclass
},

/**
 * Resets CellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    // To be implemented by subclass
},

/**
 * Sets focus in CellEditor.
 *
 * @method save
 */
focus : function() {
    // To be implemented by subclass
},

/**
 * Retrieves input value from CellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    // To be implemented by subclass
}

};

lang.augmentProto(BCE, YAHOO.util.EventProvider);









/////////////////////////////////////////////////////////////////////////////
//
// XXXCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.XXXCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-xxxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// XXXCellEditor extends BaseCellEditor
lang.extend(widget.XXXCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// XXXCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to XXX element.
 *
 * @property XXX
 * @type HTMLElement
 */
xxx : null,

/**
 * Default value.
 *
 * @property defaultValue
 * @type xxx
 * @default null
 */
defaultValue : null,


/////////////////////////////////////////////////////////////////////////////
//
// XXXCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with input(s) type=xxx.
 *
 * @method renderForm
 */
renderForm : function() {
    // To be implemented by subclass
},

/**
 * Resets XXXCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    // To be implemented by subclass
},

/**
 * Sets focus in XXXCellEditor.
 *
 * @method save
 */
focus : function() {
    // To be impmlemented by subclass
},

/**
 * Retrieves input value from XXXCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    // To be implemented by subclass
}

});

// Copy static members to XXXCellEditor class
lang.augmentObject(widget.XXXCellEditor, BCE);






/////////////////////////////////////////////////////////////////////////////
//
// CheckboxCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.CheckboxCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-checkboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// CheckboxCellEditor extends BaseCellEditor
lang.extend(widget.CheckboxCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// CheckboxCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Array of checkbox values.
 *
 * @property checkboxOptions
 * @type String[] 
 */
checkboxOptions : null,

/**
 * Reference to the checkbox elements.
 *
 * @property checkboxes
 * @type HTMLElement[] 
 */
checkboxes : null,

/**
 * Array of checked values
 *
 * @property value
 * @type String[] 
 */
value : null,

/////////////////////////////////////////////////////////////////////////////
//
// CheckboxCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with input(s) type=checkbox.
 *
 * @method renderForm
 */
renderForm : function() {
    if(lang.isArray(this.checkboxOptions)) {
        var checkboxOptions = this.checkboxOptions;
        var checkboxValue, checkboxId, elLabel, j, k, m,
            l=checkboxOptions.length;
        
        // Create the checkbox buttons in an IE-friendly way...
        for(j=0; j<l; j++) {
            checkboxValue = lang.isValue(checkboxOptions[j].label) ?
                    checkboxOptions[j].label : checkboxOptions[j];

            checkboxId = this.getId() + "-chk" + j;
            this.container.innerHTML += "<input type=\"checkbox\"" +
                    " id=\"" + checkboxId + "\"" + // Needed for label
                    " value=\"" + checkboxValue + "\">";
            
            // Create the labels in an IE-friendly way
            elLabel = this.container.appendChild(document.createElement("label"));
            elLabel.htmlFor = checkboxId;
            elLabel.innerHTML = checkboxValue;
        }
        
        // Store the reference to the checkbox elements
        var allCheckboxes = [];
        for(j=0; j<l; j++) {
            allCheckboxes[allCheckboxes.length] = this.container.childNodes[j*2];
        }
        this.checkboxes = allCheckboxes;
    }

    /*TODO
    if(this.disableBtns) {
        Ev.addListener(this.container, "blur", function(v){
            // Save on "blur"
            this.save();
        }, this, true);        
    }
    */
},

/**
 * Resets CheckboxCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    // Normalize to array
    var originalValues = lang.isArray(this.value) ? this.value : [this.value];
    
    // Match checks to value
    for(var i=0, j=this.checkboxes.length; i<j; i++) {
        this.checkboxes[i].checked = false;
        for(var k=0, l=originalValues.length; k<l; k++) {
            if(this.checkboxes[i].value === originalValues[k]) {
                this.checkboxes[i].checked = true;
            }
        }
    }
},

/**
 * Sets focus in CheckboxCellEditor.
 *
 * @method save
 */
focus : function() {
    this.checkboxes[0].focus();
},

/**
 * Retrieves input value from CheckboxCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    var checkedValues = [];
    for(var i=0, j=this.checkboxes.length; i<j; i++) {
        if(this.checkboxes[i].checked) {
            checkedValues[checkedValues.length] = this.checkboxes[i].value;
        }
    }  
    return checkedValues;
}

});

// Copy static members to CheckboxCellEditor class
lang.augmentObject(widget.CheckboxCellEditor, BCE);








/////////////////////////////////////////////////////////////////////////////
//
// DateCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.DateCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-dateceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// CheckboxCellEditor extends BaseCellEditor
lang.extend(widget.DateCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// DateCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to Calendar instance.
 *
 * @property calendar
 * @type YAHOO.widget.Calendar
 */
calendar : null,

/**
 * Default value.
 *
 * @property defaultValue
 * @type Date
 * @default new Date()
 */
defaultValue : new Date(),


/////////////////////////////////////////////////////////////////////////////
//
// DateCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a Calendar.
 *
 * @method renderForm
 */
renderForm : function() {
    // Calendar widget
    if(YAHOO.widget.Calendar) {
        var calContainer = this.container.appendChild(document.createElement("div"));
        var calPrefix = this.getId() + this.column.getColEl();
        calContainer.id = calPrefix + "-dateContainer"; // Needed for Calendar constructor
        var calendar =
                new YAHOO.widget.Calendar(calPrefix + "-date",
                calContainer.id);
        calendar.render();
        calContainer.style.cssFloat = "none";

        if(ua.ie) {
            var calFloatClearer = this.container.appendChild(document.createElement("br"));
            calFloatClearer.style.clear = "both";
        }
        
        this.calendar = calendar;
    }

    /*TODO save on select
    if(this.disableBtns) {
        Ev.addListener(elDropdown, "blur", function(v){
            // Save on "blur"
            this.save();
        }, this, true);        
    }
    */
    
    YAHOO.log("Could not find YUI Calendar", "error", this.toString());
},

/**
 * Resets DateCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    var value = this.value;
    var selectedValue = (value.getMonth()+1)+"/"+value.getDate()+"/"+value.getFullYear();
    this.calendar.cfg.setProperty("selected",selectedValue,false);
	this.calendar.render();
},

/**
 * Sets focus in DateCellEditor.
 *
 * @method save
 */
focus : function() {
    // To be impmlemented by subclass
},

/**
 * Retrieves input value from DateCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    return this.calendar.getSelectedDates()[0];
}

});

// Copy static members to DateCellEditor class
lang.augmentObject(widget.DateCellEditor, BCE);









/////////////////////////////////////////////////////////////////////////////
//
// DropdownCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.DropdownCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-dropdownceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// DropdownCellEditor extends BaseCellEditor
lang.extend(widget.DropdownCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// DropdownCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to Dropdown element.
 *
 * @property dropdown
 * @type HTMLElement
 */
dropdown : null,


/////////////////////////////////////////////////////////////////////////////
//
// DropdownCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with select element.
 *
 * @method renderForm
 */
renderForm : function() {
    var elDropdown = this.container.appendChild(document.createElement("select"));
    var dropdownOptions = (this.column.editorOptions && lang.isArray(this.column.editorOptions.dropdownOptions)) ?
            this.column.editorOptions.dropdownOptions : [];
    for(var i=0, j=dropdownOptions.length; i<j; i++) {
        var dropdownOption = dropdownOptions[i];
        var elOption = document.createElement("option");
        elOption.value = (lang.isValue(dropdownOption.value)) ?
                dropdownOption.value : dropdownOption;
        elOption.innerHTML = (lang.isValue(dropdownOption.text)) ?
                dropdownOption.text : dropdownOption;
        elOption = elDropdown.appendChild(elOption);
    }
    this.dropdown = elDropdown;
    
    // Save on blur
    if(this.disableBtns) {
        Ev.addListener(elDropdown, "blur", function(v){
            this.save();
        }, this, true);        
    }
},

/**
 * Resets DropdownCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    for(var i=0, j=this.dropdown.options.length; i<j; i++) {
        if(this.value === this.dropdown.options[i].value) {
            this.dropdown.options[i].selected = true;
        }
    }    
},

/**
 * Sets focus in DropdownCellEditor.
 *
 * @method save
 */
focus : function() {
    this.dataTable._focusEl(this.dropdown);
},

/**
 * Retrieves input value from DropdownCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    return this.dropdown.options[this.dropdown.options.selectedIndex].value;
}

});

// Copy static members to DropdownCellEditor class
lang.augmentObject(widget.DropdownCellEditor, BCE);






/////////////////////////////////////////////////////////////////////////////
//
// RadioCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.RadioCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-radioceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// RadioCellEditor extends BaseCellEditor
lang.extend(widget.RadioCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// RadioCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to radio elements.
 *
 * @property radios
 * @type HTMLElement[]
 */
radios : null,

/**
 * Array of radio values.
 *
 * @property radios
 * @type String[]
 */
radioOptions : null,

/////////////////////////////////////////////////////////////////////////////
//
// RadioCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with input(s) type=radio.
 *
 * @method renderForm
 */
renderForm : function() {
    if(lang.isArray(this.radioOptions)) {
        var radioOptions = this.radioOptions;
        var radioValue, radioId, elLabel;
        // Create the radio buttons in an IE-friendly way
        for(var i=0, l=radioOptions.length; i<l; i++) {
            radioValue = lang.isValue(radioOptions[i].label) ?
                    radioOptions[i].label : radioOptions[i];
            radioId = this.getId() + "-radio" + i;
            this.container.innerHTML += "<input type=\"radio\"" +
                    " name=\"" + this.getId() + "\"" +
                    " value=\"" + radioValue + "\"" +
                    " id=\"" +  radioId + "\">"; // Needed for label
            
            // Create the labels in an IE-friendly way
            elLabel = this.container.appendChild(document.createElement("label"));
            elLabel.htmlFor = radioId;
            elLabel.innerHTML = radioValue;
        }
        
        // Store the reference to the checkbox elements
        var allRadios = [],
            elRadio;
        for(var j=0; j<l; j++) {
            elRadio = this.container.childNodes[j*2];
            allRadios[allRadios.length] = elRadio;
        }
        this.radios = allRadios;

        // Save on enter, save on click
        if(this.disableBtns) {
            // Bug: 1802582 Set up a listener on each textbox to track on keypress
            // since SF/OP can't preventDefault on keydown
            //Ev.addListener(this.container, "keypress", function(v){
            //    if((v.keyCode === 13)) {
            //        this.save();
            //    }
            //}, this, true);
            
            Ev.addListener(this.container, "click", function(v){
                if(Ev.getTarget(v).tagName.toLowerCase() === "input") {
                    this.save();
                }
            }, this, true);
        }
    }
},

/**
 * Resets RadioCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    for(var i=0, j=this.radios.length; i<j; i++) {
        var elRadio = this.radios[i];
        if(this.value === elRadio.value) {
            elRadio.checked = true;
            return;
        }
    }
},

/**
 * Sets focus in RadioCellEditor.
 *
 * @method save
 */
focus : function() {
    for(var i=0, j=this.radios.length; i<j; i++) {
        if(this.radios[i].checked) {
            this.radios[i].focus();
            return;
        }
    }
},

/**
 * Retrieves input value from RadioCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    for(var i=0, j=this.radios.length; i<j; i++) {
        if(this.radios[i].checked) {
            return this.radios[i].value;
        }
    }
}

});

// Copy static members to RadioCellEditor class
lang.augmentObject(widget.RadioCellEditor, BCE);






/////////////////////////////////////////////////////////////////////////////
//
// TextareaCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.TextareaCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-textareaceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// TextareaCellEditor extends BaseCellEditor
lang.extend(widget.TextareaCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// TextareaCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to textarea element.
 *
 * @property textarea
 * @type HTMLElement
 */
textarea : null,


/////////////////////////////////////////////////////////////////////////////
//
// TextareaCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with textarea.
 *
 * @method renderForm
 */
renderForm : function() {
    var elTextarea = this.container.appendChild(document.createElement("textarea"));
    elTextarea.style.width = this.cell.offsetWidth + "px"; //(parseInt(elCell.offsetWidth,10)) + "px";
    elTextarea.style.height = "3em"; //(parseInt(elCell.offsetHeight,10)) + "px";
    this.textarea = elTextarea;

    // Save on blur
    if(this.disableBtns) {
        Ev.addListener(elTextarea, "blur", function(v){
            // Save on "blur"
            this.save();
        }, this, true);        
    }
},

/**
 * Resets TextareaCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    this.textarea.value = this.value;
},

/**
 * Sets focus in TextareaCellEditor.
 *
 * @method save
 */
focus : function() {
    this.textarea.focus();
    this.textarea.select();
},

/**
 * Retrieves input value from TextareaCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    return this.textarea.value;
}

});

// Copy static members to TextareaCellEditor class
lang.augmentObject(widget.TextareaCellEditor, BCE);









/////////////////////////////////////////////////////////////////////////////
//
// TextboxCellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

widget.TextboxCellEditor = function(oDataTable, elCell, sType, oConfigs) {
    this._sId = "yui-textboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, oDataTable, elCell, sType, oConfigs); 
};

// TextboxCellEditor extends BaseCellEditor
lang.extend(widget.TextboxCellEditor, BCE, {

/////////////////////////////////////////////////////////////////////////////
//
// TextboxCellEditor public properties
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Reference to the textbox element.
 *
 * @property textbox
 */
textbox : null,

/////////////////////////////////////////////////////////////////////////////
//
// TextboxCellEditor public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Render a form with input type=text.
 *
 * @method renderForm
 */
renderForm : function() {
    var elTextbox;
    // Bug 1802582: SF3/Mac needs a form element wrapping the input
    if(ua.webkit>420) {
        elTextbox = this.container.appendChild(document.createElement("form")).appendChild(document.createElement("input"));
    }
    else {
        elTextbox = this.container.appendChild(document.createElement("input"));
    }
    elTextbox.type = "text";
    elTextbox.style.width = this.cell.offsetWidth + "px";
    //elTextbox.style.height = "1em";
    this.textbox = elTextbox;

    // Save on enter
    // Bug: 1802582 Set up a listener on each textbox to track on keypress
    // since SF/OP can't preventDefault on keydown
    Ev.addListener(elTextbox, "keypress", function(v){
        if((v.keyCode === 13)) {
            // Prevent form submit
            YAHOO.util.Event.preventDefault(v);
            this.save();
        }
    }, this, true);

    // Save on blur
    if(this.disableBtns) {
        Ev.addListener(elTextbox, "blur", function(v){
            this.save();
        }, this, true);
    }
},

/**
 * Resets TextboxCellEditor UI to initial state.
 *
 * @method reset
 */
resetForm : function() {
    this.textbox.value = this.value;
},

/**
 * Sets focus in TextboxCellEditor.
 *
 * @method save
 */
focus : function() {
    this.textbox.focus();
    this.textbox.select();
},

/**
 * Returns new value for TextboxCellEditor.
 *
 * @method getInputValue
 */
getInputValue : function() {
    return this.textbox.value;
}

});

// Copy static members to TextboxCellEditor class
lang.augmentObject(widget.TextboxCellEditor, BCE);





/////////////////////////////////////////////////////////////////////////////
//
// DataTable extension
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Editor formatting functions.
 * @property DataTable.Formatter
 * @type Object
 * @static
 */
DT.Editors = {
    checkbox : widget.CheckboxCellEditor,
    "date"   : widget.DateCellEditor,
    dropdown : widget.DropdownCellEditor,
    radio    : widget.RadioCellEditor,
    textarea : widget.TextareaCellEditor,
    textbox  : widget.TextboxCellEditor
};

/////////////////////////////////////////////////////////////////////////////
//
// CellEditor constructor
//
/////////////////////////////////////////////////////////////////////////////

/**
 * The CellEditor class provides full functionality for inline cell editing within a
 * DataTable widget.
 *
 * @namespace YAHOO.widget
 * @class CellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.CellEditor = function(oDataTable, elCell, sType, oConfigs) {
    // Point to one of the subclasses
    if(sType && DT.Editors[sType]) {
        lang.augmentObject(BCE, DT.Editors[sType]);
        return new DT.Editors[sType](oDataTable, elCell, sType, oConfigs);
    }
    else {
        return new BCE(oDataTable, elCell, null, oConfigs);
    }
};

var CE = widget.CellEditor;

// Copy static members to CellEditor class
lang.augmentObject(CE, BCE);


})();
