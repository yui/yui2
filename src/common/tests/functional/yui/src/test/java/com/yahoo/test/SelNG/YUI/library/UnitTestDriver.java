package com.yahoo.test.SelNG.YUI.library;

import com.yahoo.test.SelNG.framework.core.SelNGBase;
import static com.yahoo.test.SelNG.framework.util.ThreadSafeSeleniumSessionStorage.session;
//import static org.testng.Assert.assertEquals;
//import static org.testng.Assert.assertFalse;


public class UnitTestDriver extends SelNGBase {

    private static String[] theTests = {
	"animation",
	"autocomplete",
	"base",
	//"button",
	"calendar",
	//"carousel",
	//"charts",
	//"colorpicker",
	//"connection",
	"container",
	"cookie",
	"datasource",
	"datatable",
	"datemath",
	"dom",
	"dragdrop",
	"editor",
	"element",
	//"element-delegate",
	//"event",
	//"event-delegate",
	//"event-mouseenter",
	//"event-simulate",
	//"fonts",
	//"get",
	//"grids",
	//"history",
	//"imagecropper",
	"imageloader",
	"json",
	//"layout",
	"logger",
	//"menu",
	//"paginator",
	"profiler",
	//"profilerviewer",
	//"progressbar",
	//"reset",
	//"resize",
	//"selector",
	//"slider",
	//"storage",
	//"stylesheet",
	//"swf",
	//"swfdetect",
	//"swfstore",
	"tabview",
	//"treeview",
	//"uploader",
	"yahoo",
	"yuiloader",
	"yuiloader-config",
	"yuiloader-rollup",
	"yuitest" };

	public static void unitTest(String item) throws Exception {


		session().open("http://10.72.112.142/dev/gitroot/yui2/src/common/tests/functional/UnitTestDriver.html?item=" + item);
		Thread.sleep(2000);
		String s = session().getEval("this.browserbot.getCurrentWindow().YAHOO.Functional.TestManager.results");
		reportYUIUnitTest(s);


	}

	private static void reportYUIUnitTest(String s) {
		// TODO Auto-generated method stub
		
	}

}
