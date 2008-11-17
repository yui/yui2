<h2 class="first">Setting up the Editor's HTML</h2>

<p>Setting up the Editor's HTML is done by creating a <code>textarea</code> control on the page.</p>

<textarea name="code" class="HTML">
&lt;form method="post" action="#" id="form1"&gt;
&lt;textarea id="editor" name="editor" rows="20" cols="75"&gt;
This is some more test text. <font face="Times New Roman">This is some more test text.
This is some more <b>test <i>text</i></b></font>.
This is some more test text. This is some more test text.
This is some more test text. This is some more test text. This is some more test text.
This is some more test text. 
&lt;/textarea&gt;
&lt;/form&gt;
</textarea>

<h2>Setting up the Editor's Javascript</h2>

<p>Once the <code>textarea</code> is on the page, then initialize the Editor like this:</p>

<textarea name="code" class="JScript">
//The Editor config
var myConfig = {
    height: '300px',
    width: '600px',
    animate: true,
    dompath: true,
    focusAtStart: true
};

//Now let's load the Editor.
var myEditor = new YAHOO.widget.Editor('editor', myConfig);
</textarea>

<h2>Adding and Controlling the New Button</h2>
<p>Here we subscribe to the <code>toolbarLoaded</code> Custom Event and create the new Button (<code>flickr</code>). After adding it to the group called <code>insertitem</code>, we subscribe to it's <code>flickrClick</code> Custom Event.</p>
<p>Inside this Custom Event, we set the <code>STOP_EXEC_COMMAND</code> var to <code>true</code>, which will keep the Editor from trying to run <code>execCommand('flickr', '')</code></p>
<p>Then we call <code>gutter.toggle()</code> which will either hide or show our custom panel.</p>
<textarea class="JScript" name="code">
var myEditor = new YAHOO.widget.Editor('editor', myConfig);

//Wait for the editor's toolbar to load
myEditor.on('toolbarLoaded', function() {
    //create the new gutter object
    gutter = new YAHOO.gutter();

    //The Toolbar buttons config
    var flickrConfig = {
            type: 'push',
            label: 'Insert Flickr Image',
            value: 'flickr'
    }
    
    //Add the button to the "insertitem" group
    myEditor.toolbar.addButtonToGroup(flickrConfig, 'insertitem');

    //Handle the button's click
    myEditor.toolbar.on('flickrClick', function(ev) {
        this._focusWindow();
        if (ev && ev.img) {
            //To abide by the Flickr TOS, we need to link back to the image that we just inserted
            var html = '<a href="' + ev.url + '"><img src="' + ev.img + '" title="' + ev.title + '"></a>';
            this.execCommand('inserthtml', html);
        }
        //Toggle the gutter, so that it opens and closes based on this click.
        gutter.toggle();
    });
    //Create the gutter control
    gutter.createGutter();
});
myEditor.render();
</textarea>

<h2>Styling the New Button</h2>

<p>There are 2 important states to style a button in the toolbar.</p>
<p>First is the default state, that can be accessed via this CSS rule: <code>.yui-toolbar-container .yui-toolbar-flickr span.yui-toolbar-icon</code></p>
<p>Second is the selected state, that can be accessed via this CSS rule: <code>.yui-toolbar-container .yui-toolbar-flickr-selected span.yui-toolbar-icon</code></p>

<p><code>.yui-toolbar-container</code> is the class applied to the top-most container of the toolbar.</p>
<p><code>.yui-toolbar-icon</code> is an extra <code>SPAN</code> injected into the button for spriting an image.</p>
<p><code>.yui-toolbar-VALUE</code> is a dynamic class added to the button based on the <code>value</code> passed into the button's config. It is used for specific styling of a button that may appear in several places on the page.</p>

<h2>The Style Rules to Create the Flickr Button in This Example</h2>
<textarea name="code" class="CSS">
.yui-skin-sam .yui-toolbar-container .yui-toolbar-flickr span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>flickr_default.gif );
    background-position: 1px 0px;
}
.yui-skin-sam .yui-toolbar-container .yui-toolbar-flickr-selected span.yui-toolbar-icon {
    background-image: url( <?php echo $assetsDirectory; ?>flickr_active.gif );
    background-position: 1px 0px;
}
</textarea>


<h2>The Gutter Panel Full Javascript Source</h2>

<p>The gutter in this example is not part of the Editor, but could easily be modified to do other things.</p>

