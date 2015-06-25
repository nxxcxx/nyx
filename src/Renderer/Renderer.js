'use strict';

var GL_PROGRAM   = require( './GL/GL-Program' );
var GL_STATE     = require( './GL/GL-State' );
var GL_INIT      = require( './GL/GL-Init' );
var GL_ATTRIBUTE = require( './GL/GL-Attribute' );
var GL_UNIFORM   = require( './GL/GL-Uniform' );
var GL_TEXTURE   = require( './GL/GL-Texture' );

function Renderer( opts ) {

	var { gl, canvas } = GL_INIT.initContext( opts );
	GL_INIT.getExtensions();
	GL_STATE.setDefaultState( gl );

	function render( mesh, camera ) {

		_initMesh( mesh, camera );

		gl.useProgram( mesh.shader._program );

		_activateAttributes( mesh );
		_activateUniforms( mesh );

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
			_initUniforms( mesh, camera );

			if ( mesh.shader.drawMode === undefined ) console.warn( `drawMode is ${mesh.shader.drawMode}:`, mesh );
			mesh._initialized = true;

		}

	}

	function _initUniforms( mesh, camera ) {

		var unis = mesh.shader.uniforms;
		// set predefined uniforms
		unis.projectionMatrix.value = camera.projectionMatrix;
		unis.viewMatrix.value = camera.viewMatrix;
		unis.modelMatrix.value = mesh.modelMatrix;

		// set texture unit
		var currUnit = 0;
		Object.keys( unis ).forEach( name => {

			var uni = unis[ name ];
			if ( uni.type === 't' ) {

				uni.unit = currUnit++;
				uni._WebGLTexture = GL_TEXTURE.createTexture( gl, uni.value );

			}

		} );

		GL_UNIFORM.assembleUniformsBuffer( gl, unis, mesh.shader._program );

	}

	function _initBuffers( mesh ) {

		GL_ATTRIBUTE.assembleAttributesBuffer( gl, mesh.geometry.attributes, mesh.shader._program );

	}

	function _activateUniforms( mesh ) {

		GL_UNIFORM.activateUniforms( gl, mesh.shader.uniforms );

	}

	function _activateAttributes( mesh ) {

		GL_ATTRIBUTE.activateAttributes( gl, mesh.geometry.attributes );

	}

	function _initShaders( shader ) {

		shader._program = GL_PROGRAM.createShaderProgram( gl, shader.vertexShaderSrc, shader.fragmentShaderSrc );

	}

	function setClearColor( r, g, b, a ) {

		gl.clearColor( r, g, b, a );

	}

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
