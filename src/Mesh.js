'use strict';

let vec3 = require( 'src/Math/vec3' );
let mat4 = require( 'src/Math/mat4' );
let quat = require( 'src/Math/quat' );

class Mesh {

	constructor( geometry, shader ) {

		this._initialized = false;

		this.geometry = geometry;
		this.shader = shader;

		this.position = vec3.create();
		this.scale = vec3.fromValues( 1.0, 1.0, 1.0 );
		this.quaternion = quat.create();
		this.modelMatrix = mat4.create();

	}

	updateModelMatrix() {

		// todo static variable ( closure )
		var m4rt = mat4.create();
		var m4s = mat4.create();

		mat4.identity( m4s );
		mat4.scale( m4s, m4s, this.scale );
		mat4.fromRotationTranslation( m4rt, this.quaternion, this.position );
		mat4.multiply( this.modelMatrix, m4rt, m4s );

	}

}

module.exports = Mesh;
