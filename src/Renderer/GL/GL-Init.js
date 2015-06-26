'use strict';

var GL = null;
var canvas = null;

function initContext( opts = {} ) {

   canvas = opts.canvas || document.createElement( 'canvas' );
	GL = canvas.getContext( 'webgl', opts );
   if ( !GL ) console.error( 'WebGL not supported.' );
   return { GL, canvas };

}

function getExtensions() {

	NYX.CONST.WEBGL_EXTENSIONS.forEach( ext => {

      if ( !GL.getExtension( ext ) ) console.warn( `${ext} extension not supported.` );

   } );

}

function getCanvas() {

   return canvas;

}

module.exports = {

   initContext,
   getExtensions,
   get canvas() { return canvas; },
   get GL() { return GL; }

};
