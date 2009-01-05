<html><head>
<?php
if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
} else {
    $mode = "";
}

if ($mode == "dist") {
        $ext = "html";
} else {
        $ext = "php";
}

?>



<?php include('inc/inc-alljs.php'); ?>

        <script type="text/javascript" src="js/DDMy2.js" ></script>

<script type="text/javascript" language="JavaScript">
	var dds = new Array();
	
	function dragDropInit() {
		
		// center column
		var i =0;

		dds[i]= new YAHOO.example.DDMy2("mod_93156", "center", {centerFrame: true, resizeFrame: false}) ;
		dds[i].setHandleElId("mod_93156dh");
		
		i++;

		dds[i]= new YAHOO.example.DDMy2("mod_93214", "center") ;
		dds[i].setHandleElId("mod_93214dh");
		
		i++;

		dds[i]= new YAHOO.example.DDMy2("mod_6065", "center") ;
		dds[i].setHandleElId("mod_6065dh");	
	
		i++;

		dds[i]= new YAHOO.example.DDMy2("mod_93159", "center") ;
		dds[i].setHandleElId("mod_93159dh");	
	
		i++;


		// left column
		dds[i]= new YAHOO.example.DDMy2("mod_93154", "center") ;
		dds[i].setHandleElId("mod_93154dh");	
		
		i++;

		dds[i]= new YAHOO.example.DDMy2("mod_93110", "center") ;
		dds[i].setHandleElId("mod_93110dh");	
		
		i++;

		dds[i]= new YAHOO.example.DDMy2("mod_63816", "center") ;
		dds[i].setHandleElId("mod_63816dh");	
		
		i++;
		
		
		// right column
		
		dds[i]= new YAHOO.example.DDMy2("mod_93109", "center") ;
		dds[i].setHandleElId("mod_93109dh");	
		
		i++;
		
		dds[i]= new YAHOO.example.DDMy2("mod_63822", "center") ;
		dds[i].setHandleElId("mod_63822dh");	
		
		i++;
		
		dds[i]= new YAHOO.example.DDMy2("mod_63798", "center") ;
		dds[i].setHandleElId("mod_63798dh");	
		
		i++;	
		
		dds[i]= new YAHOO.example.DDMy2("mod_logDivOuter", "center") ;
		dds[i].setHandleElId("logDivdh");	
		
		i++;
		
		
		dds[i]= new YAHOO.example.DDMy2("mod_linksDivOuter", "center") ;
		dds[i].setHandleElId("linksDivdh");	
		
		i++;
		
	}

	YAHOO.util.Event.addListener(window, "load", dragDropInit);


</script>



