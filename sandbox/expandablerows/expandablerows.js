/**********
*
* Expandable Rows Plugin for the YUI DataTable
* Author: gelinase@yahoo-inc.com / Eric Gelinas
* @submodule Row Expansion
* @class YAHOO.widget.DataTable
***********/

(function(){

	var	Dom               = YAHOO.util.Dom

			STRING_STATENAME  = 'yui_dt_state',

			CLASS_EXPANDED    = 'yui-dt-expanded',
			CLASS_COLLAPSED   = 'yui-dt-collapsed',
			CLASS_EXPANSION   = 'yui-dt-expansion',
			CLASS_LINER       = 'yui-dt-liner',

			//From YUI 3
			indexOf = function(a, val) {
				for (var i=0; i<a.length; i=i+1) {
					if (a[i] === val) {
						return i;
					}
				}

				return -1;
			};

	YAHOO.lang.augmentObject( 
		YAHOO.widget.DataTable.prototype , 
		{

			/////////////////////////////////////////////////////////////////////////////
			//
			// Private members
			//
			/////////////////////////////////////////////////////////////////////////////
			/**
				* Unique id assigned to instance "yui-ceditorN", useful prefix for generating unique
				* DOM ID strings and log messages.
				* @method _getRecordState
				* @param {Mixed} record_id Record / Row / or Index id
				* @param {String} key Key to return within the state object. Default is to return all as a map
				* @return {Object} State data object
				* @type mixed
				* @private
			*/
			_getRecordState : function( record_id, key ){

				var	row_data    = this.getRecord( record_id ),
						row_state   = row_data.getData( STRING_STATENAME ),
						state_data  = ( row_state && key ) ? row_state[ key ] : row_state;

				return state_data || {};

			},

			/**
				* Unique id assigned to instance "yui-ceditorN", useful prefix for generating unique
				* DOM ID strings and log messages.
				* @method _setRecordState
				* @param {Mixed} record_id Record / Row / or Index id
				* @param {String} key Key to use in map
				* @param {Mixed} value Value to assign to the key
				* @return {Object} State data object
				* @type mixed
				* @private
			*/
			_setRecordState : function( record_id, key, value ){

				var	row_data      = this.getRecord( record_id ).getData(),
						merged_data   = row_data[ STRING_STATENAME ] || {};

				merged_data[ key ] = value;

				this.getRecord( record_id ).setData( STRING_STATENAME, merged_data );

				return merged_data;

			},

			initAttributes : function( oConfigs ) {

				oConfigs = oConfigs || {};

				YAHOO.widget.DataTable.superclass.initAttributes.call( this, oConfigs );

					/**
					* @attribute rowExpansionTemplate
					* @description Value for the rowExpansionTemplate attribute.
					* @type String or Function
					* @default ""
					*/

					this.setAttributeConfig("rowExpansionTemplate", {
							value: "",
							validator: function( template ){
						return (
							YAHOO.lang.isString( template ) ||
							YAHOO.lang.isFunction( template )
						);
					},
					method: this.initExpandableRows
					});

			},

			initExpandableRows : function( template ){

				//Set subscribe restore method
				this.subscribe( 'postRenderEvent', this.onEventRestoreExpandableRows );

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

					var	row_data          = this.getRecord( record_id ),
							row               = this.getRow( row_data ),
							new_row           = document.createElement('tr'),
							column_length     = this.getFirstTrEl().childNodes.length,
							expanded_data     = row_data.getData(),
							expanded_content  = null,
							template          = this.rowExpansionTemplate,
							next_sibling      = Dom.getNextSibling( row );

					//Construct expanded row body
					new_row.className = CLASS_EXPANSION;
					var new_column = document.createElement( 'td' );
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

							this.a_rowExpansions.push( this.getRecord( record_id ).getId() );

						}

						Dom.removeClass( row, CLASS_COLLAPSED );
						Dom.addClass( row, CLASS_EXPANDED );

						//Fire custom event
						this.fireEvent( "rowExpandEvent", { record_id : row_data.getId() } );

						return true;

					} else {

						return false;

					} 

				}

			},

			collapseRow : function( record_id ){

				var	row_data    = this.getRecord( record_id ),
						row         = Dom.get( row_data.getId() ),
						state       = row_data.getData( STRING_STATENAME );

				if( state && state.expanded ){

					var	next_sibling    = Dom.getNextSibling( row ),
							hash_index      = indexOf( this.a_rowExpansions, record_id );

					if( Dom.hasClass( next_sibling, CLASS_EXPANSION ) ) {

						next_sibling.parentNode.removeChild( next_sibling );
						this.a_rowExpansions.splice( hash_index, 1 );
						this._setRecordState( record_id, 'expanded', false );

						Dom.addClass( row, CLASS_COLLAPSED );
						Dom.removeClass( row, CLASS_EXPANDED );

						//Fire custom event
						this.fireEvent("rowCollapseEvent", { record_id : row_data.getId() } );

						return true;

					} else {

						return false;

					}

				}

			},

			collapseAllRows : function(){

				var rows = this.a_rowExpansions;

				for( var i = 0, l = rows.length; l > i; i++ ){

					this.collapseRow( rows[ i ] );

				}

				a_rowExpansions = [];

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

			},

			onEventRestoreExpandableRows : function( oArgs ){

				this.restoreExpandedRows();

			},

			onEventToggleRowExpansion : function( oArgs ){

				if( YAHOO.util.Dom.hasClass( oArgs.target, 'yui-dt-expandablerow-trigger' ) ){

					this.toggleRowExpansion( oArgs.target );

				}

			}

		}, true //This boolean is needed to override members of the original object
	);

})();
