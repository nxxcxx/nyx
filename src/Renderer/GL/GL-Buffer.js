'use strict';

var GL_STATE = require( './GL-State' );

/*
 * @param  {TypedArray}  data
 * @param  {boolean}     isIndexed
 * @return {WebGLBuffer}
 */
function createBuffer( gl, data, isIndexed ) {

	var buffer = gl.createBuffer();
	var target = isIndexed ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
	gl.bindBuffer( target, buffer );
	gl.bufferData( target, data, gl.STATIC_DRAW );
	return buffer;

}

/*
 * @param  {String}       name
 * @param  {WebGLBuffer}  buffer
 * @param  {Object}       attribute
 * @param  {WebGLProgram} program
 */
function bindBufferAttribute( gl, name, buffer, attribute, program ) {

	var location = gl.getAttribLocation( program, name );

	if ( location === -1 ) {

		if ( name !== 'index' ) console.warn( `${name} attribute is defined but never used by vertex shader.` );

	} else {

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, attribute.shape[ 1 ], gl.FLOAT, false, 0, 0 );

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
function assembleBufferAttributes( gl, attributes, program ) {

	Object.keys( attributes ).forEach( name => {

		var attr = attributes[ name ];
		var buffer = createBuffer( gl, attr.data, name === 'index' );
		bindBufferAttribute( gl, name, buffer, attr, program );

	} );

}

function activeAttributes( gl, attributes ) {

	Object.keys( attributes ).forEach( name => {

		var attr = attributes[ name ];

		if ( attr.location === -1  ) return;

		gl.bindBuffer( gl.ARRAY_BUFFER, attr.buffer );
		gl.vertexAttribPointer( attr.location, attr.shape[ 1 ], gl.FLOAT, false, 0, 0 );

	} );

	// enable/disable attributes
	GL_STATE.enableAttributes( gl, attributes );

}



/*
 * @param  {String}  name
 * @param  {Object}  uniform
 * @param  {WebGLProgram} program
 */
function bindBufferUniform( gl, name, uniform, program ) {

	if ( !uniform.location ) uniform.location = gl.getUniformLocation( program, name );

	var setter;
	switch ( uniform.type ) {

		case 'm4': setter =  value => gl.uniformMatrix4fv( uniform.location, false, value );
			break;
		case 't': setter = value => {
				gl.activeTexture( gl.TEXTURE0 + uniform.unit );
				gl.bindTexture( gl.TEXTURE_2D, uniform.value );
				gl.uniform1i( uniform.location, uniform.unit );
			};
			break;

	}

	if ( !setter ) console.error( `${name} uniform type is unknown.` );
	uniform.setter = setter;

}

/*
 * @param  {Object} uniforms
 *    example: uniforms = {
 *                modelMatrix: { type: 'm4', value: mat4 },
 *             }
 * @param  {WebGLProgram} program
 */
function assembleBufferUniforms( gl, uniforms, program ) {

	// gl.useProgram( program );
	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		bindBufferUniform( gl, name, uni, program );

	} );

}

/*
 * @param  {Object} uniforms
 */
function activeUniforms( gl, uniforms ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		uni.setter( uni.value );

	} );

}


module.exports = {

	assembleBufferAttributes,
	assembleBufferUniforms,
	activeAttributes,
	activeUniforms

};
