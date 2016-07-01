'use strict'

/**
 * @param {String} type shader type 'vs' or 'fs'
 * @param {String} src
 */
function createShader( GL, type, src ) {

	let shaderType

	if ( type === 'vs' ) shaderType = GL.VERTEX_SHADER
	else if ( type === 'fs' ) shaderType = GL.FRAGMENT_SHADER

	let shader = GL.createShader( shaderType )
	GL.shaderSource( shader, src )
	GL.compileShader( shader )

	let log = GL.getShaderInfoLog( shader )

	if ( !GL.getShaderParameter( shader, GL.COMPILE_STATUS ) ) {

		console.error( log )
		GL.deleteShader( shader )
		return null

	}

	if ( log ) console.warn( log )

	return shader

}

/**
 * @param {WebGLShader}
 */
function createProgram( GL, ...shaders ) {

	let program = GL.createProgram()
	shaders.forEach( shader => GL.attachShader( program, shader ) )

	GL.linkProgram( program )

	let log = GL.getProgramInfoLog( program )

	if ( !GL.getProgramParameter( program, GL.LINK_STATUS ) ) {

		console.error( log )
		GL.deleteProgram( program )
		return null

	}

	if ( log ) console.warn( log )

	return program

}
/**
 * @param {String} vertexShaderSrc
 * @param {String} fragmentShaderSrc
 */
function createShaderProgram( GL, vertexShaderSrc, fragmentShaderSrc ) {

	let vs = createShader( GL, 'vs', vertexShaderSrc )
	let fs = createShader( GL, 'fs', fragmentShaderSrc )
	return createProgram( GL, vs, fs )

}

module.exports = {

	createShaderProgram

}
