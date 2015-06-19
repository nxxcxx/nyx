'use strict';

class VertexBuffer {

	constructor() {

		/*
      this.vertices = [
         vec3.new( -1.0,  1.0, 0.0 ),
         vec3.new( -1.0, -1.0, 0.0 ),
         vec3.new(  1.0,  1.0, 0.0 ),
         vec3.new(  1.0, -1.0, 0.0 )
      ];
		*/

		this.vertices = [

		   // Front face
		   vec3.new( -1.0, -1.0,  1.0 ),
		   vec3.new(  1.0, -1.0,  1.0 ),
		   vec3.new(  1.0,  1.0,  1.0 ),
		   vec3.new( -1.0,  1.0,  1.0 ),

		   // Back face
		   vec3.new( -1.0, -1.0, -1.0 ),
		   vec3.new( -1.0,  1.0, -1.0 ),
		   vec3.new(  1.0,  1.0, -1.0 ),
		   vec3.new(  1.0, -1.0, -1.0 ),

		   // Top face
		   vec3.new( -1.0,  1.0, -1.0 ),
		   vec3.new( -1.0,  1.0,  1.0 ),
		   vec3.new(  1.0,  1.0,  1.0 ),
		   vec3.new(  1.0,  1.0, -1.0 ),

		   // Bottom face
		   vec3.new( -1.0, -1.0, -1.0 ),
		   vec3.new(  1.0, -1.0, -1.0 ),
		   vec3.new(  1.0, -1.0,  1.0 ),
		   vec3.new( -1.0, -1.0,  1.0 ),

		   // Right face
		   vec3.new(  1.0, -1.0, -1.0 ),
		   vec3.new(  1.0,  1.0, -1.0 ),
		   vec3.new(  1.0,  1.0,  1.0 ),
		   vec3.new(  1.0, -1.0,  1.0 ),

		   // Left face
			vec3.new( -1.0, -1.0, -1.0 ),
		   vec3.new( -1.0, -1.0,  1.0 ),
		   vec3.new( -1.0,  1.0,  1.0 ),
		   vec3.new( -1.0,  1.0, -1.0 )

		 ];

		this.nVerts = this.vertices.length;
		this.vSize = 3;




		this.indices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		]
		this.numIndices = this.indices.length;

	}

   _initBuffers( gl ) {

		this._initVertices();
      this._buffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );
      gl.bufferData( gl.ARRAY_BUFFER, this.bufferVertices.data, gl.STATIC_DRAW );

		this._buffer_indices = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._buffer_indices );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.indices ), gl.STATIC_DRAW );
		// gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint32Array( this.indices ), gl.STATIC_DRAW );

   }

	_initVertices() {

		this.bufferVertices = ndarray( new Float32Array( this.nVerts * this.vSize ), [ this.nVerts, this.vSize ] );

		for ( let i = 0; i < this.nVerts; i ++ ) {
			for ( let j = 0; j < this.vSize; j ++ ) {
				this.bufferVertices.set( i, j, this.vertices[ i ][ j ] );
			}
		}

	}

	_initIndices() {



	}

	applyMatrix( m4 ) {

		this.vertices.map( v => vec3.transformMat4( v, v, m4 ) );

	}

}

module.exports = VertexBuffer;
