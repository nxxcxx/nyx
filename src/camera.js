'use strict';

class Camera {

	constructor( fov, aspectRatio, near, far ) {

      this.fov = fov;
      this.aspectRatio = aspectRatio;
      this.near = near;
      this.far = far;
		this.projectionMatrix = mat4.create();
		mat4.perspective( this.projectionMatrix, fov, aspectRatio, near, far );

      this.position = vec3.new( 0.0, 0.0, 0.0 );
      this.lookAt   = vec3.new( 0.0, 0.0, 0.0 );
      this.upVector = vec3.new( 0.0, 1.0, 0.0 );

		this.viewMatrix = mat4.create();
      mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector );

	}

   updateViewMatrix() {

      mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector );

   }

   updateProjectionMatrix() {

      mat4.perspective( this.projectionMatrix, this.fov, this.aspectRatio, this.near, this.far );

   }

}

module.exports = Camera;
