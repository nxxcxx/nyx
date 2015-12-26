'use strict';

var GL = null;
var canvas = null;

function initContext( opts = {

	// defaule opts
	alpha: true,
	premultipliedAlpha: false

} ) {

	canvas = opts.canvas || document.createElement( 'canvas' );
	GL = canvas.getContext( 'webgl', opts );
	if ( !GL ) throw 'WebGL not supported.';

	enableExtensions();

	return {

		GL,
		canvas

	};

}

function enableExtensions() {

	var glExts = GL.getSupportedExtensions();
	console.info( `Enable WebGL extensions: ${glExts}` );

	glExts.forEach( ext => {

		if ( !GL.getExtension( ext ) ) console.warn( `${ext} extension not supported.` );

	} );

}

function getCanvas() {

	return canvas;

}

module.exports = {

	initContext,
	get canvas() { return canvas; },
	get GL() { return GL; }

};
