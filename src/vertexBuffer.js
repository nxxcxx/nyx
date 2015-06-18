'use strict';

class VertexBuffer {

	constructor() {

      var verts = [
         -1.0,  1.0, 0.0,
         -1.0, -1.0, 0.0,
          1.0,  1.0, 0.0,
          1.0, -1.0, 0.0
      ];
      this.vertices = new Float32Array( verts );

      this.vSize = 3;
      this.nVerts = 4;

	}

   _initBuffers( gl ) {

      this._buffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );
      gl.bufferData( gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW );

   }

}

module.exports = VertexBuffer;
