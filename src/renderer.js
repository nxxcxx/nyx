'use strict';

function Renderer( opts ) {

	var canvas = document.createElement( 'canvas' );
	var gl = canvas.getContext( 'webgl', opts || {} );
	_checkDependencies();
	_setDefaultGLState();

	function _checkDependencies() {

		if ( !gl ) console.error( 'WebGL not supported' );
		NYX.CONST.WEBGL_EXTENSIONS.forEach( ext => { if ( !gl.getExtension( ext ) ) console.warn( `${ext} not supported` ); } );

	}

	function _setDefaultGLState() {

		gl.clearColor( 0.12, 0.12, 0.15, 1.0 );
		gl.clearDepth( 1.0 );
		gl.clearStencil( 0.0 );
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );

		// gl.frontFace( gl.CW );
		// gl.cullFace( gl.BACK );
		// gl.enable( gl.CULL_FACE );
		//
		gl.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

	}


	function render( mesh, camera ) {

		_initMesh( mesh, camera );

		gl.useProgram( mesh.shader._program );

		_updateUniforms( mesh );

		// todo update unifs/attr | set blend modes

		if ( mesh.geometry.attributes.index ) {

			var type = (mesh.geometry.attributes.index.data instanceof Uint16Array) ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.attributes.index.buffer );
			gl.drawElements( mesh.drawMode, mesh.geometry.attributes.index.dimension[ 0 ], type, 0 );

		} else {
			gl.bindBuffer( gl.ARRAY_BUFFER, mesh.geometry.attributes.position.buffer );
			gl.drawArrays( mesh.drawMode, 0, mesh.geometry.attributes.position.dimension[ 0 ] );

		}

	}

	function _initMesh( mesh, camera ) {

		if ( !mesh._initialized ) {

			_initShaders( mesh.shader );
	      _initBuffers( mesh );
			_setupUniforms( mesh, camera );

			if ( mesh.drawMode === undefined ) console.warn( `drawMode is ${mesh.drawMode}:`, mesh );
			mesh._initialized = true;

		}

	}

	function _setupUniforms( mesh, camera ) {

		mesh.shader.uniforms.projectionMatrix.value = camera.projectionMatrix;
		mesh.shader.uniforms.viewMatrix.value = camera.viewMatrix;
		mesh.shader.uniforms.modelMatrix.value = mesh.modelMatrix;

		NYX.GL_Buffer.assembleBufferUniforms( gl, mesh.shader.uniforms, mesh.shader._program );

	}

	function _updateUniforms( mesh ) {

		NYX.GL_Buffer.updateUniforms( gl, mesh.shader.uniforms );

	}

	function _initBuffers( mesh ) {

		NYX.GL_Buffer.assembleBufferAttributes( gl, mesh.geometry.attributes, mesh.shader._program );

   }

	function _initShaders( shader ) {

		var shaders = [
			NYX.GL_Program.createShader( gl, 'vs', shader.vertexShaderSrc ),
			NYX.GL_Program.createShader( gl, 'fs', shader.fragmentShaderSrc )
		]

		shader._program = NYX.GL_Program.createProgram( gl, shaders );

	}

	function _cacheUniformsLocation( shader ) {

		Object.keys( shader.uniforms ).forEach( ( name ) => {
			var uni = shader.uniforms[ name ];
			uni.location = gl.getUniformLocation( shader._program, name );
		} );

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

		gl: gl,
		canvas: canvas,
		setClearColor: setClearColor,
		setViewport: setViewport,
		clear: clear,
		render: render

	}

} // end of Renderer

module.exports = Renderer;
