/**********
*
* Expandable Rows Plugin for the YUI DataTable
* Author: gelinase@yahoo-inc.com / Eric Gelinas 
*
***********/

(function(){
	
	var	Dom = YAHOO.util.Dom
	
			STRING_STATENAME = 'yui_dt_state',
			
			CLASS_EXPANDED = 'yui-dt-expanded',
			CLASS_COLLAPSED = 'yui-dt-collapsed',
			CLASS_EXPANDABLEROW = 'yui-dt-expandablerow'
			CLASS_TRIGGER = 'yui-dt-expandablerow-trigger',
			CLASS_NODATA = 'yui-dt-expandablerow-nodata',
			CLASS_CELL = 'yui-dt-expandablerow-cell',
			CLASS_LINER = 'yui-dt-expandablerow-liner',
			
			indexOf = function(a, val) {
				for (var i=0; i<a.length; i=i+1) {
					if (a[i] === val) {
						return i;
					}
				}

				return -1;
			};

	//Add prototype methods
	YAHOO.lang.augmentObject( 
		YAHOO.widget.DataTable.prototype , 
		{
			getRowState : function( row, key ){

				var row_data = this.getRecord( row ),
					row_state = row_data.getData( STRING_STATENAME );

				var state_data = ( row_state && key ) ? row_state[ key ] : row_state;
				
				return state_data || {};

			},

			setRowState : function( row, key, value ){

				var row_data = this.getRecord( row ).getData(),
					merged_data = {};
					

				for( var i in row_data[ STRING_STATENAME ] ){
					
					var item = row_data[ STRING_STATENAME ][ i ]
					
					merged_data[ i ] = item;
					
				}
				
				merged_data[ key ] = value;
				
				this.getRecord( row ).setData( STRING_STATENAME, merged_data );
				
				return row_data[ key ];

			},

			_setInitialState : function( field, template, rowConfigs ){
				
				var records = this.getRecordSet().getRecords();
				
				//Augment records
				for( var i=0, l=records.length; l > i; i++ ){

					var record = records[ i ]
						state_object = record.getData( STRING_STATENAME );

					//Create row object if needed
					if( !state_object ){

						record.setData( STRING_STATENAME, {} );
						var state_object = record.getData( STRING_STATENAME );

					}

					//Set row state
					record.setData( STRING_STATENAME, {
						expanded : ( record.getData( field ) ) ? false : null, //set expanded property to null if no data is available
						expandable_datakey : field,
						expandable_template : null
					} );

				}//for
				
				this.rowExpansionTemplate = state_object ? ( state_object.expandable_template || template || null ) : template || null;
				
			},

			initExpandableRows : function( field, template, rowConfigs ){
				
				//Set subscribe restore method
				this.subscribe( 'postRenderEvent', function(){ this.restoreExpandedRows( field, template, rowConfigs ); } )

				//Set table level state
				this.a_rowExpansions = [];

			},

			toggleRowExpansion : function( row ){

				var state = this.getRowState( row );

				if( state && state.expanded ){

					this.collapseRow( row );

				} else {
					
					this.expandRow( row );

				}

			},

			expandRow : function( row, restore ){

				var state = this.getRowState( row );

				if( !state.expanded || restore ){
					
					//If id passed, get element
					if( !YAHOO.lang.isObject( row ) ) {

						row = Dom.get(row);

					}

					//Fire custom event
					this.fireEvent( "rowExpandEvent", { row : row } );

					var row_data = this.getRecord( row ),
						new_row = document.createElement('tr'),
						column_length = this.getFirstTrEl().getElementsByTagName('td').length,
						expanded_data = row_data.getData( state.expandable_datakey ),
						expanded_content = null,
						template = state.expandable_template || this.rowExpansionTemplate;

					//Construct expanded row body
					new_row.className = CLASS_EXPANDABLEROW;
					var new_column = document.createElement('td');
					new_column.className = CLASS_CELL;
					new_column.colSpan = column_length;

					new_column.innerHTML = '<div class="'+ CLASS_LINER +'"></div>';
					new_row.appendChild( new_column );

					var liner_element = new_row.getElementsByTagName( 'div' )[ 0 ];

					if( YAHOO.lang.isString( template ) ){

						liner_element.innerHTML = YAHOO.lang.substitute( 
							template, 
							expanded_data
						);

					} else if( YAHOO.lang.isFunction( template ) ) {

						template( { 
							row_element : new_row,
							liner_element : liner_element,
							data : row_data, 
							state : state 

						} );

					} else {

						return false;

					}

					//Insert new row
					newRow = Dom.insertAfter( new_row, row );
					
					if (newRow.innerHTML.length) {
						
						this.setRowState( row, 'expanded', true );
						
						if( !restore ){

							this.a_rowExpansions.push( row_data.getId() );

						}
						
						Dom.removeClass( row, CLASS_COLLAPSED );
						Dom.addClass( row, CLASS_EXPANDED );

						return true;

					} else {

						return false;

					} 

				}

			},

			collapseRow : function( row ){
				
				if( Dom.hasClass( row, CLASS_EXPANDED ) ){

					//Fire custom event
					this.fireEvent("rowCollapseEvent", { row : row } );

					//If id passed, get element
					if ( !YAHOO.lang.isObject( row ) ) {

						row = Dom.get( row );

					}
					
					var row_data = this.getRecord( row ),
						state = row_data.getData( STRING_STATENAME ),
						next_sibling = Dom.getNextSibling( row ),
						hash_index = indexOf( this.a_rowExpansions, row_data.getId() );
						
					if( Dom.hasClass( next_sibling, CLASS_EXPANDABLEROW ) ) {

						next_sibling.parentNode.removeChild( next_sibling );
						this.a_rowExpansions.splice( hash_index, 1 );
						this.setRowState( row, 'expanded', false );
						
						Dom.addClass( row, CLASS_COLLAPSED );
						Dom.removeClass( row, CLASS_EXPANDED );

						return true

					} else {

						return false;

					}

				}

			},

			collapseAllRows : function(){

				var expanded_rows = this.getElementsByClassName( CLASS_EXPANDABLEROW );

				if( expanded_rows.length ){

					for( var i = 0, l = expanded_rows.length; l > i; i++ ){

						var parent_row = Dom.getPreviousSibling( expanded_rows[ i ] );

						if( parent_row ){

							this.collapseRow( parent_row );

						}

					}

				} else {

					return false;

				}

			},

			restoreExpandedRows : function( field, template, rowConfigs ){
				
				var	expanded_rows = this.a_rowExpansions;
				
				if( !expanded_rows.length ){
					
					this._setInitialState( field, template, rowConfigs );
					return;
					
				}

				if( this.a_rowExpansions.length ){

					for( var i = 0, l = expanded_rows.length; l > i; i++ ){

						this.expandRow( this.getRow( expanded_rows[ i ] ), true );

					}

				}

			}

		}
	);

	YAHOO.widget.DataTable.formatExpandRowTrigger = function(el, oRecord, oColumn, oData) {

		var cell_element = Dom.getAncestorByTagName( el, 'td' ),
				state_object = oRecord.getData( STRING_STATENAME ),
				this_static = YAHOO.widget.DataTable.formatExpandRowTrigger;

		//Set trigger
		if( oData ){ //Row is closed

			Dom.addClass( cell_element, CLASS_TRIGGER );

		} else {
			
			Dom.addClass( cell_element, CLASS_NODATA );
			
		}

		/*
		if( !this_static.hasCollapseEvent ){

			this.subscribe( 'rowCollapseEvent', function( args ){

				Dom.removeClass( args.row, CLASS_EXPANDED );

			} );
			this_static.hasCollapseEvent = true;

		}
		*/

	}
	
})();
