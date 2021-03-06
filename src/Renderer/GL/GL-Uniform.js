'use strict'

var RenderTarget = require( 'src/RenderTarget' )
var Texture = require( 'src/Texture' )

/*
 * @param  {String}  name
 * @param  {Object}  uniform
 * @param  {WebGLProgram} program
 */
function bindBufferUniform( GL, name, uniform, program ) {

	uniform.location = GL.getUniformLocation( program, name )

	if ( !uniform.location ) {

		// console.warn( `${name} uniform is defined but never used by shader.` )
		return

	}

	var setter
	switch ( uniform.type ) {

		case 'f': setter = val => GL.uniform1f( uniform.location, val )
			break

		case 'm4': setter =  val => GL.uniformMatrix4fv( uniform.location, false, val )
			break

		case 'v3': setter = val => GL.uniform3fv( uniform.location, val )
			break

		case 't': setter = val => {

			// TODO: if texture image data ready ...
			GL.activeTexture( GL.TEXTURE0 + uniform.unit )

			if ( uniform.value instanceof Texture.CubeMapTexture ) {

				GL.bindTexture( GL.TEXTURE_CUBE_MAP, val )

			} else {

				GL.bindTexture( GL.TEXTURE_2D, val )

			}

			GL.uniform1i( uniform.location, uniform.unit )

		}
			break

		default: console.error( `${name} uniform type is unknown` )

	}

	uniform.setter = setter

}

/*
 * @param  {Object} uniforms
 * example: uniforms = {
 *   modelMatrix: { type: 'm4', value: mat4 }, ...
 * }
 * @param  {WebGLProgram} program
 */
function assembleUniformsBuffer( GL, uniforms, program ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ]
		bindBufferUniform( GL, name, uni, program )

	} )

}

/*
 * @param  {Object} uniforms
 */
function activateUniforms( uniforms ) {

	Object.keys( uniforms ).forEach( name => {

		var uni = uniforms[ name ]

		if ( !uni.location ) {

			return

		}

		if ( uni.type === 't' ) {

			if ( uni.value instanceof RenderTarget ) {

				uni.setter( uni.value.dataTexture._WebGLTexture )

			} else {

				uni.setter( uni.value._WebGLTexture )

			}

		} else {

			uni.setter( uni.value )

		}

	} )

}

module.exports = {

	activateUniforms,
	assembleUniformsBuffer

}
