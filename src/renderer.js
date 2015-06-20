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

		gl.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

	}


	function render( mesh, camera ) {

		_initMesh( mesh, camera );

		gl.useProgram( mesh.shader._program );

		// _updateUniforms();
		// _updateAttributes();

		_linkAttributes( mesh.shader._program, mesh.shader.attributes );
		_linkUniforms( mesh.shader._program, mesh.shader.uniforms );

		// todo update unifs/attr | set blend modes

		if ( mesh.geometry.__buffers.index ) {
			var type = (mesh.geometry.__buffers.index.data instanceof Uint16Array) ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.__buffers.index.buffer );
			gl.drawElements( mesh.drawMode, mesh.geometry.__buffers.index.num, type, 0 );
		} else {
			gl.bindBuffer( gl.ARRAY_BUFFER, mesh.geometry.__buffers.position.buffer );
			gl.drawArrays( mesh.drawMode, 0, mesh.geometry.__buffers.position.num );
		}

	}

	function _initMesh( mesh, camera ) {

		if ( !mesh._initialized ) {

			_initShaders( mesh.shader );
	      _initBuffers( mesh.geometry );

			_setPredefAttributes( mesh );
			_setPredefUniforms( mesh, camera );

			_cacheUniformsLocation( mesh.shader );
			_cacheAttributesLocation( mesh.shader );

			mesh._initialized = true;

		}

	}

	function _setPredefUniforms( mesh, camera ) {

		var u_default = {
			projectionMatrix: { type: 'm4', value: camera.projectionMatrix },
			viewMatrix:       { type: 'm4', value: camera.viewMatrix       },
			modelMatrix:      { type: 'm4', value: mesh.modelMatrix        }
		}

		Object.keys( u_default ).forEach( ( name ) => {
			mesh.shader.uniforms[ name ] = u_default[ name ];
		} );

	}

	function _setPredefAttributes( mesh ) {

		var buffers = mesh.geometry.__buffers;

		Object.keys( buffers ).forEach( ( name ) => {
			if ( name !== 'index' ) mesh.shader.attributes[ name ] = buffers[ name ];
		} );

	}

	function _updateUniforms() {}

	function _updateAttributes() {}

	function _linkUniforms( program, uniforms ) {

		Object.keys( uniforms ).forEach( ( name ) => {

			var uni = uniforms[ name ];
			var loc = uni.location;
			var val = uni.value;

			switch ( uni.type ) {
				case 'm4': gl.uniformMatrix4fv( loc, false, val ); break;
				case 'v4': gl.uniform4fv( loc, val ); break;
			}

		} );

	}

	function _linkAttributes( program, attributes ) {

		Object.keys( attributes ).forEach( ( name ) => {

			var attr = attributes[ name ];
			if ( attr.location !== -1) {
				gl.enableVertexAttribArray( attr.location );
				gl.bindBuffer( gl.ARRAY_BUFFER, attr.buffer );
				gl.vertexAttribPointer( attr.location, attr.itemSize, gl.FLOAT, false, 0, 0 );
			}

		} );

	}

	function _initBuffers( geometry ) {

		var buffers = geometry.__buffers;

		Object.keys( buffers ).forEach( ( name ) => {

			var curr = buffers[ name ];
			curr.buffer = gl.createBuffer();

			if ( name === 'index' ) {

				if ( curr.data ) {
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, curr.buffer );
					gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, curr.data, gl.STATIC_DRAW );
				}

			} else {

				gl.bindBuffer( gl.ARRAY_BUFFER, curr.buffer );
		      gl.bufferData( gl.ARRAY_BUFFER, curr.data, gl.STATIC_DRAW );

			}

		} );

   }

	function _initShaders( shader ) {

		var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		gl.shaderSource( vertexShader, shader.vertexShaderSrc );
		gl.compileShader( vertexShader );

		if ( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ) {
			console.error( gl.getShaderInfoLog( vertexShader ) );
		}

		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
		gl.shaderSource( fragmentShader, shader.fragmentShaderSrc );
		gl.compileShader( fragmentShader );

		if ( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ) {
			console.error( gl.getShaderInfoLog( fragmentShader ) );
		}

		shader._program = gl.createProgram();
		gl.attachShader( shader._program, vertexShader );
		gl.attachShader( shader._program, fragmentShader );
		gl.linkProgram( shader._program );

	}

	function _cacheUniformsLocation( shader ) {

		Object.keys( shader.uniforms ).forEach( ( name ) => {
			var uni = shader.uniforms[ name ];
			uni.location = gl.getUniformLocation( shader._program, name );
		} );

	}

	function _cacheAttributesLocation( shader ) {

		Object.keys( shader.attributes ).forEach( ( name ) => {
			var attr = shader.attributes[ name ];
			attr.location = gl.getAttribLocation( shader._program, name );
			if ( attr.location === -1 ) console.warn( `${name} attribute defined but never used` );
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
