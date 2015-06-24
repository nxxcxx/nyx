'use strict';

/**
 * @param {String} type; shader type 'vs' or 'fs'
 * @param {String} src
 */
function createShader( gl, type, src ) {

	var shaderType;

	if ( type === 'vs' ) shaderType = gl.VERTEX_SHADER;
	else if ( type === 'fs' ) shaderType = gl.FRAGMENT_SHADER;

	var shader = gl.createShader( shaderType );
	gl.shaderSource( shader, src );
	gl.compileShader( shader );

	var log = gl.getShaderInfoLog( shader );

	if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

		console.error( log );
		gl.deleteShader( shader );
		return null;

	}

	if ( log ) console.warn( log );

	return shader;

}

/**
 * @param {WebGLShader}
 */
function createProgram( gl, ...shaders ) {

	var program = gl.createProgram();
	shaders.forEach( shader => gl.attachShader( program, shader ) );

	gl.linkProgram( program );

	var log = gl.getProgramInfoLog( program );

	if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {

		console.error( log );
		gl.deleteProgram( program );
		return null;

	}

	if ( log ) console.warn( log );

	return program;

}
/**
 * @param {String} vertexShaderSrc
 * @param {String} fragmentShaderSrc
 */
function createShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc ) {

	var vs = createShader( gl, 'vs', vertexShaderSrc );
	var fs = createShader( gl, 'fs', fragmentShaderSrc );
	return createProgram( gl, vs, fs );

}

module.exports = {

	createShader,
	createProgram,
	createShaderProgram

};
