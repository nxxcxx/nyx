'use strict';

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

		if ( name !== 'index' ) console.warn( `${name} attribute is defined but never used` );

	} else {

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, attribute.shape[ 1 ], gl.FLOAT, false, 0, 0 );

	}

	console.log( name, location );

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

function updateAttributes( gl, attributes ) {

	// if attribute index slot is enabled for previous mesh and is not use in current mesh
	// then error ..access index out of range blah blah blah...
	// todo current wegl attribute state manager
	// for now just disable all
	for ( let i = 0; i < 16; i ++ ) {
		gl.disableVertexAttribArray( i );
	}

	Object.keys( attributes ).forEach( name => {

		if ( name === 'index' ) return;

		var attr = attributes[ name ];
		gl.bindBuffer( gl.ARRAY_BUFFER, attr.buffer );
		gl.enableVertexAttribArray( attr.location );
		gl.vertexAttribPointer( attr.location, attr.shape[ 1 ], gl.FLOAT, false, 0, 0 );

	} );

	// disable inactive attributes


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
		case 'm4':
			setter = function ( value ) {
				gl.uniformMatrix4fv( uniform.location, false, value );
			}
			break;
	}
	if ( !setter ) console.error( `${name} uniform type is unknown` );
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
function updateUniforms( gl, uniforms ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		uni.setter( uni.value );

	} );

}


module.exports = {
	assembleBufferAttributes: assembleBufferAttributes,
	assembleBufferUniforms: assembleBufferUniforms,
	updateUniforms: updateUniforms,
	updateAttributes: updateAttributes
}
