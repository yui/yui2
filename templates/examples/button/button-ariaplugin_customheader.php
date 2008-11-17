<style type="text/css">

    #button-example-form fieldset {
        border: 2px groove #ccc;
        margin: .5em;
        padding: .5em;
    }

	/*
		The Menu ARIA Plugin removes the "href" attribute from the <A> element of each MenuItem
		if the value of the "href" is set to "#", resulting in the focus outline no longer be 
		rendered in Gecko-based browsers when the <A> element is focused.  For this reason, 
		it is necessary to restore the focus outline for the <A>. 
	*/
	a[role=menuitem]:focus {
		outline: dotted 1px #000;
	}
	
</style>

<script type="text/javascript" src="../container/assets/containerariaplugin.js"></script>
<script type="text/javascript" src="../menu/assets/menuariaplugin.js"></script>
<script type="text/javascript" src="../button/assets/buttonariaplugin.js"></script>
