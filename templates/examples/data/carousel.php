<?php
$modules['carousel']       = array(
    'name'              => 'Carousel Control',
    'type'              => 'widget',
    'description'       => '<p>The Carousel Control provides a widget for browsing among a set of like objects in an overloaded screen space by scrolling vertically or horizontally.</p>',
    'cheatsheet'        => true
);

$examples['csl_selection'] = array(
    'name'              => 'Spotlight example',
    'modules'           => array('carousel'),
    'description'       => 'Demonstrates a selection spotlight with the Carousel control.',
    'sequence'          => array(1),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'default',
    'requires'          => array('carousel'),
    'highlightSyntax'   => true
);

$examples['csl_circular'] = array(
    'name'              => 'Circular Carousel example',
    'modules'           => array('carousel'),
    'description'       => 'Demonstrates a circular Carousel control.',
    'sequence'          => array(2),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'require',
    'requires'          => array('carousel'),
    'highlightSyntax'   => true
);

$examples['csl_reveal'] = array(
    'name'              => 'Partially revealing previous and next items',
    'modules'           => array('carousel'),
    'description'       => 'Demonstrates partial revealing of previous and next items in the Carousel Control.',
    'sequence'          => array(3),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'require',
    'requires'          => array('carousel'),
    'highlightSyntax'   => true
);

$examples['csl_imagentext'] = array(
    'name'              => 'Using both images and text within an item',
    'modules'           => array('carousel'),
    'description'       => 'Demonstrates the use of both images and text within an item in the Carousel Control.',
    'sequence'          => array(4),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'require',
    'requires'          => array('animation', 'carousel'),
    'highlightSyntax'   => true
);

$examples['csl_dynload2'] = array(
    'name'              => 'Using Ajax for deferred loading of items',
    'modules'           => array('carousel'),
    'description'       => 'Demonstrates the use of Ajax for deferred loading of items in the Carousel Control.',
    'sequence'          => array(5),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'default',
    'requires'          => array('connection', 'carousel'),
    'highlightSyntax'   => true
);

$examples['carousel-ariaplugin'] = array(
    'name'              => 'Using the Carousel ARIA Plugin',
    'modules'           => array('carousel'),
    'description'       => 'The Carousel ARIA plugin makes it easy to use the WAI-ARIA Roles and States with the Carousel control.',
    'sequence'          => array(6),
    'logger'            => array('carousel'),
    'loggerInclude'     => 'default',
    'newWindow'         => 'require',
    'requires'          => array('animation', 'carousel'),
    'highlightSyntax'   => true
);

?>
