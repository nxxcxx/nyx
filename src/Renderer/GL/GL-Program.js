'use strict';

/**
 * @param {String} type; shader type 'vs' or 'fs'
 * @param {String} src
 */
function createShader( type, src ) {

	var shaderType;

	if ( type === 'vs' ) shaderType = GL.VERTEX_SHADER;
	else if ( type === 'fs' ) shaderType = GL.FRAGMENT_SHADER;

	var shader = GL.createShader( shaderType );
	GL.shaderSource( shader, src );
	GL.compileShader( shader );

	var log = GL.getShaderInfoLog( shader );

	if ( !GL.getShaderParameter( shader, GL.COMPILE_STATUS ) ) {

		console.error( log );
		GL.deleteShader( shader );
		return null;

	}

	if ( log ) console.warn( log );

	return shader;

}

/**
 * @param {WebGLShader}
 */
function createProgram( ...shaders ) {

	var program = GL.createProgram();
	shaders.forEach( shader => GL.attachShader( program, shader ) );

	GL.linkProgram( program );

	var log = GL.getProgramInfoLog( program );

	if ( !GL.getProgramParameter( program, GL.LINK_STATUS ) ) {

		console.error( log );
		GL.deleteProgram( program );
		return null;

	}

	if ( log ) console.warn( log );

	return program;

}
/**
 * @param {String} vertexShaderSrc
 * @param {String} fragmentShaderSrc
 */
function createShaderProgram( vertexShaderSrc, fragmentShaderSrc ) {

	var vs = createShader( 'vs', vertexShaderSrc );
	var fs = createShader( 'fs', fragmentShaderSrc );
	return createProgram( vs, fs );

}

module.exports = {

	createShader,
	createProgram,
	createShaderProgram

};
