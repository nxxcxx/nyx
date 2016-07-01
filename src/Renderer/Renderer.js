'use strict'

let mat4 = require( 'src/Math/mat4' )

let GL_PROGRAM     = require( './GL/GL-Program' )
let GL_STATE       = require( './GL/GL-State' )
let GL_INIT        = require( './GL/GL-Init' )
let GL_ATTRIBUTE   = require( './GL/GL-Attribute' )
let GL_UNIFORM     = require( './GL/GL-Uniform' )
let GL_TEXTURE     = require( './GL/GL-Texture' )
let GL_FRAMEBUFFER = require( './GL/GL-FrameBuffer' )

let RenderTarget = require( 'src/RenderTarget' )

function renderer( opts ) {

	let [ GL, canvas ] = GL_INIT.initContext( opts )
	GL_STATE.setDefaultState( GL )

	function render( mesh, camera, renderTarget ) {

		_initMesh( mesh, camera )

		_activateProgram( mesh )
		_activateAttributes( mesh )
		_activateUniforms( mesh )

		_setRenderTarget( renderTarget )

		_updateDynamicBuffer( mesh )
		_draw( mesh )

	}

	function _setRenderTarget( renderTarget ) {

		// todo if ( renderTarget === currentRenderTarget ) return
		if ( renderTarget ) {

			if ( renderTarget._framebuffer === null ) {

				renderTarget.dataTexture._WebGLTexture = GL_TEXTURE.createTexture( GL, renderTarget.dataTexture )
				renderTarget._framebuffer = GL_FRAMEBUFFER.createFramebuffer( GL, renderTarget )

			}

			GL.bindFramebuffer( GL.FRAMEBUFFER, renderTarget._framebuffer )

		} else {

			GL.bindFramebuffer( GL.FRAMEBUFFER, null )

		}

	}

	function _initMesh( mesh, camera ) {

		if ( !mesh._initialized ) {

			_initShaders( mesh.shader )
			_initBuffers( mesh )
			_initUniforms( mesh, camera )

			if ( mesh.shader.drawMode === undefined ) throw 'drawMode is undefined'
			mesh._initialized = true

		}

	}

	function _updateDynamicBuffer( mesh ) {

		let attrs = mesh.geometry.attributes

		Object.keys( attrs ).forEach( name => {

			let attr = attrs[ name ]

			if ( attr.isDynamic ) {

				// TODO: this does not work with index buffer
				GL.bindBuffer( GL.ARRAY_BUFFER, attr.buffer )
				GL.bufferSubData( GL.ARRAY_BUFFER, 0, attr.data )

			}

		} )

	}

	function _draw( mesh ) {

		let attrs = mesh.geometry.attributes

		if ( attrs.index ) {

			let type = ( attrs.index.data instanceof Uint16Array ) ? GL.UNSIGNED_SHORT : GL.UNSIGNED_INT
			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, attrs.index.buffer )
			GL.drawElements( GL[ mesh.shader.drawMode ], attrs.index.shape[ 0 ], type, 0 )

		} else {

			GL.bindBuffer( GL.ARRAY_BUFFER, attrs.position.buffer )
			GL.drawArrays( GL[ mesh.shader.drawMode ], 0, attrs.position.shape[ 0 ] )

		}

	}

	function _initUniforms( mesh, camera ) {

		// TODO: uniforms needs to be updated every frame if modified
		let unis = mesh.shader.uniforms

		// set predefined uniforms
		unis.projectionMatrix.value = camera.projectionMatrix
		unis.viewMatrix.value = camera.viewMatrix
		unis.modelMatrix.value = mesh.modelMatrix
		unis.camera.value = camera.position

		// TODO:
		let mvm = mat4.create()
		mat4.multiply( mvm, camera.viewMatrix, mesh.modelMatrix )
		unis.modelViewMatrix.value = mvm

		let nm = mat4.create()
		mat4.invert( nm, mvm )
		mat4.transpose( nm, nm )
		unis.normalMatrix.value = nm


		// set texture unit
		let currUnit = 0

		Object.keys( unis ).forEach( name => {

			let uni = unis[ name ]
			if ( uni.type === 't' ) {

				uni.unit = currUnit ++
				if ( !( uni.value instanceof RenderTarget ) ) {

					uni.value._WebGLTexture = GL_TEXTURE.createTexture( GL, uni.value )

				}

			}

		} )

		GL_UNIFORM.assembleUniformsBuffer( GL, unis, mesh.shader._program )

	}

	function _initBuffers( mesh ) {

		GL_ATTRIBUTE.assembleAttributesBuffer( GL, mesh.geometry.attributes, mesh.shader._program )

	}

	function _activateProgram( mesh ) {

		GL.useProgram( mesh.shader._program )

	}

	function _activateUniforms( mesh ) {

		GL_UNIFORM.activateUniforms( mesh.shader.uniforms )

	}

	function _activateAttributes( mesh ) {

		GL_ATTRIBUTE.activateAttributes( GL, mesh.geometry.attributes )

	}

	function _initShaders( shader ) {

		shader._setProgram( GL_PROGRAM.createShaderProgram( GL, shader.vertexShaderSrc, shader.fragmentShaderSrc ) )

	}

	function setClearColor( r, g, b, a ) {

		GL.clearColor( r, g, b, a )

	}

	function clear() {

		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT )

	}

	function clearRenderTarget( renderTarget ) {

		GL.bindFramebuffer( GL.FRAMEBUFFER, renderTarget._framebuffer )
		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT )
		GL.bindFramebuffer( GL.FRAMEBUFFER, null )

	}

	function setViewport( width, height ) {

		GL.viewport( 0.0, 0.0, width, height )
		canvas.width = width
		canvas.height = height

	}

	return {

		get GL() { return GL },
		get canvas() { return canvas },

		setClearColor,
		setViewport,
		clear,
		render,
		clearRenderTarget

	}

} // end of renderer

module.exports = renderer
