
YAHOO.util.Config=function(owner){if(owner){this.init(owner);}}
YAHOO.util.Config.prototype.init=function(owner){this.owner=owner;this.configChangedEvent=new YAHOO.util.CustomEvent("configChanged");var config={};var deferredEvents={};var initialConfig={};var fireEvent=function(key,property,value){if(property.dependentElement&&!YAHOO.util.Dom._elementInDom(property.dependentElement)){deferredEvents[key]={args:value};return true;}else{if(property.mustChange){if(property.defaultValue!=property.value){property.event.fire(value);}}else{property.event.fire(value);}
return false;}}
this.addProperty=function(key,val,hdl,vfn,el,mc){config[key]={event:new YAHOO.util.CustomEvent(key),handler:hdl,dependentElement:el,defaultValue:val,value:null,validator:vfn,mustChange:mc};if(config[key].handler){config[key].event.subscribe(config[key].handler,this.owner,true);}
this.setProperty(key,val,true);}
this.getConfig=function(){var cfg={};for(var prop in config)
{cfg[prop]=config[prop].value;}
return cfg;}
this.getProperty=function(key){var property=config[key];if(property!=undefined)
{return property.value;}else{return undefined;}}
this.getDefault=function(key){var property=config[key];if(property!=undefined)
{return property.defaultValue;}else{return undefined;}}
this.resetProperty=function(key){var property=config[key];if(property!=undefined){this.setProperty(key,initialConfig[key].value);}else{return undefined;}}
this.setProperty=function(key,value,silent){var property=config[key];if(property!=undefined)
{if(property.validator&&!property.validator(value)){return false;}else{property.value=value;if(!silent){var deferred=fireEvent(key,property,value);this.configChangedEvent.fire([key,value,deferred]);}
return true;}}else{return false;}}
this.refireEvent=function(key){var property=config[key];if(property!=undefined){fireEvent(key,property,property.value);}}
this.applyConfig=function(userConfig,init){if(init){initialConfig=userConfig;}
for(var prop in userConfig){this.setProperty(prop,userConfig[prop],true);}
for(var prop in userConfig){var property=config[prop];if(property!=undefined){fireEvent(prop,property,userConfig[prop]);}}}
this.refresh=function(){for(var prop in config){this.refireEvent(prop);}}
this.reset=function(){this.applyConfig(initialConfig);}
this.subscribeToConfigEvent=function(key,handler,obj,override){var property=config[key];if(property!=undefined){property.event.subscribe(handler,obj,override);return true;}else{return false;}}
this.fireDeferredEvents=function(){for(var prop in deferredEvents){var property=config[prop];if(property!=undefined){fireEvent(prop,property,deferredEvents[prop].args);}}}
this.checkBoolean=function(val){if(typeof val=='boolean')
{return true;}else{return false;}}
this.checkNumber=function(val){if(isNaN(val))
{return false;}else{return true;}}}
YAHOO.util.Dom._elementInDom=function(element){var parentNode=element.parentNode;if(!parentNode){return false;}else{if(parentNode.tagName=="HTML"){return true;}else{return YAHOO.util.Dom._elementInDom(parentNode);}}}
YAHOO.widget.Module=function(el,userConfig){if(el){this.init(el,userConfig);}}
YAHOO.widget.Module.CSS_HEADER="hd";YAHOO.widget.Module.CSS_BODY="bd";YAHOO.widget.Module.CSS_FOOTER="ft";YAHOO.widget.Module.prototype={constructor:YAHOO.widget.Module,element:null,header:null,body:null,footer:null,childNodesInDOM:null,initEvents:function(){this.appendEvent=new YAHOO.util.CustomEvent("append");this.beforeRenderEvent=new YAHOO.util.CustomEvent("beforeRender");this.renderEvent=new YAHOO.util.CustomEvent("render");this.changeHeaderEvent=new YAHOO.util.CustomEvent("changeHeader");this.changeBodyEvent=new YAHOO.util.CustomEvent("changeBody");this.changeFooterEvent=new YAHOO.util.CustomEvent("changeFooter");this.changeContentEvent=new YAHOO.util.CustomEvent("changeContent");this.destroyEvent=new YAHOO.util.CustomEvent("destroy");this.beforeShowEvent=new YAHOO.util.CustomEvent("beforeShow",this);this.showEvent=new YAHOO.util.CustomEvent("show",this);this.beforeHideEvent=new YAHOO.util.CustomEvent("beforeHide",this);this.hideEvent=new YAHOO.util.CustomEvent("hide",this);},initDefaultConfig:function(){this.cfg=new YAHOO.util.Config(this);this.cfg.addProperty("visible",null,this.configVisible,this.cfg.checkBoolean,this.element,true);},init:function(el,userConfig){if(typeof el=="string")
{var elId=el;el=document.getElementById(el);if(!el)
{el=document.createElement("DIV");el.id=elId;}}
this.element=el;this.id=el.id;this.childNodesInDOM=[null,null,null];var childNodes=this.element.childNodes;if(childNodes)
{for(var i=0;i<childNodes.length;i++)
{var child=childNodes[i];switch(child.className)
{case YAHOO.widget.Module.CSS_HEADER:this.header=child;this.childNodesInDOM[0]=child;break;case YAHOO.widget.Module.CSS_BODY:this.body=child;this.childNodesInDOM[1]=child;break;case YAHOO.widget.Module.CSS_FOOTER:this.footer=child;this.childNodesInDOM[2]=child;break;}}}
this.initEvents();this.initDefaultConfig();if(userConfig){this.cfg.applyConfig(userConfig);}},setHeader:function(headerContent){if(!this.header){this.header=document.createElement("DIV");this.header.className=YAHOO.widget.Module.CSS_HEADER;}
if(typeof headerContent=="string"){this.header.innerHTML=headerContent;}else{this.header.innerHTML="";this.header.appendChild(headerContent);}
this.changeHeaderEvent.fire(headerContent);this.changeContentEvent.fire();},appendToHeader:function(element){if(!this.header){this.header=document.createElement("DIV");this.header.className=YAHOO.widget.Module.CSS_HEADER;}
this.header.appendChild(element);this.changeHeaderEvent.fire(element);this.changeContentEvent.fire();},setBody:function(bodyContent){if(!this.body){this.body=document.createElement("DIV");this.body.className=YAHOO.widget.Module.CSS_BODY;}
if(typeof bodyContent=="string")
{this.body.innerHTML=bodyContent;}else{this.body.innerHTML="";this.body.appendChild(bodyContent);}
this.changeBodyEvent.fire(bodyContent);this.changeContentEvent.fire();},appendToBody:function(element){if(!this.body){this.body=document.createElement("DIV");this.body.className=YAHOO.widget.Module.CSS_BODY;}
this.body.appendChild(element);this.changeBodyEvent.fire(element);this.changeContentEvent.fire();},setFooter:function(footerContent){if(!this.footer){this.footer=document.createElement("DIV");this.footer.className=YAHOO.widget.Module.CSS_FOOTER;}
if(typeof footerContent=="string")
{this.footer.innerHTML=footerContent;}else{this.footer.innerHTML="";this.footer.appendChild(footerContent);}
this.changeFooterEvent.fire(footerContent);this.changeContentEvent.fire();},appendToFooter:function(element){if(!this.footer){this.footer=document.createElement("DIV");this.footer.className=YAHOO.widget.Module.CSS_FOOTER;}
this.footer.appendChild(element);this.changeFooterEvent.fire(element);this.changeContentEvent.fire();},render:function(appendToNode){this.beforeRenderEvent.fire();var me=this;var appendTo=function(element){if(typeof element=="string"){element=document.getElementById(element);}
if(element){element.appendChild(me.element);me.appendEvent.fire();}}
if(appendToNode){if(typeof appendToNode=="string"){el=document.getElementById(el);if(!el){el=document.createElement("DIV");el.id=elId;}}
appendTo(appendToNode);}else{if(!YAHOO.util.Dom._elementInDom(this.element)){return false;}}
if((!this.childNodesInDOM[0])&&this.header){var firstChild=this.element.firstChild;if(firstChild){this.element.insertBefore(this.header,firstChild);}else{this.element.appendChild(this.header);}}
if((!this.childNodesInDOM[1])&&this.body){if(this.childNodesInDOM[2]){this.element.insertBefore(this.body,this.childNodesInDOM[2]);}else{this.element.appendChild(this.body);}}
if((!this.childNodesInDOM[2])&&this.footer){this.element.appendChild(this.footer);}
this.cfg.fireDeferredEvents();this.renderEvent.fire();return true;},destroy:function(){if(this.element){var parent=this.element.parentNode;}
if(parent){parent.removeChild(this.element);}
this.element=null;this.header=null;this.body=null;this.footer=null;this.destroyEvent.fire();},show:function(){this.beforeShowEvent.fire();this.cfg.setProperty("visible",true);this.showEvent.fire();},hide:function(){this.beforeHideEvent.fire();this.cfg.setProperty("visible",false);this.hideEvent.fire();},configVisible:function(type,args,obj){var visible=args[0];if(visible){YAHOO.util.Dom.setStyle(this.element,"display","block");}else{YAHOO.util.Dom.setStyle(this.element,"display","none");}}}
YAHOO.widget.Overlay=function(el,userConfig){if(arguments.length>0){YAHOO.widget.Overlay.superclass.constructor.call(this,el,userConfig);}}
YAHOO.widget.Overlay.prototype=new YAHOO.widget.Module();YAHOO.widget.Overlay.prototype.constructor=YAHOO.widget.Overlay;YAHOO.widget.Overlay.superclass=YAHOO.widget.Module.prototype;YAHOO.widget.Overlay.prototype.init=function(el,userConfig){YAHOO.widget.Overlay.superclass.init.call(this,el);this.renderEvent.subscribe(this.cfg.refresh,this.cfg,true);if(userConfig){this.cfg.applyConfig(userConfig,true);}}
YAHOO.widget.Overlay.prototype.initEvents=function(){YAHOO.widget.Overlay.superclass.initEvents.call(this);this.beforeMoveEvent=new YAHOO.util.CustomEvent("beforeMove",this);this.moveEvent=new YAHOO.util.CustomEvent("move",this);}
YAHOO.widget.Overlay.prototype.initDefaultConfig=function(){YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);this.browser=function(){var ua=navigator.userAgent.toLowerCase();if(ua.indexOf('opera')!=-1)
return'opera';else if(ua.indexOf('msie')!=-1)
return'ie';else if(ua.indexOf('safari')!=-1)
return'safari';else if(ua.indexOf('gecko')!=-1)
return'gecko';else
return false;}();this.cfg.addProperty("x",null,this.configX,this.cfg.checkNumber,this.container||this.element,true);this.cfg.addProperty("y",null,this.configY,this.cfg.checkNumber,this.container||this.element,true);this.cfg.addProperty("xy",null,this.configXY,null,this.container||this.element,true);this.cfg.addProperty("width","auto",this.configWidth,null,this.container||this.element);this.cfg.addProperty("height","auto",this.configHeight,null,this.container||this.element);this.cfg.addProperty("zIndex",null,this.configzIndex,this.cfg.checkNumber,this.container||this.element,true);this.cfg.addProperty("constraintoviewport",false,this.configConstrainToViewport,this.cfg.checkBoolean);this.cfg.addProperty("iframe",(this.browser=="ie"?true:false),this.configIframe,this.cfg.checkBoolean,this.container||this.element);}
YAHOO.widget.Overlay.prototype.moveTo=function(x,y){this.cfg.setProperty("xy",[x,y]);}
YAHOO.widget.Overlay.prototype.configVisible=function(type,args,obj){var val=args[0];if(!val){YAHOO.util.Dom.setStyle(this.container||this.element,"visibility","hidden");if(this.iframe){YAHOO.util.Dom.setStyle(this.iframe,"visibility","hidden");}}else{YAHOO.util.Dom.setStyle(this.container||this.element,"visibility","visible");if(this.iframe){YAHOO.util.Dom.setStyle(this.iframe,"visibility","visible");}}}
YAHOO.widget.Overlay.prototype.configHeight=function(type,args,obj){var height=args[0];var el=this.element;YAHOO.util.Dom.setStyle(el,"height",height);this.cfg.refireEvent("iframe");}
YAHOO.widget.Overlay.prototype.configWidth=function(type,args,obj){var width=args[0];var el=this.element;YAHOO.util.Dom.setStyle(el,"width",width);this.cfg.refireEvent("iframe");}
YAHOO.widget.Overlay.prototype.configzIndex=function(type,args,obj){var zIndex=args[0];var el=this.container||this.element;if(this.iframe){if(zIndex<=0){zIndex=1;}
YAHOO.util.Dom.setStyle(this.iframe,"zIndex",(zIndex-1));}
YAHOO.util.Dom.setStyle(el,"zIndex",zIndex);this.cfg.setProperty("zIndex",zIndex,true);}
YAHOO.widget.Overlay.prototype.configXY=function(type,args,obj){var pos=args[0];var x=pos[0];var y=pos[1];this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");YAHOO.util.Dom.setXY(this.container||this.element,[x,y]);if(this.cfg.getProperty("iframe")){this.cfg.refireEvent("iframe");}
this.moveEvent.fire([x,y]);}
YAHOO.widget.Overlay.prototype.configX=function(type,args,obj){var x=args[0];var y=this.cfg.getProperty("y");this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");YAHOO.util.Dom.setX(this.container||this.element,x);this.cfg.setProperty("xy",[x,y],true);this.moveEvent.fire([x,y]);}
YAHOO.widget.Overlay.prototype.configY=function(type,args,obj){var x=this.cfg.getProperty("x");var y=args[0];this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);this.beforeMoveEvent.fire([x,y]);x=this.cfg.getProperty("x");y=this.cfg.getProperty("y");YAHOO.util.Dom.setY(this.container||this.element,y);this.cfg.setProperty("xy",[x,y],true);this.moveEvent.fire([x,y]);}
YAHOO.widget.Overlay.prototype.configIframe=function(type,args,obj){var val=args[0];var el=this.container||this.element;if(val){if(!this.iframe){this.iframe=document.createElement("iframe");document.body.appendChild(this.iframe);YAHOO.util.Dom.setStyle(this.iframe,"position","absolute");YAHOO.util.Dom.setStyle(this.iframe,"zIndex","0");YAHOO.util.Dom.setStyle(this.iframe,"opacity","0");}else{this.iframe.style.display="block";}
if(YAHOO.util.Dom.getStyle(el,"zIndex")<=0){YAHOO.util.Dom.setStyle(el,"zIndex",1);}
YAHOO.util.Dom.setStyle(this.iframe,"top",YAHOO.util.Dom.getXY(el)[1]-2+"px");YAHOO.util.Dom.setStyle(this.iframe,"left",YAHOO.util.Dom.getXY(el)[0]-2+"px");var width=el.offsetWidth;var height=el.offsetHeight;YAHOO.util.Dom.setStyle(this.iframe,"width",width+"px");YAHOO.util.Dom.setStyle(this.iframe,"height",height+"px");}else{if(this.iframe){this.iframe.style.display="none";}}}
YAHOO.widget.Overlay.prototype.configConstrainToViewport=function(type,args,obj){var val=args[0];if(val){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}else{this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}}
YAHOO.widget.Overlay.prototype.enforceConstraints=function(type,args,obj){var pos=args[0];var bod=document.getElementsByTagName('body')[0];var htm=document.getElementsByTagName('html')[0];var bodyOverflow=YAHOO.util.Dom.getStyle(bod,"overflow");var htmOverflow=YAHOO.util.Dom.getStyle(htm,"overflow");var x=pos[0];var y=pos[1];var offsetHeight=this.element.offsetHeight;var offsetWidth=this.element.offsetWidth;var viewPortWidth=YAHOO.util.Dom.getClientWidth();var viewPortHeight=YAHOO.util.Dom.getClientHeight();var scrollX=window.scrollX||document.body.scrollLeft;var scrollY=window.scrollY||document.body.scrollTop;var topConstraint=scrollY+10;var leftConstraint=scrollX+10;var bottomConstraint=scrollY+viewPortHeight-offsetHeight-10;var rightConstraint=scrollX+viewPortWidth-offsetWidth-10;if(x<leftConstraint){x=leftConstraint;}else if(x>rightConstraint){x=rightConstraint;}
if(y<topConstraint){y=topConstraint;}else if(y>bottomConstraint){y=bottomConstraint;}
this.cfg.setProperty("x",x,true);this.cfg.setProperty("y",y,true);}
YAHOO.widget.Tooltip=function(el,userConfig){if(arguments.length>0){YAHOO.widget.Tooltip.superclass.constructor.call(this,el,userConfig);}}
YAHOO.widget.Tooltip.prototype=new YAHOO.widget.Overlay();YAHOO.widget.Tooltip.prototype.constructor=YAHOO.widget.Tooltip;YAHOO.widget.Tooltip.superclass=YAHOO.widget.Overlay.prototype;YAHOO.widget.Tooltip.CSS_TOOLTIP="tt";YAHOO.widget.Tooltip.prototype.init=function(el,userConfig){YAHOO.widget.Overlay.superclass.init.call(this,el);this.element.className=YAHOO.widget.Tooltip.CSS_TOOLTIP;if(userConfig){this.cfg.applyConfig(userConfig);}
this.cfg.setProperty("visible",false);this.cfg.setProperty("constraintoviewport",true);this.render(document.body);}
YAHOO.widget.Tooltip.prototype.initDefaultConfig=function(){YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);this.cfg.addProperty("showdelay",2000,this.configShowDelay,this.cfg.checkNumber);this.cfg.addProperty("autodismissdelay",5000,this.configAutoDismissDelay,this.cfg.checkNumber);this.cfg.addProperty("hidedelay",250,this.configHideDelay,this.cfg.checkNumber);this.cfg.addProperty("text",null,this.configText,null,null,true);this.cfg.addProperty("context",null,this.configContext,null,null,true);}
YAHOO.widget.Tooltip.prototype.configText=function(type,args,obj){var text=args[0];if(text){this.text=text;this.setBody(this.text);}}
YAHOO.widget.Tooltip.prototype.configContext=function(type,args,obj){var context=args[0];if(context){if(typeof context=="string"){this.context=document.getElementById(context);}else{this.context=context;}
if(this.context&&this.context.title&&!this.cfg.getProperty("text")){this.cfg.setProperty("text",this.context.title);}
YAHOO.util.Event.addListener(this.context,"mouseover",this.onContextMouseOver,this);YAHOO.util.Event.addListener(this.context,"mouseout",this.onContextMouseOut,this);}}
YAHOO.widget.Tooltip.prototype.onContextMouseOver=function(e,obj){if(!obj){obj=this;}
if(obj.context.title){obj.tempTitle=obj.context.title;obj.context.title="";}
this.procId=obj.doShow(e);}
YAHOO.widget.Tooltip.prototype.onContextMouseOut=function(e,obj){if(!obj){obj=this;}
if(obj.tempTitle){obj.context.title=obj.tempTitle;}
if(this.procId){clearTimeout(this.procId);}
setTimeout(function(){obj.hide();},obj.cfg.getProperty("hidedelay"));}
YAHOO.widget.Tooltip.prototype.doShow=function(e){var pageX=YAHOO.util.Event.getPageX(e);var pageY=YAHOO.util.Event.getPageY(e);var me=this;return setTimeout(function(){var yOffset=25;if(me.browser=="opera"&&me.context.tagName=="A"){yOffset+=12;}
me.moveTo(pageX,pageY+yOffset);me.show();me.doHide();},this.cfg.getProperty("showdelay"));}
YAHOO.widget.Tooltip.prototype.doHide=function(){var me=this;setTimeout(function(){me.hide();},this.cfg.getProperty("autodismissdelay"));}
YAHOO.widget.Panel=function(el,userConfig){if(arguments.length>0)
{YAHOO.widget.Panel.superclass.constructor.call(this,el,userConfig);}}
YAHOO.widget.Panel.prototype=new YAHOO.widget.Overlay();YAHOO.widget.Panel.prototype.constructor=YAHOO.widget.Panel;YAHOO.widget.Panel.superclass=YAHOO.widget.Overlay.prototype;YAHOO.widget.Panel.prototype.init=function(el,userConfig){YAHOO.widget.Panel.superclass.init.call(this,el);this.buildContainer()
YAHOO.util.Dom.addClass(this.element,"panel");if(userConfig){this.cfg.applyConfig(userConfig,true);}}
YAHOO.widget.Panel.prototype.initDefaultConfig=function(){YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);this.cfg.addProperty("close",true,this.configClose,this.cfg.checkBoolean);this.cfg.addProperty("draggable",true,this.configDraggable,this.cfg.checkBoolean);this.cfg.addProperty("fixedcenter",false,this.configFixedCenter,this.cfg.checkBoolean);this.cfg.addProperty("animate",true,null,this.cfg.checkBoolean);this.cfg.addProperty("fadeintime",0.25,null,this.cfg.checkNumber);this.cfg.addProperty("fadeouttime",0.25,null,this.cfg.checkNumber);this.cfg.addProperty("underlay","shadow",this.configUnderlay,null);this.cfg.addProperty("modal",false,this.configModal,this.cfg.checkBoolean);}
YAHOO.widget.Panel.prototype.configVisible=function(type,args,obj){var val=args[0];YAHOO.util.Dom.setStyle(this.element,"visibility","inherit");if(this.cfg.getProperty("animate")){var inTime=this.cfg.getProperty("fadeintime");var outTime=this.cfg.getProperty("fadeouttime");var currentVis=YAHOO.util.Dom.getStyle(this.container,"visibility");var shadow=this.shadow;var iframe=this.iframe;if(val){if(currentVis=="hidden"){if(shadow&&shadow.style.filter){shadow.style.filter=null;}
var fadeIn=new YAHOO.util.Anim(this.container,{opacity:{to:1}},inTime);fadeIn.onStart.subscribe(function(){this.getEl().style.visibility="visible";if(iframe){YAHOO.util.Dom.setStyle(iframe,"visibility","visible");}
YAHOO.util.Dom.setStyle(this.getEl(),"opacity",0);});fadeIn.onComplete.subscribe(function(){if(this.getEl().style.filter){this.getEl().style.filter=null;}
if(shadow){YAHOO.util.Dom.setStyle(shadow,"opacity",.5);}});fadeIn.animate();}}else{if(currentVis=="visible"){if(shadow&&shadow.style.filter){shadow.style.filter=null;}
var fadeOut=new YAHOO.util.Anim(this.container,{opacity:{to:0}},outTime)
fadeOut.onComplete.subscribe(function(){this.getEl().style.visibility="hidden";if(this.getEl().style.filter){this.getEl().style.filter=null;}
if(iframe){YAHOO.util.Dom.setStyle(iframe,"visibility","hidden");}});fadeOut.animate();}}}else{if(val){YAHOO.util.Dom.setStyle((this.container),"visibility","visible");if(this.iframe){YAHOO.util.Dom.setStyle(this.iframe,"visibility","visible");}}else{YAHOO.util.Dom.setStyle((this.container),"visibility","hidden");if(this.iframe){YAHOO.util.Dom.setStyle(this.iframe,"visibility","hidden");}}}}
YAHOO.widget.Panel.prototype.configHeight=function(type,args,obj){YAHOO.widget.Panel.superclass.configHeight.call(this,type,args,obj);this.cfg.refireEvent("underlay");}
YAHOO.widget.Panel.prototype.configWidth=function(type,args,obj){YAHOO.widget.Panel.superclass.configWidth.call(this,type,args,obj);this.cfg.refireEvent("underlay");}
YAHOO.widget.Panel.prototype.configClose=function(type,args,obj){var val=args[0];var doHide=function(e,obj){obj.hide();}
if(val){if(!this.close){this.close=document.createElement("DIV");this.close.className="close";this.close.innerHTML="&nbsp;";this.element.appendChild(this.close);YAHOO.util.Event.addListener(this.close,"click",doHide,this);}else{this.close.style.display="block";}}else{if(this.close){this.close.style.display="none";}}}
YAHOO.widget.Panel.prototype.configDraggable=function(type,args,obj){var val=args[0];if(val){if(!this.header){this.setHeader("&nbsp;");this.render();}
this.registerDragDrop();this.dd.onDrag=function(){obj.syncPosition();}
if(this.browser=="ie"){this.dd.startDrag=function(){YAHOO.util.Dom.addClass(obj.element,"drag");}
this.dd.endDrag=function(){YAHOO.util.Dom.removeClass(obj.element,"drag");}}}else{if(this.dd){this.dd.unreg();}
if(this.header){YAHOO.util.Dom.setStyle(this.header,"cursor","default");}}}
YAHOO.widget.Panel.prototype.configUnderlay=function(type,args,obj){var val=args[0];switch(val.toLowerCase()){case"shadow":this.element.style.position="absolute";if(!this.shadow){this.shadow=document.createElement("DIV");this.shadow.className="shadow";this.shadow.innerHTML="&nbsp;";YAHOO.util.Dom.setStyle(this.shadow,"opacity",".5");this.container.appendChild(this.shadow);}
this.sizeShadow();this.shadow.style.display="block";if(this.matte){this.matte.style.display="none";}
break;case"matte":this.element.style.position="absolute";if(!this.matte){this.matte=document.createElement("DIV");this.matte.className="matte";this.matte.innerHTML="&nbsp;";this.container.appendChild(this.matte);}
this.sizeMatte();this.matte.style.display="block";if(this.shadow){this.shadow.style.display="none";}
break;case"none":default:this.element.style.position="relative";if(this.shadow){this.shadow.style.display="none";}
if(this.matte){this.matte.style.display="none";}
break;}}
YAHOO.widget.Panel.prototype.configModal=function(type,args,obj){var val=args[0];if(val){this.buildMask();this.showEvent.subscribe(this.showMask,this,true);this.hideEvent.subscribe(this.hideMask,this,true);}else{this.showEvent.unsubscribe(this.showMask,this);this.hideEvent.unsubscribe(this.hideMask,this);}}
YAHOO.widget.Panel.prototype.configFixedCenter=function(type,args,obj){var val=args[0];if(val){var elementWidth=this.element.offsetWidth;var elementHeight=this.element.offsetHeight;this.container.style.left="50%";this.container.style.marginLeft="-"+(elementWidth/2)+"px";this.container.style.top="50%";this.container.style.marginTop="-"+(elementHeight/2)+"px";}else{this.syncPosition();}}
YAHOO.widget.Panel.prototype.syncPosition=function(){var pos=YAHOO.util.Dom.getXY(this.container);this.cfg.setProperty("xy",pos);}
YAHOO.widget.Panel.prototype.buildContainer=function(){var elementParent=this.element.parentNode;this.container=document.createElement("DIV");this.container.className="panel-container";this.container.id=this.element.id+"_c";elementParent.insertBefore(this.container,this.element);this.container.appendChild(this.element);}
YAHOO.widget.Panel.prototype.sizeShadow=function(){if(this.shadow){this.shadow.style.width=this.element.offsetWidth+"px";this.shadow.style.height=this.element.offsetHeight+"px";}}
YAHOO.widget.Panel.prototype.sizeMatte=function(){if(this.matte){this.matte.style.width=this.element.offsetWidth+6+"px";this.matte.style.height=this.element.offsetHeight+6+"px";}}
YAHOO.widget.Panel.prototype.center=function(){var scrollX=window.scrollX||document.body.scrollLeft;var scrollY=window.scrollY||document.body.scrollTop;var viewPortWidth=YAHOO.util.Dom.getClientWidth();var viewPortHeight=YAHOO.util.Dom.getClientHeight();var elementWidth=this.element.offsetWidth;var elementHeight=this.element.offsetHeight;var x=(viewPortWidth/2)-(elementWidth/2)+scrollX;var y=(viewPortHeight/2)-(elementHeight/2)+scrollY;this.cfg.setProperty("xy",[x,y]);}
YAHOO.widget.Panel.prototype.registerDragDrop=function(){if(this.header){this.dd=new YAHOO.util.DD(this.container.id,"panel");if(!this.header.id){this.header.id=this.id+"_h";}
this.dd.setHandleElId(this.header.id);this.dd.addInvalidHandleType("INPUT");this.dd.addInvalidHandleType("SELECT");this.dd.addInvalidHandleType("TEXTAREA");}}
YAHOO.widget.Panel.prototype.buildMask=function(){if(!this.mask){this.mask=document.createElement("DIV");this.mask.className="mask";this.mask.innerHTML="&nbsp;";var maskClick=function(e,obj){YAHOO.util.Event.stopEvent(e);}
YAHOO.util.Event.addListener(this.mask,maskClick,this);if(this.browser=="opera"){this.mask.style.backgroundColor="transparent";}
document.body.appendChild(this.mask);}}
YAHOO.widget.Panel.prototype.hideMask=function(){this.mask.style.display="none";var bod=document.getElementsByTagName('body')[0];bod.style.height='auto';bod.style.overflow='auto';YAHOO.util.Dom.removeClass(bod,"masked");var htm=document.getElementsByTagName('html')[0];htm.style.height='auto';htm.style.overflow='auto';}
YAHOO.widget.Panel.prototype.showMask=function(){var bod=document.getElementsByTagName('body')[0];bod.style.height='100%';bod.style.overflow='hidden';var htm=document.getElementsByTagName('html')[0];htm.style.height='100%';htm.style.overflow='hidden';YAHOO.util.Dom.addClass(bod,"masked");this.mask.style.display="block";}
YAHOO.widget.Dialog=function(el,userConfig){if(arguments.length>0)
{YAHOO.widget.Dialog.superclass.constructor.call(this,el,userConfig);}}
YAHOO.widget.Dialog.prototype=new YAHOO.widget.Panel();YAHOO.widget.Dialog.prototype.constructor=YAHOO.widget.Dialog;YAHOO.widget.Dialog.superclass=YAHOO.widget.Panel.prototype;YAHOO.widget.Dialog.ICON_BLOCK="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/blck16_1.gif";YAHOO.widget.Dialog.ICON_ALARM="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/alrt16_1.gif";YAHOO.widget.Dialog.ICON_HELP="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/hlp16_1.gif";YAHOO.widget.Dialog.ICON_INFO="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/info16_1.gif";YAHOO.widget.Dialog.ICON_WARN="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/warn16_1.gif";YAHOO.widget.Dialog.ICON_TIP="http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/tip16_1.gif";YAHOO.widget.Dialog.prototype.initDefaultConfig=function(){YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);this.cfg.addProperty("icon","none",this.configIcon);this.cfg.addProperty("buttons","none",this.configButtons);}
YAHOO.widget.Dialog.prototype.initEvents=function(){YAHOO.widget.Dialog.superclass.initEvents.call(this);this.buttonClickEvent=new YAHOO.util.CustomEvent("buttonClick",this);}
YAHOO.widget.Dialog.prototype.init=function(el,userConfig){YAHOO.widget.Dialog.superclass.init.call(this,el);this.BUTTONS_OKCANCEL={"OK":{handler:this.handleOKClick,isDefault:true},"Cancel":{handler:this.handleCancelClick}};this.BUTTONS_YESNO={"Yes":{handler:this.handleYesClick,isDefault:true},"No":{handler:this.handleNoClick}};this.showEvent.subscribe(this.focusDefault,this,true);if(userConfig){this.cfg.applyConfig(userConfig,true);}
this.cfg.applyConfig({close:false,visible:false});}
YAHOO.widget.Dialog.prototype.configIcon=function(type,args,obj){var iconURL=args[0];if(iconURL&&iconURL!="none"){if(!this.icon){this.icon=document.createElement("DIV");var firstChild=this.body.firstChild;if(firstChild){this.body.insertBefore(this.icon,firstChild);}else{this.body.appendChild(this.icon);}}else{this.icon.style.display="block";}
this.icon.className="icon";this.icon.style.backgroundImage="url("+iconURL+")";this.icon.style.height=this.body.offsetHeight+"px";}else{if(this.icon){this.icon.style.display="none";}}}
YAHOO.widget.Dialog.prototype.configButtons=function(type,args,obj){var buttons=args[0];if(buttons!="none"){this.buttonSet=null;this.buttonSet=document.createElement("SPAN");this.buttonSet.className="button-group";if(buttons=="okcancel"){buttons=this.BUTTONS_OKCANCEL;}else if(buttons=="yesno"){buttons=this.BUTTONS_YESNO;}
for(var text in buttons){var button=buttons[text];var htmlButton=document.createElement("BUTTON");if(button.isDefault){htmlButton.className="default";this.defaultHtmlButton=htmlButton;}
htmlButton.appendChild(document.createTextNode(text));YAHOO.util.Event.addListener(htmlButton,"click",button.handler,this);this.buttonSet.appendChild(htmlButton);button.htmlButton=htmlButton;}
this.setFooter(this.buttonSet);}else{if(this.buttonSet){this.buttonSet.style.display="none";}}
this.cfg.refireEvent("underlay");}
YAHOO.widget.Dialog.prototype.focusDefault=function(type,args,obj){this.defaultHtmlButton.focus();}
YAHOO.widget.Dialog.prototype.handleOKClick=function(e,obj){}
YAHOO.widget.Dialog.prototype.handleCancelClick=function(e,obj){obj.hide();}
YAHOO.widget.Dialog.prototype.handleYesClick=function(e,obj){}
YAHOO.widget.Dialog.prototype.handleNoClick=function(e,obj){obj.hide();}
YAHOO.widget.FormDialog=function(el,userConfig){if(arguments.length>0)
{YAHOO.widget.FormDialog.superclass.constructor.call(this,el,userConfig);}}
YAHOO.widget.FormDialog.prototype=new YAHOO.widget.Panel();YAHOO.widget.FormDialog.prototype.constructor=YAHOO.widget.FormDialog;YAHOO.widget.FormDialog.superclass=YAHOO.widget.Panel.prototype;YAHOO.widget.FormDialog.prototype.initDefaultConfig=function(){YAHOO.widget.FormDialog.superclass.initDefaultConfig.call(this);var callback={success:null,failure:null,argument:null,scope:this}
this.configOnSuccess=function(type,args,obj){var fn=args[0];callback.success=fn;}
this.configOnFailure=function(type,args,obj){var fn=args[0];callback.failure=fn;}
this.doSubmit=function(){var method=this.cfg.getProperty("postmethod");switch(method){case"async":YAHOO.util.Connect.setForm(this.form.name);var cObj=YAHOO.util.Connect.asyncRequest('POST',this.form.action,callback);this.asyncSubmitEvent.fire();break;case"form":this.form.submit();this.formSubmitEvent.fire();break;case"none":this.manualSubmitEvent.fire();break;}}
this.cfg.addProperty("postmethod","async",null,function(val){if(val!="form"&&val!="async"&&val!="none"){return false;}else{return true;}});this.cfg.addProperty("buttons","none",this.configButtons);this.cfg.addProperty("onsuccess",null,this.configOnSuccess);this.cfg.addProperty("onfailure",null,this.configOnFailure);}
YAHOO.widget.FormDialog.prototype.initEvents=function(){YAHOO.widget.FormDialog.superclass.initEvents.call(this);this.submitEvent=new YAHOO.util.CustomEvent("submit");this.manualSubmitEvent=new YAHOO.util.CustomEvent("manualSubmit");this.asyncSubmitEvent=new YAHOO.util.CustomEvent("asyncSubmit");this.formSubmitEvent=new YAHOO.util.CustomEvent("formSubmit");this.cancelEvent=new YAHOO.util.CustomEvent("cancel");}
YAHOO.widget.FormDialog.prototype.init=function(el,userConfig){YAHOO.widget.FormDialog.superclass.init.call(this,el);this.BUTTONS_OKCANCEL={"OK":{handler:this.handleSubmitClick,isDefault:true},"Cancel":{handler:this.handleCancelClick}};this.BUTTONS_SUBMITCANCEL={"Submit":{handler:this.handleSubmitClick,isDefault:true},"Cancel":{handler:this.handleCancelClick}};var form=this.element.getElementsByTagName("FORM")[0];if(form){this.form=form;}else{this.renderEvent.subscribe(function(){var form=this.element.getElementsByTagName("FORM")[0];if(form){this.form=form;}},this,true);}
this.showEvent.subscribe(this.focusFirstField,this,true);if(userConfig){this.cfg.applyConfig(userConfig);}}
YAHOO.widget.FormDialog.prototype.configButtons=function(type,args,obj){var buttons=args[0];if(buttons!="none"){this.buttonSet=null;this.buttonSet=document.createElement("SPAN");this.buttonSet.className="button-group";if(buttons=="okcancel"){buttons=this.BUTTONS_OKCANCEL;}else if(buttons=="submitcancel"){buttons=this.BUTTONS_SUBMITCANCEL;}
for(var text in buttons){var button=buttons[text];var htmlButton=document.createElement("BUTTON");if(button.isDefault){htmlButton.className="default";this.defaultHtmlButton=htmlButton;}
htmlButton.appendChild(document.createTextNode(text));YAHOO.util.Event.addListener(htmlButton,"click",button.handler,this);this.buttonSet.appendChild(htmlButton);button.htmlButton=htmlButton;}
this.setFooter(this.buttonSet);}else{if(this.buttonSet){this.buttonSet.style.display="none";}}
this.cfg.refireEvent("underlay");}
YAHOO.widget.FormDialog.prototype.focusFirstField=function(type,args,obj){if(this.form){this.form[0].focus();}}
YAHOO.widget.FormDialog.prototype.handleSubmitClick=function(e,obj){obj.submit();}
YAHOO.widget.FormDialog.prototype.handleCancelClick=function(e,obj){obj.cancelEvent.fire();obj.hide();}
YAHOO.widget.FormDialog.prototype.validate=function(){return true;}
YAHOO.widget.FormDialog.prototype.submit=function(){if(this.validate()){this.doSubmit();this.submitEvent.fire();this.hide();return true;}else{return false;}}
YAHOO.widget.FormDialog.prototype.getData=function(){var form=this.form;var data={};if(form){for(var i in this.form){var formItem=form[i];if(formItem){if(formItem.tagName){switch(formItem.tagName){case"INPUT":switch(formItem.type){case"checkbox":data[i]=formItem.checked;break;case"textbox":case"text":data[i]=formItem.value;break;}
break;case"TEXTAREA":data[i]=formItem.value;break;case"SELECT":var val=new Array();for(var x=0;x<formItem.options.length;x++){var option=formItem.options[x];if(option.selected){var selval=option.value;if(!selval||selval==""){selval=option.text;}
val[val.length]=selval;}}
data[i]=val;break;}}else if(formItem[0]&&formItem[0].tagName){switch(formItem[0].tagName){case"INPUT":switch(formItem[0].type){case"radio":for(var r=0;r<formItem.length;r++){var radio=formItem[r];if(radio.checked){data[radio.name]=radio.value;break;}}
break;case"checkbox":var cbArray=new Array();for(var c=0;c<formItem.length;c++){var check=formItem[c];if(check.checked){cbArray[cbArray.length]=check.value;}}
data[formItem[0].name]=cbArray;break;}}}}}}
return data;}