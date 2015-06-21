'use strict';

/**
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

/**
 * @param  {String}       name
 * @param  {WebGLBuffer}  buffer
 * @param  {Object}       attribute
 * @param  {WebGLProgram} program
 */
function bindBufferAttribute( gl, name, buffer, attribute, program ) {

	var location = gl.getAttribLocation( program, name );

	if ( location === -1 ) {

		console.warn( `${name} attribute is defined but never used` );

	} else {

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, attribute.dimension[ 1 ], gl.FLOAT, false, 0, 0 );

	}

	attribute.buffer = buffer;
	attribute.location = location;
	attribute.size = attribute.data.length;

}


/**
 * @param  {Object} attributes
 *    example: attributes = {
 *                position: { data: new Float32Array( [1,2,3,4,5,6] ), dimension: [2,3] },
 *                index:    { data: new Uint16Array( [1,2,3,4,5,6] ) , dimension: [1,6] }
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


function bindBufferUniform( gl, name, uniform, program ) {

	if ( !uniform.location ) uniform.location = gl.getUniformLocation( program, name );

	var setter;

	switch ( uniform.type ) {
		case 'm4':
			setter = function ( value ) {
				gl.uniformMatrix4fv( uniform.location, false, value );
			}
			break;
	}

	uniform.setter = setter;

}

function assembleBufferUniforms( gl, uniforms, program ) {

	// gl.useProgram( program );
	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		bindBufferUniform( gl, name, uni, program );

	} );

}

function updateUniforms( gl, uniforms ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		uni.setter( uni.value );

	} );

}


module.exports = {
	assembleBufferAttributes: assembleBufferAttributes,
	assembleBufferUniforms: assembleBufferUniforms,
	updateUniforms: updateUniforms
}


/*function _linkUniforms( uniforms ) {

	Object.keys( uniforms ).forEach( ( name ) => {

		var uni = uniforms[ name ];
		var loc = uni.location;
		var val = uni.value;

		switch ( uni.type ) {
			case 'm4': gl.uniformMatrix4fv( loc, false, val ); break;
			case 'v4': gl.uniform4fv( loc, val ); break;
		}

	} );

}*/
