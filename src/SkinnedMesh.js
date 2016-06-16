'use strict';

var Mesh = require( './Mesh' );

class SkinnedMesh {

	constructor( geometry, skeleton, shader ) {

		this.skeleton = skeleton;
		this.prepareShader( shader );
		this.mesh = new Mesh( geometry, shader );

	}

	prepareShader( shader ) {

		// assume that this.skeleton. ... is not null;
		shader.uniforms.inverseBindMatrices = { type: 'm4', value: this.skeleton.inverseBindMatrices };
		shader.uniforms.jointMatrices = { type: 'm4', value: this.skeleton.jointMatrices };

	}

	applySkinningFrame( skinningFrame, frameNo ) {

		/*
		for each joint in skeleton.skeletons
			call fn joint.setMatrix( skinningFrame ) {
				set joint.matrix to corrsponding skinningFrame
				update jointMesh
			}
		call skeleton.computeJointMatrices
		*/

		this.skeleton.skeleton.forEach( joint => {

			var s = skinningFrame.getFrames( joint.name, 'scale', frameNo );
			var r = skinningFrame.getFrames( joint.name, 'rotation', frameNo );
			var t = skinningFrame.getFrames( joint.name, 'translation', frameNo );

			joint.setMatrixFromSRT( s, r, t );

		} );

		this.skeleton.computeJointMatrices();

	}

}

module.exports = SkinnedMesh;
