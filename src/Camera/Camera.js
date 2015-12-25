'use strict';

class Camera {

	constructor() {

		this.position = vec3.new( 0.0, 0.0, 5.0 );
		this.lookAt	= vec3.new( 0.0, 0.0, 0.0 );
		this.upVector = vec3.new( 0.0, 1.0, 0.0 );

		this.viewMatrix = mat4.create();
		mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector );

		this.projectionMatrix = mat4.create();

	}

	updateViewMatrix() {

		mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector );

	}

}

module.exports = Camera;
