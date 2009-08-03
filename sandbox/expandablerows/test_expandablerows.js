(function(){

	YAHOO.namespace("example.yuitest");

	var	YTest					= YAHOO.example.yuitest,
			Ytool					= YAHOO.tool,
			Event					= YAHOO.util.Event,
			Dom						=	YAHOO.util.Dom,
			DT						= YAHOO.widget.DataTable,
			Assert				= YAHOO.util.Assert,
			ArrayAssert		= YAHOO.util.ArrayAssert,
			ObjectAssert	= YAHOO.util.ObjectAssert;

	YTest.RowExpansionCoreSuite = new Ytool.TestSuite("RowExpansion Core");

	YTest.RowExpansionCoreSuite.setUp = function(){

		this.example = YAHOO.example.Basic;

	}

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "rowExpansionTemplate Attribute Tests",

		setUp : function () {

			this.example = YTest.RowExpansionCoreSuite.example;
			this.data_table = this.example.oDT;

		},

		testAttribute : function () {

			ObjectAssert.hasProperty(
				'rowExpansionTemplate',
				this.data_table.configs,
				'DataTable instance is missing the "rowExpansionTemplate" attribute'
			);

		},

		testHasToogleMethod : function () {

			Assert.isFunction(
				this.data_table.toggleRowExpansion,
				'The "toggleRowExpansion" method is not a funcition'
			);

		},

		tearDown : function () {
			//
		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "toggleRowExpansion (Open) Method",

		setUp : function () {

			this.example = YTest.RowExpansionCoreSuite.example;
			this.data_table = this.example.oDT;

			//Expand the first row
			this.data_table.toggleRowExpansion( 0 );

		},

		testIsOpen : function () {

			Assert.isTrue(
				Dom.hasClass( this.data_table.getRow(0), 'yui-dt-expanded' ),
				'The first row does not have the "yui-dt-expanded" class applied'
			);

			Assert.isTrue(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow(0) ), 'yui-dt-expansion' ),
				'The first row does not have the "yui-dt-expanded" class applied'
			);

		},

		tearDown : function () {

			//Expand the first row
			this.data_table.toggleRowExpansion( 0 );

		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "toggleRowExpansion (Closed) Method",

		setUp : function () {

			this.example = YTest.RowExpansionCoreSuite.example;
			this.data_table = this.example.oDT;

			//Expand and Collapse the first row
			this.data_table.toggleRowExpansion( 0 );
			this.data_table.toggleRowExpansion( 0 );

		},

		testIsClosed : function () {

			Assert.isFalse(
				Dom.hasClass( this.data_table.getRow( 0 ), 'yui-dt-expanded' ),
				'The first row should not have the "yui-dt-expanded" class applied'
			);

			Assert.isFalse(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow( 0 ) ), 'yui-dt-expansion' ),
				'The first row should not have the "yui-dt-expanded" class applied'
			);

		},

		tearDown : function () {
			//
		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "expandRow Method",

		setUp : function () {

			this.example = YTest.RowExpansionCoreSuite.example;
			this.data_table = this.example.oDT;

			//Expand the first record
			this.data_table.expandRow( 'yui-rec0' );

			//Expand the third record then delete the record and restore it
			this.data_table.expandRow( 'yui-rec2' );
			var expansion = Dom.getNextSibling( this.data_table.getRow( 'yui-rec2' ) );
			expansion.parentNode.removeChild( expansion );
			this.data_table.expandRow( 'yui-rec2', true );

		},

		testRegularExpansion : function () {

			Assert.isTrue(
				Dom.hasClass( this.data_table.getRow( 'yui-rec0' ), 'yui-dt-expanded' ),
				'The first record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isTrue(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow( 'yui-rec0' ) ), 'yui-dt-expansion' ),
				'The first record does not have the "yui-dt-expanded" class applied'
			);

		},

		testRestoredExpansion : function () {

			Assert.isTrue(
				Dom.hasClass( this.data_table.getRow( 'yui-rec2' ), 'yui-dt-expanded' ),
				'The third record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isTrue(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow( 'yui-rec2' ) ), 'yui-dt-expansion' ),
				'The third record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isFalse(
				Dom.hasClass( Dom.getNextSibling( Dom.getNextSibling( this.data_table.getRow( 'yui-rec2' ) ) ), 'yui-dt-expansion' ),
				'An extra row with "yui-dt-expanded" class applied. Restore failure.'
			);

		},

		tearDown : function () {

			//Collapse the first record
			this.data_table.toggleRowExpansion( 'yui-rec0' );

			//Collapse the third record
			this.data_table.toggleRowExpansion( 'yui-rec2' );

		}

	}) );

	YTest.RowExpansionCoreSuite.tearDown = function(){
		//
	}

	Event.onDOMReady(function (){
		//create the logger
		var logger = new Ytool.TestLogger("testLogger");
		Ytool.TestRunner.add( YTest.RowExpansionCoreSuite );

		//run the tests
		Ytool.TestRunner.run();
	});

})();