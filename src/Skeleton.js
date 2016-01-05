'use strict';

class Skeleton {

	constructor( name ) {

		this.name = name;
		this.skeleton = []; // ordered Joints
		this.bindShapeMatrix = null;
		this.inverseBindMatrices = null;
		this.root = [];
		this.jointMatrices = null;

	}

	addJoint( joint ) {

		this.skeleton.push( joint );

	}

	updateSkeletonMatrices() {

		this.root.forEach( root => root.updateMatrixHierarchy() );

	}

	computeJointMatrices() {

		if ( this.jointMatrices === null ) {

			this.jointMatrices = new Float32Array( this.skeleton.length * 16 );

		}

		this.updateSkeletonMatrices();

		this.skeleton.forEach( ( joint, i )  => {

			this.jointMatrices.set( joint.worldMatrix, i * 16 );

		} );

	}

}

module.exports = Skeleton;
