'use strict';

/*
 * @param  {String}  name
 * @param  {Object}  uniform
 * @param  {WebGLProgram} program
 */
function bindBufferUniform( gl, name, uniform, program ) {

	uniform.location = gl.getUniformLocation( program, name );

	if ( !uniform.location ) {
		console.warn( `${name} uniform is defined but never used by shader.` );
	}

	var setter;
	switch ( uniform.type ) {

		case 'f': setter = val => gl.uniform1f( uniform.location, val );
			break;

		case 'm4': setter =  val => gl.uniformMatrix4fv( uniform.location, false, val );
			break;

		case 't': setter = val => {

				// todo if texture image data ready ...
				gl.activeTexture( gl.TEXTURE0 + uniform.unit );
				gl.bindTexture( gl.TEXTURE_2D, val );
				gl.uniform1i( uniform.location, uniform.unit );

			};
			break;

      default: console.error( `${name} uniform type is unknown.` );

	}

	uniform.setter = setter;

}

/*
 * @param  {Object} uniforms
 *    example: uniforms = {
 *                modelMatrix: { type: 'm4', value: mat4 },
 *             }
 * @param  {WebGLProgram} program
 */
function assembleUniformsBuffer( gl, uniforms, program ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		bindBufferUniform( gl, name, uni, program );

	} );

}

/*
 * @param  {Object} uniforms
 */
function activateUniforms( gl, uniforms ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ];
		if ( uni.type === 't' ) {

			uni.setter( uni._WebGLTexture );

		} else {

			uni.setter( uni.value );

		}

	} );

}

module.exports = {

   activateUniforms,
   assembleUniformsBuffer

};