<style type="text/css">
body,table,tr,td,th,a,i,b{color:#666666;}
ul{margin-bottom:8px;}
html ul li{margin-left:-1.2em;padding-left:10px;list-style:none;background:url(http://us.i1.yimg.com/us.yimg.com/i/nt/gr/li/2x2/666666.gif) no-repeat 0 .5em ;}
body{font:small/122% arial;font:x-small;}
body * {line-height:122%;}
table{font-size:inherit;font:x-small;}
html>body{font:84.5%/122% arial;}
table, pre, code, select, input, font{font-size:100%;}
big{font-size:127%;}
small{font-size:92%;}
#ymypbdy{font-size:100%;}
.hb{background:#ffffff;}
.sb{background:#d2e4fc;}
.sb a,.sb a:visited,.sb a:hover{text-decoration:underline;color:#666666;}
.hf{font-family:Verdana,Geneva,sans-serif;color:#3f3f3f;font-size:92%;}
.sf,a font b{font-family:verdana;color:#666666;}
.bb{background:#ffffff url(http://us.i1.yimg.com/us.yimg.com/i/us/my/gr/stripes.gif);}
.bf{color:#ffffff;}
.nb{background:#ffffff;}
.nf{color:#ffffff;}
.bt{color:#666666;}
.tb{background:#ffffff;;margin:0;}
.ymsubh{font-size:92%;}
.hb h1{padding-top:0;margin-bottom:5px;font-size:92%;font-family:Verdana,Geneva,sans-serif;color:#3f3f3f;font-weight:bold;}
.hb h1 a,.hb h1 a:visited{font-family:Verdana,Geneva,sans-serif;text-decoration:underline;color:#3f3f3f;}
.hb h1 small {color:#3f3f3f;}
a,a b{color:#003399;}
a:visited{color:#800080;}
a.ymypcust,a.ymypcust:visited{font:bold 10px Verdana,sans-serif;color:#003399;text-decoration:none;}
.ymymd{background:#ffffff;border:1px solid #a4a4a4;}
.ymymdo{width:100%;border-bottom:3px solid #cccccc;border-right:2px solid #cccccc;border-top:0; border-left:0;margin-bottom:6px;}
small.dtxt{color:#b2b2b2;font-size:77%;}
#ymylgo,#ymyspr,#ymgret{padding-bottom:12px;}
</style>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>My Yahoo!</title>

<link rel="SHORTCUT ICON" href="http://us.i1.yimg.com/us.yimg.com/i/us/my/favicon.ico"><style type="text/css">
<!--
@import url("http://us.js1.yimg.com/us.yimg.com/clib/my/ym_a_37.css");
#ygmain{width:100%;margin:auto;border:0px solid #fff;text-align:left;}
#ymgret,.ymdate{color:#333;}
.ymhnav{font-size:85%;text-align:right;height:40px;background:#cccccc; padding-right:10px; padding-top:5px;color:#333;}
#ymgret a{color:#039;}
.ymhnav a,.ymhnav a:visited,.ymhnav a b{color:#039;}
.sbg{background:#cccccc;}
.ymplnk a,.ymplnk a:visited {font-size:.76em;color:#039;display:inline;}
.ymymhd{border-right:1px solid #d4d4d4;height:1.9em;margin:.4em .8em .3em .4em;}
.ymyhd{padding-top:4px}
.ymyfp{display:none;background:#ffffff url("http://us.i1.yimg.com/us.yimg.com/i/us/my/bn/menudocact.gif") no-repeat 7px 53%;border:1px solid #cccccc;}
.ymyfpl{color:#039;}
.ymyfpa{width:20px; background:url("http://us.i1.yimg.com/us.yimg.com/i/us/my/bn/menuarrowdown.gif") no-repeat 50% 50%;  }
-->
</style>

<script>
<!--
d=document;
function yg_Browser(){var nav=navigator; this.agt=nav.userAgent.toLowerCase(); this.major = parseInt(nav.appVersion); this.ns=(d.layers); this.dom=(d.getElementById)?1:0; this.ns4up=(this.ns && this.major >=4); this.ns6=(this.agt.indexOf("Netscape6")!=-1); this.op=(window.opera? 1:0); if(d.all)this.ie=1;else this.ie=0; this.ie4up=(this.ie && this.major >= 4); this.ie5=(d.all&&this.dom); this.gk=(typeof(nav.product)!="undefine"&&nav.product)?1:0; this.fb=(this.agt.indexOf("firebird")!=-1); this.fx=(this.agt.indexOf("firefox")!=-1); this.sf=(this.agt.indexOf("safari")!=-1); this.win=((this.agt.indexOf("win")!=-1) || (this.agt.indexOf("16bit")!=-1)); this.mac=(this.agt.indexOf("mac")!=-1); }
var oBw=new yg_Browser();
function yg_getObj(id){var i,x;d=document;if(!(x=d[id])&&d.all)x=d.all[id];
  for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][id];
  if(!x) x=document.getElementById(id);
  return x;
}
YCSP_IMGPATH="http://us.i1.yimg.com/us.yimg.com/i/us/plus/";
YIMG=new Image();
YM_HM=0;
function yg_setkey(lnk){YIMG.src=lnk;}
function ymy_css(id,c){var o=yg_getObj(id);if (o) o.className=c;}
function ym_mm(e){

    YAHOO.util.DDM.stopPropagation(e);
    YAHOO.util.DDM.preventDefault(e);

	return false;
}
function ym_rm(){return true;}
function ym_go(id){d.location=yg_getObj(id).href;}
function rs(){return false;}
function ycsp_lo() {
  this.id="ymylayout";eval(this.id+"=this");this.lo;
  this.active=this.a=this.c=0;this.target_col_empty=this.target_col_end=0;this.target_col=null; this.target_mod=null;
  this.v=this.h=this.cur_mod=this.cur_col=this.ctrl_on=this.cur_mod_id=this.cur_mod_title=-1; 
  this.get_ctrl=new Function();
}
_YCSP_LO=new ycsp_lo();
//-->
</script><!-- header version 2 --><script>
<!--
function getCk(n) {
  var i,c;
  c=' '+document.cookie+';';
  n=' '+n+'=';
  if ((i=c.indexOf(n))>=0) {
    c=c.substring(i,c.indexOf(';',i));
    return c;
  }
  return "";
}
function getSCk(n,c) {
  var i,s;
  c=c+'&';
  n=n+'=';
  if ((i=c.indexOf(n))>=0) {
    c=c.substring(i+n.length,c.indexOf('&',i));
    return c;
  }
  return "";
}
function rmvTk() {
  u=document.location+"";fu="";
  if(-1!=u.indexOf(".tk")) {
      var a=u.split("&");
      for (i=0;i<a.length;i++) {
          if (a[i].indexOf(".tk")==-1 && a[i].indexOf(".td")==-1 && a[i].indexOf(".svr")==-1) { fu+=a[i]; }
      }
  }else{fu=u;}
  return fu;

}
function checkRefresh(o,u,m1)
{
  var l,nu,r,tk;
  l=getSCk("l",getCk("Y"));
  if (o != l) {
    document.writeln('<META HTTP-EQUIV="expires" CONTENT="Thu, 05 Jan 1995 22:00:00 GMT">');
    document.writeln('<META HTTP-EQUIV="Pragma" CONTENT="no-cache">');
    r=(new Date()).getTime();
    tk="&.tk=cc28867042f5a298359b48834f0ed456&.svr=1118177637000&.r="+r+"&.td="+(r-1118177637000);
    nu=rmvTk();
    if (-1!=nu.indexOf(".rand=")) {
      nu=u;
    } else {
      if (-1==nu.indexOf("?")) {
        nu=document.location+"?.rand="+r;
      } else {
        nu=document.location+"&.rand="+r;
      }
    }
    
    window.location.href=nu+tk;
  } else {
    var m2 = getSCk("mt", getCk("U")) ;
    if (m1 && m2 && m1 != m2) {
        document.writeln('<META HTTP-EQUIV="expires" CONTENT="Thu, 05 Jan 1995 22:00:00 GMT">');
        document.writeln('<META HTTP-EQUIV="Pragma" CONTENT="no-cache">');
        r=(new Date()).getTime();
        tk="&.tk=cc28867042f5a298359b48834f0ed456&.svr=1118177637000&.td="+(r-1118177637000);
        nu=rmvTk();
        if (-1!=nu.indexOf(".mt=")) {
            var ar1 = nu.split(".mt=",2); 
            var ar2 = ar1[1].split("&",2);
            if (m1==ar2[0]) {
                nu=u;
                                return false;
	        } else {
	            nu = ar1[0]+ ".mt=" + m1;
	            if (ar2[1]) { nu+="&"+ar2[1]; }
            }
        } else {
            if (-1==nu.indexOf("?")) {
                nu=document.location+"?.mt="+m1;
            } else {
                nu=document.location+"&.mt="+m1;
            }
        }
        window.location.href=nu+tk;
    }
  }
}
// checkRefresh("kdh7oj7c/o", "http://my.yahoo.com/refreshcache.html?.done=http%3a%2f%2fmy.yahoo.com%2findex.html", "K8ALf52MhYrXqhY4Vs035th3fmutoqAsbXxWpw--");
//-->
</script><style>
#vstb #tbCtr #t1 { width: 4.1em; }
#vstb #tbCtr #t2 { width: 5.3em; }
#vstb #tbCtr #t3 { width: 4.8em; }
#vstb #tbCtr #t4 { width: 4.6em; }
#vstb #tbCtr #t5 { width: 4.6em; }
#vstb #tbCtr #t6 { width: 6.5em; }
#mhh2 {background:#d2e4fc; border:1px solid #a4a4a4;}
.vstbgc {background:#ffffff;border-bottom:1px solid #a4a4a4;}
#vstb #tbCtr .sel em {display:block;width:100%;height:11px;background:transparent url(http://us.i1.yimg.com/us.yimg.com/i/my/us/gp/arrow_7.gif) no-repeat 49% 1px;position:relative;top:-6px;z-index:50;}
#vstb a {color:#003399;cursor:pointer;cursor: move;display:block;padding:3px 9px;background:transparent url(http://us.i1.yimg.com/us.yimg.com/i/us/plus/csp/el/vs/my/tab_sep_2.gif) no-repeat 100% 50%;position:relative;z-index:2;}
#vsfm label {color:#666666; font-size:110%;}
#vsfm input#fp{width:21.3em; margin-left:11px;margin-right:4px;} 
html>body #vsfm input#fp{width:21.5em; margin-left:5px;margin-right:9px;} 
#vstb #ifo {color:#666666;}
.vstbgc a, .vstbgc a:active, .vstbgc a:visited {color:#6E6E6E;}
.sfri {top:0; ! }
#vsfm div {margin:1.4em 0 0 10px;padding-top:.2em;position:absolute;top:.5em;left:.4em;}/*\*/
#vsfm div {padding:0;position:static;clear:both;margin:-1em 0 .4em 30px;}/**/
html>body #vsfm {padding:3px 0 0 0;}
html>body #vsfm div {padding:0;top:-.2em;left:0;float:left;margin:-.7em 0 0 40px;}
</style><style>
body{background:#ffffff url(http://us.i1.yimg.com/us.yimg.com/i/us/my/gr/stripes.gif);}
</style><style>
#ymypbdy, #ymycpy{padding-left:8px;padding-right:8px;}
</style><style type="text/css">
#mod_93110 .ymmb{padding-bottom:0;}
.ymihc{padding:0 7px 0 8px;}
.ymihc img{float:left;margin:3px 6px 0 0;border:none;}
.ymihc div{float:left;width:125px;margin:0 0 4px 0;}
.ymihc div h3{font-size:92%;font-weight:bold;margin:0 0 2px 0;}
.ymihc div a{font-size:85%;}
.ymihc div p, .ymifc p{margin:0;font-size:92%;}
body .ymifc h4, body .ymihc h4{clear:both;font:normal 65% verdana;padding:0;margin:0 0 2px 0;background-color:transparent;}
.ymifc:after {content:".";display:block;font-size:0px;line-height:0;height:0;clear:both;visibility:hidden;}/* \*/
* html .ymifc {height: 1%;}/* */
.ymifc a{color:#666666;font-size:85%;}
.ymifc img{float:left;margin:3px 6px 0 0;border:none;}
.ymifc{display:inline-table;padding:3px 7px 5px 8px;margin:3px 0 0 0;background-color:#d2e4fc;color:#666666;}
html .ymihc ul {margin:0 0 0 12px;padding-left:5px;}
</style><link href="my_files/ym_bot_a_37.css" rel="stylesheet" id="botcss" type="text/css"></head>







<noscript>
<style>.ymynoedit{display:none;}</style>
</noscript>





<body leftmargin="0" marginwidth="0">


<div id="ygmain">
<table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td>
<div class="tb">





<div id="ygma" align="center">
<table cellpadding="0" cellspacing="0">
<tbody><tr>
<td id="ymylgo" class="ymyhd" valign="top"><a href="http://my.yahoo.com/"><img src="my_files/myma_5l.gif" id="ygmalogo" alt="My Yahoo!" border="0" height="30" width="167"></a>
</td>
<td id="ymyspr" valign="top"><div class="ymymhd"></div></td>
<td id="ymgret" class="ymyhd" valign="top" width="100%"><p>Welcome
<br>[ <a href="http://login.yahoo.com/config/login?logout=1&amp;&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my">Sign Out</a>, 
<a href="http://us.rd.yahoo.com/my/acct/*http://e.my.yahoo.com/config/eval_profile?&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html">My Account</a> ]</p></td>

<td class="ymplnk" align="right">
<table class="ymticn" cellpadding="0" cellspacing="0">
<tbody><tr>
<td class="ymurecon" align="center"><a href="http://us.rd.yahoo.com/my/prop/fp;_ylt=AkK9UyHx245yuElLV7k7GagE1vAI/*/*http://www.yahoo.com/"><img src="my_files/ylinksy_l.gif" alt="Yahoo!" border="0" height="38" width="35"></a></td>
<td class="ymicon" align="center"><a href="http://us.rd.yahoo.com/my/prop/mail;_ylt=AsW.OVunlYDbBSOYrJb_f8kE1vAI/*/*http://mail.yahoo.com/"><img src="my_files/ylinksm_l.gif" alt="Check mail" border="0" height="38" width="35"></a></td>
<td class="ymicon" align="center"><a href="http://us.rd.yahoo.com/my/prop/more;_ylt=AsFcvCy2UZ0ZYWLcLuVJzwEE1vAI/*/*http://docs.yahoo.com/docs/family/more/"><img src="my_files/ylinksr_l.gif" alt="See more Yahoo!" border="0" height="38" width="37"></a></td>
<td id="ymhelp"><a href="http://us.rd.yahoo.com/my/prop/help;_ylt=AqU6_lADSswNYLmF0.AYoF0E1vAI/*/*http://help.yahoo.com/help/my/myyahoo"><img src="my_files/ylinksh_l.gif" alt="My Yahoo! Help" border="0" height="14" width="35"></a></td>
</tr>
<tr>
<td align="center"><a href="http://us.rd.yahoo.com/my/prop/fp;_ylt=AkK9UyHx245yuElLV7k7GagE1vAI/*/*http://www.yahoo.com/">Yahoo!</a></td>
<td align="center"><a href="http://us.rd.yahoo.com/my/prop/mail;_ylt=AsW.OVunlYDbBSOYrJb_f8kE1vAI/*/*http://mail.yahoo.com/">Mail</a></td>
<td align="center"><a href="http://us.rd.yahoo.com/my/prop/more;_ylt=AsFcvCy2UZ0ZYWLcLuVJzwEE1vAI/*/*http://docs.yahoo.com/docs/family/more/">More&nbsp;Yahoo!</a></td>
<td>&nbsp;</td>
</tr>
</tbody></table>
</td>

</tr>
</tbody></table>
</div>




<table class="ymhtbl" style="margin-top: 5px;" cellpadding="0" cellspacing="0">
<tbody><tr>
<td><div style="width: 600px;">&nbsp;</div></td>
<td class="ymdate" nowrap="nowrap">
Tue, Jun  7, 01:53 pm</td>
</tr>
</tbody></table>


<div align="left">
<div align="left"></div>
</div>
</div> </td></tr></tbody></table>

<div class="bb" style="border-top: 1px none;">
<div id="ymyptb" style="padding: 5px 10px 6px 7px;">
<table cellpadding="0" cellspacing="0">
<tbody><tr>
<td width="95%">
<small><nobr>
<span class="ymyadd" onclick="ym_go('tadd')">&nbsp;&nbsp;&nbsp;&nbsp;</span><a href="http://us.rd.yahoo.com/my/content/z;_ylt=Ak9XisTp1Psec9EKQgLm0s0E1vAI/*/*http://e.my.yahoo.com/config/cstore?.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" id="tadd" class="ymypcust">Add Content</a>&nbsp;
<span class="ymylay" onclick="ym_go('tlay')">&nbsp;&nbsp;&nbsp;&nbsp;</span><a href="http://us.rd.yahoo.com/my/layout/fp;_ylt=AmgiWv21SKLWOPHJB0h9aI8E1vAI/*/*http://e.my.yahoo.com/config/set_cslayout?.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" id="tlay" class="ymypcust">Change Layout</a>&nbsp;
<span id="ymcl" class="ymyclr" onclick="ym_go('tclr')">&nbsp;&nbsp;&nbsp;&nbsp;</span><a href="http://us.rd.yahoo.com/my/colors/fp;_ylt=AjlhwOPPaqvUS7.7_MywKLwE1vAI/*/*http://e.my.yahoo.com/config/set_cstheme?.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" id="tclr" class="ymypcust">Change Colors</a>



        Mode: 
        <select onchange="YAHOO.util.DDM.mode = this.selectedIndex">
          <option value="0" selected>Point</point>
          <option value="1">Intersect</point>
        </select>

</nobr></small>
</td>
<td align="right" nowrap="nowrap">
<img src="my_files/menudocact.gif" height="12" width="10"> <span style="font-family: Verdana,sans-serif; font-style: normal; font-variant: normal; font-weight: bold; font-size: 10px; line-height: normal; font-size-adjust: none; font-stretch: ;">My Front Page | </span><a class="ymypcust" href="http://us.rd.yahoo.com/my/add_page/z/*http://e.my.yahoo.com/config/set_csbuild?.t=add">Add New Page</a></td>
</tr>
</tbody></table>
</div>

<div id="ymypbdy">
<!-- header version 2 -->





<script>_YCSP_LO.lo="NWN";</script><table align="left" border="0" cellpadding="0" cellspacing="0" width="1%"><tbody><tr><td align="center" valign="top">

<div id="ycsp_N0" class="ycspncol">


<div id="mod_93154" class="ymymdo" style="position:relative">

<a name="93154NM"></a><div class="ymymd"><div id="93154_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=93154&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93154',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93154MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_93154dh" style="cursor: move">Best Fare Tracker</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_faretracker?.v=2&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93154',this.href,'Best Fare Tracker');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93154" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=AmZk29n1jpIkHMMfW89f9ggE1vAI?.delete=93154&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93154', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93154" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">

<tbody><tr><td colspan="3" bgcolor="#d2e4fc"><table border="0" cellpadding="2" cellspacing="0" width="100%"><tbody><tr><td align="center"><a href="http://us.ard.yahoo.com/SIG=12djhq80i/M=335330.6010469.7500498.1887330/D=my/S=150001156:T10/_ylt=AmMgPc_8B0yw9v6puJaZ4CgE1vAI/Y=YAHOO/EXP=1118184837/A=2728345/R=0/*http://us.rd.yahoo.com/_ylc=X3oDMTFrZTZiaHBlBF9TAzk2NzYyNTgzBF9zAzg2Mjc2MTcEcG9zAzEEc2VjA3QxMARzbGsDcHJvbW8taG90ZWw-/SIG=117tt5k8b/**http%3a//travel.yahoo.com/topreviews"><img src="my_files/051205_yahootravel_t10_hotel_randr.gif" alt="" border="0" height="33" width="200"></a><script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13t0v25bu%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d939525661%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=138bb8cc8%2fN%3dIjSlAtiIrqc-%2fC%3d335330.6010469.7500498.1887330%2fD%3dT10%2fB%3d2728345');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=143nebfqq%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d1462683693%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=138bb8cc8%2fN%3dIjSlAtiIrqc-%2fC%3d335330.6010469.7500498.1887330%2fD%3dT10%2fB%3d2728345"></noscript></td></tr></tbody></table></td></tr><tr><td colspan="3" bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1">Depart: San Francisco, CA</font></b></td></tr><tr><td><small>Rome, Italy</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SFO/FCO/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Francisco,%20CA&amp;.an=Rome,%20Italy&amp;.intl=us&amp;.pf=739.00&amp;.dc=SFO&amp;.ac=FCO&amp;.service=YHOE&amp;source=YF">$739.00</a></small></td></tr>
<tr><td><small>London, United Kingdom - all</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SFO/LON/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Francisco,%20CA&amp;.an=London,%20United%20Kingdom%20-%20all&amp;.intl=us&amp;.pf=380.00&amp;.dc=SFO&amp;.ac=LON&amp;.service=YHOE&amp;source=YF">$380.00</a></small></td></tr>
<tr><td><small>Paris, France - all</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SFO/PAR/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Francisco,%20CA&amp;.an=Paris,%20France%20-%20all&amp;.intl=us&amp;.pf=586.00&amp;.dc=SFO&amp;.ac=PAR&amp;.service=YHOE&amp;source=YF">$586.00</a></small></td></tr>
<tr><td colspan="3" bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1">Depart: San Jose, CA</font></b></td></tr><tr><td><small>Cancun, Mexico</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/CUN/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Cancun,%20Mexico&amp;.intl=us&amp;.pf=349.00&amp;.dc=SJC&amp;.ac=CUN&amp;.service=YHOE&amp;source=YF">$349.00</a></small></td></tr>
<tr><td><small>Rome, Italy</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/FCO/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Rome,%20Italy&amp;.intl=us&amp;.pf=420.00&amp;.dc=SJC&amp;.ac=FCO&amp;.service=YHOE&amp;source=YF">$420.00</a></small></td></tr>
<tr><td><small>Lihue, HI</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/LIH/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Lihue,%20HI&amp;.intl=us&amp;.pf=503.00&amp;.dc=SJC&amp;.ac=LIH&amp;.service=YHOE&amp;source=YF">$503.00</a></small></td></tr>
<tr><td><small>Maui, HI</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/OGG/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Maui,%20HI&amp;.intl=us&amp;.pf=481.00&amp;.dc=SJC&amp;.ac=OGG&amp;.service=YHOE&amp;source=YF">$481.00</a></small></td></tr>
<tr><td><small>Paris, France - all</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/PAR/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Paris,%20France%20-%20all&amp;.intl=us&amp;.pf=273.00&amp;.dc=SJC&amp;.ac=PAR&amp;.service=YHOE&amp;source=YF">$273.00</a></small></td></tr>
<tr><td><small>Phoenix, AZ</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/PHX/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Phoenix,%20AZ&amp;.intl=us&amp;.pf=143.00&amp;.dc=SJC&amp;.ac=PHX&amp;.service=YHOE&amp;source=YF">$143.00</a></small></td></tr>
<tr><td><small>Orange County, CA</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/SNA/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Orange%20County,%20CA&amp;.intl=us&amp;.pf=103.00&amp;.dc=SJC&amp;.ac=SNA&amp;.service=YHOE&amp;source=YF">$103.00</a></small></td></tr>
<tr><td><small>Tucson, AZ</small></td><td colspan="2" align="right" nowrap="nowrap"><small><a href="http://us.rd.yahoo.com/O=1/travel/clks/deals/bf/my/SJC/TUS/I=travel_YY/*http://search.travel.yahoo.com/bin/search/bffjp?.dn=San%20Jose,%20CA&amp;.an=Tucson,%20AZ&amp;.intl=us&amp;.pf=253.00&amp;.dc=SJC&amp;.ac=TUS&amp;.service=YHOE&amp;source=YF">$253.00</a></small></td></tr>
<tr><td colspan="3" bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1">Find other Best Fares: </font></b></td></tr><tr><td colspan="3" align="center"><form action="http://edit.travel.yahoo.com/config/ytravel" method="get">
<table cellpadding="0" cellspacing="0" width="100%"><tbody><tr valign="top"><td valign="middle"><small><label for="ldep">From:</label></small></td><td><input id="ldep" name="dep_arp_cd_1" value="" size="12" maxlength="20" type="text"></td></tr>
<tr valign="top"> <td valign="middle"><small><label for="larr">To:</label></small></td><td><input id="larr" name="arr_arp_cd_1" value="" size="12" maxlength="20" type="text"></td></tr>
<tr valign="top"><td valign="middle"><small><label for="ladult_pax_cnt">Adults:</label>&nbsp;</small></td><td><select id="ladult_pax_cnt" name="adult_pax_cnt"><option selected="selected">1</option><option>2</option><option>3</option><option>4</option></select>&nbsp;<input name=".quickfinish" value="Search" type="submit"><input name="resform" value="YahooFlightsR" type="hidden"><input name=".done" value="http://dps1.travelocity.com/airgcobrand.ctl?Service=YHOE&amp;smls=Y" type="hidden"><input name=".intl" value="us" type="hidden"><input name=".src" value="trv" type="hidden"><input name="chld_pax_cnt" value="0" type="hidden"><input name="senior_pax_cnt" value="0" type="hidden"><input name="trip_option" value="roundtrp" type="hidden"><input name="num_count" value="9" type="hidden"><input name="dep_tm_srch_1" value="deptime" type="hidden"><input name="dep_tm_1" value="5:00am" type="hidden"><input name="dep_tm_srch_2" value="deptime" type="hidden"><input name="dep_tm_2" value="5:00am" type="hidden"><input name="cls_svc" value="YR" type="hidden"><input name="inp_flt_opt" value="all" type="hidden"><input name="pref_aln" value="all" type="hidden"><input name="aln_cd_1" value="" type="hidden"><input name="aln_cd_2" value="" type="hidden"><input name="aln_cd_3" value="" type="hidden"><input name="module" value="tripsrch" type="hidden"><input name="tcycgi" value="airgcobrand.ctl" type="hidden"><input name="smls" value="Y" type="hidden"><input name="service" value="YHOE" type="hidden"></td></tr></tbody></table><hr size="1">
</form></td></tr><tr><td colspan="3" align="center"><p><small><a href="http://travel.yahoo.com/disclaimer.php#bestfares">Disclaimer</a><br>* Some taxes and fees additional.<br><a href="http://travel.yahoo.com/disclaimer.php">Learn More</a></small></p></td></tr></tbody></table>
</div></div></div>


<div id="mod_93110" class="ymymdo" style="position:relative"><a name="93110NM"></a><div class="ymymd"><div id="93110_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=93110&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93110',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93110MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_93110dh" style="cursor: move">Inside My Yahoo!</h1>


</td><td class="ymymdedit hb" align="right" valign="top"><a href="#" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93110',this.href,'Inside My Yahoo!');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93110" class="ymynoedit" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=AvfazSJyJ5UjDKEElxgyAjoE1vAI?.delete=93110&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93110', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93110" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td style="margin: 0pt; padding: 0pt;">

<div style="display: block;" class="ymmb">  
<!-- fdigest='62aeab936aaa21f777044dd53c63631c' -->
<div class="ymihc">
<a href="http://us.rd.yahoo.com/my/mymod/imy/head/*http://e.my.yahoo.com/config/cstore?.opt=content&amp;.sid=3983&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my"><img src="my_files/imy_head_1.jfif" alt="image" border="0" height="50" width="50"></a>
<div>
<h3>New CD Releases: Rock and Pop</h3>
<p>Tuesday is new release day.  Keep an eye on the new titles coming out each week.</p>
<a href="http://us.rd.yahoo.com/my/mymod/imy/head/*http://e.my.yahoo.com/config/cstore?.opt=content&amp;.sid=3983&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" title="New CD Releases: Rock and Pop"><img src="my_files/cust_addcontent.gif" alt="Add" height="11" width="13"></a>  <a href="http://us.rd.yahoo.com/my/mymod/imy/head/*http://e.my.yahoo.com/config/cstore?.opt=content&amp;.sid=3983&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" title="New CD Releases: Rock and Pop">Add to My Yahoo!</a> 
</div> 
<h4>Related Content for your page: </h4>
<ul>
<li><a href="http://us.rd.yahoo.com/my/mymod/imy/rel1/*http://e.my.yahoo.com/config/cstore?.opt=topic&amp;.node=938&amp;.src=my&amp;.page=p1&amp;.done=http%3A%2F%2Fmy.yahoo.com%2Findex.html&amp;.bcrumb=1,922">Music</a></li>
</ul>
</div>
<div class="ymifc">
  <h4>Add Sponsored Sources: </h4>
  <a href="http://us.ard.yahoo.com/SIG=12cff6k2h/M=335328.6492605.7460611.1498443/D=my/S=150001156:M1/_ylt=AlOQfvZMQ5RKL2HL95SPcAME1vAI/Y=YAHOO/EXP=1118184837/A=2635985/R=0/SIG=121dnoqgc/*http://add.my.yahoo.com/rss?url=http://lifehacker.com/index.xml"><img src="my_files/cust_addcontent.gif" alt="Ad" height="11" width="13"></a> <a class="ymasl" href="http://us.ard.yahoo.com/SIG=12cff6k2h/M=335328.6492605.7460611.1498443/D=my/S=150001156:M1/_ylt=AlOQfvZMQ5RKL2HL95SPcAME1vAI/Y=YAHOO/EXP=1118184837/A=2635985/R=1/SIG=121dnoqgc/*http://add.my.yahoo.com/rss?url=http://lifehacker.com/index.xml">LifeHacker - software blog</a><script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13tgvb6hd%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d572206145%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=137hielbh%2fN%3dIzSlAtiIrqc-%2fC%3d335328.6492605.7460611.1498443%2fD%3dM1%2fB%3d2635985');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=1438utmpg%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d2681609472%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=137hielbh%2fN%3dIzSlAtiIrqc-%2fC%3d335328.6492605.7460611.1498443%2fD%3dM1%2fB%3d2635985"></noscript></div></div></td></tr></tbody></table>

</div></div></div>


<div id="mod_63816" class="ymymdo" style="position:relative"><a name="63816NM"></a><div class="ymymd"><div id="63816_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=63816&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('63816',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="63816MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_63816dh" style="cursor: move">Message Center</h1>


</td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/edit_hello?.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('63816',this.href,'Message Center');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_63816" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=Av01Bx6rUsf.Ba1bounBqFsE1vAI?.delete=63816&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('63816', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_63816" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td><small><a href="http://us.lrd.yahoo.com/_ylc=X3oDMTBubmNvZDI4BF9TAzE1MDAwMTE1NgRzdWlkAzYzODE2/SIG=11i3eutqd/**http%3a//mail.yahoo.com/%3f.refer=my%26.intl=us">Check Email</a>&nbsp;&nbsp;</small></td></tr><tr><td><small><a href="http://us.lrd.yahoo.com/_ylc=X3oDMTBubmNvZDI4BF9TAzE1MDAwMTE1NgRzdWlkAzYzODE2/SIG=112qdi5pn/**http%3a//calendar.yahoo.com/%3f">Check Calendar</a>&nbsp;&nbsp;</small><font color="red" size="-1">&nbsp;</font></td></tr></tbody></table>
</div></div></div>


<div id="mod_63798" class="ymymdo" style="position:relative "><a name="63798NM"></a><div class="ymymd"><div id="63798_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=63798&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('63798',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="63798MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_63798dh" style="cursor: move">City Guides</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_csmodule?.sid=63798&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('63798',this.href,'City Guides');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_63798" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=Ak5GiQ7P3tMTakIGug3QTfoE1vAI?.delete=63798&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('63798', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_63798" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td bgcolor="#d2e4fc"><font color="#666666" face="verdana" size="-1"><b>Silicon Valley, CA</b></font></td></tr>
<tr><td>
<table><tbody><tr><td><center><href ="http://us.rd.yahoo.com/my/local/img//SIG=15e8hjiod/*http://siliconvalley.citysearch.com/change/?ref_uri=/search&amp;topic_id=1214&amp;context=restaurants_bars&amp;pseudo_constrain=sec&amp;started=1&amp;brand=yahoo&amp;cslink=yahoo-siliconvalley_1_0"><img src="my_files/65632p1.jfif" border="0" height="85" width="130">
<br>
<a alt="caption" href="http://us.rd.yahoo.com/my/local/capt//SIG=15e8hjiod/*http://siliconvalley.citysearch.com/change/?ref_uri=/search&amp;topic_id=1214&amp;context=restaurants_bars&amp;pseudo_constrain=sec&amp;started=1&amp;brand=yahoo&amp;cslink=yahoo-siliconvalley_1_0"><font face="arial"><b>Unwind at a neighborhood bar</b></font></a></href></center></td></tr>
<tr><td><table cellpadding="2" cellspacing="0" width="100%"><tbody><tr><td>•</td><td><small><a alt="mainstory1" href="http://us.rd.yahoo.com/my/local/mainstory1/SIG=16sumvp75/*http://siliconvalley.citysearch.com/change/?ref_uri=/search&amp;type=dgrid&amp;context=spa_beauty&amp;gcats=200&amp;dlink=1&amp;pseudo_constrain=200&amp;started=1&amp;cslink=cs_spa_beauty_finder&amp;cats=374&amp;brand=yahoo&amp;cslink=yahoo-siliconvalley_2_0">Find a health club</a></small></td></tr>
<tr><td>•</td><td><small><a alt="mainstory2" href="http://us.rd.yahoo.com/my/local/mainstory2/SIG=15e1pl57l/*http://siliconvalley.citysearch.com/change/?ref_uri=/search&amp;topic_id=1293&amp;context=restaurants_bars&amp;pseudo_constrain=sec&amp;started=1&amp;brand=yahoo&amp;cslink=yahoo-siliconvalley_2_1">Feed that pizza craving</a></small></td></tr>
<tr><td>•</td><td><small><a alt="mainstory3" href="http://us.rd.yahoo.com/my/local/mainstory3/SIG=16e185152/*http://siliconvalley.citysearch.com/change/?ref_uri=/search&amp;type=dgrid&amp;context=shopping&amp;gcats=110&amp;dlink=1&amp;pseudo_constrain=110&amp;cslink=cs_shopping_finder&amp;cats=247&amp;brand=yahoo&amp;cslink=yahoo-siliconvalley_2_2">Update your wardrobe</a></small></td></tr>
</tbody></table></td></tr></tbody></table>
</td></tr>
<tr><td align="right"><small><a href="http://us.rd.yahoo.com/my/local/morerev/*http://local.yahoo.com/?location_state=CA&amp;location_city=Silicon+Valley"><b>More reviews and events</b></a></small></td></tr>
<tr><td>
<table border="1" cellpadding="1" cellspacing="0" width="100%">
<tbody><tr><td colspan="2"><small><font face="arial"><b>Event&nbsp;Calendar</b></font></small></td></tr>
<tr><td><small><font face="arial"><a alt="Today" href="http://us.rd.yahoo.com/my/local/today/SIG=14ue5psa3/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11+13+14+15+16+17+25&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zh">Today</a> is Jun 7</font></small></td>
<td align="right"><small><font face="arial"><a href="http://us.rd.yahoo.com/my/local/allevents/SIG=18ihlu8r2/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11+13+14+15+16+17+25&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zh+9zi+9zj+9zk+9zl+9zm+9zn+9zo+9zp+9zq+9zr+9zs+9zt+9zu+9zv+9zw+9zx+9zy+9zz+a00+a01+a02+a03+a04+a05+a06+a07+a08+a09+a0a">All&nbsp;Events</a></font></small></td></tr>
<tr><td colspan="2"><table cellpadding="1" width="100%"><tbody><tr align="center" bgcolor="#e6eef5">
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day2/SIG=15afuptgh/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zi">Wed<br>8</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day3/SIG=15anj6239/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zj">Thu<br>9</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day4/SIG=15abv9thh/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zk">Fri<br>10</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day5/SIG=15ae7qcn3/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zl">Sat<br>11</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day6/SIG=15ac2rkji/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zm">Sun<br>12</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day7/SIG=15aimstgg/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zn">Mon<br>13</a></font></td>
<td width="14%"><font face="arial" size="-2"><a href="http://us.rd.yahoo.com/my/local/day8/SIG=15a5a5782/*http://siliconvalley.citysearch.com/change?ref_uri=/search&amp;type=evloc&amp;flavor_id=11%2013%2014%2015%2016%2017%2025&amp;context=generic&amp;histoindex_left=rdc&amp;brand=yahoo&amp;rdc=9zo">Tue<br>14</a></font></td>
</tr></tbody></table>
</td></tr></tbody></table>
<hr><table border="0" cellpadding="4" cellspacing="0" width="100%">
<tbody><tr><td nowrap="nowrap" width="1%"><b><small><font face="arial" size="-1">Find another City, State or Zip: </font></small></b></td></tr>
<form action="http://us.rd.yahoo.com/my/local/find/*http://cityguides.local.yahoo.com/golocation"></form>
<tr><td><b><small><font face="arial" size="-1"><b><input name="csz" type="text"><input value="Find" name="submit22" type="submit"></b></font></small></b></td>
 </tr> </tbody></table>
</td></tr></tbody></table>

</div></div></div>


<br>
<div style="width: 100%; text-align: center;"><span class="ymaddb" onclick="ym_go('tadd')">&nbsp;&nbsp;&nbsp;</span><small><a href="http://us.rd.yahoo.com/my/content/z/col/*http://e.my.yahoo.com/config/cstore?.page=p1" class="ymypcust">Add Content</a></small></div></div><hr style="visibility: hidden;" class="bf" noshade="noshade" size="1" width="204"></td>
<td nowrap="nowrap" width="10"><spacer type="block" height="1" width="10"></td>
</tr></tbody></table>
<table border="0" cellpadding="2" cellspacing="0"><tbody><tr><td valign="top">

<div id="ycsp_W" class="ycspcol">



<div id="mod_93156" class="ymymdo" style="position:relative">



<a name="93156NM"></a><div class="ymymd"><div id="93156_bx" ><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%">
<a href="http://e.my.yahoo.com/config/set_module_state?.module=93156&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93156',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93156MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_93156dh" style="cursor: move">Last-Minute Weekend Getaways</h1>


</td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_getawaytracker?.v=2&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93156',this.href,'Last-Minute Weekend Getaways');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93156" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=AnQw5IXSZmtMVTE0utxrFZIE1vAI?.delete=93156&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93156', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93156" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1"> Price Range: $0 - $250</font></b></td><td align="right" bgcolor="#d2e4fc" nowrap="nowrap"><i><font color="#666666" face="verdana" size="-2"> Jun 7 1:50pm PT</font></i></td></tr><tr><td colspan="2" align="left"><table><tbody><tr><td align="center" valign="top" width="1%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b7aa0q9/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5025887"><img src="my_files/package_5025887_47735_thumb.jfif" border="0" height="66" width="103"></a></td><td colspan="2" valign="top" width="99%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b7aa0q9/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5025887">Dallas, TX: Room &amp; Car -- Big City and Big Tunes (Flight Not Included)</a><font size="-1"><br><b>Departing From:</b> San Francisco<br><b>Departure Dates:</b> Thu. Jun 9; Fri. Jun 10; Sat. Jun 11; Thu. Jun 16; Fri. Jun 17; Sat. Jun 18<br><b>Includes:</b> 2-5 nights, Rental Car Reservations, Hotel Reservations<br><b>Price:</b> from <a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b7aa0q9/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5025887">$64 per person</a></font></td></tr></tbody></table></td></tr><tr><td bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1"> Price Range: $251 - $500</font></b></td><td align="right" bgcolor="#d2e4fc" nowrap="nowrap"><i><font color="#666666" face="verdana" size="-2"> Jun 7 1:50pm PT</font></i></td></tr><tr><td colspan="2" align="left"><table><tbody><tr><td align="center" valign="top" width="1%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bi2hggb/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036125"><img src="my_files/package_5036125_88057_thumb.jfif" border="0" height="66" width="103"></a></td><td colspan="2" valign="top" width="99%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bi2hggb/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036125">San Diego, CA: Lego My Sandy Eggo</a><font size="-1"><br><b>Departing From:</b> San Francisco<br><b>Departure Dates:</b> Thu. Jun 9; Fri. Jun 10; Fri. Jun 17<br><b>Includes:</b> 2-5 nights, Round-trip airfare, transfers, Hotel Reservations<br><b>Price:</b> from <a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bi2hggb/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036125">$251 per person</a></font></td></tr></tbody></table></td></tr><tr><td bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1"> Price Range: $501 - $750</font></b></td><td align="right" bgcolor="#d2e4fc" nowrap="nowrap"><i><font color="#666666" face="verdana" size="-2"> Jun 7 1:50pm PT</font></i></td></tr><tr><td colspan="2" align="left"><table><tbody><tr><td align="center" valign="top" width="1%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bt8459m/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036865"><img src="my_files/package_5036865_92867_thumb.jfif" border="0" height="66" width="103"></a></td><td colspan="2" valign="top" width="99%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bt8459m/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036865">New York, NY: Cultural Capital of the World</a><font size="-1"><br><b>Departing From:</b> San Francisco<br><b>Departure Dates:</b> Thu. Jun 9; Sat. Jun 11; Wed. Jun 15; Thu. Jun 16<br><b>Includes:</b> 2-7 nights, Round-trip airfare, transfers, Hotel Reservations<br><b>Price:</b> from <a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13bt8459m/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5036865">$501 per person</a></font></td></tr></tbody></table></td></tr><tr><td bgcolor="#d2e4fc"><b><font color="#666666" face="verdana" size="-1"> Price Range: over $750</font></b></td><td align="right" bgcolor="#d2e4fc" nowrap="nowrap"><i><font color="#666666" face="verdana" size="-2"> Jun 7 1:50pm PT</font></i></td></tr><tr><td colspan="2" align="left"><table><tbody><tr><td align="center" valign="top" width="1%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b71i0up/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5018925"><img src="my_files/package_5018925_70119_thumb.jfif" border="0" height="66" width="103"></a></td><td colspan="2" valign="top" width="99%"><a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b71i0up/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5018925">Guadalajara, Mexico: Birthplace of Mexican Tradition</a><font size="-1"><br><b>Departing From:</b> San Francisco<br><b>Departure Dates:</b> Thu. Jun 9; Thu. Jun 16<br><b>Includes:</b> 2-7 nights, Round-trip airfare, transfers, Hotel Reservations<br><b>Price:</b> from <a href="http://us.rd.yahoo.com/travel/my/getaway/0//O=1/i=travel_yz/SIG=13b71i0up/*http%3A//yahootravel.lmdeals.com/affiliate/7722/detail.html?in_origination_key=362&amp;in_package_key=5018925">$751 per person</a></font></td></tr></tbody></table></td></tr></tbody></table>
</div></div></div>



<div id="mod_93214" class="ymymdo" style="position:relative">


<a name="93214NM"></a><div class="ymymd"><div id="93214_bx" ><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=93214&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93214',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93214MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">


<h1 id="mod_93214dh" style="cursor: move">Lead Photo</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="#" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93214',this.href,'Lead Photo');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93214" class="ymynoedit" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=Au4pcOkNXIW4.QFJErS.aB4E1vAI?.delete=93214&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93214', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93214" style="display: block;"><table border="0" width="100%"><tbody><tr><td><a href="http://us.rd.yahoo.com//mymod/ldpht/pht/*http://story.news.yahoo.com/news?tmpl=story&amp;u=/050607/photos_ts/mdf579032"><img src="my_files/amdf579032.jfif" alt="Reuters Photo" align="left" border="1" height="95" hspace="5" vspace="5" width="130"></a><a href="http://us.rd.yahoo.com//mymod/ldpht/sty/*http://story.news.yahoo.com/news?tmpl=story&amp;cid=578&amp;u=/nm/20050607/ts_nm/bush_blair_dc_10"><b>Bush, Blair meet at White House, differ on Africa</b></a><br><font size="-1">U.S.


President George W. Bush (R) meets with British Prime Minister Tony
Blair in the Oval Office of the White House June 7, 2005. The two
leaders, both faced with skepticism at home over their handling of the
Iraq war, met for their first talks since Blair emerged from elections
a month ago with a third term but weakened politically. (Kevin
Lamarque/Reuters)
</font>
</td></tr></tbody></table>
</div></div></div>



<div id="mod_6065" class="ymymdo" style="position:relative">

<a name="6065NM"></a><div class="ymymd"><div id="6065_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=6065&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('6065',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="6065MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_6065dh" style="cursor: move"><a href="http://us.lrd.yahoo.com/_ylt=Ap1Ddzy7qBQq7ssRfGbIWaYE1vAI/SIG=11pqa0dbv/**http%3a//news.yahoo.com/fc%3ftmpl=fc%26cid=34%26show=1">
Full Coverage</a></h1>

</td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_csatom?.sid=6065&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('6065',this.href,'Full Coverage');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_6065" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=As1HbI2HsHtyoWl9JagTVLwE1vAI?.delete=6065&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('6065', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_6065" style="display: block;"><table border="0" width="100%"><tbody><tr><td><ul><li><a href="http://us.rd.yahoo.com/mymod/hdln/z/afcev/sty/SIG=13khjj0gv/EXP=1118264037;_ylt=AtaPbGLvJn.S5bXV7o4oSJYE1vAI/*http%3A//story.news.yahoo.com/fc?cid=34&amp;tmpl=fc&amp;in=Business&amp;cat=Automobiles_and_Driving">Automobiles &amp; Driving</a><small class="dtxt">&nbsp;-&nbsp;23 minutes ago</small></li><li><a href="http://us.rd.yahoo.com/mymod/hdln/z/afcev/sty/SIG=12umm6q49/EXP=1118264037;_ylt=AnZRbAaK7DmH8w7msvU5MjME1vAI/*http%3A//story.news.yahoo.com/fc?cid=34&amp;tmpl=fc&amp;in=World&amp;cat=Iraq">Iraq Conflict</a><small class="dtxt">&nbsp;-&nbsp;23 minutes ago</small></li><li><a href="http://us.rd.yahoo.com/mymod/hdln/z/afcev/sty/SIG=13h0kfd0u/EXP=1118264037;_ylt=AjZIAMMJTOL2eEKG42SoF.IE1vAI/*http%3A//story.news.yahoo.com/fc?cid=34&amp;tmpl=fc&amp;in=Entertainment&amp;cat=Michael_Jackson">Michael Jackson</a><small class="dtxt">&nbsp;-&nbsp;23 minutes ago</small></li></ul></td></tr></tbody></table>
</div></div></div>


<div id="mod_93159" class="ymymdo" style="position:relative">

<a name="93159NM"></a><div class="ymymd"><div id="93159_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=93159&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93159',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93159MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_93159dh" style="cursor: move">Word of the Day</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="#" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93159',this.href,'Word of the Day');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93159" class="ymynoedit" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=AhkkuX1f3wcOT6SUv1yL83ME1vAI?.delete=93159&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93159', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93159" style="display: block;"><table border="0" width="100%"><tbody><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr valign="top"><td><table border="0" cellpadding="2" cellspacing="0" width="100%"><tbody><tr valign="top"> <td align="left"> <font color="#666666" face="arial,helvetica" size="-2">
Information provided by Petersons.com</font></td></tr></tbody></table></td></tr>
<tr valign="top"> <td align="center"> <b><font size="+2">incompatible</font></b> </td></tr>
<tr valign="top"> <td><table border="0" cellpadding="2" cellspacing="0" width="100%">
<tbody><tr valign="top"><td align="right" width="5%"><font size="-1"><a href="http://education.yahoo.com/reference/dictionary/entry/incompatible">DEFINITION</a>:&nbsp;</font></td>
<td valign="top">(adjective) unable to exist together; conflicting</td></tr>
<tr valign="top"><td align="right" width="5%"><font size="-1">EXAMPLE:&nbsp;</font></td>
<td valign="top">Many people hold seemingly incompatible beliefs: for
example, supporting the death penalty while believing in the sacredness
of human life.</td></tr>
<tr valign="top"><td align="right" width="5%"><font size="-1"><a href="http://education.yahoo.com/search/nt?lb=e&amp;p=num%3AI0798400">SYNONYMS</a>:&nbsp;</font></td> <td valign="top">antagonistic, clashing, opposite</td></tr><tr valign="top"><td colspan="2" align="right"><font size="-1"><br><a href="http://my.yahoo.com/us.rd.yahoo.com/education/mymod/wotd/*http://education.yahoo.com/college/wotd/?y=t">Yesterday's Word of the Day</a></font></td></tr>
</tbody></table></td></tr> </tbody></table>
</td></tr></tbody></table>
</div></div></div><br><div style="width: 100%; text-align: center;"><span class="ymaddb" onclick="ym_go('tadd')">&nbsp;&nbsp;&nbsp;</span><small><a href="http://us.rd.yahoo.com/my/content/z/col/*http://e.my.yahoo.com/config/cstore?.page=p1" class="ymypcust">Add Content</a></small></div></div><center><font class="bf" style="visibility: hidden;">___
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
___ ___ ___ </font></center></td>
<td nowrap="nowrap" width="8"><spacer type="block" height="1" width="8"></td>
<td valign="top" width="1%">

<div id="ycsp_N2" class="ycspncol">


<div id="mod_logDivOuter" class="ymymdo"><a name="logDivOuterNM"></a><div class="ymymd"><div id="logDivOuter_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%">
<a href="#" onclick="return ym_mm('logDivOuter',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="logDivOuterMinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="logDivdh" style="cursor: move">Logger</h1></td><td class="ymymdedit hb" align="right" valign="top">
<a href="http://e.my.yahoo.com/config/set_csmodule?.sid=63798&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('63798',this.href,'City Guides');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_63798" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=Ak5GiQ7P3tMTakIGug3QTfoE1vAI?.delete=63798&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('63798', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_63798" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td bgcolor="#d2e4fc"><input type="button" style="font-size:80%"
		onclick="javascript:void(toggleygLogger(this))" value="Disable Logger" />&nbsp;
	<input type="button" style="font-size:80%"
		onclick="javascript:void(document.getElementById('logDiv').innerHTML='')" value="Clear" /></td></tr>
<tr><td><div id="logDiv" style="position:relative;overflow:auto;text-align:left;z-index:998;font-size:74%;width:200px; height:280px;"></div>
</td>
</tr>

</tbody></table>

</div></div></div>

<div id="mod_linksDivOuter" class="ymymdo"><a name="63798NM"></a><div class="ymymd"><div id="637982_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=63798&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('63798',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="63798MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="linksDivdh" style="cursor: move">Drag Drop</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_csmodule?.sid=63798&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('63798',this.href,'City Guides');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_63798" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=Ak5GiQ7P3tMTakIGug3QTfoE1vAI?.delete=63798&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('63798', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_63798" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td bgcolor="#d2e4fc">Tests</td></tr>
<tr><td>


<?php include('inc/inc-rightbar.php'); ?>

</td>
</tr>

</tbody></table>

</div></div></div>

<div id="mod_93109" class="ymymdo"><a name="93109NM"></a><div class="ymymd"><div id="93109_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=93109&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('93109',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="93109MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_93109dh" style="cursor: move">Stock Portfolios</h1>

</td><td class="ymymdedit hb" align="right" valign="top"><a href="http://edit.my.finance.yahoo.com/e3?.src=my&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('93109',this.href,'Stock Portfolios');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_93109" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=ApuFkRtRDCJ2KbAsNWomGBoE1vAI?.delete=93109&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('93109', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_93109" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" bgcolor="#d2e4fc"><table border="0" cellpadding="2" cellspacing="0" width="100%"><tbody><tr><td align="center"><a href="http://us.ard.yahoo.com/SIG=12cs1iiph/M=338535.6095244.7244357.1199421/D=my/S=150001156:T5/_ylt=Aj627pq10oOrvHpxgpVb.mAE1vAI/Y=YAHOO/EXP=1118184837/A=2752494/R=0/SIG=15ne2gpkn/*http://ad.doubleclick.net/click;h=v2%7C355C%7C0%7C0%7C%2a%7Cj;15159831;0-0;0;11170445;31-1%7C1;10531998%7C10549894%7C1;;%3fhttps://us.etrade.com/e/t/jumppage/viewjumppage?PageName=petpro&amp;SC=NPNN5S2"><img src="my_files/200x33_PET100new052505.gif" alt="" border="0" height="33" width="200"></a>
<img src="my_files/dot.gif" border="0" height="1" width="1"><script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13ulrik20%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3123078541%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=137r39gjr%2fN%3dJjSlAtiIrqc-%2fC%3d338535.6095244.7244357.1199421%2fD%3dT5%2fB%3d2752494');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=1435ujsf6%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3451550459%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=137r39gjr%2fN%3dJjSlAtiIrqc-%2fC%3d338535.6095244.7244357.1199421%2fD%3dT5%2fB%3d2752494"></noscript></td></tr></tbody></table></td></tr>
<tr><td bgcolor="#d2e4fc"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
<td valign="top" width="10%"><a target="_self" href="http://e.my.yahoo.com/config/set_portf_expand?index=pf_1&amp;expand=0&amp;.done=http://my.yahoo.com/index.html"><img src="my_files/norgie_open_dna.gif" alt="collapse" name="b_pf_1Img" align="middle" border="0" height="14" width="15"></a></td>
<td valign="top"><nobr><a href="http://finance.yahoo.com/p?v&amp;k=pf_1"><font color="#666666" face="verdana" size="-1"><b>My First Portfolio</b></font></a></nobr></td><td align="right"><a href="http://edit.finance.yahoo.com/e6?.portkey=pf_1&amp;.src=my&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html"><font color="#666666" face="verdana" size="-1"><small>Edit</small></font></a></td></tr></tbody></table></td></tr>
<tr id="pf_1TR"><td><table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr><td align="left" width="10%"><small>&nbsp;</small></td><td width="30%"><small><a href="http://finance.yahoo.com/q?d=t&amp;s=%5EDJI"><nobr>DJIA</nobr></a></small></td><td align="right" width="30%"><small>10483.07</small></td><td align="right" width="30%"><font color="#007f00" size="-1">+16.04</font></td></tr>
<tr><td align="left"><small>&nbsp;</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=%5EIXIC"><nobr>NASDAQ</nobr></a></small></td><td align="right"><small>2067.16</small></td><td align="right"><font color="#7f0000" size="-1">-8.60</font></td></tr>
<tr><td align="left"><small>&nbsp;</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=%5ESPC"><nobr>^SPC</nobr></a></small></td><td align="right"><small>1197.26</small></td><td align="right"><font color="#7f0000" size="-1">-0.25</font></td></tr>
<tr><td align="left"><small>&nbsp;</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=%5ETYX"><nobr>^TYX</nobr></a></small></td><td align="right"><small>41.95</small></td><td align="right"><font color="#7f0000" size="-1">-0.54</font></td></tr>
<tr><td align="left"><small>*</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=GE"><nobr>GE</nobr></a></small></td><td align="right"><small>36.8400</small></td><td align="right"><font color="#007f00" size="-1">+0.2300</font></td></tr>
<tr><td align="left"><small>*</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=T"><nobr>T</nobr></a></small></td><td align="right"><small>18.94</small></td><td align="right"><font color="#007f00" size="-1">+0.12</font></td></tr>
<tr><td align="left"><small>*</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=MCD"><nobr>MCD</nobr></a></small></td><td align="right"><small>29.5700</small></td><td align="right"><font color="#7f0000" size="-1">-0.8400</font></td></tr>
<tr><td align="left"><small>*</small></td><td><small><a href="http://finance.yahoo.com/q?d=t&amp;s=YHOO"><nobr>YHOO</nobr></a></small></td><td align="right"><small>37.44</small></td><td align="right"><font color="#7f0000" size="-1">-1.08</font></td></tr></tbody></table></td></tr><tr><td align="center"><small></small><form method="get" action="http://finance.yahoo.com/q"><small>U.S. Markets closed<br><input size="10" id="ls" name="s"> <input value="Get Quotes" type="submit"><br><a href="http://finance.yahoo.com/l"><b>Symbol Lookup</b></a><br></small><hr size="1"><small><a href="http://finance.yahoo.com/sd">Providers</a> - <a href="http://help.yahoo.com/help/us/fin/quote/quote-44.html">Disclaimer</a><br>Quotes are delayed 20 minutes.<br>Get <b><a href="http://us.rd.yahoo.com/finance/rtq/mymodule/*http://billing.finance.yahoo.com/ym/f/FinanceReal1?.src=my&amp;.refer=my">Streaming Real-Time Quotes</a></b>.<br>
<b>*</b> = news in the last 24hrs</small></form></td></tr></tbody></table>
</div></div></div>

<div id="mod_63822" class="ymymdo"><a name="63822NM"></a><div class="ymymd"><div id="63822_bx"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="hb t1" valign="top" width="1%"><a href="http://e.my.yahoo.com/config/set_module_state?.module=63822&amp;.state=0&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_mm('63822',this,'');" title="collapse "><img src="my_files/norgie_open_dna.gif" alt="collapse " id="63822MinImg" align="absbottom" border="0" height="15" hspace="3" width="14"></a></td><td class="hb t1" valign="top">

<h1 id="mod_63822dh" style="cursor: move">Maps</h1></td><td class="ymymdedit hb" align="right" valign="top"><a href="http://e.my.yahoo.com/config/set_yp?.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return false" onmousedown="_YCSP_LO.get_ctrl('63822',this.href,'Maps');" title="Edit"><img src="my_files/edit_d.gif" alt="Edit" id="edit_img_63822" border="0" height="13" hspace="2" width="30"></a><a href="http://e.my.yahoo.com/config/cstore;_ylt=AmpBRmRb5CQ_JL1QV3RLCH0E1vAI?.delete=63822&amp;.crumb=R6w4jwmAiBb&amp;.page=p1&amp;.partner=&amp;.intl=us&amp;.done=http%3a%2f%2fmy.yahoo.com%2findex.html&amp;.src=my" onclick="return ym_rm('63822', this);" title="Remove"><img src="my_files/x_d.gif" alt="Remove" border="0" height="13" hspace="2" width="17"></a></td></tr></tbody></table></div><div id="m_63822" style="display: block;"><table border="0" cellpadding="3" cellspacing="0" width="100%">
<script language="JavaScript1.1">
<!--
function FillStreet() {
  slash = " // ";
  ndx = document.geo2.recent.selectedIndex;
  if (ndx < 0) {
    document.geo2.addr.value = " ";
    document.geo2.csz.value = " ";
    document.geo2.country.selectedIndex = 0;
  } else {
    fulltext = document.geo2.recent.options[ndx].value;
    slashndx1 = fulltext.indexOf(slash);
    slashndx2 = fulltext.indexOf(slash, slashndx1 + 1);
    if (slashndx2 > slashndx1) {
      street = fulltext.substr(0, slashndx1);
      city = fulltext.substr(slashndx1 + slash.length, (slashndx2 - slashndx1) - slash.length);
      country = fulltext.substr(slashndx2 + slash.length);
    } else {
      street = fulltext.substr(0, slashndx1);
      city = fulltext.substr(slashndx1 + slash.length);
    }
    document.geo2.addr.value = street;
    document.geo2.csz.value = city;
    var selected = 0;
    for(var i = 0; i < document.geo2.country.length; i++) {
      if (country == document.geo2.country[i].value ) {
        selected = i;
        break;
      }
    }
    document.geo2.country.selectedIndex = selected;
  }
}
//-->
</script>

<tbody><tr><td><form name="geo2" method="post" action="http://e.my.yahoo.com/config/set_maps">
<small><b>Select From 
  My Locations or
<label for="lrecent">Recently Used</label></b> &nbsp;
  <a href="http://e.my.yahoo.com/config/clear_recent_locs?">clear recent</a>
      
</small>
<br><select id="lrecent" name="recent" onchange="FillStreet();"><option value="">---- My Locations ----</option><option value="95 Enterprise, Suite 320 // Aliso Viejo, CA // us">Questerra</option><option value="701 First Avenue // Sunnyvale CA 94089 // us">Yahoo! Inc</option><option value="24341 El Toro Rd // Laguna Woods, CA 92653-2738 // us">ayres</option><option value="587 McCarty Ave // 94041 // us">home</option><option value="550 S. Van Ness #306 // San Francisco, CA 94110 // us">kevin  lisa</option><option value="1320 Corte De Las Piedras // El Cajon, CA 92019-2850 // us">mr</option><option value="8104 E Heritage Dr // evansville, in // us">tunnicliffs</option><option value="">---- Recently Used ----</option><option value="4th and king // san francisco, ca // us">4th and king ,  san franc...</option><option value="587 McCarty Ave // 94041 // us">587 McCarty Ave ,  94041 </option><option value="harrison and 16th // san francisco, ca // us">harrison and 16th ,  san ...</option><option value=" // Pescadero, CA // us">   Pescadero, CA </option><option value=" // pescadero, ca // us">   pescadero, ca </option></select></form></td></tr>
<tr><td><small><b>Or Map a New Address:</b></small></td></tr>
<tr><td><small><label for="laddr">Street Address</label>
<a href="http://help.yahoo.com/help/maps/maps-13.html">or Airport Code</a>
      
</small>
<br><input id="laddr" name="addr" value="" size="20" maxlength="28"></td></tr>
<tr><td><small>
<label for="lcsz">City, State or a Postal Code</label>
</small>
<br><input id="lcsz" name="csz" value="" size="20" maxlength="28">
<br><select name="country"><option value="us" selected="selected">U.S.</option><option value="ca">Canada</option></select></td></tr>
<tr><td align="center"><input value="Get Map" type="submit"></td></tr>
</tbody></table>
</div></div></div>




<br>
<div style="width: 100%; text-align: center;"><span class="ymaddb" onclick="ym_go('tadd')">&nbsp;&nbsp;&nbsp;</span><small><a href="http://us.rd.yahoo.com/my/content/z/col/*http://e.my.yahoo.com/config/cstore?.page=p1" class="ymypcust">Add Content</a></small></div></div>


<hr style="visibility: hidden;" class="bf" noshade="noshade" size="1" width="204"></td></tr></tbody></table>

<br clear="all">


<div id="ymycpy">
<hr style="color: rgb(204, 204, 204); background-color: rgb(204, 204, 204);">
<div style="float: left; color: rgb(102, 102, 102);">
<a href="http://docs.yahoo.com/info/">Company Info</a> <small>|</small> <a href="http://privacy.yahoo.com/privacy/us/my/">Privacy Policy</a> <small>|</small> <a href="http://docs.yahoo.com/info/terms/">Terms of Service</a> <small>|</small> <a href="http://docs.yahoo.com/info/advertising/">Advertise With Us</a> <small>|</small> <a href="http://help.yahoo.com/help/us/my/myyahoo">Help</a><br>
Copyright © 2005 Yahoo! Inc. All rights reserved.<a href="http://docs.yahoo.com/info/copyright/copyright.html">Copyright Policy</a>.

<!--
<a href=http://docs.yahoo.com/info/>Company Info</a> <small>|</small>
<a href="http://privacy.yahoo.com/privacy/us/my/">Privacy Policy</a> <small>|</small>
<a href="http://docs.yahoo.com/info/terms/">Terms of Service</a> <small>|</small>
<a href="http://docs.yahoo.com/info/advertising/">Advertise With Us</a> <small>|</small>
<a href="http://help.yahoo.com/help/us/my/myyahoo">Help</a>
<br>
Copyright &copy; 2005 Yahoo! Inc. All rights reserved. <a href=http://docs.yahoo.com/info/copyright/copyright.html>Copyright/IP Policy</a>.
-->


</div>
<div style="float: right;">
<!-- SpaceID=150001156 loc=NN noad -->
<script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13u5f2vea%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3806659156%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=126mp4524%2fN%3dHDSlAtiIrqc-%2fC%3d-1%2fD%3dNN%2fB%3d-1');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=143te659s%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3294154868%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=126mp4524%2fN%3dHDSlAtiIrqc-%2fC%3d-1%2fD%3dNN%2fB%3d-1"></noscript> 
</div>
</div>
<br><br><br>


</div> <!-- / ymypbdy -->
</div> <!-- / bb -->
</div> <!-- / ygmain -->
<!-- SpaceID=150001156 loc=PU noad-spid -->
<script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13u3us958%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d2361223869%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=1261mh742%2fN%3dJzSlAtiIrqc-%2fC%3d-2%2fD%3dPU%2fB%3d-2');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=143va6r5g%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3808477350%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=1261mh742%2fN%3dJzSlAtiIrqc-%2fC%3d-2%2fD%3dPU%2fB%3d-2"></noscript>
<!-- SpaceID=150001156 loc=FAD noad -->
<script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13uuci0ij%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d4195376410%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=127rbr090%2fN%3dKDSlAtiIrqc-%2fC%3d-1%2fD%3dFAD%2fB%3d-1');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=14287eh5d%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d921842023%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=127rbr090%2fN%3dKDSlAtiIrqc-%2fC%3d-1%2fD%3dFAD%2fB%3d-1"></noscript>
<!-- SpaceID=150001156 loc=RS noad-spid -->
<script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a)
{
yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13u9b44fm%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d1236088262%2fS%3d1%2fJ%3dE1AFA342');
yzq_a('a', '&U=126153bl8%2fN%3dKTSlAtiIrqc-%2fC%3d-2%2fD%3dRS%2fB%3d-2');
}
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=14381jnil%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d2.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d2537304488%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342&U=126153bl8%2fN%3dKTSlAtiIrqc-%2fC%3d-2%2fD%3dRS%2fB%3d-2"></noscript>

<div id="ycspdiag_cont" class="bmshdwa" style="width: 360px; height: 60px;">
<table class="bm" cellpadding="0" cellspacing="0" width="100%">
<tbody><tr><td style="padding: 5px 0px;" align="center"><b class="ymyalert">Are you sure you want to delete this module?</b></td></tr>
<tr><td height="5" nowrap="nowrap"><spacer type="block" height="5"></td></tr>
<tr>
 <td align="center"><form><input value="yes" class="ygbtdnorm" style="width: 50px;" onclick="ycsp_dodel()" type="button">&nbsp;&nbsp;<input value="no" class="ygbtdnorm" style="width: 50px;" onclick="ym_rm()" id="ycsp_nodel" type="button"></form></td>
</tr>
<tr><td height="5" nowrap="nowrap"><spacer type="block" height="5"></td></tr>
</tbody></table>
</div>


<div style="top: -1000px;" id="ymyctrl" class="bmshdwa"> 
<table class="bm" cellpadding="0" cellspacing="0">
<tbody><tr><td class="dpi" id="ymy_mu_edit" onmouseover="ycsp_h2(this)" onmouseout="ycsp_h2(this)">Edit Content</td></tr>
<tr><td class="dpa" id="ymy_mu_eml" onmouseover="ycsp_h2(this)" onmouseout="ycsp_h2(this)">Email this Module</td></tr>
<tr><td class="bmsep">&nbsp;</td></tr>
<tr><td class="dpit" id="ymy_mu_tp">Move to Top </td></tr>
<tr><td class="dpiu" id="ymy_mu_up">Move Up</td></tr>
<tr><td class="dpid" id="ymy_mu_dn">Move Down</td></tr>
<tr><td class="dpib" id="ymy_mu_bt">Move to Bottom </td></tr>
</tbody></table>
</div>

<script>
<!--
var ak="http://us.i1.yimg.com/us.yimg.com/i/us/my/",dc=0,ismy=1;
var ym_edit_url="http://e.my.yahoo.com/config/";
var CONFIRM_MODE=0;
function ym_rm(id,lnk) {
  ycsp_del_id=id;ycsp_del_lnk=lnk;
  ycsp_dodelnow();
  return false;
}
var emlbs="http://mtf.news.yahoo.com/mailto?url="+ym_edit_url+"cstore%3f.opt=content%26.sid=!sid!&prop=mycstore&locale=us&h2=&h3=http%3a%2f%2fmy.yahoo.com%2findex.html&h4=&h5=My Yahoo!&.opt=content";
function ymy_gem(id) {
 return ''; //not needed in zorro by design
 return  '<div id='+id+'_empty_mod class=ymymd style="padding:12px 0px 12px 12px;text-align:left;"><span class=bt>NOT_SELECT<a href="#ycspaddcntName">add modules</a> using the bar at the bottom of the page or by clicking the Choose Content button above.</span></div><br>';
}
function ymy_setkey0(id,dir) {
  yg_setkey(ym_edit_url+'move_module?.module='+id+'&.direction='+dir+'&.jscall=1&.page=p1&.partner=&.intl=us&.done=http%3a%2f%2fmy.yahoo.com%2findex.html&.src=my');
}
var intlx=-9;var ncolx=0;
function ycsp_set_state(lnk,s,i){
  newuri=lnk.replace(/state=[0-1]/i,"state="+s);YIMG.src=newuri;
  if(i) i.alt = s ? i.alt.replace(/expand /,"collapse "):i.alt.replace(/collapse /,"expand ");
}
function gcss() {
  var o = yg_getObj("botcss");
  o.href = "http://us.js1.yimg.com/us.yimg.com/clib/my/ym_bot_a_37.css";
}
function init() {
  setTimeout("gcss()",1);
  pgLoaded=1;
  yg_setkey("http://us.lrd.yahoo.com/t/b.gif?t=1118177636&_ylp=A0Kjr.FkCaZC52AA4QEE1vAI&ie="+oBw.ie+"&w="+ym_gsw()+"&h="+ym_gsh()+"&hm="+YM_HM);}
// window.onload=init;

//-->
</script>

<script type="text/javascript" language="javascript" src="my_files/ymy_base_17.js"></script>


<!-- SpaceID=150001156 loc=FRTM noad -->


<script type="text/javascript">
</script><script type="text/javascript">
if (window.yzq_a) yzq_a('p', 'P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=13u4ckn2t%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d1.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3087525620%2fS%3d1%2fJ%3dE1AFA342');
if (window.yzq_gb && window.yzq4) yzq4();
else if (window.yzq_eh) yzq_eh();
</script><noscript><img width=1 height=1 alt=""
src="http://bc.us.yahoo.com/b?P=5R1ELkKjq4HrIhh2Qp5W6gRmQuSuskKmCWQAC2U2&T=143s2kcij%2fX%3d1118177637%2fE%3d150001156%2fR%3dmy%2fK%3d5%2fV%3d3.1%2fW%3ddefault%2fY%3dYAHOO%2fF%3d3200247627%2fQ%3d-1%2fS%3d1%2fJ%3dE1AFA342"></noscript>
<!-- p33.my.sc5.yahoo.com compressed/chunked Tue Jun  7 13:53:56 PDT 2005 -->

</body></html>
