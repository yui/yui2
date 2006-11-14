/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.txt
Version: 0.12
*/



(function(){
var _1=YAHOO.util.Dom;
var _2=YAHOO.util.Event;
YAHOO.widget.MenuManager=function(){
var _3=false;
var _4={};
var _5={};
var _6={};
var me=this;
function addItem(_8){
var _9=_1.generateId();
if(_8&&_5[_9]!=_8){
_8.element.setAttribute("yuiid",_9);
_5[_9]=_8;
_8.destroyEvent.subscribe(onItemDestroy,_8);
}
}
function removeItem(_a){
var _b=_a.element.getAttribute("yuiid");
if(_b&&_5[_b]){
delete _5[_b];
}
}
function getMenuRootElement(_c){
var _d;
if(_c&&_c.tagName){
switch(_c.tagName.toUpperCase()){
case "DIV":
_d=_c.parentNode;
if(_1.hasClass(_c,"bd")&&_d&&_d.tagName&&_d.tagName.toUpperCase()=="DIV"){
return _d;
}else{
return _c;
}
break;
case "LI":
return _c;
default:
_d=_c.parentNode;
if(_d){
return getMenuRootElement(_d);
}
break;
}
}
}
function onDOMEvent(_e){
var _f=_2.getTarget(_e);
var _10=getMenuRootElement(_f);
var _11;
var _12;
if(_10){
var _13=_10.tagName.toUpperCase();
if(_13=="LI"){
var _14=_10.getAttribute("yuiid");
if(_14){
_11=_5[_14];
_12=_11.parent;
}
}else{
if(_13=="DIV"){
if(_10.id){
_12=_4[_10.id];
}
}
}
}
if(_12){
var _15={"click":"clickEvent","mousedown":"mouseDownEvent","mouseup":"mouseUpEvent","mouseover":"mouseOverEvent","mouseout":"mouseOutEvent","keydown":"keyDownEvent","keyup":"keyUpEvent","keypress":"keyPressEvent"};
var _16=_15[_e.type];
if(_11&&!_11.cfg.getProperty("disabled")){
_11[_16].fire(_e);
}
_12[_16].fire(_e,_11);
}else{
if(_e.type=="mousedown"){
var _17;
for(var i in _4){
if(_4.hasOwnProperty(i)){
_12=_4[i];
if(_12.cfg.getProperty("clicktohide")&&_12.cfg.getProperty("position")=="dynamic"){
_12.hide();
}else{
_12.clearActiveItem(true);
}
}
}
}
}
}
function onMenuDestroy(_19,_1a,_1b){
if(_1b&&_4[_1b.id]){
delete _4[_1b.id];
}
}
function onItemDestroy(_1c,_1d,_1e){
var _1f=_1e.element.getAttribute("yuiid");
if(_1f){
delete _5[_1f];
}
}
function onMenuVisibleConfigChange(_20,_21,_22){
var _23=_21[0];
if(_23){
_6[_22.id]=_22;
}else{
if(_6[_22.id]){
delete _6[_22.id];
}
}
}
function onItemAdded(_24,_25){
addItem(_25[0]);
}
function onItemRemoved(_26,_27){
removeItem(_27[0]);
}
return {addMenu:function(_28){
if(_28&&_28.id&&!_4[_28.id]){
_4[_28.id]=_28;
if(!_3){
var _29=document;
_2.addListener(_29,"mouseover",onDOMEvent,me,true);
_2.addListener(_29,"mouseout",onDOMEvent,me,true);
_2.addListener(_29,"mousedown",onDOMEvent,me,true);
_2.addListener(_29,"mouseup",onDOMEvent,me,true);
_2.addListener(_29,"click",onDOMEvent,me,true);
_2.addListener(_29,"keydown",onDOMEvent,me,true);
_2.addListener(_29,"keyup",onDOMEvent,me,true);
_2.addListener(_29,"keypress",onDOMEvent,me,true);
_3=true;
}
_28.destroyEvent.subscribe(onMenuDestroy,_28,me);
_28.cfg.subscribeToConfigEvent("visible",onMenuVisibleConfigChange,_28);
_28.itemAddedEvent.subscribe(onItemAdded);
_28.itemRemovedEvent.subscribe(onItemRemoved);
}
},removeMenu:function(_2a){
if(_2a&&_4[_2a.id]){
delete _4[_2a.id];
}
},hideVisible:function(){
var _2b;
for(var i in _6){
if(_6.hasOwnProperty(i)){
_2b=_6[i];
if(_2b.cfg.getProperty("position")=="dynamic"){
_2b.hide();
}
}
}
},getMenus:function(){
return _4;
},getMenu:function(_2d){
if(_4[_2d]){
return _4[_2d];
}
},toString:function(){
return ("MenuManager");
}};
}();
})();
(function(){
var Dom=YAHOO.util.Dom;
var _2f=YAHOO.util.Event;
YAHOO.widget.Menu=function(_30,_31){
if(_31){
this.parent=_31.parent;
this.lazyLoad=_31.lazyLoad||_31.lazyload;
this.itemData=_31.itemData||_31.itemdata;
}
YAHOO.widget.Menu.superclass.constructor.call(this,_30,_31);
};
YAHOO.extend(YAHOO.widget.Menu,YAHOO.widget.Overlay,{CSS_CLASS_NAME:"yuimenu",ITEM_TYPE:null,GROUP_TITLE_TAG_NAME:"h6",_nHideDelayId:null,_nShowDelayId:null,_hideDelayEventHandlersAssigned:false,_bHandledMouseOverEvent:false,_bHandledMouseOutEvent:false,_aGroupTitleElements:null,_aItemGroups:null,_aListElements:null,lazyLoad:false,itemData:null,activeItem:null,parent:null,srcElement:null,mouseOverEvent:null,mouseOutEvent:null,mouseDownEvent:null,mouseUpEvent:null,clickEvent:null,keyPressEvent:null,keyDownEvent:null,keyUpEvent:null,itemAddedEvent:null,itemRemovedEvent:null,init:function(_32,_33){
this._aItemGroups=[];
this._aListElements=[];
this._aGroupTitleElements=[];
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.MenuItem;
}
var _34;
if(typeof _32=="string"){
_34=document.getElementById(_32);
}else{
if(_32.tagName){
_34=_32;
}
}
if(_34&&_34.tagName){
switch(_34.tagName.toUpperCase()){
case "DIV":
this.srcElement=_34;
if(!_34.id){
_34.setAttribute("id",Dom.generateId());
}
YAHOO.widget.Menu.superclass.init.call(this,_34);
this.beforeInitEvent.fire(YAHOO.widget.Menu);
break;
case "SELECT":
this.srcElement=_34;
YAHOO.widget.Menu.superclass.init.call(this,Dom.generateId());
this.beforeInitEvent.fire(YAHOO.widget.Menu);
break;
}
}else{
YAHOO.widget.Menu.superclass.init.call(this,_32);
this.beforeInitEvent.fire(YAHOO.widget.Menu);
}
if(this.element){
var oEl=this.element;
Dom.addClass(oEl,this.CSS_CLASS_NAME);
this.initEvent.subscribe(this._onInit,this,true);
this.beforeRenderEvent.subscribe(this._onBeforeRender,this,true);
this.renderEvent.subscribe(this._onRender,this,true);
this.beforeShowEvent.subscribe(this._onBeforeShow,this,true);
this.showEvent.subscribe(this._onShow,this,true);
this.beforeHideEvent.subscribe(this._onBeforeHide,this,true);
this.mouseOverEvent.subscribe(this._onMouseOver,this,true);
this.mouseOutEvent.subscribe(this._onMouseOut,this,true);
this.clickEvent.subscribe(this._onClick,this,true);
this.keyDownEvent.subscribe(this._onKeyDown,this,true);
if(_33){
this.cfg.applyConfig(_33,true);
}
YAHOO.widget.MenuManager.addMenu(this);
this.initEvent.fire(YAHOO.widget.Menu);
}
},_initSubTree:function(){
var _36;
if(this.srcElement.tagName=="DIV"){
_36=this.body.firstChild;
var _37=0;
var _38=this.GROUP_TITLE_TAG_NAME.toUpperCase();
do{
if(_36&&_36.tagName){
switch(_36.tagName.toUpperCase()){
case _38:
this._aGroupTitleElements[_37]=_36;
break;
case "UL":
this._aListElements[_37]=_36;
this._aItemGroups[_37]=[];
_37++;
break;
}
}
}while((_36=_36.nextSibling));
if(this._aListElements[0]){
Dom.addClass(this._aListElements[0],"first-of-type");
}
}
_36=null;
if(this.srcElement.tagName){
switch(this.srcElement.tagName.toUpperCase()){
case "DIV":
if(this._aListElements.length>0){
var i=this._aListElements.length-1;
do{
_36=this._aListElements[i].firstChild;
do{
if(_36&&_36.tagName){
switch(_36.tagName.toUpperCase()){
case "LI":
this.addItem(new this.ITEM_TYPE(_36,{parent:this}),i);
break;
}
}
}while((_36=_36.nextSibling));
}while(i--);
}
break;
case "SELECT":
_36=this.srcElement.firstChild;
do{
if(_36&&_36.tagName){
switch(_36.tagName.toUpperCase()){
case "OPTGROUP":
case "OPTION":
this.addItem(new this.ITEM_TYPE(_36,{parent:this}));
break;
}
}
}while((_36=_36.nextSibling));
break;
}
}
},_getFirstEnabledItem:function(){
var _3a=this._aItemGroups.length;
var _3b;
var _3c;
for(var i=0;i<_3a;i++){
_3c=this._aItemGroups[i];
if(_3c){
var _3e=_3c.length;
for(var n=0;n<_3e;n++){
_3b=_3c[n];
if(!_3b.cfg.getProperty("disabled")&&_3b.element.style.display!="none"){
return _3b;
}
_3b=null;
}
}
}
},_checkPosition:function(_40){
if(typeof _40=="string"){
var _41=_40.toLowerCase();
return ("dynamic,static".indexOf(_41)!=-1);
}
},_addItemToGroup:function(_42,_43,_44){
var _45;
if(_43 instanceof this.ITEM_TYPE){
_45=_43;
_45.parent=this;
}else{
if(typeof _43=="string"){
_45=new this.ITEM_TYPE(_43,{parent:this});
}else{
if(typeof _43=="object"&&_43.text){
var _46=_43.text;
delete _43["text"];
_43.parent=this;
_45=new this.ITEM_TYPE(_46,_43);
}
}
}
if(_45){
var _47=typeof _42=="number"?_42:0;
var _48=this._getItemGroup(_47);
var _49;
if(!_48){
_48=this._createItemGroup(_47);
}
if(typeof _44=="number"){
var _4a=(_44>=_48.length);
if(_48[_44]){
_48.splice(_44,0,_45);
}else{
_48[_44]=_45;
}
_49=_48[_44];
if(_49){
if(_4a&&(!_49.element.parentNode||_49.element.parentNode.nodeType==11)){
this._aListElements[_47].appendChild(_49.element);
}else{
var _4b=function(_4c,_4d){
return (_4c[_4d]||_4b(_4c,(_4d+1)));
};
var _4e=_4b(_48,(_44+1));
if(_4e&&(!_49.element.parentNode||_49.element.parentNode.nodeType==11)){
this._aListElements[_47].insertBefore(_49.element,_4e.element);
}
}
_49.parent=this;
this._subscribeToItemEvents(_49);
this._configureSubmenu(_49);
this._updateItemProperties(_47);
this.itemAddedEvent.fire(_49);
return _49;
}
}else{
var _4f=_48.length;
_48[_4f]=_45;
_49=_48[_4f];
if(_49){
if(!Dom.isAncestor(this._aListElements[_47],_49.element)){
this._aListElements[_47].appendChild(_49.element);
}
_49.element.setAttribute("groupindex",_47);
_49.element.setAttribute("index",_4f);
_49.parent=this;
_49.index=_4f;
_49.groupIndex=_47;
this._subscribeToItemEvents(_49);
this._configureSubmenu(_49);
if(_4f===0){
Dom.addClass(_49.element,"first-of-type");
}
this.itemAddedEvent.fire(_49);
return _49;
}
}
}
},_removeItemFromGroupByIndex:function(_50,_51){
var _52=typeof _50=="number"?_50:0;
var _53=this._getItemGroup(_52);
if(_53){
var _54=_53.splice(_51,1);
var _55=_54[0];
if(_55){
this._updateItemProperties(_52);
if(_53.length===0){
var oUL=this._aListElements[_52];
if(this.body&&oUL){
this.body.removeChild(oUL);
}
this._aItemGroups.splice(_52,1);
this._aListElements.splice(_52,1);
oUL=this._aListElements[0];
if(oUL){
Dom.addClass(oUL,"first-of-type");
}
}
this.itemRemovedEvent.fire(_55);
return _55;
}
}
},_removeItemFromGroupByValue:function(_57,_58){
var _59=this._getItemGroup(_57);
if(_59){
var _5a=_59.length;
var _5b=-1;
if(_5a>0){
var i=_5a-1;
do{
if(_59[i]==_58){
_5b=i;
break;
}
}while(i--);
if(_5b>-1){
return this._removeItemFromGroupByIndex(_57,_5b);
}
}
}
},_updateItemProperties:function(_5d){
var _5e=this._getItemGroup(_5d);
var _5f=_5e.length;
if(_5f>0){
var i=_5f-1;
var _61;
var oLI;
do{
_61=_5e[i];
if(_61){
oLI=_61.element;
_61.index=i;
_61.groupIndex=_5d;
oLI.setAttribute("groupindex",_5d);
oLI.setAttribute("index",i);
Dom.removeClass(oLI,"first-of-type");
}
}while(i--);
if(oLI){
Dom.addClass(oLI,"first-of-type");
}
}
},_createItemGroup:function(_63){
if(!this._aItemGroups[_63]){
this._aItemGroups[_63]=[];
var oUL=document.createElement("ul");
this._aListElements[_63]=oUL;
return this._aItemGroups[_63];
}
},_getItemGroup:function(_65){
var _66=((typeof _65=="number")?_65:0);
return this._aItemGroups[_66];
},_configureSubmenu:function(_67){
var _68=_67.cfg.getProperty("submenu");
if(_68){
this.cfg.configChangedEvent.subscribe(this._onParentMenuConfigChange,_68,true);
this.renderEvent.subscribe(this._onParentMenuRender,_68,true);
_68.beforeShowEvent.subscribe(this._onSubmenuBeforeShow,_68,true);
_68.showEvent.subscribe(this._onSubmenuShow,_68,true);
_68.hideEvent.subscribe(this._onSubmenuHide,_68,true);
}
},_subscribeToItemEvents:function(_69){
_69.focusEvent.subscribe(this._onMenuItemFocus,_69,this);
_69.blurEvent.subscribe(this._onMenuItemBlur,this,true);
_69.cfg.configChangedEvent.subscribe(this._onMenuItemConfigChange,_69,this);
},_getOffsetWidth:function(){
var _6a=this.element.cloneNode(true);
Dom.setStyle(_6a,"width","");
document.body.appendChild(_6a);
var _6b=_6a.offsetWidth;
document.body.removeChild(_6a);
return _6b;
},_cancelHideDelay:function(){
var _6c=this.getRoot();
if(_6c._nHideDelayId){
window.clearTimeout(_6c._nHideDelayId);
}
},_execHideDelay:function(){
this._cancelHideDelay();
var _6d=this.getRoot();
var me=this;
var _6f=function(){
if(_6d.activeItem){
_6d.clearActiveItem();
}
if(_6d==me&&me.cfg.getProperty("position")=="dynamic"){
me.hide();
}
};
_6d._nHideDelayId=window.setTimeout(_6f,_6d.cfg.getProperty("hidedelay"));
},_cancelShowDelay:function(){
var _70=this.getRoot();
if(_70._nShowDelayId){
window.clearTimeout(_70._nShowDelayId);
}
},_execShowDelay:function(_71){
this._cancelShowDelay();
var _72=this.getRoot();
var _73=function(){
_71.show();
};
_72._nShowDelayId=window.setTimeout(_73,_72.cfg.getProperty("showdelay"));
},_onMouseOver:function(_74,_75,_76){
var _77=_75[0];
var _78=_75[1];
var _79=_2f.getTarget(_77);
if(!this._bHandledMouseOverEvent&&(_79==this.element||Dom.isAncestor(this.element,_79))){
this.clearActiveItem();
this._bHandledMouseOverEvent=true;
this._bHandledMouseOutEvent=false;
}
if(_78&&!_78.handledMouseOverEvent&&(_79==_78.element||Dom.isAncestor(_78.element,_79))){
var _7a=_78.cfg;
_7a.setProperty("selected",true);
_78.focus();
if(this.cfg.getProperty("autosubmenudisplay")){
var _7b=_7a.getProperty("submenu");
if(_7b){
if(this.cfg.getProperty("showdelay")>0){
this._execShowDelay(_7b);
}else{
_7b.show();
}
}
}
_78.handledMouseOverEvent=true;
_78.handledMouseOutEvent=false;
}
},_onMouseOut:function(_7c,_7d,_7e){
var _7f=_7d[0];
var _80=_7d[1];
var _81=_2f.getRelatedTarget(_7f);
var _82=false;
if(_80){
var _83=_80.cfg;
var _84=_83.getProperty("submenu");
if(_84&&(_81==_84.element||Dom.isAncestor(_84.element,_81))){
_82=true;
}
if(!_80.handledMouseOutEvent&&((_81!=_80.element&&!Dom.isAncestor(_80.element,_81))||_82)){
if(this.cfg.getProperty("showdelay")>0){
this._cancelShowDelay();
}
if(!_82){
_83.setProperty("selected",false);
}
if(this.cfg.getProperty("autosubmenudisplay")){
if(_84){
if(!(_81==_84.element||YAHOO.util.Dom.isAncestor(_84.element,_81))){
_84.hide();
}
}
}
_80.handledMouseOutEvent=true;
_80.handledMouseOverEvent=false;
}
}
if(!this._bHandledMouseOutEvent&&((_81!=this.element&&!Dom.isAncestor(this.element,_81))||_82)){
this._bHandledMouseOutEvent=true;
this._bHandledMouseOverEvent=false;
}
},_onClick:function(_85,_86,_87){
var _88=_86[0];
var _89=_86[1];
var _8a=_2f.getTarget(_88);
if(_89){
var _8b=_89.cfg;
var _8c=_8b.getProperty("submenu");
if(_8a==_89.submenuIndicator&&_8c){
if(_8c.cfg.getProperty("visible")){
_8c.hide();
}else{
this.clearActiveItem();
this.activeItem=_89;
_89.cfg.setProperty("selected",true);
_8c.show();
}
}else{
var _8d=_8b.getProperty("url");
var _8e=(_8d.substr((_8d.length-1),1)=="#");
var _8f=_8b.getProperty("target");
var _90=(_8f&&_8f.length>0);
if(_8a.tagName.toUpperCase()=="A"&&_8e&&!_90){
_2f.preventDefault(_88);
}
if(_8a.tagName.toUpperCase()!="A"&&!_8e&&!_90){
document.location=_8d;
}
if(_8e&&!_8c){
var _91=this.getRoot();
if(_91.cfg.getProperty("position")=="static"){
_91.clearActiveItem();
}else{
_91.hide();
}
}
}
}
},_onKeyDown:function(_92,_93,_94){
var _95=_93[0];
var _96=_93[1];
var _97;
if(_96){
var _98=_96.cfg;
var _99=this.parent;
var _9a;
var _9b;
switch(_95.keyCode){
case 38:
case 40:
if(_96==this.activeItem&&!_98.getProperty("selected")){
_98.setProperty("selected",true);
}else{
_9b=(_95.keyCode==38)?_96.getPreviousEnabledSibling():_96.getNextEnabledSibling();
if(_9b){
this.clearActiveItem();
_9b.cfg.setProperty("selected",true);
_9b.focus();
}
}
_2f.preventDefault(_95);
break;
case 39:
_97=_98.getProperty("submenu");
if(_97){
if(!_98.getProperty("selected")){
_98.setProperty("selected",true);
}
_97.show();
_97.setInitialSelection();
}else{
_9a=this.getRoot();
if(_9a instanceof YAHOO.widget.MenuBar){
_9b=_9a.activeItem.getNextEnabledSibling();
if(_9b){
_9a.clearActiveItem();
_9b.cfg.setProperty("selected",true);
_97=_9b.cfg.getProperty("submenu");
if(_97){
_97.show();
}
_9b.focus();
}
}
}
_2f.preventDefault(_95);
break;
case 37:
if(_99){
var _9c=_99.parent;
if(_9c instanceof YAHOO.widget.MenuBar){
_9b=_9c.activeItem.getPreviousEnabledSibling();
if(_9b){
_9c.clearActiveItem();
_9b.cfg.setProperty("selected",true);
_97=_9b.cfg.getProperty("submenu");
if(_97){
_97.show();
}
_9b.focus();
}
}else{
this.hide();
_99.focus();
}
}
_2f.preventDefault(_95);
break;
}
}
if(_95.keyCode==27){
if(this.cfg.getProperty("position")=="dynamic"){
this.hide();
if(this.parent){
this.parent.focus();
}
}else{
if(this.activeItem){
_97=this.activeItem.cfg.getProperty("submenu");
if(_97&&_97.cfg.getProperty("visible")){
_97.hide();
this.activeItem.focus();
}else{
this.activeItem.cfg.setProperty("selected",false);
this.activeItem.blur();
}
}
}
_2f.preventDefault(_95);
}
},_onInit:function(_9d,_9e,_9f){
if(((this.parent&&!this.lazyLoad)||(!this.parent&&this.cfg.getProperty("position")=="static")||(!this.parent&&!this.lazyLoad&&this.cfg.getProperty("position")=="dynamic"))&&this.getItemGroups().length===0){
if(this.srcElement){
this._initSubTree();
}
if(this.itemData){
this.addItems(this.itemData);
}
}else{
if(this.lazyLoad){
this.cfg.fireQueue();
}
}
},_onBeforeRender:function(_a0,_a1,_a2){
var _a3=this.cfg;
var oEl=this.element;
var _a5=this._aListElements.length;
if(_a5>0){
var i=0;
var _a7=true;
var oUL;
var _a9;
do{
oUL=this._aListElements[i];
if(oUL){
if(_a7){
Dom.addClass(oUL,"first-of-type");
_a7=false;
}
if(!Dom.isAncestor(oEl,oUL)){
this.appendToBody(oUL);
}
_a9=this._aGroupTitleElements[i];
if(_a9){
if(!Dom.isAncestor(oEl,_a9)){
oUL.parentNode.insertBefore(_a9,oUL);
}
Dom.addClass(oUL,"hastitle");
}
}
i++;
}while(i<_a5);
}
},_onRender:function(_aa,_ab,_ac){
if(this.cfg.getProperty("position")=="dynamic"){
var _ad=this.element.parentNode.tagName.toUpperCase()=="BODY"?this.element.offsetWidth:this._getOffsetWidth();
this.cfg.setProperty("width",(_ad+"px"));
}
},_onBeforeShow:function(_ae,_af,_b0){
if(this.lazyLoad&&this.getItemGroups().length===0){
if(this.srcElement){
this._initSubTree();
}
if(this.itemData){
if(this.parent&&this.parent.parent&&this.parent.parent.srcElement&&this.parent.parent.srcElement.tagName.toUpperCase()=="SELECT"){
var _b1=this.itemData.length;
for(var n=0;n<_b1;n++){
if(this.itemData[n].tagName){
this.addItem((new this.ITEM_TYPE(this.itemData[n])));
}
}
}else{
this.addItems(this.itemData);
}
}
if(this.srcElement){
this.render();
}else{
if(this.parent){
this.render(this.parent.element);
}else{
this.render(this.cfg.getProperty("container"));
}
}
}
},_onShow:function(_b3,_b4,_b5){
this.setInitialFocus();
var _b6=this.parent;
if(_b6){
var _b7=_b6.parent;
var _b8=_b7.cfg.getProperty("submenualignment");
var _b9=this.cfg.getProperty("submenualignment");
if((_b8[0]!=_b9[0])&&(_b8[1]!=_b9[1])){
this.cfg.setProperty("submenualignment",[_b8[0],_b8[1]]);
}
if(!_b7.cfg.getProperty("autosubmenudisplay")&&_b7.cfg.getProperty("position")=="static"){
_b7.cfg.setProperty("autosubmenudisplay",true);
var _ba=function(_bb){
if(_bb.type=="mousedown"||(_bb.type=="keydown"&&_bb.keyCode==27)){
var _bc=_2f.getTarget(_bb);
if(_bc!=_b7.element||!YAHOO.util.Dom.isAncestor(_b7.element,_bc)){
_b7.cfg.setProperty("autosubmenudisplay",false);
_2f.removeListener(document,"mousedown",_ba);
_2f.removeListener(document,"keydown",_ba);
}
}
};
_2f.addListener(document,"mousedown",_ba);
_2f.addListener(document,"keydown",_ba);
}
}
},_onBeforeHide:function(_bd,_be,_bf){
this.clearActiveItem(true);
},_onParentMenuConfigChange:function(_c0,_c1,_c2){
var _c3=_c1[0][0];
var _c4=_c1[0][1];
switch(_c3){
case "iframe":
case "constraintoviewport":
case "hidedelay":
case "showdelay":
case "clicktohide":
case "effect":
_c2.cfg.setProperty(_c3,_c4);
break;
}
},_onParentMenuRender:function(_c5,_c6,_c7){
var _c8=_c7.parent.parent;
var _c9={constraintoviewport:_c8.cfg.getProperty("constraintoviewport"),xy:[0,0],clicktohide:_c8.cfg.getProperty("clicktohide"),effect:_c8.cfg.getProperty("effect")};
var _ca=_c8.cfg.getProperty("showdelay");
if(_ca>0){
_c9.showdelay=_ca;
}
var _cb=_c8.cfg.getProperty("hidedelay");
if(_cb>0){
_c9.hidedelay=_cb;
}
if(this.cfg.getProperty("position")==_c8.cfg.getProperty("position")){
_c9.iframe=_c8.cfg.getProperty("iframe");
}
_c7.cfg.applyConfig(_c9);
if(!this.lazyLoad){
if(Dom.inDocument(this.element)){
this.render();
}else{
this.render(this.parent.element);
}
}
},_onSubmenuBeforeShow:function(_cc,_cd,_ce){
var _cf=this.parent;
var _d0=_cf.parent.cfg.getProperty("submenualignment");
this.cfg.setProperty("context",[_cf.element,_d0[0],_d0[1]]);
_cf.submenuIndicator.alt=_cf.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
},_onSubmenuShow:function(_d1,_d2,_d3){
var _d4=this.parent;
_d4.submenuIndicator.alt=_d4.EXPANDED_SUBMENU_INDICATOR_ALT_TEXT;
},_onSubmenuHide:function(_d5,_d6,_d7){
var _d8=this.parent;
_d8.submenuIndicator.alt=_d8.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
},_onMenuItemFocus:function(_d9,_da,_db){
this.activeItem=_db;
},_onMenuItemBlur:function(_dc,_dd){
this.activeItem=null;
},_onMenuItemConfigChange:function(_de,_df,_e0){
var _e1=_df[0][0];
switch(_e1){
case "submenu":
var _e2=_df[0][1];
if(_e2){
this._configureSubmenu(_e0);
}
break;
case "text":
case "helptext":
if(this.element.style.width){
var _e3=this._getOffsetWidth()+"px";
Dom.setStyle(this.element,"width",_e3);
}
break;
}
},enforceConstraints:function(_e4,_e5,obj){
var _e7=this.cfg;
var pos=_e5[0];
var x=pos[0];
var y=pos[1];
var bod=document.getElementsByTagName("body")[0];
var htm=document.getElementsByTagName("html")[0];
var _ed=Dom.getStyle(bod,"overflow");
var _ee=Dom.getStyle(htm,"overflow");
var _ef=this.element.offsetHeight;
var _f0=this.element.offsetWidth;
var _f1=Dom.getClientWidth();
var _f2=Dom.getClientHeight();
var _f3=window.scrollX||document.body.scrollLeft;
var _f4=window.scrollY||document.body.scrollTop;
var _f5=_f4+10;
var _f6=_f3+10;
var _f7=_f4+_f2-_ef-10;
var _f8=_f3+_f1-_f0-10;
var _f9=_e7.getProperty("context");
var _fa=_f9?_f9[0]:null;
if(x<10){
x=_f6;
}else{
if((x+_f0)>_f1){
if(_fa&&((x-_fa.offsetWidth)>_f0)){
x=(x-(_fa.offsetWidth+_f0));
}else{
x=_f8;
}
}
}
if(y<10){
y=_f5;
}else{
if(y>_f7){
if(_fa&&(y>_ef)){
y=((y+_fa.offsetHeight)-_ef);
}else{
y=_f7;
}
}
}
_e7.setProperty("x",x,true);
_e7.setProperty("y",y,true);
},configVisible:function(_fb,_fc,_fd){
if(this.cfg.getProperty("position")=="dynamic"){
YAHOO.widget.Menu.superclass.configVisible.call(this,_fb,_fc,_fd);
}else{
var _fe=_fc[0];
var _ff=Dom.getStyle(this.element,"display");
if(_fe){
if(_ff!="block"){
this.beforeShowEvent.fire();
Dom.setStyle(this.element,"display","block");
this.showEvent.fire();
}
}else{
if(_ff=="block"){
this.beforeHideEvent.fire();
Dom.setStyle(this.element,"display","none");
this.hideEvent.fire();
}
}
}
},configPosition:function(_100,_101,_102){
var _103=_101[0]=="static"?"static":"absolute";
var oCfg=this.cfg;
Dom.setStyle(this.element,"position",_103);
if(_103=="static"){
oCfg.setProperty("iframe",false);
Dom.setStyle(this.element,"display","block");
oCfg.setProperty("visible",true);
}else{
Dom.setStyle(this.element,"visibility","hidden");
}
if(_103=="absolute"){
var _105=oCfg.getProperty("zindex");
if(!_105||_105===0){
_105=this.parent?(this.parent.parent.cfg.getProperty("zindex")+1):1;
oCfg.setProperty("zindex",_105);
}
}
},configIframe:function(_106,_107,_108){
if(this.cfg.getProperty("position")=="dynamic"){
YAHOO.widget.Menu.superclass.configIframe.call(this,_106,_107,_108);
}
},configHideDelay:function(_109,_10a,_10b){
var _10c=_10a[0];
var _10d=this.mouseOutEvent;
var _10e=this.mouseOverEvent;
var _10f=this.keyDownEvent;
if(_10c>0){
if(!this._hideDelayEventHandlersAssigned){
_10d.subscribe(this._execHideDelay,true);
_10e.subscribe(this._cancelHideDelay,this,true);
_10f.subscribe(this._cancelHideDelay,this,true);
this._hideDelayEventHandlersAssigned=true;
}
}else{
_10d.unsubscribe(this._execHideDelay,this);
_10e.unsubscribe(this._cancelHideDelay,this);
_10f.unsubscribe(this._cancelHideDelay,this);
this._hideDelayEventHandlersAssigned=false;
}
},configContainer:function(_110,_111,_112){
var _113=_111[0];
if(typeof _113=="string"){
this.cfg.setProperty("container",document.getElementById(_113),true);
}
},onDomResize:function(e,obj){
if(!this._handleResize){
this._handleResize=true;
return;
}
var _116=this.cfg;
if(_116.getProperty("position")=="dynamic"){
_116.setProperty("width",(this._getOffsetWidth()+"px"));
}
YAHOO.widget.Menu.superclass.onDomResize.call(this,e,obj);
},initEvents:function(){
YAHOO.widget.Menu.superclass.initEvents.call(this);
var _117=YAHOO.util.CustomEvent;
this.mouseOverEvent=new _117("mouseOverEvent",this);
this.mouseOutEvent=new _117("mouseOutEvent",this);
this.mouseDownEvent=new _117("mouseDownEvent",this);
this.mouseUpEvent=new _117("mouseUpEvent",this);
this.clickEvent=new _117("clickEvent",this);
this.keyPressEvent=new _117("keyPressEvent",this);
this.keyDownEvent=new _117("keyDownEvent",this);
this.keyUpEvent=new _117("keyUpEvent",this);
this.itemAddedEvent=new _117("itemAddedEvent",this);
this.itemRemovedEvent=new _117("itemRemovedEvent",this);
},getRoot:function(){
var _118=this.parent;
if(_118){
var _119=_118.parent;
return _119?_119.getRoot():this;
}else{
return this;
}
},toString:function(){
return ("Menu "+this.id);
},setItemGroupTitle:function(_11a,_11b){
if(typeof _11a=="string"&&_11a.length>0){
var _11c=typeof _11b=="number"?_11b:0;
var _11d=this._aGroupTitleElements[_11c];
if(_11d){
_11d.innerHTML=_11a;
}else{
_11d=document.createElement(this.GROUP_TITLE_TAG_NAME);
_11d.innerHTML=_11a;
this._aGroupTitleElements[_11c]=_11d;
}
var i=this._aGroupTitleElements.length-1;
var _11f;
do{
if(this._aGroupTitleElements[i]){
Dom.removeClass(this._aGroupTitleElements[i],"first-of-type");
_11f=i;
}
}while(i--);
if(_11f!==null){
Dom.addClass(this._aGroupTitleElements[_11f],"first-of-type");
}
}
},addItem:function(_120,_121){
if(_120){
return this._addItemToGroup(_121,_120);
}
},addItems:function(_122,_123){
function isArray(_124){
return (typeof _124=="object"&&_124.constructor==Array);
}
if(isArray(_122)){
var _125=_122.length;
var _126=[];
var _127;
for(var i=0;i<_125;i++){
_127=_122[i];
if(isArray(_127)){
_126[_126.length]=this.addItems(_127,i);
}else{
_126[_126.length]=this._addItemToGroup(_123,_127);
}
}
if(_126.length){
return _126;
}
}
},insertItem:function(_129,_12a,_12b){
if(_129){
return this._addItemToGroup(_12b,_129,_12a);
}
},removeItem:function(_12c,_12d){
if(typeof _12c!="undefined"){
var _12e;
if(_12c instanceof YAHOO.widget.MenuItem){
_12e=this._removeItemFromGroupByValue(_12d,_12c);
}else{
if(typeof _12c=="number"){
_12e=this._removeItemFromGroupByIndex(_12d,_12c);
}
}
if(_12e){
_12e.destroy();
return _12e;
}
}
},getItemGroups:function(){
return this._aItemGroups;
},getItem:function(_12f,_130){
if(typeof _12f=="number"){
var _131=this._getItemGroup(_130);
if(_131){
return _131[_12f];
}
}
},destroy:function(){
this.mouseOverEvent.unsubscribeAll();
this.mouseOutEvent.unsubscribeAll();
this.mouseDownEvent.unsubscribeAll();
this.mouseUpEvent.unsubscribeAll();
this.clickEvent.unsubscribeAll();
this.keyPressEvent.unsubscribeAll();
this.keyDownEvent.unsubscribeAll();
this.keyUpEvent.unsubscribeAll();
var _132=this._aItemGroups.length;
var _133;
var _134;
var _135;
var i;
var n;
if(_132>0){
i=_132-1;
do{
_134=this._aItemGroups[i];
if(_134){
_133=_134.length;
if(_133>0){
n=_133-1;
do{
_135=this._aItemGroups[i][n];
if(_135){
_135.destroy();
}
}while(n--);
}
}
}while(i--);
}
YAHOO.widget.Menu.superclass.destroy.call(this);
},setInitialFocus:function(){
var _138=this._getFirstEnabledItem();
if(_138){
_138.focus();
}
},setInitialSelection:function(){
var _139=this._getFirstEnabledItem();
if(_139){
_139.cfg.setProperty("selected",true);
}
},clearActiveItem:function(_13a){
if(this.cfg.getProperty("showdelay")>0){
this._cancelShowDelay();
}
var _13b=this.activeItem;
if(_13b){
var _13c=_13b.cfg;
_13c.setProperty("selected",false);
var _13d=_13c.getProperty("submenu");
if(_13d){
_13d.hide();
}
if(_13a){
_13b.blur();
}
}
},initDefaultConfig:function(){
YAHOO.widget.Menu.superclass.initDefaultConfig.call(this);
var _13e=this.cfg;
_13e.addProperty("visible",{value:false,handler:this.configVisible,validator:this.cfg.checkBoolean});
_13e.addProperty("constraintoviewport",{value:true,handler:this.configConstrainToViewport,validator:this.cfg.checkBoolean,supercedes:["iframe","x","y","xy"]});
_13e.addProperty("position",{value:"dynamic",handler:this.configPosition,validator:this._checkPosition,supercedes:["visible"]});
_13e.addProperty("submenualignment",{value:["tl","tr"]});
_13e.addProperty("autosubmenudisplay",{value:true,validator:_13e.checkBoolean});
_13e.addProperty("showdelay",{value:0,validator:_13e.checkNumber});
_13e.addProperty("hidedelay",{value:0,validator:_13e.checkNumber,handler:this.configHideDelay,suppressEvent:true});
_13e.addProperty("clicktohide",{value:true,validator:_13e.checkBoolean});
this.cfg.addProperty("container",{value:document.body,handler:this.configContainer});
}});
})();
YAHOO.widget.MenuModule=YAHOO.widget.Menu;
(function(){
var Dom=YAHOO.util.Dom;
var _140=YAHOO.widget.Module;
var Menu=YAHOO.widget.Menu;
YAHOO.widget.MenuItem=function(_142,_143){
if(_142){
if(_143){
this.parent=_143.parent;
this.value=_143.value;
}
this.init(_142,_143);
}
};
YAHOO.widget.MenuItem.prototype={SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_nrm_1.gif",SELECTED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_hov_1.gif",DISABLED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarorght8_dim_1.gif",COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT:"Collapsed.  Click to expand.",EXPANDED_SUBMENU_INDICATOR_ALT_TEXT:"Expanded.  Click to collapse.",DISABLED_SUBMENU_INDICATOR_ALT_TEXT:"Disabled.",CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_nrm_1.gif",SELECTED_CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_hov_1.gif",DISABLED_CHECKED_IMAGE_PATH:"nt/ic/ut/bsc/menuchk8_dim_1.gif",CHECKED_IMAGE_ALT_TEXT:"Checked.",DISABLED_CHECKED_IMAGE_ALT_TEXT:"Checked. (Item disabled.)",CSS_CLASS_NAME:"yuimenuitem",SUBMENU_TYPE:null,IMG_ROOT:"http://us.i1.yimg.com/us.yimg.com/i/",IMG_ROOT_SSL:"https://a248.e.akamai.net/sec.yimg.com/i/",_oAnchor:null,_oText:null,_oHelpTextEM:null,_oSubmenu:null,_checkImage:null,constructor:YAHOO.widget.MenuItem,imageRoot:null,isSecure:_140.prototype.isSecure,index:null,groupIndex:null,parent:null,element:null,srcElement:null,value:null,submenuIndicator:null,browser:_140.prototype.browser,destroyEvent:null,mouseOverEvent:null,mouseOutEvent:null,mouseDownEvent:null,mouseUpEvent:null,clickEvent:null,keyPressEvent:null,keyDownEvent:null,keyUpEvent:null,focusEvent:null,blurEvent:null,init:function(_144,_145){
this.imageRoot=(this.isSecure)?this.IMG_ROOT_SSL:this.IMG_ROOT;
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=Menu;
}
this.cfg=new YAHOO.util.Config(this);
this.initDefaultConfig();
var _146=this.cfg;
if(this._checkString(_144)){
this._createRootNodeStructure();
_146.setProperty("text",_144);
}else{
if(this._checkDOMNode(_144)){
switch(_144.tagName.toUpperCase()){
case "OPTION":
this._createRootNodeStructure();
_146.setProperty("text",_144.text);
this.srcElement=_144;
break;
case "OPTGROUP":
this._createRootNodeStructure();
_146.setProperty("text",_144.label);
this.srcElement=_144;
this._initSubTree();
break;
case "LI":
var _147=this._getFirstElement(_144,"A");
var sURL="#";
var _149=null;
var _14a=null;
if(_147){
sURL=_147.getAttribute("href");
_149=_147.getAttribute("target");
if(_147.innerText){
_14a=_147.innerText;
}else{
var _14b=_147.ownerDocument.createRange();
_14b.selectNodeContents(_147);
_14a=_14b.toString();
}
}else{
var _14c=_144.firstChild;
_14a=_14c.nodeValue;
_147=document.createElement("a");
_147.setAttribute("href",sURL);
_144.replaceChild(_147,_14c);
_147.appendChild(_14c);
}
this.srcElement=_144;
this.element=_144;
this._oAnchor=_147;
var _14d=this._getFirstElement(_147);
var _14e=false;
var _14f=false;
if(_14d){
this._oText=_14d.firstChild;
switch(_14d.tagName.toUpperCase()){
case "EM":
_14e=true;
break;
case "STRONG":
_14f=true;
break;
}
}else{
this._oText=_147.firstChild;
}
_146.setProperty("text",_14a,true);
_146.setProperty("url",sURL,true);
_146.setProperty("target",_149,true);
_146.setProperty("emphasis",_14e,true);
_146.setProperty("strongemphasis",_14f,true);
this._initSubTree();
break;
}
}
}
if(this.element){
Dom.addClass(this.element,this.CSS_CLASS_NAME);
var _150=YAHOO.util.CustomEvent;
this.destroyEvent=new _150("destroyEvent",this);
this.mouseOverEvent=new _150("mouseOverEvent",this);
this.mouseOutEvent=new _150("mouseOutEvent",this);
this.mouseDownEvent=new _150("mouseDownEvent",this);
this.mouseUpEvent=new _150("mouseUpEvent",this);
this.clickEvent=new _150("clickEvent",this);
this.keyPressEvent=new _150("keyPressEvent",this);
this.keyDownEvent=new _150("keyDownEvent",this);
this.keyUpEvent=new _150("keyUpEvent",this);
this.focusEvent=new _150("focusEvent",this);
this.blurEvent=new _150("blurEvent",this);
if(_145){
_146.applyConfig(_145);
}
_146.fireQueue();
}
},_getFirstElement:function(_151,_152){
var _153;
if(_151.firstChild&&_151.firstChild.nodeType==1){
_153=_151.firstChild;
}else{
if(_151.firstChild&&_151.firstChild.nextSibling&&_151.firstChild.nextSibling.nodeType==1){
_153=_151.firstChild.nextSibling;
}
}
if(_152){
return (_153&&_153.tagName.toUpperCase()==_152)?_153:false;
}
return _153;
},_checkString:function(_154){
return (typeof _154=="string");
},_checkDOMNode:function(_155){
return (_155&&_155.tagName);
},_createRootNodeStructure:function(){
this.element=document.createElement("li");
this._oText=document.createTextNode("");
this._oAnchor=document.createElement("a");
this._oAnchor.appendChild(this._oText);
this.cfg.refireEvent("url");
this.element.appendChild(this._oAnchor);
},_initSubTree:function(){
var _156=this.srcElement;
var _157=this.cfg;
if(_156.childNodes.length>0){
if(this.parent.lazyLoad&&this.parent.srcElement&&this.parent.srcElement.tagName.toUpperCase()=="SELECT"){
_157.setProperty("submenu",{id:Dom.generateId(),itemdata:_156.childNodes});
}else{
var _158=_156.firstChild;
var _159=[];
do{
if(_158&&_158.tagName){
switch(_158.tagName.toUpperCase()){
case "DIV":
_157.setProperty("submenu",_158);
break;
case "OPTION":
_159[_159.length]=_158;
break;
}
}
}while((_158=_158.nextSibling));
var _15a=_159.length;
if(_15a>0){
var _15b=new this.SUBMENU_TYPE(Dom.generateId());
_157.setProperty("submenu",_15b);
for(var n=0;n<_15a;n++){
_15b.addItem((new _15b.ITEM_TYPE(_159[n])));
}
}
}
}
},_preloadImage:function(_15d){
var _15e=this.imageRoot+_15d;
if(!document.images[_15e]){
var _15f=document.createElement("img");
_15f.src=_15e;
_15f.name=_15e;
_15f.id=_15e;
_15f.style.display="none";
document.body.appendChild(_15f);
}
},configText:function(_160,_161,_162){
var _163=_161[0];
if(this._oText){
this._oText.nodeValue=_163;
}
},configHelpText:function(_164,_165,_166){
var me=this;
var _168=_165[0];
var oEl=this.element;
var _16a=this.cfg;
var _16b=[oEl,this._oAnchor];
var oImg=this.submenuIndicator;
var _16d=function(){
Dom.addClass(_16b,"hashelptext");
if(_16a.getProperty("disabled")){
_16a.refireEvent("disabled");
}
if(_16a.getProperty("selected")){
_16a.refireEvent("selected");
}
};
var _16e=function(){
Dom.removeClass(_16b,"hashelptext");
oEl.removeChild(me._oHelpTextEM);
me._oHelpTextEM=null;
};
if(this._checkDOMNode(_168)){
if(this._oHelpTextEM){
this._oHelpTextEM.parentNode.replaceChild(_168,this._oHelpTextEM);
}else{
this._oHelpTextEM=_168;
oEl.insertBefore(this._oHelpTextEM,oImg);
}
_16d();
}else{
if(this._checkString(_168)){
if(_168.length===0){
_16e();
}else{
if(!this._oHelpTextEM){
this._oHelpTextEM=document.createElement("em");
oEl.insertBefore(this._oHelpTextEM,oImg);
}
this._oHelpTextEM.innerHTML=_168;
_16d();
}
}else{
if(!_168&&this._oHelpTextEM){
_16e();
}
}
}
},configURL:function(_16f,_170,_171){
var sURL=_170[0];
if(!sURL){
sURL="#";
}
this._oAnchor.setAttribute("href",sURL);
},configTarget:function(_173,_174,_175){
var _176=_174[0];
var _177=this._oAnchor;
if(_176&&_176.length>0){
_177.setAttribute("target",_176);
}else{
_177.removeAttribute("target");
}
},configEmphasis:function(_178,_179,_17a){
var _17b=_179[0];
var _17c=this._oAnchor;
var _17d=this._oText;
var _17e=this.cfg;
var oEM;
if(_17b&&_17e.getProperty("strongemphasis")){
_17e.setProperty("strongemphasis",false);
}
if(_17c){
if(_17b){
oEM=document.createElement("em");
oEM.appendChild(_17d);
_17c.appendChild(oEM);
}else{
oEM=this._getFirstElement(_17c,"EM");
_17c.removeChild(oEM);
_17c.appendChild(_17d);
}
}
},configStrongEmphasis:function(_180,_181,_182){
var _183=_181[0];
var _184=this._oAnchor;
var _185=this._oText;
var _186=this.cfg;
var _187;
if(_183&&_186.getProperty("emphasis")){
_186.setProperty("emphasis",false);
}
if(_184){
if(_183){
_187=document.createElement("strong");
_187.appendChild(_185);
_184.appendChild(_187);
}else{
_187=this._getFirstElement(_184,"STRONG");
_184.removeChild(_187);
_184.appendChild(_185);
}
}
},configChecked:function(_188,_189,_18a){
var _18b=_189[0];
var oEl=this.element;
var _18d=this.cfg;
var oImg;
if(_18b){
this._preloadImage(this.CHECKED_IMAGE_PATH);
this._preloadImage(this.SELECTED_CHECKED_IMAGE_PATH);
this._preloadImage(this.DISABLED_CHECKED_IMAGE_PATH);
oImg=document.createElement("img");
oImg.src=(this.imageRoot+this.CHECKED_IMAGE_PATH);
oImg.alt=this.CHECKED_IMAGE_ALT_TEXT;
var _18f=this.cfg.getProperty("submenu");
if(_18f){
oEl.insertBefore(oImg,_18f.element);
}else{
oEl.appendChild(oImg);
}
Dom.addClass([oEl,oImg],"checked");
this._checkImage=oImg;
if(_18d.getProperty("disabled")){
_18d.refireEvent("disabled");
}
if(_18d.getProperty("selected")){
_18d.refireEvent("selected");
}
}else{
oImg=this._checkImage;
Dom.removeClass([oEl,oImg],"checked");
if(oImg){
oEl.removeChild(oImg);
}
this._checkImage=null;
}
},configDisabled:function(_190,_191,_192){
var _193=_191[0];
var _194=this._oAnchor;
var _195=[this.element,_194];
var oEM=this._oHelpTextEM;
var _197=this.cfg;
var oImg;
var _199;
var _19a;
if(oEM){
_195[2]=oEM;
}
if(this.cfg.getProperty("checked")){
_19a=this.CHECKED_IMAGE_ALT_TEXT;
_199=this.CHECKED_IMAGE_PATH;
oImg=this._checkImage;
if(_193){
_19a=this.DISABLED_CHECKED_IMAGE_ALT_TEXT;
_199=this.DISABLED_CHECKED_IMAGE_PATH;
}
oImg.src=document.images[(this.imageRoot+_199)].src;
oImg.alt=_19a;
}
oImg=this.submenuIndicator;
if(_193){
if(_197.getProperty("selected")){
_197.setProperty("selected",false);
}
_194.removeAttribute("href");
Dom.addClass(_195,"disabled");
_199=this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH;
_19a=this.DISABLED_SUBMENU_INDICATOR_ALT_TEXT;
}else{
_194.setAttribute("href",_197.getProperty("url"));
Dom.removeClass(_195,"disabled");
_199=this.SUBMENU_INDICATOR_IMAGE_PATH;
_19a=this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
}
if(oImg){
oImg.src=this.imageRoot+_199;
oImg.alt=_19a;
}
},configSelected:function(_19b,_19c,_19d){
if(!this.cfg.getProperty("disabled")){
var _19e=_19c[0];
var oEM=this._oHelpTextEM;
var _1a0=[this.element,this._oAnchor];
var oImg=this.submenuIndicator;
var _1a2;
if(oEM){
_1a0[_1a0.length]=oEM;
}
if(oImg){
_1a0[_1a0.length]=oImg;
}
if(this.cfg.getProperty("checked")){
_1a2=this.imageRoot+(_19e?this.SELECTED_CHECKED_IMAGE_PATH:this.CHECKED_IMAGE_PATH);
this._checkImage.src=document.images[_1a2].src;
}
if(_19e){
Dom.addClass(_1a0,"selected");
_1a2=this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH;
}else{
Dom.removeClass(_1a0,"selected");
_1a2=this.SUBMENU_INDICATOR_IMAGE_PATH;
}
if(oImg){
oImg.src=document.images[(this.imageRoot+_1a2)].src;
}
}
},configSubmenu:function(_1a3,_1a4,_1a5){
var oEl=this.element;
var _1a7=_1a4[0];
var oImg=this.submenuIndicator;
var _1a9=this.cfg;
var _1aa=[this.element,this._oAnchor];
var _1ab;
var _1ac=this.parent&&this.parent.lazyLoad;
if(_1a7){
if(_1a7 instanceof Menu){
_1ab=_1a7;
_1ab.parent=this;
_1ab.lazyLoad=_1ac;
}else{
if(typeof _1a7=="object"&&_1a7.id&&!_1a7.nodeType){
var _1ad=_1a7.id;
var _1ae=_1a7;
delete _1a7["id"];
_1ae.lazyload=_1ac;
_1ae.parent=this;
_1ab=new this.SUBMENU_TYPE(_1ad,_1ae);
this.cfg.setProperty("submenu",_1ab,true);
}else{
_1ab=new this.SUBMENU_TYPE(_1a7,{lazyload:_1ac,parent:this});
this.cfg.setProperty("submenu",_1ab,true);
}
}
if(_1ab){
this._oSubmenu=_1ab;
if(!oImg){
this._preloadImage(this.SUBMENU_INDICATOR_IMAGE_PATH);
this._preloadImage(this.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH);
this._preloadImage(this.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH);
oImg=document.createElement("img");
oImg.src=(this.imageRoot+this.SUBMENU_INDICATOR_IMAGE_PATH);
oImg.alt=this.COLLAPSED_SUBMENU_INDICATOR_ALT_TEXT;
oEl.appendChild(oImg);
this.submenuIndicator=oImg;
Dom.addClass(_1aa,"hassubmenu");
if(_1a9.getProperty("disabled")){
_1a9.refireEvent("disabled");
}
if(_1a9.getProperty("selected")){
_1a9.refireEvent("selected");
}
}
}
}else{
Dom.removeClass(_1aa,"hassubmenu");
if(oImg){
oEl.removeChild(oImg);
}
if(this._oSubmenu){
this._oSubmenu.destroy();
}
}
},initDefaultConfig:function(){
var _1af=this.cfg;
var _1b0=_1af.checkBoolean;
_1af.addProperty("text",{value:"",handler:this.configText,validator:this._checkString,suppressEvent:true});
_1af.addProperty("helptext",{handler:this.configHelpText});
_1af.addProperty("url",{value:"#",handler:this.configURL,suppressEvent:true});
_1af.addProperty("target",{handler:this.configTarget,suppressEvent:true});
_1af.addProperty("emphasis",{value:false,handler:this.configEmphasis,validator:_1b0,suppressEvent:true});
_1af.addProperty("strongemphasis",{value:false,handler:this.configStrongEmphasis,validator:_1b0,suppressEvent:true});
_1af.addProperty("checked",{value:false,handler:this.configChecked,validator:this.cfg.checkBoolean,suppressEvent:true,supercedes:["disabled"]});
_1af.addProperty("disabled",{value:false,handler:this.configDisabled,validator:_1b0,suppressEvent:true});
_1af.addProperty("selected",{value:false,handler:this.configSelected,validator:_1b0,suppressEvent:true});
_1af.addProperty("submenu",{handler:this.configSubmenu});
},getNextEnabledSibling:function(){
if(this.parent instanceof Menu){
var _1b1=this.groupIndex;
var _1b2=function(_1b3,_1b4){
return _1b3[_1b4]||_1b2(_1b3,(_1b4+1));
};
var _1b5=this.parent.getItemGroups();
var _1b6;
if(this.index<(_1b5[_1b1].length-1)){
_1b6=_1b2(_1b5[_1b1],(this.index+1));
}else{
var _1b7;
if(_1b1<(_1b5.length-1)){
_1b7=_1b1+1;
}else{
_1b7=0;
}
var _1b8=_1b2(_1b5,_1b7);
_1b6=_1b2(_1b8,0);
}
return (_1b6.cfg.getProperty("disabled")||_1b6.element.style.display=="none")?_1b6.getNextEnabledSibling():_1b6;
}
},getPreviousEnabledSibling:function(){
if(this.parent instanceof Menu){
var _1b9=this.groupIndex;
var _1ba=function(_1bb,_1bc){
return _1bb[_1bc]||_1ba(_1bb,(_1bc-1));
};
var _1bd=function(_1be,_1bf){
return _1be[_1bf]?_1bf:_1bd(_1be,(_1bf+1));
};
var _1c0=this.parent.getItemGroups();
var _1c1;
if(this.index>_1bd(_1c0[_1b9],0)){
_1c1=_1ba(_1c0[_1b9],(this.index-1));
}else{
var _1c2;
if(_1b9>_1bd(_1c0,0)){
_1c2=_1b9-1;
}else{
_1c2=_1c0.length-1;
}
var _1c3=_1ba(_1c0,_1c2);
_1c1=_1ba(_1c3,(_1c3.length-1));
}
return (_1c1.cfg.getProperty("disabled")||_1c1.element.style.display=="none")?_1c1.getPreviousEnabledSibling():_1c1;
}
},focus:function(){
var _1c4=this.parent;
var _1c5=this._oAnchor;
var _1c6=_1c4.activeItem;
if(!this.cfg.getProperty("disabled")&&_1c4&&_1c4.cfg.getProperty("visible")&&this.element.style.display!="none"){
if(_1c6){
_1c6.blur();
}
try{
_1c5.focus();
}
catch(e){
}
this.focusEvent.fire();
}
},blur:function(){
var _1c7=this.parent;
if(!this.cfg.getProperty("disabled")&&_1c7&&Dom.getStyle(_1c7.element,"visibility")=="visible"){
this._oAnchor.blur();
this.blurEvent.fire();
}
},destroy:function(){
var oEl=this.element;
if(oEl){
this.mouseOverEvent.unsubscribeAll();
this.mouseOutEvent.unsubscribeAll();
this.mouseDownEvent.unsubscribeAll();
this.mouseUpEvent.unsubscribeAll();
this.clickEvent.unsubscribeAll();
this.keyPressEvent.unsubscribeAll();
this.keyDownEvent.unsubscribeAll();
this.keyUpEvent.unsubscribeAll();
this.focusEvent.unsubscribeAll();
this.blurEvent.unsubscribeAll();
this.cfg.configChangedEvent.unsubscribeAll();
var _1c9=oEl.parentNode;
if(_1c9){
_1c9.removeChild(oEl);
this.destroyEvent.fire();
}
this.destroyEvent.unsubscribeAll();
}
},toString:function(){
return ("MenuItem: "+this.cfg.getProperty("text"));
}};
})();
YAHOO.widget.MenuModuleItem=YAHOO.widget.MenuItem;
YAHOO.widget.ContextMenu=function(_1ca,_1cb){
YAHOO.widget.ContextMenu.superclass.constructor.call(this,_1ca,_1cb);
};
YAHOO.extend(YAHOO.widget.ContextMenu,YAHOO.widget.Menu,{_oTrigger:null,contextEventTarget:null,init:function(_1cc,_1cd){
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.ContextMenuItem;
}
YAHOO.widget.ContextMenu.superclass.init.call(this,_1cc);
this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);
if(_1cd){
this.cfg.applyConfig(_1cd,true);
}
this.initEvent.fire(YAHOO.widget.ContextMenu);
},_removeEventHandlers:function(){
var _1ce=YAHOO.util.Event;
var _1cf=this._oTrigger;
var _1d0=(this.browser=="opera");
_1ce.removeListener(_1cf,(_1d0?"mousedown":"contextmenu"),this._onTriggerContextMenu);
if(_1d0){
_1ce.removeListener(_1cf,"click",this._onTriggerClick);
}
},_onTriggerClick:function(_1d1,_1d2){
if(_1d1.ctrlKey){
YAHOO.util.Event.stopEvent(_1d1);
}
},_onTriggerContextMenu:function(_1d3,_1d4){
YAHOO.widget.MenuManager.hideVisible();
var _1d5=YAHOO.util.Event;
var _1d6=this.cfg;
if(_1d3.type=="mousedown"&&!_1d3.ctrlKey){
return;
}
this.contextEventTarget=_1d5.getTarget(_1d3);
var nX=_1d5.getPageX(_1d3);
var nY=_1d5.getPageY(_1d3);
_1d6.applyConfig({xy:[nX,nY],visible:true});
_1d6.fireQueue();
_1d5.stopEvent(_1d3);
},toString:function(){
return ("ContextMenu "+this.id);
},initDefaultConfig:function(){
YAHOO.widget.ContextMenu.superclass.initDefaultConfig.call(this);
this.cfg.addProperty("trigger",{handler:this.configTrigger});
},destroy:function(){
this._removeEventHandlers();
YAHOO.widget.ContextMenu.superclass.destroy.call(this);
},configTrigger:function(_1d9,_1da,_1db){
var _1dc=YAHOO.util.Event;
var _1dd=_1da[0];
if(_1dd){
if(this._oTrigger){
this._removeEventHandlers();
}
this._oTrigger=_1dd;
var _1de=(this.browser=="opera");
_1dc.addListener(_1dd,(_1de?"mousedown":"contextmenu"),this._onTriggerContextMenu,this,true);
if(_1de){
_1dc.addListener(_1dd,"click",this._onTriggerClick,this,true);
}
}else{
this._removeEventHandlers();
}
}});
YAHOO.widget.ContextMenuItem=function(_1df,_1e0){
YAHOO.widget.ContextMenuItem.superclass.constructor.call(this,_1df,_1e0);
};
YAHOO.extend(YAHOO.widget.ContextMenuItem,YAHOO.widget.MenuItem,{init:function(_1e1,_1e2){
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=YAHOO.widget.ContextMenu;
}
YAHOO.widget.ContextMenuItem.superclass.init.call(this,_1e1);
var _1e3=this.cfg;
if(_1e2){
_1e3.applyConfig(_1e2,true);
}
_1e3.fireQueue();
},toString:function(){
return ("MenuBarItem: "+this.cfg.getProperty("text"));
}});
YAHOO.widget.MenuBar=function(_1e4,_1e5){
YAHOO.widget.MenuBar.superclass.constructor.call(this,_1e4,_1e5);
};
YAHOO.extend(YAHOO.widget.MenuBar,YAHOO.widget.Menu,{init:function(_1e6,_1e7){
if(!this.ITEM_TYPE){
this.ITEM_TYPE=YAHOO.widget.MenuBarItem;
}
YAHOO.widget.MenuBar.superclass.init.call(this,_1e6);
this.beforeInitEvent.fire(YAHOO.widget.MenuBar);
if(_1e7){
this.cfg.applyConfig(_1e7,true);
}
this.initEvent.fire(YAHOO.widget.MenuBar);
},CSS_CLASS_NAME:"yuimenubar",_onKeyDown:function(_1e8,_1e9,_1ea){
var _1eb=YAHOO.util.Event;
var _1ec=_1e9[0];
var _1ed=_1e9[1];
var _1ee=_1ed.cfg;
var _1ef;
switch(_1ec.keyCode){
case 27:
if(this.cfg.getProperty("position")=="dynamic"){
this.hide();
if(this.parent){
this.parent.focus();
}
}else{
if(this.activeItem){
_1ef=this.activeItem.cfg.getProperty("submenu");
if(_1ef&&_1ef.cfg.getProperty("visible")){
_1ef.hide();
this.activeItem.focus();
}else{
this.activeItem.cfg.setProperty("selected",false);
this.activeItem.blur();
}
}
}
_1eb.preventDefault(_1ec);
break;
case 37:
case 39:
if(_1ed==this.activeItem&&!_1ee.getProperty("selected")){
_1ee.setProperty("selected",true);
}else{
var _1f0=(_1ec.keyCode==37)?_1ed.getPreviousEnabledSibling():_1ed.getNextEnabledSibling();
if(_1f0){
this.clearActiveItem();
_1f0.cfg.setProperty("selected",true);
if(this.cfg.getProperty("autosubmenudisplay")){
_1ef=_1f0.cfg.getProperty("submenu");
if(_1ef){
_1ef.show();
_1ef.activeItem.blur();
_1ef.activeItem=null;
}
}
_1f0.focus();
}
}
_1eb.preventDefault(_1ec);
break;
case 40:
if(this.activeItem!=_1ed){
this.clearActiveItem();
_1ee.setProperty("selected",true);
_1ed.focus();
}
_1ef=_1ee.getProperty("submenu");
if(_1ef){
if(_1ef.cfg.getProperty("visible")){
_1ef.setInitialSelection();
_1ef.setInitialFocus();
}else{
_1ef.show();
}
}
_1eb.preventDefault(_1ec);
break;
}
},_onClick:function(_1f1,_1f2,_1f3){
YAHOO.widget.MenuBar.superclass._onClick.call(this,_1f1,_1f2,_1f3);
var _1f4=_1f2[1];
if(_1f4){
var _1f5=YAHOO.util.Event;
var Dom=YAHOO.util.Dom;
var _1f7=_1f2[0];
var _1f8=_1f5.getTarget(_1f7);
var _1f9=this.activeItem;
var _1fa=this.cfg;
if(_1f9&&_1f9!=_1f4){
this.clearActiveItem();
}
_1f4.cfg.setProperty("selected",true);
_1f4.focus();
var _1fb=_1f4.cfg.getProperty("submenu");
if(_1fb&&_1f8!=_1f4.submenuIndicator){
if(_1fb.cfg.getProperty("visible")){
_1fb.hide();
}else{
_1fb.show();
}
}
}
},toString:function(){
return ("MenuBar "+this.id);
},initDefaultConfig:function(){
YAHOO.widget.MenuBar.superclass.initDefaultConfig.call(this);
var _1fc=this.cfg;
_1fc.addProperty("position",{value:"static",handler:this.configPosition,validator:this._checkPosition,supercedes:["visible"]});
_1fc.addProperty("submenualignment",{value:["tl","bl"]});
_1fc.addProperty("autosubmenudisplay",{value:false,validator:_1fc.checkBoolean});
}});
YAHOO.widget.MenuBarItem=function(_1fd,_1fe){
YAHOO.widget.MenuBarItem.superclass.constructor.call(this,_1fd,_1fe);
};
YAHOO.extend(YAHOO.widget.MenuBarItem,YAHOO.widget.MenuItem,{init:function(_1ff,_200){
if(!this.SUBMENU_TYPE){
this.SUBMENU_TYPE=YAHOO.widget.Menu;
}
YAHOO.widget.MenuBarItem.superclass.init.call(this,_1ff);
var _201=this.cfg;
if(_200){
_201.applyConfig(_200,true);
}
_201.fireQueue();
},CSS_CLASS_NAME:"yuimenubaritem",SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarodwn8_nrm_1.gif",SELECTED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarodwn8_hov_1.gif",DISABLED_SUBMENU_INDICATOR_IMAGE_PATH:"nt/ic/ut/alt1/menuarodwn8_dim_1.gif",toString:function(){
return ("MenuBarItem: "+this.cfg.getProperty("text"));
}});

