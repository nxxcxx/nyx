'use strict';

class Mesh {

	constructor( vertexBuffer, shader ) {

      this.initialized = false;

		this.vertexBuffer = vertexBuffer;
		this.shader = shader;

		this.modelMatrix = mat4.create();
		mat4.translate( this.modelMatrix, this.modelMatrix, [ 0, 0, 0.0 ] );

      this.drawMode = NYX.CONST.TRIANGLE_STRIP;

	}

   _init( gl ) {

      if ( !this.initialized ) {

         this.vertexBuffer._initBuffers( gl );
         this.shader._initShaders( gl );
         this.initialized = true;

      }

   }

}

module.exports = Mesh;
