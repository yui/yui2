<!-- Example text. Note that code excerpts are housed in special
textarea's that are used to do syntax highlighting -->

<h2 class="first">Sample Code for this Example</h2>

<p>Markup:</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="expandable_table"></div>
</textarea>

<p>CSS:</p>
<textarea name="code" class="HTML" cols="60" rows="1">		
/** 
*
* Style the yui-dt-expandablerow-trigger column 
*
**/
.yui-dt-expandablerow-trigger{
	width:18px;
	height:22px;
	cursor:pointer;
}
.yui-dt-expanded .yui-dt-expandablerow-trigger{
	background:url(arrow_open.png) 4px 4px no-repeat;
}
.yui-dt-expandablerow-trigger, .yui-dt-collapsed .yui-dt-expandablerow-trigger{
	background:url(arrow_closed.png) 4px 4px no-repeat;
}
.yui-dt-expanded .yui-dt-expandablerow-trigger.spinner{
	background:url(spinner.gif) 1px 4px no-repeat;
}

/** 
*
* Style the expansion row
*
**/
.yui-dt-expansion .yui-dt-liner{
	padding:0;
	border:solid 0 #bbb;
	border-width: 0 0 2px 0;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table{
	border:none;
	background-color:#fff;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table th{
	background-image:none;
	background-color:#eee;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table td{
	border:solid 0 #eee;
	border-width: 0 0 1px 1px;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table td div{
	padding:3px;
	overflow:hidden;
	width:100px;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table td.big div{
	width:300px;
}
.yui-dt-expansion .yui-dt-liner th, .yui-dt-expansion .yui-dt-liner table td ul{ padding:0;margin:0; }
</textarea>

<p>Java Script:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady( function() {

	YAHOO.example.rowExpansionFunction = function() {


		/**
		* This "getExtendedData" function be called to make an XHR call to return data to
		* be dispayed in the row expansion.
		**/
		var getExtendedData = function( url, success ){

			/**
			* This async request is passed a local proxy url with arguments serialized for YQL, 
			* including the YQL query. We also pass a function to be called on success.
			**/
			YAHOO.util.Connect.asyncRequest(
				'GET',
				url,
				{
					success : success,
					failure : function( o ){

						YAHOO.log('Failed to get data','error','RowExpansionExample');

					}
				}
			); 

		};

		/**
		* This "getYQLUrl" takes a text YQL query and serializes it in a url that can be passed
		* to the "getExtendedData" method
		**/
		var getYQLUrl = function( query ){

			/**
			* Concatinate the proxy url with the query passed as an argument.
			**/
			return '/data/yql.php?format=json&q=' + encodeURIComponent( query );

		};

		/**
		*
		* This "expansionTemplate" function will be passed to the "rowExpansionTemplate" property
		* of the YUI DataTable to enable the row expansion feature. It is passed an arguments object
		* which contains context for the record that has been expanded as well as the newly created 
		* row.
		*
		**/
		var expansionTemplate = function( oArgs ){

			/**
			* The RSS feed url from the original call to the delicious api is extracted
			**/
			var rss_feed            = oArgs.data.getData().commentRss,

					/**
					* Markup for the table that will be rendered is assembled. Since YAHOO.lang.substitute is
					* used for templating, brackets "{}" are put around tokens taht will match properties 
					* available in the response object of an async request
					**/
					table_markup_top    = '<table width=500> \
																		<tr> \
																			<th class="big">Comment</th> \
																			<th>User</th> \
																			<th>Tags</th> \
																		</tr> \
																',
					table_markup_bottom = '</table>',
					row_template        = '<tr> \
																	<td class="big"><div>{description}</div></td> \
																	<td><div><a href="http://delicious.com/{creator}">{creator}</a></div></td> \
																	<td><div><ul>{yuidt_category_markup}</ul></div></td> \
																</tr> \
															';

			/**
			* Kicks off the Async request to get expansion data
			**/
			getExtendedData( 
				getYQLUrl('select * from rss where url="' + rss_feed + '?count=100"'),

				function( o ){ //This is the callback function that will be called if the Async is successful

					var response_object = YAHOO.lang.JSON.parse( o.responseText ),
							data_array      = response_object.query.results.item,
							element         = oArgs.liner_element,
							markup          = table_markup_top;

					/**
					* Builds rows from returned comments
					**/
					for( var i=0, l=data_array.length, w=0; l > i; i++ ){

						var item = data_array[ i ],
								catagory_markup = '';

						if( item.category ){

							/**
							* Builds an unordered list of tags returnd as part of the comment item
							**/
							for( var ii=0, ll=item.category.length; ll > ii; ii++ ){

								catagory_markup += YAHOO.lang.substitute( 
									'<li><a href="{domain}{content}">{content}</a></li>',
									item.category[ii]
								);

							}

						}

						item.yuidt_category_markup = catagory_markup;

						var closeTable = function(){

							markup += table_markup_bottom;

							element.innerHTML = markup;

							YAHOO.util.Dom.removeClass( 
								YAHOO.util.Dom.getPreviousSibling( oArgs.row_element ).childNodes[ 0 ], 
								'spinner'
							);

							return true;

						}

						/**
						* Writes only the items that contain text in the description property. This implementation
						* displays a hard coded maximum of 5 comments. This is not a neccisary limitation.
						**/
						if( item.description ){

							if( w > 4 ){ return closeTable(); }

							markup += YAHOO.lang.substitute( row_template, item );

							w++;

						}

					}

					return closeTable();

				}

			);

		};

		/**
		*
		* Create a YUI DataSource instance.
		*
		**/
		var myDataSource = new YAHOO.util.DataSource( getYQLUrl( 'select * from delicious.feeds.popular' ) );
		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		myDataSource.connXhrMode = "queueRequests";
		myDataSource.responseSchema = {
		    resultsList: "query.results.item"
		};

		/**
		*
		* Create a YUI DataTable instance.
		*
		**/
		var myDataTable = new YAHOO.widget.DataTable(
			"expandable_table",
			[
				{
					label:"",
					formatter:function(el, oRecord, oColumn, oData) {

						/**
						* This "yui-dt-expandablerow-trigger" class will be used to style and attach the 
						* click behavior of the yui-dt-expandablerow-trigger column
						**/
						YAHOO.util.Dom.addClass( el.parentNode, "yui-dt-expandablerow-trigger" );

					}
				},
				{
					key:"title",
					label:"Popular Bookmark",
					resizeable:true,
					sortable:true,
					/**
					* This "expansionFormatter" function will create markup for a yui-dt-expandablerow-trigger that a 
					* user can click to expand a row.
					**/
					formatter:function( el, oRecord, oColumn, oData ){ //formats a link

						el.innerHTML = '<a href="' + oRecord.getData().link + '">' + oData + '</a>';

					}
				}
			],
			myDataSource,
			{ rowExpansionTemplate : expansionTemplate } //Pass the formatter object (expansionTemplate) to the "rowExpansionTemplate" property to enable the row expansion feature
		);

		/**
		*
		* Subscribe to the "cellClickEvent" which will yui-dt-expandablerow-trigger the expansion 
		* when the user clicks on the yui-dt-expandablerow-trigger column
		*
		**/
		myDataTable.subscribe( 'cellClickEvent', function( o ){

			myDataTable.onEventToggleRowExpansion( o );
			YAHOO.util.Dom.addClass( o.target, 'spinner' );

		} );

		return {

			oDS: myDataSource,
			oDT: myDataTable

		};

	}();
});
</textarea>
