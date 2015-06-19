'use strict';

class Mesh {

	constructor( vertexBuffer, shader ) {

      this.initialized = false;

		this.vertexBuffer = vertexBuffer;
		this.shader = shader;

		this.position = vec3.new();
		this.quaternion = quat.create();
		this.scale = vec3.new( 1.0, 1.0, 1.0 );
		this.modelMatrix = mat4.create();
		// mat4.translate( this.modelMatrix, this.modelMatrix, [ 0, 0, 0 ] );

      this.drawMode = NYX.CONST.TRIANGLES;

	}

   _init( gl ) {

      if ( !this.initialized ) {

         this.vertexBuffer._initBuffers( gl );
         this.shader._initShaders( gl );
         this.initialized = true;

      }

   }

	updateModelMatrix() {

		var m4rt = mat4.create();
		var m4s = mat4.create();

		return ( () => {

			mat4.identity( m4s );
			mat4.scale( m4s, m4s, this.scale );
			mat4.fromRotationTranslation( m4rt, this.quaternion, this.position );
			mat4.multiply( this.modelMatrix, m4rt, m4s );
			// mat4.fromRotationTranslation( this.modelMatrix, this.quaternion, this.position );

		} )();

	}

}

module.exports = Mesh;
