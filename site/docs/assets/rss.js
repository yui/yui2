/*namespace*/
YAHOO.namespace("yui");

/*constructor:
elTitle: element in which to insert feed's title text
elBody: element in which to insert feed's articles
sFeed: name of feed, indexed to url located in proxy file
iArticles: max # of articles to display
bTitle: if true, try to retrieve the title from the feed itself;
	leave false if you're setting your own title
nOpen: Amount of time to spend on the self-opening animation.
nFadeIn: Amount of time to spend on the fade-in animation */
YAHOO.yui.RssReader = function(elTitle, elBody, sFeed, iArticles, bTitle, nOpen, nFadeIn) {
	this.elTitle = elTitle;
	this.elBody = elBody;
	this.sFeed = sFeed;
	this.iArticles = iArticles;
	this.bTitle = bTitle;
	this.nOpen = nOpen;
	this.nFadeIn = nFadeIn;
};

/*Flag identifying whether user is in the process of leaving
the page, which can cause XHR failure handler to fire; if
this is true, we don't display error message.*/
YAHOO.yui.RssReader.LEAVINGPAGE=false;

/*The LEAVINGPAGE flag is set to true currently by
any click on an <a> element.*/
YAHOO.yui.RssReader.monitorClicks = function(e) {
	if(YAHOO.util.Event.getTarget(e).nodeName.toLowerCase()=="a"){
		YAHOO.yui.RssReader.LEAVINGPAGE=true;
	};
}

/*Event listener for monitorClicks*/
YAHOO.util.Event.on(document,"click",YAHOO.yui.RssReader.monitorClicks);

/*When we get an XHR failure handler triggered with status 0, we
can't immediately check the LEAVINGPAGE flag -- the failure
happens before we know if a link has been clicked.  So we queue
up the error here and check back via setTimeout to see if the
XHR failure was likely caused by an outbound link click.*/
YAHOO.yui.RssReader.aPendingErrors=[];

/*This is the function called by setTimeout after a delay on
a status 0 XHR message.  Each time it's called,
it grabs the first one in the queue and sends it to the error
handler which can now safely check the LEAVINGPAGE flag.*/
YAHOO.yui.RssReader.processNextError = function() {
	if (YAHOO.yui.RssReader.aPendingErrors.length) {
		var nextError = YAHOO.yui.RssReader.aPendingErrors.shift();
		nextError.reportError.call(nextError,"communication error");
	}
}

/* Function processes the XHR response and compiles
<li> sequence, adds <ul>, and initiates animations.*/
YAHOO.yui.RssReader.prototype.handleXHR = function(o) {
	try {
		var elTitle=document.getElementById(this.elTitle);
		var elBody=document.getElementById(this.elBody);
		var root=o.responseXML.documentElement;
		var sFeedTitle=root.getElementsByTagName("title")[0].firstChild.nodeValue;
		var schema=(root.nodeName=="rss")?this.RSS:this.ATOM;
		var sHTML="";
		var items=root.getElementsByTagName(schema.items);
		var count=(this.iArticles<items.length)?this.iArticles:items.length;
		var sTitle,sLink,dDate,sAuthor;
		for(var itemNumber=0;itemNumber<count;itemNumber++) { 
			sTitle=this.escapeMarkup(items[itemNumber].getElementsByTagName(schema.title)[0].firstChild.nodeValue);
			sLink=items[itemNumber].getElementsByTagName(schema.url)[0].firstChild.nodeValue;
			dDate=new Date(items[itemNumber].getElementsByTagName(schema.date)[0].firstChild.nodeValue);
			dDate=this.formatDate(dDate,false);
			/*if date processing fails (returns false, just set
			the timestamp to blank*/
			if(!dDate) {dDate="";}
			sAuthor = this.escapeMarkup(this.getAuthor(items[itemNumber],schema));
			if(!sAuthor) {
				sAuthor="unknown";
			}
			sHTML+='<li><p class="title"><a href="'+sLink+'">'+sTitle+'</a></p>';
			sHTML+='<p class="byline"><cite>'+sAuthor+'</cite> <span class="yuirssreader-date">'+dDate+'</span></p></li>';
		}
		
		/*create UL, out of flow and opacity 0;
		measure its height*/
		var elUl=this.elUl=document.createElement("ul");
		YAHOO.util.Dom.addClass(elUl,"yuirssreader");
		YAHOO.util.Dom.setStyle(elUl,"opacity",0);
		YAHOO.util.Dom.setStyle(elUl,"visibility","hidden"); /*required for older Opera*/
		elUl.style.position="absolute";
		elUl.innerHTML=sHTML;elBody.appendChild(elUl);
		
		/*set title from feed, if requested*/
		if(this.bTitle){elTitle.innerHTML=sFeedTitle;};
		
		/*create animation to make space for insertion of 
		UL into page flow*/
		var sizeAnim=new YAHOO.util.Anim(elBody,{
				height: {to:elUl.offsetHeight+15}
			}, this.nOpen);
		
		/*on completing sizeAnim, remove the loading-content
		placeholder and fade in the UL, releasing it back 
		into the page flow.*/
		var onComplete=function(type,args,o) {
			/*The loading placeholder is very specific at present;
			has to be a <p> with class "loading-content"*/
			var elLoading=YAHOO.util.Dom.getElementsByClassName("loading-content","p",YAHOO.util.Dom.get(this.elBody))[0];
			elLoading.parentNode.removeChild(elLoading);
			this.elUl.style.position="static";
			YAHOO.util.Dom.setStyle(this.elUl,"visibility","visible");
			YAHOO.util.Dom.get(this.elBody).style.height="auto";
			/*All set: Fade it in...*/
			(new YAHOO.util.Anim(this.elUl,{opacity:{to:1}},this.nFadeIn)).animate();
		};
		sizeAnim.onComplete.subscribe(onComplete,this,true);
		sizeAnim.animate();
	} catch(e) {
		/*generic error handling...*/
		this.reportError("parse");
	}
};

