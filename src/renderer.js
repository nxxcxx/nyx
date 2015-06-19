'use strict';

class Renderer {

	constructor( opts ) {

		this._canvas = document.createElement( 'canvas' );
		this._gl = this._canvas.getContext( 'webgl', opts || {} );
      this._checkDependencies( this._gl );
		// console.info( this._gl.getContextAttributes() );
		// console.info( this._gl.getSupportedExtensions() );

		var gl = this._gl;
		gl.enable( gl.DEPTH_TEST );
		// gl.depthFunc( gl.LESS );
		// gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
		// gl.enable( gl.BLEND );

	}

	_checkDependencies( gl ) {

		if ( !gl ) console.error( 'WebGL not supported' );

		NYX.CONST.WEBGL_EXTENSIONS
		.forEach( ext => { if ( !gl.getExtension( ext ) ) console.warn( `${ext} not supported` ); } );

	}

	get canvas() {

		return this._canvas;

	}

   get context() {

      return this._gl;

   }

	renderMesh( mesh, camera ) {

		var gl = this._gl;
      mesh._init( gl );

		this._setDefaultAttributes( mesh );
		this._setDefaultUniforms( mesh, camera );
		this._activeProgram( mesh );


		// ----- render without indexing -----
			// gl.drawArrays( mesh.drawMode, 0, mesh.vertexBuffer.nVerts );

		// ----- render with indexing

			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.vertexBuffer._buffer_indices );
			// if index with uint16
			gl.drawElements( mesh.drawMode, mesh.vertexBuffer.numIndices, gl.UNSIGNED_SHORT, 0 );
			// if index with uint32
			// gl.drawElements( mesh.drawMode, mesh.vertexBuffer.numIndices, gl.UNSIGNED_INT, 0 );

	}

	_setDefaultUniforms( mesh, camera ) {

		var u_default = {
			projectionMatrix: { type: 'm4', value: camera.projectionMatrix },
			viewMatrix:       { type: 'm4', value: camera.viewMatrix       },
			modelMatrix:      { type: 'm4', value: mesh.modelMatrix        }
		}

		Object.keys( u_default ).forEach( ( name ) => {
			mesh.shader.uniforms[ name ] = u_default[ name ];
		} );


	}

	_setDefaultAttributes( mesh ) {

		var a_default = {
			vertexPosition: { itemSize: 3, value: mesh.vertexBuffer._buffer_vertexPosition },
			vertexColor:    { itemSize: 4, value: mesh.vertexBuffer._buffer_vertexColor }
		}

		Object.keys( a_default ).forEach( ( name ) => {
			 mesh.shader.attributes[ name ] = a_default[ name ];
		} );


	}

	_activeProgram( mesh ) {

		var gl = this._gl;
		var program = mesh.shader._program;
      gl.useProgram( program );

		// link uniforms
		this._linkUniforms( program, mesh.shader.uniforms );

		// link attributes
		this._linkAttributes( program, mesh.shader.attributes );

	}

	_linkUniforms( program, uniforms ) {

		var gl = this._gl;
		Object.keys( uniforms ).forEach( ( name ) => {
			var uni = uniforms[ name ];
			var u_location = gl.getUniformLocation( program, name );
			if ( uni.type === 'm4' ) {
				gl.uniformMatrix4fv( u_location, false, uni.value );
			}
		} );

	}

	_linkAttributes( program, attributes ) {

		var gl = this._gl;
		Object.keys( attributes ).forEach( ( name ) => {
			var a_location = gl.getAttribLocation( program, name );
			gl.enableVertexAttribArray( a_location );
			var attr = attributes[ name ];
			gl.bindBuffer( gl.ARRAY_BUFFER, attr.value );
			gl.vertexAttribPointer( a_location, attr.itemSize, gl.FLOAT, false, 0, 0 );
		} );

	}

	setClearColor( r, g, b, a ) {

		this._gl.clearColor( r, g, b, a );

	}

	clear() {

		this._gl.clear( this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT );

	}

   setViewport( width, height ) {

      this._gl.viewport( 0.0, 0.0, width, height );

   }

}

module.exports = Renderer;






/*
active GLSL program
set uniforms & attributes
enable attrib array
bindBuffer with corret pointer
draw w/ w/o indexing
*/


// active shader program
// var program = mesh.shader._program;
// gl.useProgram( program );
//
//
// // Attributes
// // todo: run only if buffer needs update
// var a_vertexPosition   = gl.getAttribLocation( program, 'vertexPosition' );
// gl.enableVertexAttribArray( a_vertexPosition );
//
// // !bind buffer first // pointer is points to current bound buffer
// gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vertexBuffer._buffer_vertex );
// gl.vertexAttribPointer( a_vertexPosition, mesh.vertexBuffer.vSize, gl.FLOAT, false, 0, 0 );

// Uniforms
	// var u_projectionMatrix = gl.getUniformLocation( program, 'projectionMatrix' );
	// var u_viewMatrix       = gl.getUniformLocation( program, 'viewMatrix' );
	// var u_modelMatrix      = gl.getUniformLocation( program, 'modelMatrix' );
	//
	// gl.uniformMatrix4fv( u_projectionMatrix, false, camera.projectionMatrix );
	// gl.uniformMatrix4fv( u_viewMatrix, false, camera.viewMatrix );
	// gl.uniformMatrix4fv( u_modelMatrix, false, mesh.modelMatrix );
