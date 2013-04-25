(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        items = null,
        openWindow = function(node, print) {
            var n = Dom.get(node.id + '-plain'),
                code = n.value, win = null,
                h = n.offsetHeight;

            code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            win = window.open('', "codeview", "status=0,scrollbars=1,width=600,height=400,menubar=0,toolbar=0,directories=0"); 
            win.document.body.innerHTML = '<pre>' + code + '</pre>';

            if (print) {
                YAHOO.lang.later(1000, win, function() {
                    win.focus();
                    win.print();
                    win.focus();
                });
            }
        },
        handleClick = function(e) {
            var tar = Event.getTarget(e);
            if (tar.tagName.toLowerCase() == 'a') {
                var type = tar.innerHTML.replace(/ /g, '');
                switch (type) {
                    case 'print':
                        openWindow(tar.parentNode.parentNode, true);
                        break;
                    case 'viewplain':
                        openWindow(tar.parentNode.parentNode);
                        break;
                    case 'togglelinenumbers':
                        if (Dom.hasClass(tar.parentNode.parentNode, 'yui-syntax-highlight-linenumbers')) {
                            Dom.removeClass(tar.parentNode.parentNode, 'yui-syntax-highlight-linenumbers')
                        } else {
                            Dom.addClass(tar.parentNode.parentNode, 'yui-syntax-highlight-linenumbers')
                        }
                        break;
                    case 'copy':
                        break;
                }
            }
            Event.stopEvent(e);
        },
        init = function() {
            items = Dom.getElementsByClassName('yui-syntax-highlight');
            for (var i = 0; i < items.length; i++) {
                var header = document.createElement('div');
                header.className = 'syn-header hidden';
                header.innerHTML = '<a href="#">view plain</a> | <a href="#">print</a> | <a href="#">toggle line numbers</a>';
                Event.on(header, 'click', handleClick);
                items[i].insertBefore(header, items[i].firstChild);
                Event.on(items[i], 'mouseenter', function(e) {
                    var tar = Dom.getElementsByClassName('syn-header', 'div', Event.getTarget(e));
                    Dom.removeClass(tar, 'hidden');
                });
                Event.on(items[i], 'mouseleave', function(e) {
                    var tar = Dom.getElementsByClassName('syn-header', 'div', Event.getTarget(e));
                    Dom.addClass(tar, 'hidden');
                });
            }
        };


        var loader = new YAHOO.util.YUILoader({
            require: ["event-mouseenter"],
            base: '../../../2.x/build/',
            onSuccess: init,
            timeout: 10000
        });
        loader.insert();


})();

/*
if (YUI) {
    YUI(yuiConfig).use('node', 'event-mouseenter', 'later', function(Y) {
        var items = Y.all('.yui-syntax-highlight'),
            openWindow = function(node, print) {
                var n = Y.get('#' + node.get('id') + '-plain'),
                    code = n.get('value'), win = null,
                    h = n.get('offsetHeight');

                code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                win = window.open('', "codeview", "status=0,scrollbars=1,width=600,height=400,menubar=0,toolbar=0,directories=0"); 
                win.document.body.innerHTML = '<pre>' + code + '</pre>';

                if (print) {
                    Y.later(1000, win, function() {
                        win.focus();
                        win.print();
                        win.focus();
                    });
                }
            },
            handleClick = function(e) {
                if (e.target.get('tagName').toLowerCase() == 'a') {
                    var type = e.target.get('innerHTML').replace(/ /g, '');
                    switch (type) {
                        case 'print':
                            openWindow(e.target.get('parentNode.parentNode'), true);
                            break;
                        case 'viewplain':
                            openWindow(e.target.get('parentNode.parentNode'));
                            break;
                        case 'togglelinenumbers':
                            e.target.get('parentNode.parentNode').toggleClass('yui-syntax-highlight-linenumbers');
                            break;
                        case 'copy':
                            break;
                    }
                }
                e.halt();
            };



        items.each(function(i) {
            //var header = Y.Node.create('<div class="syn-header hidden"><a href="#">view plain</a> | <a href="#">print</a> | <a href="#">copy</a></div>');
            var header = Y.Node.create('<div class="syn-header hidden"><a href="#">view plain</a> | <a href="#">print</a> | <a href="#">toggle line numbers</a></div>');
            header.on('click', handleClick);
            i.insertBefore(header, i.get('firstChild'));
            i.on('mouseenter', function() {
                header.removeClass('hidden');
            });
            i.on('mouseleave', function() {
                header.addClass('hidden');
            });
        });
    });
}
*/
