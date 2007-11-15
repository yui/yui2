/**
 * @module editor
 * @description <p>The Rich Text Editor is a UI control that replaces a standard HTML textarea; it allows for the rich formatting of text content, including common structural treatments like lists, formatting treatments like bold and italic text, and drag-and-drop inclusion and sizing of images. The Rich Text Editor's toolbar is extensible via a plugin architecture so that advanced implementations can achieve a high degree of customization.</p>
 * @namespace YAHOO.widget
 * @requires yahoo, dom, element, event, container_core, simpleeditor
 * @optional dragdrop, animation, menu, button
 * @beta
 */

(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang,
    Toolbar = YAHOO.widget.Toolbar;

    /**
     * The Rich Text Editor is a UI control that replaces a standard HTML textarea; it allows for the rich formatting of text content, including common structural treatments like lists, formatting treatments like bold and italic text, and drag-and-drop inclusion and sizing of images. The Rich Text Editor's toolbar is extensible via a plugin architecture so that advanced implementations can achieve a high degree of customization.
     * @constructor
     * @class Editor
     * @extends YAHOO.widget.SimpleEditor
     * @param {String/HTMLElement} el The textarea element to turn into an editor.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */
    
    YAHOO.widget.Editor = function(el, attrs) {
        YAHOO.log('Editor Initalizing', 'info', 'Editor');
        
        var oConfig = {
            element: null,
            attributes: (attrs || {})
        }, id = null;

        if (Lang.isString(el)) {
            id = el;
        } else {
            id = el.id;
        }
        oConfig.element = el;
        YAHOO.widget.Editor.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };

    /**
    * @private
    * @method _cleanClassName
    * @description Makes a useable classname from dynamic data, by dropping it to lowercase and replacing spaces with -'s.
    * @param {String} str The classname to clean up
    * @returns {String}
    */
    function _cleanClassName(str) {
        return str.replace(/ /g, '-').toLowerCase();
    }


    YAHOO.extend(YAHOO.widget.Editor, YAHOO.widget.SimpleEditor, {
        /**
        * @property STR_BEFORE_EDITOR
        * @description The accessibility string for the element before the iFrame
        * @type String
        */
        STR_BEFORE_EDITOR: 'This text field can contain stylized text and graphics. To cycle through all formatting options, use the keyboard shortcut Control + Shift + T to place focus on the toolbar and navigate between option heading names. <h4>Common formatting keyboard shortcuts:</h4><ul><li>Control Shift B sets text to bold</li> <li>Control Shift I sets text to italic</li> <li>Control Shift U underlines text</li> <li>Control Shift [ aligns text left</li> <li>Control Shift | centers text</li> <li>Control Shift ] aligns text right</li> <li>Control Shift L adds an HTML link</li> <li>To exit this text editor use the keyboard shortcut Control + Shift + ESC.</li></ul>',    
        /**
        * @property STR_CLOSE_WINDOW
        * @description The Title of the close button in the Editor Window
        * @type String
        */
        STR_CLOSE_WINDOW: 'Close Window',
        /**
        * @property STR_CLOSE_WINDOW_NOTE
        * @description A note appearing in the Editor Window to tell the user that the Escape key will close the window
        * @type String
        */
        STR_CLOSE_WINDOW_NOTE: 'To close this window use the Control + Shift + W key',
        /**
        * @property STR_IMAGE_PROP_TITLE
        * @description The title for the Image Property Editor Window
        * @type String
        */
        STR_IMAGE_PROP_TITLE: 'Image Options',
        /**
        * @property STR_IMAGE_URL
        * @description The label string for Image URL
        * @type String
        */
        STR_IMAGE_URL: 'Image Url',
        /**
        * @property STR_IMAGE_TITLE
        * @description The label string for Image Description
        * @type String
        */
        STR_IMAGE_TITLE: 'Description',
        /**
        * @property STR_IMAGE_SIZE
        * @description The label string for Image Size
        * @type String
        */
        STR_IMAGE_SIZE: 'Size',
        /**
        * @property STR_IMAGE_ORIG_SIZE
        * @description The label string for Original Image Size
        * @type String
        */
        STR_IMAGE_ORIG_SIZE: 'Original Size',
        /**
        * @property STR_IMAGE_COPY
        * @description The label string for the image copy and paste message for Opera and Safari
        * @type String
        */
        STR_IMAGE_COPY: '<span class="tip"><span class="icon icon-info"></span><strong>Note:</strong>To move this image just highlight it, cut, and paste where ever you\'d like.</span>',
        /**
        * @property STR_IMAGE_PADDING
        * @description The label string for the image padding.
        * @type String
        */
        STR_IMAGE_PADDING: 'Padding',
        /**
        * @property STR_IMAGE_BORDER
        * @description The label string for the image border.
        * @type String
        */
        STR_IMAGE_BORDER: 'Border',
        /**
        * @property STR_IMAGE_TEXTFLOW
        * @description The label string for the image text flow.
        * @type String
        */
        STR_IMAGE_TEXTFLOW: 'Text Flow',
        /**
        * @property STR_LOCAL_FILE_WARNING
        * @description The label string for the local file warning.
        * @type String
        */
        STR_LOCAL_FILE_WARNING: '<span class="tip"><span class="icon icon-warn"></span><strong>Note:</strong>This image/link points to a file on your computer and will not be accessible to others on the internet.</span>',
        /**
        * @property STR_LINK_PROP_TITLE
        * @description The label string for the Link Property Editor Window.
        * @type String
        */
        STR_LINK_PROP_TITLE: 'Link Options',
        /**
        * @property STR_LINK_PROP_REMOVE
        * @description The label string for the Remove link from text link inside the property editor.
        * @type String
        */
        STR_LINK_PROP_REMOVE: 'Remove link from text',
        /**
        * @property STR_LINK_NEW_WINDOW
        * @description The string for the open in a new window label.
        * @type String
        */
        STR_LINK_NEW_WINDOW: 'Open in a new window.',
        /**
        * @property STR_LINK_TITLE
        * @description The string for the link description.
        * @type String
        */
        STR_LINK_TITLE: 'Description',
        /**
        * @protected
        * @property CLASS_LOCAL_FILE
        * @description CSS class applied to an element when it's found to have a local url.
        * @type String
        */
        CLASS_LOCAL_FILE: 'warning-localfile',
        /**
        * @protected
        * @property CLASS_HIDDEN
        * @description CSS class applied to the body when the hiddenelements button is pressed.
        * @type String
        */
        CLASS_HIDDEN: 'yui-hidden',
        /** 
        * @method init
        * @description The Editor class' initialization method
        */
        init: function(p_oElement, p_oAttributes) {
            YAHOO.log('init', 'info', 'Editor');
            YAHOO.widget.Editor.superclass.init.call(this, p_oElement, p_oAttributes);
        },
        /**
        * @method initAttributes
        * @description Initializes all of the configuration attributes used to create 
        * the editor.
        * @param {Object} attr Object literal specifying a set of 
        * configuration attributes used to create the editor.
        */
        initAttributes: function(attr) {
            YAHOO.widget.Editor.superclass.initAttributes.call(this, attr);

            /**
            * @attribute localFileWarning
            * @description Should we throw the warning if we detect a file that is local to their machine?
            * @default true
            * @type Boolean
            */            
            this.setAttributeConfig('localFileWarning', {
                value: attr.locaFileWarning || true
            });

            /**
            * @attribute hiddencss
            * @description The CSS used to show/hide hidden elements on the page, these rules must be prefixed with the class provided in <code>this.CLASS_HIDDEN</code>
            * @default <code><pre>
            .yui-hidden font, .yui-hidden strong, .yui-hidden b, .yui-hidden em, .yui-hidden i, .yui-hidden u, .yui-hidden div, .yui-hidden p, .yui-hidden span, .yui-hidden img, .yui-hidden ul, .yui-hidden ol, .yui-hidden li, .yui-hidden table {
                border: 1px dotted #ccc;
            }
            .yui-hidden .yui-non {
                border: none;
            }
            .yui-hidden img {
                padding: 2px;
            }</pre></code>
            * @type String
            */            
            this.setAttributeConfig('hiddencss', {
                value: attr.hiddencss || '.yui-hidden font, .yui-hidden strong, .yui-hidden b, .yui-hidden em, .yui-hidden i, .yui-hidden u, .yui-hidden div,.yui-hidden p,.yui-hidden span,.yui-hidden img, .yui-hidden ul, .yui-hidden ol, .yui-hidden li, .yui-hidden table { border: 1px dotted #ccc; } .yui-hidden .yui-non { border: none; } .yui-hidden img { padding: 2px; }',
                writeOnce: true
            });
           
        },
        /**
        * @private
        * @method _fixNodes
        * @description Fix href and imgs as well as remove invalid HTML.
        */
        _fixNodes: function() {
            YAHOO.widget.Editor.superclass._fixNodes.call(this);
            var url = '';

            var imgs = this._getDoc().getElementsByTagName('img');
            for (var im = 0; im < imgs.length; im++) {
                if (imgs[im].getAttribute('href', 2)) {
                    url = imgs[im].getAttribute('src', 2);
                    if (this._isLocalFile(url)) {
                        Dom.addClass(imgs[im], this.CLASS_LOCAL_FILE);
                    } else {
                        Dom.removeClass(imgs[im], this.CLASS_LOCAL_FILE);
                    }
                }
            }
            var fakeAs = this._getDoc().body.getElementsByTagName('a');
            for (var a = 0; a < fakeAs.length; a++) {
                if (fakeAs[a].getAttribute('href', 2)) {
                    url = fakeAs[a].getAttribute('href', 2);
                    if (this._isLocalFile(url)) {
                        Dom.addClass(fakeAs[a], this.CLASS_LOCAL_FILE);
                    } else {
                        Dom.removeClass(fakeAs[a], this.CLASS_LOCAL_FILE);
                    }
                }
            }
        },
        /**
        * @private
        * @property _disabled
        * @description The Toolbar items that should be disabled if there is no selection present in the editor.
        * @type Array
        */
        _disabled: [ 'createlink', 'forecolor', 'backcolor', 'fontname', 'fontsize', 'superscript', 'subscript', 'removeformat', 'heading', 'indent' ],
        /**
        * @private
        * @property _alwaysDisabled
        * @description The Toolbar items that should ALWAYS be disabled event if there is a selection present in the editor.
        * @type Object
        */
        _alwaysDisabled: { 'outdent': true },
        /**
        * @private
        * @property _alwaysEnabled
        * @description The Toolbar items that should ALWAYS be enabled event if there isn't a selection present in the editor.
        * @type Object
        */
        _alwaysEnabled: { hiddenelements: true },
        /**
        * @property _defaultToolbar
        * @private
        * @description Default toolbar config.
        * @type Object
        */
        _defaultToolbar: {
            collapse: true,
            titlebar: 'Text Editing Tools',
            draggable: false,
            buttonType: 'advanced',
            buttons: [
                { group: 'fontstyle', label: 'Font Name and Size',
                    buttons: [
                        { type: 'select', label: 'Arial', value: 'fontname', disabled: true,
                            menu: [
                                { text: 'Arial', checked: true },
                                { text: 'Arial Black' },
                                { text: 'Comic Sans MS' },
                                { text: 'Courier New' },
                                { text: 'Lucida Console' },
                                { text: 'Tahoma' },
                                { text: 'Times New Roman' },
                                { text: 'Trebuchet MS' },
                                { text: 'Verdana' }
                            ]
                        },
                        { type: 'spin', label: '13', value: 'fontsize', range: [ 9, 75 ], disabled: true }
                    ]
                },
                { type: 'separator' },
                { group: 'textstyle', label: 'Font Style',
                    buttons: [
                        { type: 'push', label: 'Bold CTRL + SHIFT + B', value: 'bold' },
                        { type: 'push', label: 'Italic CTRL + SHIFT + I', value: 'italic' },
                        { type: 'push', label: 'Underline CTRL + SHIFT + U', value: 'underline' },
                        { type: 'separator' },
                        { type: 'push', label: 'Subscript', value: 'subscript', disabled: true },
                        { type: 'push', label: 'Superscript', value: 'superscript', disabled: true },
                        { type: 'separator' },
                        { type: 'color', label: 'Font Color', value: 'forecolor', disabled: true },
                        { type: 'color', label: 'Background Color', value: 'backcolor', disabled: true },
                        { type: 'separator' },
                        { type: 'push', label: 'Remove Formatting', value: 'removeformat', disabled: true },
                        { type: 'push', label: 'Show/Hide Hidden Elements', value: 'hiddenelements' }
                    ]
                },
                { type: 'separator' },
                { group: 'alignment', label: 'Alignment',
                    buttons: [
                        { type: 'push', label: 'Align Left CTRL + SHIFT + [', value: 'justifyleft' },
                        { type: 'push', label: 'Align Center CTRL + SHIFT + |', value: 'justifycenter' },
                        { type: 'push', label: 'Align Right CTRL + SHIFT + ]', value: 'justifyright' },
                        { type: 'push', label: 'Justify', value: 'justifyfull' }
                    ]
                },
                { type: 'separator' },
                { group: 'parastyle', label: 'Paragraph Style',
                    buttons: [
                    { type: 'select', label: 'Normal', value: 'heading', disabled: true,
                        menu: [
                            { text: 'Normal', value: 'none', checked: true },
                            { text: 'Header 1', value: 'h1' },
                            { text: 'Header 2', value: 'h2' },
                            { text: 'Header 3', value: 'h3' },
                            { text: 'Header 4', value: 'h4' },
                            { text: 'Header 5', value: 'h5' },
                            { text: 'Header 6', value: 'h6' }
                        ]
                    }
                    ]
                },
                { type: 'separator' },
                { group: 'indentlist', label: 'Indenting and Lists',
                    buttons: [
                        { type: 'push', label: 'Indent', value: 'indent', disabled: true },
                        { type: 'push', label: 'Outdent', value: 'outdent', disabled: true },
                        { type: 'push', label: 'Create an Unordered List', value: 'insertunorderedlist' },
                        { type: 'push', label: 'Create an Ordered List', value: 'insertorderedlist' }
                    ]
                },
                { type: 'separator' },
                { group: 'insertitem', label: 'Insert Item',
                    buttons: [
                        { type: 'push', label: 'HTML Link CTRL + SHIFT + L', value: 'createlink', disabled: true },
                        { type: 'push', label: 'Insert Image', value: 'insertimage' }
                    ]
                }
            ]
        },
        /**
        * @private
        * @method _handleKeyDown
        * @param {Event} ev The event we are working on.
        * @description Override method that handles some new keydown events inside the iFrame document.
        */
        _handleKeyDown: function(ev) {
            YAHOO.widget.Editor.superclass._handleKeyDown.call(this, ev);
            var doExec = false,
                action = null,
                exec = false;

            if (ev.shiftKey && ev.ctrlKey) {
                doExec = true;
            }
            switch (ev.keyCode) {
                case 219: //Left
                    action = 'justifyleft';
                    break;
                case 220: //Center
                    action = 'justifycenter';
                    break;
                case 221: //Right
                    action = 'justifyright';
                    break;
            }
            if (doExec && action) {
                this.execCommand(action, null);
                Event.stopEvent(ev);
                this.nodeChange();
            }
        },        
        _handleCreateLinkClick: function() {
            var el = this._getSelectedElement();
            if (this._isElement(el, 'img')) {
                this.STOP_EXEC_COMMAND = true;
                this.currentElement[0] = el;
                this.toolbar.fireEvent('insertimageClick', { type: 'insertimageClick', target: this.toolbar });
                this.fireEvent('afterExecCommand', { type: 'afterExecCommand', target: this });
                return false;
            }
            if (this.get('limitCommands')) {
                if (!this.toolbar.getButtonByValue('createlink')) {
                    YAHOO.log('Toolbar Button for (createlink) was not found, skipping exec.', 'info', 'Editor');
                    return false;
                }
            }
            
            this.on('afterExecCommand', function() {

                var win = new YAHOO.widget.EditorWindow('createlink', {
                    width: '350px'
                });
                
                var el = this.currentElement[0],
                    url = '',
                    title = '',
                    target = '',
                    localFile = false;
                if (el) {
                    if (el.getAttribute('href', 2) !== null) {
                        url = el.getAttribute('href', 2);
                        if (this._isLocalFile(url)) {
                            //Local File throw Warning
                            YAHOO.log('Local file reference found, show local warning', 'warn', 'Editor');
                            win.setFooter(this.STR_LOCAL_FILE_WARNING);
                            localFile = true;
                        } else {
                            win.setFooter(' ');
                        }
                    }
                    if (el.getAttribute('title') !== null) {
                        title = el.getAttribute('title');
                    }
                    if (el.getAttribute('target') !== null) {
                        target = el.getAttribute('target');
                    }
                }
                var str = '<label for="createlink_url"><strong>' + this.STR_LINK_URL + ':</strong> <input type="text" name="createlink_url" id="createlink_url" value="' + url + '"' + ((localFile) ? ' class="warning"' : '') + '></label>';
                str += '<label for="createlink_target"><strong>&nbsp;</strong><input type="checkbox" name="createlink_target_" id="createlink_target" value="_blank"' + ((target) ? ' checked' : '') + '> ' + this.STR_LINK_NEW_WINDOW + '</label>';
                str += '<label for="createlink_title"><strong>' + this.STR_LINK_TITLE + ':</strong> <input type="text" name="createlink_title" id="createlink_title" value="' + title + '"></label>';
                
                var body = document.createElement('div');
                body.innerHTML = str;

                var unlinkCont = document.createElement('div');
                unlinkCont.className = 'removeLink';
                var unlink = document.createElement('a');
                unlink.href = '#';
                unlink.innerHTML = this.STR_LINK_PROP_REMOVE;
                unlink.title = this.STR_LINK_PROP_REMOVE;
                Event.on(unlink, 'click', function(ev) {
                    Event.stopEvent(ev);
                    this.execCommand('unlink');
                    this.closeWindow();
                }, this, true);
                unlinkCont.appendChild(unlink);
                body.appendChild(unlinkCont);

                win.setHeader(this.STR_LINK_PROP_TITLE);
                win.setBody(body);

                Event.onAvailable('createlink_url', function() {
                    window.setTimeout(function() {
                        try {
                            YAHOO.util.Dom.get('createlink_url').focus();
                        } catch (e) {}
                    }, 50);
                    Event.on('createlink_url', 'blur', function() {
                        var url = Dom.get('createlink_url');
                        if (this._isLocalFile(url.value)) {
                            //Local File throw Warning
                            Dom.addClass(url, 'warning');
                            YAHOO.log('Local file reference found, show local warning', 'warn', 'Editor');
                            this.get('panel').setFooter(this.STR_LOCAL_FILE_WARNING);
                        } else {
                            Dom.removeClass(url, 'warning');
                            this.get('panel').setFooter(' ');
                        }
                    }, this, true);
                }, this, true);

                this.openWindow(win);
            });
        },
        /**
        * @private
        * @method _handleCreateLinkWindowClose
        * @description Handles the closing of the Link Properties Window.
        */
        _handleCreateLinkWindowClose: function() {
            var url = Dom.get('createlink_url'),
                target = Dom.get('createlink_target'),
                title = Dom.get('createlink_title'),
                el = this.currentElement[0],
                a = el;
            if (url && url.value) {
                var urlValue = url.value;
                if ((urlValue.indexOf(':/'+'/') == -1) && (urlValue.substring(0,1) != '/') && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                    if ((urlValue.indexOf('@') != -1) && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                        //Found an @ sign, prefix with mailto:
                        urlValue = 'mailto:' + urlValue;
                    } else {
                        /* :// not found adding */
                        if (urlValue.substring(0, 1) != '#') {
                            urlValue = 'http:/'+'/' + urlValue;
                        }
                        
                    }
                }
                el.setAttribute('href', urlValue);
                if (target.checked) {
                    el.setAttribute('target', target.value);
                } else {
                    el.setAttribute('target', '');
                }
                el.setAttribute('title', ((title.value) ? title.value : ''));

            } else {
                var _span = this._getDoc().createElement('span');
                _span.innerHTML = el.innerHTML;
                Dom.addClass(_span, 'yui-non');
                el.parentNode.replaceChild(_span, el);
            }
            this.nodeChange();
            this.currentElement = [];
        },
        /**
        * @private
        * @method _handleInsertImageClick
        * @description Opens the Image Properties Window when the insert Image button is clicked or an Image is Double Clicked.
        */
        _handleInsertImageClick: function() {
            if (this.get('limitCommands')) {
                if (!this.toolbar.getButtonByValue('insertimage')) {
                    YAHOO.log('Toolbar Button for (insertimage) was not found, skipping exec.', 'info', 'Editor');
                    return false;
                }
            }
            this._setBusy();
            this.on('afterExecCommand', function() {
                var el = this.currentElement[0],
                    body = null,
                    link = '',
                    target = '',
                    title = '',
                    src = '',
                    align = '',
                    height = 75,
                    width = 75,
                    padding = 0,
                    oheight = 0,
                    owidth = 0,
                    blankimage = false,
                    win = new YAHOO.widget.EditorWindow('insertimage', {
                        width: '415px'
                    });

                if (!el) {
                    el = this._getSelectedElement();
                }
                if (el) {
                    if (el.getAttribute('src')) {
                        src = el.getAttribute('src', 2);
                        if (src.indexOf(this.get('blankimage')) != -1) {
                            src = this.STR_IMAGE_HERE;
                            blankimage = true;
                        }
                    }
                    if (el.getAttribute('alt', 2)) {
                        title = el.getAttribute('alt', 2);
                    }
                    if (el.getAttribute('title', 2)) {
                        title = el.getAttribute('title', 2);
                    }

                    if (el.parentNode && this._isElement(el.parentNode, 'a')) {
                        link = el.parentNode.getAttribute('href', 2);
                        if (el.parentNode.getAttribute('target') !== null) {
                            target = el.parentNode.getAttribute('target');
                        }
                    }
                    height = parseInt(el.height, 10);
                    width = parseInt(el.width, 10);
                    if (el.style.height) {
                        height = parseInt(el.style.height, 10);
                    }
                    if (el.style.width) {
                        width = parseInt(el.style.width, 10);
                    }
                    if (el.style.margin) {
                        padding = parseInt(el.style.margin, 10);
                    }
                    if (!el._height) {
                        el._height = height;
                    }
                    if (!el._width) {
                        el._width = width;
                    }
                    oheight = el._height;
                    owidth = el._width;
                }
                var str = '<label for="insertimage_url"><strong>' + this.STR_IMAGE_URL + ':</strong> <input type="text" id="insertimage_url" value="' + src + '" size="40"></label>';
                body = document.createElement('div');
                body.innerHTML = str;

                var tbarCont = document.createElement('div');
                tbarCont.id = 'img_toolbar';
                body.appendChild(tbarCont);

                var str2 = '<label for="insertimage_title"><strong>' + this.STR_IMAGE_TITLE + ':</strong> <input type="text" id="insertimage_title" value="' + title + '" size="40"></label>';
                str2 += '<label for="insertimage_link"><strong>' + this.STR_LINK_URL + ':</strong> <input type="text" name="insertimage_link" id="insertimage_link" value="' + link + '"></label>';
                str2 += '<label for="insertimage_target"><strong>&nbsp;</strong><input type="checkbox" name="insertimage_target_" id="insertimage_target" value="_blank"' + ((target) ? ' checked' : '') + '> ' + this.STR_LINK_NEW_WINDOW + '</label>';
                var div = document.createElement('div');
                div.innerHTML = str2;
                body.appendChild(div);
                win.cache = body;

                var tbar = new YAHOO.widget.Toolbar(tbarCont, {
                    /* {{{ */ 
                    buttonType: this._defaultToolbar.buttonType,
                    buttons: [
                        { group: 'textflow', label: this.STR_IMAGE_TEXTFLOW + ':',
                            buttons: [
                                { type: 'push', label: 'Left', value: 'left' },
                                { type: 'push', label: 'Inline', value: 'inline' },
                                { type: 'push', label: 'Block', value: 'block' },
                                { type: 'push', label: 'Right', value: 'right' }
                            ]
                        },
                        { type: 'separator' },
                        { group: 'padding', label: this.STR_IMAGE_PADDING + ':',
                            buttons: [
                                { type: 'spin', label: ''+padding, value: 'padding', range: [0, 50] }
                            ]
                        },
                        { type: 'separator' },
                        { group: 'border', label: this.STR_IMAGE_BORDER + ':',
                            buttons: [
                                { type: 'select', label: 'Border Size', value: 'bordersize',
                                    menu: [
                                        { text: 'none', value: '0', checked: true },
                                        { text: '1px', value: '1' },
                                        { text: '2px', value: '2' },
                                        { text: '3px', value: '3' },
                                        { text: '4px', value: '4' },
                                        { text: '5px', value: '5' }
                                    ]
                                },
                                { type: 'select', label: 'Border Type', value: 'bordertype', disabled: true,
                                    menu: [
                                        { text: 'Solid', value: 'solid', checked: true },
                                        { text: 'Dashed', value: 'dashed' },
                                        { text: 'Dotted', value: 'dotted' }
                                    ]
                                },
                                { type: 'color', label: 'Border Color', value: 'bordercolor', disabled: true }
                            ]
                        }
                    ]
                    /* }}} */
                });
                
                var bsize = '0';
                var btype = 'solid';
                if (el.style.borderLeftWidth) {
                    bsize = parseInt(el.style.borderLeftWidth, 10);
                }
                if (el.style.borderLeftStyle) {
                    btype = el.style.borderLeftStyle;
                }
                var bs_button = tbar.getButtonByValue('bordersize');
                var bSizeStr = ((parseInt(bsize, 10) > 0) ? '' : 'none');
                bs_button.set('label', '<span class="yui-toolbar-bordersize-' + bsize + '">'+bSizeStr+'</span>');
                this._updateMenuChecked('bordersize', bsize, tbar);

                var bt_button = tbar.getButtonByValue('bordertype');
                bt_button.set('label', '<span class="yui-toolbar-bordertype-' + btype + '"></span>');
                this._updateMenuChecked('bordertype', btype, tbar);
                if (parseInt(bsize, 10) > 0) {
                    tbar.enableButton(bt_button);
                    tbar.enableButton(bs_button);
                }

                var cont = tbar.get('cont');
                var hw = document.createElement('div');
                hw.className = 'yui-toolbar-group yui-toolbar-group-height-width height-width';
                hw.innerHTML = '<h3>' + this.STR_IMAGE_SIZE + ':</h3>';
                var orgSize = '';
                if ((height != oheight) || (width != owidth)) {
                    orgSize = '<span class="info">' + this.STR_IMAGE_ORIG_SIZE + '<br>'+ owidth +' x ' + oheight + '</span>';
                }
                hw.innerHTML += '<span><input type="text" size="3" value="'+width+'" id="insertimage_width"> x <input type="text" size="3" value="'+height+'" id="insertimage_height"></span>' + orgSize;
                cont.insertBefore(hw, cont.firstChild);

                Event.onAvailable('insertimage_width', function() {
                    Event.on('insertimage_width', 'blur', function() {
                        var value = parseInt(Dom.get('insertimage_width').value, 10);
                        if (value > 5) {
                            el.style.width = value + 'px';
                            this.moveWindow();
                        }
                    }, this, true);
                }, this, true);
                Event.onAvailable('insertimage_height', function() {
                    Event.on('insertimage_height', 'blur', function() {
                        var value = parseInt(Dom.get('insertimage_height').value, 10);
                        if (value > 5) {
                            el.style.height = value + 'px';
                            this.moveWindow();
                        }
                    }, this, true);
                }, this, true);

                if ((el.align == 'right') || (el.align == 'left')) {
                    tbar.selectButton(el.align);
                } else if (el.style.display == 'block') {
                    tbar.selectButton('block');
                } else {
                    tbar.selectButton('inline');
                }
                if (parseInt(el.style.marginLeft, 10) > 0) {
                     tbar.getButtonByValue('padding').set('label', ''+parseInt(el.style.marginLeft, 10));
                }
                if (el.style.borderSize) {
                    tbar.selectButton('bordersize');
                    tbar.selectButton(parseInt(el.style.borderSize, 10));
                }

                tbar.on('colorPickerClicked', function(o) {
                    var size = '1', type = 'solid', color = 'black';

                    if (el.style.borderLeftWidth) {
                        size = parseInt(el.style.borderLeftWidth, 10);
                    }
                    if (el.style.borderLeftStyle) {
                        type = el.style.borderLeftStyle;
                    }
                    if (el.style.borderLeftColor) {
                        color = el.style.borderLeftColor;
                    }
                    var borderString = size + 'px ' + type + ' #' + o.color;
                    el.style.border = borderString;
                }, this.toolbar, true);

                tbar.on('buttonClick', function(o) {
                    var value = o.button.value,
                        borderString = '';
                    if (o.button.menucmd) {
                        value = o.button.menucmd;
                    }
                    var size = '1', type = 'solid', color = 'black';

                    /* All border calcs are done on the left border
                        since our default interface only supports
                        one border size/type and color */
                    if (el.style.borderLeftWidth) {
                        size = parseInt(el.style.borderLeftWidth, 10);
                    }
                    if (el.style.borderLeftStyle) {
                        type = el.style.borderLeftStyle;
                    }
                    if (el.style.borderLeftColor) {
                        color = el.style.borderLeftColor;
                    }
                    switch(value) {
                        case 'bordersize':
                            if (this.browser.webkit && this._lastImage) {
                                Dom.removeClass(this._lastImage, 'selected');
                                this._lastImage = null;
                            }

                            borderString = parseInt(o.button.value, 10) + 'px ' + type + ' ' + color;
                            el.style.border = borderString;
                            if (parseInt(o.button.value, 10) > 0) {
                                tbar.enableButton('bordertype');
                                tbar.enableButton('bordercolor');
                            } else {
                                tbar.disableButton('bordertype');
                                tbar.disableButton('bordercolor');
                            }
                            break;
                        case 'bordertype':
                            if (this.browser.webkit && this._lastImage) {
                                Dom.removeClass(this._lastImage, 'selected');
                                this._lastImage = null;
                            }
                            borderString = size + 'px ' + o.button.value + ' ' + color;
                            el.style.border = borderString;
                            break;
                        case 'right':
                        case 'left':
                            tbar.deselectAllButtons();
                            el.style.display = '';
                            el.align = o.button.value;
                            break;
                        case 'inline':
                            tbar.deselectAllButtons();
                            el.style.display = '';
                            el.align = '';
                            break;
                        case 'block':
                            tbar.deselectAllButtons();
                            el.style.display = 'block';
                            el.align = 'center';
                            break;
                        case 'padding':
                            var _button = tbar.getButtonById(o.button.id);
                            el.style.margin = _button.get('label') + 'px';
                            break;
                    }
                    tbar.selectButton(o.button.value);
                    this.moveWindow();
                }, this, true);

                win.setHeader(this.STR_IMAGE_PROP_TITLE);
                win.setBody(body);
                if ((this.browser.webkit && !this.browser.webkit3) || this.browser.opera) {
                    win.setFooter(this.STR_IMAGE_COPY);
                }
                this.openWindow(win);

                //Set event after openWindow..
                Event.onAvailable('insertimage_url', function() {

                    this.toolbar.selectButton('insertimage');

                    window.setTimeout(function() {
                        YAHOO.util.Dom.get('insertimage_url').focus();
                        if (blankimage) {
                            YAHOO.util.Dom.get('insertimage_url').select();
                        }
                    }, 50);
                    
                    if (this.get('localFileWarning')) {
                        Event.on('insertimage_link', 'blur', function() {
                            var url = Dom.get('insertimage_link');
                            if (this._isLocalFile(url.value)) {
                                //Local File throw Warning
                                Dom.addClass(url, 'warning');
                                YAHOO.log('Local file reference found, show local warning', 'warn', 'Editor');
                                this.get('panel').setFooter(this.STR_LOCAL_FILE_WARNING);
                            } else {
                                Dom.removeClass(url, 'warning');
                                this.get('panel').setFooter(' ');
                                if ((this.browser.webkit && !this.browser.webkit3) || this.browser.opera) {
                                    this.get('panel').setFooter(this.STR_IMAGE_COPY);
                                }
                            }
                        }, this, true);

                        Event.on('insertimage_url', 'blur', function() {
                            var url = Dom.get('insertimage_url');
                            if (this._isLocalFile(url.value)) {
                                //Local File throw Warning
                                Dom.addClass(url, 'warning');
                                YAHOO.log('Local file reference found, show local warning', 'warn', 'Editor');
                                this.get('panel').setFooter(this.STR_LOCAL_FILE_WARNING);
                            } else if (this.currentElement[0]) {
                                Dom.removeClass(url, 'warning');
                                this.get('panel').setFooter(' ');
                                if ((this.browser.webkit && !this.browser.webkit3) || this.browser.opera) {
                                    this.get('panel').setFooter(this.STR_IMAGE_COPY);
                                }
                                
                                if (url && url.value && (url.value != this.STR_IMAGE_HERE)) {
                                    this.currentElement[0].setAttribute('src', url.value);
                                    var self = this,
                                        img = new Image();

                                    img.onerror = function() {
                                        url.value = self.STR_IMAGE_HERE;
                                        img.setAttribute('src', self.get('blankimage'));
                                        self.currentElement[0].setAttribute('src', self.get('blankimage'));
                                        YAHOO.util.Dom.get('insertimage_height').value = img.height;
                                        YAHOO.util.Dom.get('insertimage_width').value = img.width;
                                    };
                                    window.setTimeout(function() {
                                        YAHOO.util.Dom.get('insertimage_height').value = img.height;
                                        YAHOO.util.Dom.get('insertimage_width').value = img.width;
                                        if (self.currentElement && self.currentElement[0]) {
                                            if (!self.currentElement[0]._height) {
                                                self.currentElement[0]._height = img.height;
                                            }
                                            if (!self.currentElement[0]._width) {
                                                self.currentElement[0]._width = img.width;
                                            }
                                        }
                                        self.moveWindow();
                                    }, 200);

                                    if (url.value != this.STR_IMAGE_HERE) {
                                        img.src = url.value;
                                    }
                                }
                            }
                        }, this, true);
                    }
                }, this, true);
            });
        },
        /**
        * @private
        * @method _handleInsertImageWindowClose
        * @description Handles the closing of the Image Properties Window.
        */
        _handleInsertImageWindowClose: function() {
            var url = Dom.get('insertimage_url');
            var title = Dom.get('insertimage_title');
            var link = Dom.get('insertimage_link');
            var target = Dom.get('insertimage_target');
            var el = this.currentElement[0];
            if (url && url.value && (url.value != this.STR_IMAGE_HERE)) {
                el.setAttribute('src', url.value);
                el.setAttribute('title', title.value);
                el.setAttribute('alt', title.value);
                var par = el.parentNode;
                if (link.value) {
                    var urlValue = link.value;
                    if ((urlValue.indexOf(':/'+'/') == -1) && (urlValue.substring(0,1) != '/') && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                        if ((urlValue.indexOf('@') != -1) && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                            //Found an @ sign, prefix with mailto:
                            urlValue = 'mailto:' + urlValue;
                        } else {
                            /* :// not found adding */
                            urlValue = 'http:/'+'/' + urlValue;
                        }
                    }
                    if (par && this._isElement(par, 'a')) {
                        par.setAttribute('href', urlValue);
                        if (target.checked) {
                            par.setAttribute('target', target.value);
                        } else {
                            par.setAttribute('target', '');
                        }
                    } else {
                        var _a = this._getDoc().createElement('a');
                        _a.setAttribute('href', urlValue);
                        if (target.checked) {
                            _a.setAttribute('target', target.value);
                        } else {
                            _a.setAttribute('target', '');
                        }
                        el.parentNode.replaceChild(_a, el);
                        _a.appendChild(el);
                    }
                } else {
                    if (par && this._isElement(par, 'a')) {
                        par.parentNode.replaceChild(el, par);
                    }
                }
            } else {
                //No url/src given, remove the node from the document
                el.parentNode.removeChild(el);
            }
            this.currentElement = [];
            this.nodeChange();
        },
        /**
        * @private
        * @method _renderPanel
        * @description Renders the panel used for Editor Windows to the document so we can start using it..
        * @returns {<a href="YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a>}
        */
        _renderPanel: function() {
            var panel = null;
            if (!YAHOO.widget.EditorInfo.panel) {
                panel = new YAHOO.widget.Overlay(this.EDITOR_PANEL_ID, {
                    width: '300px',
                    iframe: true,
                    visible: false,
                    underlay: 'none',
                    draggable: false,
                    close: false
                });
                YAHOO.widget.EditorInfo.panel = panel;
            } else {
                panel = YAHOO.widget.EditorInfo.panel;
            }
            this.set('panel', panel);

            this.get('panel').setBody('---');
            this.get('panel').setHeader(' ');
            this.get('panel').setFooter(' ');
            if (this.DOMReady) {
                this.get('panel').render(document.body);
                Dom.addClass(this.get('panel').element, 'yui-editor-panel');
            } else {
                Event.onDOMReady(function() {
                    this.get('panel').render(document.body);
                    Dom.addClass(this.get('panel').element, 'yui-editor-panel');
                }, this, true);
            }
            this.get('panel').showEvent.subscribe(function() {
                YAHOO.util.Dom.setStyle(this.element, 'display', 'block');
            });
            return this.get('panel');
        },
        /**
        * @method openWindow
        * @param {<a href="YAHOO.widget.EditorWindow.html">YAHOO.widget.EditorWindow</a>} win A <a href="YAHOO.widget.EditorWindow.html">YAHOO.widget.EditorWindow</a> instance
        * @description Opens a new "window/panel"
        */
        openWindow: function(win) {
            YAHOO.log('openWindow: ' + win.name, 'info', 'Editor');
            this.toolbar.set('disabled', true); //Disable the toolbar when an editor window is open..
            Event.on(document, 'keypress', this._closeWindow, this, true);
            if (YAHOO.widget.EditorInfo.window.win && YAHOO.widget.EditorInfo.window.scope) {
                YAHOO.widget.EditorInfo.window.scope.closeWindow.call(YAHOO.widget.EditorInfo.window.scope);
            }
            YAHOO.widget.EditorInfo.window.win = win;
            YAHOO.widget.EditorInfo.window.scope = this;

            var self = this,
                xy = Dom.getXY(this.currentElement[0]),
                elXY = Dom.getXY(this.get('iframe').get('element')),
                panel = this.get('panel'),
                newXY = [(xy[0] + elXY[0] - 20), (xy[1] + elXY[1] + 10)],
                wWidth = (parseInt(win.attrs.width, 10) / 2),
                align = 'center',
                body = null;

            this.fireEvent('beforeOpenWindow', { type: 'beforeOpenWindow', win: win, panel: panel });

            body = document.createElement('div');
            body.className = this.CLASS_PREFIX + '-body-cont';
            for (var b in this.browser) {
                if (this.browser[b]) {
                    Dom.addClass(body, b);
                    break;
                }
            }
            Dom.addClass(body, ((YAHOO.widget.Button && (this._defaultToolbar.buttonType == 'advanced')) ? 'good-button' : 'no-button'));

            var _note = document.createElement('h3');
            _note.className = 'yui-editor-skipheader';
            _note.innerHTML = this.STR_CLOSE_WINDOW_NOTE;
            body.appendChild(_note);
            form = document.createElement('form');
            form.setAttribute('method', 'GET');
            var windowName = win.name;
            Event.on(form, 'submit', function(ev) {
                var evName = 'window' + windowName + 'Submit';
                self.fireEvent(evName, { type: evName, target: this });
                Event.stopEvent(ev);
            }, this, true);
            body.appendChild(form);

            if (Lang.isObject(win.body)) { //Assume it's a reference
                form.appendChild(win.body);
            } else { //Assume it's a string
                var _tmp = document.createElement('div');
                _tmp.innerHTML = win.body;
                form.appendChild(_tmp);
            }
            var _close = document.createElement('span');
            _close.innerHTML = 'X';
            _close.title = this.STR_CLOSE_WINDOW;
            _close.className = 'close';
            Event.on(_close, 'click', function() {
                this.closeWindow();
            }, this, true);
            var _knob = document.createElement('span');
            _knob.innerHTML = '^';
            _knob.className = 'knob';
            win._knob = _knob;

            var _header = document.createElement('h3');
            _header.innerHTML = win.header;

            panel.cfg.setProperty('width', win.attrs.width);
            panel.setHeader(' '); //Clear the current header
            panel.appendToHeader(_header);
            _header.appendChild(_close);
            _header.appendChild(_knob);
            panel.setBody(' '); //Clear the current body
            panel.setFooter(' '); //Clear the current footer
            if (win.footer !== null) {
                panel.setFooter(win.footer);
                Dom.addClass(panel.footer, 'open');
            } else {
                Dom.removeClass(panel.footer, 'open');
            }
            panel.appendToBody(body); //Append the new DOM node to it
            var fireShowEvent = function() {
                panel.bringToTop();
                Event.on(panel.element, 'click', function(ev) {
                    Event.stopPropagation(ev);
                });
                this._setBusy(true);
                panel.showEvent.unsubscribe(fireShowEvent);
            };
            panel.showEvent.subscribe(fireShowEvent, this, true);
            var fireCloseEvent = function() {
                this.currentWindow = null;
                var evName = 'window' + windowName + 'Close';
                this.fireEvent(evName, { type: evName, target: this });
                panel.hideEvent.unsubscribe(fireCloseEvent);
            };
            panel.hideEvent.subscribe(fireCloseEvent, this, true);
            this.currentWindow = win;
            this.moveWindow(true);
            panel.show();
            this.fireEvent('afterOpenWindow', { type: 'afterOpenWindow', win: win, panel: panel });
        },
        /**
        * @method moveWindow
        * @param {Boolean} force Boolean to tell it to move but not use any animation (Usually done the first time the window is loaded.)
        * @description Realign the window with the currentElement and reposition the knob above the panel.
        */
        moveWindow: function(force) {
            if (!this.currentWindow) {
                return false;
            }
            var win = this.currentWindow,
                xy = Dom.getXY(this.currentElement[0]),
                elXY = Dom.getXY(this.get('iframe').get('element')),
                panel = this.get('panel'),
                //newXY = [(xy[0] + elXY[0] - 20), (xy[1] + elXY[1] + 10)],
                newXY = [(xy[0] + elXY[0]), (xy[1] + elXY[1])],
                wWidth = (parseInt(win.attrs.width, 10) / 2),
                align = 'center',
                orgXY = panel.cfg.getProperty('xy'),
                _knob = win._knob,
                xDiff = 0,
                yDiff = 0,
                anim = false;

            newXY[0] = ((newXY[0] - wWidth) + 20);
            //Account for the Scroll bars in a scrolled editor window.
            newXY[0] = newXY[0] - Dom.getDocumentScrollLeft(this._getDoc());
            newXY[1] = newXY[1] - Dom.getDocumentScrollTop(this._getDoc());
            


            if (this._isElement(this.currentElement[0], 'img')) {
                if (this.currentElement[0].src.indexOf(this.get('blankimage')) != -1) {
                    newXY[0] = (newXY[0] + (75 / 2)); //Placeholder size
                    newXY[1] = (newXY[1] + 75); //Placeholder sizea
                } else {
                    var w = parseInt(this.currentElement[0].width, 10);
                    var h = parseInt(this.currentElement[0].height, 10);
                    newXY[0] = (newXY[0] + (w / 2));
                    newXY[1] = (newXY[1] + h);
                }
                newXY[1] = newXY[1] + 15;
            } else {
                var fs = Dom.getStyle(this.currentElement[0], 'fontSize');
                if (fs && fs.indexOf && fs.indexOf('px') != -1) {
                    newXY[1] = newXY[1] + parseInt(Dom.getStyle(this.currentElement[0], 'fontSize'), 10) + 5;
                } else {
                    newXY[1] = newXY[1] + 20;
                }
            }
            if (newXY[0] < elXY[0]) {
                newXY[0] = elXY[0] + 5;
                align = 'left';
            }

            if ((newXY[0] + (wWidth * 2)) > (elXY[0] + parseInt(this.get('iframe').get('element').clientWidth, 10))) {
                newXY[0] = ((elXY[0] + parseInt(this.get('iframe').get('element').clientWidth, 10)) - (wWidth * 2) - 5);
                align = 'right';
            }
            
            try {
                xDiff = (newXY[0] - orgXY[0]);
                yDiff = (newXY[1] - orgXY[1]);
            } catch (e) {}
            
            //Convert negative numbers to positive so we can get the difference in distance
            xDiff = ((xDiff < 0) ? (xDiff * -1) : xDiff);
            yDiff = ((yDiff < 0) ? (yDiff * -1) : yDiff);

            if (((xDiff > 10) || (yDiff > 10)) || force) { //Only move the window if it's supposed to move more than 10px or force was passed (new window)
                var _knobLeft = 0,
                    elW = 0;

                if (this.currentElement[0].width) {
                    elW = (parseInt(this.currentElement[0].width, 10) / 2);
                }

                var leftOffset = xy[0] + elXY[0] + elW;
                _knobLeft = leftOffset - newXY[0];
                //Check to see if the knob will go off either side & reposition it
                if (_knobLeft > (parseInt(win.attrs.width, 10) - 40)) {
                    _knobLeft = parseInt(win.attrs.width, 10) - 40;
                } else if (_knobLeft < 40) {
                    _knobLeft = 40;
                }
                if (isNaN(_knobLeft)) {
                    _knobLeft = 40;
                }
                if (force) {
                    if (_knob) {
                        _knob.style.left = _knobLeft + 'px';
                    }
                    if (this.get('animate')) {
                        Dom.setStyle(panel.element, 'opacity', '0');
                        anim = new YAHOO.util.Anim(panel.element, {
                            opacity: {
                                from: 0,
                                to: 1
                            }
                        }, 0.1, YAHOO.util.Easing.easeOut);
                        panel.cfg.setProperty('xy', newXY);
                        anim.onComplete.subscribe(function() {
                            if (this.browser.ie) {
                                panel.element.style.filter = 'none';
                            }
                        }, this, true);
                        anim.animate();
                    } else {
                        panel.cfg.setProperty('xy', newXY);
                    }
                } else {
                    if (this.get('animate')) {
                        anim = new YAHOO.util.Anim(panel.element, {}, 0.5, YAHOO.util.Easing.easeOut);
                        anim.attributes = {
                            top: {
                                to: newXY[1]
                            },
                            left: {
                                to: newXY[0]
                            }
                        };
                        anim.onComplete.subscribe(function() {
                            panel.cfg.setProperty('xy', newXY);
                        });
                        //We have to animate the iframe shim at the same time as the panel or we get scrollbar bleed ..
                        var iframeAnim = new YAHOO.util.Anim(panel.iframe, anim.attributes, 0.5, YAHOO.util.Easing.easeOut);

                        var _knobAnim = new YAHOO.util.Anim(_knob, {
                            left: {
                                to: _knobLeft
                            }
                        }, 0.6, YAHOO.util.Easing.easeOut);
                        anim.animate();
                        iframeAnim.animate();
                        _knobAnim.animate();
                    } else {
                        _knob.style.left = _knobLeft + 'px';
                        panel.cfg.setProperty('xy', newXY);
                    }
                }
            }
        },
        /**
        * @private
        * @method _closeWindow
        * @description Close the currently open EditorWindow with the Escape key.
        * @param {Event} ev The keypress Event that we are trapping
        */
        _closeWindow: function(ev) {
            if ((ev.charCode == 87) && ev.shiftKey && ev.ctrlKey) {
                if (this.currentWindow) {
                    this.closeWindow();
                }
            }
        },
        /**
        * @method closeWindow
        * @description Close the currently open EditorWindow.
        */
        closeWindow: function() {
            YAHOO.log('closeWindow: ' + this.currentWindow.name, 'info', 'Editor');
            YAHOO.widget.EditorInfo.window = {};
            this.fireEvent('closeWindow', { type: 'closeWindow', win: this.currentWindow });
            this.currentWindow = null;
            this.get('panel').hide();
            this.get('panel').cfg.setProperty('xy', [-900,-900]);
            this.get('panel').syncIframe(); //Needed to move the iframe with the hidden panel
            this.unsubscribeAll('afterExecCommand');
            this.toolbar.set('disabled', false); //enable the toolbar now that the window is closed
            this.toolbar.resetAllButtons();
            this._focusWindow();
            Event.removeListener(document, 'keypress', this._closeWindow);
        },
        /* {{{  Command Overrides - These commands are only over written when we are using the advanced version */
        /**
        * @method cmd_heading
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('heading') is used.
        */
        cmd_heading: function(value) {
            var exec = true,
                el = null,
                action = 'heading',
                _sel = this._getSelection(),
                _selEl = this._getSelectedElement();

            if (_selEl) {
                _sel = _selEl;
            }
            
            if (this.browser.ie) {
                action = 'formatblock';
            }
            if (value == 'none') {
                if ((_sel && _sel.tagName && (_sel.tagName.toLowerCase().substring(0,1) == 'h')) || (_sel && _sel.parentNode && _sel.parentNode.tagName && (_sel.parentNode.tagName.toLowerCase().substring(0,1) == 'h'))) {
                    if (_sel.parentNode.tagName.toLowerCase().substring(0,1) == 'h') {
                        _sel = _sel.parentNode;
                    }
                    if (this._isElement(_sel, 'html')) {
                        return [false];
                    }
                    el = this._swapEl(_selEl, 'span', function(el) {
                        el.className = 'yui-non';
                    });
                    this._selectNode(el);
                    this.currentElement[0] = el;
                }
                exec = false;
            } else {
                if (this._isElement(_selEl, 'h1') || this._isElement(_selEl, 'h2') || this._isElement(_selEl, 'h3') || this._isElement(_selEl, 'h4') || this._isElement(_selEl, 'h5') || this._isElement(_selEl, 'h6')) {
                    el = this._swapEl(_selEl, value);
                    this._selectNode(el);
                    this.currentElement[0] = el;
                } else {
                    this._createCurrentElement(value);
                    this._selectNode(this.currentElement[0]);
                }
                exec = false;
            }
            return [exec, action];
        },
        /**
        * @method cmd_hiddenelements
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('hiddenelements') is used.
        */
        cmd_hiddenelements: function(value) {
            if (this._showingHiddenElements) {
                //Don't auto highlight the hidden button
                this._lastButton = null;
                YAHOO.log('Enabling hidden CSS File', 'info', 'SimpleEditor');
                this._showingHiddenElements = false;
                this.toolbar.deselectButton('hiddenelements');
                Dom.removeClass(this._getDoc().body, this.CLASS_HIDDEN);
            } else {
                YAHOO.log('Disabling hidden CSS File', 'info', 'SimpleEditor');
                this._showingHiddenElements = true;
                Dom.addClass(this._getDoc().body, this.CLASS_HIDDEN);
                this.toolbar.selectButton('hiddenelements');
            }
            return [false];
        },
        /**
        * @method cmd_removeformat
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('removeformat') is used.
        */
        cmd_removeformat: function(value) {
            var exec = true;
            /**
            * @knownissue Remove Format issue
            * @browser Safari 2.x
            * @description There is an issue here with Safari, that it may not always remove the format of the item that is selected.
            * Due to the way that Safari 2.x handles ranges, it is very difficult to determine what the selection holds.
            * So here we are making the best possible guess and acting on it.
            */
            if (this.browser.webkit && !this._getDoc().queryCommandEnabled('removeformat')) {
                var _txt = this._getSelection()+'';
                this._createCurrentElement('span');
                this.currentElement[0].className = 'yui-non';
                this.currentElement[0].innerHTML = _txt;
                for (var i = 1; i < this.currentElement.length; i++) {
                    this.currentElement[i].parentNode.removeChild(this.currentElement[i]);
                }
                /*
                this._createCurrentElement('span');
                YAHOO.util.Dom.addClass(this.currentElement[0], 'yui-non');
                var re= /<\S[^><]*>/g;
                var str = this.currentElement[0].innerHTML.replace(re, '');
                var _txt = this._getDoc().createTextNode(str);
                this.currentElement[0].parentNode.parentNode.replaceChild(_txt, this.currentElement[0].parentNode);
                */
                
                exec = false;
            }
            return [exec];
        },
        /**
        * @method cmd_script
        * @param action action passed from the execCommand method
        * @param value Value passed from the execCommand method
        * @description This is a combined execCommand override method. It is called from the cmd_superscript and cmd_subscript methods.
        */
        cmd_script: function(action, value) {
            var exec = true, tag = action.toLowerCase().substring(0, 3),
                _span = null, _selEl = this._getSelectedElement();

            if (this.browser.webkit) {
                YAHOO.log('Safari dom fun again (' + action + ')..', 'info', 'EditorSafari');
                if (this._isElement(_selEl, tag)) {
                    YAHOO.log('we are a child of tag (' + tag + '), reverse process', 'info', 'EditorSafari');
                    _span = this._swapEl(this.currentElement[0], 'span', function(el) {
                        el.className = 'yui-non';
                    });
                    this._selectNode(_span);
                } else {
                    this._createCurrentElement(tag);
                    var _sub = this._swapEl(this.currentElement[0], tag);
                    this._selectNode(_sub);
                    this.currentElement[0] = _sub;
                }
                exec = false;
            }
            return exec;
        },
        /**
        * @method cmd_superscript
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('superscript') is used.
        */
        cmd_superscript: function(value) {
            return [this.cmd_script('superscript', value)];
        },
        /**
        * @method cmd_subscript
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('subscript') is used.
        */
        cmd_subscript: function(value) {
            return [this.cmd_script('subscript', value)];
        },
        /**
        * @method cmd_indent
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('indent') is used.
        */
        cmd_indent: function(value) {
            var exec = true, selEl = this._getSelectedElement(), _bq = null;

            if (this.browser.webkit || this.browser.ie || this.browser.gecko) {
                if (this._isElement(selEl, 'blockquote')) {
                    _bq = this._getDoc().createElement('blockquote');
                    _bq.innerHTML = selEl.innerHTML;
                    selEl.innerHTML = '';
                    selEl.appendChild(_bq);
                    this._selectNode(_bq);
                } else {
                    this._createCurrentElement('blockquote');
                    for (var i = 0; i < this.currentElement.length; i++) {
                        _bq = this._getDoc().createElement('blockquote');
                        _bq.innerHTML = this.currentElement[i].innerHTML;
                        this.currentElement[i].parentNode.replaceChild(_bq, this.currentElement[i]);
                        this.currentElement[i] = _bq;
                    }
                    this._selectNode(this.currentElement[0]);
                }
                exec = false;
            } else {
                value = 'blockquote';
            }
            return [exec, 'indent', value];
        },
        /**
        * @method cmd_outdent
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('outdent') is used.
        */
        cmd_outdent: function(value) {
            var exec = true, selEl = this._getSelectedElement(), _bq = null, _span = null;
            if (this.browser.webkit || this.browser.ie || this.browser.gecko) {
                selEl = this._getSelectedElement();
                if (this._isElement(selEl, 'blockquote')) {
                    var par = selEl.parentNode;
                    if (this._isElement(selEl.parentNode, 'blockquote')) {
                        par.innerHTML = selEl.innerHTML;
                        this._selectNode(par);
                    } else {
                        _span = this._getDoc().createElement('span');
                        _span.innerHTML = selEl.innerHTML;
                        YAHOO.util.Dom.addClass(_span, 'yui-non');
                        par.replaceChild(_span, selEl);
                        this._selectNode(_span);
                    }
                } else {
                    YAHOO.log('Can not outdent, we are not inside a blockquote', 'warn', 'Editor');
                }
                exec = false;
            } else {
                value = 'blockquote';
            }
            return [exec, 'indent', value];
        },
        /* }}}*/        
        /**
        * @method toString
        * @description Returns a string representing the editor.
        * @return {String}
        */
        toString: function() {
            var str = 'Editor';
            if (this.get && this.get('element_cont')) {
                str = 'Editor (#' + this.get('element_cont').get('id') + ')' + ((this.get('disabled') ? ' Disabled' : ''));
            }
            return str;
        }
    });
    /**
     * @description Class to hold Window information between uses. We use the same panel to show the windows, so using this will allow you to configure a window before it is shown.
     * This is what you pass to Editor.openWindow();. These parameters will not take effect until the openWindow() is called in the editor.
     * @class EditorWindow
     * @param {String} name The name of the window.
     * @param {Object} attrs Attributes for the window. Current attributes used are : height and width
    */
    YAHOO.widget.EditorWindow = function(name, attrs) {
        /**
        * @private
        * @property name
        * @description A unique name for the window
        */
        this.name = name.replace(' ', '_');
        /**
        * @private
        * @property attrs
        * @description The window attributes
        */
        this.attrs = attrs;
    };

    YAHOO.widget.EditorWindow.prototype = {
        /**
        * @private
        * @property _cache
        * @description Holds a cache of the DOM for the window so we only have to build it once..
        */
        _cache: null,
        /**
        * @private
        * @property header
        * @description Holder for the header of the window, used in Editor.openWindow
        */
        header: null,
        /**
        * @private
        * @property body
        * @description Holder for the body of the window, used in Editor.openWindow
        */
        body: null,
        /**
        * @private
        * @property footer
        * @description Holder for the footer of the window, used in Editor.openWindow
        */
        footer: null,
        /**
        * @method setHeader
        * @description Sets the header for the window.
        * @param {String/HTMLElement} str The string or DOM reference to be used as the windows header.
        */
        setHeader: function(str) {
            this.header = str;
        },
        /**
        * @method setBody
        * @description Sets the body for the window.
        * @param {String/HTMLElement} str The string or DOM reference to be used as the windows body.
        */
        setBody: function(str) {
            this.body = str;
        },
        /**
        * @method setFooter
        * @description Sets the footer for the window.
        * @param {String/HTMLElement} str The string or DOM reference to be used as the windows footer.
        */
        setFooter: function(str) {
            this.footer = str;
        },
        /**
        * @method toString
        * @description Returns a string representing the EditorWindow.
        * @return {String}
        */
        toString: function() {
            return 'Editor Window (' + this.name + ')';
        }
    };
/**
* @event beforeOpenWindow
* @param {<a href="YAHOO.widget.EditorWindow.html">EditorWindow</a>} win The EditorWindow object
* @param {Overlay} panel The Overlay object that is used to create the window.
* @description Event fires before an Editor Window is opened. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event afterOpenWindow
* @param {<a href="YAHOO.widget.EditorWindow.html">EditorWindow</a>} win The EditorWindow object
* @param {Overlay} panel The Overlay object that is used to create the window.
* @description Event fires after an Editor Window is opened. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event closeWindow
* @param {<a href="YAHOO.widget.EditorWindow.html">EditorWindow</a>} win The EditorWindow object
* @description Event fires after an Editor Window is closed. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event windowCMDOpen
* @param {<a href="YAHOO.widget.EditorWindow.html">EditorWindow</a>} win The EditorWindow object
* @param {Overlay} panel The Overlay object that is used to create the window.
* @description Dynamic event fired when an <a href="YAHOO.widget.EditorWindow.html">EditorWindow</a> is opened.. The dynamic event is based on the name of the window. Example Window: createlink, opening this window would fire the windowcreatelinkOpen event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event windowCMDClose
* @param {<a href="YAHOO.widget.EditorWindow.html">EditorWindow</a>} win The EditorWindow object
* @param {Overlay} panel The Overlay object that is used to create the window.
* @description Dynamic event fired when an <a href="YAHOO.widget.EditorWindow.html">EditorWindow</a> is closed.. The dynamic event is based on the name of the window. Example Window: createlink, opening this window would fire the windowcreatelinkClose event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

})();
