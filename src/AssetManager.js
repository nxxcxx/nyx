'use strict';

/*
var uriObj = {

   images: {
      name: 'path/to/file'
   },
   shaders: {
      name: 'path/to/file'
   }

};
*/

var assets = {};
var total = 0;
var loaded = 0;
var onLoadComplete = null;

var loader = {

	image: ( uri, done ) => {

		var img = new Image();
		img.onload = () => done( img );
		img.src = uri;

	},

	XHR: ( uri, done ) => {

		var request = new XMLHttpRequest();
		request.open( 'GET', uri, true );
		request.addEventListener( 'load', () => {

			done( request.response );

		} );
		request.send();

	}

};

var fetcher = {

	fetchText: text => enqueue( loader.XHR, text, null ),
	fetchImages: images => enqueue( loader.image, images, null ),
	fetchJSON: jsons => enqueue( loader.XHR, jsons, JSON.parse )

};


function enqueue( loaderFn, obj, transform ) {

	forEachProp( obj, key => {

		itemStart();

		loaderFn( obj[ key ].path, res => {

			obj[ key ].data = transform ? transform( res ) : res;
			itemEnd();

		} );

	} );

	function itemStart() {

		total ++;

	}

	function itemEnd() {

		loaded ++;
		if ( loaded === total && onLoadComplete !== null ) {

			onLoadComplete( assets );

		}

	}

}

function prepareAssets( uriObj ) {

	forEachProp( uriObj, group => {

		assets[ group ] = {};

		forEachProp( uriObj[ group ], name => {

			assets[ group ][ name ] = { path: uriObj[ group ][ name ] };

		} );

	} );

}

function fetchFiles( uriObj, done ) {

	prepareAssets( uriObj );

	onLoadComplete = done;

	fetcher.fetchImages( assets.images );
	fetcher.fetchJSON( assets.json );
	fetcher.fetchText( assets.shaders );

}

function forEachProp( obj, fn ) {

	Object.keys( obj ).forEach( key => fn( key ) );

}

module.exports = {

	fetch: fetchFiles,
	get assets() { return assets; }

};
