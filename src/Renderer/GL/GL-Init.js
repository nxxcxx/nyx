'use strict';

var gl = null;
var canvas = null;


function initContext( opts = {} ) {

   canvas = opts.canvas || document.createElement( 'canvas' );
	gl = canvas.getContext( 'webgl', opts );
   if ( !gl ) console.error( 'WebGL not supported.' );
   return gl;

}

function getExtensions() {

	NYX.CONST.WEBGL_EXTENSIONS.forEach( ext => {

      if ( !gl.getExtension( ext ) ) console.warn( `${ext} extension not supported.` );

   } );

}

function getCanvas() {

   return canvas;

}

module.exports = {

   initContext,
   getExtensions,
   getCanvas,

};
