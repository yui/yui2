(function () {

var lang   = YAHOO.lang,
    util   = YAHOO.util,
    widget = YAHOO.widget,
    ua     = YAHOO.env.ua,
    
    Dom    = util.Dom,
    Ev     = util.Event,
    
    DT     = widget.DataTable;
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The BaseCellEditor class provides base functionality common to all inline cell
 * editors for a DataTable widget.
 *
 * @namespace YAHOO.widget
 * @class BaseCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.BaseCellEditor = function(sType, oConfigs) {
    this._sId = this._sId || "yui-ceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.type = sType;
    
    // Validate inputs
    this._initConfigs(oConfigs); 
    
    // Create Custom Events
    this._initEvents();
             
    // Draw UI
    this.render();
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
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Initialize configs.
 *
 * @method _initConfigs
 * @private   
 */
_initConfigs : function(oConfigs) {
    // Object literal defines CellEditor configs
    if(oConfigs && YAHOO.lang.isObject(oConfigs)) {
        for(var sConfig in oConfigs) {
            if(sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }
},

/**
 * Initialize Custom Events.
 *
 * @method _initEvents
 * @private   
 */
_initEvents : function() {
    this.createEvent("showEvent");
    this.createEvent("keydownEvent");
    this.createEvent("revertEvent");
    this.createEvent("saveEvent");
    this.createEvent("cancelEvent");
    this.createEvent("blurEvent");
},













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
    this.unsubscribeAll();
    this.column.editor = null;
    var elContainer = this.container;
    Ev.purgeElement(elContainer, true);
    elContainer.parentNode.removeChild(elContainer);
},

/**
 * Renders DOM elements and attaches event listeners.
 *
 * @method render
 */
render : function() {
    // Render Cell Editor container element as first child of body
    var elContainer = document.createElement("div");
    elContainer.id = this.getId() + "-container"; // Needed for tracking blur event
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
        oSelf.fireEvent("keydownEvent", {editor:this, event:e});
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
 * Attach CellEditor for a new interaction.
 *
 * @method attach
 */
attach : function(oDataTable, elCell) {
    // Validate 
    if(oDataTable instanceof YAHOO.widget.DataTable) {
        this.dataTable = oDataTable;
        
        // Validate cell
        elCell = oDataTable.getTdEl(elCell);
        if(elCell) {
            this.cell = elCell;

            // Validate Column
            var oColumn = oDataTable.getColumn(elCell);
            if(oColumn) {
                this.column = oColumn;
                
                // Validate Record
                this.record = oDataTable.getRecord(elCell);
                this.value = this.record.getData(this.column.getKey()) || this.defaultValue;
                
                return true;
            }            
        }
    }
    YAHOO.log("Could not attach CellEditor","error",this.toString());
    return false;
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
 * Displays CellEditor UI in the correct position.
 *
 * @method show
 */
show : function() {
    this.resetForm();
    this.isActive = true;
    this.container.style.display = "";
    this.focus();
    this.fireEvent("showEvent", {editor:this});
    YAHOO.log("CellEditor shown", "info", this.toString()); 
},

/**
 * Saves value of CellEditor and hides UI.
 *
 * @method save
 */
save : function() {
    // Get new value
    var inputValue = this.getInputValue();
    var validValue = inputValue;
    
    // Validate new value
    if(this.validator) {
        validValue = this.validator.call(this.dataTable, inputValue, this.value, this);
        if(validValue === null ) {
            this.resetForm();
            this.fireEvent("revertEvent",
                    {editor:this, oldData:this.value, newData:inputValue});
            YAHOO.log("Could not save Cell Editor input due to invalid data " +
                    lang.dump(inputValue), "warn", this.toString());
            return;
        }
    }
    
    // Update new value
    this.dataTable.updateCell(this.record, this.column, validValue);
    
    // Hide CellEditor
    this.container.style.display = "none";
    this.isActive = false;
    this.dataTable._oCellEditor =  null;
    
    this.fireEvent("saveEvent",
            {editor:this, oldData:this.value, newData:validValue});
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
        this.fireEvent("cancelEvent", {editor:this});
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
 * @method resetForm
 */
resetForm : function() {
    // To be implemented by subclass
},

/**
 * Sets focus in CellEditor.
 *
 * @method focus
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

lang.augmentProto(BCE, util.EventProvider);


/////////////////////////////////////////////////////////////////////////////
//
// Custom Events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fired when a CellEditor is shown.
 *
 * @event showEvent
 */

/**
 * Fired when a CellEditor has a keydown.
 *
 * @event keydownEvent
 * @param oArgs.event {HTMLEvent} The event object.
 */

/**
 * Fired when a CellEditor input is reverted.
 *
 * @event revertEvent
 * @param oArgs.newData {Object} New data value from form input field.
 * @param oArgs.oldData {Object} Old data value.
 */

/**
 * Fired when a CellEditor input is saved.
 *
 * @event saveEvent
 * @param oArgs.newData {Object} New data value from form input field.
 * @param oArgs.oldData {Object} Old data value.
 */

/**
 * Fired when a CellEditor input is canceled.
 *
 * @event cancelEvent
 */

/**
 * Fired when a CellEditor has a blur event.
 *
 * @event blurEvent
 */














/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The CheckboxCellEditor class provides functionality for inline editing
 * DataTable cell data with checkboxes.
 *
 * @namespace YAHOO.widget
 * @class CheckboxCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.CheckboxCellEditor = function(oConfigs) {
    this._sId = "yui-checkboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "checkbox", oConfigs); 
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

        /*TODO
        if(this.disableBtns) {
            Ev.addListener(this.container, "blur", function(v){
                // Save on "blur"
                this.save();
            }, this, true);        
        }
        */
    }
    else {
        YAHOO.log("Could not find checkboxOptions", "error", this.toString());
    }
},

/**
 * Resets CheckboxCellEditor UI to initial state.
 *
 * @method resetForm
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
 * @method focus
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








/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The DataCellEditor class provides functionality for inline editing
 * DataTable cell data with a YUI Calendar.
 *
 * @namespace YAHOO.widget
 * @class DateCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.DateCellEditor = function(oConfigs) {
    this._sId = "yui-dateceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "date", oConfigs); 
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
        calContainer.id = this.getId() + "-dateContainer"; // Needed for Calendar constructor
        var calendar =
                new YAHOO.widget.Calendar(this.getId() + "-date",
                calContainer.id);
        calendar.render();
        calContainer.style.cssFloat = "none";

        if(ua.ie) {
            var calFloatClearer = this.container.appendChild(document.createElement("br"));
            calFloatClearer.style.clear = "both";
        }
        
        this.calendar = calendar;

        /*TODO save on select
        if(this.disableBtns) {
            Ev.addListener(elDropdown, "blur", function(v){
                // Save on "blur"
                this.save();
            }, this, true);        
        }
        */
    }
    else {
        YAHOO.log("Could not find YUI Calendar", "error", this.toString());
    }
    
},

/**
 * Resets DateCellEditor UI to initial state.
 *
 * @method resetForm
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
 * @method focus
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









/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The DropdownCellEditor class provides functionality for inline editing
 * DataTable cell data a SELECT element.
 *
 * @namespace YAHOO.widget
 * @class DropdownCellEditor
 * @constructor
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.DropdownCellEditor = function(oConfigs) {
    this._sId = "yui-dropdownceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "dropdown", oConfigs); 
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
    this.dropdown = elDropdown;
    
    if(lang.isArray(this.dropdownOptions)) {
        for(var i=0, j=this.dropdownOptions.length; i<j; i++) {
            var dropdownOption = this.dropdownOptions[i];
            var elOption = document.createElement("option");
            elOption.value = (lang.isValue(dropdownOption.value)) ?
                    dropdownOption.value : dropdownOption;
            elOption.innerHTML = (lang.isValue(dropdownOption.text)) ?
                    dropdownOption.text : dropdownOption;
            elOption = elDropdown.appendChild(elOption);
        }
        
        // Save on blur
        if(this.disableBtns) {
            Ev.addListener(elDropdown, "change", function(v){
                this.save();
            }, this, true);        
        }
    }
},

/**
 * Resets DropdownCellEditor UI to initial state.
 *
 * @method resetForm
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
 * @method focus
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






/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The RadioCellEditor class provides functionality for inline editing
 * DataTable cell data with radio buttons.
 *
 * @namespace YAHOO.widget
 * @class RadioCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.RadioCellEditor = function(oConfigs) {
    this._sId = "yui-radioceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "radio", oConfigs); 
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
 * @property radioOptions
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
    else {
        YAHOO.log("Could not find radioOptions", "error", this.toString());
    }

},

/**
 * Resets RadioCellEditor UI to initial state.
 *
 * @method resetForm
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
 * @method focus
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






/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The TextareaCellEditor class provides functionality for inline editing
 * DataTable cell data with a TEXTAREA element.
 *
 * @namespace YAHOO.widget
 * @class TextareaCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.TextareaCellEditor = function(oConfigs) {
    this._sId = "yui-textareaceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "textarea", oConfigs); 
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
 * Moves TextareaCellEditor UI to a cell.
 *
 * @method move
 */
move : function() {
    this.textarea.style.width = this.cell.offsetWidth + "px";
    this.textarea.style.height = "3em";
    YAHOO.widget.TextareaCellEditor.superclass.move.call(this);
},

/**
 * Resets TextareaCellEditor UI to initial state.
 *
 * @method resetForm
 */
resetForm : function() {
    this.textarea.value = this.value;
},

/**
 * Sets focus in TextareaCellEditor.
 *
 * @method focus
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









/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * The TextboxCellEditor class provides functionality for inline editing
 * DataTable cell data with an INPUT TYPE=TEXT element.
 *
 * @namespace YAHOO.widget
 * @class TextboxCellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance. 
 * @param elCell {HTMLElement} TD element. 
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.TextboxCellEditor = function(oConfigs) {
    this._sId = "yui-textboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    this.constructor.superclass.constructor.call(this, "textbox", oConfigs); 
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
 * Moves TextboxCellEditor UI to a cell.
 *
 * @method move
 */
move : function() {
    this.textbox.style.width = this.cell.offsetWidth + "px";
    YAHOO.widget.TextboxCellEditor.superclass.move.call(this);
},

/**
 * Resets TextboxCellEditor UI to initial state.
 *
 * @method resetForm
 */
resetForm : function() {
    this.textbox.value = this.value;
},

/**
 * Sets focus in TextboxCellEditor.
 *
 * @method focus
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

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
    
/**
 * Factory class for creating a BaseCellEditor subclass instance.
 *
 * @namespace YAHOO.widget
 * @class CellEditor
 * @constructor
 * @param oDataTable {YAHOO.widget.DataTable} DataTable instance.
 * @param sType {String} Editor type.
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
widget.CellEditor = function(sType, oConfigs) {
    // Point to one of the subclasses
    if(sType && DT.Editors[sType]) {
        lang.augmentObject(BCE, DT.Editors[sType]);
        return new DT.Editors[sType](oConfigs);
    }
    else {
        return new BCE(null, oConfigs);
    }
};

var CE = widget.CellEditor;

// Copy static members to CellEditor class
lang.augmentObject(CE, BCE);


})();
