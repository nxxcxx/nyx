'use strict';

let mat4 = require( 'src/Math/mat4' );

class Node {

	constructor( name ) {

		this.name = name;
		this.children = {};
		this.modelMatrix = mat4.create();
		this.worldMatrix = mat4.create();

	}

	setMatrix( matrix ) {

		mat4.copy( this.modelMatrix, matrix );

		mat4.copy( this.worldMatrix, matrix );

	}

	setMatrixFromSRT( scaling, rotation, translation ) {

		var rt = mat4.create();
		mat4.identity( this.modelMatrix );
		mat4.scale( this.modelMatrix, this.modelMatrix, scaling );
		mat4.fromRotationTranslation( rt, rotation, translation );
		mat4.multiply( this.modelMatrix, this.modelMatrix, rt );

		mat4.copy( this.worldMatrix, this.modelMatrix );

	}

	updateMatrixHierarchy() {

		// recursively apply parent transformation to children
		Object.keys( this.children ).forEach( jointName => {

			var childJoint = this.children[ jointName ];
			// this is wrong, matrix multiplication is not commutative
			// mat4.multiply( childJoint.worldMatrix, childJoint.modelMatrix, this.worldMatrix );
			mat4.multiply( childJoint.worldMatrix, this.worldMatrix, childJoint.modelMatrix );
			childJoint.updateMatrixHierarchy();

		} );

	}

}

module.exports = Node;
