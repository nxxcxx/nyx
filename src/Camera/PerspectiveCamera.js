'use strict';

var Camera = require( './Camera' );

class PerspectiveCamera extends Camera {

	constructor( fov, aspectRatio, near = 1, far = 10000 ) {

		super();
		[ this.fov, this.aspectRatio, this.near, this.far ] = arguments
		this.updateProjectionMatrix();

	}

   updateProjectionMatrix() {

      mat4.perspective( this.projectionMatrix, this.fov, this.aspectRatio, this.near, this.far );

   }

}

module.exports = PerspectiveCamera;
