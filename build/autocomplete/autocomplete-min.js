YAHOO.widget.DS_JSArray=YAHOO.util.LocalDataSource;YAHOO.widget.DS_JSFunction=YAHOO.util.FunctionDataSource;YAHOO.widget.DS_XHR=function(B,A,D){var C=new YAHOO.util.XHRDataSource(B,D);C._aDeprecatedSchema=A;return C;};YAHOO.widget.DS_ScriptNode=function(B,A,D){var C=new YAHOO.util.ScriptNodeDataSource(B,D);C._aDeprecatedSchema=A;return C;};YAHOO.widget.DS_XHR.TYPE_JSON=YAHOO.util.DataSourceBase.TYPE_JSON;YAHOO.widget.DS_XHR.TYPE_XML=YAHOO.util.DataSourceBase.TYPE_XML;YAHOO.widget.DS_XHR.TYPE_FLAT=YAHOO.util.DataSourceBase.TYPE_TEXT;YAHOO.widget.AutoComplete=function(G,B,J,C){if(G&&B&&J){if(J instanceof YAHOO.util.DataSourceBase){this.dataSource=J;}else{return;}this.key=0;var D=J.responseSchema;if(J._aDeprecatedSchema){var K=J._aDeprecatedSchema;if(YAHOO.lang.isArray(K)){if((J.responseType===YAHOO.util.DataSourceBase.TYPE_JSON)||(J.responseType===YAHOO.util.DataSourceBase.TYPE_UNKNOWN)){D.resultsList=K[0];this.key=K[1];D.fields=(K.length<3)?null:K.slice(1);}else{if(J.responseType===YAHOO.util.DataSourceBase.TYPE_XML){D.resultNode=K[0];this.key=K[1];D.fields=K.slice(1);}else{if(J.responseType===YAHOO.util.DataSourceBase.TYPE_TEXT){D.recordDelim=K[0];D.fieldDelim=K[1];}}}J.responseSchema=D;}}if(YAHOO.util.Dom.inDocument(G)){if(YAHOO.lang.isString(G)){this._sName="instance"+YAHOO.widget.AutoComplete._nIndex+" "+G;this._elTextbox=document.getElementById(G);}else{this._sName=(G.id)?"instance"+YAHOO.widget.AutoComplete._nIndex+" "+G.id:"instance"+YAHOO.widget.AutoComplete._nIndex;this._elTextbox=G;}YAHOO.util.Dom.addClass(this._elTextbox,"yui-ac-input");}else{return;}if(YAHOO.util.Dom.inDocument(B)){if(YAHOO.lang.isString(B)){this._elContainer=document.getElementById(B);}else{this._elContainer=B;}if(this._elContainer.style.display=="none"){}var E=this._elContainer.parentNode;var A=E.tagName.toLowerCase();if(A=="div"){YAHOO.util.Dom.addClass(E,"yui-ac");}else{}}else{return;}if(this.dataSource.dataType===YAHOO.util.DataSourceBase.TYPE_LOCAL){this.applyLocalFilter=true;}if(C&&(C.constructor==Object)){for(var I in C){if(I){this[I]=C[I];}}}this._initContainerEl();this._initProps();this._initListEl();this._initContainerHelperEls();var H=this;var F=this._elTextbox;YAHOO.util.Event.addListener(F,"keyup",H._onTextboxKeyUp,H);YAHOO.util.Event.addListener(F,"keydown",H._onTextboxKeyDown,H);YAHOO.util.Event.addListener(F,"focus",H._onTextboxFocus,H);YAHOO.util.Event.addListener(F,"blur",H._onTextboxBlur,H);YAHOO.util.Event.addListener(B,"mouseover",H._onContainerMouseover,H);YAHOO.util.Event.addListener(B,"mouseout",H._onContainerMouseout,H);YAHOO.util.Event.addListener(B,"click",H._onContainerClick,H);YAHOO.util.Event.addListener(B,"scroll",H._onContainerScroll,H);YAHOO.util.Event.addListener(B,"resize",H._onContainerResize,H);YAHOO.util.Event.addListener(F,"keypress",H._onTextboxKeyPress,H);YAHOO.util.Event.addListener(window,"unload",H._onWindowUnload,H);this.textboxFocusEvent=new YAHOO.util.CustomEvent("textboxFocus",this);this.textboxKeyEvent=new YAHOO.util.CustomEvent("textboxKey",this);this.dataRequestEvent=new YAHOO.util.CustomEvent("dataRequest",this);this.dataReturnEvent=new YAHOO.util.CustomEvent("dataReturn",this);this.dataErrorEvent=new YAHOO.util.CustomEvent("dataError",this);this.containerPopulateEvent=new YAHOO.util.CustomEvent("containerPopulate",this);this.containerExpandEvent=new YAHOO.util.CustomEvent("containerExpand",this);this.typeAheadEvent=new YAHOO.util.CustomEvent("typeAhead",this);this.itemMouseOverEvent=new YAHOO.util.CustomEvent("itemMouseOver",this);this.itemMouseOutEvent=new YAHOO.util.CustomEvent("itemMouseOut",this);this.itemArrowToEvent=new YAHOO.util.CustomEvent("itemArrowTo",this);this.itemArrowFromEvent=new YAHOO.util.CustomEvent("itemArrowFrom",this);this.itemSelectEvent=new YAHOO.util.CustomEvent("itemSelect",this);this.unmatchedItemSelectEvent=new YAHOO.util.CustomEvent("unmatchedItemSelect",this);this.selectionEnforceEvent=new YAHOO.util.CustomEvent("selectionEnforce",this);this.containerCollapseEvent=new YAHOO.util.CustomEvent("containerCollapse",this);this.textboxBlurEvent=new YAHOO.util.CustomEvent("textboxBlur",this);this.textboxChangeEvent=new YAHOO.util.CustomEvent("textboxChange",this);F.setAttribute("autocomplete","off");YAHOO.widget.AutoComplete._nIndex++;}else{}};YAHOO.widget.AutoComplete.prototype.dataSource=null;YAHOO.widget.AutoComplete.prototype.applyLocalFilter=null;YAHOO.widget.AutoComplete.prototype.queryMatchCase=false;YAHOO.widget.AutoComplete.prototype.queryMatchContains=false;YAHOO.widget.AutoComplete.prototype.queryMatchSubset=false;YAHOO.widget.AutoComplete.prototype.minQueryLength=1;YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed=10;YAHOO.widget.AutoComplete.prototype.queryDelay=0.2;YAHOO.widget.AutoComplete.prototype.typeAheadDelay=0.5;YAHOO.widget.AutoComplete.prototype.queryInterval=500;YAHOO.widget.AutoComplete.prototype.highlightClassName="yui-ac-highlight";YAHOO.widget.AutoComplete.prototype.prehighlightClassName=null;YAHOO.widget.AutoComplete.prototype.delimChar=null;YAHOO.widget.AutoComplete.prototype.autoHighlight=true;YAHOO.widget.AutoComplete.prototype.typeAhead=false;YAHOO.widget.AutoComplete.prototype.animHoriz=false;YAHOO.widget.AutoComplete.prototype.animVert=true;YAHOO.widget.AutoComplete.prototype.animSpeed=0.3;YAHOO.widget.AutoComplete.prototype.forceSelection=false;YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete=true;YAHOO.widget.AutoComplete.prototype.alwaysShowContainer=false;YAHOO.widget.AutoComplete.prototype.useIFrame=false;YAHOO.widget.AutoComplete.prototype.useShadow=false;YAHOO.widget.AutoComplete.prototype.suppressInputUpdate=false;YAHOO.widget.AutoComplete.prototype.resultTypeList=true;YAHOO.widget.AutoComplete.prototype.queryQuestionMark=true;YAHOO.widget.AutoComplete.prototype.autoSnapContainer=true;YAHOO.widget.AutoComplete.prototype.toString=function(){return"AutoComplete "+this._sName;};YAHOO.widget.AutoComplete.prototype.getInputEl=function(){return this._elTextbox;};YAHOO.widget.AutoComplete.prototype.getContainerEl=function(){return this._elContainer;
};YAHOO.widget.AutoComplete.prototype.isFocused=function(){return this._bFocused;};YAHOO.widget.AutoComplete.prototype.isContainerOpen=function(){return this._bContainerOpen;};YAHOO.widget.AutoComplete.prototype.getListEl=function(){return this._elList;};YAHOO.widget.AutoComplete.prototype.getListItemMatch=function(A){if(A._sResultMatch){return A._sResultMatch;}else{return null;}};YAHOO.widget.AutoComplete.prototype.getListItemData=function(A){if(A._oResultData){return A._oResultData;}else{return null;}};YAHOO.widget.AutoComplete.prototype.getListItemIndex=function(A){if(YAHOO.lang.isNumber(A._nItemIndex)){return A._nItemIndex;}else{return null;}};YAHOO.widget.AutoComplete.prototype.setHeader=function(B){if(this._elHeader){var A=this._elHeader;if(B){A.innerHTML=B;A.style.display="";}else{A.innerHTML="";A.style.display="none";}}};YAHOO.widget.AutoComplete.prototype.setFooter=function(B){if(this._elFooter){var A=this._elFooter;if(B){A.innerHTML=B;A.style.display="";}else{A.innerHTML="";A.style.display="none";}}};YAHOO.widget.AutoComplete.prototype.setBody=function(A){if(this._elBody){var B=this._elBody;YAHOO.util.Event.purgeElement(B,true);if(A){B.innerHTML=A;B.style.display="";}else{B.innerHTML="";B.style.display="none";}this._elList=null;}};YAHOO.widget.AutoComplete.prototype.generateRequest=function(B){var A=this.dataSource.dataType;if(A===YAHOO.util.DataSourceBase.TYPE_XHR){if(!this.dataSource.connMethodPost){B=(this.queryQuestionMark?"?":"")+(this.dataSource.scriptQueryParam||"query")+"="+B+(this.dataSource.scriptQueryAppend?("&"+this.dataSource.scriptQueryAppend):"");}else{B=(this.dataSource.scriptQueryParam||"query")+"="+B+(this.dataSource.scriptQueryAppend?("&"+this.dataSource.scriptQueryAppend):"");}}else{if(A===YAHOO.util.DataSourceBase.TYPE_SCRIPTNODE){B="&"+(this.dataSource.scriptQueryParam||"query")+"="+B+(this.dataSource.scriptQueryAppend?("&"+this.dataSource.scriptQueryAppend):"");}}return B;};YAHOO.widget.AutoComplete.prototype.sendQuery=function(B){this._bFocused=true;var A=(this.delimChar)?this._elTextbox.value+B:B;this._sendQuery(A);};YAHOO.widget.AutoComplete.prototype.snapContainer=function(){var A=this._elTextbox,B=YAHOO.util.Dom.getXY(A);B[1]+=YAHOO.util.Dom.get(A).offsetHeight+2;YAHOO.util.Dom.setXY(this._elContainer,B);};YAHOO.widget.AutoComplete.prototype.expandContainer=function(){this._toggleContainer(true);};YAHOO.widget.AutoComplete.prototype.collapseContainer=function(){this._toggleContainer(false);};YAHOO.widget.AutoComplete.prototype.clearList=function(){var B=this._elList.childNodes,A=B.length-1;for(;A>-1;A--){B[A].style.display="none";}};YAHOO.widget.AutoComplete.prototype.getSubsetMatches=function(E){var D,C,A;for(var B=E.length;B>=this.minQueryLength;B--){A=this.generateRequest(E.substr(0,B));this.dataRequestEvent.fire(this,D,A);C=this.dataSource.getCachedResponse(A);if(C){return this.filterResults.apply(this.dataSource,[E,C,C,{scope:this}]);}}return null;};YAHOO.widget.AutoComplete.prototype.preparseRawResponse=function(C,B,A){var D=((this.responseStripAfter!=="")&&(B.indexOf))?B.indexOf(this.responseStripAfter):-1;if(D!=-1){B=B.substring(0,D);}return B;};YAHOO.widget.AutoComplete.prototype.filterResults=function(K,M,Q,L){if(L&&L.argument&&L.argument.query){K=L.argument.query;}if(K&&K!==""){Q=YAHOO.widget.AutoComplete._cloneObject(Q);var I=L.scope,P=this,C=Q.results,N=[],B=I.maxResultsDisplayed,J=(P.queryMatchCase||I.queryMatchCase),A=(P.queryMatchContains||I.queryMatchContains);for(var D=0,H=C.length;D<H;D++){var F=C[D];var E=null;if(YAHOO.lang.isString(F)){E=F;}else{if(YAHOO.lang.isArray(F)){E=F[0];}else{if(this.responseSchema.fields){var O=this.responseSchema.fields[0].key||this.responseSchema.fields[0];E=F[O];}else{if(this.key){E=F[this.key];}}}}if(YAHOO.lang.isString(E)){var G=(J)?E.indexOf(decodeURIComponent(K)):E.toLowerCase().indexOf(decodeURIComponent(K).toLowerCase());if((!A&&(G===0))||(A&&(G>-1))){N.push(F);}}if(H>B&&N.length===B){break;}}Q.results=N;}else{}return Q;};YAHOO.widget.AutoComplete.prototype.handleResponse=function(C,A,B){if((this instanceof YAHOO.widget.AutoComplete)&&this._sName){this._populateList(C,A,B);}};YAHOO.widget.AutoComplete.prototype.doBeforeLoadData=function(C,A,B){return true;};YAHOO.widget.AutoComplete.prototype.formatResult=function(B,D,A){var C=(A)?A:"";return C;};YAHOO.widget.AutoComplete.prototype.doBeforeExpandContainer=function(D,A,C,B){return true;};YAHOO.widget.AutoComplete.prototype.destroy=function(){var B=this.toString();var A=this._elTextbox;var D=this._elContainer;this.textboxFocusEvent.unsubscribeAll();this.textboxKeyEvent.unsubscribeAll();this.dataRequestEvent.unsubscribeAll();this.dataReturnEvent.unsubscribeAll();this.dataErrorEvent.unsubscribeAll();this.containerPopulateEvent.unsubscribeAll();this.containerExpandEvent.unsubscribeAll();this.typeAheadEvent.unsubscribeAll();this.itemMouseOverEvent.unsubscribeAll();this.itemMouseOutEvent.unsubscribeAll();this.itemArrowToEvent.unsubscribeAll();this.itemArrowFromEvent.unsubscribeAll();this.itemSelectEvent.unsubscribeAll();this.unmatchedItemSelectEvent.unsubscribeAll();this.selectionEnforceEvent.unsubscribeAll();this.containerCollapseEvent.unsubscribeAll();this.textboxBlurEvent.unsubscribeAll();this.textboxChangeEvent.unsubscribeAll();YAHOO.util.Event.purgeElement(A,true);YAHOO.util.Event.purgeElement(D,true);D.innerHTML="";for(var C in this){if(YAHOO.lang.hasOwnProperty(this,C)){this[C]=null;}}};YAHOO.widget.AutoComplete.prototype.textboxFocusEvent=null;YAHOO.widget.AutoComplete.prototype.textboxKeyEvent=null;YAHOO.widget.AutoComplete.prototype.dataRequestEvent=null;YAHOO.widget.AutoComplete.prototype.dataReturnEvent=null;YAHOO.widget.AutoComplete.prototype.dataErrorEvent=null;YAHOO.widget.AutoComplete.prototype.containerPopulateEvent=null;YAHOO.widget.AutoComplete.prototype.containerExpandEvent=null;YAHOO.widget.AutoComplete.prototype.typeAheadEvent=null;YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent=null;YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent=null;
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent=null;YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent=null;YAHOO.widget.AutoComplete.prototype.itemSelectEvent=null;YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent=null;YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent=null;YAHOO.widget.AutoComplete.prototype.containerCollapseEvent=null;YAHOO.widget.AutoComplete.prototype.textboxBlurEvent=null;YAHOO.widget.AutoComplete.prototype.textboxChangeEvent=null;YAHOO.widget.AutoComplete._nIndex=0;YAHOO.widget.AutoComplete.prototype._sName=null;YAHOO.widget.AutoComplete.prototype._elTextbox=null;YAHOO.widget.AutoComplete.prototype._elContainer=null;YAHOO.widget.AutoComplete.prototype._elContent=null;YAHOO.widget.AutoComplete.prototype._elHeader=null;YAHOO.widget.AutoComplete.prototype._elBody=null;YAHOO.widget.AutoComplete.prototype._elFooter=null;YAHOO.widget.AutoComplete.prototype._elShadow=null;YAHOO.widget.AutoComplete.prototype._elIFrame=null;YAHOO.widget.AutoComplete.prototype._bFocused=false;YAHOO.widget.AutoComplete.prototype._oAnim=null;YAHOO.widget.AutoComplete.prototype._bContainerOpen=false;YAHOO.widget.AutoComplete.prototype._bOverContainer=false;YAHOO.widget.AutoComplete.prototype._elList=null;YAHOO.widget.AutoComplete.prototype._nDisplayedItems=0;YAHOO.widget.AutoComplete.prototype._sCurQuery=null;YAHOO.widget.AutoComplete.prototype._sPastSelections="";YAHOO.widget.AutoComplete.prototype._sInitInputValue=null;YAHOO.widget.AutoComplete.prototype._elCurListItem=null;YAHOO.widget.AutoComplete.prototype._bItemSelected=false;YAHOO.widget.AutoComplete.prototype._nKeyCode=null;YAHOO.widget.AutoComplete.prototype._nDelayID=-1;YAHOO.widget.AutoComplete.prototype._nTypeAheadDelayID=-1;YAHOO.widget.AutoComplete.prototype._iFrameSrc="javascript:false;";YAHOO.widget.AutoComplete.prototype._queryInterval=null;YAHOO.widget.AutoComplete.prototype._sLastTextboxValue=null;YAHOO.widget.AutoComplete.prototype._initProps=function(){var B=this.minQueryLength;if(!YAHOO.lang.isNumber(B)){this.minQueryLength=1;}var E=this.maxResultsDisplayed;if(!YAHOO.lang.isNumber(E)||(E<1)){this.maxResultsDisplayed=10;}var F=this.queryDelay;if(!YAHOO.lang.isNumber(F)||(F<0)){this.queryDelay=0.2;}var C=this.typeAheadDelay;if(!YAHOO.lang.isNumber(C)||(C<0)){this.typeAheadDelay=0.2;}var A=this.delimChar;if(YAHOO.lang.isString(A)&&(A.length>0)){this.delimChar=[A];}else{if(!YAHOO.lang.isArray(A)){this.delimChar=null;}}var D=this.animSpeed;if((this.animHoriz||this.animVert)&&YAHOO.util.Anim){if(!YAHOO.lang.isNumber(D)||(D<0)){this.animSpeed=0.3;}if(!this._oAnim){this._oAnim=new YAHOO.util.Anim(this._elContent,{},this.animSpeed);}else{this._oAnim.duration=this.animSpeed;}}if(this.forceSelection&&A){}};YAHOO.widget.AutoComplete.prototype._initContainerHelperEls=function(){if(this.useShadow&&!this._elShadow){var A=document.createElement("div");A.className="yui-ac-shadow";A.style.width=0;A.style.height=0;this._elShadow=this._elContainer.appendChild(A);}if(this.useIFrame&&!this._elIFrame){var B=document.createElement("iframe");B.src=this._iFrameSrc;B.frameBorder=0;B.scrolling="no";B.style.position="absolute";B.style.width=0;B.style.height=0;B.style.padding=0;B.tabIndex=-1;B.role="presentation";B.title="Presentational iframe shim";this._elIFrame=this._elContainer.appendChild(B);}};YAHOO.widget.AutoComplete.prototype._initContainerEl=function(){YAHOO.util.Dom.addClass(this._elContainer,"yui-ac-container");if(!this._elContent){var C=document.createElement("div");C.className="yui-ac-content";C.style.display="none";this._elContent=this._elContainer.appendChild(C);var B=document.createElement("div");B.className="yui-ac-hd";B.style.display="none";this._elHeader=this._elContent.appendChild(B);var D=document.createElement("div");D.className="yui-ac-bd";this._elBody=this._elContent.appendChild(D);var A=document.createElement("div");A.className="yui-ac-ft";A.style.display="none";this._elFooter=this._elContent.appendChild(A);}else{}};YAHOO.widget.AutoComplete.prototype._initListEl=function(){var C=this.maxResultsDisplayed,A=this._elList||document.createElement("ul"),B;while(A.childNodes.length<C){B=document.createElement("li");B.style.display="none";B._nItemIndex=A.childNodes.length;A.appendChild(B);}if(!this._elList){var D=this._elBody;YAHOO.util.Event.purgeElement(D,true);D.innerHTML="";this._elList=D.appendChild(A);}this._elBody.style.display="";};YAHOO.widget.AutoComplete.prototype._focus=function(){var A=this;setTimeout(function(){try{A._elTextbox.focus();}catch(B){}},0);};YAHOO.widget.AutoComplete.prototype._enableIntervalDetection=function(){var A=this;if(!A._queryInterval&&A.queryInterval){A._queryInterval=setInterval(function(){A._onInterval();},A.queryInterval);}};YAHOO.widget.AutoComplete.prototype._onInterval=function(){var A=this._elTextbox.value;var B=this._sLastTextboxValue;if(A!=B){this._sLastTextboxValue=A;this._sendQuery(A);}};YAHOO.widget.AutoComplete.prototype._clearInterval=function(){if(this._queryInterval){clearInterval(this._queryInterval);this._queryInterval=null;}};YAHOO.widget.AutoComplete.prototype._isIgnoreKey=function(A){if((A==9)||(A==13)||(A==16)||(A==17)||(A>=18&&A<=20)||(A==27)||(A>=33&&A<=35)||(A>=36&&A<=40)||(A>=44&&A<=45)||(A==229)){return true;}return false;};YAHOO.widget.AutoComplete.prototype._sendQuery=function(D){if(this.minQueryLength<0){this._toggleContainer(false);return;}if(this.delimChar){var A=this._extractQuery(D);D=A.query;this._sPastSelections=A.previous;}if((D&&(D.length<this.minQueryLength))||(!D&&this.minQueryLength>0)){if(this._nDelayID!=-1){clearTimeout(this._nDelayID);}this._toggleContainer(false);return;}D=encodeURIComponent(D);this._nDelayID=-1;if(this.dataSource.queryMatchSubset||this.queryMatchSubset){var C=this.getSubsetMatches(D);if(C){this.handleResponse(D,C,{query:D});return;}}if(this.dataSource.responseStripAfter){this.dataSource.doBeforeParseData=this.preparseRawResponse;}if(this.applyLocalFilter){this.dataSource.doBeforeCallback=this.filterResults;}var B=this.generateRequest(D);
this.dataRequestEvent.fire(this,D,B);this.dataSource.sendRequest(B,{success:this.handleResponse,failure:this.handleResponse,scope:this,argument:{query:D}});};YAHOO.widget.AutoComplete.prototype._populateList=function(K,F,C){if(this._nTypeAheadDelayID!=-1){clearTimeout(this._nTypeAheadDelayID);}K=(C&&C.query)?C.query:K;var H=this.doBeforeLoadData(K,F,C);if(H&&!F.error){this.dataReturnEvent.fire(this,K,F.results);if(this._bFocused){var M=decodeURIComponent(K);this._sCurQuery=M;this._bItemSelected=false;var R=F.results,A=Math.min(R.length,this.maxResultsDisplayed),J=(this.dataSource.responseSchema.fields)?(this.dataSource.responseSchema.fields[0].key||this.dataSource.responseSchema.fields[0]):0;if(A>0){if(!this._elList||(this._elList.childNodes.length<A)){this._initListEl();}this._initContainerHelperEls();var I=this._elList.childNodes;for(var Q=A-1;Q>=0;Q--){var P=I[Q],E=R[Q];if(this.resultTypeList){var B=[];B[0]=(YAHOO.lang.isString(E))?E:E[J]||E[this.key];var L=this.dataSource.responseSchema.fields;if(YAHOO.lang.isArray(L)&&(L.length>1)){for(var N=1,S=L.length;N<S;N++){B[B.length]=E[L[N].key||L[N]];}}else{if(YAHOO.lang.isArray(E)){B=E;}else{if(YAHOO.lang.isString(E)){B=[E];}else{B[1]=E;}}}E=B;}P._sResultMatch=(YAHOO.lang.isString(E))?E:(YAHOO.lang.isArray(E))?E[0]:(E[J]||"");P._oResultData=E;P.innerHTML=this.formatResult(E,M,P._sResultMatch);P.style.display="";}if(A<I.length){var G;for(var O=I.length-1;O>=A;O--){G=I[O];G.style.display="none";}}this._nDisplayedItems=A;this.containerPopulateEvent.fire(this,K,R);if(this.autoHighlight){var D=this._elList.firstChild;this._toggleHighlight(D,"to");this.itemArrowToEvent.fire(this,D);this._typeAhead(D,K);}else{this._toggleHighlight(this._elCurListItem,"from");}H=this._doBeforeExpandContainer(this._elTextbox,this._elContainer,K,R);this._toggleContainer(H);}else{this._toggleContainer(false);}return;}}else{this.dataErrorEvent.fire(this,K,F);}};YAHOO.widget.AutoComplete.prototype._doBeforeExpandContainer=function(D,A,C,B){if(this.autoSnapContainer){this.snapContainer();}return this.doBeforeExpandContainer(D,A,C,B);};YAHOO.widget.AutoComplete.prototype._clearSelection=function(){var A=(this.delimChar)?this._extractQuery(this._elTextbox.value):{previous:"",query:this._elTextbox.value};this._elTextbox.value=A.previous;this.selectionEnforceEvent.fire(this,A.query);};YAHOO.widget.AutoComplete.prototype._textMatchesOption=function(){var A=null;for(var B=0;B<this._nDisplayedItems;B++){var C=this._elList.childNodes[B];var D=(""+C._sResultMatch).toLowerCase();if(D==this._sCurQuery.toLowerCase()){A=C;break;}}return(A);};YAHOO.widget.AutoComplete.prototype._typeAhead=function(B,D){if(!this.typeAhead||(this._nKeyCode==8)){return;}var A=this,C=this._elTextbox;if(C.setSelectionRange||C.createTextRange){this._nTypeAheadDelayID=setTimeout(function(){var F=C.value.length;A._updateValue(B);var G=C.value.length;A._selectText(C,F,G);var E=C.value.substr(F,G);A.typeAheadEvent.fire(A,D,E);},(this.typeAheadDelay*1000));}};YAHOO.widget.AutoComplete.prototype._selectText=function(D,A,B){if(D.setSelectionRange){D.setSelectionRange(A,B);}else{if(D.createTextRange){var C=D.createTextRange();C.moveStart("character",A);C.moveEnd("character",B-D.value.length);C.select();}else{D.select();}}};YAHOO.widget.AutoComplete.prototype._extractQuery=function(H){var C=this.delimChar,F=-1,G,E,B=C.length-1,D;for(;B>=0;B--){G=H.lastIndexOf(C[B]);if(G>F){F=G;}}if(C[B]==" "){for(var A=C.length-1;A>=0;A--){if(H[F-1]==C[A]){F--;break;}}}if(F>-1){E=F+1;while(H.charAt(E)==" "){E+=1;}D=H.substring(0,E);H=H.substr(E);}else{D="";}return{previous:D,query:H};};YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers=function(D){var E=this._elContent.offsetWidth+"px";var B=this._elContent.offsetHeight+"px";if(this.useIFrame&&this._elIFrame){var C=this._elIFrame;if(D){C.style.width=E;C.style.height=B;C.style.padding="";}else{C.style.width=0;C.style.height=0;C.style.padding=0;}}if(this.useShadow&&this._elShadow){var A=this._elShadow;if(D){A.style.width=E;A.style.height=B;}else{A.style.width=0;A.style.height=0;}}};YAHOO.widget.AutoComplete.prototype._toggleContainer=function(I){var D=this._elContainer;if(this.alwaysShowContainer&&this._bContainerOpen){return;}if(!I){this._toggleHighlight(this._elCurListItem,"from");this._nDisplayedItems=0;this._sCurQuery=null;if(this._elContent.style.display=="none"){return;}}var A=this._oAnim;if(A&&A.getEl()&&(this.animHoriz||this.animVert)){if(A.isAnimated()){A.stop(true);}var G=this._elContent.cloneNode(true);D.appendChild(G);G.style.top="-9000px";G.style.width="";G.style.height="";G.style.display="";var F=G.offsetWidth;var C=G.offsetHeight;var B=(this.animHoriz)?0:F;var E=(this.animVert)?0:C;A.attributes=(I)?{width:{to:F},height:{to:C}}:{width:{to:B},height:{to:E}};if(I&&!this._bContainerOpen){this._elContent.style.width=B+"px";this._elContent.style.height=E+"px";}else{this._elContent.style.width=F+"px";this._elContent.style.height=C+"px";}D.removeChild(G);G=null;var H=this;var J=function(){A.onComplete.unsubscribeAll();if(I){H._toggleContainerHelpers(true);H._bContainerOpen=I;H.containerExpandEvent.fire(H);}else{H._elContent.style.display="none";H._bContainerOpen=I;H.containerCollapseEvent.fire(H);}};this._toggleContainerHelpers(false);this._elContent.style.display="";A.onComplete.subscribe(J);A.animate();}else{if(I){this._elContent.style.display="";this._toggleContainerHelpers(true);this._bContainerOpen=I;this.containerExpandEvent.fire(this);}else{this._toggleContainerHelpers(false);this._elContent.style.display="none";this._bContainerOpen=I;this.containerCollapseEvent.fire(this);}}};YAHOO.widget.AutoComplete.prototype._toggleHighlight=function(A,C){if(A){var B=this.highlightClassName;if(this._elCurListItem){YAHOO.util.Dom.removeClass(this._elCurListItem,B);this._elCurListItem=null;}if((C=="to")&&B){YAHOO.util.Dom.addClass(A,B);this._elCurListItem=A;}}};YAHOO.widget.AutoComplete.prototype._togglePrehighlight=function(B,C){if(B==this._elCurListItem){return;}var A=this.prehighlightClassName;
if((C=="mouseover")&&A){YAHOO.util.Dom.addClass(B,A);}else{YAHOO.util.Dom.removeClass(B,A);}};YAHOO.widget.AutoComplete.prototype._updateValue=function(C){if(!this.suppressInputUpdate){var F=this._elTextbox;var E=(this.delimChar)?(this.delimChar[0]||this.delimChar):null;var B=C._sResultMatch;var D="";if(E){D=this._sPastSelections;D+=B+E;if(E!=" "){D+=" ";}}else{D=B;}F.value=D;if(F.type=="textarea"){F.scrollTop=F.scrollHeight;}var A=F.value.length;this._selectText(F,A,A);this._elCurListItem=C;}};YAHOO.widget.AutoComplete.prototype._selectItem=function(A){this._bItemSelected=true;this._updateValue(A);this._sPastSelections=this._elTextbox.value;this._clearInterval();this.itemSelectEvent.fire(this,A,A._oResultData);this._toggleContainer(false);};YAHOO.widget.AutoComplete.prototype._jumpSelection=function(){if(this._elCurListItem){this._selectItem(this._elCurListItem);}else{this._toggleContainer(false);}};YAHOO.widget.AutoComplete.prototype._moveSelection=function(G){if(this._bContainerOpen){var H=this._elCurListItem,D=-1;if(H){D=H._nItemIndex;}var E=(G==40)?(D+1):(D-1);if(E<-2||E>=this._nDisplayedItems){return;}if(H){this._toggleHighlight(H,"from");this.itemArrowFromEvent.fire(this,H);}if(E==-1){if(this.delimChar){this._elTextbox.value=this._sPastSelections+this._sCurQuery;}else{this._elTextbox.value=this._sCurQuery;}return;}if(E==-2){this._toggleContainer(false);return;}var F=this._elList.childNodes[E],B=this._elContent,C=YAHOO.util.Dom.getStyle(B,"overflow"),I=YAHOO.util.Dom.getStyle(B,"overflowY"),A=((C=="auto")||(C=="scroll")||(I=="auto")||(I=="scroll"));if(A&&(E>-1)&&(E<this._nDisplayedItems)){if(G==40){if((F.offsetTop+F.offsetHeight)>(B.scrollTop+B.offsetHeight)){B.scrollTop=(F.offsetTop+F.offsetHeight)-B.offsetHeight;}else{if((F.offsetTop+F.offsetHeight)<B.scrollTop){B.scrollTop=F.offsetTop;}}}else{if(F.offsetTop<B.scrollTop){this._elContent.scrollTop=F.offsetTop;}else{if(F.offsetTop>(B.scrollTop+B.offsetHeight)){this._elContent.scrollTop=(F.offsetTop+F.offsetHeight)-B.offsetHeight;}}}}this._toggleHighlight(F,"to");this.itemArrowToEvent.fire(this,F);if(this.typeAhead){this._updateValue(F);}}};YAHOO.widget.AutoComplete.prototype._onContainerMouseover=function(A,C){var D=YAHOO.util.Event.getTarget(A);var B=D.nodeName.toLowerCase();while(D&&(B!="table")){switch(B){case"body":return;case"li":if(C.prehighlightClassName){C._togglePrehighlight(D,"mouseover");}else{C._toggleHighlight(D,"to");}C.itemMouseOverEvent.fire(C,D);break;case"div":if(YAHOO.util.Dom.hasClass(D,"yui-ac-container")){C._bOverContainer=true;return;}break;default:break;}D=D.parentNode;if(D){B=D.nodeName.toLowerCase();}}};YAHOO.widget.AutoComplete.prototype._onContainerMouseout=function(A,C){var D=YAHOO.util.Event.getTarget(A);var B=D.nodeName.toLowerCase();while(D&&(B!="table")){switch(B){case"body":return;case"li":if(C.prehighlightClassName){C._togglePrehighlight(D,"mouseout");}else{C._toggleHighlight(D,"from");}C.itemMouseOutEvent.fire(C,D);break;case"ul":C._toggleHighlight(C._elCurListItem,"to");break;case"div":if(YAHOO.util.Dom.hasClass(D,"yui-ac-container")){C._bOverContainer=false;return;}break;default:break;}D=D.parentNode;if(D){B=D.nodeName.toLowerCase();}}};YAHOO.widget.AutoComplete.prototype._onContainerClick=function(A,C){var D=YAHOO.util.Event.getTarget(A);var B=D.nodeName.toLowerCase();while(D&&(B!="table")){switch(B){case"body":return;case"li":C._toggleHighlight(D,"to");C._selectItem(D);return;default:break;}D=D.parentNode;if(D){B=D.nodeName.toLowerCase();}}};YAHOO.widget.AutoComplete.prototype._onContainerScroll=function(A,B){B._focus();};YAHOO.widget.AutoComplete.prototype._onContainerResize=function(A,B){B._toggleContainerHelpers(B._bContainerOpen);};YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown=function(A,B){var C=A.keyCode;if(B._nTypeAheadDelayID!=-1){clearTimeout(B._nTypeAheadDelayID);}switch(C){case 9:if(!YAHOO.env.ua.opera&&(navigator.userAgent.toLowerCase().indexOf("mac")==-1)||(YAHOO.env.ua.webkit>420)){if(B._elCurListItem){if(B.delimChar&&(B._nKeyCode!=C)){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._elCurListItem);}else{B._toggleContainer(false);}}break;case 13:if(!YAHOO.env.ua.opera&&(navigator.userAgent.toLowerCase().indexOf("mac")==-1)||(YAHOO.env.ua.webkit>420)){if(B._elCurListItem){if(B._nKeyCode!=C){if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);}}B._selectItem(B._elCurListItem);}else{B._toggleContainer(false);}}break;case 27:B._toggleContainer(false);return;case 39:B._jumpSelection();break;case 38:if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);B._moveSelection(C);}break;case 40:if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);B._moveSelection(C);}break;default:B._bItemSelected=false;B._toggleHighlight(B._elCurListItem,"from");B.textboxKeyEvent.fire(B,C);break;}if(C===18){B._enableIntervalDetection();}B._nKeyCode=C;};YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress=function(A,B){var C=A.keyCode;if(YAHOO.env.ua.opera||(navigator.userAgent.toLowerCase().indexOf("mac")!=-1)&&(YAHOO.env.ua.webkit<420)){switch(C){case 9:if(B._bContainerOpen){if(B.delimChar){YAHOO.util.Event.stopEvent(A);}if(B._elCurListItem){B._selectItem(B._elCurListItem);}else{B._toggleContainer(false);}}break;case 13:if(B._bContainerOpen){YAHOO.util.Event.stopEvent(A);if(B._elCurListItem){B._selectItem(B._elCurListItem);}else{B._toggleContainer(false);}}break;default:break;}}else{if(C==229){B._enableIntervalDetection();}}};YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp=function(A,C){var B=this.value;C._initProps();var D=A.keyCode;if(C._isIgnoreKey(D)){return;}if(C._nDelayID!=-1){clearTimeout(C._nDelayID);}C._nDelayID=setTimeout(function(){C._sendQuery(B);},(C.queryDelay*1000));};YAHOO.widget.AutoComplete.prototype._onTextboxFocus=function(A,B){if(!B._bFocused){B._elTextbox.setAttribute("autocomplete","off");B._bFocused=true;B._sInitInputValue=B._elTextbox.value;B.textboxFocusEvent.fire(B);}};YAHOO.widget.AutoComplete.prototype._onTextboxBlur=function(A,C){if(!C._bOverContainer||(C._nKeyCode==9)){if(!C._bItemSelected){var B=C._textMatchesOption();
if(!C._bContainerOpen||(C._bContainerOpen&&(B===null))){if(C.forceSelection){C._clearSelection();}else{C.unmatchedItemSelectEvent.fire(C,C._sCurQuery);}}else{if(C.forceSelection){C._selectItem(B);}}}C._clearInterval();C._bFocused=false;if(C._sInitInputValue!==C._elTextbox.value){C.textboxChangeEvent.fire(C);}C.textboxBlurEvent.fire(C);C._toggleContainer(false);}else{C._focus();}};YAHOO.widget.AutoComplete.prototype._onWindowUnload=function(A,B){if(B&&B._elTextbox&&B.allowBrowserAutocomplete){B._elTextbox.setAttribute("autocomplete","on");}};YAHOO.widget.AutoComplete.prototype.doBeforeSendQuery=function(A){return this.generateRequest(A);};YAHOO.widget.AutoComplete.prototype.getListItems=function(){var C=[],B=this._elList.childNodes;for(var A=B.length-1;A>=0;A--){C[A]=B[A];}return C;};YAHOO.widget.AutoComplete._cloneObject=function(D){if(!YAHOO.lang.isValue(D)){return D;}var F={};if(YAHOO.lang.isFunction(D)){F=D;}else{if(YAHOO.lang.isArray(D)){var E=[];for(var C=0,B=D.length;C<B;C++){E[C]=YAHOO.widget.AutoComplete._cloneObject(D[C]);}F=E;}else{if(YAHOO.lang.isObject(D)){for(var A in D){if(YAHOO.lang.hasOwnProperty(D,A)){if(YAHOO.lang.isValue(D[A])&&YAHOO.lang.isObject(D[A])||YAHOO.lang.isArray(D[A])){F[A]=YAHOO.widget.AutoComplete._cloneObject(D[A]);}else{F[A]=D[A];}}}}else{F=D;}}}return F;};YAHOO.register("autocomplete",YAHOO.widget.AutoComplete,{version:"@VERSION@",build:"@BUILD@"});