'use strict';


var activeAttributes = new Uint8Array( 16 );
var incomingAttributes = new Uint8Array( 16 );

function enableAttributes( gl, attributes ) {

   // reset incomingAttributes
   for( let i = 0; i < incomingAttributes.length; i ++ ) {
      incomingAttributes[ i ] = 0;
   }

   // set and enable incomingAttributes
   Object.keys( attributes ).forEach( name => {

      var slot = attributes[ name ].location;
      if ( slot === -1 ) return;
      incomingAttributes[ slot ] = 1;
      activeAttributes[ slot ] = 1;
      gl.enableVertexAttribArray( slot );

   } );

   // disable inactive attributes
   for( let i = 0; i < incomingAttributes.length; i ++ ) {

      if ( activeAttributes[ i ] !== incomingAttributes[ i ] ) {

         gl.disableVertexAttribArray( i );
         activeAttributes[ i ] = 0;

      }

   }

}

function setDefaultState( gl ) {

	gl.clearColor( 0.12, 0.12, 0.15, 1.0 );
	gl.clearDepth( 1.0 );
	gl.clearStencil( 0.0 );
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );

	// gl.frontFace( gl.CCW );
	// gl.cullFace( gl.BACK );
	// gl.enable( gl.CULL_FACE );

	gl.enable( gl.BLEND );
	gl.blendEquation( gl.FUNC_ADD );
	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

}


module.exports = {

   enableAttributes,
   setDefaultState

};
