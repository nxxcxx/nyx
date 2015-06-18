'use strict';

var gl_matrix = require( 'gl-matrix' );
var mat4 = gl_matrix.mat4;
var vec3 = gl_matrix.vec3;

class Camera {

	constructor( fov, aspectRatio, near, far ) {

		this.projectionMatrix = mat4.create();
      this.fov = fov;
      this.aspectRatio = aspectRatio;
      this.near = near;
      this.far = far;
		mat4.perspective( this.projectionMatrix, fov, aspectRatio, near, far );



      this.position = vec3.create();
      vec3.set( this.position, 0.0, 0.0, 0.0 );

      this.lookAt = vec3.create();
      vec3.set( this.lookAt, 0.0, 0.0, 0.0);

      this.upVector = vec3.create();
      vec3.set( this.upVector, 0.0, 1.0, 0.0 );

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
