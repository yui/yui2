(function(){

	YAHOO.namespace("example.yuitest");

	var	YTest         = YAHOO.example.yuitest,
			Ytool         = YAHOO.tool,
			Event         = YAHOO.util.Event,
			Dom           = YAHOO.util.Dom,
			DT            = YAHOO.widget.DataTable,
			Assert        = YAHOO.util.Assert,
			ArrayAssert   = YAHOO.util.ArrayAssert,
			ObjectAssert  = YAHOO.util.ObjectAssert;

	YTest.RowExpansionCoreSuite = new Ytool.TestSuite("RowExpansion Core");

	YTest.RowExpansionCoreSuite.tableMaker = function(){

		var myData = [
			{id:"po-0167", date:new Date(1980, 2, 24), quantity:1, amount:4, title:"A Book About Nothing",
			description: "Lorem ipsum dolor sit amet consectetuer Quisque ipsum suscipit Aenean ligula. Accumsan molestie nibh dui orci vitae auctor nec pulvinar ligula elit.",image_url:"book1.gif"},
			{id:"po-0783", date:new Date("January 3, 1983"), quantity:null, amount:12.12345, title:"The Meaning of Life",
			description: "Vestibulum scelerisque wisi adipiscing turpis odio Phasellus euismod id orci tristique. Hendrerit sem dictum volutpat cursus pretium dui vitae tincidunt Vivamus Aenean."},
			{id:"po-0297", date:new Date(1978, 11, 12), quantity:12, amount:1.25, title:"This Book Was Meant to Be Read Aloud",
			description: "Malesuada pellentesque nibh magna nisl tincidunt wisi dui Nam nunc convallis. Adipiscing leo augue Nulla tellus nec eros metus cursus pretium Sed.",image_url:"book2.gif"},
			{id:"po-1482", date:new Date("March 11, 1985"), quantity:6, amount:3.5, title:"Read Me Twice",
			description: "Libero justo pede nibh tincidunt ut tempus metus et Vestibulum vel. Sem justo morbi lacinia dui turpis In Lorem dictumst volutpat cursus.",image_url:"book3.gif"}
    ];

		var myColumnDefs = [
				{
					key:"date",
					sortable:true,
					sortOptions:{
						defaultDir:YAHOO.widget.DataTable.CLASS_DESC
					},
					resizeable:true
				},
				{
					key:"quantity",
					formatter:YAHOO.widget.DataTable.formatNumber,
					sortable:true,
					resizeable:true
				},
				{
					key:"amount",
					formatter:YAHOO.widget.DataTable.formatCurrency,
					sortable:true,
					resizeable:true
				},
				{
					key:"title",
					sortable:true,
					resizeable:true
				}

		];

		var myDataSource = new YAHOO.util.DataSource( myData );
				myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
				myDataSource.responseSchema = {
					fields: [ "id","date","quantity","amount","title","image_url" ]
				};

		var makeDiv = function(){

			var new_div = document.createElement( 'div' );
			new_div.id = 'testTable';
			return document.getElementsByTagName( 'body' )[ 0 ].appendChild( new_div );

		};

		var myDataTable = new YAHOO.widget.DataTable(
				( Dom.get( 'testTable' ) || makeDiv() ),
				myColumnDefs,
				myDataSource,
					{ rowExpansionTemplate : '<img src="{image_url}" />' }
				),

				records = myDataTable.getRecordSet().getRecords(),
				record_ids = [];

		for( var i=0,l=records.length; l > i; i++ ){

			record_ids.push( records[ i ] );

		};

		return { oDT : myDataTable, oDS : myDataSource, eContainer : Dom.get( 'testTable' ), aIds : record_ids }

	};

	YTest.RowExpansionCoreSuite.tableDestroyer = function( oTable ){

		oTable.oDT.destroy();
		oTable.eContainer.parentNode.removeChild( oTable.eContainer );

	};

	YTest.RowExpansionCoreSuite.setUp = function(){
		//
	}

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "rowExpansionTemplate Attribute Tests",

		setUp : function () {

			this.table = YTest.RowExpansionCoreSuite.tableMaker();
			this.data_table = this.table.oDT;

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

			YTest.RowExpansionCoreSuite.tableDestroyer( this.table );

		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "toggleRowExpansion (Open) Method",

		setUp : function () {

			this.table = YTest.RowExpansionCoreSuite.tableMaker();
			this.data_table = this.table.oDT;

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

			YTest.RowExpansionCoreSuite.tableDestroyer( this.table );

		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "toggleRowExpansion (Closed) Method",

		setUp : function () {

			this.table = YTest.RowExpansionCoreSuite.tableMaker();
			this.data_table = this.table.oDT;

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

			YTest.RowExpansionCoreSuite.tableDestroyer( this.table );

		}

	}) );

	YTest.RowExpansionCoreSuite.add( new Ytool.TestCase({

		name : "expandRow Method",

		setUp : function () {

			this.table = YTest.RowExpansionCoreSuite.tableMaker();

			this.data_table = this.table.oDT;

			//Expand the first record
			this.data_table.expandRow( this.table.aIds[ 0 ] );

			//Expand the third record then delete the record and restore it
			this.data_table.expandRow( this.table.aIds[ 2 ] );
			var expansion = Dom.getNextSibling( this.data_table.getRow( this.table.aIds[ 2 ] ) );
			expansion.parentNode.removeChild( expansion );
			this.data_table.expandRow( this.table.aIds[ 2 ], true );

		},

		testRegularExpansion : function () {

			Assert.isTrue(
				Dom.hasClass( this.data_table.getRow( this.table.aIds[ 0 ] ), 'yui-dt-expanded' ),
				'The first record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isTrue(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow( this.table.aIds[ 0 ] ) ), 'yui-dt-expansion' ),
				'The first record does not have the "yui-dt-expanded" class applied'
			);

		},

		testRestoredExpansion : function () {

			Assert.isTrue(
				Dom.hasClass( this.data_table.getRow( this.table.aIds[ 2 ] ), 'yui-dt-expanded' ),
				'The third record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isTrue(
				Dom.hasClass( Dom.getNextSibling( this.data_table.getRow( this.table.aIds[ 2 ] ) ), 'yui-dt-expansion' ),
				'The third record does not have the "yui-dt-expanded" class applied'
			);

			Assert.isFalse(
				Dom.hasClass( Dom.getNextSibling( Dom.getNextSibling( this.data_table.getRow( this.table.aIds[ 2 ] ) ) ), 'yui-dt-expansion' ),
				'An extra row with "yui-dt-expanded" class applied. Restore failure.'
			);

		},

		tearDown : function () {

			YTest.RowExpansionCoreSuite.tableDestroyer( this.table );

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