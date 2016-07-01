'use strict';

let mat4 = require( 'src/Math/mat4' );
var Camera = require( './Camera' );

class OrthographicCamera extends Camera {

	constructor( left, right, bot, top, near, far ) {

		super();
		[ this.left, this.right, this.bot, this.top, this.near, this.far ] = arguments;
		this.updateProjectionMatrix();

	}

	updateProjectionMatrix() {

		mat4.ortho( this.projectionMatrix, this.left, this.right, this.bot, this.top, this.near, this.far );

	}

}

module.exports = OrthographicCamera;
