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
			_getRecordState : function( record_id, key ){

				var row_data = this.getRecord( record_id ),
					row_state = row_data.getData( STRING_STATENAME );

				var state_data = ( row_state && key ) ? row_state[ key ] : row_state;
				
				return state_data || {};

			},

			_setRecordState : function( record_id, key, value ){

				var row_data = this.getRecord( record_id ).getData(),
					merged_data = {};
					

				for( var i in row_data[ STRING_STATENAME ] ){
					
					var item = row_data[ STRING_STATENAME ][ i ]
					
					merged_data[ i ] = item;
					
				}
				
				merged_data[ key ] = value;
				
				this.getRecord( record_id ).setData( STRING_STATENAME, merged_data );
				
				return row_data[ key ];

			},

			initExpandableRows : function( field, template ){
				
				//Set subscribe restore method
				this.subscribe( 'postRenderEvent', this.restoreExpandedRows )

				//Setup template
				this.rowExpansionTemplate = template;

				//Set table level state
				this.a_rowExpansions = [];

			},

			toggleRowExpansion : function( record_id ){

				var state = this._getRecordState( record_id );

				if( state && state.expanded ){

					this.collapseRow( record_id );

				} else {
					
					this.expandRow( record_id );

				}

			},

			expandRow : function( record_id, restore ){

				var state = this._getRecordState( record_id );

				if( !state.expanded || restore ){
					
					var row_data = this.getRecord( record_id ),
						row = this.getRow( row_data ),
						new_row = document.createElement('tr'),
						column_length = this.getFirstTrEl().getElementsByTagName( 'td' ).length,
						expanded_data = row_data.getData(),
						expanded_content = null,
						template = this.rowExpansionTemplate;

					//Fire custom event
					this.fireEvent( "rowExpandEvent", { row : row } );

					//Construct expanded row body
					new_row.className = CLASS_EXPANDABLEROW;
					var new_column = document.createElement( 'td' );
					new_column.className = CLASS_CELL;
					new_column.colSpan = column_length;

					new_column.innerHTML = '<div class="'+ CLASS_LINER +'"></div>';
					new_row.appendChild( new_column );

					var liner_element = new_row.firstChild.firstChild;

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
						
						this._setRecordState( record_id, 'expanded', true );
						
						if( !restore ){

							this.a_rowExpansions.push( record_id );

						}
						
						Dom.removeClass( row, CLASS_COLLAPSED );
						Dom.addClass( row, CLASS_EXPANDED );

						return true;

					} else {

						return false;

					} 

				}

			},

			collapseRow : function( record_id ){
				
				var row_data = this.getRecord( record_id ),
					row = Dom.get( row_data.getId() ),
					state = row_data.getData( STRING_STATENAME );
				
				if( state && state.expanded ){

					//Fire custom event
					this.fireEvent("rowCollapseEvent", { row : row_data } );
					
					var next_sibling = Dom.getNextSibling( row ),
						hash_index = indexOf( this.a_rowExpansions, record_id );
						
					if( Dom.hasClass( next_sibling, CLASS_EXPANDABLEROW ) ) {

						next_sibling.parentNode.removeChild( next_sibling );
						this.a_rowExpansions.splice( hash_index, 1 );
						this._setRecordState( record_id, 'expanded', false );
						
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

			restoreExpandedRows : function(){
				
				var	expanded_rows = this.a_rowExpansions;
				
				if( !expanded_rows.length ){
					
					return;
					
				}

				if( this.a_rowExpansions.length ){

					for( var i = 0, l = expanded_rows.length; l > i; i++ ){

						this.expandRow( expanded_rows[ i ] , true );

					}

				}

			}

		}
	);

	YAHOO.widget.DataTable.ExpansionFormatter = function(el, oRecord, oColumn, oData) {

		var cell_element = Dom.getAncestorByTagName( el, 'td' ),
			state_object = oRecord.getData( STRING_STATENAME ),
			this_static = YAHOO.widget.DataTable.formatExpandRowTrigger;

		//Set trigger
		if( oData ){ //Row is closed

			Dom.addClass( cell_element, CLASS_TRIGGER );

		} else {
			
			Dom.addClass( cell_element, CLASS_NODATA );
			
		}

	}
	
})();
