'use strict';

var GL_BUFFER = require( './GL/GL-Buffer' );
var GL_PROGRAM = require( './GL/GL-Program' );
var GL_STATE = require( './GL/GL-State' );
var GL_INIT = require( './GL/GL-Init' );


function Renderer( opts ) {

	var gl = GL_INIT.initContext( opts );
	var canvas = GL_INIT.getCanvas();
	GL_INIT.getExtensions();
	GL_STATE.setDefaultState( gl );


	function render( mesh, camera ) {

		_initMesh( mesh, camera );

		gl.useProgram( mesh.shader._program );

		_activeAttributes( mesh );
		_activeUniforms( mesh );

		if ( mesh.geometry.attributes.index ) {

			var type = ( mesh.geometry.attributes.index.data instanceof Uint16Array ) ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.attributes.index.buffer );
			gl.drawElements( mesh.shader.drawMode, mesh.geometry.attributes.index.shape[ 0 ], type, 0 );

		} else {

			gl.bindBuffer( gl.ARRAY_BUFFER, mesh.geometry.attributes.position.buffer );
			gl.drawArrays( mesh.shader.drawMode, 0, mesh.geometry.attributes.position.shape[ 0 ] );

		}

	}

	function _initMesh( mesh, camera ) {

		if ( !mesh._initialized ) {

			_initShaders( mesh.shader );
			_initBuffers( mesh );
			_setupUniforms( mesh, camera );

			if ( mesh.shader.drawMode === undefined ) console.warn( `drawMode is ${mesh.shader.drawMode}:`, mesh );
			mesh._initialized = true;

		}

	}

	function _setupUniforms( mesh, camera ) {

		mesh.shader.uniforms.projectionMatrix.value = camera.projectionMatrix;
		mesh.shader.uniforms.viewMatrix.value = camera.viewMatrix;
		mesh.shader.uniforms.modelMatrix.value = mesh.modelMatrix;

		GL_BUFFER.assembleBufferUniforms( gl, mesh.shader.uniforms, mesh.shader._program );

	}

	function _activeAttributes( mesh ) {

		GL_BUFFER.activeAttributes( gl, mesh.geometry.attributes );

	}

	function _activeUniforms( mesh ) {

		GL_BUFFER.activeUniforms( gl, mesh.shader.uniforms );

	}

	function _initBuffers( mesh ) {

		GL_BUFFER.assembleBufferAttributes( gl, mesh.geometry.attributes, mesh.shader._program );

	}

	function _initShaders( shader ) {

		shader._program = GL_PROGRAM.createShaderProgram( gl, shader.vertexShaderSrc, shader.fragmentShaderSrc );

	}

	function setClearColor( r, g, b, a ) {

		gl.clearColor( r, g, b, a );

	}

	/*
	function clear( color = true, depth = true, stencil = true ) {

		gl.clear(
			( color ? gl.COLOR_BUFFER_BIT : 0 ) |
			( depth ? gl.DEPTH_BUFFER_BIT : 0 ) |
			( stencil ? gl.STENCIL_BUFFER_BIT : 0 )
		);

	}
	*/

	function clear() {

		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	}

	function setViewport( width, height ) {

		gl.viewport( 0.0, 0.0, width, height );

	}

	return {

		gl,
		canvas,
		setClearColor,
		setViewport,
		clear,
		render

	};

} // end of Renderer

module.exports = Renderer;
