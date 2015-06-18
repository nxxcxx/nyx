'use strict';

class Renderer {

	constructor( opts ) {

		this._canvas = document.createElement( 'canvas' );
		this._gl = this._canvas.getContext( 'webgl', opts || {} );
      if ( !this._gl ) console.error( 'WebGL not supported' );

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

		// active shader program then bind attributes & uniforms

      var program = mesh.shader._program;
      gl.useProgram( program );

		var a_vertexPosition   = gl.getAttribLocation( program, 'vertexPosition' );
		var u_projectionMatrix = gl.getUniformLocation( program, 'projectionMatrix' );
		var u_viewMatrix      = gl.getUniformLocation( program, 'viewMatrix' );
      var u_modelMatrix      = gl.getUniformLocation( program, 'modelMatrix' );

		gl.enableVertexAttribArray( a_vertexPosition );

		gl.vertexAttribPointer( a_vertexPosition, mesh.vertexBuffer.vSize, gl.FLOAT, false, 0, 0 );

		gl.uniformMatrix4fv( u_projectionMatrix, false, camera.projectionMatrix );
      gl.uniformMatrix4fv( u_viewMatrix, false, camera.viewMatrix );
		gl.uniformMatrix4fv( u_modelMatrix, false, mesh.modelMatrix );

		gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vertexBuffer._buffer );

		gl.drawArrays( mesh.drawMode, 0, mesh.vertexBuffer.nVerts );

	}

	setClearColor( r, g, b, a ) {

		this._gl.clearColor( r, g, b, a );

	}

	clear() {

		this._gl.clear( this._gl.COLOR_BUFFER_BIT );

	}

   setViewport( width, height ) {

      this._gl.viewport( 0.0, 0.0, width, height );

   }

}

module.exports = Renderer;
