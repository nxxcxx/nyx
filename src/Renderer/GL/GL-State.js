'use strict';

var activeAttributes = new Uint8Array( 16 );
var incomingAttributes = new Uint8Array( 16 );

function enableAttributes( attributes ) {

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
		GL.enableVertexAttribArray( slot );

	} );

	// disable inactive attributes
	for( let i = 0; i < incomingAttributes.length; i ++ ) {

		if ( activeAttributes[ i ] !== incomingAttributes[ i ] ) {

			GL.disableVertexAttribArray( i );
			activeAttributes[ i ] = 0;

		}

	}

}

function setDefaultState() {

	GL.clearColor( 0.12, 0.12, 0.15, 1.0 );
	GL.clearDepth( 1.0 );
	GL.clearStencil( 0.0 );
	GL.enable( GL.DEPTH_TEST );
	GL.depthFunc( GL.LEQUAL );

	// GL.frontFace( GL.CCW );
	// GL.cullFace( GL.BACK );
	// GL.enable( GL.CULL_FACE );

	GL.enable( GL.BLEND );
	GL.blendEquation( GL.FUNC_ADD );
	GL.blendFunc( GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA );

	// bind to null = default screen buffer
	GL.bindFramebuffer( GL.FRAMEBUFFER, null );

}

function reportCurrentState() {
	// todo log current state to console for debugging
}

module.exports = {

	enableAttributes,
	setDefaultState

};
