'use strict';

var budo = require( 'budo' );
var babelify = require( 'babelify' );
var glslify = require( 'glslify' );
var chalk = require( 'chalk' );

budo( './src/index.js', {

	port: 3000,
	live: true,
	serve: 'bundle.js',
	transform: [ babelify, glslify ]

} )
.watch( [ './assets' ] )
.on( 'connect', function ( event ) {

	console.log( chalk.green( '► Listening on: ' + event.uri ) );

} );