/*Author field can be found in a variety of places, depending
on the feed.  Try in the most logical order, then fail by returning
false if necessary.*/
YAHOO.yui.RssReader.prototype.getAuthor = function(el,schema) {
	try {
		if(el.getElementsByTagName(schema.author).length>0){
			return el.getElementsByTagName(schema.author)[0].firstChild.nodeValue;
		} else if (el.getElementsByTagName("creator").length>0) {
			return el.getElementsByTagName("creator")[0].firstChild.nodeValue;
		} else if (el.getElementsByTagName("dc:creator").length>0) {
			return el.getElementsByTagName("dc:creator")[0].firstChild.nodeValue;
		} else {return false;}
	} catch(e) {return false;}
};

/*Method sets up and fires the XHR call.  In current implementation,
this could only be used once*/
YAHOO.yui.RssReader.prototype.refreshNews =function() {
	var callback = {
		failure:function(o){
			/*failure with status 0 is probably an outbound click;
			treat separately.  Other status is probably a legit error.*/
			if(o.status!="0") {
				this.reportError("XHR error with status: "+o.statusText);
			} else {
				/*Wait n ms, then check to see if the LEAVINGPAGE flag
				has been set; if yes, we won't show the error.  Here,
				just queue up the the error and setTimeout to check 
				back.*/
				YAHOO.yui.RssReader.aPendingErrors.push(this);
				setTimeout(YAHOO.yui.RssReader.processNextError(),50);
			}
		},
		success:this.handleXHR,
		scope:this
	};
	
	/*Make asynch request; sFeed must be present in XHR proxy file
	so that it knows where it really needs to go to fetch the feed.*/
	YAHOO.util.Connect.asyncRequest(
		'GET',
		'/yui/docs/assets/xhrproxy.php?feed='+this.sFeed,
		callback
	);
};

/*Crude schema for RSS;
@todo: create separate schema for RSS versions*/
YAHOO.yui.RssReader.prototype.RSS = {
	type:"RSS schema",
	items:"item",
	title:"title",
	author:"author",
	url:"link",
	date:"pubDate",
	text:"description"
};

/*Crude schema for Atom;
@todo: create separate schema for Atom versions*/
YAHOO.yui.RssReader.prototype.ATOM = {
	type:"ATOM schema",
	items:"entry",
	title:"title",
	author:"name",
	url:"id",
	date:"issued",
	text:"summary"
};

/*Crude date formatter; supports a short and long date.
Override for i18n; use MONTHS member to handle month
names*/
YAHOO.yui.RssReader.prototype.formatDate=function(dDate,bLong){
	try{
		var sDate="";
		var hrs=dDate.getHours();
		var amPm=(hrs>11)?"PM":"AM";hrs=(hrs>12)?hrs-12:hrs;
		/*Not supporting 24hr clock*/
		if(hrs==0){hrs=12;}
		var mins=dDate.getMinutes();
		/*add leading zero to minutes if less than ten:*/
		if(mins<10){mins="0"+mins;}
		var time=hrs+":"+mins+" "+amPm;
		if(bLong){
			sDate+=dDate.getDate()+" "+this.MONTHS[dDate.getMonth()].longname+" "+dDate.getFullYear()+", "+time;
		}else{
			sDate+=(dDate.getMonth()+1)+"/"+dDate.getDate()+"/"+dDate.getFullYear()+" "+time;
		}
		return sDate;
	} catch(e) {
		return false;
	}
};

/*Error reporting function; don't report error if
it appears that the user is leaving page (has just clicked on
an <a> element*/
YAHOO.yui.RssReader.prototype.reportError=function(type){
	if(!YAHOO.yui.RssReader.LEAVINGPAGE){
		var elBody=document.getElementById(this.elBody);
		if(elBody){
			elBody.innerHTML="There was a problem interpreting the RSS feed for this resource ("+type+").";
		}
	}
}

/*Month names for limited i18n adaptation*/
YAHOO.yui.RssReader.prototype.MONTHS=[
	{shortname:"Jan",longname:"January"},
	{shortname:"Feb",longname:"February"},
	{shortname:"Mar",longname:"March"},
	{shortname:"Apr",longname:"April"},
	{shortname:"May",longname:"May"},
	{shortname:"Jun",longname:"June"},
	{shortname:"Jul",longname:"July"},
	{shortname:"Aug",longname:"August"},
	{shortname:"Sep",longname:"September"},
	{shortname:"Oct",longname:"October"},
	{shortname:"Nov",longname:"November"},
	{shortname:"Dec",longname:"December"}];

/*Protect titles and author name strings from incoming markup*/
YAHOO.yui.RssReader.prototype.escapeMarkup = function (sInput) {                                       
        return(sInput.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;'));
};


/*Logic specific to the YUI home page; included here to 
avoid an extra http request:*/
var init=function(){
	var ydnJs=new YAHOO.yui.RssReader(
		"ydnJsTitle",
		"ydnJsBody",
		"ydn-javascript",
		15,
		false,
		0,
		.3);
	ydnJs.refreshNews();
	var yuiblog=new YAHOO.yui.RssReader(
		"yuiblogTitle",
		"yuiblogBody",
		"yuiblog",
		7,
		false,
		.3,
		.3);
	yuiblog.refreshNews();
};
/*This secondary content can and should wait until the
page is fully loaded before being requested.*/
YAHOO.util.Event.on(window,"load",init);