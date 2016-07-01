'use strict'

let vec3 = require( 'src/Math/vec3' )
let mat4 = require( 'src/Math/mat4' )

class Camera {

	constructor() {

		this.position = vec3.fromValues( 0.0, 0.0, 5.0 )
		this.lookAt	= vec3.create()
		this.upVector = vec3.fromValues( 0.0, 1.0, 0.0 )

		this.viewMatrix = mat4.create()
		mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector )

		this.projectionMatrix = mat4.create()

	}

	updateViewMatrix() {

		mat4.lookAt( this.viewMatrix, this.position, this.lookAt, this.upVector )

	}

}

module.exports = Camera