<textarea class="JScript" name="code">
(function() {
    //Some private vars
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    YAHOO.gutter = function() {
        return {
            //The current status of the gutter (true is open)
            status: false,
            //Placeholder for the Overlay control
            gutter: null,
            /*
            * This method will create the Overlay and
            * attach some animations to the show and hide events
            */
            createGutter: function() {
                //Creating the Overlay
                this.gutter = new YAHOO.widget.Overlay('gutter1', {
                    height: '425px',
                    width: '300px',
                    //Setting it the context of the Editor's container
                    context: [
                        myEditor.get('element'),
                        'tl',
                        'tr'
                    ],
                    //Set the position
                    position: 'absolute',
                    //Hide by default
                    visible: false
                });
                /*
                * The hideEvent will control the status of the toolbar button as well
                * as fire the animation off to close the gutter
                */
                this.gutter.hideEvent.subscribe(function() {
                    //Deselect the flickr button in the toolbar
                    myEditor.toolbar.deselectButton('flickr');
                    Dom.setStyle('gutter1', 'visibility', 'visible');                
                    var anim = new YAHOO.util.Anim('gutter1', {
                        width: {
                            from: 300,
                            to: 0
                        },
                        opacity: {
                            from: 1,
                            to: 0
                        }
                    }, 1);
                    //When the animation is done, hide the element.
                    anim.onComplete.subscribe(function() {  
                        Dom.setStyle('gutter1', 'visibility', 'hidden');
                    });
                    //Animate it
                    anim.animate();
                }, this, true);
                /*
                * The showEvent will control the status of the toolbar button as well
                * as fire the animation off to open the gutter
                */
                this.gutter.showEvent.subscribe(function() {
                    //Select the flickr button in the toolbar
                    myEditor.toolbar.selectButton('flickr');
                    //Set the context of the panel (in case it was lost in the animation)
                    this.gutter.cfg.setProperty('context',[
                        myEditor.get('element'),
                        'tl',
                        'tr'
                    ]);
                    //Set the width to 0 pixels.
                    Dom.setStyle(this.gutter.element, 'width', '0px');
                    var anim = new YAHOO.util.Anim('gutter1', {
                        width: {
                            from: 0,
                            to: 300
                        },
                        opacity: {
                            from: 0,
                            to: 1
                        }
                    }, 1);
                    //Animate it
                    anim.animate();
                }, this, true);

                var warn = '';
                //Check if we are using Safari or Opera, if we are show the warning that you can't drag and drop images
                if (myEditor.browser.webkit || myEditor.browser.opera) {
                    warn = myEditor.STR_IMAGE_COPY;
                }
                //Set the body of the gutter to hold the HTML needed to render the autocomplete
                this.gutter.setBody('<h2>Flickr Image Search</h2><label for="flikr_search">Tag:</label>' +
                    '<input type="text" value="" id="flickr_search"><div id="flickr_results">' + 
                    '<p>Enter flickr tags into the box above, separated by commas. Be patient, ' + 
                    'this example may take a few seconds to get the images.<p></div>' + warn);
                this.gutter.render(document.body);
            },
            /*
            * Open the gutter using Overlay's show method
            */
            open: function() {
                Dom.get('flickr_search').value = '';
                this.gutter.show();
                this.status = true;
            },
            /*
            * Close the gutter using Overlay's close method
            */
            close: function() {
                this.gutter.hide();
                this.status = false;
            },
            /*
            * Check the state of the gutter and close it if it's open
            * or open it if it's closed.
            */
            toggle: function() {
                if (this.status) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }
    }
    
})();
</textarea>


<h2>Setting Up the Autocomplete Control</h2>
<p>First we wait until <code>flickr_search</code> is available on the page. Then we set up a click handler on <code>flickr_results</code> to see if the user clicked an image.</p>
<p>If an image is clicked, we will call <code>myEditor.execCommand('insertimage', IMG)</code> to insert the image into the Editor.</p>
<p>This Autocomplete control uses a DataSource that points to Flickr Web Services; Flickr returns XML data via a simple PHP proxy. In order to return valid data from the Flickr application, scriptQueryParameter has been customized to be tags, and scriptQueryAppend is used to pass in additional required arguments. The cache has been disabled so that each query is forced to make a trip to the live application.</p>
<p>This instance of AutoComplete defines a robust custom formatResult function that parses result data into custom HTML markup that displays an actual image from the Flickr server. Automatic highlighting of the first result item in the container has been disabled by setting autoHighlight to false.</p>
<textarea name="code" class="JScript">
YAHOO.util.Event.onAvailable('flickr_search', function() {
    YAHOO.util.Event.on('flickr_results', 'click', function(ev) {
        var tar = YAHOO.util.Event.getTarget(ev);
        if (tar.tagName.toLowerCase() == 'img') {
            if (tar.getAttribute('fullimage', 2)) {
                var img = tar.getAttribute('fullimage', 2),
                    title = tar.getAttribute('fulltitle'),
                    owner = tar.getAttribute('fullowner'),
                    url = tar.getAttribute('fullurl');
                this.toolbar.fireEvent('flickrClick', {
                    type: 'flickrClick',
                    img: img,
                    title: title,
                    owner: owner, 
                    url: url
                });
            }
        }
    });
    oACDS = new YAHOO.widget.DS_XHR("<?php echo $assetsDirectory; ?>flickr_proxy.php",
        ["photo", "title", "id", "owner", "secret", "server"]);
    oACDS.scriptQueryParam = "tags";
    oACDS.responseType = YAHOO.widget.DS_XHR.TYPE_XML;
    oACDS.maxCacheEntries = 0;
    oACDS.scriptQueryAppend = "method=flickr.photos.search";

    // Instantiate AutoComplete
    oAutoComp = new YAHOO.widget.AutoComplete('flickr_search','flickr_results', oACDS);
    oAutoComp.autoHighlight = false;
    oAutoComp.alwaysShowContainer = true;     
    oAutoComp.formatResult = function(oResultItem, sQuery) {
        // This was defined by the schema array of the data source
        var sTitle = oResultItem[0];
        var sId = oResultItem[1];
        var sOwner = oResultItem[2];
        var sSecret = oResultItem[3];
        var sServer = oResultItem[4];
        var urlPart = 'http:/'+'/static.flickr.com/' + sServer + '/' + sId + '_' + sSecret;
        var sUrl = urlPart + '_s.jpg';
        var lUrl = urlPart + '_m.jpg';
        var fUrl = 'http:/'+'/www.flickr.com/photos/' + sOwner + '/' + sId;
        var sMarkup = '<img src="' + sUrl + '" fullimage="' + lUrl + '" fulltitle="' + sTitle + '" fullid="' +
            sOwner + '" fullurl="' + fUrl + '" class="yui-ac-flickrImg" title="Click to add this image to the editor"><br>';
        return (sMarkup);
    };
});
</textarea>


