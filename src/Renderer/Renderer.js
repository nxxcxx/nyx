'use strict';

var GL_PROGRAM     = require( './GL/GL-Program' );
var GL_STATE       = require( './GL/GL-State' );
var GL_INIT        = require( './GL/GL-Init' );
var GL_ATTRIBUTE   = require( './GL/GL-Attribute' );
var GL_UNIFORM     = require( './GL/GL-Uniform' );
var GL_TEXTURE     = require( './GL/GL-Texture' );
var GL_FRAMEBUFFER = require( './GL/GL-FrameBuffer' );

var RenderTarget = require( '../RenderTarget' );
var extensions = require( '../Constants' ).WEBGL_EXTENSIONS;

function renderer( opts ) {

	GL_INIT.initContext( opts );
	GL_STATE.setDefaultState();

	function render( mesh, camera, renderTarget ) {

		_initMesh( mesh, camera );

		// todo: _updateMesh() => bufferSubData... texImage2D...

		_activateProgram( mesh );
		_activateAttributes( mesh );
		_activateUniforms( mesh );

		_setRenderTarget( renderTarget );

		_draw( mesh );

	}

	function _setRenderTarget( renderTarget ) {

		// todo if ( renderTarget === currentRenderTarget ) return;
		if ( renderTarget ) {

			if ( renderTarget._framebuffer === null ) {

				renderTarget.dataTexture._WebGLTexture = GL_TEXTURE.createTexture( renderTarget.dataTexture );
				var fbo = GL_FRAMEBUFFER.createFramebuffer( renderTarget );
				renderTarget._framebuffer = fbo;

			}

			GL.bindFramebuffer( GL.FRAMEBUFFER, renderTarget._framebuffer );

		} else {

			GL.bindFramebuffer( GL.FRAMEBUFFER, null );

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

	function _draw( mesh ) {

		if ( mesh.geometry.attributes.index ) {

			var type = ( mesh.geometry.attributes.index.data instanceof Uint16Array ) ? GL.UNSIGNED_SHORT : GL.UNSIGNED_INT;
			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, mesh.geometry.attributes.index.buffer );
			GL.drawElements( GL[ mesh.shader.drawMode ], mesh.geometry.attributes.index.shape[ 0 ], type, 0 );

		} else {

			GL.bindBuffer( GL.ARRAY_BUFFER, mesh.geometry.attributes.position.buffer );
			GL.drawArrays( GL[ mesh.shader.drawMode ], 0, mesh.geometry.attributes.position.shape[ 0 ] );

		}

	}

	function _initUniforms( mesh, camera ) {

		// todo: uniforms needs to be updated every frame if modified

		var unis = mesh.shader.uniforms;
		// set predefined uniforms
		unis.projectionMatrix.value = camera.projectionMatrix;
		unis.viewMatrix.value = camera.viewMatrix;
		unis.modelMatrix.value = mesh.modelMatrix;
		unis.camera.value = camera.position;

			//test
			var mvm = mat4.create();
			mat4.multiply( mvm, camera.viewMatrix, mesh.modelMatrix );
			unis.modelViewMatrix.value = mvm;

			var nm = mat4.create();
			mat4.invert( nm, mvm );
			mat4.transpose( nm, nm );
			unis.normalMatrix.value = nm;


		// set texture unit
		var currUnit = 0;

		Object.keys( unis ).forEach( name => {

			var uni = unis[ name ];
			if ( uni.type === 't' ) {

				uni.unit = currUnit ++;
				if ( ! ( uni.value instanceof RenderTarget ) ) uni.value._WebGLTexture = GL_TEXTURE.createTexture( uni.value );

			}

		} );

		GL_UNIFORM.assembleUniformsBuffer( unis, mesh.shader._program );

	}

	function _initBuffers( mesh ) {

		GL_ATTRIBUTE.assembleAttributesBuffer( mesh.geometry.attributes, mesh.shader._program );

	}

	function _activateProgram( mesh ) {

		GL.useProgram( mesh.shader._program );

	}

	function _activateUniforms( mesh ) {

		GL_UNIFORM.activateUniforms( mesh.shader.uniforms );

	}

	function _activateAttributes( mesh ) {

		GL_ATTRIBUTE.activateAttributes( mesh.geometry.attributes );

	}

	function _initShaders( shader ) {

		shader._program = GL_PROGRAM.createShaderProgram( shader.vertexShaderSrc, shader.fragmentShaderSrc );

	}

	function setClearColor( r, g, b, a ) {

		GL.clearColor( r, g, b, a );

	}

	function clear() {

		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );

	}

	function clearRenderTarget( renderTarget ) {

		GL.bindFramebuffer( GL.FRAMEBUFFER, renderTarget._framebuffer );
		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );
		GL.bindFramebuffer( GL.FRAMEBUFFER, null );

	}

	function setViewport( width, height ) {

		GL.viewport( 0.0, 0.0, width, height );
		GL_INIT.canvas.width = width;
		GL_INIT.canvas.height = height;

	}

	return {

		get GL() { return GL_INIT.GL; },
		get canvas() { return GL_INIT.canvas; },

		setClearColor,
		setViewport,
		clear,
		render,
		clearRenderTarget

	};

} // end of renderer

module.exports = renderer;
