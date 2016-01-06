'use strict';

class SkinningFrame {

	constructor() {

		this.targetJoints = {};

	}

	addJointFrames( joint, channelPath, animData ) {

		if ( this.targetJoints[ joint ] === undefined ) {

			this.targetJoints[ joint ] = {};

		}

		this.targetJoints[ joint ][ channelPath ] = animData;

	}

	getFrames( joint, channelPath, frameNo ) {

		var frames = null;
		var dat = this.targetJoints[ joint ][ channelPath ];
		var [ o1, o2 ] = [ 3 * frameNo, 4 * frameNo ];

		switch( channelPath ) {

			case 'rotation':
				frames = dat.slice( o2, o2 + 4 );
				break;

			case 'translation':
				frames = dat.slice( o1, o2 + 3 );
				break;

			case 'scale':
				frames = dat.slice( o1, o2 + 3 );
				break;

			default:
				console.warn( 'unknown channel path' );

		}

		return frames;

	}

}

module.exports = SkinningFrame;
