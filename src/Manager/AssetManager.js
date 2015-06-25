'use strict';

/*
var pattern = {

   images: {
      type: 'img',
      name: 'path/to/file'
   },
   shaders: {
      type: 'text',
      name: 'path/to/file'
   }

};
*/

var assets = {};
var total = 0;
var loaded = 0;
var onLoadComplete = null;

function fetch( assets_, done ) {

	assets = assets_;
	onLoadComplete = done;
	var images = assets.images || {};
	var shaders = assets.shaders || {};
   var json = assets.json || {};

	Object.keys( images ).forEach( key => {

		itemStart();
		loadImage( images[ key ], res => {

			images[ key ] = res;
			itemEnd();

		} );

	} );

   Object.keys( json ).forEach( key => {

		itemStart();
		XHR( json[ key ], res => {

			json[ key ] = res;
			itemEnd();

		} );

	} );

}

function itemStart() {

	total++;

}

function itemEnd( uri ) {

	loaded++;
	if ( loaded === total && onLoadComplete !== null ) {
		onLoadComplete();
	}


}

function loadImage( uri, done ) {

	var img = new Image();
	img.onload = () => done( img );
	img.src = uri;

}

function XHR( uri, done ) {

	var request = new XMLHttpRequest();
	request.open( 'GET', uri, true );
	request.addEventListener( 'load', () => {

      done( JSON.parse( request.response ) );

	} );
   request.send();

}

module.exports = {

	fetch,
	get assets() {
		return assets;
	}

};
