'use strict';

var GL_STATE = require( './GL-State' );
var GL_BUFFER = require( './GL-Buffer' );

/*
 * @param  {String}       name
 * @param  {WebGLBuffer}  buffer
 * @param  {Object}       attribute
 * @param  {WebGLProgram} program
 */
function bindBufferAttribute( name, buffer, attribute, program ) {

	var location = GL.getAttribLocation( program, name );

	if ( location === -1 ) {

		if ( name !== 'index' ) console.warn( `${name} attribute is defined but never used by vertex shader.` );

	} else {

		GL.bindBuffer( GL.ARRAY_BUFFER, buffer );
		GL.enableVertexAttribArray( location );
		GL.vertexAttribPointer( location, attribute.shape[ 1 ], GL.FLOAT, false, 0, 0 );

	}

	attribute.buffer = buffer;
	attribute.location = location;
	attribute.size = attribute.data.length;

}

/*
 * @param  {Object} attributes
 *    example: attributes = {
 *                position: { data: new Float32Array( [1,2,3,4,5,6] ), shape: [2,3] },
 *                index:    { data: new Uint16Array( [1,2,3,4,5,6] ) , shape: [1,6] }
 *             }
 * @param  {WebGLProgram} program
 */
function assembleAttributesBuffer( attributes, program ) {

	Object.keys( attributes ).forEach( name => {

		var attr = attributes[ name ];
		var buffer = GL_BUFFER.createBuffer( attr.data, name === 'index' );
		bindBufferAttribute( name, buffer, attr, program );

	} );

}

function activateAttributes( attributes ) {

	Object.keys( attributes ).forEach( name => {

		var attr = attributes[ name ];

		if ( attr.location === -1  ) return;

		GL.bindBuffer( GL.ARRAY_BUFFER, attr.buffer );
		GL.vertexAttribPointer( attr.location, attr.shape[ 1 ], GL.FLOAT, false, 0, 0 );

	} );

	// enable/disable attributes
	GL_STATE.enableAttributes( attributes );

}

module.exports = {

   activateAttributes,
   assembleAttributesBuffer

};
