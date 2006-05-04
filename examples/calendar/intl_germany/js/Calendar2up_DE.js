YAHOO.widget.Calendar2up_DE_Cal = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up_DE_Cal.prototype = new YAHOO.widget.Calendar2up_Cal();

YAHOO.widget.Calendar2up_DE_Cal.prototype.customConfig = function() {
	this.Config.Locale.MONTHS_SHORT = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
	this.Config.Locale.MONTHS_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	this.Config.Locale.WEEKDAYS_1CHAR = ["S", "M", "D", "M", "D", "F", "S"];
	this.Config.Locale.WEEKDAYS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
	this.Config.Locale.WEEKDAYS_MEDIUM = ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"];
	this.Config.Locale.WEEKDAYS_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

	this.Config.Options.START_WEEKDAY = 1;
}

/*************************************/

YAHOO.widget.Calendar2up_DE = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{	
		this.buildWrapper(containerId);
		this.init(2, id, containerId, monthyear, selected);
	}
}

YAHOO.widget.Calendar2up_DE.prototype = new YAHOO.widget.Calendar2up();

YAHOO.widget.Calendar2up_DE.prototype.constructChild = function(id,containerId,monthyear,selected) {
	var cal = new YAHOO.widget.Calendar2up_DE_Cal(id,containerId,monthyear,selected);
	return cal;
};
