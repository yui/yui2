/**
  * @for Connect
  */
(function() {
	var YCM = YAHOO.util.Connect,
		_xdrReady = new YAHOO.util.CustomEvent('xdrReady'),
		_fn = {};

   /**
    * @description This method creates and instantiates the Flash transport.
    * @method _swf
    * @private
    * @static
    * @param {string} URI to connection.swf.
    * @return {void}
    */
	function _swf(uri) {
		var o = '<object id="YUIConnectionSwf" type="application/x-shockwave-flash" data="' +
		        uri + '" width="0" height="0">' +
		     	'<param name="movie" value="' + uri + '">' +
                '<param name="allowScriptAccess" value="always">' +
		    	'</object>',
		    c = document.createElement('div');

		document.body.appendChild(c);
		c.innerHTML = o;
	}

   /**
    * @description This method calls the public method on the
    * Flash transport to start the XDR transaction.  It is analogous
    * to Connection Manager's asyncRequest method.
    * @method xdr
    * @private
    * @static
    * @param {object} The transaction object.
    * @param {string} HTTP request method.
    * @param {string} URI for the transaction.
    * @param {object} The transaction's callback object.
    * @param {object} The JSON object used as HTTP POST data.
    * @return {void}
    */
	function _xdr(o, m, u, c, d) {
		_fn[YAHOO.lang.isNumber(o.tId) ? o.tId : null] = { 'o':o, 'c':c };
		if (d) {
			c.method = m;
			c.data = d;
		}

		o.conn.send(u, c, o.tId);
	}

   /**
    * @description This method instantiates the Flash transport and
    * establishes a static reference to it, used for all XDR requests.
    * @method transport
    * @public
    * @static
    * @param {string} URI to connection.swf.
    * @return {void}
    */
	function _init(uri) {
		_swf(uri);
		YCM._transport = document.getElementById('YUIConnectionSwf');
	}

	function _xdrReady() {
		_xdrReady.fire();
	}

   /**
    * @description This method fires the global and transaction start
    * events.
    * @method _xdrStart
    * @private
    * @static
    * @param {object} The transaction object.
    * @param {string} The transaction's callback object.
    * @return {void}
    */
	function _xdrStart(o, cb) {
		if(o){
			// Fire global custom event -- startEvent
			this.startEvent.fire(o, cb.argument);

			if(o.startEvent){
				// Fire transaction custom event -- startEvent
				o.startEvent.fire(o, cb.argument);
			}
		}
	}

   /**
    * @description This method is the initial response handler
    * for XDR transactions.  The Flash transport calls this
    * function and sends the response payload.
    * @method handleXdrResponse
    * @private
    * @static
    * @param {object} The response object sent from the Flash transport.
    * @return {void}
    */
	function _handleXdrResponse(r) {
		if (r.statusText === 'xdr:start') {
			_xdrStart(o, cb);
			return;
		}

		var o = _fn[r.tId].o,
			cb = _fn[r.tId].c,
			isAbort = (r.statusText === 'xdr:abort') ? true : false;

		o.r = r;
		if (cb.argument) {
			o.response.argument = cb.argument;
		}

		this.handleTransactionResponse(o, cb, isAbort);
		delete _fn[r.tId];
	}

	// Bind the functions to Connection Manager as static fields.
	YCM.xdr = _xdr;
	YCM.swf = _swf;
	YCM.transport = _init;
	YCM.xdrReady = _xdrReady;
	YCM.handleXdrResponse = _handleXdrResponse;
})();